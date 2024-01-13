import React from "react";
import { BlackLogo } from "../../../assets";

const EmailSettingsForm = ({settingsData, handleChange}) => {
  return (
    <div className="email-container">
      {/* Welcome Email */}
      <section>
        <div className="email-section">
          <h2>
            Welcome Email Draft - This email is sent when a customer signs up{" "}
          </h2>
          <div className="email-content">
            <img src={BlackLogo} alt="Shop Logo" className="shop-logo" />

            <textarea
              className="email-textinput"
              type="text"
              rows={9}
              value={settingsData?.welcome_email}
              name="welcome_email"
              id="welcome_email"
              onChange={handleChange}
            />
          </div>
        </div>
      </section>
      {/* Referral Email */}
      <section>
        <div className="email-section">
          <h2>
            Referral Email Draft - This email is sent when a referral signs up{" "}
          </h2>
          <div className="email-content">
            <img src={BlackLogo} alt="Shop Logo" className="shop-logo" />
            <textarea
              className="email-textinput"
              rows={9}
              type="text"
              name="referral_email"
              value={settingsData?.referral_email}
              onChange={handleChange}
            />
          </div>
        </div>
      </section>
      {/* Reward Email */}
      <section>
        <div className="email-section">
          <h2>
            Reward Tier Email Draft - This email is sent when a reward tier is
            unlocked
          </h2>
          <div className="email-content">
            <img src={BlackLogo} alt="Shop Logo" className="shop-logo" />
            <textarea
              className="email-textinput"
              rows={9}
              type="text"
              name="reward_email"
              value={settingsData?.reward_email}
              onChange={handleChange}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default EmailSettingsForm;



// Removed the Dpuble Opt-in Email
 {/* <div className="email-optCheck">
      <input
        className="checkbox-input"
        type="checkbox"
        name="double_opt_in"
        id="double_opt_in"
        checked={settingsData?.double_opt_in}
        onChange={handleCheckboxChange}
      />
      <label htmlFor="double_opt_in">
        Enable Double Opt in for new sign-ups (This feature requires
        Professional Plan or above)
      </label>
    </div>

    <section>
      <div className="email-section">
        <h2>Email Settings - Double Opt-in Email </h2>
        <div className="email-content">
          <img
            src={BlackLogo}
            alt="Shop Logo"
            className="shop-logo"
          />

          <textarea
            className="email-textinput"
            type="text"
            rows={9}
            value={settingsData?.double_opt_in_email}
            name="double_opt_in_email"
            id="double_opt_in_email"
            onChange={handleChange}
          />
        </div>
      </div>
    </section> */}