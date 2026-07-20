import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/api";
import { getHeaders } from "@/utils/getHeaders";

// 🔹 Get user profile from JWT
export const getUserProfile = createAsyncThunk(
  "user/getProfile",
  async (token, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Get user profile success:", res.data);
      return res.data;
    } catch (err) {
      console.error("Get user profile error:", err);
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch profile"
      );
    }
  }
);



// 🔹 Get all users (super admin)
export const getAllUsers = createAsyncThunk(
  "user/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/users", { headers: getHeaders() });
      console.log("Get all users success:", res.data);
      return res.data;
    } catch (err) {
      console.error("Get all users error:", err);
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

// 🔹 Get user by ID
export const getUserById = createAsyncThunk(
  "user/getById",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/users/${userId}`);
      console.log("Get user by ID success:", res.data);
      return res.data;
    } catch (err) {
      console.error("Get user by ID error:", err);
      return rejectWithValue(err.response?.data?.message || "User not found");
    }
  }
);

// 🔹 Logout user
export const logout = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      localStorage.removeItem("jwt");
      // Optionally, clear other relevant local storage items or session data
      console.log("User logged out successfully");
      return "Logged out successfully";
    } catch (err) {
      console.error("Logout error:", err);
      return rejectWithValue(err.message || "Failed to logout");
    }
  }
);
