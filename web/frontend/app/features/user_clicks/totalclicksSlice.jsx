import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit';

const initialState = {
  total_clicks: 0,
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

export const { fetchTotalClicks } = totalClicksSlice.actions;

export default totalClicksSlice.reducer;
