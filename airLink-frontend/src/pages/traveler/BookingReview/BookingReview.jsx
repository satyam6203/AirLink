import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CreditCard, X, AlertCircle } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

// Import components
import FlightDetailsOverview from "./FlightDetailsOverview";
import TravellerDetailsForm from "./TravellerDetailsForm";
import SeatSelection from "./SeatSelection";
import MealSelection from "./MealSelection";
import BaggageSelection from "./BaggageSelection";
import CancellationAndDateChangePolicy from "./CancellationAndDateChangePolicy";

import TripSecure from "./TripSecure";
import ImportantInformation from "./ImportantInformation";
import FareSummaryCard from "./FareSummaryCard";

// Import Redux thunks
import {
  getAllFlightCabinAncillariesByType,
  getFlightCabinAncillariesByType,
} from "@/Redux/flightCabinAncillary/flightCabinAncillaryThunk";
import { getFlightInstanceById } from "@/Redux/flightInstance/flightInstanceThunk";
import { createBooking } from "@/Redux/booking/bookingThunk";

import { getFareRuleByFare } from "@/Redux/fareRules/fareRulesThunk";
import { fetchFlightMealsByFlightId } from "@/Redux/flightMeal/flightMealThunk";
import { getFlightInstanceCabinsByFlightInstanceAndCabinClass } from "@/Redux/flightInstanceCabin/flightInstanceCabinThunk";
import { getBaggagePolicyByFare } from "@/Redux/baggagePolicy/baggagePolicyThunk";
import { getFareById } from "@/Redux/fare/fareThunk";

