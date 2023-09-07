import { Marketing, subscriber, Sale, arrow } from "../../assets/index";
import React, { useState, useEffect, Fragment, lazy, Suspense } from "react";
import { useStateContext } from "../../contexts/ContextProvider";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllCampaigns,
  fetchCampaign,
  getTotalCampaigns,
  updateCampaign,
} from "../../app/features/campaigns/campaignSlice";
import { useAuthenticatedFetch } from "../../hooks";
import { fetchAllReferrals } from "../../app/features/referrals/referralSlice";
import {
  fetchCampaignDetails,
  fetchCampaignsDetailsList,
  updateCampaignDetails,
} from "../../app/features/campaign_details/campaign_details";
import { fetchAllCampaignClicks } from "../../app/features/user_clicks/totalclicksSlice";
import SkeletonSummaryCard from "../loading_skeletons/SkeletonSummaryCard";
import LoadingSkeleton from "../loading_skeletons/LoadingSkeleton";

const SummaryCard = lazy(() => import("../ui/SummaryCard"));
const CampaignBlock = lazy(() => import("./CampaignBlock"));

const CampaignsComponent = () => {
  const fetch = useAuthenticatedFetch();
  const { setIsEdit } = useStateContext();
  const dispatch = useDispatch();

  const List = useSelector(fetchAllCampaigns);
  const campaignDetails = useSelector(fetchCampaignsDetailsList);
  const ReferralList = useSelector(fetchAllReferrals);
  const TotalClicksList = useSelector(fetchAllCampaignClicks);

  const [getCampaigns, setCampaigns] = useState([]);
  const [getDetails, setDetails] = useState([]);
  const [editData, setEditData] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [campaignName, setCampaignName] = useState("");
  const [getReferrals, setReferrals] = useState([]);
  const [getTotalClicks, setTotalClicks] = useState(0);

  useEffect(() => {
    if (List?.length > 0) {
      setCampaigns(List);
    }
  }, [dispatch, List]);

  // Get Referrals List
  useEffect(() => {
    if (ReferralList) {
      setReferrals(ReferralList);
    }
  }, [ReferralList, dispatch]);

  // Get Details of Campaign
  useEffect(() => {
    if (campaignDetails?.length > 0) {
      setDetails(campaignDetails);
    }
  }, [campaignDetails, dispatch]);

  let t_clicks = 0;
  // Get Total Clicks Count
  useEffect(() => {
    if (TotalClicksList.length > 0) {
      setTotalClicks(TotalClicksList);
    }
  }, [TotalClicksList]);
  // console.log(getTotalClicks);
  if (getTotalClicks.length > 0) {
    t_clicks = getTotalClicks[0].total_clicks;
  }

  // PAGINATION

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(getDetails?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = getDetails?.slice(startIndex, endIndex);


  // Handle Previous Page Click events
  const handlePrevClick = () => {
    setCurrentPage((currentPage) => currentPage - 1);
  };
  // Handle Next Page Click events
  const handleNextClick = () => {
    setCurrentPage((currentPage) => currentPage + 1);
  };

  // OLD HANDLE DELETE CAMPAIGN FUNCTION  [will only set True the is_Deleted flag but not removing camapigns ]
  const handleDelete = async (id) => {
    setDeleteId(id);

    // Delete From Store API Call
    async function deleteFromStore(id) {
      try {
        const response = await fetch("/api/delete_from_store", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            campaign_id: id,
          }),
        });
        const responseData = await response.json();
        console.log(responseData);
      } catch (error) {
        console.log(error);
      }
    }

    try {
      const deletedCampaign = getCampaigns.find(
        (campaign) => campaign?.campaign_id === id
      );

      const deletedDetails = getDetails?.find(
        (camp) => camp?.campaign_id === id
      );
      setCampaignName(deletedCampaign?.name);

      await deleteFromStore(id);
      const response = await fetch(`/api/campaignsettings/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...deletedCampaign,
          is_deleted: true,
        }),
      });
      if (response.ok) {
        try {
          const deletedData = await response.json();
          dispatch(updateCampaign(deletedCampaign));
          const newData = getCampaigns?.filter(
            (campaign) => campaign?.campaign_id !== id
          );
          const newDetails = getDetails?.filter(
            (campaign) => campaign?.campaign_id !== id
          );
          await dispatch(fetchCampaign(newData));
          await dispatch(fetchCampaignDetails(newDetails));
          setCampaigns([...newData]);
          setDetails([...newDetails]);
        } catch (error) {
          throw new Error("Invalid JSON response");
        }
      } else {
        throw new Error("Failed to delete campaign");
      }
    } catch (err) {
      console.log(err);
    }
  };


  // Campaign is removed from both frontend and backend campaign Table List

  const handleDeleteCampaign = async (camp_id) => {
    setDeleteId(camp_id);
    const deletedCampaign = getCampaigns.find(
      (campaign) => campaign?.campaign_id === camp_id
    );
    const deletedDetails = getDetails?.find(
      (camp) => camp?.campaign_id === camp_id
    );

    setCampaignName(deletedCampaign?.name);
    try {
      const response2 = await fetch(`/api/campaignsettings/${camp_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response2.ok) {
        // Update the state after a successful deletion

        await dispatch(updateCampaign(deletedCampaign));
        await dispatch(updateCampaignDetails(deletedDetails));
        try {
          const newData = await getCampaigns?.filter(
            (campaign) => campaign.campaign_id !== camp_id
          );

          const newDetails = getDetails?.filter(
            (campaign) => campaign?.campaign_id !== camp_id
          );

          console.log(newDetails, "New Details");
          await dispatch(fetchCampaign(newData));
          await dispatch(fetchCampaignDetails(newDetails));
          setCampaigns([...newData]);
          setDetails([...newDetails]);
        } catch (error) {
          console.log(error, "Updating states");
        }
        console.log("Campaign deleted successfully");
      } else {
        console.error("Failed to delete campaign");
      }
    } catch (error) {
      console.error("Error deleting campaign:", error);
    }
  };

  // Handle Edit Campaign Data
  const handleEdit = (id) => {
    setIsEdit(true);
    setEditData(getCampaigns?.filter((data) => data?.campaign_id === id));
  };

  return (
    <div className="home-container">
      <div className="summary-blocks">
        <Suspense fallback={<SkeletonSummaryCard />}>
          <SummaryCard
            value={getDetails?.length}
            title="Campaigns"
            icon={Marketing}
            class="campaign-icon"
          />
        </Suspense>
        <Suspense fallback={<SkeletonSummaryCard />}>
          <SummaryCard
            value={getReferrals?.length}
            title="Referrals"
            icon={subscriber}
            class="referral-icon"
          />
        </Suspense>
        <Suspense fallback={<SkeletonSummaryCard />}>
          <SummaryCard
            value={t_clicks}
            title="Clicks"
            icon={arrow}
            class="clicks-icon"
          />
        </Suspense>
        {/* <SummaryCard
          value='$253,467'
          title='Revenue'
          icon={Sale}
          class='revenue-icon'
        />
       */}
      </div>
      <div className="campaigns">
        {getDetails?.length > 0 ? (
          <>
            <div className="campaigns-blocks">
              {currentItems?.map((campaign) => (
                <Suspense fallback={<LoadingSkeleton />}>
                  <CampaignBlock
                    key={campaign?.campaign_id}
                    eitData={editData}
                    data={campaign}
                    deleteId={deleteId}
                    setDeleteId={setDeleteId}
                    campaignName={campaignName}
                    setCampaignName={setCampaignName}
                    deleteModal={deleteModal}
                    setDeleteModal={setDeleteModal}
                    handleDelete={handleDelete}
                    handleDeleteCampaign={handleDeleteCampaign}
                    handleEdit={handleEdit}
                  />
                </Suspense>
              ))}
            </div>
            {/* Pagination */}
            {getDetails?.length > 0 && (
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
            )}
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
};

export default CampaignsComponent;
