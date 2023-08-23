import { configureStore } from '@reduxjs/toolkit';
import campaignReducer from './features/campaigns/campaignSlice';
import settingsReducer from './features/settings/settingsSlice';
import productReducer from './features/productSlice';
import userReducer from './features/users/userSlice';
import priceReducer from './features/pricing/pricing';
import currentPlanReducer from './features/current_plan/current_plan';
import referralReducer from './features/referrals/referralSlice';
import campaignDetailsReducer from "./features/campaign_details/campaign_details";
import totalClicksReducer from './features/user_clicks/totalclicksSlice';
import lastSixMonthsClicksReducer from './features/user_clicks/lastSixMonthsClicksSlice';
import lastFourCampaignsClicksReducer from './features/user_clicks/lastFourCampaignsClicksSlice';

// All Slices will be added there

export const store = configureStore({
  reducer: {
    campaign: campaignReducer,
    campaign_details: campaignDetailsReducer,
    settings: settingsReducer,
    products: productReducer,
    users: userReducer,
    pricing: priceReducer,
    current_plan: currentPlanReducer,
    referrals: referralReducer,
    total_clicks: totalClicksReducer,
    lastsixmonths_clicks: lastSixMonthsClicksReducer,
    lastfourcampaigns_clicks: lastFourCampaignsClicksReducer,
  },
});
