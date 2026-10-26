import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listAllAircrafts } from '@/Redux/aircraft/aircraftThunks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, Eye, Edit, Trash2, ChevronLeft, ChevronRight, Plane, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Loader } from '@/components/common/Loader';
import { EmptyState } from '@/components/common/EmptyState';

const AircraftTable = ({ onViewDetails, onEdit, onDelete }) => {
  const dispatch = useDispatch();
  const {
    aircrafts = [],
    paginatedAircrafts,
    loading,
    error
  } = useSelector(state => state.aircraft || {});

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('code');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(listAllAircrafts());
  }, [dispatch]);

  const rawAircraftList = useMemo(() => {
    if (Array.isArray(aircrafts) && aircrafts.length > 0) return aircrafts;
    if (Array.isArray(paginatedAircrafts?.content)) return paginatedAircrafts.content;
    if (Array.isArray(paginatedAircrafts)) return paginatedAircrafts;
    return [];
  }, [aircrafts, paginatedAircrafts]);

  // Client-side filtering & sorting
  const filteredAircrafts = useMemo(() => {
    return rawAircraftList.filter(aircraft => {
      // Status filter
      if (statusFilter && statusFilter !== 'all') {
        if (String(aircraft.status || '').toUpperCase() !== statusFilter.toUpperCase()) {
          return false;
        }
      }
      // Search filter
      if (searchTerm && searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const code = String(aircraft.code || '').toLowerCase();
        const model = String(aircraft.model || '').toLowerCase();
        const mfr = String(aircraft.manufacturer || '').toLowerCase();
        if (!code.includes(q) && !model.includes(q) && !mfr.includes(q)) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      let valA = a[sortBy] ?? '';
      let valB = b[sortBy] ?? '';
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [rawAircraftList, statusFilter, searchTerm, sortBy, sortDirection]);

  // Pagination calculation
  const totalElements = filteredAircrafts.length;
  const totalPages = Math.max(1, Math.ceil(totalElements / pageSize));
  const safePage = Math.min(currentPage, totalPages - 1);

  const paginatedAircraftsList = useMemo(() => {
    const start = safePage * pageSize;
    return filteredAircrafts.slice(start, start + pageSize);
  }, [filteredAircrafts, safePage, pageSize]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) {
      return <ArrowUpDown className="h-3.5 w-3.5 ml-1 inline opacity-40" />;
    }
    return sortDirection === 'asc'
      ? <ArrowUp className="h-3.5 w-3.5 ml-1 inline text-primary font-bold" />
      : <ArrowDown className="h-3.5 w-3.5 ml-1 inline text-primary font-bold" />;
  };

  const getStatusBadge = (status) => {
    const s = String(status || 'ACTIVE').toUpperCase();
    switch (s) {
      case 'ACTIVE':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-950/60 dark:text-green-300 border-none font-medium text-xs">
            ACTIVE
          </Badge>
        );
      case 'MAINTENANCE':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-950/60 dark:text-yellow-300 border-none font-medium text-xs">
            MAINTENANCE
          </Badge>
        );
      case 'INACTIVE':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-950/60 dark:text-red-300 border-none font-medium text-xs">
            INACTIVE
          </Badge>
        );
      case 'RETIRED':
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 border-none font-medium text-xs">
            RETIRED
          </Badge>
        );
      default:
        return (
          <Badge className="bg-blue-100 text-blue-800 border-none font-medium text-xs">
            {s}
          </Badge>
        );
    }
  };

  if (loading && rawAircraftList.length === 0) {
    return <Loader message="Loading aircraft fleet data..." />;
  }

  if (error && rawAircraftList.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-destructive text-center py-6">
            <p className="font-semibold text-base">Error loading aircraft data</p>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
            <Button onClick={() => dispatch(listAllAircrafts())} className="mt-4" size="sm">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Plane className="h-5 w-5 text-primary" />
              Aircraft Fleet
            </CardTitle>
            <Badge variant="outline" className="font-semibold text-xs px-2.5 py-1">
              {totalElements} {totalElements === 1 ? 'aircraft' : 'aircraft'}
              {totalElements !== rawAircraftList.length && ` (of ${rawAircraftList.length})`}
            </Badge>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by code, model, or manufacturer..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(0);
                }}
                className="pl-9 h-9 text-sm"
              />
            </div>

            <Select
              value={statusFilter}
              onValueChange={(val) => {
                setStatusFilter(val);
                setCurrentPage(0);
              }}
            >
              <SelectTrigger className="w-full sm:w-48 h-9 text-sm">
                <Filter className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
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
        {totalElements === 0 ? (
          <EmptyState
            icon={Plane}
            title="No Aircraft Found"
            description={
              searchTerm || statusFilter !== 'all'
                ? "No aircraft match your current search or status filter"
                : "No aircraft have been registered in your fleet yet"
            }
          />
        ) : (
          <>
            {/* Table */}
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead
                      className="cursor-pointer font-semibold select-none text-foreground"
                      onClick={() => handleSort('code')}
                    >
                      <div className="flex items-center">
                        Code {getSortIcon('code')}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer font-semibold select-none text-foreground"
                      onClick={() => handleSort('model')}
                    >
                      <div className="flex items-center">
                        Model {getSortIcon('model')}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer font-semibold select-none text-foreground"
                      onClick={() => handleSort('manufacturer')}
                    >
                      <div className="flex items-center">
                        Manufacturer {getSortIcon('manufacturer')}
                      </div>
                    </TableHead>
                    <TableHead
                      className="text-center font-semibold select-none cursor-pointer text-foreground"
                      onClick={() => handleSort('seatingCapacity')}
                    >
                      <div className="flex items-center justify-center">
                        Total Seats {getSortIcon('seatingCapacity')}
                      </div>
                    </TableHead>
                    <TableHead className="text-center font-semibold text-foreground">Status</TableHead>
                    <TableHead className="text-center font-semibold text-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedAircraftsList.map((aircraft) => (
                    <TableRow key={aircraft.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-semibold text-foreground">
                        {aircraft.code}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{aircraft.model}</TableCell>
                      <TableCell className="text-muted-foreground">{aircraft.manufacturer}</TableCell>
                      <TableCell className="text-center font-medium">
                        {aircraft.seatingCapacity || aircraft.totalSeats || '-'}
                      </TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(aircraft.status)}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center items-center space-x-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            title="View Details"
                            onClick={() => onViewDetails(aircraft)}
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Edit Aircraft"
                            onClick={() => onEdit(aircraft)}
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Delete Aircraft"
                            onClick={() => onDelete(aircraft)}
                            className="h-8 w-8 p-0 text-destructive/80 hover:text-destructive hover:bg-destructive/10"
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

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-3 text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-muted-foreground text-xs">Rows per page:</span>
                <Select
                  value={pageSize.toString()}
                  onValueChange={(val) => {
                    setPageSize(Number(val));
                    setCurrentPage(0);
                  }}
                >
                  <SelectTrigger className="w-18 h-8 text-xs">
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

              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <span>
                  {totalElements === 0 ? 0 : safePage * pageSize + 1} -{' '}
                  {Math.min((safePage + 1) * pageSize, totalElements)} of {totalElements}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                  disabled={safePage <= 0 || loading}
                  className="h-8 text-xs"
                >
                  <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                  disabled={safePage >= totalPages - 1 || loading}
                  className="h-8 text-xs"
                >
                  Next
                  <ChevronRight className="h-3.5 w-3.5 ml-1" />
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
