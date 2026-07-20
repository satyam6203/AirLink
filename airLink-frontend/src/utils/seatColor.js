export const getSeatColor = (selectedSeat,seat) => {
    if (selectedSeat?.id === seat.id) {
      return 'bg-blue-600 text-white border-blue-700';
    }

    // Check if seat is unavailable (blocked, inactive, or not bookable)
    if (!seat.isAvailable) {
      return 'bg-red-100 text-red-800 border-red-300';
    }

    // Check for premium or special seats
    if (seat.isPremiumSeat || seat.status === 'EXTRA_LEGROOM') {
      return 'bg-purple-100 text-purple-800 border-purple-300 hover:bg-purple-200';
    }

    // Check for emergency exit seats
    if (seat.isEmergencyExit) {
      return 'bg-orange-100 text-orange-800 border-orange-300 hover:bg-orange-200';
    }

    // Check for blocked seats
    if (seat.status === 'BLOCKED') {
      return 'bg-gray-100 text-gray-800 border-gray-300';
    }

    // Check for occupied seats
    if (seat.status === 'OCCUPIED') {
      return 'bg-red-100 text-red-800 border-red-300';
    }

    // Default available seat
    if (seat.status === 'AVAILABLE' || seat.isAvailable) {
      return 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200';
    }

    // Fallback
    return 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100';
  };