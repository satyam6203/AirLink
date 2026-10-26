// src/redux/thunks/cityThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/api";
import { getHeaders } from "@/utils/getHeaders";

// Create City
export const createCity = createAsyncThunk(
  "city/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/cities", data, {
        headers: getHeaders(),
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create city",
      );
    }
  },
);

// Update City
export const updateCity = createAsyncThunk(
  "city/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/api/cities/${id}`, data, {
        headers: getHeaders(),
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update city",
      );
    }
  },
);

// Get All Cities (Paginated)
export const getAllCities = createAsyncThunk(
  "city/getAll",
  async (
    { page = 0, size = 20, sortBy = "name", sortDirection = "asc" } = {},
    { rejectWithValue },
  ) => {
    try {
      const res = await api.get("/api/cities/all", {
        params: { page, size, sortBy, sortDirection },
        headers: getHeaders(),
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch cities",
      );
    }
  },
);

// Delete City
export const deleteCity = createAsyncThunk(
  "city/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/cities/${id}`, { headers: getHeaders() });
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete city",
      );
    }
  },
);

// Search Cities
export const searchCities = createAsyncThunk(
  "city/search",
  async ({ keyword, page = 0, size = 20 }, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/cities/search", {
        params: { keyword, page, size },
        headers: getHeaders(),
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to search cities",
      );
    }
  },
);

// Get Cities by Country Code
export const getCitiesByCountryCode = createAsyncThunk(
  "city/getByCountryCode",
  async ({ countryCode, page = 0, size = 20 }, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/cities/country/${countryCode}`, {
        params: { page, size },
        headers: getHeaders(),
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
          "Failed to fetch cities by country code",
      );
    }
  },
);

// Check City Exists
export const checkCityExists = createAsyncThunk(
  "city/checkExists",
  async (cityCode, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/cities/exists/${cityCode}`, {
        headers: getHeaders(),
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to check city existence",
      );
    }
  },
);
