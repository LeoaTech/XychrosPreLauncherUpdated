import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit';

const initialState = {
  referrals: [],
};

export const referralSlice = createSlice({
  name: 'referral',
  initialState: initialState,
  reducers: {
    fetchReferrals: (state, action) => {
      state.referrals = action.payload;
    },
  },
});

// Get All Referrals

//export const fetchAllReferrals = (state) => state.referral.referrals;
export const fetchAllReferrals = (state) => state.referrals.referrals;
//  Get Referrals By Code
export const fetchReferralById = (state, campaignId, referralCode) =>
  state.referral.referrals.find(
    (campaign) => campaign.campaign_id === campaignId
  );

// All Action of the campaign

export const {
  fetchReferrals,
  // updateCampaign,
  // deleteCampaign,
  // addNewCampaign,
  // removeCampaign,
} = referralSlice.actions;

export default referralSlice.reducer;
