export const mockFlightData = {
  departure: {
    airport: "Indira Gandhi International Airport",
    city: "New Delhi",
    code: "DEL",
    terminal: "Terminal 3",
    time: "06:15",
    date: "Mon, 15 Jan"
  },
  arrival: {
    airport: "Chhatrapati Shivaji Maharaj International Airport",
    city: "Mumbai",
    code: "BOM",
    terminal: "Terminal 2",
    time: "08:45",
    date: "Mon, 15 Jan"
  },
  airline: {
    name: "IndiGo",
    code: "6E",
    flightNumber: "6E 2045",
    logo: "https://images.makemytrip.com/apac/flights/airlines/logos/6E.png"
  },
  duration: "2h 30m",
  stops: 0,
  aircraft: "Airbus A320",
  cabinClass: "Economy",
  baggage: {
    cabin: "7 Kgs (1 piece only) / Adult",
    checkIn: "15 Kgs (1 piece only) / Adult"
  },
  passengers: [
    {
      id: 1,
      type: "Adult",
      firstName: "John",
      lastName: "Doe",
      gender: "Male",
      age: 32
    }
  ]
};

export const mockFareData = {
  baseFare: 3599,
  taxes: 801,
  seatCharges: 0,
  mealCharges: 0,
  flexibilityAddOn: 0,
  tripSecure: 0,
  currency: "INR",
  totalPassengers: 1
};

export const mockPolicyData = {
  cancellation: {
    title: "Cancellation Policy",
    rules: [
      {
        timeframe: "0-2 hours before departure",
        penalty: "Non-refundable"
      },
      {
        timeframe: "2-24 hours before departure",
        penalty: "₹3,500 + ₹300 airline fee per passenger"
      },
      {
        timeframe: "24+ hours before departure",
        penalty: "₹2,500 + ₹300 airline fee per passenger"
      }
    ]
  },
  dateChange: {
    title: "Date Change Policy",
    rules: [
      {
        timeframe: "0-2 hours before departure",
        penalty: "₹3,000 + Fare difference"
      },
      {
        timeframe: "2-24 hours before departure",
        penalty: "₹2,500 + Fare difference"
      },
      {
        timeframe: "24+ hours before departure",
        penalty: "₹2,000 + Fare difference"
      }
    ]
  }
};

export const mockSeatsData = [
  { id: "1A", type: "window", price: 400, available: true, row: 1, column: "A" },
  { id: "1B", type: "middle", price: 200, available: true, row: 1, column: "B" },
  { id: "1C", type: "aisle", price: 300, available: true, row: 1, column: "C" },
  { id: "2A", type: "window", price: 400, available: false, row: 2, column: "A" },
  { id: "2B", type: "middle", price: 200, available: true, row: 2, column: "B" },
  { id: "2C", type: "aisle", price: 300, available: true, row: 2, column: "C" },
  { id: "3A", type: "window", price: 300, available: true, row: 3, column: "A" },
  { id: "3B", type: "middle", price: 150, available: true, row: 3, column: "B" },
  { id: "3C", type: "aisle", price: 250, available: true, row: 3, column: "C" },
  { id: "12A", type: "window-extra", price: 600, available: true, row: 12, column: "A", isExtraLegroom: true },
  { id: "12B", type: "middle-extra", price: 500, available: true, row: 12, column: "B", isExtraLegroom: true },
  { id: "12C", type: "aisle-extra", price: 600, available: true, row: 12, column: "C", isExtraLegroom: true }
];

export const mockMealsData = [
  {
    id: "veg-1",
    name: "Vegetable Biryani",
    description: "Aromatic basmati rice with seasonal vegetables",
    price: 250,
    category: "Vegetarian",
    image: "🍛",
    available: true
  },
  {
    id: "nonveg-1",
    name: "Chicken Tikka Wrap",
    description: "Grilled chicken with fresh vegetables in a wrap",
    price: 350,
    category: "Non-Vegetarian",
    image: "🌯",
    available: true
  },
  {
    id: "veg-2",
    name: "Paneer Sandwich",
    description: "Grilled paneer sandwich with mint chutney",
    price: 200,
    category: "Vegetarian",
    image: "🥪",
    available: true
  },
  {
    id: "snack-1",
    name: "Assorted Snack Box",
    description: "Mix of chips, cookies, and nuts",
    price: 150,
    category: "Snacks",
    image: "🍿",
    available: true
  }
];

export const flexibilityAddOnData = {
  title: "Unsure of your travel plans? Get full flexibility with our special add-ons.",
  options: [
    {
      id: "flex-basic",
      name: "Flex Basic",
      price: 299,
      features: [
        "Free date change (once)",
        "Change fee waiver",
        "Fare difference applicable",
        "Valid for 24 hours before departure"
      ],
      popular: false
    },
    {
      id: "flex-plus",
      name: "Flex Plus",
      price: 599,
      features: [
        "Free date change (twice)",
        "Change fee waiver",
        "Partial cancellation refund (50%)",
        "Valid till departure"
      ],
      popular: true
    }
  ]
};

export const tripSecureData = {
  title: "Protect your trip with TripSecure",
  description: "Comprehensive travel insurance covering medical emergencies, baggage loss, and trip cancellations.",
  options: [
    {
      id: "basic",
      name: "Basic Coverage",
      price: 149,
      features: [
        "Medical coverage up to ₹50,000",
        "Baggage loss up to ₹10,000",
        "Trip delay compensation",
        "24/7 assistance"
      ]
    },
    {
      id: "premium",
      name: "Premium Coverage",
      price: 299,
      features: [
        "Medical coverage up to ₹2,00,000",
        "Baggage loss up to ₹25,000",
        "Trip cancellation refund (75%)",
        "Flight delay compensation",
        "24/7 priority assistance"
      ],
      recommended: true
    }
  ]
};
