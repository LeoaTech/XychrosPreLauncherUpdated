import React, { useState, forwardRef, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { SideLogo } from "../../assets/index";
import { AiOutlineCalendar } from "react-icons/ai";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { integratelinks } from "./socialLinks";
import SocialBlock from "./socialsBlocks/SocialBlock";
import { useStateContext } from "../../contexts/ContextProvider";
import "./newcampaign.css";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchCampaignById } from "../../app/features/campaigns/campaignSlice";
import { storeLinks } from "./dummySocial";
import { RewardData } from "./rewardTier/RewardData";
import RewardTier from "./rewardTier/RewardTier";
// Default Email Settings
const InitialDefaultEmail = `
Hi,

Thank you for subscribing to {campaign.name} for the pre-launch of {product.name}. You can now invite your friends and family to join you in collecting more rewards and points by using {reward.link}.

So far, {reward.friends_count} friends have joined using your reward link. You can redeem your points by using the discount code {reward.discount_code} at checkout. 

We are excited to have you on board!

{shop.name}`;

const InitialReferralEmail = `

Hi,

Congratulations!! A new referral has signed up at {campaign.name} for the pre-launch of {product.name}. You can now invite more friends and family to join you in collecting more rewards and points by using {referral.link}.

So far, {referral.friends_count} friends have joined using your referral link. 

We are excited to have you on board!

{shop.name}`;

