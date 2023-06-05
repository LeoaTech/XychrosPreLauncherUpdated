import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const priceSlice = createSlice({
  name: "pricing",
  initialState: {
    pricing: [],
  },
  reducers: {
    fetchpricing: (state, action) => {
      state.pricing = action.payload;
    },
  },
});
export const fetchAllpricing = (state) => state.pricing.pricing;

export const { fetchpricing } = priceSlice.actions;

export default priceSlice.reducer;
