import { createSlice } from "@reduxjs/toolkit";
import {
  createCabinClass,
  deleteCabinClass,
  getCabinClassById,
  getCabinClassesByAircraft,
  updateCabinClass,
} from "./cabinClassThunk.js";

const cabinClassSlice = createSlice({
  name: "cabinClass",
  initialState: {
    cabinClasses: [],
    cabinClass: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCabinClassError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Cabin Class
      .addCase(createCabinClass.pending, (state) => {
        console.log("⏳ createCabinClass pending");
        state.loading = true;
        state.error = null;
      })
      .addCase(createCabinClass.fulfilled, (state, action) => {
        console.log("✅ createCabinClass fulfilled");
        state.loading = false;
        state.cabinClasses.push(action.payload);
      })
      .addCase(createCabinClass.rejected, (state, action) => {
        console.log("❌ createCabinClass rejected:", action.payload);
        state.loading = false;
        state.error = action.payload;
      })

      // Get by ID
      .addCase(getCabinClassById.pending, (state) => {
        console.log("⏳ getCabinClassById pending");
        state.loading = true;
        state.error = null;
      })
      .addCase(getCabinClassById.fulfilled, (state, action) => {
        console.log("✅ getCabinClassById fulfilled");
        state.loading = false;
        state.cabinClass = action.payload;
      })
      .addCase(getCabinClassById.rejected, (state, action) => {
        console.log("❌ getCabinClassById rejected:", action.payload);
        state.loading = false;
        state.error = action.payload;
      })

      // Get by Aircraft
      .addCase(getCabinClassesByAircraft.pending, (state) => {
        console.log("⏳ getCabinClassesByAircraft pending");
        state.loading = true;
        state.error = null;
      })
      .addCase(getCabinClassesByAircraft.fulfilled, (state, action) => {
        console.log("✅ getCabinClassesByAircraft fulfilled");
        state.loading = false;
        state.cabinClasses = action.payload;
      })
      .addCase(getCabinClassesByAircraft.rejected, (state, action) => {
        console.log("❌ getCabinClassesByAircraft rejected:", action.payload);
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateCabinClass.pending, (state) => {
        console.log("⏳ updateCabinClass pending");
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCabinClass.fulfilled, (state, action) => {
        console.log("✅ updateCabinClass fulfilled");
        state.loading = false;
        const index = state.cabinClasses.findIndex(
          (c) => c.id === action.payload.id
        );
        if (index !== -1) state.cabinClasses[index] = action.payload;
        if (state.cabinClass?.id === action.payload.id)
          state.cabinClass = action.payload;
      })
      .addCase(updateCabinClass.rejected, (state, action) => {
        console.log("❌ updateCabinClass rejected:", action.payload);
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteCabinClass.pending, (state) => {
        console.log("⏳ deleteCabinClass pending");
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCabinClass.fulfilled, (state, action) => {
        console.log("✅ deleteCabinClass fulfilled");
        state.loading = false;
        state.cabinClasses = state.cabinClasses.filter(
          (c) => c.id !== action.payload
        );
        if (state.cabinClass?.id === action.payload) state.cabinClass = null;
      })
      .addCase(deleteCabinClass.rejected, (state, action) => {
        console.log("❌ deleteCabinClass rejected:", action.payload);
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCabinClassError } = cabinClassSlice.actions;
export default cabinClassSlice.reducer;