const BookingReview = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const { fare: selectedFare } = useSelector((store) => store.fare);
  const { flightInstance } = useSelector((store) => store.flightInstance);

  // Redux state
  const { ancillariesByType } = useSelector(
    (state) => state.flightCabinAncillary,
  );

  const { loading: bookingLoading, error: bookingError } = useSelector(
    (state) => state.booking,
  );

  // State management
  const [travellerData, setTravellerData] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]); // Changed to array for multiple passengers
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [selectedBaggage, setSelectedBaggage] = useState([]);
 
  const [selectedTravelProtection, setSelectedTravelProtection] = useState(null);

  const [loading, setLoading] = useState(true);
  const [flightId, setFlightId] = useState(null);
  const [fareId, setFareId] = useState(null);
  const [totalPassengers, setTotalPassagners] = useState(1);

  const [flightInstanceId, setFlightInstanceId] = useState(null);

  // Helper function to calculate seat price
  const getSeatPrice = (seat) => {
    if (!seat) return 0;
    if (
      seat.seatCharacteristics?.includes("EXTRA_LEGROOM") ||
      seat.seatType === "EMERGENCY_EXIT"
    ) {
      return 800;
    }
    if (seat.seatType === "WINDOW" || seat.seatType === "AISLE") {
      return 300;
    }
    return 150; // Middle seat
  };

  // Handle seat selection with price calculation for multiple passengers
  const handleSeatSelection = (passengerIndex, seat) => {
    const updatedSeats = [...selectedSeats];

    console.log("seat --------- ))))))))) ",seat)
    if (seat) {
      updatedSeats[passengerIndex] = {
        ...seat,
        price: getSeatPrice(seat),
      };
    } else {
      updatedSeats[passengerIndex] = null;
    }
    setSelectedSeats(updatedSeats);
  };

  // Load booking data from URL parameters and sessionStorage
  useEffect(() => {
    try {
      // Get URL parameters
      const itineraryId = searchParams.get("itineraryId");
      const xflt = searchParams.get("xflt");
      const numberOfTravellers = searchParams.get("numberOfTravellers");
      const cabinClass = searchParams.get("cabinClass");
      const flight_instance_id = searchParams.get("flightInstanceId");
      const flightId = searchParams.get("flightId");

      const fare_id = searchParams.get("fareId");

      console.log("BookingReview URL Params: -------------------", {
        itineraryId,
        cur: searchParams.get("cur"),
        ccde: searchParams.get("ccde"),
        crId: searchParams.get("crId"),
        rKey: searchParams.get("rKey"),
        xflt,
        numberOfTravellers,
        cabinClass,
        fareId: fare_id,
        passengerCount,
        flightId,
      });

      // Extract IDs from booking data
      if (flightId) {
        setFlightId(flightId);
      }
      if (fare_id) {
        setFareId(fare_id);
      }
      if (flight_instance_id) {
        setFlightInstanceId(flight_instance_id);
      }
      if (totalPassengers) setTotalPassagners(totalPassengers);

      // Decode search filter if available
      if (xflt) {
        const searchFilter = JSON.parse(atob(xflt));
        console.log("Decoded Search Filter:", searchFilter);
      }

      // Get booking data from sessionStorage
      const storedBookingData = sessionStorage.getItem("bookingData");
      if (storedBookingData) {
        const parsedData = JSON.parse(storedBookingData);

        console.log("Loaded Booking Data:", parsedData);
      } else {
        console.warn(
          "No booking data found in sessionStorage, using mock data",
        );
      }
    } catch (error) {
      console.error("Error loading booking data:", error);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    if (fareId) {
      dispatch(getBaggagePolicyByFare(fareId));
      dispatch(getFareRuleByFare(fareId));
      dispatch(getFareById(fareId));
    }
  }, [fareId, dispatch]);

  // Fetch flight instance data when flightInstanceId is available
  useEffect(() => {
    if (flightInstanceId) {
      console.log("Fetching flight instance:", flightInstanceId);
      dispatch(getFlightInstanceById(flightInstanceId));
      dispatch(
        getFlightInstanceCabinsByFlightInstanceAndCabinClass({
          flightInstanceId,
          cabinClassId:selectedFare?.cabinClassId
        }),
      );
    }
  }, [flightInstanceId, dispatch, selectedFare]);

  // Fetch ancillaries by type when flightId and cabinClassId are available
  useEffect(() => {
    if (flightId) {
      // fetch meals by flightId (not cabin-specific)
      dispatch(fetchFlightMealsByFlightId(flightId));
    }

    if (flightId && selectedFare?.cabinClassId) {
      const cabinClassId = selectedFare?.cabinClassId;
     

      // Fetch Travel Protection (flexibility, cancellation protection)
      dispatch(
        getFlightCabinAncillariesByType({
          flightId,
          cabinClassId,
          type: "TRAVEL_PROTECTION",
        }),
      );

      // Fetch Baggage
      dispatch(
        getAllFlightCabinAncillariesByType({
          flightId,
          cabinClassId,
          type: "BAGGAGE",
        }),
      );
    }
  }, [flightId, selectedFare, dispatch]);

  // Get passenger count from URL params or mock data
  const passengerCount = parseInt(searchParams.get("numberOfTravellers"));
 
  const handleProceedToPayment = async () => {
    // Validate traveller data
    const isAllTravellersComplete =
      travellerData?.passengers.length === passengerCount &&
      travellerData.passengers.every(
        (t) => t.title && t.firstName && t.lastName && t.gender,
      );

    console.log("Traveller Data Validation:", travellerData);

    if (!isAllTravellersComplete) {
      toast.error("Please fill all required traveller details");
      return;
    }

    if (
      travellerData[0] &&
      (!travellerData[0].email || !travellerData[0].phone)
    ) {
      toast.error("Please provide contact email and phone number");
      return;
    }

    // Calculate totals for summary - sum up all seats for multiple passengers
    const seatCharges = selectedSeats.reduce(
      (sum, seat) => sum + (seat?.price || 0),
      0,
    );
    const mealCharges = selectedMeals.reduce(
      (sum, meal) => sum + (meal.price || 0),
      0,
    );
    const baggageCharges = selectedBaggage.reduce(
      (sum, bag) => sum + (bag.price || 0) * (bag.quantity || 0),
      0,
    );

    const travelProtectionData = ancillariesByType?.TRAVEL_PROTECTION || {};
    const travelProtectionCharge =
      selectedTravelProtection && travelProtectionData?.price ? travelProtectionData.price : 0;
   

    const baseFare = selectedFare?.baseFare || 0;
    const taxes = selectedFare?.taxes || 0;
    const subtotal = baseFare + taxes;
    const addOnsTotal =
      seatCharges +
      mealCharges +
      baggageCharges +
      travelProtectionCharge;
    const grandTotal = subtotal + addOnsTotal;

    // Collect all ancillary IDs
    const ancillaryIds = [];

    // Add seat ancillary IDs for all passengers
    // selectedSeats.forEach((seat) => {
    //   if (seat?.id) {
    //     ancillaryIds.push(seat.id);
    //   }
    // });

    const mealIds = [];

    // Add meal ancillary IDs
    selectedMeals.forEach((meal) => {
      if (meal.flightMealId) mealIds.push(meal.flightMealId);
    });

    // Add baggage ancillary IDs
    selectedBaggage.forEach((bag) => {
      if (bag.id) {
        // Add multiple times based on quantity
        for (let i = 0; i < bag.quantity; i++) {
          ancillaryIds.push(bag.id);
        }
      }
    });

    // Add travel protection ancillary ID
    if (selectedTravelProtection && travelProtectionData?.id) {
      ancillaryIds.push(travelProtectionData.id);
    }

    
   

    // Get seat numbers array for all passengers
    const seatNumbers = selectedSeats
      .filter((seat) => seat !== null && seat !== undefined)
      .map((seat) => seat.seatNumber);

    // Get dietary preferences from selected meals
    const getDietaryPreference = (passengerIndex) => {
      const passengerMeal = selectedMeals[passengerIndex];
      if (passengerMeal?.dietaryRestriction) {
        const restrictions = {
          VEGETARIAN: "Vegetarian",
          VEGAN: "Vegan",
          HALAL: "Halal",
          KOSHER: "Kosher",
          GLUTEN_FREE: "Gluten Free",
        };
        return restrictions[passengerMeal.dietaryRestriction] || null;
      }
      return null;
    };

    // Backend API format booking data
    const bookingDataForAPI = {
      flightId: parseInt(flightId) || null,
      flightInstanceId: parseInt(flightInstanceId) || null,
      cabinClass: searchParams.get("cabinClass") || "ECONOMY",
      tripType: searchParams.get("tripType") || "ONE_WAY",
      fareId: parseInt(fareId) || null,
      passengers: travellerData.passengers.map((t, index) => ({
        firstName: t.firstName || "",
        lastName: t.lastName || "",
        email: t.email || "",
        phone: t.phone ? `${t.countryCode || "+91"}${t.phone}` : "",
        dateOfBirth: t.dob || null,
        gender: t.gender ? t.gender.toUpperCase() : null,
        seatNumber: selectedSeats[index]
          ? selectedSeats[index].seatNumber
          : null,
        seatInstanceId: selectedSeats[index] ? selectedSeats[index].id : null,
        passportNumber: t.passportNumber || null,
        nationality: t.nationality || "IN",
        frequentFlyerNumber: t.frequentFlyerNumber || null,
        requiresWheelchairAssistance: t.requiresWheelchairAssistance || false,
        dietaryPreferences: getDietaryPreference(index),
        medicalConditions: t.medicalConditions || null,
      })),
      contactInfo:travellerData.contactInfo,
      ancillaryIds: ancillaryIds,
      mealIds: mealIds,
      promoCode: searchParams.get("promoCode") || null,
      seatNumbers: seatNumbers,
    };

    console.log("\n═══════════════════════════════════════════════════");
    console.log("🎫 BOOKING DATA FOR BACKEND API");
    console.log("═══════════════════════════════════════════════════\n");
    console.log(JSON.stringify(bookingDataForAPI, null, 2));
    console.log("\n═══════════════════════════════════════════════════");
    console.log("💰 PAYMENT SUMMARY");
    console.log("═══════════════════════════════════════════════════");
    console.log(`Passengers:          ${passengerCount}`);
    console.log(`Base Fare:           ₹${baseFare.toLocaleString()}`);
    console.log(`Taxes & Fees:        ₹${taxes.toLocaleString()}`);
    console.log(`Seat:                ₹${seatCharges.toLocaleString()}`);
    console.log(
      `Meals (${selectedMeals}):          ₹${mealCharges.toLocaleString()}  ${mealIds}`,
    );
    console.log(
      `Baggage (${selectedBaggage.reduce(
        (sum, b) => sum + b.quantity,
        0,
      )}):        ₹${baggageCharges.toLocaleString()}`,
    );

    console.log("───────────────────────────────────────────────────");
    console.log(`TOTAL:               ₹${grandTotal.toLocaleString()}`);
    console.log("═══════════════════════════════════════════════════");
    console.log(`\n📋 Ancillary IDs: [${ancillaryIds.join(", ")}]`);
    console.log(
      `💺 Seat Numbers: [${seatNumbers.map((s) => `"${s}"`).join(", ")}]`,
    );
    console.log("═══════════════════════════════════════════════════\n");

    console.log("Submitting booking data to backend API...",bookingDataForAPI);

    // Call the booking API
    try {
      toast.loading("Creating your booking...", { id: "booking-toast" });

      const result = await dispatch(createBooking(bookingDataForAPI)).unwrap();

      console.log("✅ Booking created successfully:", result);

      // Check for payment redirect URL
      const checkoutUrl = result.checkoutUrl || result.payment_link_url;

      if (checkoutUrl && result.success) {
        // Show redirecting message
        toast.success("Booking created! Redirecting to payment gateway...", {
          id: "booking-toast",
          duration: 3000,
        });
        // The thunk will handle the redirect
      } else if (result.success) {
        // No payment needed, booking confirmed
        toast.success(
          `Booking confirmed! Total: ₹${grandTotal.toLocaleString()}\nBooking Reference: ${
            result.bookingReference || "N/A"
          }`,
          { id: "booking-toast", duration: 5000 },
        );
      } else {
        toast.error(result.message || "Booking failed. Please try again.", {
          id: "booking-toast",
        });
      }
    } catch (error) {
      console.error("❌ Booking failed:", error);
      toast.error(`Booking failed: ${error || "Please try again"}`, {
        id: "booking-toast",
      });
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  // Use real booking data if available, otherwise use mock data

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Error Notification */}
      <AnimatePresence>
        {bookingError && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50 max-w-md"
          >
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-red-900 mb-1">
                    Booking Failed
                  </h3>
                  <p className="text-sm text-red-700">{bookingError}</p>
                </div>
                <button
                  onClick={() =>
                    dispatch({ type: "booking/clearBookingError" })
                  }
                  className="text-red-400 hover:text-red-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back to Flight Search</span>
            </button>
            <div className="hidden md:block">
              <p className="text-sm text-gray-600">
                Need help? Call:{" "}
                <span className="font-semibold text-blue-600">
                  1800-123-4567
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Complete Your Booking
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              Review your flight details and fill in traveller information
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="col-span-1 lg:col-span-2 space-y-6">
              {/* 1. Flight Details Summary */}
              <FlightDetailsOverview flightData={flightInstance} />

              {/* Travel Insurance - Using real API data */}
              <TripSecure
                selectedTravelProtection={selectedTravelProtection}
                onSelectTravelProtection={setSelectedTravelProtection}
              />

              {/* 5. Cancellation & Date Change Policy - Using real API data */}
              <CancellationAndDateChangePolicy />

              {/* 2. Traveller Details Form */}
              <TravellerDetailsForm
                passengerCount={passengerCount}
                onTravellerDataChange={setTravellerData}
              />

              {/* 3. Add-ons Section */}
              <div className="space-y-6">
                {/* Seat Selection */}
                {/* Now using Redux data from flightInstance.seats and flightInstance.seatMap */}
                <SeatSelection
                  selectedSeats={selectedSeats}
                  onSelectSeat={handleSeatSelection}
                  passengerCount={passengerCount}
                />

                {/* Meal Selection */}
                {/* Note: Meals are managed via separate Meal entity, not ancillaries */}
                {/* Now using Redux data from flightMeal store */}
                <MealSelection
                  selectedMeals={selectedMeals}
                  onSelectMeal={setSelectedMeals}
                />

                {/* Baggage Selection */}
                {/* Using Redux data from ancillariesByType.BAGGAGE */}
                <BaggageSelection
                  selectedBaggage={selectedBaggage}
                  onSelectBaggage={setSelectedBaggage}
                />

                {/* 6. Important Information */}
                <ImportantInformation />
              </div>
            </div>

            {/* Right Column - Fare Summary (Sticky) */}
            <div className="col-span-1">
              <div className="sticky top-24">
                <FareSummaryCard
                  fareData={selectedFare}
                  selectedSeats={selectedSeats}
                  selectedMeals={selectedMeals}
                  selectedBaggage={selectedBaggage}
                  travelProtection={selectedTravelProtection}
                  onProceedToPayment={handleProceedToPayment}
                  isLoading={bookingLoading}
                  totalPassengers={totalPassengers}
                />
              </div>
            </div>
          </div>

          {/* Mobile Sticky Bottom Bar */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-30">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs text-gray-600">Total Amount</p>
                <p className="text-lg font-bold text-gray-900">
                  ₹{1000000000000000000}
                </p>
              </div>
              <button
                onClick={handleProceedToPayment}
                disabled={bookingLoading}
                className="flex-1 max-w-xs py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {bookingLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Continue
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Add padding at bottom for mobile sticky bar */}
          <div className="lg:hidden h-24"></div>
        </motion.div>
      </div>
    </div>
  );
};

export default BookingReview;
