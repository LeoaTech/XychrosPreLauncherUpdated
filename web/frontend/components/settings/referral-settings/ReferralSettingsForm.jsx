import React from "react";

import { integratelinks } from "../../newcampaign/socialLinks";
import { useThemeContext } from "../../../contexts/ThemeContext";
const ReferralSettingsForm = ({settingsData, handleChange, handleCheckboxChange }) => {
    const {theme} = useThemeContext()

    return (
    <div className="referral-settings-container">
      <div className={theme==="dark"?"subheading":"subheading-light"}>
        <p>
          Select the Social Media channels that you want to allow your customers
          to share their referral link with! You can also customise the message
          that you would want your customers to share!
        </p>
      </div>

      <div className="referrals-cards-block">
        {integratelinks?.map((link) => (
          <div className="social_block" key={link.id}>
            <div className="social-section">
              <div className="social-title">
                <span className="social-icons">{link.icon}</span>
              </div>

              <div className={theme ==="dark"?"check-input":"check-input-light"}>
                <input
                  type="checkbox"
                  name={`share_${link.title}_referral`}
                  id={`share_${link.title}_referral`}
                  checked={settingsData[`share_${link.title}_referral`]}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor={`share_${link.title}_referral`}>
                  {link.desc}
                </label>
              </div>

              <div className="referral-link-input">
                <textarea
                  className={theme==="dark"?"referral-input":"referral-input-light"}
                  rows={4}
                  name={`share_${link.title}_message`}
                  value={settingsData[`share_${link.title}_message`]}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReferralSettingsForm;
