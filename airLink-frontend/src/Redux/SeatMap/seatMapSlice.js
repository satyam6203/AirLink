import { createSlice } from "@reduxjs/toolkit";
import {
  createSeatMap,
  updateSeatMap,
  getSeatMapsByCabinClass,
  deleteSeatMap,
} from "./seatMapThunk.js";

const seatMapSlice = createSlice({
  name: "seatMap",
  initialState: {
    seatMaps: [],
    seatMap: null,
    count: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearSeatMapError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Pending / Fulfilled / Rejected for each thunk
      .addCase(createSeatMap.pending, (state) => {
        console.log("⏳ createSeatMap pending");
        state.loading = true;
        state.error = null;
      })
      .addCase(createSeatMap.fulfilled, (state, action) => {
        console.log("✅ createSeatMap fulfilled");
        state.loading = false;
        state.seatMaps.push(action.payload);
      })
      .addCase(createSeatMap.rejected, (state, action) => {
        console.log("❌ createSeatMap rejected:", action.payload);
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateSeatMap.pending, (state) => {
        console.log("⏳ updateSeatMap pending");
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSeatMap.fulfilled, (state, action) => {
        console.log("✅ updateSeatMap fulfilled");
        state.loading = false;
        const index = state.seatMaps.findIndex(
          (s) => s.id === action.payload.id
        );
        if (index !== -1) state.seatMaps[index] = action.payload;
        if (state.seatMap?.id === action.payload.id)
          state.seatMap = action.payload;
      })
      .addCase(updateSeatMap.rejected, (state, action) => {
        console.log("❌ updateSeatMap rejected:", action.payload);
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getSeatMapsByCabinClass.pending, (state) => {
        console.log("⏳ getSeatMapsByCabinClass pending");
        state.loading = true;
        state.error = null;
      })
      .addCase(getSeatMapsByCabinClass.fulfilled, (state, action) => {
        console.log("✅ getSeatMapsByCabinClass fulfilled");
        state.loading = false;
        state.seatMap = action.payload;
      })
      .addCase(getSeatMapsByCabinClass.rejected, (state, action) => {
        console.log("❌ getSeatMapsByCabinClass rejected:", action.payload);
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteSeatMap.pending, (state) => {
        console.log("⏳ deleteSeatMap pending");
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSeatMap.fulfilled, (state, action) => {
        console.log("✅ deleteSeatMap fulfilled");
        state.loading = false;
        state.seatMaps = state.seatMaps.filter((s) => s.id !== action.payload);
        if (state.seatMap?.id === action.payload) state.seatMap = null;
      })
      .addCase(deleteSeatMap.rejected, (state, action) => {
        console.log("❌ deleteSeatMap rejected:", action.payload);
        state.loading = false;
        state.error = action.payload;
      })

;
  },
});

export const { clearSeatMapError } = seatMapSlice.actions;
export default seatMapSlice.reducer;
