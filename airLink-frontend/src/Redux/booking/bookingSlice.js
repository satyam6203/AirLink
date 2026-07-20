import { createSlice } from "@reduxjs/toolkit";
import {
  createBooking,
  updateBooking,
  getBookingById,

  
  cancelBooking,
 
  deleteBooking,

  getBookingsByAirline,
  getBookingsByUser,
  getBookingsByFlight,

 
  getBookingCountByFlight,
 
  getBookingStatisticsForAirline,
  getRoutePerformanceForAirline,
  getAirportPerformanceForAirline,
  getAirportPerformanceForSuperAdmin,
  getRoutePerformanceForSuperAdmin,
  getAirlinePerformanceForSuperAdmin,
  getBookingStatisticsForSuperAdmin,
  getSuperAdminDashboardStats,
} from "./bookingThunk.js";

const initialState = {
  bookings: [],
  booking: null,
  statistics: null,
  routePerformance: null,
  airportPerformance: null,
  superAdminAirportPerformance: null,
  superAdminAirportPerformanceLoading: false,
  superAdminRoutePerformance: null,
  superAdminRoutePerformanceLoading: false,
  superAdminAirlinePerformance: null,
  superAdminAirlinePerformanceLoading: false,
  superAdminStatistics: null,
  superAdminStatisticsLoading: false,
  superAdminDashboardStats: null,
  superAdminDashboardStatsLoading: false,
  airportPerformanceLoading: false,
  loading: false,
  routePerformanceLoading: false,
  error: null,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    clearBookingError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ---------- CREATE ----------
    builder.addCase(createBooking.pending, (state) => {
      console.log("⏳ createBooking pending");
      state.routePerformanceLoading = true;
      state.error = null;
    });
    builder.addCase(createBooking.fulfilled, (state, action) => {
      console.log("✅ createBooking fulfilled");
      state.loading = false;
      state.booking = action.payload;
      state.bookings.push(action.payload);
    });
    builder.addCase(createBooking.rejected, (state, action) => {
      console.log("❌ createBooking rejected:", action.payload);
      state.loading = false;
      state.error = action.payload;
    });

    // ---------- UPDATE ----------
    builder.addCase(updateBooking.pending, (state) => {
      console.log("⏳ updateBooking pending");
      state.routePerformanceLoading = true;
      state.error = null;
    });
    builder.addCase(updateBooking.fulfilled, (state, action) => {
      console.log("✅ updateBooking fulfilled");
      state.loading = false;
      state.booking = action.payload;
      state.bookings = state.bookings.map((b) =>
        b.id === action.payload.id ? action.payload : b
      );
    });
    builder.addCase(updateBooking.rejected, (state, action) => {
      console.log("❌ updateBooking rejected:", action.payload);
      state.loading = false;
      state.error = action.payload;
    });

    // ---------- GET BY ID ----------
    builder.addCase(getBookingById.pending, (state) => {
      console.log("⏳ getBookingById pending");
      state.routePerformanceLoading = true;
      state.error = null;
    });
    builder.addCase(getBookingById.fulfilled, (state, action) => {
      console.log("✅ getBookingById fulfilled");
      state.loading = false;
      state.booking = action.payload;
    });
    builder.addCase(getBookingById.rejected, (state, action) => {
      console.log("❌ getBookingById rejected:", action.payload);
      state.loading = false;
      state.error = action.payload;
    });

  

    // ---------- CANCEL ----------
    builder.addCase(cancelBooking.pending, (state) => {
      console.log("⏳ cancelBooking pending");
      state.routePerformanceLoading = true;
      state.error = null;
    });
    builder.addCase(cancelBooking.fulfilled, (state, action) => {
      console.log("✅ cancelBooking fulfilled");
      state.loading = false;
      state.booking = action.payload;
      state.bookings = state.bookings.map((b) =>
        b.id === action.payload.id ? action.payload : b
      );
    });
    builder.addCase(cancelBooking.rejected, (state, action) => {
      console.log("❌ cancelBooking rejected:", action.payload);
      state.loading = false;
      state.error = action.payload;
    });

    

    // ---------- DELETE ----------
    builder.addCase(deleteBooking.pending, (state) => {
      console.log("⏳ deleteBooking pending");
      state.routePerformanceLoading = true;
      state.error = null;
    });
    builder.addCase(deleteBooking.fulfilled, (state, action) => {
      console.log("✅ deleteBooking fulfilled");
      state.loading = false;
      state.bookings = state.bookings.filter((b) => b.id !== action.payload);
      if (state.booking?.id === action.payload) state.booking = null;
    });
    builder.addCase(deleteBooking.rejected, (state, action) => {
      console.log("❌ deleteBooking rejected:", action.payload);
      state.loading = false;
      state.error = action.payload;
    });

    // ---------- GET BY AIRLINE ----------
    builder.addCase(getBookingsByAirline.pending, (state) => {
      console.log("⏳ getBookingsByAirline pending");
      state.routePerformanceLoading = true;
      state.error = null;
    });
    builder.addCase(getBookingsByAirline.fulfilled, (state, action) => {
      console.log("✅ getBookingsByAirline fulfilled");
      state.loading = false;
      state.bookings = action.payload;
      state.error = null;
    });
    builder.addCase(getBookingsByAirline.rejected, (state, action) => {
      console.log("❌ getBookingsByAirline rejected:", action.payload);
      state.loading = false;
      state.error = action.payload;
    });

    // ---------- GET BY USER ----------
    builder.addCase(getBookingsByUser.pending, (state) => {
      console.log("⏳ getBookingsByUser pending");
      state.routePerformanceLoading = true;
      state.error = null;
    });
    builder.addCase(getBookingsByUser.fulfilled, (state, action) => {
      console.log("✅ getBookingsByUser fulfilled");
      state.loading = false;
      state.bookings = action.payload;
    });
    builder.addCase(getBookingsByUser.rejected, (state, action) => {
      console.log("❌ getBookingsByUser rejected:", action.payload);
      state.loading = false;
      state.error = action.payload;
    });

    // ---------- GET BY FLIGHT ----------
    builder.addCase(getBookingsByFlight.pending, (state) => {
      console.log("⏳ getBookingsByFlight pending");
      state.routePerformanceLoading = true;
      state.error = null;
    });
    builder.addCase(getBookingsByFlight.fulfilled, (state, action) => {
      console.log("✅ getBookingsByFlight fulfilled");
      state.loading = false;
      state.bookings = action.payload;
    });
    builder.addCase(getBookingsByFlight.rejected, (state, action) => {
      console.log("❌ getBookingsByFlight rejected:", action.payload);
      state.loading = false;
      state.error = action.payload;
    });


    // ---------- GET COUNT BY FLIGHT ----------
    builder.addCase(getBookingCountByFlight.pending, (state) => {
      console.log("⏳ getBookingCountByFlight pending");
      state.routePerformanceLoading = true;
      state.error = null;
    });
    builder.addCase(getBookingCountByFlight.fulfilled, (state, action) => {
      console.log("✅ getBookingCountByFlight fulfilled");
      state.loading = false;
    });
    builder.addCase(getBookingCountByFlight.rejected, (state, action) => {
      console.log("❌ getBookingCountByFlight rejected:", action.payload);
      state.loading = false;
      state.error = action.payload;
    });

  

    // ---------- GET BOOKING STATISTICS FOR AIRLINE ----------
    builder
      .addCase(getBookingStatisticsForAirline.pending, (state) => {
        console.log("⏳ getBookingStatisticsForAirline pending");
        state.routePerformanceLoading = true;
        state.error = null;
      })
      .addCase(getBookingStatisticsForAirline.fulfilled, (state, action) => {
        console.log("✅ getBookingStatisticsForAirline fulfilled");
        state.loading = false;
        state.statistics = action.payload;
      })
      .addCase(getBookingStatisticsForAirline.rejected, (state, action) => {
        console.log(
          "❌ getBookingStatisticsForAirline rejected:",
          action.payload
        );
        state.loading = false;
      });

    // ---------- GET ROUTE PERFORMANCE FOR AIRLINE ----------
    builder
      .addCase(getRoutePerformanceForAirline.pending, (state) => {
        console.log("⏳ getRoutePerformanceForAirline pending");
        state.routePerformanceLoading = true;
        state.error = null;
      })
      .addCase(getRoutePerformanceForAirline.fulfilled, (state, action) => {
        console.log("✅ getRoutePerformanceForAirline fulfilled");
        state.routePerformanceLoading = false;
        state.routePerformance = action.payload;
      })
      .addCase(getRoutePerformanceForAirline.rejected, (state, action) => {
        console.log(
          "❌ getRoutePerformanceForAirline rejected:",
          action.payload
        );
        // ---------- GET AIRPORT PERFORMANCE FOR AIRLINE ----------
        builder
          .addCase(getAirportPerformanceForAirline.pending, (state) => {
            console.log("⏳ getAirportPerformanceForAirline pending");
            state.airportPerformanceLoading = true;
            state.error = null;
          })
          .addCase(
            getAirportPerformanceForAirline.fulfilled,
            (state, action) => {
              console.log("✅ getAirportPerformanceForAirline fulfilled");
              state.airportPerformanceLoading = false;
              state.airportPerformance = action.payload;
            }
          )
          .addCase(
            getAirportPerformanceForAirline.rejected,
            (state, action) => {
              console.log(
                "❌ getAirportPerformanceForAirline rejected:",
                action.payload
              );
              state.airportPerformanceLoading = false;
              state.error = action.payload;
            }
          );
        state.routePerformanceLoading = false;
        state.error = action.payload;
      });

    // ---------- GET AIRPORT PERFORMANCE FOR SUPER ADMIN ----------
    builder
      .addCase(getAirportPerformanceForSuperAdmin.pending, (state) => {
        console.log("⏳ getAirportPerformanceForSuperAdmin pending");
        state.superAdminAirportPerformanceLoading = true;
        state.error = null;
      })
      .addCase(
        getAirportPerformanceForSuperAdmin.fulfilled,
        (state, action) => {
          console.log("✅ getAirportPerformanceForSuperAdmin fulfilled");
          state.superAdminAirportPerformanceLoading = false;
          state.superAdminAirportPerformance = action.payload;
        }
      )
      .addCase(getAirportPerformanceForSuperAdmin.rejected, (state, action) => {
        console.log(
          "❌ getAirportPerformanceForSuperAdmin rejected:",
          action.payload
        );
        state.superAdminAirportPerformanceLoading = false;
        state.error = action.payload;
      });

    // ---------- GET ROUTE PERFORMANCE FOR SUPER ADMIN ----------
    builder
      .addCase(getRoutePerformanceForSuperAdmin.pending, (state) => {
        console.log("⏳ getRoutePerformanceForSuperAdmin pending");
        state.superAdminRoutePerformanceLoading = true;
        state.error = null;
      })
      .addCase(getRoutePerformanceForSuperAdmin.fulfilled, (state, action) => {
        console.log("✅ getRoutePerformanceForSuperAdmin fulfilled");
        state.superAdminRoutePerformanceLoading = false;
        state.superAdminRoutePerformance = action.payload;
      })
      .addCase(getRoutePerformanceForSuperAdmin.rejected, (state, action) => {
        console.log(
          "❌ getRoutePerformanceForSuperAdmin rejected:",
          action.payload
        );
        state.superAdminRoutePerformanceLoading = false;
        state.error = action.payload;
      });

    // ---------- GET BOOKING STATISTICS FOR SUPER ADMIN ----------
    builder
      .addCase(getBookingStatisticsForSuperAdmin.pending, (state) => {
        state.superAdminStatisticsLoading = true;
        state.error = null;
      })
      .addCase(getBookingStatisticsForSuperAdmin.fulfilled, (state, action) => {
        state.superAdminStatisticsLoading = false;
        state.superAdminStatistics = action.payload;
      })
      .addCase(getBookingStatisticsForSuperAdmin.rejected, (state, action) => {
        state.superAdminStatisticsLoading = false;
        state.error = action.payload;
      });

    // Airline Performance for Super Admin
    builder
      .addCase(getAirlinePerformanceForSuperAdmin.pending, (state) => {
        console.log("⏳ getAirlinePerformanceForSuperAdmin pending");
        state.superAdminAirlinePerformanceLoading = true;
        state.error = null;
      })
      .addCase(
        getAirlinePerformanceForSuperAdmin.fulfilled,
        (state, action) => {
          console.log("✅ getAirlinePerformanceForSuperAdmin fulfilled");
          state.superAdminAirlinePerformanceLoading = false;
          state.superAdminAirlinePerformance = action.payload;
        }
      )
      .addCase(getAirlinePerformanceForSuperAdmin.rejected, (state, action) => {
        console.log(
          "❌ getAirlinePerformanceForSuperAdmin rejected:",
          action.payload
        );
        state.superAdminAirlinePerformanceLoading = false;
        state.error = action.payload;
      });

    // Dashboard Stats for Super Admin
    builder
      .addCase(getSuperAdminDashboardStats.pending, (state) => {
        state.superAdminDashboardStatsLoading = true;
        state.error = null;
      })
      .addCase(getSuperAdminDashboardStats.fulfilled, (state, action) => {
        state.superAdminDashboardStatsLoading = false;
        state.superAdminDashboardStats = action.payload;
      })
      .addCase(getSuperAdminDashboardStats.rejected, (state, action) => {
        state.superAdminDashboardStatsLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBookingError } = bookingSlice.actions;
export default bookingSlice.reducer;
