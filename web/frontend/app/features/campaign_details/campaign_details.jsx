import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
    campaigns_details: [],
};

export const campaignDetailsSlice = createSlice({
    name: "campaign_details",
    initialState: initialState,
    reducers: {
        fetchCampaignDetails: (state, action) => {
            state.campaigns_details = action.payload;
        }

    },
});

// Get All Campaigns

export const fetchCampaignsDetailsList = (state) => state?.campaign_details?.campaigns_details?.filter((camp) => camp?.is_deleted === false);

// All Action of the campaign

export const {fetchCampaignDetails } = campaignDetailsSlice.actions;

export default campaignDetailsSlice.reducer;
