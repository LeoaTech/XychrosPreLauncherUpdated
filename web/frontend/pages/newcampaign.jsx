import React, { useEffect, Suspense, lazy } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../app/features/productSlice";
import { fetchSettings } from "../app/features/settings/settingsSlice";
import { SideBar, Header } from "../components/index";
import useFetchSettings from "../constant/fetchGlobalSettings";
import useFetchAllProducts from "../constant/fetchProducts";
import "../index.css";
import SkeletonLoader from "../components/loading_skeletons/SkeletonTable";
import useFetchCampaignsDetails from "../constant/fetchCampaignDetails";
import { fetchCampaignDetails } from "../app/features/campaign_details/campaign_details";
import { fetchCurrentPlan } from "../app/features/current_plan/current_plan";
import { useThemeContext } from "../contexts/ThemeContext";

const NewCampaignForm = lazy(() =>
  import("../components/newcampaign/NewCampaignForm")
);

const NewCampaign = () => {
  const { theme } = useThemeContext();
  const currentPlan = useSelector(fetchCurrentPlan);

  const abortController = new AbortController();

  const dispatch = useDispatch();
  // Page render Scroll to Top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Get Campaign details List
  const { data: campaignsDetails, error: campaignsDetailsError } =
    useFetchCampaignsDetails("/api/campaigndetails", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      signal: abortController.signal,
    });

  let { data: productsList, error: productsError } = useFetchAllProducts(
    "/api/2022-10/products.json",
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      signal: abortController.signal,
    }
  );

  const { data: settingsData, error: settingsError } = useFetchSettings(
    "/api/updatesettings",
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      signal: abortController.signal,
    }
  );

  useEffect(() => {
    if (settingsData !== undefined) {
      dispatch(fetchSettings({ ...settingsData }));
    }
    return () => {
      abortController.abort();
    };
  }, [dispatch, settingsData]);

  useEffect(() => {
    if (productsList?.length > 0) {
      dispatch(fetchProducts(productsList));
    }
    return () => {
      abortController.abort();
    };
  }, [dispatch, productsList]);

  // Active Campaigns Based on Subscription

  // USE CASE 1 : Current Billing Plan == "Free" Only 1 Campaign (Latest) will be Active on Free Tier (if Any campaign exists in table)

  // USE CASE 2 : Current Billing Plan == "Tier1" Only 2 Campaign (Latest) will be Active on TierI ONE (if Any campaign exists in table)

  // USE CASE 3 : Current Billing Plan > Tier I All Campaigns will be Active if NOT In Draft  (if Any campaign exists in table)

  let mostLatestCampaign,
    latestCampaign,
    sortedCampaigns,
    mostTwoLatestCampaign;

  useEffect(() => {
    if (campaignsDetails?.length > 0) {
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

      if (currentPlan === "Free" || currentPlan === "Free + Add-ons") {
        // Update App Component with all other campaigns remaining INACTIVE except the Latest campaign
        const updateCampaigns = sortedCampaigns?.map((camp) =>
          camp.campaign_id === latestCampaign?.campaign_id
            ? { ...camp, is_active: true }
            : { ...camp, is_active: false }
        );

        dispatch(fetchCampaignDetails(updateCampaigns));
      }
      // CASE 2   "TIER 1"

      if (currentPlan === "Tier 1" || currentPlan === "Tier 1 + Add-ons") {
        /* const updateCampaigns = sortedCampaigns?.map((camp) => {
        const isActive = mostTwoLatestCampaign?.some(
          (mc) => mc.campaign_id === camp.campaign_id
        );
        return { ...camp, is_active: isActive };
      }); */

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
        currentPlan !== "Free" &&
        currentPlan !== "Tier 1" &&
        currentPlan !== "Free + Add-ons" &&
        currentPlan !== "Tier 1 + Add-ons"
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
    currentPlan,
  ]);

  return (
    <div className={theme === "dark" ? "app" : "app-light"}>
      <input type="checkbox" name="" id="menu-toggle" />
      <div className="overlay">
        <label htmlFor="menu-toggle"> </label>
      </div>
      <div className="sidebar">
        <div className="sidebar-container">
          <SideBar />
        </div>
      </div>
      <div className="main-content">
        <Header />
        <main>
          <Suspense fallback={<SkeletonLoader />}>
            <NewCampaignForm />
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default NewCampaign;
