import { createSlice } from "@reduxjs/toolkit";
import {
  createFlightSchedule,
  getFlightScheduleById,
  getAllFlightSchedules,
  updateFlightSchedule,
  deleteFlightSchedule
} from "./flightScheduleThunk.js";

const initialState = {
  // Data
  flightSchedules: [],
  currentFlightSchedule: null,
  paginatedFlightSchedules: {
    content: [],
    totalElements: 0,
    totalPages: 0,
    size: 10,
    number: 0,
    first: true,
    last: false,
    numberOfElements: 0
  },

  // UI State
  loading: false,
  error: null,

  // Filters/Search
  searchKeyword: "",
  currentPage: 0,
  pageSize: 10,
  sortBy: "departureAirportId",
  sortDirection: "asc",

  // Specific loading states
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  searchLoading: false
};

const flightScheduleSlice = createSlice({
  name: "flightSchedule",
  initialState,
  reducers: {
    clearFlightScheduleState: (state) => {
      state.flightSchedules = [];
      state.currentFlightSchedule = null;
      state.paginatedFlightSchedules = initialState.paginatedFlightSchedules;
      state.error = null;
    },
    clearCurrentFlightSchedule: (state) => {
      state.currentFlightSchedule = null;
    },
    setSearchKeyword: (state, action) => {
      state.searchKeyword = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setSortDirection: (state, action) => {
      state.sortDirection = action.payload;
    }
  },
  extraReducers: (builder) => {
    // ---------- CREATE ----------
    builder
      .addCase(createFlightSchedule.pending, (state) => {
        state.loading = true;
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createFlightSchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.createLoading = false;
        state.currentFlightSchedule = action.payload;
        state.flightSchedules.unshift(action.payload);
      })
      .addCase(createFlightSchedule.rejected, (state, action) => {
        state.loading = false;
        state.createLoading = false;
        state.error = action.payload;
      });

    // ---------- GET BY ID ----------
    builder
      .addCase(getFlightScheduleById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFlightScheduleById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentFlightSchedule = action.payload;
      })
      .addCase(getFlightScheduleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ---------- GET ALL ----------
    builder
      .addCase(getAllFlightSchedules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllFlightSchedules.fulfilled, (state, action) => {
        state.loading = false;
        state.flightSchedules = action.payload.content || action.payload;
        state.paginatedFlightSchedules = action.payload;
      })
      .addCase(getAllFlightSchedules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ---------- UPDATE ----------
    builder
      .addCase(updateFlightSchedule.pending, (state) => {
        state.loading = true;
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateFlightSchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.updateLoading = false;
        state.currentFlightSchedule = action.payload;
        const index = state.flightSchedules.findIndex(fs => fs.id === action.payload.id);
        if (index !== -1) state.flightSchedules[index] = action.payload;
        const paginatedIndex = state.paginatedFlightSchedules.content.findIndex(fs => fs.id === action.payload.id);
        if (paginatedIndex !== -1) state.paginatedFlightSchedules.content[paginatedIndex] = action.payload;
      })
      .addCase(updateFlightSchedule.rejected, (state, action) => {
        state.loading = false;
        state.updateLoading = false;
        state.error = action.payload;
      });

    // ---------- DELETE ----------
    builder
      .addCase(deleteFlightSchedule.pending, (state) => {
        state.loading = true;
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteFlightSchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.deleteLoading = false;
        state.flightSchedules = state.flightSchedules.filter(fs => fs.id !== action.payload);
        state.paginatedFlightSchedules.content = state.paginatedFlightSchedules.content.filter(fs => fs.id !== action.payload);
        if (state.paginatedFlightSchedules.numberOfElements > 0) state.paginatedFlightSchedules.numberOfElements -= 1;
      })
      .addCase(deleteFlightSchedule.rejected, (state, action) => {
        state.loading = false;
        state.deleteLoading = false;
        state.error = action.payload;
      });

    // Global error matcher
    builder.addMatcher(
      (action) => action.type.startsWith("flightSchedule/") && action.type.endsWith("/rejected"),
      (state, action) => {
        state.error = action.payload;
      }
    );
  }
});

export const {
  clearFlightScheduleState,
  clearCurrentFlightSchedule,
  setSearchKeyword,
  setCurrentPage,
  setPageSize,
  setSortBy,
  setSortDirection
} = flightScheduleSlice.actions;

export default flightScheduleSlice.reducer;
