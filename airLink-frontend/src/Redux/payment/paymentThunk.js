import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/api";
import { getHeaders } from "@/utils/getHeaders";

const API_URL = "/api/payments";




// ---------- VERIFY PAYMENT ----------
/**
 * Verify payment after gateway callback
 * POST /api/payments/verify
 */
export const verifyPayment = createAsyncThunk(
  "payment/verify",
  async (request, { rejectWithValue }) => {
  console.log("Verifying payment thunk called with request: ---------- ", request);
    try {
      console.log("📤 Verifying payment with data:", request);
      const res = await api.post(`${API_URL}/verify`, request, {
        headers: getHeaders()
      });
      console.log("✅ verifyPayment success:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ verifyPayment error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data?.message || "Failed to verify payment");
    }
  }
);





// ---------- GET ALL PAYMENTS ----------
/**
 * Get all payments (Admin only)
 * GET /api/payments
 */
export const getAllPayments = createAsyncThunk(
  "payment/getAll",
  async ({ page = 0, size = 20, sortBy = "createdAt", sortDirection = "DESC" } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        sortBy,
        sortDirection
      });

      console.log("📤 Fetching all payments with params:", { page, size, sortBy, sortDirection });
      const res = await api.get(`${API_URL}?${params.toString()}`, {
        headers: getHeaders()
      });
      console.log("✅ getAllPayments success:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ getAllPayments error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data?.message || "Failed to fetch payments");
    }
  }
);





