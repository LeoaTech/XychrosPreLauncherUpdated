import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    total_revenue: [],
};

export const totalRevenueSlice = createSlice({
    name: 'total_revenue',
    initialState: initialState,
    reducers: {
        fetchTotalRevenue: (state, action) => {
            state.total_revenue = action.payload;
        },
    },
});


export const fetchAllCampaignsRevenue = (state) => state.total_revenue.total_revenue;

export const { fetchTotalRevenue } = totalRevenueSlice.actions;

export default totalRevenueSlice.reducer;
