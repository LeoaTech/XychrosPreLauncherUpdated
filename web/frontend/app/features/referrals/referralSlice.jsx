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
export const fetchAllReferrals = (state) => state.referrals.referrals;

//  Get Referrals By Code
export const fetchReferralById = (state, campaign_id) =>
  state?.referrals?.referrals?.filter(
    (referrals) => referrals?.campaign_id === campaign_id
  )?.length || 0;

// Get Last Six Months Referrals
export const fetchAllSixMonthsReferrals = (state) => {
  const currentDate = new Date();
  const sixMonthsAgo = new Date(currentDate);
  sixMonthsAgo.setMonth(currentDate.getMonth() - 5); // Adjust to get 6 months including the current one

  const referralCountsByMonth = [0, 0, 0, 0, 0, 0];

  state?.referrals?.referrals?.forEach((referral) => {
      const referralCreatedDate = new Date(referral.created_at.split(' ')[0]);
      if (referralCreatedDate >= sixMonthsAgo && referralCreatedDate <= currentDate) {
        const monthDiff = referralMonthDiffBetweenDates(sixMonthsAgo, referralCreatedDate);
        referralCountsByMonth[monthDiff]++;
      }
  });

  return referralCountsByMonth;
};

function referralMonthDiffBetweenDates(date1, date2) {
  const yearDiff = date2.getFullYear() - date1.getFullYear();
  const monthDiff = date2.getMonth() - date1.getMonth();
  return yearDiff * 12 + monthDiff;
}

// All Action of the referrals

export const { fetchReferrals } = referralSlice.actions;

export default referralSlice.reducer;
