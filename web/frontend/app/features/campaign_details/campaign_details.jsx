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
    (camp) => camp?.is_draft === false
  );

export const fetchCampaignsProuctsList = (state) => {
  let products = [];
  state?.campaign_details?.campaigns_details?.filter(
    (camp) => {camp?.product != "" && products?.push(camp?.product)}
  );
  return products;
};

export const fetchCampaignsDiscountCodes = (state) => {
  let discountList = [];

  state?.campaign_details?.campaigns_details?.forEach((campaign) => {
    discountList.push(campaign?.reward_1_code);
    discountList.push(campaign?.reward_2_code);
    discountList.push(campaign?.reward_3_code);
    discountList.push(campaign?.reward_4_code);
  });

  let uniqueList = discountList?.filter((code) => code !== null);

  return uniqueList;
};
//Get Camapign which has expired and are deactivated
export const fetchDeactivatedCampaignsByName = (state) => {
  let result = [];

  state?.campaign_details?.campaigns_details?.filter((camp) => {
    if (
      new Date(camp?.end_date) < new Date() &&
      new Date(camp?.start_date) < new Date()
    ) {
      result.push(camp?.name);
    }
  });
  return result;
};

export const getActiveCampaigns = (state) =>
  state?.campaign_details?.campaigns_details?.filter(
    (campaign) => campaign?.is_active == true
  ) || [];

// All Action of the campaign

export const { fetchCampaignDetails, updateCampaignDetails } =
  campaignDetailsSlice.actions;

export default campaignDetailsSlice.reducer;
