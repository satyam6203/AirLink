import { createSlice } from "@reduxjs/toolkit";
import {
  createPolicy,
  updatePolicy,
  getPolicyById,
 
  deletePolicy,
 
  getBaggagePolicyByFare,
  getPolicyByAirline
} from "./baggagePolicyThunk.js";

const initialState = {
  policies: [],
  policy: null,
  loading: false,
  error: null
};

const baggagePolicySlice = createSlice({
  name: "baggagePolicy",
  initialState,
  reducers: {
    clearBaggagePolicyError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {

    // ---------- CREATE ----------
    builder.addCase(createPolicy.pending, (state) => {
      console.log("⏳ createPolicy pending");
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createPolicy.fulfilled, (state, action) => {
      console.log("✅ createPolicy fulfilled");
      state.loading = false;
      state.policy = action.payload;
      state.policies.push(action.payload);
    });
    builder.addCase(createPolicy.rejected, (state, action) => {
      console.log("❌ createPolicy rejected:", action.payload);
      state.loading = false;
      state.error = action.payload;
    });

    // ---------- UPDATE ----------
    builder.addCase(updatePolicy.pending, (state) => {
      console.log("⏳ updatePolicy pending");
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updatePolicy.fulfilled, (state, action) => {
      console.log("✅ updatePolicy fulfilled");
      state.loading = false;
      state.policy = action.payload;
      state.policies = state.policies.map(p => p.id === action.payload.id ? action.payload : p);
    });
    builder.addCase(updatePolicy.rejected, (state, action) => {
      console.log("❌ updatePolicy rejected:", action.payload);
      state.loading = false;
      state.error = action.payload;
    });

    // ---------- GET BY ID ----------
    builder.addCase(getPolicyById.pending, (state) => {
      console.log("⏳ getPolicyById pending");
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getPolicyById.fulfilled, (state, action) => {
      console.log("✅ getPolicyById fulfilled");
      state.loading = false;
      state.policy = action.payload;
    });
    builder.addCase(getPolicyById.rejected, (state, action) => {
      console.log("❌ getPolicyById rejected:", action.payload);
      state.loading = false;
      state.error = action.payload;
    });

    // Get By Airline
    builder.addCase(getPolicyByAirline.fulfilled, (state, action) => {
      console.log("✅ getPolicyByAirline fulfilled");
      state.loading = false;
      state.policies = action.payload;
    });

    // ---------- GET BY FARE ID ----------
    builder.addCase(getBaggagePolicyByFare.pending, (state) => {
      console.log("⏳ getBaggagePolicyByFare pending");
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getBaggagePolicyByFare.fulfilled, (state, action) => {
      console.log("✅ getBaggagePolicyByFare fulfilled");
      state.loading = false;
      state.policy = action.payload;
    });
    builder.addCase(getBaggagePolicyByFare.rejected, (state, action) => {
      console.log("❌ getBaggagePolicyByFare rejected:", action.payload);
      state.loading = false;
      state.error = action.payload;
    });

    


   
    // ---------- DELETE ----------
    builder.addCase(deletePolicy.pending, (state) => {
      console.log("⏳ deletePolicy pending");
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deletePolicy.fulfilled, (state, action) => {
      console.log("✅ deletePolicy fulfilled");
      state.loading = false;
      state.policies = state.policies.filter(p => p.id !== action.payload);
      if (state.policy?.id === action.payload) state.policy = null;
    });
    builder.addCase(deletePolicy.rejected, (state, action) => {
      console.log("❌ deletePolicy rejected:", action.payload);
      state.loading = false;
      state.error = action.payload;
    });

  

  

  }
});

export const { clearBaggagePolicyError } = baggagePolicySlice.actions;
export default baggagePolicySlice.reducer;
