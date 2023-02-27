import React from "react";
import "./billingCard.css";
import { BsCheck2 } from "react-icons/bs";
import { Link } from "react-router-dom";
const BillingCard = ({ card }) => {
  return (
    <div className="card-block">
      <h2>{card.title}</h2>
      <div className="card-content">
        {card.feature &&
          card.feature.map((feature) => {
            return (
              <>
                <div className="feature" key={feature?.id}>
                  <span>
                    <BsCheck2
                      style={{ height: 25, width: 25, color: "#000" }}
                    />
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
        <button className="subscribed-btn">{card.btnText}</button>
      </div>
    </div>
  );
};

export default BillingCard;
