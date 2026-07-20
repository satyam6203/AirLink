import { getFlightInstanceById } from '@/Redux/flightInstance/flightInstanceThunk';
import { getFlightInstanceCabinById } from '@/Redux/flightInstanceCabin/flightInstanceCabinThunk';
import React, { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Plane, 
  Users, 
  CheckCircle, 
  User, 
  Lock,
  Save,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { getSeatIcon } from '@/utils/seatIcon';
import { formatCurrency } from '@/utils/formateCurrency';

const FlightInstanceCabinDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cabinId } = useParams();
  const { cabin, loading } = useSelector(store => store.flightInstanceCabin);
  const { flightInstance } = useSelector(store => store.flightInstance);
  
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [showSeatDetails, setShowSeatDetails] = useState(false);
  const [hoveredSeat, setHoveredSeat] = useState(null);
  const [editMode, setEditMode] = useState(false);
  
  // Form state for editing seat details
  const [seatForm, setSeatForm] = useState({
    status: '',
    fare: '',
    mealPreference: '',
    isAvailable: true,
    isOccupied: false,
    seatCharacteristics: ''
  });

  useEffect(() => {
    if (cabinId) {
      dispatch(getFlightInstanceCabinById(cabinId));
    }
  }, [cabinId, dispatch]);

  // Generate seat layout based on seatMap configuration
  const seatLayout = useMemo(() => {
    if (!cabin?.seats?.length) return { rows: [], leftSeatsPerRow: 3, rightSeatsPerRow: 3, totalRows: 0 };

    const seats = cabin.seats;
    let leftSeatsPerRow = cabin.seatMap?.leftSeatsPerRow || 3;
    let rightSeatsPerRow = cabin.seatMap?.rightSeatsPerRow || 3;
    let totalRows = cabin.seatMap?.totalRows || 15;

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
  }, [cabin]);

  const getSeatStats = () => {
    if (!cabin?.seats) return { total: 0, available: 0, booked: 0, blocked: 0, occupancyRate: 0 };
    
    const total = cabin.seats.length;
    const available = cabin.seats.filter(s => s.status === 'AVAILABLE').length;
    const booked = cabin.seats.filter(s => s.status === 'BOOKED' || s.booked).length;
    const blocked = cabin.seats.filter(s => s.status === 'BLOCKED').length;
    const occupancyRate = total > 0 ? Math.round((booked / total) * 100) : 0;

    return { total, available, booked, blocked, occupancyRate };
  };

  const stats = getSeatStats();

  const getSeatColor = (seat) => {
    const baseClasses = "transition-all duration-200 border-2 rounded-lg p-3 cursor-pointer relative";

    if (seat.status === 'BOOKED' || seat.booked) {
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

  const getSeatIconDisplay = (seat) => {
    const icon = getSeatIcon(seat);
    return <span className="text-sm">{icon}</span>;
  };

  const getCabinClassColor = () => {
    const cabinType = cabin?.cabinClass?.name;
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

  const handleSeatClick = (seat) => {
    setSelectedSeat(seat);
    setSeatForm({
      status: seat.status || 'AVAILABLE',
      fare: seat.fare || '',
      mealPreference: seat.mealPreference || '',
      isAvailable: seat.isAvailable !== false,
      isOccupied: seat.isOccupied || false,
      seatCharacteristics: seat.seatCharacteristics || ''
    });
    setEditMode(false);
    setShowSeatDetails(true);
  };

  const handleSaveChanges = () => {
    // TODO: Dispatch update action to backend
    console.log('Saving seat changes:', { seatId: selectedSeat.id, ...seatForm });
    setEditMode(false);
    // Add toast notification here
  };

  const handleFormChange = (field, value) => {
    setSeatForm(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading cabin details...</p>
        </div>
      </div>
    );
  }

  if (!cabin) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-gray-600">No cabin data available</p>
          <Button onClick={() => navigate(-1)} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              {cabin.cabinClass?.name || cabin.cabinClassType} Class Seats
              <Badge className={cn(
                "flex items-center gap-1",
                cabin.isActive !== false
                  ? "bg-green-100 text-green-800 border-green-200"
                  : "bg-gray-100 text-gray-800 border-gray-200"
              )}>
                {cabin.isActive !== false ? 'Active' : 'Inactive'}
              </Badge>
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
              <span className="flex items-center gap-1">
                <Plane className="h-4 w-4" />
                Cabin ID: {cabin.id}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {stats.total} seats total
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
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

        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
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

        <Card className="bg-gradient-to-r from-red-50 to-rose-50 border-red-200">
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

        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-lg font-bold text-purple-700">{stats.occupancyRate}%</div>
                <div className="text-xs text-gray-600">Occupancy</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Seat Map */}
      <Card className="shadow-lg border-0">
        <CardHeader className={cn(
          "relative p-6 rounded-t-lg bg-gradient-to-r text-white",
          getCabinClassColor()
        )}>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              <Plane className="h-6 w-6" />
              Seat Map
            </CardTitle>
            <div className="text-right">
              <div className="text-sm">Configuration</div>
              <div className="text-lg font-bold">
                {seatLayout.leftSeatsPerRow}-{seatLayout.rightSeatsPerRow} • {seatLayout.totalRows} Rows
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Seat Legend */}
          <div className="flex flex-wrap gap-4 justify-center p-4 bg-gray-50 rounded-lg mb-6">
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

          {/* Seat Grid */}
          <div className="bg-white rounded-lg p-6 border">
            <div className="mb-6 text-center">
              <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
                <Plane className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Front of Aircraft</span>
              </div>
            </div>

            {/* Seat Layout */}
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {seatLayout.rows.map((row) => (
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
                        style={{ minWidth: '50px', minHeight: '50px' }}
                      >
                        <div className="flex flex-col items-center gap-1">
                          {getSeatIconDisplay(seat)}
                          <span className="text-xs font-medium">{seat.seatNumber}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Aisle */}
                  <div className="w-12 flex flex-col items-center justify-center">
                    <div className="w-px h-10 bg-gray-300"></div>
                    <div className="text-[10px] text-gray-400 mt-1">AISLE</div>
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
                        style={{ minWidth: '50px', minHeight: '50px' }}
                      >
                        <div className="flex flex-col items-center gap-1">
                          {getSeatIconDisplay(seat)}
                          <span className="text-xs font-medium">{seat.seatNumber}</span>
                        </div>
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
          </div>
        </CardContent>
      </Card>

      {/* Seat Details Sidebar */}
      <Sheet open={showSeatDetails} onOpenChange={setShowSeatDetails}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              {selectedSeat && getSeatIconDisplay(selectedSeat)}
              Seat {selectedSeat?.seatNumber} Details
            </SheetTitle>
            <SheetDescription>
              View and manage seat information for {selectedSeat?.seatNumber}
            </SheetDescription>
          </SheetHeader>

          {selectedSeat && (
            <div className="space-y-6 py-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-gray-700 border-b pb-2">Basic Information</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-gray-500">Seat Number</Label>
                    <div className="mt-1 font-medium">{selectedSeat.seatNumber}</div>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Seat Type</Label>
                    <div className="mt-1 font-medium">{selectedSeat.seatType}</div>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Position</Label>
                    <div className="mt-1 font-medium">{selectedSeat.seatPosition}</div>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Seat ID</Label>
                    <div className="mt-1 font-medium text-xs text-gray-600">{selectedSeat.id}</div>
                  </div>
                </div>
              </div>

              {/* Editable Fields */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="font-semibold text-sm text-gray-700">Seat Details</h3>
                  {!editMode && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditMode(true)}
                    >
                      Edit
                    </Button>
                  )}
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  {editMode ? (
                    <Select
                      value={seatForm.status}
                      onValueChange={(value) => handleFormChange('status', value)}
                    >
                      <SelectTrigger id="status" className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AVAILABLE">Available</SelectItem>
                        <SelectItem value="BOOKED">Booked</SelectItem>
                        <SelectItem value="BLOCKED">Blocked</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="mt-1">
                      <Badge className={cn(
                        seatForm.status === 'AVAILABLE' && "bg-green-100 text-green-800",
                        seatForm.status === 'BOOKED' && "bg-blue-100 text-blue-800",
                        seatForm.status === 'BLOCKED' && "bg-red-100 text-red-800"
                      )}>
                        {seatForm.status}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Fare */}
                <div className="space-y-2">
                  <Label htmlFor="fare">Fare Price</Label>
                  {editMode ? (
                    <Input
                      id="fare"
                      type="number"
                      value={seatForm.fare}
                      onChange={(e) => handleFormChange('fare', e.target.value)}
                      placeholder="Enter fare amount"
                    />
                  ) : (
                    <div className="mt-1 font-semibold text-green-700">
                      {formatCurrency(seatForm.fare || 0)}
                    </div>
                  )}
                </div>

                {/* Meal Preference */}
                <div className="space-y-2">
                  <Label htmlFor="mealPreference">Meal Preference</Label>
                  {editMode ? (
                    <Select
                      value={seatForm.mealPreference}
                      onValueChange={(value) => handleFormChange('mealPreference', value)}
                    >
                      <SelectTrigger id="mealPreference" className="w-full">
                        <SelectValue placeholder="Select meal preference" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        <SelectItem value="VEGETARIAN">Vegetarian</SelectItem>
                        <SelectItem value="VEGAN">Vegan</SelectItem>
                        <SelectItem value="GLUTEN_FREE">Gluten Free</SelectItem>
                        <SelectItem value="HALAL">Halal</SelectItem>
                        <SelectItem value="KOSHER">Kosher</SelectItem>
                        <SelectItem value="STANDARD">Standard</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="mt-1">
                      {seatForm.mealPreference || 'Not specified'}
                    </div>
                  )}
                </div>

                {/* Seat Characteristics */}
                <div className="space-y-2">
                  <Label htmlFor="characteristics">Characteristics</Label>
                  {editMode ? (
                    <Input
                      id="characteristics"
                      value={seatForm.seatCharacteristics}
                      onChange={(e) => handleFormChange('seatCharacteristics', e.target.value)}
                      placeholder="Extra legroom, recline, etc."
                    />
                  ) : (
                    <div className="mt-1 text-sm text-gray-600">
                      {seatForm.seatCharacteristics || 'None'}
                    </div>
                  )}
                </div>

                {/* Availability Switches */}
                <div className="space-y-3 pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="isAvailable" className="cursor-pointer">
                      Is Available
                    </Label>
                    <Switch
                      id="isAvailable"
                      checked={seatForm.isAvailable}
                      onCheckedChange={(checked) => handleFormChange('isAvailable', checked)}
                      disabled={!editMode}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="isOccupied" className="cursor-pointer">
                      Is Occupied
                    </Label>
                    <Switch
                      id="isOccupied"
                      checked={seatForm.isOccupied}
                      onCheckedChange={(checked) => handleFormChange('isOccupied', checked)}
                      disabled={!editMode}
                    />
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-gray-700 border-b pb-2">System Information</h3>
                <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                  <div>
                    <div className="font-medium text-gray-500">Flight Cabin ID</div>
                    <div className="mt-1">{selectedSeat.flightCabinId}</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-500">Flight ID</div>
                    <div className="mt-1">{selectedSeat.flightId}</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-500">Created At</div>
                    <div className="mt-1">{new Date(selectedSeat.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-500">Version</div>
                    <div className="mt-1">{selectedSeat.version}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {editMode && (
            <SheetFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setEditMode(false);
                  // Reset form to original values
                  setSeatForm({
                    status: selectedSeat.status || 'AVAILABLE',
                    fare: selectedSeat.fare || '',
                    mealPreference: selectedSeat.mealPreference || '',
                    isAvailable: selectedSeat.isAvailable !== false,
                    isOccupied: selectedSeat.isOccupied || false,
                    seatCharacteristics: selectedSeat.seatCharacteristics || ''
                  });
                }}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSaveChanges}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default FlightInstanceCabinDetails;
