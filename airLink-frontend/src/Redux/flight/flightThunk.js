import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/api";
import { getHeaders } from "@/utils/getHeaders";

const API_URL = "/api/flights";

// ✅ Create Flight
export const createFlight = createAsyncThunk(
  "flight/create",
  async (flightData, { rejectWithValue }) => {
    try {
      const res = await api.post(API_URL, flightData, { headers: getHeaders() });
      console.log("✅ createFlight success:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ createFlight error:", err.response?.data?.message || err.message);
      return rejectWithValue(err.response?.data?.message || "Failed to create flight");
    }
  }
);

// ✅ Get Flight by ID
export const getFlightById = createAsyncThunk(
  "flight/getById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`${API_URL}/${id}`, { headers: getHeaders() });
      console.log("✅ getFlightById success:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ getFlightById error:", err.response?.data?.message || err.message);
      return rejectWithValue(err.response?.data?.message || "Flight not found");
    }
  }
);



// ✅ Update Flight
export const updateFlight = createAsyncThunk(
  "flight/update",
  async ({ id, flightData }, { rejectWithValue }) => {
    try {
      const res = await api.put(`${API_URL}/${id}`, flightData, { headers: getHeaders() });
      console.log("✅ updateFlight success:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ updateFlight error:", err.response?.data?.message || err.message);
      return rejectWithValue(err.response?.data?.message || "Failed to update flight");
    }
  }
);

// ✅ Delete Flight
export const deleteFlight = createAsyncThunk(
  "flight/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`${API_URL}/${id}`, { headers: getHeaders() });
      console.log("✅ deleteFlight success:", id);
      return id;
    } catch (err) {
      console.error("❌ deleteFlight error:", err.response?.data?.message || err.message);
      return rejectWithValue(err.response?.data?.message || "Failed to delete flight");
    }
  }
);

// ✅ Get Flights by Airline
export const getFlightsByAirline = createAsyncThunk(
  "flight/getByAirline",
  async (_, 
    { rejectWithValue }) => {
    try {
      const res = await api.get(`${API_URL}/airline`, { headers: getHeaders() });
      console.log("✅ getFlightsByAirline success:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ getFlightsByAirline error:", err.response?.data?.message || err.message);
      return rejectWithValue(err.response?.data?.message || "Failed to fetch flights by airline");
    }
  }
);

// ✅ Get Flights by Aircraft
export const getFlightsByAircraft = createAsyncThunk(
  "flight/getByAircraft",
  async (aircraftId, { rejectWithValue }) => {
    try {
      const res = await api.get(`${API_URL}/aircraft/${aircraftId}`, { headers: getHeaders() });
      console.log("✅ getFlightsByAircraft success:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ getFlightsByAircraft error:", err.response?.data?.message || err.message);
      return rejectWithValue(err.response?.data?.message || "Failed to fetch flights by aircraft");
    }
  }
);

