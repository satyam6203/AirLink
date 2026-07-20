import api from "@/utils/api";
import { createAsyncThunk } from "@reduxjs/toolkit";


// ✅ Signup
export const signup = createAsyncThunk(
  "auth/signup",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/signup", userData);
      // AuthResponse structure: { jwt, message, title, user }
      const authResponse = res.data;
      localStorage.setItem("jwt", authResponse.jwt);
      console.log("Signup success:", authResponse);
      return authResponse;
    } catch (err) {
      console.error("Signup error:", err);
      return rejectWithValue(err.response?.data?.message || "Signup failed");
    }
  }
);

// ✅ Login
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {

    console.log("Credentials:", credentials);
    try {
      const res = await api.post("/auth/login", credentials);
      // AuthResponse structure: { jwt, message, title, user }
      const authResponse = res.data;
      console.log("Login success:", authResponse);
      localStorage.setItem("jwt", authResponse.jwt);

      return authResponse;
    } catch (err) {
      console.error("Login error:", err);
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

// ✅ Forgot Password
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/forgot-password", { email });
      console.log("Forgot password success:", res.data);
      return res.data;
    } catch (err) {
      console.error("Forgot password error:", err);
      return rejectWithValue(err.response?.data?.message || "Failed to send reset email");
    }
  }
);

// ✅ Reset Password
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/reset-password", { token, password });
      console.log("Reset password success:", res.data);
      return res.data;
    } catch (err) {
      console.error("Reset password error:", err);
      return rejectWithValue(err.response?.data?.message || "Failed to reset password");
    }
  }
);