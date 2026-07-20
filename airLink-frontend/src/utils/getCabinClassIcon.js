  export const getCabinClassIcon = (type) => {
    switch (type) {
      case "FIRST":
        return "👑"
      case "BUSINESS":
        return "💼"
      case "ECONOMY":
      default:
        return "✈️"
    }
  }