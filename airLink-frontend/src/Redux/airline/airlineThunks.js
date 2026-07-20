import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/api";
import { getHeaders } from "@/utils/getHeaders";


export const createAirline = createAsyncThunk(
  "airline/create",
  async (airlineData, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/airlines", airlineData, {
        headers: getHeaders()
      });
      console.log("Create airline success:", res.data);
      return res.data;
    } catch (err) {
      console.error("Create airline error:", err);
      return rejectWithValue(
        err.response?.data?.message || "Failed to create airline"
      );
    }
  }
);

// ✅ Get Airline by Admin
export const getAirlineByAdmin = createAsyncThunk(
  "airline/getByAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/airlines/admin", {
        headers: getHeaders()
      });
      console.log("Get airline by admin success:", res.data);
      return res.data;
    } catch (err) {
      console.error("Get airline by admin error:", err);
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch airline"
      );
    }
  }
);


// ✅ Get Airlines for Dropdown (lightweight list)
export const getAirlinesForDropdown = createAsyncThunk(
  "airline/getDropdown",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/airlines/dropdown", {
        headers: getHeaders()
      });
      console.log("Get airlines dropdown success:", res.data);
      return res.data;
    } catch (err) {
      console.error("Get airlines dropdown error:", err);
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch airlines for dropdown"
      );
    }
  }
);

// ✅ Get All Airlines
export const getAllAirlines = createAsyncThunk(
  "airline/getAll",
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/airlines", { 
        params,
        headers: getHeaders()
      });
      console.log("Get all airlines success:", res.data);
      return res.data;
    } catch (err) {
      console.error("Get all airlines error:", err);
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch airlines"
      );
    }
  }
);

// ✅ Update Airline
export const updateAirline = createAsyncThunk(
  "airline/update",
  async (airlineData, { rejectWithValue }) => {
    try {
      const res = await api.put("/api/airlines", airlineData, {
        headers: getHeaders()
      });
      console.log("Update airline success:", res.data);
      return res.data;
    } catch (err) {
      console.error("Update airline error:", err);
      return rejectWithValue(
        err.response?.data?.message || "Failed to update airline"
      );
    }
  }
);

// ✅ Delete Airline
export const deleteAirline = createAsyncThunk(
  "airline/delete",
  async (airlineId, { rejectWithValue }) => {
    try {
      await api.delete(`/api/airlines/${airlineId}`, {
        headers: getHeaders()
      });
      console.log("Delete airline success");
      return airlineId;
    } catch (err) {
      console.error("Delete airline error:", err);
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete airline"
      );
    }
  }
);






// ✅ Super Admin: Approve Airline
export const approveAirline = createAsyncThunk(
  "airline/approve",
  async (airlineId, { rejectWithValue }) => {
    try {
      const res = await api.post(`/api/airlines/${airlineId}/approve`, null, {
        headers: getHeaders()
      });
      console.log("Approve airline success:", res.data);
      return res.data;
    } catch (err) {
      console.error("Approve airline error:", err);
      return rejectWithValue(
        err.response?.data?.message || "Failed to approve airline"
      );
    }
  }
);

// ✅ Super Admin: Suspend Airline
export const suspendAirline = createAsyncThunk(
  "airline/suspend",
  async (airlineId, { rejectWithValue }) => {
    try {
      const res = await api.post(`/api/airlines/${airlineId}/suspend`, null, {
        headers: getHeaders()
      });
      console.log("Suspend airline success:", res.data);
      return res.data;
    } catch (err) {
      console.error("Suspend airline error:", err);
      return rejectWithValue(
        err.response?.data?.message || "Failed to suspend airline"
      );
    }
  }
);

// ✅ Super Admin: Ban Airline
export const banAirline = createAsyncThunk(
  "airline/ban",
  async (airlineId, { rejectWithValue }) => {
    try {
      const res = await api.post(`/api/airlines/${airlineId}/ban`, null, {
        headers: getHeaders()
      });
      console.log("Ban airline success:", res.data);
      return res.data;
    } catch (err) {
      console.error("Ban airline error:", err);
      return rejectWithValue(
        err.response?.data?.message || "Failed to ban airline"
      );
    }
  }
);

