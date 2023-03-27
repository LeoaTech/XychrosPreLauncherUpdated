import SummaryCard from '../ui/SummaryCard';
import { Marketing, subscriber, Sale, arrow } from '../../assets/index';
import CampaignBlock from './CampaignBlock';
import Pagination from '../ui/Pagination';
import React, { useState, useEffect, Fragment } from 'react';
import { useStateContext } from '../../contexts/ContextProvider';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAllCampaigns,
  fetchCampaign,
} from '../../app/features/campaigns/campaignSlice';
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch";

export default function CampaignsComponent() {
  const { activeMenu, isEdit, setIsEdit } = useStateContext();
  const dispatch = useDispatch();
  const [totalReferrals, setTotalReferrals] = React.useState(0);
  const authenticated_fetch = useAuthenticatedFetch();
  const List = useSelector(fetchAllCampaigns);
  const [getCampaigns, setCampaigns] = useState([...List]);
  const [editData, setEditData] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = (id) => {
    let newData = getCampaigns?.filter((cp) => cp.campaign_id !== id);
    setCampaigns(newData);
  };

  const handleEdit = (id) => {
    setIsEdit(true);
    setEditData(getCampaigns?.filter((cp) => cp.id === id));
  };

  const pageLimit = 3;
  const dataLimit = 10;

  const get_referrals = async () => {
    const response = await authenticated_fetch("/api/get_store_referrals");
    const data = await response.json();
    setTotalReferrals(data.total_referrals);
    console.log(data);
  };
  React.useEffect(() => {
    get_referrals();
  }, []);

  if (error) return <h1>{error}</h1>;

  return (
    <div className='home-container'>
      <div className='summary-blocks'>
        <SummaryCard
          value={getCampaigns.length > 0 ? getCampaigns.length : 0}
          title='Campaigns'
          icon={Marketing}
          class='campaign-icon'
        />
        <SummaryCard
          title='Referrals'
          value={totalReferrals}
          icon={subscriber}
          class='referral-icon'
        />
        <SummaryCard
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
        />
      </div>
      <div className='campaigns'>
        {getCampaigns?.length > 0 ? (
          <>
            {getCampaigns?.map((campaign) => (
              <CampaignBlock
                key={campaign.campaign_id}
                editData={editData}
                setEditData={setEditData}
                data={campaign}
                deleteModal={deleteModal}
                setDeleteModal={setDeleteModal}
                handleDelete={handleDelete}
                handleEdit={handleEdit}
              />
            ))}
          </>
        ) : (
          <h1 style={{ color: '#fff', fontSize: 29, margin: 20 }}>
            No Campaigns Data
          </h1>
        )}
      </div>
    </div>
  );
}

/*


 <Pagination
            data={getCampaigns}
            RenderComponent={CampaignBlock}
            pageLimit={pageLimit}
            dataLimit={dataLimit}
          />*/
