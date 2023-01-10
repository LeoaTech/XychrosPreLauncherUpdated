import SummaryCard from "../ui/SummaryCard";
import { Marketing, Sale, subscriber, arrow } from "../../assets/index";
import ReferralsBlock from "./ReferralsBlock";
import React, { useState } from "react";

const Referrals = () => {
  // const [getReferrals, setReferrals] = useState([
  //   {
  //     id: 1010,
  //     email: "johh.doe@test.com",
  //     referal_code: "abcd",
  //     referrer_id: "abcd12",
  //     created_at: "2022-12-12",
  //     campaign_id: 1,
  //   },
  // ]);

  return (
    <div className="home-container">
      <div className="summary-blocks">
        <SummaryCard
          value={1}
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

      <div>
        <ReferralsBlock />
      </div>
    </div>
  );
};

export default Referrals;
