import { createSlice } from "@reduxjs/toolkit";
import {
  createCoupon,
  getCouponById,
  getAllCoupons,
  getActiveCoupons,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
  checkCouponCode
} from "./couponThunk.js";

const initialState = {
  // Data
  coupons: [],
  coupon: null,
  paginatedCoupons: {
    content: [],
    totalElements: 0,
    totalPages: 0,
    size: 10,
    number: 0,
    first: true,
    last: false,
    numberOfElements: 0
  },
  activeCoupons: [],

  // Validation
  validationResult: null,

  // UI State
  loading: false,
  error: null,

  // Specific loading states
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  validateLoading: false,
};

const couponSlice = createSlice({
  name: "coupon",
  initialState,
  reducers: {
    clearCouponState: (state) => {
      state.coupons = [];
      state.coupon = null;
      state.paginatedCoupons = initialState.paginatedCoupons;
      state.activeCoupons = [];
      state.validationResult = null;
      state.error = null;
    },
    clearCoupon: (state) => {
      state.coupon = null;
    },
    clearValidationResult: (state) => {
      state.validationResult = null;
    },
  },
  extraReducers: (builder) => {
    // ---------- CREATE ----------
    builder
      .addCase(createCoupon.pending, (state) => {
        state.loading = true;
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.createLoading = false;
        state.coupon = action.payload;
        state.coupons.unshift(action.payload);
        if (state.paginatedCoupons.content) {
          state.paginatedCoupons.content.unshift(action.payload);
          state.paginatedCoupons.totalElements += 1;
        }
      })
      .addCase(createCoupon.rejected, (state, action) => {
        state.loading = false;
        state.createLoading = false;
        state.error = action.payload;
      });

    // ---------- GET BY ID ----------
    builder
      .addCase(getCouponById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCouponById.fulfilled, (state, action) => {
        state.loading = false;
        state.coupon = action.payload;
      })
      .addCase(getCouponById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ---------- GET ALL ----------
    builder
      .addCase(getAllCoupons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = action.payload.content || action.payload;
        state.paginatedCoupons = action.payload;
      })
      .addCase(getAllCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ---------- GET ACTIVE ----------
    builder
      .addCase(getActiveCoupons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getActiveCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.activeCoupons = action.payload;
      })
      .addCase(getActiveCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ---------- UPDATE ----------
    builder
      .addCase(updateCoupon.pending, (state) => {
        state.loading = true;
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.updateLoading = false;
        state.coupon = action.payload;
        const index = state.coupons.findIndex(c => c.id === action.payload.id);
        if (index !== -1) state.coupons[index] = action.payload;
        const paginatedIndex = state.paginatedCoupons.content.findIndex(c => c.id === action.payload.id);
        if (paginatedIndex !== -1) state.paginatedCoupons.content[paginatedIndex] = action.payload;
      })
      .addCase(updateCoupon.rejected, (state, action) => {
        state.loading = false;
        state.updateLoading = false;
        state.error = action.payload;
      });

    // ---------- DELETE ----------
    builder
      .addCase(deleteCoupon.pending, (state) => {
        state.loading = true;
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.deleteLoading = false;
        state.coupons = state.coupons.filter(c => c.id !== action.payload);
        state.paginatedCoupons.content = state.paginatedCoupons.content.filter(c => c.id !== action.payload);
        if (state.paginatedCoupons.totalElements > 0) {
          state.paginatedCoupons.totalElements -= 1;
        }
      })
      .addCase(deleteCoupon.rejected, (state, action) => {
        state.loading = false;
        state.deleteLoading = false;
        state.error = action.payload;
      });

    // ---------- VALIDATE ----------
    builder
      .addCase(validateCoupon.pending, (state) => {
        state.validateLoading = true;
        state.validationResult = null;
        state.error = null;
      })
      .addCase(validateCoupon.fulfilled, (state, action) => {
        state.validateLoading = false;
        state.validationResult = action.payload;
      })
      .addCase(validateCoupon.rejected, (state, action) => {
        state.validateLoading = false;
        state.error = action.payload;
      });

    // ---------- CHECK CODE ----------
    builder
      .addCase(checkCouponCode.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkCouponCode.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(checkCouponCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Global error matcher
    builder.addMatcher(
      (action) => action.type.startsWith("coupon/") && action.type.endsWith("/rejected"),
      (state, action) => {
        state.error = action.payload;
      }
    );
  }
});

export const {
  clearCouponState,
  clearCoupon,
  clearValidationResult
} = couponSlice.actions;

export default couponSlice.reducer;
