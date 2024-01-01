import { createSlice} from "@reduxjs/toolkit";

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

      // console.log(allCampaigns, action.payload);
      state.campaigns = [...allCampaigns, action.payload];
    },

    addNewCampaign: (state, action) => {
      state.campaigns.push(action.payload);
    },
  },
});

// Get All Campaigns
export const fetchAllCampaigns = (state) => state?.campaign?.campaigns?.filter((campaign) => campaign?.is_deleted === false);

// Get Last Active Campaign
export const fetchLastActiveCampaign = (state) => {
  const campaigns = state?.campaign?.campaigns;
  if (!campaigns || campaigns.length === 0) {
    return null;
  }
  const activeCampaigns = campaigns
    .filter((campaign) => !campaign.is_deleted)
    .sort((a, b) => new Date(b.start_date) - new Date(a.start_date));

  if (activeCampaigns.length === 0) {
    return null;
  }
  const currentCampaign = activeCampaigns[0];
  // console.log(currentCampaign);
  const campaignsBeforeCurrentCampaign = activeCampaigns.filter(
    (campaign) => new Date(campaign.start_date) < new Date(currentCampaign.start_date)
  );

  if (campaignsBeforeCurrentCampaign.length === 0) {
    return null;
  }
  campaignsBeforeCurrentCampaign.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
  // console.log(campaignsBeforeCurrentCampaign[0]);
  return campaignsBeforeCurrentCampaign[0];
};

// Get Campaigns of Last Six Months
export const fetchAllSixMonthsCampaigns = (state) => {
  const currentDate = new Date();
  const sixMonthsAgo = new Date(currentDate);
  sixMonthsAgo.setMonth(currentDate.getMonth() - 5); // Adjust to get 6 months including the current one

  const campaignCountsByMonth = [0, 0, 0, 0, 0, 0];

  state?.campaign?.campaigns?.forEach((campaign) => {
    if(!campaign.is_deleted) {
      const campaignStartDate = new Date(campaign.start_date.split(' ')[0]);
    
      if (campaignStartDate >= sixMonthsAgo && campaignStartDate <= currentDate) {
        const monthDiff = monthDiffBetweenDates(sixMonthsAgo, campaignStartDate);
        campaignCountsByMonth[monthDiff]++;
      }
    }
  });

  return campaignCountsByMonth;
};

function monthDiffBetweenDates(date1, date2) {
  const yearDiff = date2.getFullYear() - date1.getFullYear();
  const monthDiff = date2.getMonth() - date1.getMonth();
  return yearDiff * 12 + monthDiff;
}

//  Get Camapign By ID
export const fetchCampaignById = (state, campaignId) =>
  state?.campaign?.campaigns?.find(
    (campaign) => campaign?.campaign_id === campaignId
  );


//  Get Campaigns By Names
export const fetchCampaignByName = (state) => {
  let result = [];
  state?.campaign?.campaigns.forEach((campaign) =>
    result?.push(campaign?.name)
  );
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

  let uniqueList = discountList?.filter((code) => code !== null);

  return uniqueList;
};

export const getTotalCampaigns = (state) =>
  state?.campaign?.campaigns?.filter(
    (campaign) => campaign?.is_deleted === false
  )?.length || [];

// All Action of the campaign

export const { fetchCampaign, updateCampaign, addNewCampaign } =
  campaignSlice.actions;

export default campaignSlice.reducer;
