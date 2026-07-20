import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listAllAircrafts, deleteAircraft } from '@/Redux/aircraft/aircraftThunks';
import { setSearchKeyword, setStatusFilter, setCurrentPage, setPageSize, setSortBy, setSortDirection } from '@/Redux/aircraft/aircraftSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, Eye, Edit, Trash2, ChevronLeft, ChevronRight, Plane } from 'lucide-react';
import { Loader } from '@/components/common/Loader';
import { EmptyState } from '@/components/common/EmptyState';

const AircraftTable = ({ onViewDetails, onEdit, onDelete }) => {
  const dispatch = useDispatch();
  const {
    aircrafts,
    paginatedAircrafts,
    loading,
    error,
    searchKeyword,
    statusFilter,
    currentPage,
    pageSize,
    sortBy,
    sortDirection
  } = useSelector(state => state.aircraft);

  const [localSearchTerm, setLocalSearchTerm] = useState(searchKeyword);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(setSearchKeyword(localSearchTerm));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [localSearchTerm, dispatch]);

  useEffect(() => {
    dispatch(listAllAircrafts({
      page: currentPage,
      size: pageSize,
      search: searchKeyword,
      status: statusFilter !== 'all' ? statusFilter : undefined,
      sortBy,
      sortDirection
    }));
  }, [dispatch, currentPage, pageSize, searchKeyword, statusFilter, sortBy, sortDirection]);

  const handleSort = (field) => {
    if (sortBy === field) {
      dispatch(setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc'));
    } else {
      dispatch(setSortBy(field));
      dispatch(setSortDirection('asc'));
    }
  };

  const handlePageChange = (newPage) => {
    dispatch(setCurrentPage(newPage));
  };

  const handlePageSizeChange = (newSize) => {
    dispatch(setPageSize(parseInt(newSize)));
    dispatch(setCurrentPage(0));
  };

  const handleStatusFilterChange = (status) => {
    dispatch(setStatusFilter(status));
    dispatch(setCurrentPage(0));
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'retired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  if (loading && !paginatedAircrafts?.content?.length) {
    return <Loader message="Loading aircraft data..." />;
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-red-600 text-center">
            <p>Error loading aircraft data: {error}</p>
            <Button onClick={() => window.location.reload()} className="mt-2">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Plane className="h-5 w-5" />
              Aircraft Fleet
            </CardTitle>
            <Badge variant="outline">
              {paginatedAircrafts.totalElements} total aircraft
            </Badge>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by code, model, or manufacturer..."
                value={localSearchTerm}
                onChange={(e) => setLocalSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="RETIRED">Retired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {paginatedAircrafts?.content?.length === 0 ? (
          <EmptyState
            icon={Plane}
            title="No Aircraft Found"
            description={
              searchKeyword || statusFilter !== 'all'
                ? "No aircraft match your current search criteria"
                : "No aircraft have been added to your fleet yet"
            }
          />
        ) : (
          <>
            {/* Table */}
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort('code')}
                    >
                      Code {getSortIcon('code')}
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort('model')}
                    >
                      Model {getSortIcon('model')}
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort('manufacturer')}
                    >
                      Manufacturer {getSortIcon('manufacturer')}
                    </TableHead>
                    <TableHead className="text-center">Total Seats</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {aircrafts.map((aircraft) => (
                    <TableRow key={aircraft.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{aircraft.code}</TableCell>
                      <TableCell>{aircraft.model}</TableCell>
                      <TableCell>{aircraft.manufacturer}</TableCell>
                      <TableCell className="text-center">
                        {aircraft.seatingCapacity || aircraft.totalSeats || '-'}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={getStatusColor(aircraft.status)}>
                          {aircraft.status || 'Unknown'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onViewDetails(aircraft)}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(aircraft)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(aircraft)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Rows per page:</span>
                <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {paginatedAircrafts.first ? 1 : currentPage * pageSize + 1} - {' '}
                  {Math.min((currentPage + 1) * pageSize, paginatedAircrafts.totalElements)} of{' '}
                  {paginatedAircrafts.totalElements}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={paginatedAircrafts.first || loading}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={paginatedAircrafts.last || loading}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AircraftTable;