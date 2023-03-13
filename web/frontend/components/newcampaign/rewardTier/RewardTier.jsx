import React, { useState } from "react";
import "./RewardTier.css";

const RewardTier = ({ reward }) => {
  const [numberofReferrals, setNumberofReferrals] = useState(
    reward.no_of_referrals
  );
  const [discountValue, setDiscountValue] = useState(reward.discount_value);
  const [discountCode, setDiscountCode] = useState(reward.discount_code);

  return (
    <div classname="reward-tier-card">
      <div className="reward-title">
        <h2>{reward.title}</h2>
        <span> {reward.is_required === true && "(Required)"}</span>
      </div>
      <div className="reward-content">
        <div className="reward-form">
          <div className="inputfield">
            <label htmlFor="no_of_referrals">No of Referrals</label>
            <input
              className="small-inputfield"
              type="text"
              name="no_of_referrals"
              value={numberofReferrals}
              onChange={(e) => setNumberofReferrals(e.target.value)}
            />
          </div>
          <div className="inputfield">
            <label htmlFor="dicount_value">Discount</label>
            <input
              className="small-inputfield"
              type="text"
              name="discount_val"
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
            />
          </div>
          <div className="inputfield">
            <label htmlFor="discount_code">Discount Code</label>
            <input
              className="large-field"
              type="text"
              name="discount_code"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardTier;
