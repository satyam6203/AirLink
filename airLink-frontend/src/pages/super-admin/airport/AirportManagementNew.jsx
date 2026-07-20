import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Plane, Plus, Filter, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// Redux actions
import {

  deleteAirport,
  listAllAirports,

} from '@/Redux/airport/airportThunk';
import { getAllCities } from '@/Redux/city/cityThunk';

// Components
import AirportStatsCards from './components/AirportStatsCards';
import AirportToolbar from './components/AirportToolbar';
import AirportFilters from './components/AirportFilters';
import AirportTable from './components/AirportTable';
import AirportPagination from './components/AirportPagination';
import AirportDeleteModal from './components/AirportDeleteModal';
import AirportNotification from './components/AirportNotification';

const AirportManagementNew = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { airports, loading, error } = useSelector((state) => state.airport);


  // Local state
  const [selectedAirports, setSelectedAirports] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [showFilters, setShowFilters] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingAirport, setDeletingAirport] = useState(null);
  const [notification, setNotification] = useState(null);

  // Helper functions
  const showNotification = useCallback((type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  }, []);

  const getStatistics = () => {
    if (!Array.isArray(airports)) {
      return { totalAirports: 0, totalCountries: 0, totalTimezones: 0, activeAirports: 0 };
    }
    return {
      totalAirports: airports.length,
      totalCountries: new Set(airports.map(a => a.address?.countryName).filter(Boolean)).size,
      totalTimezones: new Set(airports.map(a => a.timeZone).filter(Boolean)).size,
      activeAirports: airports.filter(a => a.status === 'Active').length
    };
  };

  const getFilterOptions = () => {
    if (!Array.isArray(airports)) {
      return { countries: [], timezones: [], cities: [] };
    }
    const countries = new Set();
    const timezones = new Set();
    const airportCities = new Set();

    airports.forEach(airport => {
      if (airport.address?.countryName) countries.add(airport.address.countryName);
      if (airport.timeZone) timezones.add(airport.timeZone);
      if (airport.city?.name) airportCities.add(airport.city.name);
    });

    return {
      countries: Array.from(countries),
      timezones: Array.from(timezones),
      cities: Array.from(airportCities)
    };
  };

  // Load airports
  const loadAirports = useCallback(async () => {
    try {
      await dispatch(listAllAirports()).unwrap();
    } catch (err) {
      console.error('Error loading airports:', err);
      showNotification('error', err.message || 'Failed to load airports');
    }
  }, [dispatch, showNotification]);

  // Load cities for dropdown
  const loadCities = useCallback(async () => {
    try {
      await dispatch(getAllCities()).unwrap();
    } catch (err) {
      console.error('Error loading cities:', err);
    }
  }, [dispatch]);

  // Filter and sort airports
  const getFilteredAndSortedAirports = () => {
    let filtered = [...(airports || [])];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(airport =>
        airport.name?.toLowerCase().includes(query) ||
        airport.iataCode?.toLowerCase().includes(query) ||
        airport.detailedName?.toLowerCase().includes(query) ||
        airport.city?.name?.toLowerCase().includes(query) ||
        airport.address?.countryName?.toLowerCase().includes(query)
      );
    }

    // Apply filters
    if (filters.country) {
      filtered = filtered.filter(airport => airport.address?.countryName === filters.country);
    }
    if (filters.timezone) {
      filtered = filtered.filter(airport => airport.timeZone === filters.timezone);
    }
    if (filters.city) {
      filtered = filtered.filter(airport => airport.city?.name === filters.city);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortField] || '';
      let bValue = b[sortField] || '';

      if (sortField === 'city') {
        aValue = a.city?.name || '';
        bValue = b.city?.name || '';
      } else if (sortField === 'country') {
        aValue = a.address?.countryName || '';
        bValue = b.address?.countryName || '';
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  };

  // Get paginated airports
  const getPaginatedAirports = () => {
    const filtered = getFilteredAndSortedAirports();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedAirports = filtered.slice(startIndex, endIndex);

    return {
      paginatedAirports,
      totalPages: Math.ceil(filtered.length / itemsPerPage),
      totalItems: filtered.length
    };
  };

  // Event handlers

  const handleDeleteAirport = async (airportId) => {
    try {
      const airport = airports.find(a => a.id === airportId);
      await dispatch(deleteAirport(airportId)).unwrap();
      closeModals();
      setSelectedAirports(prev => prev.filter(id => id !== airportId));
      showNotification('success', `Airport "${airport?.name}" deleted successfully`);
      await loadAirports();
    } catch (error) {
      console.error('Error deleting airport:', error);
      showNotification('error', error.message || 'Failed to delete airport');
    }
  };



  // UI handlers
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const handleSelectAll = () => {
    const { paginatedAirports } = getPaginatedAirports();
    const currentPageIds = paginatedAirports.map(airport => airport.id);
    const allSelected = currentPageIds.every(id => selectedAirports.includes(id));
    if (allSelected) {
      setSelectedAirports(prev => prev.filter(id => !currentPageIds.includes(id)));
    } else {
      setSelectedAirports(prev => [...new Set([...prev, ...currentPageIds])]);
    }
  };

  const handleSelectAirport = (airportId) => {
    setSelectedAirports(prev => {
      if (prev.includes(airportId)) {
        return prev.filter(id => id !== airportId);
      } else {
        return [...prev, airportId];
      }
    });
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  const openAddModal = () => {
    navigate('/super-admin/airports/new');
  };

  const openEditModal = (airport) => {
    navigate(`/super-admin/airports/${airport.id}/edit`);
  };

  const openDeleteModal = (airport) => {
    setDeletingAirport(airport);
    setShowDeleteModal(true);
  };

  const closeModals = () => {
    setShowDeleteModal(false);
    setDeletingAirport(null);
  };

  const resetFilters = () => {
    setFilters({});
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleExport = () => {
    showNotification('info', 'Export functionality will be available soon');
  };

  const handleImport = () => {
    showNotification('info', 'Import functionality will be available soon');
  };

  // Load data on mount
  useEffect(() => {
    loadAirports();
    loadCities();
  }, [loadAirports, loadCities]);

  if (error && airports.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-600 mb-2">Error loading airports</div>
          <div className="text-sm text-gray-500 mb-4">{error}</div>
          <Button onClick={loadAirports} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const paginationData = getPaginatedAirports();

  return (
    <div className="space-y-6">
      {/* Notification */}
      <AirportNotification
        notification={notification}
        onClose={() => setNotification(null)}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Plane className="w-6 h-6 text-blue-600" />
            Airport Management
          </h1>
          <p className="text-gray-600">Manage airports, codes, and location data across the platform</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleExport} variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button onClick={handleImport} variant="outline" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Import
          </Button>
          <Button onClick={openAddModal} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Airport
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <AirportStatsCards statistics={getStatistics()} />

      {/* Search & Filter Toolbar */}
      <AirportToolbar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onExport={handleExport}
        onImport={handleImport}
      />

      {/* Advanced Filters */}
      <AirportFilters
        isVisible={showFilters}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onReset={resetFilters}
        countries={getFilterOptions().countries}
        timezones={getFilterOptions().timezones}
        cities={getFilterOptions().cities}
      />

      {/* Airport Table */}
      <Card>
        <CardContent className="p-0">
          <AirportTable
            airports={paginationData.paginatedAirports}
            selectedAirports={selectedAirports}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            onSelectAll={handleSelectAll}
            onSelectAirport={handleSelectAirport}
            onEdit={openEditModal}
            onDelete={openDeleteModal}
            loading={loading}
          />

          {/* Pagination */}
          <div className="px-6">
            <AirportPagination
              currentPage={currentPage}
              totalPages={paginationData.totalPages}
              totalItems={paginationData.totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* Delete Modal */}
      <AirportDeleteModal
        isOpen={showDeleteModal}
        onClose={closeModals}
        onConfirm={handleDeleteAirport}
        airport={deletingAirport}
        isLoading={loading}
      />
    </div>
  );
};

export default AirportManagementNew;