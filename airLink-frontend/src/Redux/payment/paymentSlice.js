import { createSlice } from "@reduxjs/toolkit";
import {
  
  verifyPayment,
 
  
  getAllPayments,
  
 


} from "./paymentThunk";

const initialState = {
  payment: null,                    // Current payment object
  payments: [],                     // List of payments (for admin)
  paymentsByBooking: {},           // Map of booking ID to payment
  paymentsByTransaction: {},       // Map of transaction ID to payment
  initiateResponse: null,          // Payment initiation response
  verifyResponse: null,            // Payment verification response
  retryResponse: null,             // Payment retry response
  paymentLink: null,               // Legacy: payment link
  callbackResponse: null,          // Legacy: callback response
  loading: false,
  error: null,
  totalPages: 0,
  totalElements: 0,
  currentPage: 0
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    clearPaymentError: (state) => {
      state.error = null;
    },
    clearPaymentData: (state) => {
      state.payment = null;
      state.initiateResponse = null;
      state.verifyResponse = null;
      state.retryResponse = null;
      state.paymentLink = null;
      state.callbackResponse = null;
      state.error = null;
    },
    clearAllPayments: (state) => {
      state.payments = [];
      state.totalPages = 0;
      state.totalElements = 0;
      state.currentPage = 0;
    }
  },
  extraReducers: (builder) => {

 

    // ---------- VERIFY PAYMENT ----------
    builder.addCase(verifyPayment.pending, (state) => {
      console.log("⏳ verifyPayment pending");
      state.loading = true;
      state.error = null;
      state.verifyResponse = null;
    });
    builder.addCase(verifyPayment.fulfilled, (state, action) => {
      console.log("✅ verifyPayment fulfilled");
      state.loading = false;
      state.verifyResponse = action.payload;
      state.payment = action.payload;
    });
    builder.addCase(verifyPayment.rejected, (state, action) => {
      console.log("❌ verifyPayment rejected:", action.payload);
      state.loading = false;
      state.error = action.payload;
    });

  



    // ---------- GET ALL PAYMENTS ----------
    builder.addCase(getAllPayments.pending, (state) => {
      console.log("⏳ getAllPayments pending");
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getAllPayments.fulfilled, (state, action) => {
      console.log("✅ getAllPayments fulfilled");
      state.loading = false;
      // Handle paginated response
      if (action.payload.content) {
        state.payments = action.payload.content;
        state.totalPages = action.payload.totalPages || 0;
        state.totalElements = action.payload.totalElements || 0;
        state.currentPage = action.payload.number || 0;
      } else {
        state.payments = action.payload;
      }
    });
    builder.addCase(getAllPayments.rejected, (state, action) => {
      console.log("❌ getAllPayments rejected:", action.payload);
      state.loading = false;
      state.error = action.payload;
    });

 
 



    
  }
});

export const { clearPaymentError, clearPaymentData, clearAllPayments } = paymentSlice.actions;
export default paymentSlice.reducer;
