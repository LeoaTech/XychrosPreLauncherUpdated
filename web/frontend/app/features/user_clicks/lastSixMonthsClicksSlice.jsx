import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit';

const initialState = {
  lastsixmonths_clicks: [],
};

export const lastSixMonthsClicksSlice = createSlice({
  name: 'lastsixmonths_clicks',
  initialState: initialState,
  reducers: {
    fetchLastSixMonthsClicks: (state, action) => {
      state.lastsixmonths_clicks = action.payload;
    },
  },
});


export const fetchAllLastSixMonthsClicks = (state) => state.lastsixmonths_clicks.lastsixmonths_clicks;

export const { fetchLastSixMonthsClicks } = lastSixMonthsClicksSlice.actions;

export default lastSixMonthsClicksSlice.reducer;
