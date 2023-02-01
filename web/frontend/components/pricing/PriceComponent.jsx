import React from "react";
import "./price.css";
import PricingBlock from "./pricingBlock/PricingBlock";
import { pricingData } from "./pricingDetails";

const PriceComponent = () => {
  return (
    <div className="pricing-container">
      <div className="pricing-title">
        <h2>Pricing & Billing</h2>
      </div>

      <div className="price-details-container">
        <div className="price-block">
          {pricingData.map((priceData) => {
            return (
              <PricingBlock
                key={priceData?.id}
                title={priceData?.title}
                features={priceData?.features}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PriceComponent;
