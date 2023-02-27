import SummaryCard from "../ui/SummaryCard";
import { Marketing, Sale, subscriber, arrow } from "../../assets/index";
import ReferralsBlock from "./ReferralsBlock";
import React, { useEffect, useState } from "react";
import "./referral.css";
import { useSelector } from "react-redux";
import { fetchAllCampaigns } from "../../app/features/campaigns/campaignSlice";

const Referrals = () => {
  // const { getCampaigns } = props;
  const List = useSelector(fetchAllCampaigns);
  const [getCampaigns, setCampaigns] = useState([...List]);

  
  return (
    <div className="home-container">
      <div className="summary-blocks">
        <SummaryCard
          value={getCampaigns?.length || 0}
          title="Campaigns"
          icon={Marketing}
          className="campaign-icon"
        />
        <SummaryCard
          value="543678"
          title="Referrals"
          icon={subscriber}
          class="referral-icon"
        />
        <SummaryCard
          value="$253,467"
          title="Revenue"
          icon={Sale}
          class="revenue-icon"
        />
        <SummaryCard
          value="4551678"
          title="Clicks"
          icon={arrow}
          class="clicks-icon"
        />
      </div>

      <div className="referral_table">
        <ReferralsBlock />
      </div>
    </div>
  );
};

export default Referrals;
