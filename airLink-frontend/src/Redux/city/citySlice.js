import { createSlice } from "@reduxjs/toolkit";
import {
  createCity,
  updateCity,
  deleteCity,
  getAllCities,
  searchCities,
  getCitiesByCountryCode,
  checkCityExists as cityExists,
} from "./cityThunk.js";

const initialState = {
  cities: [],
  city: null,
  loading: false,
  error: null,
  pagination: {
    totalElements: 0,
    totalPages: 0,
    page: 0,
    size: 0,
    last: false,
    first: false
  },
};

const citySlice = createSlice({
  name: "city",
  initialState,
  reducers: {
    clearCityError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ---------- CREATE ----------
    builder.addCase(createCity.pending, (state) => {
      console.log("⏳ createCity pending");
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createCity.fulfilled, (state, action) => {
      console.log("✅ createCity fulfilled");
      state.loading = false;
      state.city = action.payload;
      state.cities.push(action.payload);
      state.pagination.totalElements += 1;
    });
    builder.addCase(createCity.rejected, (state, action) => {
      console.log("❌ createCity rejected:", action.payload);
      state.loading = false;
      state.error = action.payload;
    });

    // ---------- UPDATE ----------
    builder.addCase(updateCity.pending, (state) => {
      console.log("⏳ updateCity pending");
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateCity.fulfilled, (state, action) => {
      console.log("✅ updateCity fulfilled");
      state.loading = false;
      state.city = action.payload;
      state.cities = state.cities.map((c) =>
        c.id === action.payload.id ? action.payload : c
      );
    });
    builder.addCase(updateCity.rejected, (state, action) => {
      console.log("❌ updateCity rejected:", action.payload);
      state.loading = false;
      state.error = action.payload;
    });

    // ---------- DELETE ----------
    builder.addCase(deleteCity.pending, (state) => {
      console.log("⏳ deleteCity pending");
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteCity.fulfilled, (state, action) => {
      console.log("✅ deleteCity fulfilled");
      state.loading = false;
      state.cities = state.cities.filter((c) => c.id !== action.payload);
      if (state.city?.id === action.payload) state.city = null;
    });
    builder.addCase(deleteCity.rejected, (state, action) => {
      console.log("❌ deleteCity rejected:", action.payload);
      state.loading = false;
      state.error = action.payload;
    });

    // ---------- GET ALL ----------
    builder.addCase(getAllCities.pending, (state) => {
      console.log("⏳ getAllCities pending");
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getAllCities.fulfilled, (state, action) => {
      console.log("✅ getAllCities fulfilled");
      state.loading = false;
      state.loading = false;
      state.cities = action.payload.content;
      state.pagination = {
        totalElements: action.payload.totalElements,
        totalPages: action.payload.totalPages,
        page: action.payload.number,
        size: action.payload.size,
        last: action.payload.last,
        first: action.payload.first,
      };
    });
    builder.addCase(getAllCities.rejected, (state, action) => {
      console.log("❌ getAllCities rejected:", action.payload);
      state.loading = false;
      state.error = action.payload;
    });

    // ---------- SEARCH ----------
    builder.addCase(searchCities.pending, (state) => {
      console.log("⏳ searchCities pending");
      state.loading = true;
      state.error = null;
    });
    builder.addCase(searchCities.fulfilled, (state, action) => {
      console.log("✅ searchCities fulfilled");
      state.loading = false;
      state.cities = action.payload;
    });
    builder.addCase(searchCities.rejected, (state, action) => {
      console.log("❌ searchCities rejected:", action.payload);
      state.loading = false;
      state.error = action.payload;
    });

    // ---------- GET BY COUNTRY CODE ----------
    builder.addCase(getCitiesByCountryCode.pending, (state) => {
      console.log("⏳ getCitiesByCountryCode pending");
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getCitiesByCountryCode.fulfilled, (state, action) => {
      console.log("✅ getCitiesByCountryCode fulfilled");
      state.loading = false;
      state.cities = action.payload;
    });
    builder.addCase(getCitiesByCountryCode.rejected, (state, action) => {
      console.log("❌ getCitiesByCountryCode rejected:", action.payload);
      state.loading = false;
      state.error = action.payload;
    });

    // ---------- CHECK EXISTS ----------
    builder.addCase(cityExists.pending, (state) => {
      console.log("⏳ cityExists pending");
      state.loading = true;
      state.error = null;
    });
    builder.addCase(cityExists.fulfilled, (state, action) => {
      console.log("✅ cityExists fulfilled");
      state.loading = false;
      state.city = action.payload;
    });
    builder.addCase(cityExists.rejected, (state, action) => {
      console.log("❌ cityExists rejected:", action.payload);
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { clearCityError } = citySlice.actions;
export default citySlice.reducer;
