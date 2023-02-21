import { configureStore } from "@reduxjs/toolkit";
import campaignReducer from "./features/campaigns/campaignSlice";


// All Slices will be added there

export const store = configureStore({
  reducer: {
    campaign: campaignReducer,
  },
});
