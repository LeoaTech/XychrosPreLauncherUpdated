import ShortSummaryCard from "../ui/ShortSummaryCard";
import { subscriber, Sale, arrow } from "../../assets/index";
import { IconContext } from "react-icons";
import { FaEdit, FaHourglassEnd } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { DeleteModal } from "../modal/index";
import "./CampaignBlock.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import ToggleSwitch from "./toggleSwitch/ToggleSwitch";
import AlertInfoModal from "../modal/AlertInfoModal";

export default function CampaignBlock({
  data,
  handleDelete,
  handleEdit,
  setDeleteModal,
  deleteModal,
  deleteId,
  setDeleteId,
}) {
  // Campaign Card Block Data Properties
  const { campaign_id, name, product, start_date, end_date } = data;
  const [alertModal, setAlertModal] = useState(false);

  let startDate = new Date(start_date).toLocaleDateString();
  let endDate = new Date(end_date).toLocaleDateString();
  const [deleteEndData, setDeleteEndDate] = useState(null);
  const [isToggled, setIsToggled] = useState(product === "" ? false : true);

  function checkAndDeleteCampaign(campaignDate) {
    // Convert the campaign date string to a Date object
    const campaignDateObj = new Date(campaignDate);

    // Get the current date
    const now = new Date();
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
                onToggle={() => setIsToggled((prev) => !prev)}
              />
            </span>
          </div>

          <Link to={product} className="campaign-block-product-name">
            {product}
          </Link>

          <div className="campaign-block-duration">
            {startDate} - {endDate}
          </div>
        </div>
        <div className="campaign-right-card">
          <div className="campaign-kpis">
            <ShortSummaryCard
              value="345"
              icon={subscriber}
              className="referral-icon"
            />
            <ShortSummaryCard
              value="$37"
              icon={Sale}
              className="revenue-icon"
            />
            <ShortSummaryCard
              value="4568"
              icon={arrow}
              className="clicks-icon"
            />
          </div>
          <div className="campaign-actions">
            <IconContext.Provider
              value={{
                color: "#fcfcfc",
                size: "30px",
              }}
            >
              <div className="icon-image">
                <Link
                  to={`/campaigns/${campaign_id}`}
                  onClick={() => handleEdit(campaign_id)}
                >
                  <FaEdit style={{ height: "30px", width: "30px" }} />
                  <div>
                    <span>Edit</span>
                  </div>
                </Link>
              </div>
            </IconContext.Provider>
            <IconContext.Provider
              value={{
                color: "red",
                size: "30px",
              }}
            >
              <div className="icon-image">
                <RiDeleteBin6Line
                  onClick={() => {
                    setDeleteId(campaign_id);
                    setDeleteEndDate(endDate);
                    checkAndDeleteCampaign(deleteEndData);
                  }}
                  style={{ height: "30px", width: "30px", color: "red" }}
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
          isToggled={isToggled}
          openModal={deleteModal}
          setDeleteModal={setDeleteModal}
          handleDelete={handleDelete}
        />
      </div>
      <div>
        <AlertInfoModal
          values={deleteId}
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