const InitialRewardEmail = `Hi there,

Congratulations!! You have unlocked the Reward Tier {{ reward_tier_number}} at {campaign.name} for the pre-launch of {product.name}. You can invite more friends and family to join you in collecting more rewards and points by using {referral.link}.

So far, {referral.friends_count} friends have joined using your referral link. You can redeem your points by using the discount code {referral.discount_code} at checkout. 

We are super excited to see you winning!!

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
  const [checked, setChecked] = useState(false);
  const handleChecked = () => {
    setChecked(!checked);
  };
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [expanded, setExpanded] = useState(Array(6).fill(false));

  const [newCampaignData, setNewCampaignData] = useState({
    campaign_name: "",
    product_link: "",
    start_date: startDate,
    end_date: endDate,
    store_link: [false, false, false, false, false, false],
    collect_email_number: false,
    collect_email: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCampaignData((prevState) => ({
      ...prevState,
      [name]: value,
      [name]: startDate,
      end_date: endDate,
    }));
  };

  const handleExpand = (index) => {
    setExpanded((prevExpand) =>
      prevExpand.map((state, i) => (i === index ? !state : false))
    );
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

  // Save & Update Campaign Button
  const handleSaveClick = () => {
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
      <section className="newcampaign-section">
        <div
          className={`card ${expanded[0] ? "expanded" : ""}`}
          onClick={() => handleExpand(0)}
        >
          <div className="basic-form-settings">
            <h2 className="title">Basic Settings</h2>
            <span className="openBtn" onClick={() => handleExpand(0)}>
              {expanded[0] ? (
                <IoIosArrowUp onClick={() => handleExpand(0)} />
              ) : (
                <IoIosArrowDown onClick={() => handleExpand(0)} />
              )}
            </span>
          </div>
        </div>
        {expanded[0] && (
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
                        value={newCampaignData.campaign_name}
                        onChange={handleChange}
                      />
                    )}
                  </div>

                  <div className="inputfield">
                    <label htmlFor="product_link">Product Link</label>
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
                        value={newCampaignData.product_link}
                        onChange={handleChange}
                      />
                    )}
                  </div>
                </div>
                <div className="form-group">
                  <div className="inputfield">
                    <label htmlFor="start_date">Start Date</label>

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
                        name="start_date"
                        minDate={new Date()}
                        showDisabledMonthNavigation
                        customInput={<ExampleCustomInput />}
                        selected={startDate}
                        value={startDate}
                        onChange={(date) => setStartDate(date)}
                      />
                    )}
                  </div>

                  <div className="inputfield">
                    <label htmlFor="end_date">End Date</label>
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
                        name="end_date"
                        minDate={new Date()}
                        customInput={<ExampleCustomInput />}
                        showDisabledMonthNavigation
                        selected={endDate}
                        value={endDate}
                        onChange={(date) => setEndDate(date)}
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="store-links">
                <h2 className="sub-heading">
                  Share Store's Social Media Links
                </h2>
                <div className="store-social-links">
                  {storeLinks.map((link) => (
                    <div className="social-input-form" key={link.id}>
                      <input
                        className="social-input"
                        type="checkbox"
                        name="social-link"
                        checked={checked}
                        onChange={handleChecked}
                      />
                      <span className="store-social-icons">{link.icon}</span>
                      <input
                        className="social-inputfield"
                        type="text"
                        name={`store-social-link-${link.id}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="collect-setup">
                  <div className="collect-settings">
                    <h2 className="sub-heading">Collect</h2>

                    <div>
                      <input
                        className="social-input"
                        type="radio"
                        name="collect-email-phone"
                        value={""}
                        id=""
                      />
                      <label htmlFor="">
                        Email Addresses and Phone Numbers{" "}
                      </label>
                    </div>
                    <div>
                      <input
                        className="social-input"
                        type="radio"
                        name=""
                        id=""
                      />{" "}
                      <label htmlFor="">Email Addresses only</label>
                    </div>
                  </div>
                  <div>
                    <button className="nextBtn">Next</button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}
      </section>

      {/* Referal Settings */}

      <section className="newcampaign-section">
        <div
          className={`card ${expanded[1] ? "expanded" : ""}`}
          onClick={() => handleExpand(1)}
        >
          <div className="referrals-settings">
            <h2 className="title">Refferal Settings</h2>
            <span className="openBtn" onClick={() => handleExpand(1)}>
              {expanded[1] ? (
                <IoIosArrowUp onClick={() => handleExpand(1)} />
              ) : (
                <IoIosArrowDown onClick={() => handleExpand(1)} />
              )}
            </span>
          </div>
        </div>

        {expanded[1] && (
          <>
            <div className="referral-settings-form">
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
          </>
        )}
      </section>

      {/* Reward Settings */}

      <section className="newcampaign-section">
        <div
          className={`card ${expanded[2] ? "expanded" : ""}`}
          onClick={() => handleExpand(2)}
        >
          <div className="rewards-settings">
            <h2 className="title">Reward Settings</h2>
            <span className="openBtn" onClick={() => handleExpand(2)}>
              {expanded[2] ? (
                <IoIosArrowUp onClick={() => handleExpand(2)} />
              ) : (
                <IoIosArrowDown onClick={() => handleExpand(2)} />
              )}
            </span>
          </div>
        </div>

        {expanded[2] && (
          <>
            <div className="rewards-settings-form">
              <p>
                Set up the Rewards for your customers here! Select the discount
                type and then the reward tiers!
              </p>
              <p>
                Note: Discount will not be applicable on Shipping. Each code can
                be used by a customer only once.
              </p>

              <div>
                <h2 className="sub-heading">Discount</h2>
                <div className="discount-settings">
                  <div>
                    <input
                      className="social-input"
                      type="radio"
                      name=""
                      id=""
                    />
                    <label htmlFor="">% off the entire order</label>
                  </div>
                  <div>
                    <input
                      className="social-input"
                      type="radio"
                      name=""
                      id=""
                    />{" "}
                    <label htmlFor="">$ off the entire order</label>
                  </div>
                </div>
              </div>

              <div className="rewards-container">
                {RewardData.map((reward) => (
                  <div key={reward.id} className="reward-card">
                    <RewardTier reward={reward} />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <button className="nextBtn" onClick={() => handleExpand(0)}>
                Next
              </button>
            </div>
          </>
        )}
      </section>
      <div>
        <button className="saveFormBtn" onClick={handleSaveClick}>
          {isEdit ? "Update" : "Save"}
        </button>
      </div>
    </div>
  );
}

export default NewCampaignForm;
