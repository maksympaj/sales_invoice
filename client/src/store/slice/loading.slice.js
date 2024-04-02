import { createSlice } from '@reduxjs/toolkit';

export const counter = createSlice({
  name: 'loading',
  initialState: {
    value: false,
  },
  reducers: {
    beginLoading: (state) => {
      state.value = true;
    },
    endLoading: (state) => {
      state.value = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount } = counter.actions;

export default counter.reducer;
