import { createSlice } from '@reduxjs/toolkit';

export const auth = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
    isAdmin: false,
    token: null,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.isLoggedIn = true;
      state.token = action.payload.token;
      state.isAdmin = action.payload.isAdmin;
    },
    loginFail: (state) => {
      state.isLoggedIn = false;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.isAdmin = false;
      state.token = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const { loginSuccess, loginFail, logout } = auth.actions;

export default auth.reducer;
