import SummaryCard from '../ui/SummaryCard';
import { Marketing, subscriber, Sale, arrow } from '../../assets/index';
import CampaignBlock from './CampaignBlock';
import Pagination from '../ui/Pagination';
import React, { useState, useEffect, Fragment } from 'react';
import { useStateContext } from '../../contexts/ContextProvider';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteCampaign,
  fetchAllCampaigns,
  fetchCampaign,
  removeCampaign,
} from '../../app/features/campaigns/campaignSlice';
import { useAuthenticatedFetch } from '../../hooks';
import { fetchAllReferrals } from '../../app/features/referrals/referralSlice';

export default function CampaignsComponent() {
  const { setIsEdit } = useStateContext();
  const dispatch = useDispatch();
  const List = useSelector((state) => state.campaign.campaigns);
  const [getCampaigns, setCampaigns] = useState([]);
  const [editData, setEditData] = useState([]);
  const ReferralList = useSelector(fetchAllReferrals);
  const [getReferrals, setReferrals] = useState([]);

  // Get Campaigns with Id (descending Order)
  useEffect(() => {
    if (List?.length > 0) {
      const myImmutableArray = Object.freeze(List);

      const sortedArray = [...myImmutableArray].sort(
        (a, b) => b.campaign_id - a.campaign_id
      );
      setCampaigns(sortedArray);
    }
  }, [dispatch, List]);

  useEffect(() => {
    if (ReferralList) {
      setReferrals(ReferralList);
    }
  }, [ReferralList]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(getCampaigns?.length / itemsPerPage);

  // Handle Previous Page Click events
  const handlePrevClick = () => {
    setCurrentPage((currentPage) => currentPage - 1);
  };
  // Handle Next Page Click events
  const handleNextClick = () => {
    setCurrentPage((currentPage) => currentPage + 1);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = getCampaigns?.slice(startIndex, endIndex);

  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetch = useAuthenticatedFetch();

  const handleDelete = async (id) => {
    setDeleteId(id);

    await fetch(`/api/campaignsettings/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch(deleteCampaign(data[0]));
      })
      .catch((err) => console.log(err));

    const newData = await getCampaigns?.filter(
      (campaign) => campaign.campaign_id !== id
    );
    await dispatch(fetchCampaign(newData));
    setCampaigns(newData);
  };

  const handleEdit = (id) => {
    setIsEdit(true);
    setEditData(getCampaigns?.filter((data) => data?.campaign_id === id));
  };

  return (
    <div className='home-container'>
      <div className='summary-blocks'>
        <SummaryCard
          value={getCampaigns?.length}
          title='Campaigns'
          icon={Marketing}
          class='campaign-icon'
        />
        <SummaryCard
          value={getReferrals.length}
          title='Referrals'
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
            {' '}
            <div className='campaigns-blocks'>
              {currentItems?.map((campaign) => (
                <CampaignBlock
                  key={campaign?.campaign_id}
                  eitData={editData}
                  data={campaign}
                  deleteId={deleteId}
                  setDeleteId={setDeleteId}
                  deleteModal={deleteModal}
                  setDeleteModal={setDeleteModal}
                  handleDelete={handleDelete}
                  handleEdit={handleEdit}
                />
              ))}
            </div>
            {/* Pagination */}
            <div className='pagination-content'>
              {currentPage > 1 && (
                <button
                  className='prev-btn'
                  onClick={handlePrevClick}
                >
                  Prev
                </button>
              )}
              <span className='pagination-text'>
                Page {currentPage} of {totalPages}
              </span>
              {currentPage < totalPages && (
                <button
                  className='next-btn'
                  onClick={handleNextClick}
                >
                  Next
                </button>
              )}
            </div>
          </>
        ) : (
          <h1
            style={{
              color: '#fff',
              fontSize: 29,
              margin: 20,
              height: '50vh',
              display: 'Flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            No Campaigns Data
          </h1>
        )}
      </div>
    </div>
  );
}
