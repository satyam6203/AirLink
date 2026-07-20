import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/api";
import { getHeaders } from "@/utils/getHeaders";

const API_URL = "/api/flights/search";

// ✅ Search Flights (Direct, Connecting, Via)
export const searchFlightsAvailability = createAsyncThunk(
  "flightSearch/search",
  async (params, { rejectWithValue }) => {

    console.log("🔍 Searching flights with params: --- ", params);
    try {
      const res = await api.get(API_URL, {
        params,
        headers: getHeaders(),
      });
      console.log("✅ searchFlightsAvailability success:", res.data);
      return res.data;
    } catch (err) {
      console.error(
        "❌ searchFlightsAvailability error:",
        err.response?.data || err.message
      );
      return rejectWithValue(
        err.response?.data?.message || "Failed to search flights"
      );
    }
  }
);
