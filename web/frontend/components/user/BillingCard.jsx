import React, { useState } from "react";
import "./billingCard.css";
import { Link, useNavigate } from "react-router-dom";
import { BsCheck2 } from "react-icons/bs";

const BillingCard = ({ card }) => {

  const navigate = useNavigate();
  return (
    <div className="card-block">
      <h2>{card.plan_name}</h2>
      <ul className="card-content">
        {card?.features && Object.entries(card?.features).map(([key, value]) => (
          <li className="feature" key={key}>
            <BsCheck2
              style={{
                height: "24",
                width: "24",
              }}
            />{value}
          </li>
        ))}
      </ul>


      <div className="price-tag">
        <p>${card.price}/month</p>
        <button className='subscribed-btn' onClick={() => navigate("/price")}> Change Plan</button>
      </div>
    </div>
  );
};

export default BillingCard;
