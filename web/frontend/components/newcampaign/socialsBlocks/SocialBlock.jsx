import React from "react";
import "./social.css";
const SocialBlock = ({ link }) => {
  return (
    <div>
      <div className="social-section">
        <div className="social-title">
          <span className="social-icons">{link.icon}</span>
          <h3>{link.title}</h3>
        </div>

        <div className="check-input">
          <input type="checkbox" name="" id="" />
          <label htmlFor="">{link.desc}</label>
        </div>

        <div className="referral-link-input">
          <textarea
            className="referral-input"
            rows={4}
            value={
              "Beyond excited for the launch of {{ product.title }}!! Join the club by subscribing at https://www.store-name.com/pages/name/referrallink"
            }
          />
        </div>
      </div>
    </div>
  );
};

export default SocialBlock;
