// src/redux/slices/seatMapSlice.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/api";
import { getHeaders } from "@/utils/getHeaders";

// ================= THUNKS =================

// Create Seat Map
export const createSeatMap = createAsyncThunk(
  "seatMap/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/seat-maps", data, { headers: getHeaders() });
      console.log("✅ createSeatMap success:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ createSeatMap error:", err.response?.data?.message || err.message);
      return rejectWithValue(err.response?.data?.message || "Failed to create seat map");
    }
  }
);

// Update Seat Map
export const updateSeatMap = createAsyncThunk(
  "seatMap/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/api/seat-maps/${id}`, data, { headers: getHeaders() });
      console.log("✅ updateSeatMap success:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ updateSeatMap error:", err.response?.data?.message || err.message);
      return rejectWithValue(err.response?.data?.message || "Failed to update seat map");
    }
  }
);

// Get Seat Map by Cabin Class
export const getSeatMapsByCabinClass = createAsyncThunk(
  "seatMap/getByCabinClass",
  async (cabinClassId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/seat-maps/cabin-class/${cabinClassId}`, { headers: getHeaders() });
      console.log("✅ getSeatMapsByCabinClass success:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ getSeatMapsByCabinClass error:", err.response?.data?.message || err.message);
      return rejectWithValue(err.response?.data?.message || "Failed to fetch seat map by cabin class");
    }
  }
);

// Delete Seat Map
export const deleteSeatMap = createAsyncThunk(
  "seatMap/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/seat-maps/${id}`, { headers: getHeaders() });
      console.log("✅ deleteSeatMap success:", id);
      return id;
    } catch (err) {
      console.error("❌ deleteSeatMap error:", err.response?.data?.message || err.message);
      return rejectWithValue(err.response?.data?.message || "Failed to delete seat map");
    }
  }
);


