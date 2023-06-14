import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";

const initialState = {
  campaigns: [],
};

export const campaignSlice = createSlice({
  name: "campaign",
  initialState: initialState,
  reducers: {

    fetchCampaign: (state, action) => {
      state.campaigns = action.payload;
    },
    updateCampaign: (state, action) => {
      const { campaign_id } = action.payload;
      const allCampaigns = state.campaigns.filter(
        (campaign) => campaign?.campaign_id === action.payload.campaign_id
      );
      state.campaigns = [...allCampaigns, action.payload];
    },

    addNewCampaign: (state, action) => {
      state.campaigns.push(action.payload);
    },

  },
});

// Get All Campaigns

export const fetchAllCampaigns = (state) => state?.campaign?.campaigns?.filter((campaign) => campaign?.is_deleted === false);
//  Get Camapign By ID
export const fetchCampaignById = (state, campaignId) =>
  state?.campaign?.campaigns?.find(
    (campaign) => campaign?.campaign_id === campaignId
  );
//  Get Campaigns By Names
export const fetchCampaignByName = (state) => {
  let result = [];
  state?.campaign?.campaigns.forEach((campaign) => result?.push(campaign?.name));
  return result;
};

// Get Campaigns Discount Codes List
export const fetchCampaignsDiscount = (state) => {
  let discountList = [];

  state.campaign.campaigns.forEach((campaign) => {
    discountList.push(campaign?.reward_1_code);
    discountList.push(campaign?.reward_2_code);
    discountList.push(campaign?.reward_3_code);
    discountList.push(campaign?.reward_4_code);
  });

  let uniqueList = discountList?.filter((code) => code!== null)

  return uniqueList;
}


export const getTotalCampaigns = (state) => state?.campaign?.campaigns?.filter((campaign) => campaign?.is_deleted === false)?.length || [];

// All Action of the campaign

export const {
  fetchCampaign,
  updateCampaign,
  addNewCampaign
} = campaignSlice.actions;

export default campaignSlice.reducer;
