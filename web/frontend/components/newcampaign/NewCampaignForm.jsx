import React, { useState, forwardRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { SideLogo } from "../../assets/index";
import { AiOutlineCalendar } from "react-icons/ai";
import { integratelinks } from "./socialLinks";
import SocialBlock from "./socialsBlocks/SocialBlock";
import { useStateContext } from "../../contexts/ContextProvider";
import "./newcampaign.css";


// Default Email Settings
const InitialDefaultEmail = `Hi,

Thank you for subscribing to {campaign.name} for the pre-launch of {product.name}. You can now invite your friends and family to join you in collecting more rewards and points by using {referral.link}.

So far, {referral.friends_count} friends have joined using your referral link. You can redeem your points by using the discount code {referral.discount_code} at checkout. 

We are excited to have you on board!

{shop.name}`;




function NewCampaignForm() {
  const { isEdit, setIsEdit } = useStateContext();
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const ExampleCustomInput = forwardRef(({ value, onClick, onChange }, ref) => (
    <div className="wrapper">
      <div className="icon">
        <AiOutlineCalendar
          style={{ height: "20px", width: "20px" }}
          onClick={onClick}
        />
      </div>
      <input
        value={value}
        className="example-custom-input"
        onChange={onChange}
        ref={ref}
      ></input>
    </div>
  ));

  const [defaultEmail, setDefaultEmail] = useState(InitialDefaultEmail);

  
  // Save & Update Campaign Button
  const handleClick = () => {
    setIsEdit(false), navigate("/campaigns");
  };
  return (
    <div className="new-campaign-container">
      <nav>
        <div></div>
        <h1 className="nav-title">
          {isEdit ? "Edit Campaign" : "New Campaign"}
        </h1>
        <button className="save-btn" onClick={handleClick}>
          {isEdit ? "Update" : "Save"}
        </button>
      </nav>
      {/* Text Input  Form Section  */}
      <section>
        <div className="campaign-form">
          <form>
            <div className="form-group">
              <label htmlFor="name">Campaign Name</label>
              <input type="text" name="title" id="title" />
              <label htmlFor="name">Start Date</label>
              <DatePicker
                minDate={new Date()}
                showDisabledMonthNavigation
                customInput={<ExampleCustomInput />}
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
                customInput={<ExampleCustomInput />}
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
          <h2>Welcome Email Draft</h2>
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

      {/* Referral Email */}

      <section>
        <div className="email-section">
          <h2>Referral Email Draft</h2>
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

      {/* Social Settings Integration */}

      <div className="integration-container">
        {/* Navbar */}
        {/* <div className="nav">
          <div className="navtitle">
            <h1>Klaviyo Integration</h1>
            <div className="check-input">
              <input type="checkbox" name="" id="" />
              <label htmlFor="">Integrate with Klaviyo</label>
            </div>
          </div>
          <button type="submit" className="saveBtn">
            Save
          </button>
        </div> */}

        <div className="social-media-section">
          <h1>Social Media Integration</h1>

          <div className="social-links-container">
            {integratelinks.map((link) => (
              <div className="socialblock" key={link.id}>
                <SocialBlock link={link} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewCampaignForm;
