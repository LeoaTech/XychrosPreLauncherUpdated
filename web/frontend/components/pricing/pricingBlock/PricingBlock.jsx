import React, { useState } from "react";
import { BsCheck2, BsCheckCircle, BsCheck2Circle } from "react-icons/bs";
import "./pricingblock.css";
import checked from "../../../assets/cheked.png";
import ButtonLo from "../../loading_skeletons/ButtonLoader";
import ButtonLoader from "../../loading_skeletons/ButtonLoader";
const PricingBlock = ({
  id,
  title,
  price,
  features,
  handlePlanSubscribe,
  isLoading,
  isSubscribed,
  subscribedPlanId,
}) => {
  const isDisabled = subscribedPlanId === id;

  return (
    <div className="pricing-details">
      <div className="price-detail-block">
        <div className={isSubscribed && "title-block"}>
          {title && (
            <h3>
              {isSubscribed && (
                <BsCheck2Circle
                  className="subscribed-icon"
                  style={{
                    height: 24,
                    width: 24,
                    color: "green",
                    fill: "green",
                    fontSize: 24,
                    fontWeight: "bold",
                  }}
                />
              )}
              {title}
            </h3>
          )}
        </div>
        <ul className="pricing-features">
          {features &&
            Object.entries(features).map(([key, value]) => (
              <li className="feature" key={key}>
                <BsCheck2
                  style={{
                    height: "24",
                    width: "24",
                    marginRight: "5px",
                  }}
                />
                {value}
              </li>
            ))}
        </ul>
      </div>
      <div className="price-bottom">
        {price && <h2>${`${price}/month`}</h2>}
        <button
          className={isDisabled ? "btn-subscribe disabled" : "btn-subscribe"}
          disabled={isDisabled}
          onClick={() => handlePlanSubscribe(id)}
        >
          {isSubscribed ? (
            isLoading ? (
              <ButtonLoader />
            ) : (
              "Subscribed"
            )
          ) : (
            "Subscribe"
          )}
        </button>
      </div>
    </div>
  );
};

export default PricingBlock;
