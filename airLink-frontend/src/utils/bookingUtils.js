// utils/bookingUtils.js

export const generateItineraryId = (flight) => {
  return btoa(
    `${flight.departureAirportCode}-${flight.arrivalAirportCode}-${flight.departureTime}`
  )
    .replace(/=/g, "")
    .substring(0, 40);
};

export const generateCrId = () => `cr-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

export const generateRKey = () =>
  `RKEY:${Math.random().toString(36).substring(2, 15)}:${Math.random()
    .toString(36)
    .substring(2, 15)}`;

export const buildPaxString = (adults = 1, children = 0, infants = 0) =>
  `A-${adults}_C-${children}_I-${infants}`;

export const encodeBase64 = (data) => btoa(JSON.stringify(data));
