import React, { useState, forwardRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { SideLogo } from "../../assets/index";
import { AiOutlineCalendar } from "react-icons/ai";
import { IoIosArrowUp } from "react-icons/io";
import { integratelinks } from "./socialLinks";
import SocialBlock from "./socialsBlocks/SocialBlock";
import { useStateContext } from "../../contexts/ContextProvider";
import "./newcampaign.css";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchCampaignById } from "../../app/features/campaigns/campaignSlice";
import { storeLinks } from "./dummySocial";
// Default Email Settings
const InitialDefaultEmail = `Hi,

Thank you for subscribing to {campaign.name} for the pre-launch of {product.name}. You can now invite your friends and family to join you in collecting more rewards and points by using {reward.link}.

So far, {reward.friends_count} friends have joined using your reward link. You can redeem your points by using the discount code {reward.discount_code} at checkout. 

We are excited to have you on board!

{shop.name}`;

function NewCampaignForm() {
  const { campaignsid } = useParams();
  const campaignById = useSelector((state) =>
    fetchCampaignById(state, +campaignsid)
  );
  let dateStart = new Date(campaignById?.start_date).toLocaleDateString();
  let dateEnd = new Date(campaignById?.end_date).toLocaleDateString();
  const { isEdit, setIsEdit } = useStateContext();
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [selectedStep, setSelectedStep] = useState(1);

  const handleToggle = (i) => {
    setSelectedStep(selectedStep === i ? null : i);
  };

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
    if (isEdit) {
      setIsEdit(false), navigate("/campaigns");
    }
  };
  return (
    <div className="new-campaign-container">
      <nav>
        <h1 className="nav-title">
          {isEdit ? "Edit Campaign" : "New Campaign"}
        </h1>
      </nav>

      {/* Basic Settings Input Form Section  */}
      <section
        className={selectedStep == 1 ? "section-panel open" : "section-panel"}
      >
        <div className="basic-form-settings" onClick={() => handleToggle(1)}>
          <h2 className="newcampaign-form-heading">Basic Settings</h2>
          {/* <button className="openBtn">
            <IoIosArrowUp />
          </button> */}
        </div>
        <div className="campaign-form">
          <form>
            <div className="input-form-groups">
              <div className="form-group">
                <div className="inputfield">
                  <label htmlFor="campaign_name">Campaign Name</label>
                  {isEdit ? (
                    <input
                      type="text"
                      name="campaign_name"
                      id="campaign_name"
                      value={campaignById?.campaign_name}
                      onChange={() => {}}
                    />
                  ) : (
                    <input
                      type="text"
                      name="campaign_name"
                      id="campaign_name"
                    />
                  )}
                </div>

                <div className="inputfield">
                  <label htmlFor="name">Product Link</label>
                  {isEdit ? (
                    <input
                      type="text"
                      name="product_link"
                      id="product_link"
                      value={campaignById?.product_link}
                      onChange={() => {}}
                    />
                  ) : (
                    <input
                      type="text"
                      name="product_link"
                      id="product_link"
                      value={() => {}}
                      onChange={() => {}}
                    />
                  )}
                </div>
              </div>
              <div className="form-group">
                <div className="inputfield">
                  <label htmlFor="name">Start Date</label>

                  {isEdit ? (
                    <DatePicker
                      minDate={new Date()}
                      value={dateStart}
                      showDisabledMonthNavigation
                      customInput={<ExampleCustomInput />}
                      onChange={(date) => setStartDate(date)}
                    />
                  ) : (
                    <DatePicker
                      // minDate={new Date()}
                      showDisabledMonthNavigation
                      customInput={<ExampleCustomInput />}
                      selectedStep={startDate}
                      onChange={(date) => setStartDate(date)}
                    />
                  )}
                </div>

                <div className="inputfield">
                  <label htmlFor="name">End Date</label>
                  {isEdit ? (
                    <DatePicker
                      value={dateEnd}
                      minDate={new Date()}
                      customInput={<ExampleCustomInput />}
                      showDisabledMonthNavigation
                      onChange={(date) => setEndDate(date)}
                    />
                  ) : (
                    <DatePicker
                      value={endDate}
                      minDate={new Date()}
                      customInput={<ExampleCustomInput />}
                      showDisabledMonthNavigation
                      selectedStep={endDate}
                      onChange={(date) => setEndDate(date)}
                    />
                  )}
                </div>
              </div>
            </div>

            <h2 className="sub-heading">Share Store's Social Media Links</h2>
            <div className="store-social-links">
              {storeLinks.map((link) => (
                <div className="social-input-form" key={link.id}>
                  <input className="social-input" type="checkbox" />
                  <span className="store-social-icons">{link.icon}</span>
                  <input
                    className="social-inputfield"
                    type="text"
                    name=""
                    id=""
                  />
                </div>
              ))}
            </div>

            <h2 className="sub-heading">Collect</h2>
            <div className="collect-setup">
              <div className="collect-settings">
                <div>
                  <input className="social-input" type="radio" name="" id="" />
                  <label htmlFor="">Email Addresses and Phone Numbers </label>
                </div>
                <div>
                  <input className="social-input" type="radio" name="" id="" />{" "}
                  <label htmlFor="">Email Addresses only</label>
                </div>
              </div>
              <div>
                <button className="nextBtn">Next</button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Referal Settings */}

      <section
        className={selectedStep == 2 ? "section-panel open" : "section-panel"}
      >
        <div className="referrals-settings" onClick={() => handleToggle(1)}>
          <h2 className="title">Refferal Settings</h2>
          <button className="openBtn">
            <IoIosArrowUp />
          </button>
        </div>

        <div
          className={
            selectedStep == 2
              ? "referral-settings-form open"
              : "referral-settings-form"
          }
        >
          <div className="social-media-section">
            <div className="social-links-container">
              {integratelinks.map((link) => (
                <div className="socialblock" key={link.id}>
                  <SocialBlock link={link} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <button className="nextBtn">Next</button>
        </div>
      </section>

      {/* Reward Settings */}

      <section
        className={selectedStep == 2 ? "section-panel open" : "section-panel"}
      >
        <div className="rewards-settings" onClick={() => handleToggle(1)}>
          <h2 className="title">Reward Settings</h2>
          <button className="openBtn">
            <IoIosArrowUp />
          </button>
        </div>

        <div
          className={
            selectedStep == 2
              ? "reward-settings-form open"
              : "reward-settings-form"
          }
        >
          <p>
            Set up the Rewards for your customers here! Select the discount type
            and then the reward tiers!
          </p>
          <p>
            Note: Discount will not be applicable on Shipping. Each code can be
            used by a customer only once.
          </p>

          <div className="discount-settings">
            <h2 className="sub-heading">Discount</h2>
            <div className="collect-settings">
              <div>
                <input className="social-input" type="radio" name="" id="" />
                <label htmlFor="">% off the entire order</label>
              </div>
              <div>
                <input className="social-input" type="radio" name="" id="" />{" "}
                <label htmlFor="">$ off the entire order</label>
              </div>
            </div>
          </div>
        </div>
        <div>
          <button className="nextBtn">Next</button>
        </div>
      </section>

      {/* Checkbox fields */}

      {/* <div className="check-fields">
        <div className="check-group">
          <input type="checkbox" name="" id="" />
          <label htmlFor="">Enable Sharing reward Link via Social Media</label>
        </div>
        <div className="check-group">
          <input type="checkbox" name="" id="" />
          <label htmlFor=""> OverRide Global Settings</label>
        </div>
      </div> */}

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
              Use all social media channels for sharing reward links{" "}
            </label>
          </div>
          <div className="check-group">
            <input type="checkbox" name="" id="" />
            <label htmlFor="">Reset reward points for every campaign </label>
          </div>
          <div className="check-group">
            <input type="checkbox" name="" id="" />
            <label htmlFor="">1 point per reward </label>
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
              Send emails as soon as someone joins using a reward link
            </label>
          </div>
          <div className="check-group">
            <input type="checkbox" name="" id="" />
            <label htmlFor="">Send email from the account email address </label>
          </div>
          <div className="check-group"></div>
        </section>
      </div>

      <button className="saveFormBtn" onClick={handleClick}>
        {isEdit ? "Update" : "Save"}
      </button>
    </div>
  );
}

export default NewCampaignForm;

{
  /* Email Draft Section */
}

{
  /* <section>
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
      </section> */
}

{
  /* reward Email */
}

{
  /* <section>
        <div className="email-section">
          <h2>reward Email Draft</h2>
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
      </section> */
}

{
  /* Social Settings Integration */
}

{
  /* <div className="integration-container">
        

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
      </div> */
}
