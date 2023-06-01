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
export const fetchReferralById = (state, referralCode) =>
  state.referrals.referrals.find(
    (referrals) => referrals.referrer_id === referralCode
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
