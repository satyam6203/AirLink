// services/bookingService.js

import { encodeBase64,generateItineraryId,
  generateCrId,
  generateRKey,
  buildPaxString } from "@/utils/bookingUtils";


export const buildBookingPayload = ({
  flight,
  selectedFare,
  selectedCabinClass,
  numberOfTravellers,
}) => {
  if (!flight || !selectedFare || !selectedCabinClass) {
    throw new Error("Invalid booking data");
  }

  const itineraryId = generateItineraryId(flight);
  const crId = generateCrId();
  const rKey = generateRKey();
  const paxString = buildPaxString(numberOfTravellers);

  const searchFilter = {
    c: selectedCabinClass.name?.charAt(0) || "E",
    p: paxString,
    s: `${flight.departureAirportCode}-${flight.arrivalAirportCode}-${flight.departureTime}`,
    ItineraryId: itineraryId,
    PaxType: paxString,
    Intl: false,
    CabinClass: selectedCabinClass.name,
    Ccde: "IN",
    ForwardFlowRequired: true,
    flightInstanceId: flight.id,
    flightId:flight.flightId
  };

  const xflt = encodeBase64(searchFilter);

  const bookingData = {
    flight: { ...flight, selectedCabinClass },
    fare: selectedFare,
    flightType: flight.flightType,
  };

  return {
    bookingData,
    queryParams: {
      itineraryId,
      cur: "INR",
      ccde: "IN",
      crId,
      rKey: encodeURIComponent(rKey),
      userCurrency: "INR",
      xflt,
      numberOfTravellers: String(numberOfTravellers),
      cabinClass: selectedCabinClass.name,
      flightInstanceId: flight.id,
      flightId: flight.flightId,
      fareId: selectedFare.id,
    },
  };
};
