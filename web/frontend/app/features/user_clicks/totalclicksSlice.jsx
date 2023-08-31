import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit';

const initialState = {
  total_clicks: [],
};

export const totalClicksSlice = createSlice({
  name: 'total_clicks',
  initialState: initialState,
  reducers: {
    fetchTotalClicks: (state, action) => {
      state.total_clicks = action.payload;
    },
  },
});


export const fetchAllCampaignClicks = (state) => state.total_clicks.total_clicks;

export const fetchIndividualCampaignClicks = (state, campaign_id) => {
  const filteredClicks = state.total_clicks.total_clicks.filter(
    campaign_clicks => campaign_clicks.campaign_id === campaign_id
  );
  if (filteredClicks.length > 0) {
    return parseInt(filteredClicks[0].campaign_clicks, 10);
  } else {
    return 0;
  }
}

export const { fetchTotalClicks } = totalClicksSlice.actions;

export default totalClicksSlice.reducer;
