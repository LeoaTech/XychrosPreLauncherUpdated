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
  isDiscount,
  handlePlanSubscribe,
  isLoading,
  isSubscribed,
  subscribedPlanId,
}) => {
  const isDisabled = subscribedPlanId === id;

  const calculatePriceDiscount = (20 / 100) * price;
  // console.log(calculatePriceDiscount, "price old")
  let newPrice = price - calculatePriceDiscount;
  newPrice = Number(newPrice).toFixed(2);

  return (
    <>
      {isDiscount ? (
        <div className="pricing-details">
          <div className="top-badge">
            <span>
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
            </span>
            <span className="flag">20% OFF</span>
          </div>

          <div className="price-detail-block">
            <h3>{title}</h3>

            <ul className="pricing-features">
              {features &&
                Object.entries(features).map(([key, value]) => (
                  <li className="feature" key={key}>
                    <BsCheck2
                      style={{
                        height: "24",
                        width: "24",
                        marginRight: "5px",
                        strokeWidth: "0.8",
                      }}
                    />
                    {value}
                  </li>
                ))}
            </ul>
          </div>
          <div className="price-bottom">
            {price && (
              <>
                <p style={{ textDecoration: "line-through", color: "gray" }}>
                  {" "}
                  <span>$ </span>
                  {price}
                  <span>/month</span>
                </p>
                <h2>
                  <span>$ </span>
                  {newPrice}
                  <span>/month</span>
                </h2>
              </>
            )}
            <button
              className={
                isDisabled ? "btn-subscribe disabled" : "btn-subscribe"
              }
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
      ) : (
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
              className={
                isDisabled ? "btn-subscribe disabled" : "btn-subscribe"
              }
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
      )}
    </>
  );
};

export default PricingBlock;
