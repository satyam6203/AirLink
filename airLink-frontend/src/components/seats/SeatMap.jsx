import React, { useState, useMemo } from 'react';
import {
  User,
  UserX,
  Lock,
  Unlock,
  Eye,
  Edit,
  Coffee,
  Utensils,
  Plane,
  MapPin,
  Star,
  AlertTriangle,
  CheckCircle,
  Circle,
  Crown,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/formateCurrency';
import { getSeatIcon } from '@/utils/seatIcon';

const SeatMap = ({ seats = [], cabin, onSeatClick, viewMode = 'visual' }) => {
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [hoveredSeat, setHoveredSeat] = useState(null);
  const [showSeatDetails, setShowSeatDetails] = useState(false);

  // Generate seat layout based on seatMap configuration from backend
  const seatLayout = useMemo(() => {
    if (!seats.length) return { rows: [], leftSeatsPerRow: 3, rightSeatsPerRow: 3, totalRows: 0 };

    // Use seatMap from cabin if available, otherwise use defaults based on cabin class
    let leftSeatsPerRow = 3;
    let rightSeatsPerRow = 3;
    let totalRows = 20;

    if (cabin?.seatMap) {
      leftSeatsPerRow = cabin.seatMap.leftSeatsPerRow || 3;
      rightSeatsPerRow = cabin.seatMap.rightSeatsPerRow || 3;
      totalRows = cabin.seatMap.totalRows || 20;
    } else {
      // Fallback based on cabin class
      const cabinType = cabin?.cabinClass?.name || 'ECONOMY';
      switch (cabinType) {
        case 'FIRST_CLASS':
        case 'FIRST':
          leftSeatsPerRow = 2;
          rightSeatsPerRow = 2;
          totalRows = 10;
          break;
        case 'BUSINESS_CLASS':
        case 'BUSINESS':
          leftSeatsPerRow = 2;
          rightSeatsPerRow = 2;
          totalRows = 15;
          break;
        case 'PREMIUM_ECONOMY':
          leftSeatsPerRow = 3;
          rightSeatsPerRow = 3;
          totalRows = 18;
          break;
        case 'ECONOMY':
        default:
          leftSeatsPerRow = 3;
          rightSeatsPerRow = 3;
          totalRows = 25;
          break;
      }
    }

    const totalSeatsPerRow = leftSeatsPerRow + rightSeatsPerRow;

    // Group seats by row number
    const seatsByRow = {};
    seats.forEach(seat => {
      const rowNumber = seat.seatNumber.replace(/[A-Z]/g, '');
      if (!seatsByRow[rowNumber]) {
        seatsByRow[rowNumber] = [];
      }
      seatsByRow[rowNumber].push(seat);
    });

    // Sort seats within each row by seat letter
    Object.keys(seatsByRow).forEach(rowNum => {
      seatsByRow[rowNum].sort((a, b) => {
        const aLetter = a.seatNumber.slice(-1);
        const bLetter = b.seatNumber.slice(-1);
        return aLetter.charCodeAt(0) - bLetter.charCodeAt(0);
      });
    });

    // Create rows array with proper structure
    const rows = [];
    const sortedRowNumbers = Object.keys(seatsByRow).sort((a, b) => parseInt(a) - parseInt(b));

    sortedRowNumbers.forEach(rowNumber => {
      const rowSeats = seatsByRow[rowNumber];

      // Separate left and right seats
      const leftSeats = rowSeats.slice(0, leftSeatsPerRow);
      const rightSeats = rowSeats.slice(leftSeatsPerRow, leftSeatsPerRow + rightSeatsPerRow);

      rows.push({
        number: rowNumber,
        leftSeats: leftSeats,
        rightSeats: rightSeats,
        allSeats: rowSeats
      });
    });

    return {
      rows,
      leftSeatsPerRow,
      rightSeatsPerRow,
      totalSeatsPerRow,
      totalRows: rows.length
    };
  }, [seats, cabin]);

  const getSeatIconDisplay = (seat) => {
    const icon = getSeatIcon(seat);
    return <span className="text-sm">{icon}</span>;
  };

  const getSeatColor = (seat) => {
    const baseClasses = "transition-all duration-200 border-2 rounded-lg p-3 cursor-pointer relative";

    if (seat.status === 'BOOKED') {
      return cn(baseClasses,
        "bg-blue-100 border-blue-300 text-blue-800 hover:bg-blue-200",
        hoveredSeat?.id === seat.id && "ring-2 ring-blue-400 scale-105"
      );
    }
    if (seat.status === 'BLOCKED') {
      return cn(baseClasses,
        "bg-red-100 border-red-300 text-red-800 hover:bg-red-200",
        hoveredSeat?.id === seat.id && "ring-2 ring-red-400 scale-105"
      );
    }
    return cn(baseClasses,
      "bg-green-50 border-green-300 text-green-800 hover:bg-green-100",
      hoveredSeat?.id === seat.id && "ring-2 ring-green-400 scale-105"
    );
  };

  const getCabinClassColor = (cabinType) => {
    switch (cabinType) {
      case 'FIRST_CLASS':
      case 'FIRST':
        return 'from-purple-600 to-pink-600';
      case 'BUSINESS_CLASS':
      case 'BUSINESS':
        return 'from-blue-600 to-indigo-600';
      case 'PREMIUM_ECONOMY':
        return 'from-orange-500 to-amber-500';
      case 'ECONOMY':
      default:
        return 'from-green-500 to-emerald-500';
    }
  };

  const getSeatStats = () => {
    const total = seats.length;
    const available = seats.filter(s => s.status === 'AVAILABLE').length;
    const booked = seats.filter(s => s.status === 'BOOKED').length;
    const blocked = seats.filter(s => s.status === 'BLOCKED').length;
    const occupancyRate = total > 0 ? Math.round((booked / total) * 100) : 0;

    return { total, available, booked, blocked, occupancyRate };
  };

  const stats = getSeatStats();

  const handleSeatClick = (seat) => {
    setSelectedSeat(seat);
    setShowSeatDetails(true);
    onSeatClick?.(seat);
  };

  const renderVisualSeatMap = () => (
    <div className="space-y-6">
      {/* Aircraft Header */}
      <div className={cn(
        "relative p-6 rounded-t-3xl bg-gradient-to-r text-white shadow-lg",
        getCabinClassColor(cabin?.cabinClass?.name)
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Plane className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">{cabin?.cabinClass?.name} Class</h3>
              <p className="text-white/80">{seats.length} seats available</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{stats.occupancyRate}%</div>
            <div className="text-sm text-white/80">Occupancy</div>
          </div>
        </div>
      </div>

      {/* Seat Legend */}
      <div className="flex flex-wrap gap-4 justify-center p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded"></div>
          <span className="text-sm">Available ({stats.available})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-100 border-2 border-blue-300 rounded"></div>
          <span className="text-sm">Booked ({stats.booked})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-100 border-2 border-red-300 rounded"></div>
          <span className="text-sm">Blocked ({stats.blocked})</span>
        </div>
      </div>

      {/* Seat Map */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        {/* Aircraft Info Header */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
            <Plane className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              {seatLayout.leftSeatsPerRow}-{seatLayout.rightSeatsPerRow} Configuration • {seatLayout.totalRows} Rows
            </span>
          </div>
        </div>

        {/* Seat Layout */}
        <div className="space-y-2">
          {seatLayout.rows.map((row, rowIndex) => (
            <div key={row.number} className="flex items-center justify-center gap-3">
              {/* Row Number - Left */}
              <div className="w-8 text-center font-semibold text-gray-600 text-sm">
                {row.number}
              </div>

              {/* Left Side Seats */}
              <div className="flex gap-1">
                {row.leftSeats?.map((seat) => (
                  <div
                    key={seat.id}
                    className={getSeatColor(seat)}
                    onClick={() => handleSeatClick(seat)}
                    onMouseEnter={() => setHoveredSeat(seat)}
                    onMouseLeave={() => setHoveredSeat(null)}
                    title={`${seat.seatNumber} - ${seat.status} - ${seat.seatType}`}
                    style={{ minWidth: '40px', minHeight: '40px' }}
                  >
                    <div className="flex flex-col items-center gap-1">
                      {getSeatIconDisplay(seat)}
                      <span className="text-xs font-medium">{seat.seatNumber}</span>
                    </div>

                    {seat.passengerName && (
                      <div className="absolute -top-1 -right-1">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      </div>
                    )}

                    {seat.mealPreference && (
                      <div className="absolute -bottom-1 -left-1">
                        <Utensils className="h-2 w-2 text-amber-600" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Aisle */}
              <div className="w-8 flex justify-center">
                <div className="w-px h-8 bg-gray-300"></div>
                <div className="text-xs text-gray-400 absolute mt-10">AISLE</div>
              </div>

              {/* Right Side Seats */}
              <div className="flex gap-1">
                {row.rightSeats?.map((seat) => (
                  <div
                    key={seat.id}
                    className={getSeatColor(seat)}
                    onClick={() => handleSeatClick(seat)}
                    onMouseEnter={() => setHoveredSeat(seat)}
                    onMouseLeave={() => setHoveredSeat(null)}
                    title={`${seat.seatNumber} - ${seat.status} - ${seat.seatType}`}
                    style={{ minWidth: '40px', minHeight: '40px' }}
                  >
                    <div className="flex flex-col items-center gap-1">
                      {getSeatIconDisplay(seat)}
                      <span className="text-xs font-medium">{seat.seatNumber}</span>
                    </div>

                    {seat.passengerName && (
                      <div className="absolute -top-1 -right-1">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      </div>
                    )}

                    {seat.mealPreference && (
                      <div className="absolute -bottom-1 -left-1">
                        <Utensils className="h-2 w-2 text-amber-600" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Row Number - Right */}
              <div className="w-8 text-center font-semibold text-gray-600 text-sm">
                {row.number}
              </div>
            </div>
          ))}
        </div>

        {/* Aircraft Direction Indicator */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 text-xs text-gray-500">
            <div className="w-4 h-4 border-2 border-gray-300 rounded-full relative">
              <div className="absolute inset-1 bg-gray-300 rounded-full"></div>
            </div>
            <span>Front of Aircraft</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-lg font-bold text-green-700">{stats.available}</div>
                <div className="text-xs text-gray-600">Available</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-lg font-bold text-blue-700">{stats.booked}</div>
                <div className="text-xs text-gray-600">Booked</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-red-600" />
              <div>
                <div className="text-lg font-bold text-red-700">{stats.blocked}</div>
                <div className="text-xs text-gray-600">Blocked</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Star className="h-5 w-5 text-amber-600" />
              <div>
                <div className="text-lg font-bold text-amber-700">{stats.occupancyRate}%</div>
                <div className="text-xs text-gray-600">Load Factor</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <>
      {viewMode === 'visual' ? renderVisualSeatMap() : null}

      {/* Seat Details Dialog */}
      <Dialog open={showSeatDetails} onOpenChange={setShowSeatDetails}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedSeat && getSeatIconDisplay(selectedSeat)}
              Seat {selectedSeat?.seatNumber} Details
            </DialogTitle>
          </DialogHeader>

          {selectedSeat && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-500">Status</div>
                  <Badge className={cn(
                    selectedSeat.status === 'AVAILABLE' && "bg-green-100 text-green-800",
                    selectedSeat.status === 'BOOKED' && "bg-blue-100 text-blue-800",
                    selectedSeat.status === 'BLOCKED' && "bg-red-100 text-red-800"
                  )}>
                    {selectedSeat.status}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Type</div>
                  <div className="text-sm">{selectedSeat.seatType}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Position</div>
                  <div className="text-sm">{selectedSeat.seatPosition}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Fare</div>
                  <div className="text-sm font-semibold">{formatCurrency(selectedSeat.fare || 0)}</div>
                </div>
              </div>

              {selectedSeat.passengerName && (
                <div className="border-t pt-4">
                  <div className="text-sm font-medium text-gray-500 mb-2">Passenger Information</div>
                  <div className="space-y-2">
                    <div>
                      <div className="text-sm font-medium">{selectedSeat.passengerName}</div>
                      <div className="text-xs text-gray-600">ID: {selectedSeat.passengerId}</div>
                    </div>
                    {selectedSeat.bookingReference && (
                      <div>
                        <div className="text-xs font-medium text-gray-500">Booking Reference</div>
                        <div className="text-sm font-mono">{selectedSeat.bookingReference}</div>
                      </div>
                    )}
                    {selectedSeat.mealPreference && (
                      <div>
                        <div className="text-xs font-medium text-gray-500">Meal Preference</div>
                        <div className="text-sm flex items-center gap-1">
                          <Utensils className="h-3 w-3" />
                          {selectedSeat.mealPreference}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="border-t pt-4 flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                {selectedSeat.status === 'AVAILABLE' && (
                  <Button size="sm" variant="outline" className="flex-1 text-red-600">
                    <Lock className="h-4 w-4 mr-1" />
                    Block
                  </Button>
                )}
                {selectedSeat.status === 'BLOCKED' && (
                  <Button size="sm" variant="outline" className="flex-1 text-green-600">
                    <Unlock className="h-4 w-4 mr-1" />
                    Unblock
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SeatMap;