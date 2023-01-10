import SummaryCard from "../ui/SummaryCard";
import { Marketing, subscriber, Sale, arrow } from "../../assets/index";
import CampaignBlock from "./CampaignBlock";
import Pagination from "../ui/Pagination";

import React, { useState, useEffect, Fragment } from "react";
import { useStateContext } from "../../contexts/ContextProvider";

/* Import the useAuthenticatedFetch hook included in the Node app template */
// import { useAuthenticatedFetch, useAppQuery } from '../../hooks';

export default function CampaignsComponent(props) {
  // const fetch = useAuthenticatedFetch();
  const { activeMenu } = useStateContext();

  const [getCampaigns, setCampaigns] = useState([
    {
      id: 1,
      product_name: "Product 1",
      campaign_name: "Campaign 1",
      product_link: "https://google.com",
      created_at: "2022-11-12",
      start_date: "December 12th, 2022",
      end_date: "January 5th, 2023",
    },
    {
      id: 2,
      product_name: "Haier dry-Cleaner",
      campaign_name: "Campaign 2",
      product_link: "https://google.com",
      created_at: "2022-11-12",
      start_date: "December 12th, 2022",
      end_date: "January 5th, 2023",
    },
  ]);
  const [error, setError] = useState("");

  // useEffect(() => {
  //   fetch('/api/getcampaigns', {
  //     method: 'GET',
  //     headers: { 'Content-Type': 'application/json' },
  //   })
  //     .then((response) => {
  //       if (response.ok) return response.json();
  //       throw new Error('something went wrong while requesting posts');
  //     })
  //     .then((myCampaigns) => {
  //       console.log(myCampaigns);
  //       setCampaigns(myCampaigns);
  //       return myCampaigns;
  //     })
  //     .catch((err) => {
  //       setError(err.message);
  //       return err.message;
  //     });
  // }, []);

  const pageLimit = 3;
  const dataLimit = 10;

  if (error) return <h1>{error.message}</h1>;

  return (
    <div className="home-container">
      <div className="summary-blocks">
        <SummaryCard
          value={getCampaigns.length}
          title="Campaigns"
          icon={Marketing}
          class="campaign-icon"
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
      <div className="campaigns">
        {getCampaigns.length > 0 ? (
          <Pagination
            data={getCampaigns}
            RenderComponent={CampaignBlock}
            pageLimit={pageLimit}
            dataLimit={dataLimit}
          />
        ) : (
          <h1>No Posts to display</h1>
        )}
      </div>
    </div>
  );
}
