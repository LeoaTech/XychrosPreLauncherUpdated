import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";

const initialState = {
  campaigns: [],

  status: false,
  isError: null,
};

export const campaignSlice = createSlice({
  name: "campaign",
  initialState: initialState,
  reducers: {
    removeCampaign: (state, action) => {
      console.log(action.payload);
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
      console.log(action.payload);

      const updatedData = campaignsProxy.filter(
        (campaign) => campaign.id !== action.payload
      );
      state.campaigns = updatedData;
    },
  },
  // extraReducers(builder) {
  //   builder
  //     .addCase(fetchCampaignsData.pending, (state, action) => {
  //       state.status = true;
  //     })
  //     .addCase(fetchCampaignsData.fulfilled, (state, action) => {
  //       state.status = false;
  //       state.campaigns = action.payload;
  //     })
  //     .addCase(fetchCampaignsData.rejected, (state, action) => {
  //       state.status = false;
  //       state.isError = action.payload;
  //     });
  // },
});

// Get All Campaigns

export const fetchAllCampaigns = (state) => state.campaign.campaigns;
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

export const getCampaignsStatus = (state) => state.campaign.status;
export const getCampaignsError = (state) => state.campaign.isError;

// All Action of the campaign

export const {
  fetchCampaign,
  updateCampaign,
  deleteCampaign,
  addNewCampaign,
  removeCampaign,
} = campaignSlice.actions;

export default campaignSlice.reducer;
