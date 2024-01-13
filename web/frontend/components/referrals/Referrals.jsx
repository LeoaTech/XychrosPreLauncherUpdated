import { Marketing, Sale, subscriber, arrow } from "../../assets/index";
import React, { Suspense, lazy, useEffect, useState } from "react";
import "./referral.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllReferrals } from "../../app/features/referrals/referralSlice";
import { fetchAllCampaigns } from "../../app/features/campaigns/campaignSlice";
import { useAuthenticatedFetch } from "../../hooks";
import { fetchCampaignsDetailsList } from "../../app/features/campaign_details/campaign_details";
import { fetchAllCampaignClicks } from "../../app/features/user_clicks/totalclicksSlice";
import { fetchAllCampaignsRevenue } from "../../app/features/revenue/totalRevenueSlice";

import SkeletonSummaryCard from "../loading_skeletons/SkeletonSummaryCard";
import SkeletonLoader from "../loading_skeletons/SkeletonTable";

const ReferralsBlock = lazy(() => import("./ReferralsBlock"));
const SummaryCard = lazy(() => import("../ui/SummaryCard"));

const Referrals = () => {
  // const { getCampaigns } = props;
  const List = useSelector(fetchAllCampaigns);
  const campaignDetails = useSelector(fetchCampaignsDetailsList);
  const [getCampaigns, setCampaigns] = useState([]);

  const ReferralList = useSelector(fetchAllReferrals);
  const [getReferrals, setReferrals] = useState([...ReferralList]);

  const TotalClicksList = useSelector(fetchAllCampaignClicks);
  const [getTotalClicks, setTotalClicks] = useState([]);

  const TotalRevenueList = useSelector(fetchAllCampaignsRevenue);
  const [getTotalRevenue, setTotalRevenue] = useState([0]);

  useEffect(() => {
    if (ReferralList) {
      setReferrals(ReferralList);
    }
  }, [ReferralList]);

  useEffect(() => {
    if (campaignDetails?.length > 0) {
      setCampaigns(campaignDetails);
    }
  }, [campaignDetails]);

  // Get Total Clicks Count
  useEffect(() => {
    if (TotalClicksList.length > 0) {
      setTotalClicks(TotalClicksList);
    }
  }, [TotalClicksList]);

  // Get Total Revenue
  useEffect(() => {
    if (TotalRevenueList.length > 0) {
      setTotalRevenue(TotalRevenueList[0]?.total_revenue.toFixed(2));
    }
  }, [TotalRevenueList]);

  const fetch = useAuthenticatedFetch();

  return (
    <div className="home-container">
      <div className="summary-blocks">
        <Suspense fallback={<SkeletonSummaryCard />}>
          <SummaryCard
            value={getCampaigns?.length || 0}
            title="Campaigns"
            icon={Marketing}
            className="campaign-icon"
          />
        </Suspense>
        <Suspense fallback={<SkeletonSummaryCard />}>
          <SummaryCard
            value={getReferrals.length}
            title="Referrals"
            icon={subscriber}
            class="referral-icon"
          />
        </Suspense>
        <Suspense fallback={<SkeletonSummaryCard />}>
          <SummaryCard
            value={
              getTotalClicks.length === 0 ? 0 : getTotalClicks[0].total_clicks
            }
            title="Clicks"
            icon={arrow}
            class="clicks-icon"
          />
        </Suspense>
        <Suspense fallback={<SkeletonSummaryCard />}>
          <SummaryCard
            value={getTotalRevenue.length === 0 ? 0 : getTotalRevenue}
            title="Revenue"
            icon={Sale}
            class="revenue-icon"
            currency={TotalRevenueList[0]?.currency}
          />
        </Suspense>
      </div>

      <div className="referral_table">
        {getReferrals?.length > 0 ? (
          <Suspense fallback={<SkeletonLoader />}>
            <ReferralsBlock tableData={getReferrals} />
          </Suspense>
        ) : (
          <h2
            style={{
              color: "#fff",
              fontSize: 29,
              margin: 20,
              height: "50vh",
              display: "Flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            No Referral Data
          </h2>
        )}
      </div>
    </div>
  );
};

export default Referrals;
