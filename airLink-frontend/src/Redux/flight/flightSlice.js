import { createSlice } from "@reduxjs/toolkit";
import {
  createFlight,
  getFlightById,
  updateFlight,
  deleteFlight,
  getFlightsByAirline,
  getFlightsByAircraft,
} from "./flightThunk.js";


const initialState = {
  flights: [],
  flight: null,
  loading: false,
  error: null
};

const flightSlice = createSlice({
  name: "flight",
  initialState,
  reducers: {
    clearFlightError: (state) => {
      state.error = null;
    },
    clearCurrentFlight: (state) => {
      state.flight = null;
    }
  },
  extraReducers: (builder) => {
    // ---------- CREATE ----------
    builder
      .addCase(createFlight.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFlight.fulfilled, (state, action) => {
        state.loading = false;
        // state.flight = action.payload;
        state.flights.unshift(action.payload);
      })
      .addCase(createFlight.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ---------- GET BY ID ----------
    builder
      .addCase(getFlightById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFlightById.fulfilled, (state, action) => {
        console.log("Flight fetched:", action.payload);
        state.loading = false;
        state.flight = action.payload;

        console.log("Updated state.flight:", state.flight);
      })
      .addCase(getFlightById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ---------- SEARCH BY NUMBER & DATE ----------
    // builder
    //   .addCase(getFlightByNumberAndDate.pending, (state) => {
    //     state.loading = true;
    //     state.error = null;
    //   })
    //   .addCase(getFlightByNumberAndDate.fulfilled, (state, action) => {
    //     state.loading = false;
    //     state.flight = action.payload;
    //   })
    //   .addCase(getFlightByNumberAndDate.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.payload;
    //   });

    // ---------- UPDATE ----------
    builder
      .addCase(updateFlight.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFlight.fulfilled, (state, action) => {
        state.loading = false;
        // state.flight = action.payload;

        const index = state.flights.findIndex(f => f.id === action.payload.id);
        if (index !== -1) state.flights[index] = action.payload;
      })
      .addCase(updateFlight.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ---------- DELETE ----------
    builder
      .addCase(deleteFlight.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFlight.fulfilled, (state, action) => {
        state.loading = false;
        state.flights = state.flights.filter(f => f.id !== action.payload);
        if (state.flight?.id === action.payload) state.flight = null;
      })
      .addCase(deleteFlight.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ---------- GET BY AIRLINE ----------
    builder
      .addCase(getFlightsByAirline.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFlightsByAirline.fulfilled, (state, action) => {
        state.loading = false;
        state.flights = action.payload.content;
      })
      .addCase(getFlightsByAirline.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ---------- GET BY AIRCRAFT ----------
    builder
      .addCase(getFlightsByAircraft.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFlightsByAircraft.fulfilled, (state, action) => {
        state.loading = false;
        state.flights = action.payload;
      })
      .addCase(getFlightsByAircraft.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

  }
});

export const { clearFlightError, clearCurrentFlight } = flightSlice.actions;
export default flightSlice.reducer;
