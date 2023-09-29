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

// Get Total Revenue
export const fetchAllCampaignsRevenue = (state) => state.total_revenue.total_revenue;

// Get Every Campaign's Revenue 
export const fetchIndividualCampaignRevenue = (state, campaign_id) => {
    const filteredrevenue = state.total_revenue.total_revenue.filter(
        campaign_revenue => campaign_revenue.campaign_id === campaign_id
    );
    // console.log(filteredrevenue);
    if (filteredrevenue.length > 0) {
        return parseFloat(filteredrevenue[0].campaign_revenue);
    } else {
        return 0;
    }
}

// // Get Latest Four Campaigns Revenue
// export const fetchLatestFourCampaignsRevenue = (state) => {
//     const campaigns_revenue = [...state.total_revenue.total_revenue];
//     campaigns_revenue.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
//     const latestFourCampaigns = campaigns_revenue.slice(0, 4);
//     const totalFourCampaignRevenue = latestFourCampaigns.reduce((sum, campaign) => {
//         const revenue = fetchIndividualCampaignRevenue(state, campaign.campaign_id);
//         return sum + revenue;
//     }, 0);

//     return totalFourCampaignRevenue;
// };


export const { fetchTotalRevenue } = totalRevenueSlice.actions;

export default totalRevenueSlice.reducer;
