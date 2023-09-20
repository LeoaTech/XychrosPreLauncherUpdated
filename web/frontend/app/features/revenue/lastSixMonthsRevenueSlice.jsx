import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit';

const initialState = {
    six_months_revenue: [],
};

export const lastSixMonthsRevenueSlice = createSlice({
    name: 'six_months_revenue',
    initialState: initialState,
    reducers: {
        fetchLastSixMonthsRevenue: (state, action) => {
            state.six_months_revenue = action.payload;
        },
    },
});


export const fetchAllLastSixMonthsRevenue = (state) => state.six_months_revenue.six_months_revenue;

export const { fetchLastSixMonthsRevenue } = lastSixMonthsRevenueSlice.actions;

export default lastSixMonthsRevenueSlice.reducer;
