import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MapPin, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// Redux actions
import {
  createCity,
  updateCity,
  deleteCity,
  getAllCities,
  searchCities,
  getCitiesByCountryCode,
  checkCityExists
} from '@/Redux/city/cityThunk';

// Components
import CityStatsCards from './components/CityStatsCards';
import CityToolbar from './components/CityToolbar';
import CityFilters from './components/CityFilters';
import CityTable from './components/CityTable';
import CityPagination from './components/CityPagination';
import CityFormModal from './components/CityFormModal';
import CityDeleteModal from './components/CityDeleteModal';
import CityNotification from './components/CityNotification';

// Utils
import { exportCitiesToCSV, downloadCSV } from './utils/cityHelpers';

const CityManagement = () => {
  const dispatch = useDispatch();
  const { cities, loading, error } = useSelector((state) => state.city);

  // Local state
  const [selectedCities, setSelectedCities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [showFilters, setShowFilters] = useState(false);
  const [showInactive, setShowInactive] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingCity, setEditingCity] = useState(null);
  const [deletingCity, setDeletingCity] = useState(null);
  const [notification, setNotification] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Helper functions
  const showNotification = useCallback((type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  }, []);

  const getStatistics = () => {
    if (!Array.isArray(cities)) {
      return { totalCities: 0, totalCountries: 0, totalTimezones: 0, issues: 0 };
    }
    return {
      totalCities: totalItems || cities.length,
      totalCountries: new Set(cities.map(c => c.countryCode)).size,
      totalTimezones: new Set(cities.map(c => c.timezoneOffset)).size,
      issues: 0
    };
  };

  const getFilterOptions = () => {
    if (!Array.isArray(cities)) {
      return { countries: [], timezones: [], regions: [] };
    }
    const countries = new Set();
    const timezones = new Set();
    const regions = new Set();
    cities.forEach(city => {
      if (city.countryName && city.countryCode) {
        countries.add(JSON.stringify({ name: city.countryName, code: city.countryCode }));
      }
      if (city.timezoneOffset) timezones.add(city.timezoneOffset);
      if (city.regionCode) regions.add(city.regionCode);
    });
    return {
      countries: Array.from(countries).map(country => JSON.parse(country)),
      timezones: Array.from(timezones),
      regions: Array.from(regions)
    };
  };

  // Load cities with API pagination
  const loadCities = useCallback(async () => {
    try {
      const params = {
        page: currentPage - 1, // API uses 0-based pagination
        size: itemsPerPage,
        sortBy: sortField,
        sortDirection
      };

      let result;
      if (searchQuery) {
        result = await dispatch(searchCities({ keyword: searchQuery, ...params })).unwrap();
      } else if (filters.country) {
        result = await dispatch(getCitiesByCountryCode({ countryCode: filters.country, ...params })).unwrap();
      } else {
        result = await dispatch(getAllCities(params)).unwrap();
      }

      // Handle paginated response
      if (result && typeof result === 'object') {
        if (result.content) {
          // Spring Boot pagination format
          setTotalPages(result.totalPages || 1);
          setTotalItems(result.totalElements || 0);
        } else if (Array.isArray(result)) {
          // Simple array response
          setTotalPages(Math.ceil(result.length / itemsPerPage));
          setTotalItems(result.length);
        }
      }
    } catch (err) {
      console.error('Error loading cities:', err);
      showNotification('error', err.message || 'Failed to load cities');
    }
  }, [dispatch, currentPage, itemsPerPage, sortField, sortDirection, searchQuery, filters.country, showNotification]);

  // Event handlers
  const handleAddCity = async (cityData) => {
    try {
      await dispatch(createCity(cityData)).unwrap();
      closeModals();
      showNotification('success', `City "${cityData.name}" created successfully`);
      await loadCities();
    } catch (error) {
      console.error('Error adding city:', error);
      showNotification('error', error.message || 'Failed to create city');
    }
  };

  const handleEditCity = async (cityData) => {
    try {
      await dispatch(updateCity({ id: editingCity.id, data: cityData })).unwrap();
      closeModals();
      showNotification('success', `City "${cityData.name}" updated successfully`);
      await loadCities();
    } catch (error) {
      console.error('Error updating city:', error);
      showNotification('error', error.message || 'Failed to update city');
    }
  };

  const handleDeleteCity = async (cityId) => {
    try {
      const city = cities.find(c => c.id === cityId);
      await dispatch(deleteCity(cityId)).unwrap();
      closeModals();
      setSelectedCities(prev => prev.filter(id => id !== cityId));
      showNotification('success', `City "${city?.name}" deleted successfully`);
      await loadCities();
    } catch (error) {
      console.error('Error deleting city:', error);
      showNotification('error', error.message || 'Failed to delete city');
    }
  };

  const checkCityCodeExists = async (cityCode, currentCityId = null) => {
    try {
      if (currentCityId) {
        const existingCity = cities.find(city => city.cityCode === cityCode);
        if (existingCity && existingCity.id !== currentCityId) {
          return { exists: true, error: 'City code already exists' };
        }
        return { exists: false };
      }
      const result = await dispatch(checkCityExists(cityCode)).unwrap();
      return { exists: !!result };
    } catch (err) {
      return { exists: false };
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
    const currentPageIds = cities.map(city => city.id);
    const allSelected = currentPageIds.every(id => selectedCities.includes(id));
    if (allSelected) {
      setSelectedCities(prev => prev.filter(id => !currentPageIds.includes(id)));
    } else {
      setSelectedCities(prev => [...new Set([...prev, ...currentPageIds])]);
    }
  };

  const handleSelectCity = (cityId) => {
    setSelectedCities(prev => {
      if (prev.includes(cityId)) {
        return prev.filter(id => id !== cityId);
      } else {
        return [...prev, cityId];
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
    setEditingCity(null);
    setShowAddModal(true);
  };

  const openEditModal = (city) => {
    setEditingCity(city);
    setShowEditModal(true);
  };

  const openDeleteModal = (city) => {
    setDeletingCity(city);
    setShowDeleteModal(true);
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setEditingCity(null);
    setDeletingCity(null);
  };

  const resetFilters = () => {
    setFilters({});
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleExport = () => {
    try {
      if (cities.length === 0) {
        showNotification('warning', 'No cities to export');
        return;
      }
      const csvContent = exportCitiesToCSV(cities);
      downloadCSV(csvContent, `cities_${new Date().toISOString().split('T')[0]}.csv`);
      showNotification('success', `Exported ${cities.length} cities successfully`);
    } catch (error) {
      console.error('Export error:', error);
      showNotification('error', 'Failed to export cities');
    }
  };

  const handleImport = () => {
    showNotification('info', 'Import functionality will be available soon');
  };

  // Load cities on mount and when dependencies change
  useEffect(() => {
    loadCities();
  }, [currentPage, itemsPerPage, sortField, sortDirection]);

  // Debounced search and filter
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadCities();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, filters]);

  if (error && cities.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-600 mb-2">Error loading cities</div>
          <div className="text-sm text-gray-500 mb-4">{error}</div>
          <Button onClick={loadCities} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Notification */}
      <CityNotification
        notification={notification}
        onClose={() => setNotification(null)}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-blue-600" />
            City Management
          </h1>
          <p className="text-gray-600">Manage cities, codes, and regional data across the platform</p>
        </div>
        <Button onClick={openAddModal} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add City
        </Button>
      </div>

      {/* Statistics Cards */}
      <CityStatsCards statistics={getStatistics()} />

      {/* Search & Filter Toolbar */}
      <CityToolbar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onExport={handleExport}
        onImport={handleImport}
        showInactive={showInactive}
        onToggleInactive={setShowInactive}
      />

      {/* Advanced Filters */}
      <CityFilters
        isVisible={showFilters}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onReset={resetFilters}
        countries={getFilterOptions().countries}
        timezones={getFilterOptions().timezones}
        regions={getFilterOptions().regions}
      />

      {/* Cities Table */}
      <Card>
        <CardContent className="p-0">
          <CityTable
            cities={cities || []}
            selectedCities={selectedCities}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            onSelectAll={handleSelectAll}
            onSelectCity={handleSelectCity}
            onEdit={openEditModal}
            onDelete={openDeleteModal}
            loading={loading}
          />

          {/* Pagination */}
          <div className="px-6">
            <CityPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <CityFormModal
        isOpen={showAddModal}
        onClose={closeModals}
        onSubmit={handleAddCity}
        isLoading={loading}
        checkCityCodeExists={checkCityCodeExists}
      />

      <CityFormModal
        isOpen={showEditModal}
        onClose={closeModals}
        onSubmit={handleEditCity}
        city={editingCity}
        isLoading={loading}
        checkCityCodeExists={checkCityCodeExists}
      />

      <CityDeleteModal
        isOpen={showDeleteModal}
        onClose={closeModals}
        onConfirm={handleDeleteCity}
        city={deletingCity}
        isLoading={loading}
      />
    </div>
  );
};

export default CityManagement;