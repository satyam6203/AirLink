import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Plane, 
  MapPin, 
  Users, 
  CheckCircle2, 
  LayoutGrid, 
  List, 
  ArrowRight,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Calendar
} from 'lucide-react';
import { deleteFlight, getFlightsByAirline } from '@/Redux/flight/flightThunk';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import FlightCard from './FlightCard';

const FlightManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { flights = [], loading, error } = useSelector(state => state.flight || {});

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [routeFilter, setRouteFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  useEffect(() => {
    dispatch(getFlightsByAirline());
  }, [dispatch]);

  const rawFlightList = useMemo(() => {
    return Array.isArray(flights) ? flights : [];
  }, [flights]);

  // Extract unique routes dynamically
  const uniqueRoutes = useMemo(() => {
    const routesSet = new Set();
    rawFlightList.forEach(f => {
      const dep = f.departureAirport?.iataCode;
      const arr = f.arrivalAirport?.iataCode;
      if (dep && arr) {
        routesSet.add(`${dep}-${arr}`);
      }
    });
    return Array.from(routesSet);
  }, [rawFlightList]);

  // Dynamic quick stats
  const stats = useMemo(() => {
    const totalFlights = rawFlightList.length;
    const activeFlights = rawFlightList.filter(f => {
      const s = String(f.status ?? 'SCHEDULED').toUpperCase();
      return s === 'SCHEDULED' || s === 'ACTIVE' || s === 'IN_AIR' || s === 'BOARDING' || s === '0';
    }).length;

    const totalSeats = rawFlightList.reduce((sum, f) => {
      return sum + Number(f.aircraft?.seatingCapacity || f.aircraft?.totalSeats || 0);
    }, 0);

    const totalBooked = rawFlightList.reduce((sum, f) => {
      const cap = Number(f.aircraft?.seatingCapacity || f.aircraft?.totalSeats || 0);
      const avail = Number(f.totalAvailableSeats ?? cap);
      return sum + Math.max(0, cap - avail);
    }, 0);

    const avgOccupancy = totalSeats > 0 ? Math.round((totalBooked / totalSeats) * 100) : 0;

    return { totalFlights, activeFlights, totalSeats, avgOccupancy };
  }, [rawFlightList]);

  // Client-side filtering
  const filteredFlights = useMemo(() => {
    return rawFlightList.filter(f => {
      // Status filter
      if (statusFilter && statusFilter !== 'all') {
        const s = String(f.status ?? 'SCHEDULED').toUpperCase();
        if (statusFilter === 'SCHEDULED') {
          if (s !== 'SCHEDULED' && s !== '0') return false;
        } else if (s !== statusFilter.toUpperCase()) {
          return false;
        }
      }

      // Route filter
      if (routeFilter && routeFilter !== 'all') {
        const [dep, arr] = routeFilter.split('-');
        if (f.departureAirport?.iataCode !== dep || f.arrivalAirport?.iataCode !== arr) {
          return false;
        }
      }

      // Search term
      if (searchTerm && searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const fn = String(f.flightNumber || '').toLowerCase();
        const depCode = String(f.departureAirport?.iataCode || '').toLowerCase();
        const arrCode = String(f.arrivalAirport?.iataCode || '').toLowerCase();
        const depCity = String(f.departureAirport?.city?.name || '').toLowerCase();
        const arrCity = String(f.arrivalAirport?.city?.name || '').toLowerCase();
        const acCode = String(f.aircraft?.code || '').toLowerCase();
        const acModel = String(f.aircraft?.model || '').toLowerCase();

        return (
          fn.includes(q) ||
          depCode.includes(q) ||
          arrCode.includes(q) ||
          depCity.includes(q) ||
          arrCity.includes(q) ||
          acCode.includes(q) ||
          acModel.includes(q)
        );
      }

      return true;
    });
  }, [rawFlightList, statusFilter, routeFilter, searchTerm]);

  const handleDeleteFlight = async (flightId) => {
    try {
      await dispatch(deleteFlight(flightId)).unwrap();
      dispatch(getFlightsByAirline());
    } catch (error) {
      console.error('Error deleting flight:', error);
      alert(typeof error === 'string' ? error : 'Failed to delete flight');
    }
  };

  const handleAddNewFlight = () => {
    navigate('/airline/flights/new');
  };

  const handleViewFlight = (flight) => {
    navigate(`/airline/flights/${flight.id}`);
  };

  const handleEditFlight = (flight) => {
    navigate(`/airline/flights/${flight.id}/edit`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-bold text-foreground tracking-tight">Flight Management</h2>
            <Badge variant="outline" className="font-semibold text-xs px-2.5 py-0.5">
              {filteredFlights.length} {filteredFlights.length === 1 ? 'flight' : 'flights'}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm mt-0.5">
            Manage your airline's scheduled flight routes, aircraft assignments, and operations
          </p>
        </div>

        <Button onClick={handleAddNewFlight} className="flex items-center gap-2 shadow-sm">
          <Plus className="h-4 w-4" />
          Schedule New Flight
        </Button>
      </div>

      {/* Dynamic Summary Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Flights */}
        <Card className="border border-blue-200 dark:border-blue-900 bg-gradient-to-br from-blue-50/70 to-blue-100/50 dark:from-blue-950/40 dark:to-blue-900/20 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wider">Total Flights</p>
              <p className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-0.5">{stats.totalFlights}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-500/10 dark:bg-blue-400/20 flex items-center justify-center text-blue-600 dark:text-blue-300">
              <Plane className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* Active Flights */}
        <Card className="border border-green-200 dark:border-green-900 bg-gradient-to-br from-green-50/70 to-green-100/50 dark:from-green-950/40 dark:to-green-900/20 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-green-700 dark:text-green-300 uppercase tracking-wider">Active / Scheduled</p>
              <p className="text-2xl font-extrabold text-green-600 dark:text-green-400 mt-0.5">{stats.activeFlights}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-500/10 dark:bg-green-400/20 flex items-center justify-center text-green-600 dark:text-green-300">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* Total Seats */}
        <Card className="border border-purple-200 dark:border-purple-900 bg-gradient-to-br from-purple-50/70 to-purple-100/50 dark:from-purple-950/40 dark:to-purple-900/20 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wider">Total Capacity</p>
              <p className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 mt-0.5">{stats.totalSeats.toLocaleString('en-IN')}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-purple-500/10 dark:bg-purple-400/20 flex items-center justify-center text-purple-600 dark:text-purple-300">
              <Users className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* Avg Occupancy */}
        <Card className="border border-orange-200 dark:border-orange-900 bg-gradient-to-br from-orange-50/70 to-orange-100/50 dark:from-orange-950/40 dark:to-orange-900/20 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-orange-700 dark:text-orange-300 uppercase tracking-wider">Avg Occupancy</p>
              <p className="text-2xl font-extrabold text-orange-600 dark:text-orange-400 mt-0.5">{stats.avgOccupancy}%</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-orange-500/10 dark:bg-orange-400/20 flex items-center justify-center text-orange-600 dark:text-orange-300">
              <TrendingUp className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search, Filters, and View Switcher */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by flight #, airport, city, aircraft..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-44 h-9 text-sm">
                <Filter className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="BOARDING">Boarding</SelectItem>
                <SelectItem value="IN_AIR">In Air</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="DELAYED">Delayed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            {/* Route Filter */}
            <Select value={routeFilter} onValueChange={setRouteFilter}>
              <SelectTrigger className="w-full md:w-48 h-9 text-sm">
                <MapPin className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Route" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Routes</SelectItem>
                {uniqueRoutes.map(route => {
                  const [from, to] = route.split('-');
                  return (
                    <SelectItem key={route} value={route}>
                      {from} → {to}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            {/* View Mode Toggle */}
            <div className="flex items-center border rounded-lg p-0.5 self-end md:self-auto bg-muted/40">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="h-7 px-2.5 text-xs gap-1"
                title="Card View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Cards</span>
              </Button>
              <Button
                variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
                className="h-7 px-2.5 text-xs gap-1"
                title="Table View"
              >
                <List className="w-3.5 h-3.5" />
                <span>Table</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Flight List Content */}
      {filteredFlights.length === 0 ? (
        <Card className="shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Plane className="w-12 h-12 text-muted-foreground opacity-30 mb-3" />
            <h3 className="text-base font-bold text-foreground">No Flights Found</h3>
            <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-4">
              {searchTerm || statusFilter !== 'all' || routeFilter !== 'all'
                ? "No flights match your current search and filter criteria."
                : "You have not scheduled any flights yet. Assign aircraft to routes to get started."}
            </p>
            {searchTerm || statusFilter !== 'all' || routeFilter !== 'all' ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setRouteFilter('all');
                }}
              >
                Reset Filters
              </Button>
            ) : (
              <Button onClick={handleAddNewFlight} size="sm">
                <Plus className="h-4 w-4 mr-1.5" />
                Schedule Your First Flight
              </Button>
            )}
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        /* Card Grid View */
        <div className="space-y-4">
          {filteredFlights.map((flight) => (
            <FlightCard
              key={flight.id || flight.flightNumber}
              flight={flight}
              onEdit={handleEditFlight}
              onDelete={handleDeleteFlight}
              onView={handleViewFlight}
            />
          ))}
        </div>
      ) : (
        /* Table View */
        <Card className="shadow-sm">
          <CardContent className="p-0">
            <div className="rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead className="font-semibold text-foreground">Flight Number</TableHead>
                    <TableHead className="font-semibold text-foreground">Route</TableHead>
                    <TableHead className="font-semibold text-foreground">Aircraft</TableHead>
                    <TableHead className="font-semibold text-foreground text-center">Seats (Avail/Total)</TableHead>
                    <TableHead className="font-semibold text-foreground text-center">Starting Fare</TableHead>
                    <TableHead className="font-semibold text-foreground text-center">Status</TableHead>
                    <TableHead className="font-semibold text-foreground text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFlights.map((flight) => {
                    const total = Number(flight.aircraft?.seatingCapacity || flight.aircraft?.totalSeats || 0);
                    const avail = Number(flight.totalAvailableSeats ?? total);
                    const rawStatus = flight.status === 0 || flight.status === '0' ? 'SCHEDULED' : (flight.status || 'SCHEDULED');
                    return (
                      <TableRow key={flight.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-bold text-foreground">
                          {flight.flightNumber}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 font-semibold text-sm">
                            <span>{flight.departureAirport?.iataCode || 'DEP'}</span>
                            <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                            <span>{flight.arrivalAirport?.iataCode || 'ARR'}</span>
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {flight.departureAirport?.city?.name} → {flight.arrivalAirport?.city?.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-foreground text-sm">
                            {flight.aircraft?.code || 'Unassigned'}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {flight.aircraft?.manufacturer} {flight.aircraft?.model}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="font-semibold text-foreground">{avail}</span>
                          <span className="text-muted-foreground text-xs"> / {total}</span>
                        </TableCell>
                        <TableCell className="text-center font-medium">
                          {flight.lowestPrice ? `₹${Number(flight.lowestPrice).toLocaleString('en-IN')}` : 'Standard'}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className={
                            String(rawStatus).toUpperCase() === 'SCHEDULED'
                              ? "bg-green-100 text-green-800 dark:bg-green-950/60 dark:text-green-300 border-none text-xs"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-none text-xs"
                          }>
                            {rawStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewFlight(flight)}
                              className="h-8 w-8 p-0"
                              title="View Flight"
                            >
                              <Eye className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditFlight(flight)}
                              className="h-8 w-8 p-0"
                              title="Edit Flight"
                            >
                              <Edit className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete flight ${flight.flightNumber}?`)) {
                                  handleDeleteFlight(flight.id);
                                }
                              }}
                              className="h-8 w-8 p-0 text-destructive/80 hover:text-destructive hover:bg-destructive/10"
                              title="Delete Flight"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FlightManagement;
