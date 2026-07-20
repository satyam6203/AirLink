// src/redux/thunks/bookingThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/api";
import { getHeaders } from "@/utils/getHeaders";

const API_URL = "/api/bookings";

// ---------- CREATE ----------
export const createBooking = createAsyncThunk(
  "booking/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post(API_URL, data, { headers: getHeaders() });
      console.log("✅ createBooking success:", res.data);

      // Check for checkout URL in the response (checkoutUrl or payment_link_url)
      const checkoutUrl = res.data.checkoutUrl || res.data.payment_link_url;

      if (checkoutUrl && res.data.success) {
        // Store payment details before redirecting
        sessionStorage.setItem('paymentDetails', JSON.stringify({
          paymentId: res.data.paymentId,
          transactionId: res.data.transactionId,
          razorpayOrderId: res.data.razorpayOrderId,
          amount: res.data.amount,
          gateway: res.data.gateway
        }));

        // Redirect to payment gateway
        window.location.href = checkoutUrl;
      }

      return res.data;
    } catch (err) {
      console.error("❌ createBooking error:", err.response?.data?.message || err.message);
      return rejectWithValue(err.response?.data?.message || "Failed to create booking");
    }
  }
);

// ---------- UPDATE ----------
export const updateBooking = createAsyncThunk(
  "booking/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`${API_URL}/${id}`, data, { headers: getHeaders() });
      console.log("✅ updateBooking success:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ updateBooking error:", err.response?.data?.message || err.message);
      return rejectWithValue(err.response?.data?.message || "Failed to update booking");
    }
  }
);

// ---------- GET BY ID ----------
export const getBookingById = createAsyncThunk(
  "booking/getById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`${API_URL}/${id}`, { headers: getHeaders() });
      console.log("✅ getBookingById success:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ getBookingById error:", err.response?.data?.message || err.message);
      return rejectWithValue(err.response?.data?.message || "Booking not found");
    }
  }
);



// ---------- GET BY AIRLINE ----------
export const getBookingsByAirline = createAsyncThunk(
  "booking/getByAirline",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();

      if (filters.search) params.append('search', filters.search);
      if (filters.status && filters.status !== 'all') params.append('status', filters.status);
      if (filters.flightInstanceId) params.append('flightInstanceId', filters.flightInstanceId);
      if (filters.sortDirection) params.append('sortDirection', filters.sortDirection);

      const queryString = params.toString();
      const url = queryString ? `${API_URL}/airline?${queryString}` : `${API_URL}/airline`;

      const res = await api.get(url, { headers: getHeaders() });
      console.log("✅ getBookingsByAirline success:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ getBookingsByAirline error:", err.response?.data?.message || err.message);
      return rejectWithValue(err.response?.data?.message || "Failed to fetch bookings by airline");
    }
  }
);

// ---------- GET BY USER ----------
export const getBookingsByUser = createAsyncThunk(
  "booking/getByUser",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await api.get(`${API_URL}/user/history`, { headers: getHeaders() });
      console.log("✅ getBookingsByUser success:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ getBookingsByUser error:", err.response?.data?.message || err.message);
      return rejectWithValue(err.response?.data?.message || "Failed to fetch bookings by user");
    }
  }
);

// ---------- GET BY FLIGHT ----------
export const getBookingsByFlight = createAsyncThunk(
  "booking/getByFlight",
  async (flightId, { rejectWithValue }) => {
    try {
      const res = await api.get(`${API_URL}/flight/${flightId}`, { headers: getHeaders() });
      console.log("✅ getBookingsByFlight success:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ getBookingsByFlight error:", err.response?.data?.message || err.message);
      return rejectWithValue(err.response?.data?.message || "Failed to fetch bookings by flight");
    }
  }
);



// ---------- CANCEL ----------
export const cancelBooking = createAsyncThunk(
  "booking/cancel",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.patch(`${API_URL}/${id}/cancel`, null, { headers: getHeaders() });
      console.log("✅ cancelBooking success:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ cancelBooking error:", err.response?.data?.message || err.message);
      return rejectWithValue(err.response?.data?.message || "Failed to cancel booking");
    }
  }
);



// ---------- DELETE ----------
export const deleteBooking = createAsyncThunk(
  "booking/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`${API_URL}/${id}`, { headers: getHeaders() });
      console.log("✅ deleteBooking success:", id);
      return id;
    } catch (err) {
      console.error("❌ deleteBooking error:", err.response?.data?.message || err.message);
      return rejectWithValue(err.response?.data?.message || "Failed to delete booking");
    }
  }
);




