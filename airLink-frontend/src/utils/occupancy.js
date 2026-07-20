  
  export const getOccupancyPercentage = (booked, total) => {
    return Math.round((booked / total) * 100);
  };
  export const getOccupancyColor = (percentage) => {
    if (percentage >= 90) return "text-red-600";
    if (percentage >= 70) return "text-yellow-600";
    return "text-green-600";
  };