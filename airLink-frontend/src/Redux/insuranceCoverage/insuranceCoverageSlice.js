import { createSlice } from "@reduxjs/toolkit";
import {
  createInsuranceCoverage,
  updateInsuranceCoverage,
  deleteInsuranceCoverage,
  getAllInsuranceCoverages,
  getInsuranceCoveragesByAncillaryId,
  getActiveInsuranceCoveragesByAncillaryId
} from "./insuranceCoverageThunk.js";

const initialState = {
  insuranceCoverages: [],
  insuranceCoverage: null,
  coveragesByAncillary: [], // Filtered coverages for a specific ancillary
  activeCoveragesByAncillary: [], // Active coverages for a specific ancillary
  loading: false,
  error: null
};

const insuranceCoverageSlice = createSlice({
  name: "insuranceCoverage",
  initialState,
  reducers: {
    clearInsuranceCoverageError: (state) => {
      state.error = null;
    },
    clearCurrentInsuranceCoverage: (state) => {
      state.insuranceCoverage = null;
    },
    clearCoveragesByAncillary: (state) => {
      state.coveragesByAncillary = [];
      state.activeCoveragesByAncillary = [];
    }
  },
  extraReducers: (builder) => {
    // CREATE
    builder
      .addCase(createInsuranceCoverage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInsuranceCoverage.fulfilled, (state, action) => {
        state.loading = false;
        state.insuranceCoverage = action.payload;
        state.insuranceCoverages.unshift(action.payload);
      })
      .addCase(createInsuranceCoverage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // UPDATE
    builder
      .addCase(updateInsuranceCoverage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInsuranceCoverage.fulfilled, (state, action) => {
        state.loading = false;
        state.insuranceCoverage = action.payload;
        const index = state.insuranceCoverages.findIndex(c => c.id === action.payload.id);
        if (index !== -1) state.insuranceCoverages[index] = action.payload;
      })
      .addCase(updateInsuranceCoverage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // DELETE
    builder
      .addCase(deleteInsuranceCoverage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteInsuranceCoverage.fulfilled, (state, action) => {
        state.loading = false;
        state.insuranceCoverages = state.insuranceCoverages.filter(c => c.id !== action.payload);
        if (state.insuranceCoverage?.id === action.payload) state.insuranceCoverage = null;
      })
      .addCase(deleteInsuranceCoverage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // GET ALL
    builder
      .addCase(getAllInsuranceCoverages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllInsuranceCoverages.fulfilled, (state, action) => {
        state.loading = false;
        state.insuranceCoverages = action.payload;
      })
      .addCase(getAllInsuranceCoverages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // GET BY ANCILLARY ID
    builder
      .addCase(getInsuranceCoveragesByAncillaryId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getInsuranceCoveragesByAncillaryId.fulfilled, (state, action) => {
        state.loading = false;
        state.coveragesByAncillary = action.payload;
      })
      .addCase(getInsuranceCoveragesByAncillaryId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // GET ACTIVE BY ANCILLARY ID
    builder
      .addCase(getActiveInsuranceCoveragesByAncillaryId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getActiveInsuranceCoveragesByAncillaryId.fulfilled, (state, action) => {
        state.loading = false;
        state.activeCoveragesByAncillary = action.payload;
      })
      .addCase(getActiveInsuranceCoveragesByAncillaryId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {
  clearInsuranceCoverageError,
  clearCurrentInsuranceCoverage,
  clearCoveragesByAncillary
} = insuranceCoverageSlice.actions;

export default insuranceCoverageSlice.reducer;
