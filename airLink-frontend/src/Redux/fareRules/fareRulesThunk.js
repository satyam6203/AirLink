import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/api";
import { getHeaders } from "@/utils/getHeaders";

const API_URL = "/api/fare-rules";

// ✅ Create Fare Rule
export const createFareRule = createAsyncThunk(
  "fareRules/create",
  async (fareRuleData, { rejectWithValue }) => {
    try {
      const res = await api.post(API_URL, fareRuleData, { headers: getHeaders() });
      console.log("✅ createFareRule success:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ createFareRule error:", err.response?.data?.message || err.message);
      return rejectWithValue(
        err.response?.data?.message || "Failed to create fare rule"
      );
    }
  }
);

// ✅ Get All Fare Rules
export const getAllFareRules = createAsyncThunk(
  "fareRules/getAll",
  async (params = { page: 0, size: 100 }, { rejectWithValue }) => {
    try {
      const res = await api.get(API_URL, { params, headers: getHeaders() });
      console.log("✅ getAllFareRules success:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ getAllFareRules error:", err.response?.data?.message || err.message);
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch fare rules"
      );
    }
  }
);

// ✅ Get Fare Rule by ID
export const getFareRuleById = createAsyncThunk(
  "fareRules/getById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`${API_URL}/${id}`, { headers: getHeaders() });
      console.log("✅ getFareRuleById success:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ getFareRuleById error:", err.response?.data?.message || err.message);
      return rejectWithValue(err.response?.data?.message || "Fare rule not found");
    }
  }
);

// ✅ Update Fare Rule
export const updateFareRule = createAsyncThunk(
  "fareRules/update",
  async ({ id, fareRuleData }, { rejectWithValue }) => {
    try {
      const res = await api.put(`${API_URL}/${id}`, fareRuleData, { headers: getHeaders() });
      console.log("✅ updateFareRule success:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ updateFareRule error:", err.response?.data?.message || err.message);
      return rejectWithValue(
        err.response?.data?.message || "Failed to update fare rule"
      );
    }
  }
);

// ✅ Delete Fare Rule
export const deleteFareRule = createAsyncThunk(
  "fareRules/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`${API_URL}/${id}`, { headers: getHeaders() });
      console.log("✅ deleteFareRule success:", id);
      return id;
    } catch (err) {
      console.error("❌ deleteFareRule error:", err.response?.data?.message || err.message);
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete fare rule"
      );
    }
  }
);

// ✅ Get Fare Rules by Airline
export const getFareRulesByAirline = createAsyncThunk(
  "fareRules/getByAirline",
  async (airlineId, { rejectWithValue }) => {
    try {
      const res = await api.get(`${API_URL}/airline/${airlineId}`, { headers: getHeaders() });
      console.log("✅ getFareRulesByAirline success:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ getFareRulesByAirline error:", err.response?.data?.message || err.message);
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch fare rules by airline"
      );
    }
  }
);



// ✅ Get Fare Rule by Fare
export const getFareRuleByFare = createAsyncThunk(
  "fareRules/getByFare",
  async (fareId, { rejectWithValue }) => {
    try {
      const res = await api.get(`${API_URL}/fare/${fareId}`, { headers: getHeaders() });
      console.log("✅ getFareRuleByFare success:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ getFareRuleByFare error:", err.response?.data?.message || err.message);
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch fare rule by fare"
      );
    }
  }
);
