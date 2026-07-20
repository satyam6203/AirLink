// Mock data for aircraft, cabins, and seats

export const mockAircraft = {
  id: "aircraft_1",
  code: "SW-789",
  model: "Boeing 737-800",
  manufacturer: "Boeing",
  yearOfManufacture: 2019,
  registrationNumber: "N789SW",
  registrationDate: "2019-03-15T00:00:00Z",
  seatingCapacity: 180,
  totalSeats: 180,
  economySeats: 150,
  premiumEconomySeats: 18,
  businessSeats: 12,
  firstClassSeats: 0,
  rangeKm: 5765,
  cruisingSpeedKmh: 850,
  maxAltitudeFt: 41000,
  status: "ACTIVE",
  isAvailable: true,
  currentLocation: "John F. Kennedy International Airport (JFK)",
  nextMaintenanceDate: "2024-12-15T00:00:00Z",
  configuration: "Single-aisle",
  createdAt: "2024-01-15T10:30:00Z",
  updatedAt: "2024-09-20T15:45:00Z"
};

export const mockCabins = [
  {
    id: "cabin_1",
    aircraftId: "aircraft_1",
    name: "Business Class",
    cabinClass: "BUSINESS",
    startRow: 1,
    endRow: 3,
    rowRange: "1-3",
    seatCount: 12,
    totalSeats: 12,
    seatsPerRow: 4,
    seatConfiguration: "2-2",
    seatPitch: 42,
    seatWidth: 21,
    status: "ACTIVE",
    isBookable: true,
    isActive: true,
    amenities: [
      "WiFi",
      "Power Outlet",
      "Premium Meal Service",
      "Priority Boarding",
      "Extra Legroom",
      "In-Flight Entertainment"
    ]
  },
  {
    id: "cabin_2",
    aircraftId: "aircraft_1",
    name: "Premium Economy",
    cabinClass: "PREMIUM_ECONOMY",
    startRow: 4,
    endRow: 6,
    rowRange: "4-6",
    seatCount: 18,
    totalSeats: 18,
    seatsPerRow: 6,
    seatConfiguration: "3-3",
    seatPitch: 36,
    seatWidth: 18.5,
    status: "ACTIVE",
    isBookable: true,
    isActive: true,
    amenities: [
      "WiFi",
      "Power Outlet",
      "Enhanced Meal Service",
      "Extra Legroom",
      "In-Flight Entertainment"
    ]
  },
  {
    id: "cabin_3",
    aircraftId: "aircraft_1",
    name: "Economy Class",
    cabinClass: "ECONOMY",
    startRow: 7,
    endRow: 31,
    rowRange: "7-31",
    seatCount: 150,
    totalSeats: 150,
    seatsPerRow: 6,
    seatConfiguration: "3-3",
    seatPitch: 32,
    seatWidth: 17.5,
    status: "ACTIVE",
    isBookable: true,
    isActive: true,
    amenities: [
      "WiFi",
      "Basic Meal Service",
      "In-Flight Entertainment"
    ]
  }
];

