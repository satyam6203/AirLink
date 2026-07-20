import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/api";
import { getHeaders } from "@/utils/getHeaders";

// Create Ancillary
export const createAncillary = createAsyncThunk(
  "ancillary/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/ancillaries", data, { headers: getHeaders() });
      console.log("✅ createAncillary success:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ createAncillary error:", err.response?.data?.message || err.message);
      return rejectWithValue(err.response?.data?.message || "Failed to create ancillary");
    }
  }
);

// Get by ID
export const getAncillaryById = createAsyncThunk(
  "ancillary/getById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/ancillaries/${id}`, { headers: getHeaders() });
      console.log("✅ getAncillaryById success:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ getAncillaryById error:", err.response?.data?.message || err.message);
      return rejectWithValue(err.response?.data?.message || "Ancillary not found");
    }
  }
);

// Get All
export const getAllAncillaries = createAsyncThunk(
  "ancillary/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/ancillaries", { headers: getHeaders() });
      console.log("✅ getAllAncillaries success:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ getAllAncillaries error:", err.response?.data?.message || err.message);
      return rejectWithValue(err.response?.data?.message || "Failed to fetch ancillaries");
    }
  }
);

// Update
export const updateAncillary = createAsyncThunk(
  "ancillary/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/api/ancillaries/${id}`, data, { headers: getHeaders() });
      console.log("✅ updateAncillary success:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ updateAncillary error:", err.response?.data?.message || err.message);
      return rejectWithValue(err.response?.data?.message || "Failed to update ancillary");
    }
  }
);

// Delete
export const deleteAncillary = createAsyncThunk(
  "ancillary/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/ancillaries/${id}`, { headers: getHeaders() });
      console.log("✅ deleteAncillary success:", id);
      return id;
    } catch (err) {
      console.error("❌ deleteAncillary error:", err.response?.data?.message || err.message);
      return rejectWithValue(err.response?.data?.message || "Failed to delete ancillary");
    }
  }
);