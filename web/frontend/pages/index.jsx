import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchCampaign } from "../app/features/campaigns/campaignSlice";
import useFetchCampaignsData from "../constant/fetchCampaignsData";
import { SideBar, Header, HomeComponent, MainPage } from "../components/index";
import { useStateContext } from "../contexts/ContextProvider";
import { useThemeContext } from "../contexts/ThemeContext";
import "../index.css";
import { fetchProducts } from "../app/features/productSlice";
import useFetchAllProducts from "../constant/fetchProducts";
import useFetchSettings from "../constant/fetchGlobalSettings";
import { fetchSettings } from "../app/features/settings/settingsSlice";
import { fetchSavePlan } from "../app/features/current_plan/current_plan";
import useFetchBillingModel from "../constant/fetchBillingModel";
import useFetchReferralsData from "../constant/fetchReferralsData";
import { fetchReferrals } from "../app/features/referrals/referralSlice";
import useFetchCampaignsDetails from "../constant/fetchCampaignDetails";
import { fetchCampaignDetails } from "../app/features/campaign_details/campaign_details";
import useFetchTotalClicks from "../constant/fetchTotalUserClicks";
import { fetchTotalClicks } from "../app/features/user_clicks/totalclicksSlice";
import useFetchLastSixMonthsClicks from "../constant/fetchLastSixMonthsClicks";
import { fetchLastSixMonthsClicks } from "../app/features/user_clicks/lastSixMonthsClicksSlice";
import useFetchLastFourCampaignsClicks from "../constant/fetcLastFourCampaignsClicks";
import { fetchLastFourCampaignsClicks } from "../app/features/user_clicks/lastFourCampaignsClicksSlice"; 

export default function HomePage() {
  const { activeMenu } = useStateContext();
  const { darkTheme } = useThemeContext();
  const dispatch = useDispatch();
  // Page render Scroll to Top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Get All Products of App Store
  const product = useFetchAllProducts("/api/2022-10/products.json", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  // Get Global Settings
  const settings = useFetchSettings("/api/updatesettings", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  // Get Current Billing Details of App
  const billing = useFetchBillingModel("/api/subscribe-plan", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Get All Campaign Clicks 
  const total_clicks = useFetchTotalClicks("/api/fetchtotalclicks", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  // Get Last Six Months Campaign Clicks Data
  const lastsixmonths_clicks = useFetchLastSixMonthsClicks("/api/fetch_lastsixmonths_clicks", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  // Get Last Four Campaigns Clicks
  const lastfourcampaigns_clicks = useFetchLastFourCampaignsClicks("/api/fetch_lastfourcampaigns_clicks", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  // Dispatch API result in Redux store to get access data in the App
  useEffect(() => {
    if (billing) {
      dispatch(fetchSavePlan(billing)); //Save Current Billing Details in App Store
    }
  }, [dispatch, billing]);

  useEffect(() => {
    if (settings) {
      dispatch(fetchSettings(settings[0]));
    }
  }, [dispatch, settings]);

  useEffect(() => {
    if (product) {
      dispatch(fetchProducts(product));
    }
  }, [dispatch, product]);

  useEffect(() => {
    if (total_clicks > 0) {
      dispatch(fetchTotalClicks(total_clicks));
    }
  }, [total_clicks, dispatch]);

  useEffect(() => {
    if (lastsixmonths_clicks.length > 0) {
      dispatch(fetchLastSixMonthsClicks(lastsixmonths_clicks));
    }
  }, [lastsixmonths_clicks, dispatch]);

  useEffect(() => {
    if (lastfourcampaigns_clicks.length > 0) {
      dispatch(fetchLastFourCampaignsClicks(lastfourcampaigns_clicks));
    }
  }, [lastfourcampaigns_clicks, dispatch]);

  return (
    <div className="app">
      {activeMenu ? (
        <div className="header">
          <Header />
        </div>
      ) : (
        <div className="header">
          <Header />
        </div>
      )}
      <div className="main-app">
        {activeMenu ? (
          <>
            <div className="sidebar">
              <SideBar />
            </div>
            <div className="main-container">
              <HomeComponent />
            </div>
          </>
        ) : (
          <>
            <div className="sidebar closed">
              <SideBar />
            </div>
            <div className="main-container full">
              <HomeComponent />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
