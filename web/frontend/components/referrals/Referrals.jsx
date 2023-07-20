import { Marketing, Sale, subscriber, arrow } from "../../assets/index";
import React, { Suspense, lazy, useEffect, useState } from "react";
import "./referral.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllReferrals } from "../../app/features/referrals/referralSlice";
import { fetchAllCampaigns } from "../../app/features/campaigns/campaignSlice";
import { useAuthenticatedFetch } from "../../hooks";
import { fetchCampaignsDetailsList } from "../../app/features/campaign_details/campaign_details";
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
        {/* <SummaryCard
          value='$253,467'
          title='Revenue'
          icon={Sale}
          class='revenue-icon'
        />
        <SummaryCard
          value='4551678'
          title='Clicks'
          icon={arrow}
          class='clicks-icon'
        /> */}
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
