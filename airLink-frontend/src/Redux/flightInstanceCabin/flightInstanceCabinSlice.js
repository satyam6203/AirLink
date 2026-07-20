import { createSlice } from "@reduxjs/toolkit";
import {
  updateFlightCabin,
  deleteFlightCabin,
 
  getFlightInstanceCabinsByFlightInstance,
  createFlightInstanceCabin,
  getFlightInstanceCabinById,
  getFlightInstanceCabinsByFlightInstanceAndCabinClass
} from "./flightInstanceCabinThunk.js";

const initialState = {
  cabins: [],
  cabin: null,
  loading: false,
  error: null
};

const flightInstanceCabinSlice = createSlice({
  name: "flightInstanceCabin",
  initialState,
  reducers: {
    clearFlightCabinError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {

    // ---------- CREATE ----------
    builder.addCase(createFlightInstanceCabin.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createFlightInstanceCabin.fulfilled, (state, action) => {
      state.loading = false;
      state.cabin = action.payload;
      state.cabins.push(action.payload);
    });
    builder.addCase(createFlightInstanceCabin.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // ---------- UPDATE ----------
    builder.addCase(updateFlightCabin.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateFlightCabin.fulfilled, (state, action) => {
      state.loading = false;
      state.cabin = action.payload;
      state.cabins = state.cabins.map(c => c.id === action.payload.id ? action.payload : c);
    });
    builder.addCase(updateFlightCabin.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // ---------- GET BY ID ----------
    builder.addCase(getFlightInstanceCabinById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getFlightInstanceCabinById.fulfilled, (state, action) => {
      state.loading = false;
      state.cabin = action.payload;
    });
    builder.addCase(getFlightInstanceCabinById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    builder.addCase(getFlightInstanceCabinsByFlightInstanceAndCabinClass.fulfilled, (state, action) => {
      state.loading = false;
      state.cabin = action.payload;
    });

    // ---------- DELETE ----------
    builder.addCase(deleteFlightCabin.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteFlightCabin.fulfilled, (state, action) => {
      state.loading = false;
      state.cabins = state.cabins.filter(c => c.id !== action.payload);
      if (state.cabin?.id === action.payload) state.cabin = null;
    });
    builder.addCase(deleteFlightCabin.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

  

    // ---------- GET BY FLIGHT ----------
    builder.addCase(getFlightInstanceCabinsByFlightInstance.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getFlightInstanceCabinsByFlightInstance.fulfilled, (state, action) => {
      state.loading = false;
      state.cabins = action.payload.content;
      state.pageable=action.payload.pageable


    });
    builder.addCase(getFlightInstanceCabinsByFlightInstance.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

  }
});

export const { clearFlightCabinError } = flightInstanceCabinSlice.actions;
export default flightInstanceCabinSlice.reducer;
