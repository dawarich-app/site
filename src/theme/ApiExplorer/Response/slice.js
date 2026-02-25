import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

export const slice = createSlice({
  name: "response",
  initialState,
  reducers: {
    setResponse: (state, action) => {
      state.value = action.payload;
    },
    setCode: (state, action) => {
      state.code = action.payload;
    },
    setHeaders: (state, action) => {
      state.headers = action.payload;
    },
    clearResponse: (state) => {
      state.value = undefined;
    },
    clearCode: (state) => {
      state.code = undefined;
    },
    clearHeaders: (state) => {
      state.headers = undefined;
    },
  },
});

export const {
  setResponse,
  clearResponse,
  setCode,
  clearCode,
  setHeaders,
  clearHeaders,
} = slice.actions;

export default slice.reducer;
