import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  products: [],
};

export const productSlice = createSlice({
  name: "products",
  initialState: initialState,
  reducers: {
    fetchProducts: (state, action) => {
      state.products = action.payload;
    },
  },
});

export const fetchAllProducts = (state) => state.products.products;

export const { fetchProducts } = productSlice.actions;
export default productSlice.reducer;
