import React from "react";
import { BsCheck2 } from "react-icons/bs";
import "./pricingblock.css";

const PricingBlock = ({ title, features }) => {
  return (
    <div className="pricing-details">
      <div className="price-detail-block">
        <h3>{title}</h3>
        {features?.map((feature) => {
          return (
            <div className="pricing-features">
              <div key={feature.id} className="feature">
                <BsCheck2
                  style={{
                    height: "30px",
                    width: "35px",
                    paddingRight: "5px",
                  }}
                />
                <p>{feature?.feature}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="price-bottom">
        <h2>{"$1000/month"}</h2>
        <button className="btn-subscribe">Subscribe</button>
      </div>
    </div>
  );
};

export default PricingBlock;
