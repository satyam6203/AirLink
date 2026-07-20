import { createSlice } from '@reduxjs/toolkit';
import {
  createAirline,
  getAirlineByAdmin,
  getAirlinesForDropdown,
  getAllAirlines,
  updateAirline,
  deleteAirline,

 
  approveAirline,
  suspendAirline,
  banAirline
} from './airlineThunks';

const initialState = {
  // Data
  airlines: [],
  dropdownAirlines: [],
  currentAirline: null,
  paginatedAirlines: {
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
  countryFilter: '',
  statusFilter: 'all',
  
  // Pagination
  currentPage: 0,
  pageSize: 10,
  sortBy: 'name',
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

const airlineSlice = createSlice({
  name: 'airline',
  initialState,
  reducers: {
    clearAirlineState: (state) => {
      state.airlines = [];
      state.currentAirline = null;
      state.paginatedAirlines = {
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
    clearCurrentAirline: (state) => {
      state.currentAirline = null;
    },
    setSearchKeyword: (state, action) => {
      state.searchKeyword = action.payload;
    },
    setCountryFilter: (state, action) => {
      state.countryFilter = action.payload;
    },
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
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
      // Create Airline
      .addCase(createAirline.pending, (state) => {
        state.loading = true;
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createAirline.fulfilled, (state, action) => {
        state.loading = false;
        state.createLoading = false;
        state.currentAirline = action.payload;
        state.airlines.unshift(action.payload);
      })
      .addCase(createAirline.rejected, (state, action) => {
        state.loading = false;
        state.createLoading = false;
        state.error = action.payload;
      })
      
      // Get Airline by Admin
      .addCase(getAirlineByAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAirlineByAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAirline = action.payload;
      })
      .addCase(getAirlineByAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get Airlines for Dropdown
      .addCase(getAirlinesForDropdown.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAirlinesForDropdown.fulfilled, (state, action) => {
        state.loading = false;
        state.dropdownAirlines = action.payload;
      })
      .addCase(getAirlinesForDropdown.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get All Airlines
      .addCase(getAllAirlines.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllAirlines.fulfilled, (state, action) => {
        state.loading = false;
        state.paginatedAirlines = action.payload;
        state.airlines = action.payload.content || action.payload;
      })
      .addCase(getAllAirlines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Airline
      .addCase(updateAirline.pending, (state) => {
        state.loading = true;
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateAirline.fulfilled, (state, action) => {
        state.loading = false;
        state.updateLoading = false;
        state.currentAirline = action.payload;
        // Update in airlines array
        const index = state.airlines.findIndex(airline => airline.id === action.payload.id);
        if (index !== -1) {
          state.airlines[index] = action.payload;
        }
        // Update in paginated airlines
        const paginatedIndex = state.paginatedAirlines.content.findIndex(airline => airline.id === action.payload.id);
        if (paginatedIndex !== -1) {
          state.paginatedAirlines.content[paginatedIndex] = action.payload;
        }
      })
      .addCase(updateAirline.rejected, (state, action) => {
        state.loading = false;
        state.updateLoading = false;
        state.error = action.payload;
      })
      
      // Delete Airline
      .addCase(deleteAirline.pending, (state) => {
        state.loading = true;
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteAirline.fulfilled, (state, action) => {
        state.loading = false;
        state.deleteLoading = false;
        // Remove from airlines array
        state.airlines = state.airlines.filter(airline => airline.id !== action.payload);
        // Remove from paginated airlines
        state.paginatedAirlines.content = state.paginatedAirlines.content.filter(airline => airline.id !== action.payload);
        if (state.paginatedAirlines.numberOfElements > 0) {
          state.paginatedAirlines.numberOfElements -= 1;
        }
      })
      .addCase(deleteAirline.rejected, (state, action) => {
        state.loading = false;
        state.deleteLoading = false;
        state.error = action.payload;
      })
      
     
    
      
      
      // Approve Airline
      .addCase(approveAirline.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveAirline.fulfilled, (state, action) => {
        state.loading = false;
        // Update in airlines array
        const index = state.airlines.findIndex(airline => airline.id === action.payload.id);
        if (index !== -1) {
          state.airlines[index] = action.payload;
        }
        // Update in paginated airlines
        const paginatedIndex = state.paginatedAirlines.content.findIndex(airline => airline.id === action.payload.id);
        if (paginatedIndex !== -1) {
          state.paginatedAirlines.content[paginatedIndex] = action.payload;
        }
      })
      .addCase(approveAirline.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Suspend Airline
      .addCase(suspendAirline.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(suspendAirline.fulfilled, (state, action) => {
        state.loading = false;
        // Update in airlines array
        const index = state.airlines.findIndex(airline => airline.id === action.payload.id);
        if (index !== -1) {
          state.airlines[index] = action.payload;
        }
        // Update in paginated airlines
        const paginatedIndex = state.paginatedAirlines.content.findIndex(airline => airline.id === action.payload.id);
        if (paginatedIndex !== -1) {
          state.paginatedAirlines.content[paginatedIndex] = action.payload;
        }
      })
      .addCase(suspendAirline.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Ban Airline
      .addCase(banAirline.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(banAirline.fulfilled, (state, action) => {
        state.loading = false;
        // Update in airlines array
        const index = state.airlines.findIndex(airline => airline.id === action.payload.id);
        if (index !== -1) {
          state.airlines[index] = action.payload;
        }
        // Update in paginated airlines
        const paginatedIndex = state.paginatedAirlines.content.findIndex(airline => airline.id === action.payload.id);
        if (paginatedIndex !== -1) {
          state.paginatedAirlines.content[paginatedIndex] = action.payload;
        }
      })
      .addCase(banAirline.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Global error matcher (following your pattern)
      .addMatcher(
        (action) => action.type.startsWith('airline/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.error = action.payload;
        }
      );
  },
});

export const {
  clearAirlineState,
  clearCurrentAirline,
  setSearchKeyword,
  setCountryFilter,
  setStatusFilter,
  setCurrentPage,
  setPageSize,
  setSortBy,
  setSortDirection,
  setValidationErrors,
  clearValidationErrors
} = airlineSlice.actions;

export default airlineSlice.reducer;

