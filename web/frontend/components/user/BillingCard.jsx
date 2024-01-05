import React from "react";
import "./billingCard.css";
import { useNavigate } from "react-router-dom";
import { BsCheck2 } from "react-icons/bs";

const BillingCard = ({ card }) => {
  const navigate = useNavigate();
  return (
    <div className="card-block">
      <h2>{card.plan_name}</h2>
      <ul className="card-content">
        {card?.features &&
          Object.entries(card?.features).map(([key, value]) => (
            <li className="feature" key={key}>
              <BsCheck2
                style={{
                  height: "24",
                  width: "24",
                  fill: "#fff",
                  strokeWidth: "0.5",
                }}
              />
              {value}
            </li>
          ))}
      </ul>

      <div className="price-tag">
        <p>
          <span
            style={{
              fontsize: "12px",
              fontWeight: "normal",
              textDecoration: "line-through",
              color: "#848884",
            }}
          >
            $ {card.price}
          </span>{" "}
        </p>
        <p>
          $ {card.discountPrice}
          <span> /month</span>
        </p>
      </div>
      <button className="subscribed-btn" onClick={() => navigate("/price")}>
        {" "}
        Change Plan
      </button>
    </div>
  );
};

export default BillingCard;