// Generate comprehensive mock seat data for 6x30 layout
export const generateMockSeats = (cabinId, startRow, endRow, seatsPerRow = 6) => {
  const seats = [];
  const seatLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
  const cabin = mockCabins.find(c => c.id === cabinId);

  for (let row = startRow; row <= endRow; row++) {
    for (let col = 0; col < seatsPerRow; col++) {
      const seatLetter = seatLetters[col];
      const seatNumber = `${row}${seatLetter}`;

      // Determine seat type based on position
      let seatType = 'MIDDLE';
      if (col === 0 || col === seatsPerRow - 1) {
        seatType = 'WINDOW';
      } else if (col === 2 || col === 3) {
        seatType = 'AISLE';
      }

      // Generate varied statuses
      let status = 'AVAILABLE';
      let isAvailable = true;

      // Make some seats have special status
      if (Math.random() < 0.05) {
        status = 'BLOCKED';
        isAvailable = false;
      } else if (Math.random() < 0.1) {
        status = 'EXTRA_LEGROOM';
      } else if (Math.random() < 0.02) {
        status = 'MAINTENANCE';
        isAvailable = false;
      }

      // Generate amenities based on cabin class and random chance
      const baseAmenities = cabin?.amenities || [];
      const seatAmenities = [...baseAmenities];

      if (status === 'EXTRA_LEGROOM') {
        seatAmenities.push('Extra Legroom');
      }

      if (Math.random() < 0.3) {
        seatAmenities.push('Power Outlet');
      }

      seats.push({
        id: `${cabinId}_${seatNumber}`,
        seatNumber,
        row,
        column: seatLetter,
        seatType,
        status,
        isAvailable,
        seatClass: cabin?.cabinClass || 'ECONOMY',
        seatPitch: cabin?.seatPitch || 32,
        seatWidth: cabin?.seatWidth || 17.5,
        hasRecline: cabin?.cabinClass !== 'ECONOMY' || Math.random() > 0.1,
        reclineAngle: cabin?.cabinClass === 'BUSINESS' ? 160 :
                     cabin?.cabinClass === 'PREMIUM_ECONOMY' ? 140 : 120,
        amenities: seatAmenities,
        specialFeatures: status === 'EXTRA_LEGROOM' ? ['Extra Legroom Space'] : [],
        cabinClassId: cabinId,
        aircraftId: cabin?.aircraftId || 'aircraft_1',
        notes: status === 'BLOCKED' ? 'Temporarily out of service' : '',
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-09-20T15:45:00Z"
      });
    }
  }

  return seats;
};

// Generate all seats for the mock aircraft
export const mockSeats = [
  ...generateMockSeats('cabin_1', 1, 3, 4),  // Business: 4 seats per row
  ...generateMockSeats('cabin_2', 4, 6, 6),  // Premium Economy: 6 seats per row
  ...generateMockSeats('cabin_3', 7, 31, 6)  // Economy: 6 seats per row
];

// Additional aircraft for the fleet
export const mockAircraftFleet = [
  mockAircraft,
  {
    id: "aircraft_2",
    code: "SW-456",
    model: "Airbus A320",
    manufacturer: "Airbus",
    yearOfManufacture: 2020,
    registrationNumber: "N456SW",
    registrationDate: "2020-06-10T00:00:00Z",
    seatingCapacity: 160,
    totalSeats: 160,
    economySeats: 140,
    premiumEconomySeats: 20,
    businessSeats: 0,
    firstClassSeats: 0,
    rangeKm: 6150,
    cruisingSpeedKmh: 840,
    maxAltitudeFt: 39000,
    status: "ACTIVE",
    isAvailable: true,
    currentLocation: "Los Angeles International Airport (LAX)",
    nextMaintenanceDate: "2024-11-20T00:00:00Z",
    configuration: "Single-aisle",
    createdAt: "2024-02-20T14:15:00Z",
    updatedAt: "2024-09-21T09:30:00Z"
  },
  {
    id: "aircraft_3",
    code: "SW-123",
    model: "Boeing 777-300ER",
    manufacturer: "Boeing",
    yearOfManufacture: 2018,
    registrationNumber: "N123SW",
    registrationDate: "2018-11-05T00:00:00Z",
    seatingCapacity: 396,
    totalSeats: 396,
    economySeats: 296,
    premiumEconomySeats: 60,
    businessSeats: 32,
    firstClassSeats: 8,
    rangeKm: 14685,
    cruisingSpeedKmh: 905,
    maxAltitudeFt: 43100,
    status: "MAINTENANCE",
    isAvailable: false,
    currentLocation: "Maintenance Facility - Dallas (DFW)",
    nextMaintenanceDate: "2024-10-15T00:00:00Z",
    configuration: "Wide-body",
    createdAt: "2024-01-05T11:20:00Z",
    updatedAt: "2024-09-18T16:45:00Z"
  }
];

export default {
  mockAircraft,
  mockCabins,
  mockSeats,
  mockAircraftFleet,
  generateMockSeats
};