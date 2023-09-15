import React, { Suspense, lazy, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCampaign } from "../../app/features/campaigns/campaignSlice";
import { fetchReferrals } from "../../app/features/referrals/referralSlice";
import { SideBar, Header } from "../../components/index";
import useFetchCampaignsData from "../../constant/fetchCampaignsData";
import useFetchReferralsData from "../../constant/fetchReferralsData";
import { useStateContext } from "../../contexts/ContextProvider";
import useFetchCampaignsDetails from "../../constant/fetchCampaignDetails";
import { fetchCampaignDetails } from "../../app/features/campaign_details/campaign_details";
import { fetchCurrentTier } from "../../app/features/current_plan/current_plan";
import useFetchTotalClicks from "../../constant/fetchTotalUserClicks";
import { fetchTotalClicks } from "../../app/features/user_clicks/totalclicksSlice";
import SkeletonLoader from "../../components/loading_skeletons/SkeletonTable";

const Campaign = lazy(() => import("../../components/campaigns/Campaign"));

const Campaigns = () => {
  const { activeMenu } = useStateContext();
  const dispatch = useDispatch();
  const currentBilling = useSelector(fetchCurrentTier);
  const [currentTier, setCurrentTier] = useState("");

  //  Get Current Billing Plan
  useEffect(() => {
    if (currentBilling) {
      setCurrentTier(currentBilling);
    }
  }, [currentBilling]);

  // Get Campaign Settings List
  const campaigns = useFetchCampaignsData("/api/getcampaigns", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  // Get Campaign Details
  const campaignsDetails = useFetchCampaignsDetails("/api/campaigndetails", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const referrals = useFetchReferralsData("/api/getallreferralcount", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  // Get All Campaign Clicks
  const total_clicks = useFetchTotalClicks("/api/fetchtotalclicks", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  useEffect(() => {
    if (campaigns?.length > 0) {
      dispatch(fetchCampaign(campaigns));
    }
  }, [campaigns, dispatch]);

  // Active Campaigns Based on Subscription

  // USE CASE 1 : Current Billing Plan == "Free" Only 1 Campaign (Latest) will be Active on Free Tier (if Any campaign exists in table)

  // USE CASE 2 : Current Billing Plan == "Tier1" Only 2 Campaign (Latest) will be Active on TierI ONE (if Any campaign exists in table)

  // USE CASE 3 : Current Billing Plan > Tier I All Campaigns will be Active if NOT In Draft  (if Any campaign exists in table)

  let mostLatestCampaign, latestCampaign, sortedCampaigns, deactivatedCampaigns;

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
          new Date(camp?.end_date) > new Date() &&
          camp.is_active === true
      );

      // For Tier1 Get 2 Latest Campaigns which has ending date not expired yet
      let mostTwoLatestCampaign = mostLatestCampaign?.splice(0, 2);

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
  }, [
    campaignsDetails,
    dispatch,
    mostLatestCampaign,
    latestCampaign,
    currentTier,
  ]);

  useEffect(() => {
    if (referrals?.length > 0) {
      dispatch(fetchReferrals(referrals));
    }
  }, [referrals, dispatch]);

  useEffect(() => {
    if (total_clicks?.length > 0) {
      dispatch(fetchTotalClicks(total_clicks));
    }
  }, [total_clicks, dispatch]);

  // Page render Scroll to Top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
              <Suspense fallback={<SkeletonLoader />}>
                <Campaign />
              </Suspense>
            </div>
          </>
        ) : (
          <>
            <div className="sidebar closed">
              <SideBar />
            </div>
            <div className="main-container full">
              <Suspense fallback={<SkeletonLoader />}>
                <Campaign />
              </Suspense>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Campaigns;
