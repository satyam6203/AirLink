// src/redux/thunks/seatThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/api";
import { getHeaders } from "@/utils/getHeaders";

const API_URL = "/api/seats";

// ---------- UPDATE ----------
export const updateSeat = createAsyncThunk(
  "seat/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`${API_URL}/${id}`, data, { headers: getHeaders() });
      console.log("✅ updateSeat success:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ updateSeat error:", err.response?.data?.message || err.message);
      return rejectWithValue(err.response?.data?.message || "Failed to update seat");
    }
  }
);
