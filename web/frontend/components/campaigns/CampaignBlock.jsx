import ShortSummaryCard from "../ui/ShortSummaryCard";
import { subscriber, Sale, arrow } from "../../assets/index";
import { IconContext } from "react-icons";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";

import "./CampaignBlock.css";
import { Link } from "react-router-dom";
import { useStateContext } from "../../contexts/ContextProvider";
import { useState } from "react";
import ToggleSwitch from "./toggleSwitch/ToggleSwitch";

export default function CampaignBlock(props) {
  const { activeMenu, isEdit, setIsEdit } = useStateContext();
  const [editData, setEditData] = useState([]);
  const [isToggled, setIsToggled] = useState(false);
  const {
    id,
    campaign_name,
    product_name,
    product_link,
    created_at,
    start_date,
    end_date,
  } = props.data;

  const handleEdit = () => {
    setIsEdit(true);
    setEditData(props.data.id);
    console.log(editData);
  };

  return (
    <div className="campaign-block">
      <div className="campaign-details">
        <div className="camapign-block-name">
          {campaign_name}
          <span>
            <ToggleSwitch
              rounded={true}
              isToggled={isToggled}
              onToggle={() => setIsToggled(!isToggled)}
            />
          </span>
        </div>

        <Link to={product_link} className="campaign-block-product-name">
          {product_name}
        </Link>

        <div className="campaign-block-duration">
          {start_date} - {end_date}
        </div>
      </div>
      <div className="campaign-right-card">
        <div className="campaign-kpis">
          <ShortSummaryCard
            value="345"
            icon={subscriber}
            className="referral-icon"
          />
          <ShortSummaryCard value="$37" icon={Sale} className="revenue-icon" />
          <ShortSummaryCard value="4568" icon={arrow} className="clicks-icon" />
        </div>
        <div className="campaign-actions">
          <IconContext.Provider
            value={{
              color: "#fcfcfc",
              size: "30px",
            }}
          >
            <div className="icon-image">
              <Link to={`/campaigns/${id}`} onClick={handleEdit}>
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
  );
}
