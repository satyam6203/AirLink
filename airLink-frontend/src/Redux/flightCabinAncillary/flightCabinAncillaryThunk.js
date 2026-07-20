import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/api";
import { getHeaders } from "@/utils/getHeaders";

const API_URL = "/api/flight-cabin-ancillaries";

// Create Cabin Ancillary
// Request body now requires: { flightId, cabinClassId, ancillaryId, available, maxQuantity, price, currency, includedInFare }
export const createFlightCabinAncillary = createAsyncThunk(
  "flightCabinAncillary/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post(API_URL, data, { headers: getHeaders() });
      console.log("✅ createFlightCabinAncillary success:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ createFlightCabinAncillary error:", err.response?.data?.message || err.message);
      return rejectWithValue(err.response?.data?.message || "Failed to create cabin ancillary");
    }
  }
);

// Get all by flight ID
export const getFlightCabinAncillariesByFlightId = createAsyncThunk(
  "flightCabinAncillary/getByFlightId",
  async (flightId, { rejectWithValue }) => {
    try {
      const res = await api.get(`${API_URL}/flight/${flightId}`, { headers: getHeaders() });
      console.log("✅ getFlightCabinAncillariesByFlightId success:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ getFlightCabinAncillariesByFlightId error:", err.response?.data?.message || err.message);
      return rejectWithValue(err.response?.data?.message || "Failed to fetch cabin ancillaries");
    }
  }
);

// Get all by flight ID and cabin class ID
export const getFlightCabinAncillariesByFlightAndCabinClass = createAsyncThunk(
  "flightCabinAncillary/getByFlightAndCabinClass",
  async ({ flightId, cabinClassId }, { rejectWithValue }) => {
    try {
      const res = await api.get(`${API_URL}/flight/${flightId}/cabin/${cabinClassId}`, { headers: getHeaders() });
      console.log("✅ getFlightCabinAncillariesByFlightAndCabinClass success:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ getFlightCabinAncillariesByFlightAndCabinClass error:", err.response?.data?.message || err.message);
      return rejectWithValue(err.response?.data?.message || "Failed to fetch cabin ancillaries");
    }
  }
);

// Get by ID
export const getFlightCabinAncillaryById = createAsyncThunk(
  "flightCabinAncillary/getById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`${API_URL}/${id}`, { headers: getHeaders() });
      console.log("✅ getFlightCabinAncillaryById success:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ getFlightCabinAncillaryById error:", err.response?.data?.message || err.message);
      return rejectWithValue(err.response?.data?.message || "Failed to fetch cabin ancillary");
    }
  }
);

// Update
export const updateFlightCabinAncillary = createAsyncThunk(
  "flightCabinAncillary/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`${API_URL}/${id}`, data, { headers: getHeaders() });
      console.log("✅ updateFlightCabinAncillary success:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ updateFlightCabinAncillary error:", err.response?.data?.message || err.message);
      return rejectWithValue(err.response?.data?.message || "Failed to update cabin ancillary");
    }
  }
);

// Delete
export const deleteFlightCabinAncillary = createAsyncThunk(
  "flightCabinAncillary/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`${API_URL}/${id}`, { headers: getHeaders() });
      console.log("✅ deleteFlightCabinAncillary success:", id);
      return id;
    } catch (err) {
      console.error("❌ deleteFlightCabinAncillary error:", err.response?.data?.message || err.message);
      return rejectWithValue(err.response?.data?.message || "Failed to delete cabin ancillary");
    }
  }
);

// Bulk Create
export const bulkCreateFlightCabinAncillaries = createAsyncThunk(
  "flightCabinAncillary/bulkCreate",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post(`${API_URL}/bulk`, data, { headers: getHeaders() });
      console.log("✅ bulkCreateFlightCabinAncillaries success:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ bulkCreateFlightCabinAncillaries error:", err.response?.data?.message || err.message);
      return rejectWithValue(err.response?.data?.message || "Failed to bulk create cabin ancillaries");
    }
  }
);

// Get single by flight + cabin + type
export const getFlightCabinAncillariesByType = createAsyncThunk(
  "flightCabinAncillary/getByType",
  async ({ flightId, cabinClassId, type }, { rejectWithValue }) => {
    try {
      const res = await api.get(`${API_URL}/flight/${flightId}/cabin/${cabinClassId}/type/${type}`, { headers: getHeaders() });
      console.log(`✅ getFlightCabinAncillariesByType [${type}] success:`, res.data);
      return { type, data: res.data };
    } catch (err) {
      console.error(`❌ getFlightCabinAncillariesByType [${type}] error:`, err.response?.data?.message || err.message);
      return rejectWithValue(err.response?.data?.message || `Failed to fetch cabin ancillary by type: ${type}`);
    }
  }
);

// Get all by flight + cabin + type
export const getAllFlightCabinAncillariesByType = createAsyncThunk(
  "flightCabinAncillary/getAllByType",
  async ({ flightId, cabinClassId, type }, { rejectWithValue }) => {
    try {
      const res = await api.get(`${API_URL}/flight/${flightId}/cabin/${cabinClassId}/type/${type}/all`, { headers: getHeaders() });
      console.log(`✅ getAllFlightCabinAncillariesByType [${type}] success:`, res.data);
      return { type, data: res.data };
    } catch (err) {
      console.error(`❌ getAllFlightCabinAncillariesByType [${type}] error:`, err.response?.data?.message || err.message);
      return rejectWithValue(err.response?.data?.message || `Failed to fetch cabin ancillaries by type: ${type}`);
    }
  }
);
