import { createSlice } from "@reduxjs/toolkit";
import {
  createFlightCabinAncillary,
  getFlightCabinAncillariesByFlightId,
  getFlightCabinAncillariesByFlightAndCabinClass,
  getFlightCabinAncillaryById,
  updateFlightCabinAncillary,
  deleteFlightCabinAncillary,
  bulkCreateFlightCabinAncillaries,
  getFlightCabinAncillariesByType,
  getAllFlightCabinAncillariesByType
} from "./flightCabinAncillaryThunk.js";

const initialState = {
  cabinAncillaries: [],
  cabinAncillary: null,
  loading: false,
  error: null,
  ancillariesByType: {},
  loadingByType: {}
};

const flightCabinAncillarySlice = createSlice({
  name: "flightCabinAncillary",
  initialState,
  reducers: {
    clearCabinAncillaryError: (state) => {
      state.error = null;
    },
    clearCurrentCabinAncillary: (state) => {
      state.cabinAncillary = null;
    }
  },
  extraReducers: (builder) => {
    // CREATE
    builder
      .addCase(createFlightCabinAncillary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFlightCabinAncillary.fulfilled, (state, action) => {
        state.loading = false;
        state.cabinAncillary = action.payload;
        state.cabinAncillaries.unshift(action.payload);
      })
      .addCase(createFlightCabinAncillary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // GET BY FLIGHT ID
    builder
      .addCase(getFlightCabinAncillariesByFlightId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFlightCabinAncillariesByFlightId.fulfilled, (state, action) => {
        state.loading = false;
        state.cabinAncillaries = action.payload;
      })
      .addCase(getFlightCabinAncillariesByFlightId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // GET BY FLIGHT AND CABIN CLASS
    builder
      .addCase(getFlightCabinAncillariesByFlightAndCabinClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFlightCabinAncillariesByFlightAndCabinClass.fulfilled, (state, action) => {
        state.loading = false;
        state.cabinAncillaries = action.payload;
      })
      .addCase(getFlightCabinAncillariesByFlightAndCabinClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // GET BY ID
    builder
      .addCase(getFlightCabinAncillaryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFlightCabinAncillaryById.fulfilled, (state, action) => {
        state.loading = false;
        state.cabinAncillary = action.payload;
      })
      .addCase(getFlightCabinAncillaryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // UPDATE
    builder
      .addCase(updateFlightCabinAncillary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFlightCabinAncillary.fulfilled, (state, action) => {
        state.loading = false;
        state.cabinAncillary = action.payload;
        const index = state.cabinAncillaries.findIndex(a => a.id === action.payload.id);
        if (index !== -1) state.cabinAncillaries[index] = action.payload;
      })
      .addCase(updateFlightCabinAncillary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // DELETE
    builder
      .addCase(deleteFlightCabinAncillary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFlightCabinAncillary.fulfilled, (state, action) => {
        state.loading = false;
        state.cabinAncillaries = state.cabinAncillaries.filter(a => a.id !== action.payload);
        if (state.cabinAncillary?.id === action.payload) state.cabinAncillary = null;
      })
      .addCase(deleteFlightCabinAncillary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // BULK CREATE
    builder
      .addCase(bulkCreateFlightCabinAncillaries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkCreateFlightCabinAncillaries.fulfilled, (state, action) => {
        state.loading = false;
        state.cabinAncillaries = [...state.cabinAncillaries, ...action.payload];
      })
      .addCase(bulkCreateFlightCabinAncillaries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // GET BY TYPE (single)
    builder
      .addCase(getFlightCabinAncillariesByType.pending, (state, action) => {
        const type = action.meta.arg.type;
        state.loadingByType[type] = true;
        state.error = null;
      })
      .addCase(getFlightCabinAncillariesByType.fulfilled, (state, action) => {
        const { type, data } = action.payload;
        state.loadingByType[type] = false;
        state.ancillariesByType[type] = data;
      })
      .addCase(getFlightCabinAncillariesByType.rejected, (state, action) => {
        const type = action.meta.arg.type;
        state.loadingByType[type] = false;
        state.error = action.payload;
      });

    // GET ALL BY TYPE (list)
    builder
      .addCase(getAllFlightCabinAncillariesByType.pending, (state, action) => {
        const type = action.meta.arg.type;
        state.loadingByType[type] = true;
        state.error = null;
      })
      .addCase(getAllFlightCabinAncillariesByType.fulfilled, (state, action) => {
        const { type, data } = action.payload;
        state.loadingByType[type] = false;
        state.ancillariesByType[type] = data;
      })
      .addCase(getAllFlightCabinAncillariesByType.rejected, (state, action) => {
        const type = action.meta.arg.type;
        state.loadingByType[type] = false;
        state.error = action.payload;
      });
  }
});

export const { clearCabinAncillaryError, clearCurrentCabinAncillary } = flightCabinAncillarySlice.actions;
export default flightCabinAncillarySlice.reducer;
