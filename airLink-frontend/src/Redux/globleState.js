import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice.js";
import userReducer from "./user/userSlice.js";
import airlineReducer from "./airline/airlineSlice.js";
import aircraftReducer from "./aircraft/aircraftSlice.js";
import airportReducer from "./airport/airportSlice.js";
import flightReducer from "./flight/flightSlice.js";

import seatReducer from "./seat/seatSlice.js";
import seatMapReducer from "./SeatMap/seatMapSlice.js";
import cabinClassReducer from "./cabinClass/cabinClassSlice.js";
import cityReducer from "./city/citySlice.js";
import baggagePolicyReducer from "./baggagePolicy/baggagePolicySlice.js";
import bookingReducer from "./booking/bookingSlice.js";
import flightInstanceCabinReducer from "./flightInstanceCabin/flightInstanceCabinSlice.js";

import flightScheduleReducer from "./flightSchedule/flightScheduleSlice.js";
import flightInstanceReducer from "./flightInstance/flightInstanceSlice.js";
import fareRulesReducer from "./fareRules/fareRulesSlice.js";
import fareReducer from "./fare/fareSlice.js";
import ancillaryReducer from "./ancillary/ancillarySlice.js";
import flightCabinAncillaryReducer from "./flightCabinAncillary/flightCabinAncillarySlice.js";
import mealReducer from "./meal/mealSlice.js";
import flightMealReducer from "./flightMeal/flightMealSlice.js";
import paymentReducer from "./payment/paymentSlice.js";
import flightSearchReducer from "./flightSearch/flightSearchSlice.js";
import insuranceCoverageReducer from "./insuranceCoverage/insuranceCoverageSlice.js";
import couponReducer from "./coupon/couponSlice.js";

const globleState = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,

    // airline side
    airline: airlineReducer,
    aircraft: aircraftReducer,
    flight: flightReducer,

    seat: seatReducer,
    seatMap: seatMapReducer,
    cabinClass: cabinClassReducer,
    baggagePolicy: baggagePolicyReducer,
    booking: bookingReducer,
    payment: paymentReducer,
    flightInstanceCabin: flightInstanceCabinReducer,

    flightSchedule: flightScheduleReducer,
    flightInstance: flightInstanceReducer,
    flightSearch: flightSearchReducer,
    fareRules: fareRulesReducer,
    fare: fareReducer,
    ancillary: ancillaryReducer,
    flightCabinAncillary: flightCabinAncillaryReducer,
    meal: mealReducer,
    flightMeal: flightMealReducer,
    insuranceCoverage: insuranceCoverageReducer,
    coupon: couponReducer,

    // system admin side
    airport: airportReducer,
    city: cityReducer,
  },
});

export default globleState;
