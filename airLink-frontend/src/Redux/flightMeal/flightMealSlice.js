import { createSlice } from "@reduxjs/toolkit";
import {
  createFlightMeal,
  bulkCreateFlightMeals,
  fetchFlightMealsByFlightId,
  updateFlightMeal,
  updateFlightMealAvailability,
  deleteFlightMeal,
} from "./flightMealThunk";

const initialState = {
  flightMeals: [],
  currentFlightMeal: null,
  loading: false,
  error: null,
  totalPages: 0,
  totalElements: 0,
  currentPage: 0,
  pageSize: 20,
};

const flightMealSlice = createSlice({
  name: "flightMeal",
  initialState,
  reducers: {
    clearFlightMealError: (state) => {
      state.error = null;
    },
    clearCurrentFlightMeal: (state) => {
      state.currentFlightMeal = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create FlightMeal
      .addCase(createFlightMeal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFlightMeal.fulfilled, (state, action) => {
        state.loading = false;
        state.flightMeals.push(action.payload);
        state.currentFlightMeal = action.payload;
      })
      .addCase(createFlightMeal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Bulk Create FlightMeals
      .addCase(bulkCreateFlightMeals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkCreateFlightMeals.fulfilled, (state, action) => {
        state.loading = false;
        state.flightMeals.push(...action.payload);
      })
      .addCase(bulkCreateFlightMeals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch FlightMeals By Flight ID
      .addCase(fetchFlightMealsByFlightId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFlightMealsByFlightId.fulfilled, (state, action) => {
        console.log(
          "Reducer received flight meals: ----- ====== ++++", 
          action.payload);
        state.loading = false;
        state.flightMeals = action.payload;
      })
      .addCase(fetchFlightMealsByFlightId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update FlightMeal
      .addCase(updateFlightMeal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFlightMeal.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.flightMeals.findIndex((fm) => fm.id === action.payload.id);
        if (index !== -1) {
          state.flightMeals[index] = action.payload;
        }
        state.currentFlightMeal = action.payload;
      })
      .addCase(updateFlightMeal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update FlightMeal Availability
      .addCase(updateFlightMealAvailability.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFlightMealAvailability.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.flightMeals.findIndex((fm) => fm.id === action.payload.id);
        if (index !== -1) {
          state.flightMeals[index] = action.payload;
        }
        state.currentFlightMeal = action.payload;
      })
      .addCase(updateFlightMealAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete FlightMeal
      .addCase(deleteFlightMeal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFlightMeal.fulfilled, (state, action) => {
        state.loading = false;
        state.flightMeals = state.flightMeals.filter((fm) => fm.id !== action.payload);
        if (state.currentFlightMeal?.id === action.payload) {
          state.currentFlightMeal = null;
        }
      })
      .addCase(deleteFlightMeal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

  },
});

export const { clearFlightMealError, clearCurrentFlightMeal } = flightMealSlice.actions;
export default flightMealSlice.reducer;
