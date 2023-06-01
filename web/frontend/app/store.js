import { configureStore } from '@reduxjs/toolkit';
import campaignReducer from './features/campaigns/campaignSlice';
import referralReducer from './features/referrals/referralSlice';
import settingsReducer from './features/settings/settingsSlice';
import productReducer from './features/productSlice';
import userReducer from './features/users/userSlice';
// All Slices will be added there

export const store = configureStore({
  reducer: {
    campaign: campaignReducer,
    settings: settingsReducer,
    products: productReducer,
    users: userReducer,
    referrals: referralReducer,
  },
});
