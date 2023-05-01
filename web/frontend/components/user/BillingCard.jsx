import React, { useState } from "react";
import "./billingCard.css";
import { Link } from "react-router-dom";
const BillingCard = ({ card, handleSubscription, isSubscribed }) => {

  return (
    <div className="card-block" onClick={() => handleSubscription(card?.id)}>
      <h2>{card.title}</h2>
      <div className="card-content">
        {card.feature &&
          card.feature.map((feature) => {
            return (
              <>
                <div className="feature" key={feature?.id}>
                  <span className="check-icon">
                    {feature?.icon}
                  </span>
                  <p>{feature.title}</p>
                </div>
              </>
            );
          })}

        {card.slug && (
          <Link className="card-slug" to="/viewdetails">
            {card.slug}
          </Link>
        )}
      </div>

      <div className="price-tag">
        <p>${card.price}/month</p>
        <button className={`subscribed-btn ${isSubscribed ? 'subscribed' : ''}`} disabled={isSubscribed}> {isSubscribed ? "Subscribed" : "Update"}</button>
      </div>
    </div>
  );
};

export default BillingCard;
