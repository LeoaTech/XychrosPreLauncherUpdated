import SummaryCard from '../ui/SummaryCard';
import { Marketing, Sale, subscriber, arrow } from '../../assets/index';
import ReferralsBlock from './ReferralsBlock';
import React, { useEffect, useState } from 'react';
import './referral.css';
import { useStateContext } from '../../contexts/ContextProvider';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllReferrals } from '../../app/features/referrals/referralSlice';
import { fetchAllCampaigns } from '../../app/features/campaigns/campaignSlice';
import { useAuthenticatedFetch } from '../../hooks';
import { fetchCampaignsDetailsList } from '../../app/features/campaign_details/campaign_details';

const Referrals = () => {
  // const { getCampaigns } = props;
  const List = useSelector(fetchAllCampaigns);
  const campaignDetails = useSelector(fetchCampaignsDetailsList)
  const [getCampaigns, setCampaigns] = useState([...campaignDetails]);

  const ReferralList = useSelector(fetchAllReferrals);
  const [getReferrals, setReferrals] = useState([...ReferralList]);

  useEffect(() => {
    if (ReferralList) {
      setReferrals(ReferralList);
    }
  }, [ReferralList]);

  const fetch = useAuthenticatedFetch();

  return (
    <div className='home-container'>
      <div className='summary-blocks'>
        <SummaryCard
          value={getCampaigns?.length || 0}
          title='Campaigns'
          icon={Marketing}
          className='campaign-icon'
        />
        <SummaryCard
          value={getReferrals.length}
          title='Referrals'
          icon={subscriber}
          class='referral-icon'
        />
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

      <div className='referral_table'>
        <ReferralsBlock tableData={getReferrals} />
      </div>
    </div>
  );
};

export default Referrals;
