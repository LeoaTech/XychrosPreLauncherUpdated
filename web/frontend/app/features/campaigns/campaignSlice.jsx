import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";

const initialState = {
  campaigns: [],
};

export const campaignSlice = createSlice({
  name: "campaign",
  initialState: initialState,
  reducers: {
    removeCampaign: (state, action) => {
      let deleteItem = state.campaigns.find(
        (campaign) => campaign.id === action.payload.campaign_id
      );
      let getIndex = state.campaigns.indexOf(deleteItem);
      state.campaigns.splice(getIndex, 1);
    },
    fetchCampaign: (state, action) => {
      state.campaigns = action.payload;
    },
    updateCampaign: (state, action) => {
      const { campaign_id } = action.payload;
      const allCampaigns = state.campaigns.filter(
        (campaign) => campaign.id !== campaign_id
      );
      state.campaigns = [...allCampaigns, action.payload];
    },
    addNewCampaign: (state, action) => {
      state.campaigns.push(action.payload);
    },
    deleteCampaign: (state, action) => {
      console.log("action payload", action.payload)
      const { campaign_id } = action.payload;
      const updatedData = state.campaigns.filter(
        (campaign) => campaign.id !== campaign_id
      );
      state.campaigns = [...updatedData,action.payload];
    },
  },
});

// Get All Campaigns

export const fetchAllCampaigns = (state) => state.campaign.campaigns.filter((campaign) => campaign?.is_deleted === false);
//  Get Camapign By ID
export const fetchCampaignById = (state, campaignId) =>
  state.campaign.campaigns.find(
    (campaign) => campaign.campaign_id === campaignId
  );
//  Get Campaigns By Names
export const fetchCampaignByName = (state) => {
  let result = [];
  state.campaign.campaigns.forEach((campaign) => result.push(campaign.name));
  return result;
};


export const getTotalCampaigns = (state) => state.campaign.campaigns?.length || [];

// All Action of the campaign

export const {
  fetchCampaign,
  updateCampaign,
  deleteCampaign,
  addNewCampaign,
  removeCampaign,
} = campaignSlice.actions;

export default campaignSlice.reducer;
