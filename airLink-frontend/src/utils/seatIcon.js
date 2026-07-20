export const getSeatIcon = (seat) => {
  if(!seat) return ""
  const type = seat?.seatType?.toLowerCase() || seat?.type?.toLowerCase();

  if (seat.blocked) return "❌";
  if (seat.isOccupied) return "👤";
  // if (seat.status === "maintenance") return "🔧";

  switch (type) {
    case "window":
      return "🪟";
    case "aisle":
      return "🚶";
    case "middle":
      return "🪑";
    default:
      return "💺";
  }
};
