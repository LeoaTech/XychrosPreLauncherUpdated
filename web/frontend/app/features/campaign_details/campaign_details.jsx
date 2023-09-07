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
    },

    updateCampaignDetails: (state, action) => {
      const { campaign_id } = action.payload;
      const allCampaigns = state.campaigns_details?.filter(
        (campaign) => campaign?.campaign_id === action.payload.campaign_id
      );
      state.campaigns_details = [...allCampaigns, action.payload];
    },
  },
});

// Get All Campaigns

export const fetchCampaignsDetailsList = (state) =>
  state?.campaign_details?.campaigns_details?.filter(
    (camp) => camp?.is_deleted === false
  );

// All Action of the campaign

export const { fetchCampaignDetails, updateCampaignDetails } =
  campaignDetailsSlice.actions;

export default campaignDetailsSlice.reducer;
