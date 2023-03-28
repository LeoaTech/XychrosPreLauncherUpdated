import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
  },
  reducers: {
    fetchProducts: (state, action) => {
      state.products = action.payload;
    },
  },
});
export const fetchAllProducts = (state) => state.products.products;

export const { fetchProducts } = productSlice.actions;

export default productSlice.reducer;
