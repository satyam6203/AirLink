import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/api";
import { getHeaders } from "@/utils/getHeaders";

// ✅ Create Aircraft
export const createAircraft = createAsyncThunk(
  "aircraft/create",
  async (aircraftData, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/aircrafts", aircraftData, {
        headers: getHeaders()
      });
      console.log("Create aircraft success:", res.data);
      return res.data;
    } catch (err) {
      console.error("Create aircraft error:", err);
      return rejectWithValue(
        err.response?.data?.message || "Failed to create aircraft"
      );
    }
  }
);

// ✅ Get Aircraft by ID
export const getAircraftById = createAsyncThunk(
  "aircraft/getById",
  async (aircraftId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/aircrafts/${aircraftId}`, {
        headers: getHeaders()
      });
      console.log("Get aircraft by ID success:", res.data);
      return res.data;
    } catch (err) {
      console.error("Get aircraft by ID error:", err);
      return rejectWithValue(
        err.response?.data?.message || "Aircraft not found"
      );
    }
  }
);

// ✅ List All Aircrafts
export const listAllAircrafts = createAsyncThunk(
  "aircraft/listAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/aircrafts", {
        params,
        headers: getHeaders()
      });
      console.log("List all aircrafts success:", res.data);
      return res.data;
    } catch (err) {
      console.error("List all aircrafts error:", err);
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch aircrafts"
      );
    }
  }
);





// ✅ Update Aircraft
export const updateAircraft = createAsyncThunk(
  "aircraft/update",
  async ({ aircraftId, aircraftData }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/api/aircrafts/${aircraftId}`, aircraftData, {
        headers: getHeaders()
      });
      console.log("Update aircraft success:", res.data);
      return res.data;
    } catch (err) {
      console.error("Update aircraft error:", err);
      return rejectWithValue(
        err.response?.data?.message || "Failed to update aircraft"
      );
    }
  }
);

// ✅ Delete Aircraft
export const deleteAircraft = createAsyncThunk(
  "aircraft/delete",
  async (aircraftId, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/api/aircrafts/${aircraftId}`, {
        headers: getHeaders()
      });
      console.log("Delete aircraft success:", res.data);
      return aircraftId;
    } catch (err) {
      console.error("Delete aircraft error:", err);
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete aircraft"
      );
    }
  }
);





