import { createSlice } from "@reduxjs/toolkit";
import { createAirport, deleteAirport, getAirportById, listAllAirports, updateAirport } from "./airportThunk";



// ================= SLICE =================
const airportSlice = createSlice({
  name: "airport",
  initialState: {
    airports: [],
    airport: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearAirportError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Airport
      .addCase(createAirport.pending, (state) => {
        console.log("⏳ createAirport pending");
        state.loading = true;
        state.error = null;
      })
      .addCase(createAirport.fulfilled, (state, action) => {
        console.log("✅ createAirport fulfilled");
        state.loading = false;
        state.airports.push(action.payload);
      })
      .addCase(createAirport.rejected, (state, action) => {
        console.log("❌ createAirport rejected:", action.payload);
        state.loading = false;
        state.error = action.payload;
      })

      // Get Airport by ID
      .addCase(getAirportById.pending, (state) => {
        console.log("⏳ getAirportById pending");
        state.loading = true;
        state.error = null;
      })
      .addCase(getAirportById.fulfilled, (state, action) => {
        console.log("✅ getAirportById fulfilled");
        state.loading = false;
        state.airport = action.payload;
      })
      .addCase(getAirportById.rejected, (state, action) => {
        console.log("❌ getAirportById rejected:", action.payload);
        state.loading = false;
        state.error = action.payload;
      })


      // List All Airports
      .addCase(listAllAirports.pending, (state) => {
        console.log("⏳ listAllAirports pending");
        state.loading = true;
        state.error = null;
      })
      .addCase(listAllAirports.fulfilled, (state, action) => {
        console.log("✅ listAllAirports fulfilled");
        state.loading = false;
        state.airports = action.payload;
      })
      .addCase(listAllAirports.rejected, (state, action) => {
        console.log("❌ listAllAirports rejected:", action.payload);
        state.loading = false;
        state.error = action.payload;
      })

      // Update Airport
      .addCase(updateAirport.pending, (state) => {
        console.log("⏳ updateAirport pending");
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAirport.fulfilled, (state, action) => {
        console.log("✅ updateAirport fulfilled");
        state.loading = false;
        const index = state.airports.findIndex(a => a.id === action.payload.id);
        if (index !== -1) state.airports[index] = action.payload;
        if (state.airport?.id === action.payload.id) state.airport = action.payload;
      })
      .addCase(updateAirport.rejected, (state, action) => {
        console.log("❌ updateAirport rejected:", action.payload);
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Airport
      .addCase(deleteAirport.pending, (state) => {
        console.log("⏳ deleteAirport pending");
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAirport.fulfilled, (state, action) => {
        console.log("✅ deleteAirport fulfilled");
        state.loading = false;
        state.airports = state.airports.filter(a => a.id !== action.payload);
        if (state.airport?.id === action.payload) state.airport = null;
      })
      .addCase(deleteAirport.rejected, (state, action) => {
        console.log("❌ deleteAirport rejected:", action.payload);
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearAirportError } = airportSlice.actions;
export default airportSlice.reducer;
