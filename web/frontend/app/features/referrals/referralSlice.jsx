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

// Get Last Four Campaigns' Referrals
export const fetchLastFourCampaignsReferrals = (state) => {
  const currentDate = new Date();
  const four_latest_campaigns = [...state.campaign.campaigns]
    .filter((campaign) => !campaign.is_deleted && new Date(campaign.start_date.split(' ')[0]) <= currentDate)
    .sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
  const latestFourCampaigns = four_latest_campaigns.slice(0, 4);
  const totalReferralsByCampaign = latestFourCampaigns.map((campaign) => {
    const referral = state.referrals.referrals.find((referral) => referral.campaign_id === campaign.campaign_id);
    const campaignName = campaign.name;
    const totalReferrals = referral ? fetchReferralById(state, referral.campaign_id) : 0;
    return {
      campaignName,
      totalReferrals,
    };
  });
  return totalReferralsByCampaign;
}

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
