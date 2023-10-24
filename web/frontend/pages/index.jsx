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
import useFetchTotalRevenue from "../constant/fetchTotalRevenue";
import { fetchTotalRevenue } from "../app/features/revenue/totalRevenueSlice";
import useFetchLastSixMonthsRevenue from "../constant/fetchLastSixMonthsRevenue";
import { fetchLastSixMonthsRevenue } from "../app/features/revenue/lastSixMonthsRevenueSlice";

export default function HomePage() {
  const { activeMenu } = useStateContext();
  const { darkTheme } = useThemeContext();
  const abortController = new AbortController();

  const [currentTier, setCurrentTier] = useState("");

  const dispatch = useDispatch();
  // Page render Scroll to Top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Get All Products of App Store
  const { data: product, error: productError } = useFetchAllProducts(
    "/api/2022-10/products.json",
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      signal: abortController.signal,
    }
  );

  // Get Global Settings
  const { data: settings, error: settingsError } = useFetchSettings(
    "/api/updatesettings",
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      signal: abortController.signal,
    }
  );

  // Get Current Billing Details of App
  const { data: billing, error: billingError } = useFetchBillingModel(
    "/api/subscribe-plan",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal: abortController.signal,
    }
  );

  // Get Campaign Settings List
  const { data: campaignsDetails, error: campaignsDetailsError } =
    useFetchCampaignsDetails("/api/campaigndetails", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      signal: abortController.signal,
    });

  // Get All Referral Details

  const { data: referrals, error: referralsError } = useFetchReferralsData(
    "/api/getallreferralcount",
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      signal: abortController.signal,
    }
  );

  // Get All Campaign Clicks
  const total_clicks = useFetchTotalClicks("/api/fetchtotalclicks", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    signal: abortController.signal,
  });

  const total_revenue = useFetchTotalRevenue("/api/generate_revenue", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    signal: abortController.signal,
  });

  // Get Last Six Months Revenue
  const six_months_revenue = useFetchLastSixMonthsRevenue(
    "/api/fetch_revenue",
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      signal: abortController.signal,
    }
  );

  // Get Last Six Months Campaign Clicks Data
  const lastsixmonths_clicks = useFetchLastSixMonthsClicks(
    "/api/fetch_lastsixmonths_clicks",
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      signal: abortController.signal,
    }
  );

  // Get Last Four Campaigns Clicks
  const lastfourcampaigns_clicks = useFetchLastFourCampaignsClicks(
    "/api/fetch_lastfourcampaigns_clicks",
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      signal: abortController.signal,
    }
  );

  // Dispatch API result in Redux store to get access data in the App
  useEffect(() => {
    if (billing) {
      setCurrentTier(billing?.plan_name);
      dispatch(fetchSavePlan(billing)); //Save Current Billing Details in App Store
    }
    return () => {
      abortController.abort();
    };
  }, [dispatch, billing, currentTier]);

  // Active Campaigns Based on Subscription

  // USE CASE 1 : Current Billing Plan == "Free" Only 1 Campaign (Latest) will be Active on Free Tier (if Any campaign exists in table)

  // USE CASE 2 : Current Billing Plan == "Tier1" Only 2 Campaign (Latest) will be Active on TierI ONE (if Any campaign exists in table)

  // USE CASE 3 : Current Billing Plan > Tier I All Campaigns will be Active if NOT In Draft  (if Any campaign exists in table)

  let mostLatestCampaign,
    latestCampaign,
    sortedCampaigns,
    mostTwoLatestCampaign;

  useEffect(() => {
    if (currentTier && campaignsDetails?.length > 0) {
      // Then Sort by Date Difference
      sortedCampaigns = campaignsDetails
        ?.slice()
        .sort((a, b) => new Date(b.end_date) - new Date(a.end_date));

      // For Free Tier Get max 1 Latest Campaign which has ending date not expired yet
      latestCampaign = sortedCampaigns?.find(
        (camp) =>
          new Date(camp?.start_date) <= new Date() &&
          new Date(camp?.end_date) > new Date()
      );

      // Filtered Campaigns with are  not expired yet
      mostLatestCampaign = sortedCampaigns?.filter(
        (camp) =>
          new Date(camp?.start_date) <= new Date() &&
          new Date(camp?.end_date) > new Date()
        // && camp.is_active === true
      );

      // For Tier1 Get 2 Latest Campaigns which has ending date not expired yet
      mostTwoLatestCampaign = mostLatestCampaign?.splice(0, 2);

      // CASE 1   "Free" Active only Lates Campaign ( created or updated recently)

      if (currentTier === "Free" || currentTier === "Free + Add-ons") {
        // Update App Component with all other campaigns remaining INACTIVE except the Latest campaign
        const updateCampaigns = sortedCampaigns?.map((camp) =>
          camp.campaign_id === latestCampaign?.campaign_id
            ? { ...camp, is_active: true }
            : { ...camp, is_active: false }
        );

        dispatch(fetchCampaignDetails(updateCampaigns));
      }
      // CASE 2   "TIER 1"

      if (currentTier === "Tier 1" || currentTier === "Tier 1 + Add-ons") {
        const updateCampaigns = sortedCampaigns?.map((camp) => {
          let isActive = false;
          if (
            new Date(camp?.start_date) <= new Date() &&
            new Date(camp?.end_date) > new Date()
          ) {
            isActive = mostTwoLatestCampaign?.some(
              (mc) => mc.campaign_id === camp.campaign_id
            );
          }
          return { ...camp, is_active: isActive };
        });

        dispatch(fetchCampaignDetails(updateCampaigns));
      }
      // CASE 3  "TIER 2 to Tier 8"
      if (
        currentTier !== "Free" &&
        currentTier !== "Tier 1" &&
        currentTier !== "Free + Add-ons" &&
        currentTier !== "Tier 1 + Add-ons"
      ) {
        const updateCampaigns = campaignsDetails?.map((camp) => {
          const startDate = new Date(camp?.start_date);
          const endDate = new Date(camp?.end_date);
          const currentDate = new Date();

          if (currentDate >= startDate && currentDate <= endDate) {
            return { ...camp, is_active: true };
          } else {
            return { ...camp, is_active: false };
          }
        });

        dispatch(fetchCampaignDetails(updateCampaigns));
      }
    }
    return () => {
      abortController.abort();
    };
  }, [
    campaignsDetails,
    dispatch,
    mostLatestCampaign,
    mostTwoLatestCampaign,
    latestCampaign,
    currentTier,
  ]);
  console.log(referrals);
  useEffect(() => {
    if (referrals?.length > 0) {
      dispatch(fetchReferrals(referrals));
    }
    return () => {
      abortController.abort();
    };
  }, [referrals, dispatch]);

  useEffect(() => {
    if (settings) {
      dispatch(fetchSettings(settings[0]));
    }
    return () => {
      abortController.abort();
    };
  }, [dispatch, settings]);

  useEffect(() => {
    if (product) {
      dispatch(fetchProducts(product));
    }
    return () => {
      abortController.abort();
    };
  }, [dispatch, product]);

  useEffect(() => {
    if (total_clicks.length > 0) {
      dispatch(fetchTotalClicks(total_clicks));
    }
    return () => {
      abortController.abort();
    };
  }, [total_clicks, dispatch]);

  useEffect(() => {
    if (lastsixmonths_clicks.length > 0) {
      dispatch(fetchLastSixMonthsClicks(lastsixmonths_clicks));
    }
    return () => {
      abortController.abort();
    };
  }, [lastsixmonths_clicks, dispatch]);

  useEffect(() => {
    if (lastfourcampaigns_clicks.length > 0) {
      dispatch(fetchLastFourCampaignsClicks(lastfourcampaigns_clicks));
    }
    return () => {
      abortController.abort();
    };
  }, [lastfourcampaigns_clicks, dispatch]);

  useEffect(() => {
    if (total_revenue.length > 0) {
      dispatch(fetchTotalRevenue(total_revenue));
    }
    return () => {
      abortController.abort();
    };
  }, [total_revenue, dispatch]);

  useEffect(() => {
    if (six_months_revenue.length > 0) {
      dispatch(fetchLastSixMonthsRevenue(six_months_revenue));
    }
    return () => {
      abortController.abort();
    };
  }, [six_months_revenue, dispatch]);

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
