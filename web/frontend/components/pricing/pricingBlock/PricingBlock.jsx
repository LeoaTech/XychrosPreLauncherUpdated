import React, { useState } from "react";
import { BsCheck2 } from "react-icons/bs";
import "./pricingblock.css";

const PricingBlock = ({ id, title, price, features, handlePlanSubscribe, isLoading, isSubscribed,subscribedPlanId }) => {
  const isDisabled = subscribedPlanId === id;

  return (
    <div className="pricing-details">
      <div className="price-detail-block">
        {title && <h3>{title}</h3>}
        <ul className="pricing-features">
          {features && Object.entries(features).map(([key, value]) => (
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
      </div>
      <div className="price-bottom">
        {price && <h2>${`${price}/month`}</h2>}
        <button className={isDisabled ? "btn-subscribe disabled":"btn-subscribe"} disabled={isDisabled} onClick={() => handlePlanSubscribe(id)}>{isSubscribed ? isLoading ? "Saving.." : "Subscribed" : "Subscribe"}</button>
      </div>
    </div>

  );
};

export default PricingBlock;
