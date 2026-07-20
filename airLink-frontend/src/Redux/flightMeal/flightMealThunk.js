import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { getHeaders } from "../../utils/getHeaders";

/**
 * Create a new flight meal
 */
export const createFlightMeal = createAsyncThunk(
  "flightMeal/create",
  async (flightMealData, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/flight-meals", flightMealData, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create flight meal"
      );
    }
  }
);

/**
 * Bulk create flight meals
 */
export const bulkCreateFlightMeals = createAsyncThunk(
  "flightMeal/bulkCreate",
  async (flightMealsData, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/flight-meals/bulk", flightMealsData, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to bulk create flight meals"
      );
    }
  }
);

/**
 * Fetch flight meals by flight ID
 */
export const fetchFlightMealsByFlightId = createAsyncThunk(
  "flightMeal/fetchByFlightId",
  async (flightId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/flight-meals/flight/${flightId}`, {
        headers: getHeaders(),
      });
      console.log("Fetched flight meals: ----- ====== ++++", response.data);
   return response.data;
    } catch (error) {
      console.log("Error fetching flight meals by flight ID:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch flight meals by flight"
      );
    }
  }
);

/**
 * Update flight meal
 */
export const updateFlightMeal = createAsyncThunk(
  "flightMeal/update",
  async ({ flightMealId, flightMealData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/flight-meals/${flightMealId}`, flightMealData, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update flight meal"
      );
    }
  }
);

/**
 * Update flight meal availability
 */
export const updateFlightMealAvailability = createAsyncThunk(
  "flightMeal/updateAvailability",
  async ({ flightMealId, available }, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        `/api/flight-meals/${flightMealId}/availability`,
        null,
        {
          params: { available },
          headers: getHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update flight meal availability"
      );
    }
  }
);

/**
 * Delete flight meal
 */
export const deleteFlightMeal = createAsyncThunk(
  "flightMeal/delete",
  async (flightMealId, { rejectWithValue }) => {
    try {
      await api.delete(`/api/flight-meals/${flightMealId}`, {
        headers: getHeaders(),
      });
      return flightMealId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete flight meal"
      );
    }
  }
);

