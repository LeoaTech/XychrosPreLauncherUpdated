import React, { useState } from "react";
import { SideLogo } from "../../assets";
import "./setting.css";
const InitialDefaultEmail = `Hi,

Thank you for subscribing to {campaign.name} for the pre-launch of {product.name}. You can now invite your friends and family to join you in collecting more rewards and points by using {referral.link}.

So far, {referral.friends_count} friends have joined using your referral link. You can redeem your points by using the discount code {referral.discount_code} at checkout. 

We are excited to have you on board!

{shop.name}`;
const SettingComponent = () => {
  const [defaultEmail, setDefaultEmail] = useState(InitialDefaultEmail);

  return (
    <div className="settings-container">
      <nav>
        <h1 className="nav-title">Global Settings</h1>
        <button type="submit" className="save-btn">
          Save
        </button>
      </nav>

      <p>
        The global settings apply to all campaigns. These settings can be
        over-written by changing the Advanced Settings of the individual
        campaign{" "}
      </p>

      {/* Settings Form for Email and Campaign */}

      <div className="settings-form">
        <section className="section1">
          <h2>Campaign Settings</h2>

          <div className="check-group">
            <input type="checkbox" name="" id="" />
            <label htmlFor="">Send emails immediately </label>
          </div>
          <div className="check-group">
            <input type="checkbox" name="" id="" />
            <label htmlFor="">
              Use all social media channels for sharing referral links{" "}
            </label>
          </div>
          <div className="check-group">
            <input type="checkbox" name="" id="" />
            <label htmlFor="">Reset referral points for every campaign </label>
          </div>
          <div className="check-group">
            <input type="checkbox" name="" id="" />
            <label htmlFor="">1 point per referral </label>
          </div>
        </section>

        {/* Email Settings */}
        <section className="section2">
          <h2>Email Settings</h2>

          <div className="check-group">
            <input type="checkbox" name="" id="" />
            <label htmlFor="">Use Xychros email drafts</label>
          </div>
          <div className="check-group">
            <input type="checkbox" name="" id="" />
            <label htmlFor="">
              Send emails as soon as someone joins using a referral link
            </label>
          </div>
          <div className="check-group">
            <input type="checkbox" name="" id="" />
            <label htmlFor="">Send email from the account email address </label>
          </div>
          <div className="check-group"></div>
        </section>
      </div>

      {/* Email Draft Section */}

      <section>
        <div className="email-section">
          <h2>Email Draft</h2>
          <div>
            <img src={SideLogo} alt="Shop Logo" />
            <textarea
              className="email-textarea"
              rows={9}
              value={defaultEmail}
              onChange={setDefaultEmail}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default SettingComponent;
