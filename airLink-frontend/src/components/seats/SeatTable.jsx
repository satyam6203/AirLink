import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Eye,
  Edit,
  Lock,
  Unlock,
  User,
  UserX,
  MapPin,
  DollarSign,
  Utensils,
  Calendar,
  Hash,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  RefreshCw,
  MoreHorizontal,
  Plane
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/formateCurrency';
import { getSeatIcon } from '@/utils/seatIcon';

const SeatTable = ({ seats = [], cabin, onSeatAction }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [seatTypeFilter, setSeatTypeFilter] = useState('all');
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [showSeatDetails, setShowSeatDetails] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'seatNumber', direction: 'asc' });

  // Filter and sort seats
  const filteredAndSortedSeats = useMemo(() => {
    let filtered = [...seats];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(seat =>
        seat.seatNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (seat.passengerName && seat.passengerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (seat.bookingReference && seat.bookingReference.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (seat.passengerId && seat.passengerId.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(seat => seat.status.toLowerCase() === statusFilter);
    }

    // Apply seat type filter
    if (seatTypeFilter !== 'all') {
      filtered = filtered.filter(seat => seat.seatType.toLowerCase() === seatTypeFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === 'seatNumber') {
        const aNum = parseInt(aValue.replace(/[A-Z]/g, ''));
        const bNum = parseInt(bValue.replace(/[A-Z]/g, ''));
        aValue = aNum;
        bValue = bNum;
      }

      if (sortConfig.key === 'fare') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [seats, searchQuery, statusFilter, seatTypeFilter, sortConfig]);

  const getSeatStats = () => {
    const total = seats.length;
    const available = seats.filter(s => s.status === 'AVAILABLE').length;
    const booked = seats.filter(s => s.status === 'BOOKED').length;
    const blocked = seats.filter(s => s.status === 'BLOCKED').length;
    const revenue = seats
      .filter(s => s.status === 'BOOKED')
      .reduce((sum, s) => sum + (parseFloat(s.fare) || 0), 0);
    const occupancyRate = total > 0 ? Math.round((booked / total) * 100) : 0;

    return { total, available, booked, blocked, revenue, occupancyRate };
  };

  const stats = getSeatStats();

  const getStatusBadge = (status) => {
    const configs = {
      AVAILABLE: {
        className: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle,
        label: "Available"
      },
      BOOKED: {
        className: "bg-blue-100 text-blue-800 border-blue-200",
        icon: User,
        label: "Booked"
      },
      BLOCKED: {
        className: "bg-red-100 text-red-800 border-red-200",
        icon: XCircle,
        label: "Blocked"
      }
    };

    const config = configs[status] || configs.AVAILABLE;
    const StatusIcon = config.icon;

    return (
      <Badge className={cn("flex items-center gap-1 border", config.className)}>
        <StatusIcon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getSeatTypeIcon = (seat) => {
    const icon = getSeatIcon(seat);
    return (
      <span className="text-lg mr-2" title={seat.seatType}>
        {icon}
      </span>
    );
  };

  const handleSort = (key) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSeatAction = (seat, action) => {
    console.log(`Performing ${action} on seat ${seat.seatNumber}`);
    onSeatAction?.(seat, action);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setSeatTypeFilter('all');
  };

  const exportSeats = () => {
    const csv = [
      ['Seat Number', 'Type', 'Status', 'Passenger', 'PNR', 'Meal', 'Fare'].join(','),
      ...filteredAndSortedSeats.map(seat => [
        seat.seatNumber,
        seat.seatType,
        seat.status,
        seat.passengerName || '',
        seat.bookingReference || '',
        seat.mealPreference || '',
        seat.fare || 0
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `${cabin?.cabinClass?.name || 'Cabin'}_seats_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Hash className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold text-blue-900">{stats.total}</div>
                <div className="text-xs text-blue-700">Total Seats</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-600 rounded-lg">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold text-green-900">{stats.available}</div>
                <div className="text-xs text-green-700">Available</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-600 rounded-lg">
                <User className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold text-orange-900">{stats.booked}</div>
                <div className="text-xs text-orange-700">Booked</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-50 to-rose-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-600 rounded-lg">
                <XCircle className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold text-red-900">{stats.blocked}</div>
                <div className="text-xs text-red-700">Blocked</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-600 rounded-lg">
                <DollarSign className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold text-purple-900">{formatCurrency(stats.revenue)}</div>
                <div className="text-xs text-purple-700">Revenue</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Occupancy Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Cabin Occupancy</span>
            <span className="text-sm font-bold text-blue-600">{stats.occupancyRate}%</span>
          </div>
          <Progress value={stats.occupancyRate} className="h-2" />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{stats.booked} booked</span>
            <span>{stats.available} remaining</span>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search seats, passengers, PNR..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="booked">Booked</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
              </SelectContent>
            </Select>

            {/* Seat Type Filter */}
            <Select value={seatTypeFilter} onValueChange={setSeatTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="window">Window</SelectItem>
                <SelectItem value="middle">Middle</SelectItem>
                <SelectItem value="aisle">Aisle</SelectItem>
              </SelectContent>
            </Select>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <Filter className="h-4 w-4 mr-1" />
                Clear
              </Button>
              <Button variant="outline" size="sm" onClick={exportSeats}>
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seat Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Plane className="h-5 w-5" />
              Seat Map ({filteredAndSortedSeats.length} of {seats.length} seats)
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="cursor-pointer hover:bg-gray-100" onClick={() => handleSort('seatNumber')}>
                    <div className="flex items-center gap-1">
                      Seat
                      {sortConfig.key === 'seatNumber' && (
                        <span className="text-xs">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="cursor-pointer hover:bg-gray-100" onClick={() => handleSort('status')}>
                    <div className="flex items-center gap-1">
                      Status
                      {sortConfig.key === 'status' && (
                        <span className="text-xs">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-gray-100" onClick={() => handleSort('passengerName')}>
                    <div className="flex items-center gap-1">
                      Passenger
                      {sortConfig.key === 'passengerName' && (
                        <span className="text-xs">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead>PNR</TableHead>
                  <TableHead>Meal</TableHead>
                  <TableHead className="cursor-pointer hover:bg-gray-100" onClick={() => handleSort('fare')}>
                    <div className="flex items-center gap-1">
                      Fare
                      {sortConfig.key === 'fare' && (
                        <span className="text-xs">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedSeats.map((seat) => (
                  <TableRow key={seat.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {getSeatTypeIcon(seat)}
                        <span className="font-semibold">{seat.seatNumber}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {seat.seatType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(seat.status)}
                    </TableCell>
                    <TableCell>
                      {seat.passengerName ? (
                        <div>
                          <div className="font-medium">{seat.passengerName}</div>
                          <div className="text-xs text-muted-foreground">ID: {seat.passengerId}</div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {seat.bookingReference ? (
                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                          {seat.bookingReference}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {seat.mealPreference ? (
                        <div className="flex items-center gap-1">
                          <Utensils className="h-3 w-3 text-amber-600" />
                          <span className="text-xs">{seat.mealPreference.replace('_', ' ')}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold">{formatCurrency(seat.fare || 0)}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Seat Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => {
                            setSelectedSeat(seat);
                            setShowSeatDetails(true);
                          }}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSeatAction(seat, 'edit')}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Seat
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {seat.status === 'AVAILABLE' && (
                            <DropdownMenuItem
                              onClick={() => handleSeatAction(seat, 'block')}
                              className="text-red-600"
                            >
                              <Lock className="h-4 w-4 mr-2" />
                              Block Seat
                            </DropdownMenuItem>
                          )}
                          {seat.status === 'BLOCKED' && (
                            <DropdownMenuItem
                              onClick={() => handleSeatAction(seat, 'unblock')}
                              className="text-green-600"
                            >
                              <Unlock className="h-4 w-4 mr-2" />
                              Unblock Seat
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredAndSortedSeats.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <AlertTriangle className="h-8 w-8 text-gray-400" />
                        <p>No seats found matching your criteria</p>
                        <Button variant="outline" size="sm" onClick={clearFilters}>
                          Clear Filters
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Seat Details Dialog */}
      <Dialog open={showSeatDetails} onOpenChange={setShowSeatDetails}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedSeat && getSeatTypeIcon(selectedSeat.seatType)}
              Seat {selectedSeat?.seatNumber} - Detailed Information
            </DialogTitle>
          </DialogHeader>

          {selectedSeat && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-500">Status</div>
                  {getStatusBadge(selectedSeat.status)}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Type</div>
                  <div className="flex items-center gap-2">
                    {getSeatTypeIcon(selectedSeat.seatType)}
                    <span>{selectedSeat.seatType}</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Position</div>
                  <div className="text-sm">{selectedSeat.seatPosition}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Fare</div>
                  <div className="text-lg font-bold text-green-600">
                    {formatCurrency(selectedSeat.fare || 0)}
                  </div>
                </div>
              </div>

              {/* Passenger Information */}
              {selectedSeat.passengerName && (
                <div className="border-t pt-4">
                  <div className="text-sm font-medium text-gray-700 mb-3">Passenger Information</div>
                  <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                    <div>
                      <div className="text-sm font-semibold text-blue-900">{selectedSeat.passengerName}</div>
                      <div className="text-xs text-blue-700">Passenger ID: {selectedSeat.passengerId}</div>
                    </div>

                    {selectedSeat.bookingReference && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <div>
                          <div className="text-xs text-blue-700">Booking Reference</div>
                          <div className="font-mono text-sm">{selectedSeat.bookingReference}</div>
                        </div>
                      </div>
                    )}

                    {selectedSeat.mealPreference && (
                      <div className="flex items-center gap-2">
                        <Utensils className="h-4 w-4 text-amber-600" />
                        <div>
                          <div className="text-xs text-blue-700">Meal Preference</div>
                          <div className="text-sm">{selectedSeat.mealPreference}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="border-t pt-4 flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Seat
                </Button>
                {selectedSeat.status === 'AVAILABLE' && (
                  <Button size="sm" variant="outline" className="flex-1 text-red-600 hover:text-red-700">
                    <Lock className="h-4 w-4 mr-2" />
                    Block
                  </Button>
                )}
                {selectedSeat.status === 'BLOCKED' && (
                  <Button size="sm" variant="outline" className="flex-1 text-green-600 hover:text-green-700">
                    <Unlock className="h-4 w-4 mr-2" />
                    Unblock
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SeatTable;