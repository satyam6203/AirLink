import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/api";
import { getHeaders } from "@/utils/getHeaders";

// Create Insurance Coverage
export const createInsuranceCoverage = createAsyncThunk(
  "insuranceCoverage/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/insurance-coverages", data, { headers: getHeaders() });
      console.log("✅ createInsuranceCoverage success:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ createInsuranceCoverage error:", err.response?.data?.message || err.message);
      return rejectWithValue(err.response?.data?.message || "Failed to create insurance coverage");
    }
  }
);

// Update Insurance Coverage
export const updateInsuranceCoverage = createAsyncThunk(
  "insuranceCoverage/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/api/insurance-coverages/${id}`, data, { headers: getHeaders() });
      console.log("✅ updateInsuranceCoverage success:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ updateInsuranceCoverage error:", err.response?.data?.message || err.message);
      return rejectWithValue(err.response?.data?.message || "Failed to update insurance coverage");
    }
  }
);

// Delete Insurance Coverage
export const deleteInsuranceCoverage = createAsyncThunk(
  "insuranceCoverage/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/insurance-coverages/${id}`, { headers: getHeaders() });
      console.log("✅ deleteInsuranceCoverage success:", id);
      return id;
    } catch (err) {
      console.error("❌ deleteInsuranceCoverage error:", err.response?.data?.message || err.message);
      return rejectWithValue(err.response?.data?.message || "Failed to delete insurance coverage");
    }
  }
);

// Get All Insurance Coverages
export const getAllInsuranceCoverages = createAsyncThunk(
  "insuranceCoverage/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/insurance-coverages", { headers: getHeaders() });
      console.log("✅ getAllInsuranceCoverages success:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ getAllInsuranceCoverages error:", err.response?.data?.message || err.message);
      return rejectWithValue(err.response?.data?.message || "Failed to fetch insurance coverages");
    }
  }
);

// Get Insurance Coverages by Ancillary ID
export const getInsuranceCoveragesByAncillaryId = createAsyncThunk(
  "insuranceCoverage/getByAncillaryId",
  async (ancillaryId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/insurance-coverages/ancillary/${ancillaryId}`, { headers: getHeaders() });
      console.log("✅ getInsuranceCoveragesByAncillaryId success:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ getInsuranceCoveragesByAncillaryId error:", err.response?.data?.message || err.message);
      return rejectWithValue(err.response?.data?.message || "Failed to fetch insurance coverages for ancillary");
    }
  }
);

// Get Active Insurance Coverages by Ancillary ID
export const getActiveInsuranceCoveragesByAncillaryId = createAsyncThunk(
  "insuranceCoverage/getActiveByAncillaryId",
  async (ancillaryId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/insurance-coverages/ancillary/${ancillaryId}/active`, { headers: getHeaders() });
      console.log("✅ getActiveInsuranceCoveragesByAncillaryId success:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ getActiveInsuranceCoveragesByAncillaryId error:", err.response?.data?.message || err.message);
      return rejectWithValue(err.response?.data?.message || "Failed to fetch active insurance coverages for ancillary");
    }
  }
);
