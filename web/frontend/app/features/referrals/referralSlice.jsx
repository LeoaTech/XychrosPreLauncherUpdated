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
export const fetchReferralById = (state, campaign_id) =>
  state?.referrals?.referrals?.filter(
    (referrals) => referrals?.campaign_id === campaign_id
  )?.length || 0;

// All Action of the referrals

export const { fetchReferrals } = referralSlice.actions;

export default referralSlice.reducer;
