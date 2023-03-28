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
} from "../../app/features/campaigns/campaignSlice";
import CountUp from "react-countup";
import { useAuthenticatedFetch } from "../../hooks";
import useFetchCampaignsData from "../../constant/fetchCampaignsData";
import { useNavigate } from "react-router-dom";


export default function CampaignsComponent() {
  const { setIsEdit } = useStateContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const List = useSelector(fetchAllCampaigns);
  const [getCampaigns, setCampaigns] = useState([]);

  useEffect(() => {
    console.log(List)
    setCampaigns(List);
  }, [List,dispatch]);

 


  const [editData, setEditData] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetch = useAuthenticatedFetch();

  const handleDelete = async (id) => {
    setDeleteId(id)
    await fetch(`/api/campaignsettings/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => dispatch(removeCampaign(data[0])))
      .catch((err) => console.log(err));
  };

  

  const handleEdit = (id) => {
    setIsEdit(true);
  };

  return (
    <div className='home-container'>
      <div className='summary-blocks'>
        <SummaryCard
          value={getCampaigns?.length}
          title="Campaigns"
          icon={Marketing}
          class='campaign-icon'
        />
        <SummaryCard
          value='543678'
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
            {getCampaigns?.map((campaign) => (
              <>
                <CampaignBlock
                  key={campaign?.campaign_id}
                  setEditData={setEditData}
                  data={campaign}
                  deleteId={deleteId}
                  setDeleteId={setDeleteId}
                  deleteModal={deleteModal}
                  setDeleteModal={setDeleteModal}
                  handleDelete={handleDelete}
                  handleEdit={handleEdit}
                />
              </>
            ))}
          </>
        ) : (
          <h1
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
