import { createSlice } from "@reduxjs/toolkit";
import {
  createFareRule,
  getAllFareRules,
  getFareRuleById,
  updateFareRule,
  deleteFareRule,
  getFareRulesByAirline,
  getFareRuleByFare,
} from "./fareRulesThunk";

const fareRulesSlice = createSlice({
  name: "fareRules",
  initialState: {
    fareRules: [],
    currentFareRule: null,
    loading: false,
    error: null,
    fareRule:null
  },
  reducers: {
    clearFareRulesError: (state) => {
      state.error = null;
    },
    clearCurrentFareRule: (state) => {
      state.currentFareRule = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Fare Rule
      .addCase(createFareRule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFareRule.fulfilled, (state, action) => {
        state.loading = false;
        state.fareRules.unshift(action.payload);
        state.currentFareRule = action.payload;
      })
      .addCase(createFareRule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get All Fare Rules
      .addCase(getAllFareRules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllFareRules.fulfilled, (state, action) => {
        state.loading = false;
        state.fareRules = action.payload.content || action.payload;
      })
      .addCase(getAllFareRules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Fare Rule by ID
      .addCase(getFareRuleById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFareRuleById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentFareRule = action.payload;
      })
      .addCase(getFareRuleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Fare Rule
      .addCase(updateFareRule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFareRule.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.fareRules.findIndex(
          (rule) => rule.id === action.payload.id
        );
        if (index !== -1) {
          state.fareRules[index] = action.payload;
        }
        state.currentFareRule = action.payload;
      })
      .addCase(updateFareRule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Fare Rule
      .addCase(deleteFareRule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFareRule.fulfilled, (state, action) => {
        state.loading = false;
        state.fareRules = state.fareRules.filter(
          (rule) => rule.id !== action.payload
        );
        if (state.currentFareRule?.id === action.payload) {
          state.currentFareRule = null;
        }
      })
      .addCase(deleteFareRule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Fare Rules by Airline
      .addCase(getFareRulesByAirline.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFareRulesByAirline.fulfilled, (state, action) => {
        state.loading = false;
        state.fareRules = action.payload;
      })
      .addCase(getFareRulesByAirline.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Fare Rule by Fare
      .addCase(getFareRuleByFare.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFareRuleByFare.fulfilled, (state, action) => {
        state.loading = false;
        state.fareRule = action.payload;
      })
      .addCase(getFareRuleByFare.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearFareRulesError, clearCurrentFareRule } = fareRulesSlice.actions;
export default fareRulesSlice.reducer;