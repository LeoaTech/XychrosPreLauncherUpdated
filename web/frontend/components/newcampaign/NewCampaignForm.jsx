import React, { useState, forwardRef } from "react";
import "./newcampaign.css";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { SideLogo } from "../../assets/index";
const InitialDefaultEmail = `Hi,

Thank you for subscribing to {campaign.name} for the pre-launch of {product.name}. You can now invite your friends and family to join you in collecting more rewards and points by using {referral.link}.

So far, {referral.friends_count} friends have joined using your referral link. You can redeem your points by using the discount code {referral.discount_code} at checkout. 

We are excited to have you on board!

{shop.name}`;

function NewCampaignForm() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  // const ExampleCustomInput = forwardRef(({ value, onClick, onChange }, ref) => (
  //   <input
  //     value={value}
  //     className="example-custom-input"
  //     onClick={onClick}
  //     onChange={onChange}
  //     ref={ref}
  //   />
  // ));

  const [defaultEmail, setDefaultEmail] = useState(InitialDefaultEmail);

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
              <DatePicker
                minDate={new Date()}
                showDisabledMonthNavigation
                selected={startDate}
                onChange={(date) => setStartDate(date)}
              />

              {/* <input type="text" name="" id="" value={startDate} onChange={(e) => setStartDate(e.target.value)}/> */}
            </div>
            <div className="form-group">
              <label htmlFor="name">Product Link</label>
              <input type="text" name="" id="" />
              <label htmlFor="name">End Date</label>
              <DatePicker
                value={endDate}
                minDate={new Date()}
                showDisabledMonthNavigation
                selected={endDate}
                onChange={(date) => setEndDate(date)}
              />
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
}

export default NewCampaignForm;
