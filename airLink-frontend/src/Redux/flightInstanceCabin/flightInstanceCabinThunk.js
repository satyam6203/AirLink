// src/redux/thunks/flightInstanceCabinThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/api";
import { getHeaders } from "@/utils/getHeaders";

const API_URL = `/api/flight-instance-cabins`;

// ✅ Create Flight Cabin
export const createFlightInstanceCabin = createAsyncThunk(
  "flightInstanceCabin/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post(`${API_URL}`, data, { headers: getHeaders() });
      console.log("✅ createFlightCabin success:", res.data);
      return res.data;
    } catch (err) {
      console.error(
        "❌ createFlightCabin error:",
        err.response?.data?.message || err.message
      );
      return rejectWithValue(
        err.response?.data?.message || "Failed to create flight cabin"
      );
    }
  }
);

// ✅ Update Flight Cabin
export const updateFlightCabin = createAsyncThunk(
  "flightInstanceCabin/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`${API_URL}/${id}`, data, {
        headers: getHeaders(),
      });
      console.log("✅ updateFlightCabin success:", res.data);
      return res.data;
    } catch (err) {
      console.error(
        "❌ updateFlightCabin error:",
        err.response?.data?.message || err.message
      );
      return rejectWithValue(
        err.response?.data?.message || "Failed to update flight cabin"
      );
    }
  }
);

// ✅ Get Flight Cabin by ID
export const getFlightInstanceCabinById = createAsyncThunk(
  "flightInstanceCabin/getById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`${API_URL}/${id}`, { headers: getHeaders() });
      console.log("✅ getFlightCabinById success:", res.data);
      return res.data;
    } catch (err) {
      console.error(
        "❌ getFlightCabinById error:",
        err.response?.data?.message || err.message
      );
      return rejectWithValue(
        err.response?.data?.message || "Flight cabin not found"
      );
    }
  }
);

// ✅ Delete Flight Cabin
export const deleteFlightCabin = createAsyncThunk(
  "flightInstanceCabin/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`${API_URL}/${id}`, { headers: getHeaders() });
      console.log("✅ deleteFlightCabin success:", id);
      return id;
    } catch (err) {
      console.error(
        "❌ deleteFlightCabin error:",
        err.response?.data?.message || err.message
      );
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete flight cabin"
      );
    }
  }
);



// ✅ Get Flight Cabins by Flight Instance ID
export const getFlightInstanceCabinsByFlightInstanceAndCabinClass =
  createAsyncThunk(
    "flightInstanceCabin/getByFlightInstance",
    async ({ flightInstanceId, cabinClassId }, { rejectWithValue }) => {
      
      try {
        const res = await api.get(
          `${API_URL}/flight-instance/${flightInstanceId}/cabin-class/${cabinClassId}`,
          { headers: getHeaders() }
        );
        console.log("✅ getFlightCabinsByFlightInstance success: )))))))) ", res.data);
        return res.data;
      } catch (err) {
        console.error(
          "❌ getFlightInstanceCabinsByFlightInstanceAndCabinClass error:",
          err.response?.data?.message || err.message
        );
        return rejectWithValue(
          err.response?.data?.message ||
            "Failed to fetch flight cabins by flight instance and cabin class"
        );
      }
    }
  );

export const getFlightInstanceCabinsByFlightInstance = createAsyncThunk(
  "getFlightInstanceCabinsByFlightInstance/getByFlight",
  async ({ flightInstanceId, params = {} }, { rejectWithValue }) => {
    try {
      const res = await api.get(`${API_URL}/flight-instance/${flightInstanceId}`, {
        params,
        headers: getHeaders(),
      });
      console.log("✅ getFlightInstanceCabinsByFlight success:", res.data);
      return res.data;
    } catch (err) {
      console.error(
        "❌ getFlightCabinsByFlight error:",
        err.response?.data?.message || err.message
      );
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch flight cabins by flight"
      );
    }
  }
);

