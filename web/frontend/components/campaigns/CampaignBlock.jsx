import ShortSummaryCard from "../ui/ShortSummaryCard";
import { subscriber, Sale, arrow } from "../../assets/index";
import { IconContext } from "react-icons";
import { FaEdit, FaHourglassEnd } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { DeleteModal } from "../modal/index";

import "./CampaignBlock.css";
import { Link } from "react-router-dom";
import { useStateContext } from "../../contexts/ContextProvider";
import { useState } from "react";
import ToggleSwitch from "./toggleSwitch/ToggleSwitch";

export default function CampaignBlock({
  data,
  handleDelete,
  handleEdit,
  
  setDeleteModal,
  deleteModal,
}) {
  // Campaign Card Block Data Properties
  const {
    campaign_id,
    campaign_name,
    product_name,
    product_link,
    is_active,
    start_date,
    end_date,
  } = data;

  const { activeMenu, isEdit, setIsEdit } = useStateContext();
  let startDate = new Date(start_date).toLocaleDateString();
  let endDate = new Date(end_date).toLocaleDateString();
  const [isToggled, setIsToggled] = useState(is_active);
  return (
    <>
      <div className="campaign-block">
        <div className="campaign-details">
          <div className="camapign-block-name">
            {campaign_name}
            <span>
              <ToggleSwitch
                rounded={true}
                isToggled={isToggled}
                onToggle={() => setIsToggled((prev) => !prev)}
              />
            </span>
          </div>

          <Link to={product_link} className="campaign-block-product-name">
            {product_name}
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
                  // disabled={is_active ? true : false}
                  onClick={() => handleDelete(campaign_id)}
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
      {/* <div>
        <DeleteModal
          values={id}
          openModal={deleteModal}
          setDeleteModal={setDeleteModal}
          handleDelete={handleDelete}
        />
      </div> */}
    </>
  );
}
