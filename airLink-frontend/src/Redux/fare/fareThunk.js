import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/api";
import { getHeaders } from "@/utils/getHeaders";

const API_URL = "/api/fares";

// ✅ Create Fare
export const createFare = createAsyncThunk(
  "fare/create",
  async (fareData, { rejectWithValue }) => {
    try {
      const res = await api.post(API_URL, fareData, { headers: getHeaders() });
      console.log("✅ createFare success:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ createFare error:", err.response?.data?.message || err.message);
      return rejectWithValue(err.response?.data?.message || "Failed to create fare");
    }
  }
);

// ✅ Get Fare by ID
export const getFareById = createAsyncThunk(
  "fare/getById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`${API_URL}/${id}`, { headers: getHeaders() });
      console.log("✅ getFareById success: ------------------- ", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ getFareById error:", err.response?.data?.message || err.message);
      return rejectWithValue(err.response?.data?.message || "Fare not found");
    }
  }
);


// ✅ Update Fare
export const updateFare = createAsyncThunk(
  "fare/update",
  async ({ id, fareData }, { rejectWithValue }) => {
    try {
      const res = await api.put(`${API_URL}/${id}`, fareData, { headers: getHeaders() });
      console.log("✅ updateFare success:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ updateFare error:", err.response?.data?.message || err.message);
      return rejectWithValue(err.response?.data?.message || "Failed to update fare");
    }
  }
);

// ✅ Delete Fare
export const deleteFare = createAsyncThunk(
  "fare/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`${API_URL}/${id}`, { headers: getHeaders() });
      console.log("✅ deleteFare success:", id);
      return id;
    } catch (err) {
      console.error("❌ deleteFare error:", err.response?.data?.message || err.message);
      return rejectWithValue(err.response?.data?.message || "Failed to delete fare");
    }
  }
);



// ✅ Get Fares by Flight ID and Cabin ID
export const getFlightFares = createAsyncThunk(
  "fare/getFlightFares",
  async ({ flightId, cabinId }, { rejectWithValue }) => {
    try {
      const res = await api.get(`${API_URL}/flight/${flightId}/cabin-class/${cabinId}`, {
      headers: getHeaders()
      });
      console.log("✅ getFlightFares success:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ getFlightFares error:", err);
      return rejectWithValue(err.response?.data?.message || "Failed to fetch flight fares");
    }
  }
);

// ✅ Search Fares (DIRECT flights only)
/**
 * Fare search for direct flights.
 *
 * searchFares({
 *   flightId: 101,
 *   cabinClassType: "ECONOMY"
 * })
 *
 * Response structure:
 * - Returns { fares: [...], flightType: "DIRECT", ... }
 */
export const searchFares = createAsyncThunk(
  "fare/search",
  async (searchParams, { rejectWithValue }) => {
    console.log("🔍 searchFares called with params:", searchParams);
    try {
      const res = await api.post(`${API_URL}/search`, searchParams, {
        headers: getHeaders()
      });
      console.log("✅ searchFares success:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ searchFares error:", err.response?.data?.message || err.message);
      return rejectWithValue(
        err.response?.data?.message || "Failed to search fares"
      );
    }
  }
);
