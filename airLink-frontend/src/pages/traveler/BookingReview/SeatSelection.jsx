import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Armchair, X, Check, Sparkles, ChevronRight, Info, Plane, User } from 'lucide-react';
import { useSelector } from 'react-redux';

const SeatSelection = ({ selectedSeats = [], onSelectSeat, passengerCount = 1 }) => {
  const [showSeatMap, setShowSeatMap] = useState(false);
  const [currentPassengerIndex, setCurrentPassengerIndex] = useState(0);
  const {cabin} = useSelector((state) => state.flightInstanceCabin);

  // Get seat data from Redux
  const { flightInstance, loading } = useSelector((state) => state.flightInstance);

  // Extract seats and seatMap from flightInstance
  const seats = cabin?.seats || [];
  const seatMap = cabin?.seatMap || {};

  // Get seat map configuration
  const totalRows = seatMap.totalRows || 15;
  const leftSeatsPerRow = seatMap.leftSeatsPerRow || 3;
  const rightSeatsPerRow = seatMap.rightSeatsPerRow || 3;
  const seatsPerRow = leftSeatsPerRow + rightSeatsPerRow;

  // Group seats by row number (extract row from seatNumber like "1A" -> 1)
  const seatsByRow = seats.reduce((acc, seat) => {
    const rowNumber = parseInt(seat.seatNumber.match(/\d+/)?.[0] || '0');
    if (!acc[rowNumber]) acc[rowNumber] = [];
    acc[rowNumber].push(seat);
    return acc;
  }, {});

  const getSeatColor = (seat) => {
    // Check if this seat is already selected by any passenger
    const isSelectedByAnyPassenger = selectedSeats.some(s => s?.id === seat.id);

    if (!seat.isAvailable || seat.isOccupied || seat.booked) {
      return 'bg-gray-300 cursor-not-allowed text-gray-500';
    }
    if (isSelectedByAnyPassenger) {
      return 'bg-blue-600 text-white border-blue-600';
    }
    if (seat.seatCharacteristics?.includes('EXTRA_LEGROOM') || seat.seatType === 'EMERGENCY_EXIT') {
      return 'bg-green-100 hover:bg-green-200 border-green-400 text-green-800';
    }
    if (seat.seatType === 'WINDOW') {
      return 'bg-purple-50 hover:bg-purple-100 border-purple-300 text-purple-800';
    }
    return 'bg-gray-50 hover:bg-blue-50 border-gray-300 text-gray-700';
  };

  // Get seat price
  const getSeatPrice = (seat) => {
    if (seat.seatCharacteristics?.includes('EXTRA_LEGROOM') || seat.seatType === 'EMERGENCY_EXIT') {
      return 800;
    }
    if (seat.seatType === 'WINDOW' || seat.seatType === 'AISLE') {
      return 300;
    }
    return 150; // Middle seat
  };

  const handleSeatClick = (seat) => {
    const isAvailable = seat.isAvailable && !seat.isOccupied && !seat.booked;
    const isAlreadySelected = selectedSeats.some(s => s?.id === seat.id);

    if (isAvailable && !isAlreadySelected) {
      onSelectSeat(currentPassengerIndex, seat);

      // Auto-advance to next passenger if not the last one
      if (currentPassengerIndex < passengerCount - 1) {
        setCurrentPassengerIndex(currentPassengerIndex + 1);
      } else {
        // Close modal after last passenger selects seat
        setShowSeatMap(false);
      }
    }
  };

  const handleRemoveSeat = (passengerIndex) => {
    onSelectSeat(passengerIndex, null);
  };

  const openSeatMapForPassenger = (passengerIndex) => {
    setCurrentPassengerIndex(passengerIndex);
    setShowSeatMap(true);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (!seats || seats.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
            <Armchair className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Seat Selection</h2>
            <p className="text-sm text-gray-600">Choose your preferred seats</p>
          </div>
        </div>
        <div className="p-8 border-2 border-dashed border-gray-300 rounded-xl text-center">
          <Armchair className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-600">No seats available for this flight</p>
        </div>
      </motion.div>
    );
  }

  const totalSelectedSeats = selectedSeats.filter(s => s !== null && s !== undefined).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
            <Armchair className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Seat Selection</h2>
            <p className="text-sm text-gray-600">
              {totalSelectedSeats} of {passengerCount} passengers selected
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-gray-500">Available Seats</p>
            <p className="text-lg font-bold text-indigo-600">
              {seats.filter(s => s.isAvailable && !s.isOccupied && !s.booked).length}
            </p>
          </div>
        </div>
      </div>

      {/* Passenger Seat Cards */}
      <div className="space-y-3 mb-4">
        {Array.from({ length: passengerCount }).map((_, index) => {
          const passengerSeat = selectedSeats[index];

          return (
            <div
              key={index}
              className={`p-4 border-2 rounded-xl transition-all ${
                passengerSeat
                  ? 'border-green-200 bg-gradient-to-r from-green-50 to-emerald-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    passengerSeat ? 'bg-green-100' : 'bg-gray-200'
                  }`}>
                    <User className={`w-5 h-5 ${passengerSeat ? 'text-green-600' : 'text-gray-500'}`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Passenger {index + 1}
                    </p>
                    {passengerSeat ? (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-lg font-bold text-green-600">
                          Seat {passengerSeat.seatNumber}
                        </span>
                        <span className="text-xs px-2 py-0.5 bg-white rounded-full text-gray-700 border border-gray-200">
                          {passengerSeat.seatType}
                        </span>
                        {(passengerSeat.seatCharacteristics?.includes('EXTRA_LEGROOM') ||
                          passengerSeat.seatType === 'EMERGENCY_EXIT') && (
                          <span className="text-xs px-2 py-0.5 bg-green-200 text-green-800 rounded-full font-medium">
                            Extra Legroom
                          </span>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500 mt-1">No seat selected</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {passengerSeat && (
                    <span className="text-base font-bold text-green-600">
                      ₹{getSeatPrice(passengerSeat)}
                    </span>
                  )}
                  {passengerSeat ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => openSeatMapForPassenger(index)}
                        className="px-3 py-1.5 text-sm bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors"
                      >
                        Change
                      </button>
                      <button
                        onClick={() => handleRemoveSeat(index)}
                        className="p-1.5 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => openSeatMapForPassenger(index)}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Select Seat
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Seat Map Modal */}
      <AnimatePresence>
        {showSeatMap && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowSeatMap(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Select Seat for Passenger {currentPassengerIndex + 1}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {totalSelectedSeats} of {passengerCount} seats selected
                  </p>
                </div>
                <button
                  onClick={() => setShowSeatMap(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Passenger Navigation */}
              {passengerCount > 1 && (
                <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
                  {Array.from({ length: passengerCount }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPassengerIndex(index)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all whitespace-nowrap ${
                        currentPassengerIndex === index
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                          : selectedSeats[index]
                          ? 'border-green-200 bg-green-50 text-green-600'
                          : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <User className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        Passenger {index + 1}
                      </span>
                      {selectedSeats[index] && (
                        <span className="text-xs font-bold">
                          {selectedSeats[index].seatNumber}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Flight Info Banner */}
              <div className="mb-4 p-3 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-200">
                <div className="flex items-center gap-3">
                  <Plane className="w-5 h-5 text-indigo-600" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {flightInstance?.flightName || flightInstance?.flightNumber || 'Aircraft Layout'}
                    </p>
                    <p className="text-xs text-gray-600">
                      {totalRows} Rows • {seatsPerRow} Seats per Row • {seats.length} Total Seats
                    </p>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-3 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 border-2 border-gray-300 bg-gray-50 rounded"></div>
                  <span className="text-xs text-gray-700 font-medium">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-300 rounded"></div>
                  <span className="text-xs text-gray-700 font-medium">Occupied</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-600 rounded"></div>
                  <span className="text-xs text-gray-700 font-medium">Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 border-2 border-purple-300 bg-purple-50 rounded"></div>
                  <span className="text-xs text-gray-700 font-medium">Window</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 border-2 border-green-400 bg-green-100 rounded"></div>
                  <span className="text-xs text-gray-700 font-medium">Extra Legroom</span>
                </div>
              </div>

              {/* Seat Map */}
              <div className="space-y-2 max-h-[50vh] overflow-y-auto px-2">
                {Object.entries(seatsByRow)
                  .sort(([a], [b]) => parseInt(a) - parseInt(b))
                  .map(([row, rowSeats]) => {
                    // Sort seats by letter (A, B, C, D, E, F)
                    const sortedSeats = rowSeats.sort((a, b) => {
                      const letterA = a.seatNumber.replace(/\d+/g, '');
                      const letterB = b.seatNumber.replace(/\d+/g, '');
                      return letterA.localeCompare(letterB);
                    });

                    // Split into left and right sections for aisle
                    const leftSeats = sortedSeats.slice(0, leftSeatsPerRow);
                    const rightSeats = sortedSeats.slice(leftSeatsPerRow);

                    return (
                      <div key={row} className="flex items-center gap-3">
                        {/* Row Number */}
                        <span className="text-sm font-bold text-gray-700 w-8 text-center">
                          {row}
                        </span>

                        {/* Left Section */}
                        <div className="flex gap-1">
                          {leftSeats.map((seat) => {
                            const isAvailable = seat.isAvailable && !seat.isOccupied && !seat.booked;
                            const isSelectedByAnyPassenger = selectedSeats.some(s => s?.id === seat.id);
                            const canSelect = isAvailable && !isSelectedByAnyPassenger;

                            return (
                              <motion.button
                                key={seat.id}
                                whileHover={canSelect ? { scale: 1.1 } : {}}
                                whileTap={canSelect ? { scale: 0.95 } : {}}
                                onClick={() => handleSeatClick(seat)}
                                disabled={!canSelect}
                                className={`relative p-2 rounded-lg border-2 transition-all min-w-[60px] ${getSeatColor(seat)}`}
                              >
                                <div className="flex flex-col items-center">
                                  <Armchair className="w-4 h-4 mb-0.5" />
                                  <span className="text-xs font-bold">
                                    {seat.seatNumber.replace(/\d+/g, '')}
                                  </span>
                                  {isAvailable && !isSelectedByAnyPassenger && (
                                    <span className="text-[10px] font-bold mt-0.5">
                                      ₹{getSeatPrice(seat)}
                                    </span>
                                  )}
                                </div>
                                {(seat.seatCharacteristics?.includes('EXTRA_LEGROOM') ||
                                  seat.seatType === 'EMERGENCY_EXIT') && (
                                  <div className="absolute -top-1 -right-1">
                                    <Sparkles className="w-3 h-3 text-green-600" />
                                  </div>
                                )}
                                {isSelectedByAnyPassenger && (
                                  <div className="absolute -top-1 -right-1 bg-blue-600 rounded-full p-0.5">
                                    <Check className="w-2.5 h-2.5 text-white" />
                                  </div>
                                )}
                              </motion.button>
                            );
                          })}
                        </div>

                        {/* Aisle */}
                        <div className="w-8 border-l-2 border-r-2 border-dashed border-gray-300 h-12 flex items-center justify-center">
                          <span className="text-[10px] text-gray-400 font-medium rotate-90">
                            AISLE
                          </span>
                        </div>

                        {/* Right Section */}
                        <div className="flex gap-1">
                          {rightSeats.map((seat) => {
                            const isAvailable = seat.isAvailable && !seat.isOccupied && !seat.booked;
                            const isSelectedByAnyPassenger = selectedSeats.some(s => s?.id === seat.id);
                            const canSelect = isAvailable && !isSelectedByAnyPassenger;

                            return (
                              <motion.button
                                key={seat.id}
                                whileHover={canSelect ? { scale: 1.1 } : {}}
                                whileTap={canSelect ? { scale: 0.95 } : {}}
                                onClick={() => handleSeatClick(seat)}
                                disabled={!canSelect}
                                className={`relative p-2 rounded-lg border-2 transition-all min-w-[60px] ${getSeatColor(seat)}`}
                              >
                                <div className="flex flex-col items-center">
                                  <Armchair className="w-4 h-4 mb-0.5" />
                                  <span className="text-xs font-bold">
                                    {seat.seatNumber.replace(/\d+/g, '')}
                                  </span>
                                  {isAvailable && !isSelectedByAnyPassenger && (
                                    <span className="text-[10px] font-bold mt-0.5">
                                      ₹{getSeatPrice(seat)}
                                    </span>
                                  )}
                                </div>
                                {(seat.seatCharacteristics?.includes('EXTRA_LEGROOM') ||
                                  seat.seatType === 'EMERGENCY_EXIT') && (
                                  <div className="absolute -top-1 -right-1">
                                    <Sparkles className="w-3 h-3 text-green-600" />
                                  </div>
                                )}
                                {isSelectedByAnyPassenger && (
                                  <div className="absolute -top-1 -right-1 bg-blue-600 rounded-full p-0.5">
                                    <Check className="w-2.5 h-2.5 text-white" />
                                  </div>
                                )}
                              </motion.button>
                            );
                          })}
                        </div>

                        {/* Row Number (Right) */}
                        <span className="text-sm font-bold text-gray-700 w-8 text-center">
                          {row}
                        </span>
                      </div>
                    );
                  })}
              </div>

              {/* Additional Info */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-blue-800">
                    <span className="font-semibold">Tip:</span> Window seats offer great views,
                    while aisle seats provide easy access. Emergency exit rows have extra legroom
                    but come with additional responsibilities. Seats with blue checkmarks are already selected by other passengers.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 flex gap-3">
                <button
                  onClick={() => setShowSeatMap(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {totalSelectedSeats === passengerCount ? 'Done' : 'Close'}
                </button>
                {currentPassengerIndex < passengerCount - 1 && (
                  <button
                    onClick={() => setCurrentPassengerIndex(currentPassengerIndex + 1)}
                    className="flex-1 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Next Passenger →
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SeatSelection;
