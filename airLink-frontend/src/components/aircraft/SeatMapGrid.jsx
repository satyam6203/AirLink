import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plane, Users, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { getSeatColor } from "@/utils/seatColor";
import { useSelector } from "react-redux";
import { getSeatIcon } from "@/utils/seatIcon";

const SeatMapGrid = ({
  
  seats = [],
  onSeatClick,
  selectedSeat,
  className = "",
}) => {
  const [zoom, setZoom] = useState(1);
  const [showRowNumbers, setShowRowNumbers] = useState(true);
  const [showSeatLabels, setShowSeatLabels] = useState(true);
  const {cabinClass}=useSelector(state=>state.cabinClass)

  // Extract seat data from cabin structure
  const seatLayout = useMemo(() => {
    // First, try to get seats from the provided seats array
    if (seats && seats.length > 0) {
      return seats.map((seat) => ({
        id: seat.id,
        seatNumber: seat.seatNumber || seat.fullPosition,
        row: seat.seatRow || parseInt(seat.seatNumber?.match(/\d+/)?.[0]) || 1,
        column:
          seat.columnLetter || seat.seatNumber?.match(/[A-Z]+/)?.[0] || "A",
        seatType: seat.seatType || "MIDDLE",
        status: seat.isBlocked
          ? "BLOCKED"
          : seat.isEmergencyExit
          ? "EXTRA_LEGROOM"
          : seat.isPremiumSeat
          ? "EXTRA_LEGROOM"
          : "AVAILABLE",
        isAvailable: seat.isAvailable && seat.isBookable && seat.isActive,
        seatClass: cabinClass?.name || "ECONOMY",
        seatPitch: cabinClass?.typicalSeatPitch || 32,
        seatWidth: cabinClass?.typicalSeatWidth || 17.5,
        hasRecline: !seat.isEmergencyExit,
        amenities: [],
        cabinClassId: cabinClass?.id,
        basePrice: seat.basePrice || 0,
        premiumSurcharge: seat.premiumSurcharge || 0,
        totalPrice: seat.totalPrice || 0,
        isPremiumSeat: seat.isPremiumSeat || false,
        isEmergencyExit: seat.isEmergencyExit || false,
      }));
    }

    // Next, try to get seats from cabin.seatMap.seats
    if (cabinClass?.seatMap?.seats && cabinClass.seatMap.seats.length > 0) {
      return cabinClass.seatMap.seats.map((seat) => ({
        id: seat.id,
        seatNumber: seat.seatNumber || seat.fullPosition,
        row: seat.seatRow || parseInt(seat.seatNumber?.match(/\d+/)?.[0]) || 1,
        column:
          seat.columnLetter || seat.seatNumber?.match(/[A-Z]+/)?.[0] || "A",
        seatType: seat.seatType || "MIDDLE",
        status: seat.isBlocked
          ? "BLOCKED"
          : seat.isEmergencyExit
          ? "EXTRA_LEGROOM"
          : seat.isPremiumSeat
          ? "EXTRA_LEGROOM"
          : "AVAILABLE",
        isAvailable: seat.isAvailable && seat.isBookable && seat.isActive,
        seatClass: cabinClass?.seatMap?.cabinClassName || cabinClass?.name || "ECONOMY",
        seatPitch: cabinClass?.typicalSeatPitch || 32,
        seatWidth: cabinClass?.typicalSeatWidth || 17.5,
        hasRecline: !seat.isEmergencyExit,
        amenities: [],
        cabinClassId: cabinClass?.id,
        basePrice: seat.basePrice || 0,
        premiumSurcharge: seat.premiumSurcharge || 0,
        totalPrice: seat.totalPrice || 0,
        isPremiumSeat: seat.isPremiumSeat || false,
        isEmergencyExit: seat.isEmergencyExit || false,
      }));
    }

    

    // Return empty array if no data available
    return [];
  }, [seats, cabinClass]);

  // Group seats by row
  const seatsByRow = useMemo(() => {
    const grouped = {};
    seatLayout.forEach((seat) => {
      if (!grouped[seat.row]) {
        grouped[seat.row] = [];
      }
      grouped[seat.row].push(seat);
    });

    // Sort seats in each row by column
    Object.keys(grouped).forEach((row) => {
      grouped[row].sort((a, b) => {
        const colA = a.column || a.seatNumber.slice(-1);
        const colB = b.column || b.seatNumber.slice(-1);
        return colA.localeCompare(colB);
      });
    });

    return grouped;
  }, [seatLayout]);



  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.2, 0.6));
  };

  const handleReset = () => {
    setZoom(1);
  };

  const rows = Object.keys(seatsByRow)
    .map(Number)
    .sort((a, b) => a - b);
  const maxSeatsPerRow = Math.max(
    ...Object.values(seatsByRow).map((row) => row.length),
    0
  );

  // Calculate aisle positions (typically after 3rd seat for 6-seat config)
  const aislePositions = useMemo(() => {
    if (maxSeatsPerRow <= 4) return [];
    if (maxSeatsPerRow <= 6) return [2]; // After C seat
    if (maxSeatsPerRow <= 9) return [2, 5]; // After C and F
    return [2, 5, 8]; // After C, F, and I
  }, [maxSeatsPerRow]);

  // Get seat map information for display
  const seatMapInfo = cabinClass?.seatMap || {};
  const totalSeats = seatMapInfo.totalSeats || seatLayout.length;
  const availableSeats =
    seatMapInfo.availableSeats ||
    seatLayout.filter((s) => s.isAvailable).length;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <CardTitle className="flex items-center">
              <Plane className="h-5 w-5 mr-2" />
              {cabinClass?.name || `${cabinClass?.cabinClass} Cabin`} Seat Map
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Click on any seat to view details and configuration options
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleZoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm px-2">{Math.round(zoom * 100)}%</span>
            <Button variant="outline" size="sm" onClick={handleZoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 pt-4 border-t">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
            <span className="text-sm">Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
            <span className="text-sm">Unavailable</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-purple-100 border border-purple-300 rounded"></div>
            <span className="text-sm">Premium/Extra Legroom</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-orange-100 border border-orange-300 rounded"></div>
            <span className="text-sm">Emergency Exit</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
            <span className="text-sm">Blocked</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-600 border border-blue-700 rounded"></div>
            <span className="text-sm">Selected</span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Empty State Handling */}
        {seatLayout.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
            <div className="text-gray-400 mb-4">
              <Plane className="w-16 h-16" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">
                No Seat Map Available
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {cabinClass?.seatMap === null
                  ? "No seat map has been configured for this cabin class."
                  : "This cabin class doesn't have any seats configured yet."}
              </p>
            </div>
            {!cabinClass?.seatMap && (
              <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md">
                <p>
                  <strong>Note:</strong> A seat map needs to be created before
                  seats can be managed.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-auto max-h-96">
            <div
              className="relative mx-auto"
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: "top center",
                width: "fit-content",
              }}
            >
              {/* Aircraft Nose */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-8 bg-gray-200 rounded-t-full flex items-center justify-center">
                  <Plane className="h-4 w-4 text-gray-600" />
                </div>
              </div>

              {/* Seat Grid */}
              <div className="space-y-1">
                {rows.map((rowNumber) => {
                  const rowSeats = seatsByRow[rowNumber];
                  return (
                    <div
                      key={rowNumber}
                      className="flex items-center space-x-1"
                    >
                      {/* Row Number */}
                      {showRowNumbers && (
                        <div className="w-8 text-center text-sm font-medium text-gray-600">
                          {rowNumber}
                        </div>
                      )}

                      {/* Seats */}
                      <div className="flex space-x-1">
                        {rowSeats.map((seat, seatIndex) => {
                          const showAisle = aislePositions.includes(seatIndex);
                          return (
                            <React.Fragment key={seat.id}>
                              <button
                                onClick={() => onSeatClick?.(seat)}
                                className={`
                                relative w-8 h-8 border-2 rounded text-xs font-medium
                                transition-all duration-200 cursor-pointer
                                ${getSeatColor(selectedSeat, seat)}
                                ${
                                  seat.isAvailable
                                    ? "hover:scale-110"
                                    : "cursor-not-allowed"
                                }
                              `}
                                title={`${seat.seatNumber} - ${seat.status} ${
                                  seat.seatType ? `(${seat.seatType})` : ""
                                }${
                                  seat.totalPrice > 0
                                    ? ` - $${seat.totalPrice}`
                                    : ""
                                }${seat.isPremiumSeat ? " - Premium" : ""}${
                                  seat.isEmergencyExit
                                    ? " - Emergency Exit"
                                    : ""
                                }`}
                                disabled={!seat.isAvailable}
                              >
                                {showSeatLabels
                                  ? seat.seatNumber.slice(-1)
                                  : getSeatIcon(seat)}

                                {/* Special indicators */}
                                {seat.status === "EXTRA_LEGROOM" && (
                                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full"></div>
                                )}
                                {seat.amenities?.length > 0 && (
                                  <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                                )}
                              </button>

                              {/* Aisle Space */}
                              {showAisle && (
                                <div className="w-4 flex items-center justify-center">
                                  <div className="w-0.5 h-6 bg-gray-300"></div>
                                </div>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>

                      {/* Row Number (Right Side) */}
                      {showRowNumbers && (
                        <div className="w-8 text-center text-sm font-medium text-gray-600">
                          {rowNumber}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Controls - only show if we have seats */}
        {seatLayout.length > 0 && (
          <div className="flex justify-between items-center mt-4 pt-4 border-t">
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showRowNumbers}
                  onChange={(e) => setShowRowNumbers(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Show row numbers</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showSeatLabels}
                  onChange={(e) => setShowSeatLabels(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Show seat labels</span>
              </label>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Users className="h-4 w-4" />
              <span>{totalSeats} total seats</span>
              <span>•</span>
              <span>{availableSeats} available</span>
              {cabinClass?.seatMap?.name && (
                <>
                  <span>•</span>
                  <span className="font-medium">{cabinClass.seatMap.name}</span>
                </>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SeatMapGrid;
