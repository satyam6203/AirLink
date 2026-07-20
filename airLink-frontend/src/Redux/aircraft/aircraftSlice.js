import { createSlice } from '@reduxjs/toolkit';
import {
  createAircraft,
  getAircraftById,
  listAllAircrafts,
  

  updateAircraft,
  deleteAircraft,
  
 
} from './aircraftThunks';

const initialState = {
  // Data
  aircrafts: [],
  currentAircraft: null,
  paginatedAircrafts: {
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
  
  // Filters and Search
  searchKeyword: '',
  statusFilter: 'all',
  airlineFilter: '',
  
  // Pagination
  currentPage: 0,
  pageSize: 10,
  sortBy: 'code',
  sortDirection: 'asc',
  
  // Validation
  validationErrors: {},
  
  // Specific loading states
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  searchLoading: false,
  validationLoading: false,
};

const aircraftSlice = createSlice({
  name: 'aircraft',
  initialState,
  reducers: {
    clearAircraftState: (state) => {
      state.aircrafts = [];
      state.currentAircraft = null;
      state.paginatedAircrafts = {
        content: [],
        totalElements: 0,
        totalPages: 0,
        size: 10,
        number: 0,
        first: true,
        last: false,
        numberOfElements: 0
      };
      state.error = null;
      state.validationErrors = {};
    },
    clearCurrentAircraft: (state) => {
      state.currentAircraft = null;
    },
    setSearchKeyword: (state, action) => {
      state.searchKeyword = action.payload;
    },
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
    },
    setAirlineFilter: (state, action) => {
      state.airlineFilter = action.payload;
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
    },
    setValidationErrors: (state, action) => {
      state.validationErrors = action.payload;
    },
    clearValidationErrors: (state) => {
      state.validationErrors = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Aircraft
      .addCase(createAircraft.pending, (state) => {
        state.loading = true;
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createAircraft.fulfilled, (state, action) => {
        state.loading = false;
        state.createLoading = false;
        state.currentAircraft = action.payload;
        state.aircrafts.unshift(action.payload);
      })
      .addCase(createAircraft.rejected, (state, action) => {
        state.loading = false;
        state.createLoading = false;
        state.error = action.payload;
      })
      
      // Get Aircraft by ID
      .addCase(getAircraftById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAircraftById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAircraft = action.payload;
      })
      .addCase(getAircraftById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // List All Aircrafts
      .addCase(listAllAircrafts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listAllAircrafts.fulfilled, (state, action) => {
        state.loading = false;
        state.paginatedAircrafts = action.payload;
        state.aircrafts = action.payload || action.payload;
      })
      .addCase(listAllAircrafts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      
      
      
     
      
      // Update Aircraft
      .addCase(updateAircraft.pending, (state) => {
        state.loading = true;
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateAircraft.fulfilled, (state, action) => {
        state.loading = false;
        state.updateLoading = false;
        state.currentAircraft = action.payload;
        // Update in aircrafts array
        const index = state.aircrafts.findIndex(aircraft => aircraft.id === action.payload.id);
        if (index !== -1) {
          state.aircrafts[index] = action.payload;
        }
        // Update in paginated aircrafts
        const paginatedIndex = state.paginatedAircrafts.content.findIndex(aircraft => aircraft.id === action.payload.id);
        if (paginatedIndex !== -1) {
          state.paginatedAircrafts.content[paginatedIndex] = action.payload;
        }
      })
      .addCase(updateAircraft.rejected, (state, action) => {
        state.loading = false;
        state.updateLoading = false;
        state.error = action.payload;
      })
      
      // Delete Aircraft
      .addCase(deleteAircraft.pending, (state) => {
        state.loading = true;
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteAircraft.fulfilled, (state, action) => {
        state.loading = false;
        state.deleteLoading = false;
        // Remove from aircrafts array
        state.aircrafts = state.aircrafts.filter(aircraft => aircraft.id !== action.payload);
        // Remove from paginated aircrafts
        state.paginatedAircrafts.content = state.paginatedAircrafts.content.filter(aircraft => aircraft.id !== action.payload);
        if (state.paginatedAircrafts.numberOfElements > 0) {
          state.paginatedAircrafts.numberOfElements -= 1;
        }
      })
      .addCase(deleteAircraft.rejected, (state, action) => {
        state.loading = false;
        state.deleteLoading = false;
        state.error = action.payload;
      })
      
     
      
      // Global error matcher (following the airline pattern)
      .addMatcher(
        (action) => action.type.startsWith('aircraft/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.error = action.payload;
        }
      );
  },
});

export const {
  clearAircraftState,
  clearCurrentAircraft,
  setSearchKeyword,
  setStatusFilter,
  setAirlineFilter,
  setCurrentPage,
  setPageSize,
  setSortBy,
  setSortDirection,
  setValidationErrors,
  clearValidationErrors
} = aircraftSlice.actions;

export default aircraftSlice.reducer;