// ---------- GET COUNT BY FLIGHT ----------
export const getBookingCountByFlight = createAsyncThunk(
  "booking/getCountByFlight",
  async (flightId, { rejectWithValue }) => {
    try {
      const res = await api.get(`${API_URL}/count/flight/${flightId}`, { headers: getHeaders() });
      console.log("✅ getBookingCountByFlight success:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ getBookingCountByFlight error:", err.response?.data?.message || err.message);
      return rejectWithValue(err.response?.data?.message || "Failed to fetch booking count by flight");
    }
  }
);



// ---------- GET BOOKING STATISTICS FOR AIRLINE ----------
export const getBookingStatisticsForAirline = createAsyncThunk(
  "booking/getStatisticsForAirline",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(`${API_URL}/statistics/airline`, { headers: getHeaders() });
      console.log("✅ getBookingStatisticsForAirline success:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ getBookingStatisticsForAirline error:", err.response?.data?.message || err.message);
      return rejectWithValue(err.response?.data?.message || "Failed to fetch booking statistics");
    }
  }
);

// ---------- GET ROUTE PERFORMANCE FOR AIRLINE ----------
export const getRoutePerformanceForAirline = createAsyncThunk(
  "booking/getRoutePerformanceForAirline",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(`${API_URL}/route-performance/airline`, { headers: getHeaders() });
      console.log("✅ getRoutePerformanceForAirline success:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ getRoutePerformanceForAirline error:", err.response?.data?.message || err.message);
      return rejectWithValue(err.response?.data?.message || "Failed to fetch route performance");
    }
  }
);

// ---------- GET AIRPORT PERFORMANCE FOR AIRLINE ----------
export const getAirportPerformanceForAirline = createAsyncThunk(
  "booking/getAirportPerformanceForAirline",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(`${API_URL}/airport-performance/airline`, { headers: getHeaders() });
      console.log("✅ getAirportPerformanceForAirline success:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ getAirportPerformanceForAirline error:", err.response?.data?.message || err.message);
      return rejectWithValue(err.response?.data?.message || "Failed to fetch airport performance");
    }
  }
);

// ---------- GET AIRPORT PERFORMANCE FOR SUPER ADMIN ----------
export const getAirportPerformanceForSuperAdmin = createAsyncThunk(
  "booking/getAirportPerformanceForSuperAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(`${API_URL}/airport-performance/super-admin`, { headers: getHeaders() });
      console.log("✅ getAirportPerformanceForSuperAdmin success:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ getAirportPerformanceForSuperAdmin error:", err.response?.data?.message || err.message);
      return rejectWithValue(err.response?.data?.message || "Failed to fetch airport performance");
    }
  }
);

// ---------- GET ROUTE PERFORMANCE FOR SUPER ADMIN ----------
export const getRoutePerformanceForSuperAdmin = createAsyncThunk(
  "booking/getRoutePerformanceForSuperAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(`${API_URL}/route-performance/super-admin`, { headers: getHeaders() });
      console.log("✅ getRoutePerformanceForSuperAdmin success:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ getRoutePerformanceForSuperAdmin error:", err.response?.data?.message || err.message);
      return rejectWithValue(err.response?.data?.message || "Failed to fetch route performance");
    }
  }
);

// ---------- GET BOOKING STATISTICS FOR SUPER ADMIN ----------
export const getBookingStatisticsForSuperAdmin = createAsyncThunk(
  "booking/getStatisticsForSuperAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(`${API_URL}/statistics/super-admin`, { headers: getHeaders() });
      console.log("✅ getBookingStatisticsForSuperAdmin success:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ getBookingStatisticsForSuperAdmin error:", err.response?.data?.message || err.message);
      return rejectWithValue(err.response?.data?.message || "Failed to fetch platform statistics");
    }
  }
);

// ---------- GET AIRLINE PERFORMANCE FOR SUPER ADMIN ----------
export const getAirlinePerformanceForSuperAdmin = createAsyncThunk(
  "booking/getAirlinePerformanceForSuperAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(`${API_URL}/airline-performance/super-admin`, { headers: getHeaders() });
      console.log("✅ getAirlinePerformanceForSuperAdmin success:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ getAirlinePerformanceForSuperAdmin error:", err.response?.data?.message || err.message);
      return rejectWithValue(err.response?.data?.message || "Failed to fetch airline performance");
    }
  }
);

// ---------- GET DASHBOARD STATS FOR SUPER ADMIN ----------
export const getSuperAdminDashboardStats = createAsyncThunk(
  "booking/getSuperAdminDashboardStats",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(`${API_URL}/dashboard-stats/super-admin`, { headers: getHeaders() });
      console.log("✅ getSuperAdminDashboardStats success:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ getSuperAdminDashboardStats error:", err.response?.data?.message || err.message);
      return rejectWithValue(err.response?.data?.message || "Failed to fetch dashboard stats");
    }
  }
);
