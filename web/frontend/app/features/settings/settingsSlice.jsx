import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  settings: {},
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState: initialState,
  reducers: {
    fetchSettings: (state, action) => {
      state.settings = action.payload;
    },
  },
});

export const fetchAllSettings = (state) => state.settings.settings;

export const { fetchSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
