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
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [defaultEmail, setDefaultEmail] = useState(InitialDefaultEmail);
  const [referralEmail, setReferralEmail] = useState(InitialReferralEmail);
  const [rewardEmail, setRewardEmail] = useState(InitialRewardEmail);

  const [expanded, setExpanded] = useState(Array(6).fill(false));
  const [formStep, setFormStep] = useState([0, 1, 2, 3, 4, 5]);
  const [newCampaignData, setNewCampaignData] = useState({
    campaign_name: "",
    product_link: "",
    start_date: startDate,
    end_date: endDate,
    store_link: [],
    collect_all: null,
    collect_email: null,
    referral_links: [],
  });

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

  // Render Next Button on each form

  const renderButton = (id) => {
    return (
      <button className="nextBtn" onClick={() => handleNext(id)}>
        Next
      </button>
    );
  };

  // Handle State change events

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "collect_all" || name === "collect_email") {
      setNewCampaignData({
        ...newCampaignData,
        collect_all: name === "collect_all" ? value : "",
        collect_email: name === "collect_email" ? value : "",
      });
    } else {
      setNewCampaignData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  // Handle Card Expands and Collapse Events
  const handleExpand = (index) => {
    setExpanded((prevExpand) =>
      prevExpand.map((state, i) => (i === index ? !state : false))
    );
  };

  // Handle Next Button event for each
  const handleNext = (index) => {
    setExpanded((prevExpand) =>
      prevExpand.map((state, i) => (i === index ? !state : false))
    );
  };
  // Save  New Campaign form  & Update Campaign Form
  const handleSaveClick = (e) => {
    e.preventDefault();
    if (isEdit) {
      setIsEdit(false), navigate("/campaigns");
    } else {
      console.log("Basic form settings", newCampaignData);
    }
  };

  // HandleCheckbox events in the basic form settings

  function handleCheckboxChange(linkId, isChecked) {
    if (isChecked) {
      setNewCampaignData((prevState) => ({
        ...prevState,
        store_link: [...newCampaignData.store_link, linkId],
      }));
    } else {
      setNewCampaignData((prevState) => ({
        ...prevState,
        store_link: [newCampaignData?.store_link.filter((id) => id !== linkId)],
      }));
    }
  }

  return (
    <div className="new-campaign-container">
      <nav>
        <h1 className="nav-title">
          {isEdit ? "Edit Campaign" : "New Campaign"}
        </h1>
      </nav>
      <form onSubmit={handleSaveClick}>
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
                        shouldCloseOnSelect={true}
                        onChange={(date) => setStartDate(date)}
                      />
                    ) : (
                      <DatePicker
                        name="start_date"
                        minDate={new Date()}
                        showDisabledMonthNavigation
                        customInput={<ExampleCustomInput />}
                        shouldCloseOnSelect={true}
                        selected={newCampaignData.start_date}
                        value={newCampaignData.start_date}
                        onChange={(date) =>
                          setNewCampaignData({
                            ...newCampaignData,
                            ["start_date"]: date,
                          })
                        }
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
                        shouldCloseOnSelect={true}
                        onChange={(date) => setEndDate(date)}
                      />
                    ) : (
                      <DatePicker
                        name="end_date"
                        minDate={new Date()}
                        customInput={<ExampleCustomInput />}
                        showDisabledMonthNavigation
                        shouldCloseOnSelect={true}
                        selected={newCampaignData.end_date}
                        value={newCampaignData.end_date}
                        onChange={(date) =>
                          setNewCampaignData({
                            ...newCampaignData,
                            ["end_date"]: date,
                          })
                        }
                      />
                    )}
                  </div>
                </div>
              </div>
              {/* Store's Social Links */}
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
                        name={`store_link[${link?.id}]`}
                        checked={newCampaignData.store_link.includes(link.id)}
                        onChange={(e) =>
                          handleCheckboxChange(link.id, e.target.checked)
                        }
                      />
                      <span className="store-social-icons">{link.icon}</span>
                      <input
                        className="social-inputfield"
                        type="text"
                        name={`store_link[${link?.id}]`}
                        value={`www.sociallink.com/store-link`}
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
                        className="checkbox-input"
                        type="radio"
                        name="collect_all"
                        value="email_number"
                        checked={newCampaignData.collect_all === "email_number"}
                        onChange={handleChange}
                      />
                      <label htmlFor="">
                        Email Addresses and Phone Numbers{" "}
                      </label>
                    </div>
                    <div>
                      <input
                        className="checkbox-input"
                        type="radio"
                        name="collect_email"
                        value="email"
                        checked={newCampaignData.collect_email === "email"}
                        onChange={handleChange}
                      />{" "}
                      <label htmlFor="">Email Addresses only</label>
                    </div>
                  </div>
                  <div>{renderButton(1)}</div>
                </div>
              </div>
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
                <div className="referral-container">
                  <p>
                    Select the Social Media channels that you want to allow your
                    customers to share their referral link with! You can also
                    customise the message that you would want your customers to
                    share!
                  </p>
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

                <div>{renderButton(2)}</div>
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
                <div className="reward-container">
                  <p>
                    Set up the Rewards for your customers here! Select the
                    discount type and then the reward tiers!
                  </p>
                  <p>
                    Note: Discount will not be applicable on Shipping. Each code
                    can be used by a customer only once.
                  </p>
                  <div className="rewards-settings-container">
                    <h2 className="sub-heading">Discount</h2>
                    <div className="discount-settings">
                      <div>
                        <input
                          className="social-radioInput"
                          type="radio"
                          name=""
                          id=""
                        />
                        <label htmlFor="">% off the entire order</label>
                      </div>
                      <div>
                        <input
                          className="social-radioInput"
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
                <div className="reward-section">
                  <div></div>
                  <div>{renderButton(3)}</div>
                </div>
              </div>
            </>
          )}
        </section>

        <div>
          <button className="saveFormBtn" type="submit">
            {isEdit ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewCampaignForm;
