import ShortSummaryCard from "../ui/ShortSummaryCard";
import { subscriber, Sale, arrow } from "../../assets/index";
import { IconContext } from "react-icons";
import { FaEdit, FaHourglassEnd } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoCalendarSharp } from "react-icons/io5"
import { DeleteModal } from "../modal/index";
import "./CampaignBlock.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import ToggleSwitch from "./toggleSwitch/ToggleSwitch";
import AlertInfoModal from "../modal/AlertInfoModal";
import { getTotalCampaigns } from "../../app/features/campaigns/campaignSlice";
import { useSelector } from "react-redux";
import { fetchCurrentTier } from "../../app/features/current_plan/current_plan";

export default function CampaignBlock({
  data,
  handleDelete,
  handleEdit,
  setDeleteModal,
  deleteModal,
  deleteId,
  editData,
  setDeleteId,
  campaignName, setCampaignName
}) {
  // Campaign Card Block Data Properties
  const { campaign_id, name, product, start_date, end_date, active } = data;

  const [alertModal, setAlertModal] = useState(false);


  let startDate = new Date(start_date).toDateString();
  let endDate = new Date(end_date).toDateString();
  const totalCampaigns = useSelector(getTotalCampaigns);
  const currentTier = useSelector(fetchCurrentTier);
  const [deleteEndData, setDeleteEndDate] = useState(null);
  const [isToggled, setIsToggled] = useState(false);
  const [isDisabled, setIsDisabled] = useState(isToggled);

  const now = new Date();

  function checkAndDeleteCampaign(campaignDate) {
    // Convert the campaign date string to a Date object
    const campaignDateObj = new Date(campaignDate);
    // Check if the campaign date has expired
    if (campaignDateObj < now && !isToggled) {
      setDeleteModal(true);
    } else if (!isToggled) {
      setDeleteModal(true);     //uncomment this line to test Delete modal behavior
    } else if (isToggled) {
      // Info Alert Display
      setAlertModal(true);
    } else if (campaignDateObj > now) {
      setAlertModal(true);
    }
  }

  return (
    <>
      <div className="campaign-block">
        <div className="campaign-details">
          <div className="camapign-block-name">
            {name}
            <span>
              <ToggleSwitch
                rounded={true}
                isToggled={isToggled}
                id={campaign_id}
                start_date={start_date}
                end_date={end_date}
              />
            </span>
          </div>

          <Link to={product} className="campaign-block-product-name">
            {/* {product} */} Product Name
          </Link>

          <div className="campaign-block-duration">
            <IoCalendarSharp style={{ height: 14, width: 16, marginRight: 5, marginTop: 10 }} />
            {startDate} - {endDate}
          </div>
        </div>

        <div className="campaign_center_links">
          <div className="campaign_details_links">
            <Link to="/" >Landing Page</Link>
            <Link to="/">Rewards Page </Link>
          </div>
        </div>
        <div className="campaign-right-card">

          <div className="campaign-kpis">
            <ShortSummaryCard
              value="375"
              icon={subscriber}
              className="referral-icon"
            />
            {/* <ShortSummaryCard
              value="$37"
              icon={Sale}
              className="revenue-icon"
            />
            <ShortSummaryCard
              value="4568"
              icon={arrow}
              className="clicks-icon"
            /> */}
          </div>
          <div className="campaign-actions">
            <IconContext.Provider
              value={{
                color: "#fcfcfc",
                size: 24,
              }}
              disabled={isDisabled}

            >
              <div className="icon-image">
                <Link
                  to={`/campaigns/${campaign_id}`}
                  onClick={() => handleEdit(campaign_id)}
                  disabled={isDisabled}
                >
                  <FaEdit style={{ height: 24, width: 24 }} />
                  <div>
                    <span>Edit</span>
                  </div>
                </Link>
              </div>
            </IconContext.Provider>
            <IconContext.Provider
              value={{
                color: "red",
                size: 24,
              }}
              disabled={isDisabled}

            >
              <div className="icon-image">
                <RiDeleteBin6Line
                  onClick={() => {
                    setDeleteId(campaign_id);
                    setCampaignName(name)
                    setDeleteEndDate(endDate);
                    checkAndDeleteCampaign(deleteEndData);
                  }}
                  disabled={!isDisabled}

                  style={{ height: 24, width: 24, color: "red" }}
                />
                <div>
                  <span style={{ color: "red" }}>Delete</span>
                </div>
              </div>
            </IconContext.Provider>
          </div>
        </div>
      </div>
      <div>
        <DeleteModal
          values={deleteId}
          expiryDate={deleteEndData}
          campaignName={campaignName}
          isToggled={isToggled}
          openModal={deleteModal}
          setDeleteModal={setDeleteModal}
          handleDelete={handleDelete}
        />
      </div>
      <div>
        <AlertInfoModal
          values={deleteId}
          campaignName={campaignName}
          expiryDate={deleteEndData}
          isToggled={isToggled}
          openModal={alertModal}
          setAlertModal={setAlertModal}
          handleDelete={handleDelete}
        />
      </div>
    </>
  );
}
