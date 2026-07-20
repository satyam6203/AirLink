import { createSlice } from "@reduxjs/toolkit";
import {
  createFlightInstance,
  getFlightInstanceById,
  getAllFlightInstances,
 
  updateFlightInstance,
  deleteFlightInstance
} from "./flightInstanceThunk.js";

const initialState = {
  // Data
  flightInstances: [],
  flightInstance: null,
  paginatedFlightInstances: {
    content: [],
    totalElements: 0,
    totalPages: 0,
    size: 10,
    number: 0,
    first: true,
    last: false,
    numberOfElements: 0
  },

  // Search Results (direct flights only)
  searchResults: {
    directFlights: [],
    totalResults: 0
  },

  // UI State
  loading: false,
  error: null,

  // Filters/Search
  searchKeyword: "",
  currentPage: 0,
  pageSize: 10,
  sortBy: "departureDate",
  sortDirection: "asc",

  // Airline flight instances (for dropdowns)
  airlineFlightInstances: [],
  airlineFlightInstancesLoading: false,

  // Specific loading states
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  searchLoading: false
};

const flightInstanceSlice = createSlice({
  name: "flightInstance",
  initialState,
  reducers: {
    clearFlightInstanceState: (state) => {
      state.flightInstances = [];
      state.flightInstance = null;
      state.paginatedFlightInstances = initialState.paginatedFlightInstances;
      state.error = null;
    },
    clearflightInstance: (state) => {
      state.flightInstance = null;
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
      .addCase(createFlightInstance.pending, (state) => {
        state.loading = true;
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createFlightInstance.fulfilled, (state, action) => {
        state.loading = false;
        state.createLoading = false;
        state.flightInstance = action.payload;
        state.flightInstances.unshift(action.payload);
      })
      .addCase(createFlightInstance.rejected, (state, action) => {
        state.loading = false;
        state.createLoading = false;
        state.error = action.payload;
      });

    // ---------- GET BY ID ----------
    builder
      .addCase(getFlightInstanceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFlightInstanceById.fulfilled, (state, action) => {
        state.loading = false;
        state.flightInstance = action.payload;
      })
      .addCase(getFlightInstanceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });


    // ---------- GET ALL ----------
    builder
      .addCase(getAllFlightInstances.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllFlightInstances.fulfilled, (state, action) => {
        state.loading = false;
        state.flightInstances = action.payload.content || action.payload;
        state.paginatedFlightInstances = action.payload;
      })
      .addCase(getAllFlightInstances.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ---------- UPDATE ----------
    builder
      .addCase(updateFlightInstance.pending, (state) => {
        state.loading = true;
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateFlightInstance.fulfilled, (state, action) => {
        state.loading = false;
        state.updateLoading = false;
        state.flightInstance = action.payload;
        const index = state.flightInstances.findIndex(fi => fi.id === action.payload.id);
        if (index !== -1) state.flightInstances[index] = action.payload;
        const paginatedIndex = state.paginatedFlightInstances.content.findIndex(fi => fi.id === action.payload.id);
        if (paginatedIndex !== -1) state.paginatedFlightInstances.content[paginatedIndex] = action.payload;
      })
      .addCase(updateFlightInstance.rejected, (state, action) => {
        state.loading = false;
        state.updateLoading = false;
        state.error = action.payload;
      });

    // ---------- DELETE ----------
    builder
      .addCase(deleteFlightInstance.pending, (state) => {
        state.loading = true;
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteFlightInstance.fulfilled, (state, action) => {
        state.loading = false;
        state.deleteLoading = false;
        state.flightInstances = state.flightInstances.filter(fi => fi.id !== action.payload);
        state.paginatedFlightInstances.content = state.paginatedFlightInstances.content.filter(fi => fi.id !== action.payload);
        if (state.paginatedFlightInstances.numberOfElements > 0) state.paginatedFlightInstances.numberOfElements -= 1;
      })
      .addCase(deleteFlightInstance.rejected, (state, action) => {
        state.loading = false;
        state.deleteLoading = false;
        state.error = action.payload;
      });


    // Global error matcher
    builder.addMatcher(
      (action) => action.type.startsWith("flightInstance/") && action.type.endsWith("/rejected"),
      (state, action) => {
        state.error = action.payload;
      }
    );
  }
});

export const {
  clearFlightInstanceState,
  clearflightInstance,
  setSearchKeyword,
  setCurrentPage,
  setPageSize,
  setSortBy,
  setSortDirection
} = flightInstanceSlice.actions;

export default flightInstanceSlice.reducer;
