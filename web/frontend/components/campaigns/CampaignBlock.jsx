import { subscriber, Sale, arrow } from "../../assets/index";
import { IconContext } from "react-icons";
import { BsToggleOff } from "react-icons/bs";
import { MdBlock, MdTimerOff, MdOfflineBolt } from "react-icons/md";
import { FaEdit, FaHourglassEnd } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoCalendarSharp } from "react-icons/io5";
import "./CampaignBlock.css";
import { Link } from "react-router-dom";
import { Suspense, lazy, useEffect, useState } from "react";
import { getTotalCampaigns } from "../../app/features/campaigns/campaignSlice";
import { fetchReferralById } from "../../app/features/referrals/referralSlice";
import { fetchIndividualCampaignClicks } from "../../app/features/user_clicks/totalclicksSlice";
import { fetchIndividualCampaignRevenue } from "../../app/features/revenue/totalRevenueSlice";
import { useSelector } from "react-redux";
import { fetchCurrentTier } from "../../app/features/current_plan/current_plan";
import ToggleSwitch from "./toggleSwitch/ToggleSwitch";
import SkeletonShortSummaryCard from "../loading_skeletons/SkeletonShortSummaryCard";
import { DeleteModal, AlertInfoModal } from "../modal/index";
import { Tooltip as ReactTooltip } from "react-tooltip";

// const DeleteModal = lazy(() => import("../modal/DeleteModal"));
// const ToggleSwitch = lazy(() => import("./toggleSwitch/ToggleSwitch"));
const ShortSummaryCard = lazy(() => import("../ui/ShortSummaryCard"));

