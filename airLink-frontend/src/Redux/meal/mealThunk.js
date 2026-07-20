import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { getHeaders } from "../../utils/getHeaders";

/**
 * Create a new meal
 */
export const createMeal = createAsyncThunk(
  "meal/create",
  async (mealData, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/meals", mealData, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create meal"
      );
    }
  }
);

/**
 * Fetch meal by ID
 */
export const fetchMealById = createAsyncThunk(
  "meal/fetchById",
  async (mealId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/meals/${mealId}`, {
        headers: getHeaders(),
      });
      console.log("Fetched meal:", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch meal"
      );
    }
  }
);

/**
 * Fetch meals by airline ID
 */
export const fetchMealsByAirlineId = createAsyncThunk(
  "meal/fetchByAirlineId",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/meals/airline`, {
        headers: getHeaders(),
      });
      console.log("Meals by airline response:", response.data);
      return response.data;
    } catch (error) {
      console.log("Error fetching meals by airline:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch meals by airline"
      );
    }
  }
);



/**
 * Search meals
 */
export const searchMeals = createAsyncThunk(
  "meal/search",
  async ({ keyword, page = 0, size = 20 }, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/meals/search", {
        params: { keyword, page, size },
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to search meals"
      );
    }
  }
);

/**
 * Update meal
 */
export const updateMeal = createAsyncThunk(
  "meal/update",
  async ({ mealId, mealData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/meals/${mealId}`, mealData, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update meal"
      );
    }
  }
);

/**
 * Update meal availability
 */
export const updateMealAvailability = createAsyncThunk(
  "meal/updateAvailability",
  async ({ mealId, available }, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        `/api/meals/${mealId}/availability`,
        null,
        {
          params: { available },
          headers: getHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update meal availability"
      );
    }
  }
);

/**
 * Delete meal
 */
export const deleteMeal = createAsyncThunk(
  "meal/delete",
  async (mealId, { rejectWithValue }) => {
    try {
      await api.delete(`/api/meals/${mealId}`, {
        headers: getHeaders(),
      });
      return mealId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete meal"
      );
    }
  }
);
