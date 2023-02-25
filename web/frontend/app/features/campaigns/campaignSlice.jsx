import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  campaigns: [],
  status: "idle",
  isError: "",
};

export const campaignSlice = createSlice({
  name: "campaign",
  initialState: initialState,
  reducers: {
    fetchCampaign: (state, action) => {
      state.campaigns = action.payload;
    },
  },
  extraReducers(builder) {
    // builder
    //   .addCase(fetchCampaign.pending, (state, action) => {
    //     state.status = "loading";
    //   })
    //   .addCase(fetchCampaign.fulfilled, (state, action) => {
    //     state.status = "succeeded";
    //     state.campaigns = action.payload;
    //   })
    //   .addCase(fetchCampaign.rejected, (state, action) => {
    //     state.status = "rejected";
    //     state.isError = action.error.message;
    //   });
  },
});

export const fetchAllCampaigns = (state) => state.campaign.campaigns;
export const fetchCampaignById = (state, campaignId) =>
  state.campaign.campaigns.find(
    (campaign) => campaign.campaign_id === campaignId
  );
export const getCampaignsStatus = (state) => state.campaign.status;
export const getCampaignsError = (state) => state.campaign.isError;

export const { fetchCampaign } = campaignSlice.actions;
export default campaignSlice.reducer;
