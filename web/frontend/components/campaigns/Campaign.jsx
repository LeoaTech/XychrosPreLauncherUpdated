import SummaryCard from "../ui/SummaryCard";
import { Marketing, subscriber, Sale, arrow } from "../../assets/index";
import CampaignBlock from "./CampaignBlock";
import Pagination from "../ui/Pagination";
import React, { useState, useEffect, Fragment } from "react";
import { useStateContext } from "../../contexts/ContextProvider";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCampaign,
  fetchAllCampaigns,
  fetchCampaign,
  removeCampaign,
} from "../../app/features/campaigns/campaignSlice";
import { useAuthenticatedFetch } from "../../hooks";

export default function CampaignsComponent() {
  const { setIsEdit } = useStateContext();
  const dispatch = useDispatch();
  const List = useSelector((state) => state.campaign.campaigns);
  const [getCampaigns, setCampaigns] = useState([]);
  const [editData, setEditData] = useState([]);

  useEffect(() => {
    setCampaigns(List);
  }, [dispatch, List]);

  console.log(getCampaigns, " Camapigns", List);

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
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
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
  };

  return (
    <div className="home-container">
      <div className="summary-blocks">
        <SummaryCard
          value={getCampaigns?.length}
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
        {getCampaigns?.length > 0 ? (
          <>
            {currentItems?.map((campaign) => (
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
            ))}

            {/* Pagination */}
            <div className="pagination-content">
              {currentPage > 1 && (
                <button className="prev-btn" onClick={handlePrevClick}>
                  Prev
                </button>
              )}
              <span className="pagination-text">
                Page {currentPage} of {totalPages}
              </span>
              {currentPage < totalPages && (
                <button className="next-btn" onClick={handleNextClick}>
                  Next
                </button>
              )}
            </div>
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
