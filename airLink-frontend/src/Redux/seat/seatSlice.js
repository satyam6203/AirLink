import { createSlice } from "@reduxjs/toolkit";
import {
  updateSeat
} from "./seatThunk.js";

const initialState = {
  seats: [],
  seat: null,
  loading: false,
  error: null
};

const seatSlice = createSlice({
  name: "seat",
  initialState,
  reducers: {
    clearSeatError: (state) => {
      state.error = null;
    },
    clearCurrentSeat: (state) => {
      state.seat = null;
    }
  },
  extraReducers: (builder) => {
    // ---------- UPDATE ----------
    builder
      .addCase(updateSeat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSeat.fulfilled, (state, action) => {
        state.loading = false;
        state.seat = action.payload;

        const index = state.seats.findIndex(s => s.id === action.payload.id);
        if (index !== -1) state.seats[index] = action.payload;
      })
      .addCase(updateSeat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearSeatError, clearCurrentSeat } = seatSlice.actions;
export default seatSlice.reducer;
