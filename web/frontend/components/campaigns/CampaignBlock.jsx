import { subscriber, Sale, arrow } from "../../assets/index";
import { IconContext } from "react-icons";
import { BsToggle2On } from "react-icons/bs";
import { MdBlock, MdToggleOn, MdOfflineBolt } from "react-icons/md";
import { FaEdit, FaHourglassEnd } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoCalendarSharp, IoToggle, IoToggleOutline } from "react-icons/io5";
import { IoCalendarSharp, IoToggle, IoToggleOutline } from "react-icons/io5";
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
import { useThemeContext } from "../../contexts/ThemeContext";

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
  setDeleteId,
  campaignName,
  setCampaignName,
  TotalRevenueList,
}) {
  // Campaign Card Block Data Properties
  const {
    campaign_id,
    name,
    product,
    start_date,
    end_date,
    is_active,
    is_draft,
    landing_page_link,
    rewards_page_link,
    landing_template_link,
    rewards_template_link,
  } = data;

  const { theme } = useThemeContext();
  const [alertModal, setAlertModal] = useState(false);

  const [hovered, setHovered] = useState(true);

  const campaignActionButtonStyle = {
    // backgroundColor: is_active ? "#e0e0e0" : "",
    cursor: is_active ? "default" : "pointer",
    pointerEvents: is_active ? "none" : "auto",
    color:
      theme === "dark"
        ? is_active
          ? "#C0C0C0	"
          : "#e0e0e0"
        : is_active
        ? "#000"
        : "gray",
  };

  const campaignActionDeleteButtonStyle = {
    // backgroundColor: is_active ? "#e0e0e0" : "",
    cursor: is_active ? "default" : "pointer",
    pointerEvents: is_active ? "none" : "auto",
    color:
      theme === "dark"
        ? is_active
          ? "crimson	"
          : "#CB624C"
        : is_active
        ? "#cb624c"
        : "crimson",
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
  const [draftToggle, setDraftToggle] = useState(false);

  // Individual campaign clicks
  const campaign_clicks = useSelector((state) =>
    fetchIndividualCampaignClicks(state, +campaign_id)
  );

  // Individual campaign revenue
  const campaign_revenue = useSelector((state) =>
    fetchIndividualCampaignRevenue(state, +campaign_id)
  );

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

    if (is_draft) {
      setDraftToggle(true);
    } else {
      setDraftToggle(false);
    }
  }, [is_active, is_draft]);

  let is_deactivated = new Date(end_date) < now;
  let draftCampaignToggle = is_draft || draftToggle;

  return (
    <>
      <div
        className={
          theme === "dark"
            ? `campaign-block ${is_deactivated ? "deactive" : ""}`
            : `campaign-block-light ${is_deactivated ? "deactive" : ""}`
        }
      >
        <div className="campaign-details">
          <div
            className={
              theme === "dark"
                ? `camapign-block-name ${is_deactivated ? "deactive" : ""}`
                : `camapign-block-name-light ${
                    is_deactivated ? "deactive" : ""
                  }`
            }
            data-tooltip-id={
              is_deactivated ? "deactivate-campaigns-tooltip" : ""
            }
          >
            {name}
            {is_deactivated ? (
              <span>
                {" "}
                {theme === "dark" ? (
                  <IoToggleOutline
                    style={{ height: "32px", width: "30px", color: "#ccc" }}
                  />
                ) : (
                  <IoToggle
                    style={{ height: "32px", width: "30px", color: "gray" }}
                  />
                )}{" "}
              </span>
            ) : (
              <span>
                {!draftCampaignToggle && (
                  <ToggleSwitch
                    rounded={true}
                    isToggled={isToggled}
                    draftCampaignToggle={draftCampaignToggle}
                  />
                )}
              </span>
            )}
            {/* Draft Campaign Toggle Switch */}
            {draftCampaignToggle && (
              <span data-tooltip-id="draft-campaign-tooltip">
                <ToggleSwitch
                  rounded={true}
                  isToggled={isToggled}
                  draftCampaignToggle={draftCampaignToggle || draftToggle}
                />
              </span>
            )}
          </div>

          <Link
            to={product}
            className={
              theme === "dark"
                ? `campaign-block-product-name ${
                    is_deactivated ? "deactive" : ""
                  }`
                : `campaign-block-product-name-light ${
                    is_deactivated ? "deactive" : ""
                  }`
            }
            data-tooltip-id={
              is_deactivated ? "deactivate-campaigns-tooltip" : ""
            }
          >
            {product ? product : "Product Name"}
          </p>

          <div className="campaign-block-duration">
            <IoCalendarSharp
              style={{ height: 14, width: 16, marginRight: 5, marginTop: 10 }}
            />
            {startDate} - {endDate}
          </div>
        </div>
        <div
          className={
            theme === "dark"
              ? "campaign_center_links"
              : "campaign_center_links_light"
          }
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
          {!draftCampaignToggle && (
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
          )}
        </div>
        <div className="campaign-right-card">
          <div className="campaign-kpis">
            <Suspense fallback={<SkeletonShortSummaryCard />}>
              <ShortSummaryCard
                is_deactivated={is_deactivated}
                value={referralsById}
                value={referralsById}
                icon={subscriber}
                className="referral-icon"
              />
            </Suspense>

            <Suspense fallback={<SkeletonShortSummaryCard />}>
              <ShortSummaryCard
                is_deactivated={is_deactivated}
                value={campaign_clicks}
                value={campaign_clicks}
                icon={arrow}
                className="clicks-icon"
              />
            </Suspense>
            <Suspense fallback={<SkeletonShortSummaryCard />}>
              <ShortSummaryCard
                is_deactivated={is_deactivated}
                value={campaign_revenue === 0 ? 0 : campaign_revenue}
                icon={Sale}
                className="revenue-icon"
                currency={campaign_revenue > 0 && TotalRevenueList[0]?.currency}
              />
            </Suspense>
          </div>
        </div>

        <div className="campaign-actions">
          {is_deactivated ? (
            <MdOfflineBolt
              data-tooltip-id="deactivate-campaigns-tooltip"
              className="deactivated"
              style={{ height: 24, width: 24, color: "crimson" }}
            />
          ) : (
            <>
              <IconContext.Provider
                value={{
                  size: 24,
                }}
                // disabled={!is_active}
              >
                <div className="icon-image" style={campaignActionButtonStyle}>
                  <Link to={`/campaigns/${campaign_id}`}>
                    <FaEdit
                      data-tooltip-id={
                        draftCampaignToggle ? "draft-campaign-tooltip" : ""
                      }
                      style={{ height: 24, width: 24, cursor: "pointer" }}
                      onClick={() => handleEdit(campaign_id)}
                      disabled={isDisabled}
                    />
                    <div>
                      <span
                        style={
                          theme === "dark"
                            ? { color: "#fff" }
                            : { color: "#333" }
                        }
                      >
                        Edit
                      </span>
                    </div>
                  </Link>
                </div>
              </IconContext.Provider>
              <IconContext.Provider
                value={{
                  color: "crimson",
                  size: 24,
                }}
                disabled={!is_active}
              >
                <div
                  className="icon-image"
                  style={campaignActionDeleteButtonStyle}
                >
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
                            cursor: "default",
                          }
                        : { height: 24, width: 24 }
                    }
                  />{" "}
                 
                  <div> <span
                    style={
                      theme === "dark" ? { color: "#fff" } : { color: "#333" }
                    }
                  >
                    Delete
                  </span></div>
                </div>
              </IconContext.Provider>{" "}
            </>
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

      <ReactTooltip
        id="draft-campaign-tooltip"
        place="top-left"
        variant="light"
        offset={20}
        content="Campaign Draft, Please click to Edit &  save your campaign"
      />
    </>
  );
}
