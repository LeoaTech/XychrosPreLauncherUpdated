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

export const fetchIndividualCampaignRevenue = (state, campaign_id) => {
    const filteredrevenue = state.total_revenue.total_revenue.filter(
        campaign_revenue => campaign_revenue.campaign_id === campaign_id
    );
    // console.log(filteredrevenue);
    if (filteredrevenue.length > 0) {
        return parseInt(filteredrevenue[0].campaign_revenue, 10);
    } else {
        return 0;
    }
}

export const { fetchTotalRevenue } = totalRevenueSlice.actions;

export default totalRevenueSlice.reducer;
