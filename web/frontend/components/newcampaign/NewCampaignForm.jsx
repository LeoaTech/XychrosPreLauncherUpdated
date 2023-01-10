import React from "react";
import "./newcampaign.css";
import { Link } from "react-router-dom";

const NewCampaignForm = () => {
  return (
    <div className="new-campaign-container">
      <nav>
        <div></div>
        <h1 className="nav-title">New Campaign</h1>
        <button type="submit" className="save-btn">
          Save
        </button>
      </nav>
      {/* Text Input  Form Section  */}
      <section>
        <div className="campaign-form">
          <form onSubmit={""}>
            <div className="form-group">
              <label htmlFor="name">Campaign Name</label>
              <input type="text" name="title" id="title" />
              <label htmlFor="name">Start Date</label>
              <input type="text" name="" id="" />
            </div>
            <div className="form-group">
              <label htmlFor="name">Product Link</label>
              <input type="text" name="" id="" />
              <label htmlFor="name">End Date</label>
              <input type="text" name="" id="" />
            </div>
            <div>
              <button className="edit-btn">
                Edit Campaign Page in <Link to="/">Shopify Theme Editor</Link>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Checkbox fields */}

      <div className="check-fields">
        <div className="check-group">
          <input type="checkbox" name="" id="" />
          <label htmlFor="">
            Enable Sharing Referral Link via Social Media
          </label>
        </div>
        <div className="check-group">
          <input type="checkbox" name="" id="" />
          <label htmlFor=""> OverRide Global Settings</label>
        </div>
      </div>

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
          <div></div>
        </div>
      </section>
    </div>
  );
};

export default NewCampaignForm;
