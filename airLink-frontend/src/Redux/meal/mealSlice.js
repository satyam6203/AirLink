import { createSlice } from "@reduxjs/toolkit";
import {
  createMeal,
  fetchMealById,
  fetchMealsByAirlineId,

  searchMeals,
  updateMeal,
  updateMealAvailability,
  deleteMeal,
} from "./mealThunk";

const initialState = {
  meals: [],
  currentMeal: null,
  loading: false,
  error: null,
  totalPages: 0,
  totalElements: 0,
  currentPage: 0,
  pageSize: 20,
};

const mealSlice = createSlice({
  name: "meal",
  initialState,
  reducers: {
    clearMealError: (state) => {
      state.error = null;
    },
    clearCurrentMeal: (state) => {
      state.currentMeal = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Meal
      .addCase(createMeal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMeal.fulfilled, (state, action) => {
        state.loading = false;
        state.meals.push(action.payload);
        state.currentMeal = action.payload;
      })
      .addCase(createMeal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Meal By ID
      .addCase(fetchMealById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMealById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMeal = action.payload;
      })
      .addCase(fetchMealById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Meals By Airline ID
      .addCase(fetchMealsByAirlineId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMealsByAirlineId.fulfilled, (state, action) => {
        state.loading = false;
        state.meals = action.payload;
      })
      .addCase(fetchMealsByAirlineId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      

      // Search Meals
      .addCase(searchMeals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchMeals.fulfilled, (state, action) => {
        state.loading = false;
        state.meals = action.payload.content || [];
        state.totalPages = action.payload.totalPages || 0;
        state.totalElements = action.payload.totalElements || 0;
        state.currentPage = action.payload.number || 0;
        state.pageSize = action.payload.size || 20;
      })
      .addCase(searchMeals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Meal
      .addCase(updateMeal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMeal.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.meals.findIndex((m) => m.id === action.payload.id);
        if (index !== -1) {
          state.meals[index] = action.payload;
        }
        state.currentMeal = action.payload;
      })
      .addCase(updateMeal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Meal Availability
      .addCase(updateMealAvailability.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMealAvailability.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.meals.findIndex((m) => m.id === action.payload.id);
        if (index !== -1) {
          state.meals[index] = action.payload;
        }
        state.currentMeal = action.payload;
      })
      .addCase(updateMealAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Meal
      .addCase(deleteMeal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMeal.fulfilled, (state, action) => {
        state.loading = false;
        state.meals = state.meals.filter((m) => m.id !== action.payload);
        if (state.currentMeal?.id === action.payload) {
          state.currentMeal = null;
        }
      })
      .addCase(deleteMeal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMealError, clearCurrentMeal } = mealSlice.actions;
export default mealSlice.reducer;
