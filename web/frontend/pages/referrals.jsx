import React, { Suspense, lazy, useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchCampaign } from "../app/features/campaigns/campaignSlice";
import { fetchReferrals } from "../app/features/referrals/referralSlice";
import { SideBar, Header } from "../components/index";
import { useStateContext } from "../contexts/ContextProvider";
import useFetchCampaignsData from "../constant/fetchCampaignsData";
import useFetchReferralsData from "../constant/fetchReferralsData";
import { useThemeContext } from "../contexts/ThemeContext";
import "../index.css";
import { fetchCampaignDetails } from "../app/features/campaign_details/campaign_details";
import useFetchCampaignsDetails from "../constant/fetchCampaignDetails";
import useFetchTotalClicks from "../constant/fetchTotalUserClicks";
import { fetchTotalClicks } from "../app/features/user_clicks/totalclicksSlice"; 
import SkeletonLoader from "../components/loading_skeletons/SkeletonTable";

const Referral = lazy(() => import("../components/referrals/Referrals"));

const Referrals = () => {
  const { activeMenu } = useStateContext();

  const dispatch = useDispatch();
  const { darkTheme, lightTheme } = useThemeContext();

  const campaigns = useFetchCampaignsData("/api/getcampaigns", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const campaignsDetails = useFetchCampaignsDetails("/api/campaigndetails", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const referrals = useFetchReferralsData("/api/getallreferralcount", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const total_clicks = useFetchTotalClicks("/api/fetchtotalclicks", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  useEffect(() => {
    if (campaigns?.length > 0) {
      dispatch(fetchCampaign(campaigns));
    }
  }, [campaigns, dispatch]);

  useEffect(() => {
    if (campaignsDetails?.length > 0) {
      dispatch(fetchCampaignDetails(campaignsDetails));
    }
  }, [campaignsDetails, dispatch]);

  useEffect(() => {
    if (referrals?.length > 0) {
      dispatch(fetchReferrals(referrals));
    }
  }, [referrals, dispatch]);

  useEffect(() => {
    if (total_clicks > 0) {
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
                <Referral />
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
                <Referral />
              </Suspense>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Referrals;
