import { createSlice } from "@reduxjs/toolkit";
import {
  createFare,
  getFareById,
  getFlightFares,
  updateFare,
  deleteFare,
  searchFares
} from "./fareThunk.js";

const initialState = {
  fares: [],
  fare: null,
  loading: false,
  error: null,
  // Search results
  searchResults: null,
  searchLoading: false,
  searchError: null
};

const fareSlice = createSlice({
  name: "fare",
  initialState,
  reducers: {
    clearFareError: (state) => {
      state.error = null;
    },
    clearCurrentFare: (state) => {
      state.fare = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = null;
      state.searchError = null;
    }
  },
  extraReducers: (builder) => {
    // ---------- CREATE ----------
    builder
      .addCase(createFare.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFare.fulfilled, (state, action) => {
        state.loading = false;
        state.fare = action.payload;
        state.fares.unshift(action.payload);
      })
      .addCase(createFare.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ---------- GET BY ID ----------
    builder
      .addCase(getFareById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFareById.fulfilled, (state, action) => {
        state.loading = false;
        state.fare = action.payload;
      })
      .addCase(getFareById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ---------- GET FLIGHT FARES ----------
    builder
      .addCase(getFlightFares.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFlightFares.fulfilled, (state, action) => {
        state.loading = false;
        state.fares = action.payload || [];
      })
      .addCase(getFlightFares.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ---------- UPDATE ----------
    builder
      .addCase(updateFare.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFare.fulfilled, (state, action) => {
        state.loading = false;
        state.fare = action.payload;

        const index = state.fares.findIndex(f => f.id === action.payload.id);
        if (index !== -1) state.fares[index] = action.payload;
      })
      .addCase(updateFare.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ---------- DELETE ----------
    builder
      .addCase(deleteFare.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFare.fulfilled, (state, action) => {
        state.loading = false;
        state.fares = state.fares.filter(f => f.id !== action.payload);
        if (state.fare?.id === action.payload) state.fare = null;
      })
      .addCase(deleteFare.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ---------- SEARCH FARES ----------
    builder
      .addCase(searchFares.pending, (state) => {
        state.searchLoading = true;
        state.searchError = null;
      })
      .addCase(searchFares.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.fares = action.payload;
      })
      .addCase(searchFares.rejected, (state, action) => {
        state.searchLoading = false;
        state.searchError = action.payload;
      });
  }
});

export const { clearFareError, clearCurrentFare, clearSearchResults } = fareSlice.actions;
export default fareSlice.reducer;