export default function CampaignBlock({
  data,
  handleDelete,
  handleEdit,
  handleDeleteCampaign,
  setDeleteModal,
  deleteModal,
  deleteId,
  editData,
  setDeleteId,
  campaignName,
  setCampaignName,
}) {
  // Campaign Card Block Data Properties
  const {
    campaign_id,
    name,
    product,
    start_date,
    end_date,
    is_active,
    landing_page_link,
    rewards_page_link,
    landing_template_link,
    rewards_template_link,
  } = data;

  const [alertModal, setAlertModal] = useState(false);

  const [hovered, setHovered] = useState(true);

  const campaignActionButtonStyle = {
    // backgroundColor: is_active ? "#e0e0e0" : "",
    cursor: is_active ? "default" : "pointer",
    pointerEvents: is_active ? "none" : "auto",
    color: is_active ? "#C0C0C0	" : "#e0e0e0",
  };

  const campaignActionMessage = is_active ? "This campaign is active" : "";
  let startDate = new Date(start_date).toDateString();
  let endDate = new Date(end_date).toDateString();

  const referralsById = useSelector((state) =>
    fetchReferralById(state, +campaign_id)
  );
  const [deleteEndData, setDeleteEndDate] = useState(null);
  const [isToggled, setIsToggled] = useState(false);
  const [isDisabled, setIsDisabled] = useState(isToggled);
  const [isDeactivated, setIsDeactivated] = useState(false);

  // Individual campaign clicks
  const campaign_clicks = useSelector((state) =>
    fetchIndividualCampaignClicks(state, +campaign_id)
  );
  // console.log(campaign_clicks);

  // Individual campaign revenue
  const campaign_revenue = useSelector((state) =>
    fetchIndividualCampaignRevenue(state, +campaign_id)
  );
  // console.log(campaign_clicks);

  const now = new Date(); //Get the current date

  function checkAndDeleteCampaign(campaignDate) {
    // Convert the campaign date string to a Date object
    const campaignDateObj = new Date(campaignDate);
    // Check if the campaign date has expired
    if (campaignDateObj < now && !isToggled) {
      setDeleteModal(true);
    } else if (!isToggled) {
      setDeleteModal(true); //uncomment this line to test Delete modal behavior
    }
  }

  // Update campaigns Active Status when Today's Date is in Start and End Date Range

  useEffect(() => {
    if (is_active) {
      setIsToggled(true);
    } else {
      setIsToggled(false);
    }
  }, [is_active]);

  let is_deactivated = new Date(end_date) < now;

  return (
    <>
      <div className={`campaign-block ${is_deactivated ? "deactive" : ""}`}>
        <div className="campaign-details">
          <div
            className={`camapign-block-name ${
              is_deactivated ? "deactive" : ""
            }`}
            data-tooltip-id={
              is_deactivated ? "deactivate-campaigns-tooltip" : ""
            }
          >
            {name}
            {is_deactivated ? (
              <span>
                {" "}
                <BsToggleOff style={{ height: 31, width: 30, color: "#ccc" }} />
              </span>
            ) : (
              <span>
                <ToggleSwitch
                  rounded={true}
                  isToggled={isToggled}
                  id={campaign_id}
                  start_date={start_date}
                  end_date={end_date}
                />
              </span>
            )}
          </div>

          <Link
            to={product}
            className={`campaign-block-product-name ${
              is_deactivated ? "deactive" : ""
            }`}
            data-tooltip-id={
              is_deactivated ? "deactivate-campaigns-tooltip" : ""
            }
          >
            {product ? product : "Product Name"}
          </Link>

          <div className="campaign-block-duration">
            <IoCalendarSharp
              style={{ height: 14, width: 16, marginRight: 5, marginTop: 10 }}
            />
            {startDate} - {endDate}
          </div>
        </div>
        <div
          className="campaign_center_links"
          data-tooltip-id={is_deactivated ? "deactivate-pages-tooltip" : ""}
        >
          <div
            className={`campaign_details_links ${
              is_deactivated ? "deactive" : ""
            }`}
          >
            <a
              href={landing_page_link}
              target="_blank"
              disabled={!is_active}
              style={{ cursor: is_active ? "pointer" : "not-allowed" }}
              onClick={(e) => {
                if (!is_active) {
                  e.preventDefault();
                }
              }}
            >
              Landing Page
            </a>
            <a
              href={rewards_page_link}
              target="_blank"
              style={{ cursor: is_active ? "pointer" : "not-allowed" }}
              disabled={!is_active}
              onClick={(e) => {
                if (!is_active) {
                  e.preventDefault();
                }
              }}
            >
              Rewards Page
            </a>
          </div>
          <div
            className={`campaign_details_links ${
              is_deactivated ? "deactive" : ""
            }`}
          >
            <a
              href={landing_template_link}
              target="_blank"
              className="btn"
              disabled={!is_deactivated}
              style={{ cursor: !is_deactivated ? "pointer" : "not-allowed" }}
              onClick={(e) => {
                if (is_deactivated) {
                  e.preventDefault();
                }
              }}
            >
              Open in Editor
            </a>

            <a
              href={rewards_template_link}
              target="_blank"
              className="btn"
              disabled={!is_deactivated}
              style={{ cursor: !is_deactivated ? "pointer" : "not-allowed" }}
              onClick={(e) => {
                if (is_deactivated) {
                  e.preventDefault();
                }
              }}
            >
              Open in Editor
            </a>
          </div>
        </div>
        <div className="campaign-right-card">
          <div className="campaign-kpis">
            <Suspense fallback={<SkeletonShortSummaryCard />}>
              <ShortSummaryCard
                is_deactivated={is_deactivated}
                value={referralsById}
                icon={subscriber}
                className="referral-icon"
              />
            </Suspense>
            <Suspense fallback={<SkeletonShortSummaryCard />}>
              <ShortSummaryCard
                value={campaign_revenue}
                icon={Sale}
                className="revenue-icon"
              />
            </Suspense>
            <Suspense fallback={<SkeletonShortSummaryCard />}>
              <ShortSummaryCard
                is_deactivated={is_deactivated}
                value={campaign_clicks}
                icon={arrow}
                className="clicks-icon"
              />
            </Suspense>
          </div>

          {is_deactivated ? (
            <MdOfflineBolt
              // MdBlock
              data-tooltip-id="deactivate-campaigns-tooltip"
              className="deactivated"
              style={{ height: 24, width: 24, color: "crimson" }}
            />
          ) : (
            <div className="campaign-actions">
              <IconContext.Provider
                value={{
                  size: 24,
                }}
                // disabled={!is_active}
              >
                <div
                  className="icon-image"
                  style={campaignActionButtonStyle}
                  // onMouseEnter={() => setHovered(true)}
                  // onMouseLeave={() => setHovered(false)}
                >
                  <Link to={`/campaigns/${campaign_id}`}>
                    <FaEdit
                      style={{ height: 24, width: 24, cursor: "pointer" }}
                      onClick={() => handleEdit(campaign_id)}
                      // style={{ textDecoration: "none" }}
                      disabled={isDisabled}
                    />
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
                disabled={!is_active}
              >
                <div className="icon-image" style={campaignActionButtonStyle}>
                  <RiDeleteBin6Line
                    onClick={() => {
                      setDeleteId(campaign_id);
                      setCampaignName(name);
                      setDeleteEndDate(endDate);
                      checkAndDeleteCampaign(deleteEndData);
                    }}
                    disabled={!is_active}
                    style={
                      is_active
                        ? {
                            height: 24,
                            width: 24,
                            color: "#CB624C",
                            cursor: "default",
                          }
                        : { height: 24, width: 24, color: "red" }
                    }
                  />
                  <div>
                    <span>Delete</span>
                  </div>
                </div>
              </IconContext.Provider>
            </div>
          )}
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
          handleDelete={handleDeleteCampaign}
        />{" "}
      </div>
      <ReactTooltip
        id="deactivate-campaigns-tooltip"
        place="top-left"
        variant="info"
        offset={20}
        content="Campaign is deactivated"
      />

      <ReactTooltip
        id="deactivate-pages-tooltip"
        place="top-left"
        variant="info"
        offset={20}
        content="Links are no longer available"
      />
    </>
  );
}
