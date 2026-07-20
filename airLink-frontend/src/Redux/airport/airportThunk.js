// src/redux/slices/airportSlice.js

import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/api";
import { getHeaders } from "@/utils/getHeaders";


// ✅ Create Airport
export const createAirport = createAsyncThunk(
  "airport/create",
  async (airportData, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/airports", airportData, {
        headers: getHeaders()
      });
      console.log("Create airport success:", res.data);
      return res.data;
    } catch (err) {
      console.error("Create airport error:", err);
      return rejectWithValue(
        err.response?.data?.message || "Failed to create airport"
      );
    }
  }
);

// ✅ Get Airport by ID
export const getAirportById = createAsyncThunk(
  "airport/getById",
  async (airportId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/airports/${airportId}`, {
        headers: getHeaders()
      });
      console.log("Get airport by ID success:", res.data);
      return res.data;
    } catch (err) {
      console.error("Get airport by ID error:", err);
      return rejectWithValue(
        err.response?.data?.message || "Airport not found"
      );
    }
  }
);



// ✅ List All Airports
export const listAllAirports = createAsyncThunk(
  "airport/listAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/airports", {
        headers: getHeaders()
      });
      console.log("List all airports success:", res.data);
      return res.data;
    } catch (err) {
      console.error("List all airports error:", err);
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch airports"
      );
    }
  }
);

// ✅ Update Airport
export const updateAirport = createAsyncThunk(
  "airport/update",
  async ({ airportId, airportData }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/api/airports/${airportId}`, airportData, {
        headers: getHeaders()
      });
      console.log("Update airport success:", res.data);
      return res.data;
    } catch (err) {
      console.error("Update airport error:", err);
      return rejectWithValue(
        err.response?.data?.message || "Failed to update airport"
      );
    }
  }
);

// ✅ Delete Airport
export const deleteAirport = createAsyncThunk(
  "airport/delete",
  async (airportId, { rejectWithValue }) => {
    try {
      await api.delete(`/api/airports/${airportId}`, {
        headers: getHeaders()
      });
      console.log("Delete airport success:", airportId);
      return airportId;
    } catch (err) {
      console.error("Delete airport error:", err);
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete airport"
      );
    }
  }
);

