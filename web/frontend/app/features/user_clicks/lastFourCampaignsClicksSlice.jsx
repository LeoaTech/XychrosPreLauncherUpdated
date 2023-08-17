import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit';

const initialState = {
    lastfourcampaigns_clicks: [],
};

export const lastFourCampaignsClicksSlice = createSlice({
  name: 'lastfourcampaigns_clicks',
  initialState: initialState,
  reducers: {
    fetchLastFourCampaignsClicks: (state, action) => {
      state.lastfourcampaigns_clicks = action.payload;
    },
  },
});


export const fetchAllLastFourCampaignsClicks = (state) => state.lastfourcampaigns_clicks.lastfourcampaigns_clicks;

export const { fetchLastFourCampaignsClicks } = lastFourCampaignsClicksSlice.actions;

export default lastFourCampaignsClicksSlice.reducer;
