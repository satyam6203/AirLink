import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/api";
import { getHeaders } from "@/utils/getHeaders";

const API_URL = "/api/flight-instances";

// ✅ Create Flight Instance
export const createFlightInstance = createAsyncThunk(
  "flightInstance/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post(API_URL, data, { headers: getHeaders() });
      console.log("✅ createFlightInstance success:", res.data);
      return res.data;
    } catch (err) {
      console.error(
        "❌ createFlightInstance error:",
        err.response?.data?.message || err.message,
      );
      return rejectWithValue(
        err.response?.data?.message || "Failed to create flight instance",
      );
    }
  },
);

// ✅ Get Flight Instance by ID
export const getFlightInstanceById = createAsyncThunk(
  "flightInstance/getById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`${API_URL}/${id}`, {
        headers: getHeaders(),
      });
      console.log("✅ getFlightInstanceById success:", res.data);
      return res.data;
    } catch (err) {
      console.error(
        "❌ getFlightInstanceById error:",
        err.response?.data?.message || err.message,
      );
      return rejectWithValue(
        err.response?.data?.message || "Flight instance not found",
      );
    }
  },
);

// ✅ Get All Flight Instances with Pagination and Filters (By Airline)
export const getAllFlightInstances = createAsyncThunk(
  "flightInstance/getAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const {
        page = 0,
        size = 10,
        onDate,
        departureAirportId,
        arrivalAirportId,
        flightId,
        sort = "departureDateTime,asc",
      } = params;

      const queryParams = {
        page,
        size,
        sort,
        ...(onDate && { onDate }),
        ...(departureAirportId &&
          departureAirportId !== "all" && { departureAirportId }),
        ...(arrivalAirportId && arrivalAirportId !== "all" && { arrivalAirportId }),
        ...(flightId && flightId !== "all" && { flightId }),
      };

      const res = await api.get(API_URL, {
        params: queryParams,
        headers: getHeaders(),
      });
      console.log("✅ getAllFlightInstances success:", res.data);
      return res.data; // Returns Page object with content, totalPages, totalElements, etc.
    } catch (err) {
      console.error(
        "❌ getAllFlightInstances error:",
        err.response?.data?.message || err.message,
      );
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch flight instances",
      );
    }
  },
);

// ✅ Update Flight Instance
export const updateFlightInstance = createAsyncThunk(
  "flightInstance/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`${API_URL}/${id}`, data, {
        headers: getHeaders(),
      });
      console.log("✅ updateFlightInstance success:", res.data);
      return res.data;
    } catch (err) {
      console.error(
        "❌ updateFlightInstance error:",
        err.response?.data?.message || err.message,
      );
      return rejectWithValue(
        err.response?.data?.message || "Failed to update flight instance",
      );
    }
  },
);



// ✅ Delete Flight Instance
export const deleteFlightInstance = createAsyncThunk(
  "flightInstance/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`${API_URL}/${id}`, { headers: getHeaders() });
      console.log("✅ deleteFlightInstance success:", id);
      return id;
    } catch (err) {
      console.error(
        "❌ deleteFlightInstance error:",
        err.response?.data?.message || err.message,
      );
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete flight instance",
      );
    }
  },
);
