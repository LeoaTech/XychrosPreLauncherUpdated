import { configureStore } from "@reduxjs/toolkit";
import campaignReducer from "./features/campaigns/campaignSlice";
import settingsReducer from "./features/settings/settingsSlice";
import productReducer from "./features/productSlice";
// All Slices will be added there

export const store = configureStore({
  reducer: {
    campaign: campaignReducer,
    settings: settingsReducer,
    products: productReducer,
  },
});
