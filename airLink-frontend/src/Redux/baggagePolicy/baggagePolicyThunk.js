// src/redux/thunks/baggagePolicyThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/api";
import { getHeaders } from "@/utils/getHeaders";

// ✅ Create Policy
export const createPolicy = createAsyncThunk(
  "baggagePolicy/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/baggage-policies", data, { headers: getHeaders() });
      console.log("✅ createPolicy success:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ createPolicy error:", err.response?.data?.message || err.message);
      return rejectWithValue(err.response?.data?.message || "Failed to create policy");
    }
  }
);

// ✅ Get Policy by ID
export const getPolicyById = createAsyncThunk(
  "baggagePolicy/getById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/baggage-policies/${id}`, { headers: getHeaders() });
      console.log("✅ getPolicyById success:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ getPolicyById error:", err.response?.data?.message || err.message);
      return rejectWithValue(err.response?.data?.message || "Policy not found");
    }
  }
);

// ✅ Update Policy
export const updatePolicy = createAsyncThunk(
  "baggagePolicy/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/api/baggage-policies/${id}`, data, { headers: getHeaders() });
      console.log("✅ updatePolicy success:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ updatePolicy error:", err.response?.data?.message || err.message);
      return rejectWithValue(err.response?.data?.message || "Failed to update policy");
    }
  }
);

// ✅ Delete Policy
export const deletePolicy = createAsyncThunk(
  "baggagePolicy/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/baggage-policies/${id}`, { headers: getHeaders() });
      console.log("✅ deletePolicy success:", id);
      return id;
    } catch (err) {
      console.error("❌ deletePolicy error:", err.response?.data?.message || err.message);
      return rejectWithValue(err.response?.data?.message || "Failed to delete policy");
    }
  }
);






// ✅ Get Policy by Airline
export const getPolicyByAirline = createAsyncThunk(
  "baggagePolicy/getByAirline",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/baggage-policies/airline", { headers: getHeaders() });
      console.log("✅ getPolicyByAirline success:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ getPolicyByAirline error:", err.response?.data?.message || err.message);
      return rejectWithValue(err.response?.data?.message || "Failed to fetch policies for airline");
    }
  }
);


// ✅ Get Policy by Fare ID
export const getBaggagePolicyByFare = createAsyncThunk(
  "baggagePolicy/getByFare",
  async (fareId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/baggage-policies/fare/${fareId}`, { headers: getHeaders() });
      console.log("✅ getPolicyByFare success:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ getPolicyByFare error:", err.response?.data?.message || err.message);
      return rejectWithValue(err.response?.data?.message || "Policy not found for this fare");
    }
  }
);

// You can add more thunks for filters by status or cabin class similarly
