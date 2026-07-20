import { createSlice } from '@reduxjs/toolkit';
import {
  getUserProfile,
 
  getAllUsers,
  getUserById,
  logout
} from './userThunks';

const initialState = {
  userProfile: null,
  users: [],
  customers: [],
  cashiers: [],
  selectedUser: null,
  usersLoading: false,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserState: (state) => {
      state.userProfile = null;
      state.selectedUser = null;
      state.users = [];
      state.customers = [];
      state.cashiers = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserProfile.pending, (state) => { state.loading = true; })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userProfile = action.payload;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      

      .addCase(getAllUsers.pending, (state) => { state.usersLoading = true; })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.users = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.usersLoading = false;
        state.error = action.payload;
      })

      .addCase(getUserById.fulfilled, (state, action) => {
        state.selectedUser = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.userProfile = null;
        state.selectedUser = null;
        state.error = null;
      })

      .addMatcher(
        (action) => action.type.startsWith('user/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.error = action.payload;
        }
      );
  },
});

export const { clearUserState } = userSlice.actions;
export default userSlice.reducer;
