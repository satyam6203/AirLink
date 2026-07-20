import { createSlice } from "@reduxjs/toolkit";
import { searchFlightsAvailability } from "./flightSearchThunk.js";

const initialState = {
  // Search Results
  searchResults: {
    origin: null,
    destination: null,
    departureDate: null,
    passengers: 0,
    cabinClass: null,
    flights: [],
    totalResults: 0
  },

  // UI State
  loading: false,
  error: null,

  // Search Params (for re-search or modifications)
  lastSearchParams: null
};

const flightSearchSlice = createSlice({
  name: "flightSearch",
  initialState,
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = initialState.searchResults;
      state.error = null;
    },
    setLastSearchParams: (state, action) => {
      state.lastSearchParams = action.payload;
    }
  },
  extraReducers: (builder) => {
    // ---------- SEARCH FLIGHTS ----------
    builder
      .addCase(searchFlightsAvailability.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchFlightsAvailability.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
        state.lastSearchParams = action.meta.arg;
      })
      .addCase(searchFlightsAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {
  clearSearchResults,
  setLastSearchParams
} = flightSearchSlice.actions;

export default flightSearchSlice.reducer;
