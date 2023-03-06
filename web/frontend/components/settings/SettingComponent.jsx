import React, { useState } from "react";
import { SideLogo } from "../../assets";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

import "./setting.css";
import { storeLinks } from "../newcampaign/dummySocial";
import { integratelinks } from "../newcampaign/socialLinks";
import SocialBlock from "../newcampaign/socialsBlocks/SocialBlock";
import { RewardData } from "../newcampaign/rewardTier/RewardData";
import RewardTier from "../newcampaign/rewardTier/RewardTier";
import { Link } from "react-router-dom";
import { dummyTeplates } from "./dummyTemplates";

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
const SettingComponent = () => {
  const [defaultEmail, setDefaultEmail] = useState(InitialDefaultEmail);
  const [referralEmail, setReferralEmail] = useState(InitialReferralEmail);
  const [rewardEmail, setRewardEmail] = useState(InitialRewardEmail);
  const [currentExpanded, setCurrentExpanded] = useState(Array(6).fill(false));

  // Next Button
  const renderButton = (id) => {
    return (
      <button className="next-button" onClick={() => handleNext(id)}>
        Next
      </button>
    );
  };

  // Handle Card Toggle Events
  const handleExpand = (index) => {
    setCurrentExpanded((prevExpand) =>
      prevExpand.map((state, i) => (i === index ? !state : false))
    );
  };

  // Handle Next Button event for each
  const handleNext = (index) => {
    setCurrentExpanded((prevExpand) =>
      prevExpand.map((state, i) => (i === index ? !state : false))
    );
  };

  // Handle Form Save Settings
  const handleSubmit = () => {};

  // Handle Form Input Changes
  const handleonChange = () => {};
  return (
    <div className="settings-container">
      <div className="settings-heading">
        <h1>Global Settings</h1>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Basic Settings Section */}
        <section className="global-settings">
          <div className="basic-settings" onClick={() => handleExpand(0)}>
            <div className="main-heading">
              <h2 className="main-title">Basic Settings</h2>
              <span className="toggle-card-btn" onClick={() => handleExpand(0)}>
                {currentExpanded[0] ? (
                  <IoIosArrowUp
                    style={{ strokeWidth: "70", fill: "#fff" }}
                    onClick={() => handleExpand(0)}
                  />
                ) : (
                  <IoIosArrowDown
                    style={{ strokeWidth: "70", fill: "#fff" }}
                    onClick={() => handleExpand(0)}
                  />
                )}
              </span>
            </div>
          </div>

          {currentExpanded[0] && (
            <>
              <div className="basic-settings-container">
                <div className="store__links">
                  <div className="sub-title">
                    <h2> Share Store's Social Media Links</h2>
                  </div>
                  <div className="stores__social_links">
                    {storeLinks.map((storeLink) => (
                      <div key={storeLink.id} className="social_card">
                        <input
                          className="check_input"
                          type="checkbox"
                          name=""
                        />
                        <span className="store-social-icons">
                          {storeLink.icon}
                        </span>
                        <input
                          className="social-text-field"
                          type="text"
                          name={"anyaname"}
                          value={`www.sociallink.com/store-link`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="collect__container">
                  <div className="sub-title">
                    <h2>Collect</h2>
                    <div className="collect__inputs">
                      <input
                        className="checkbox-input"
                        type="radio"
                        name="collect_all"
                        value="email_number"
                      />
                      <label htmlFor="">
                        Email Addresses and Phone Numbers{" "}
                      </label>
                    </div>
                    <div className="collect__inputs">
                      <input
                        className="checkbox-input"
                        type="radio"
                        name="collect_emaill"
                        value="email"
                      />
                      <label htmlFor="">Email Addresses Only </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="toggle-next-btn">{renderButton(1)}</div>
            </>
          )}
        </section>

        {/* Referral Settings Section */}

        <section className="global-settings">
          <div className="referral-settings" onClick={() => handleExpand(1)}>
            <div className="main-heading">
              <h2 className="main-title">Referral Settings</h2>
              <span className="toggle-card-btn" onClick={() => handleExpand(1)}>
                {currentExpanded[1] ? (
                  <IoIosArrowUp
                    style={{ strokeWidth: "70", fill: "#fff" }}
                    onClick={() => handleExpand(1)}
                  />
                ) : (
                  <IoIosArrowDown
                    style={{ strokeWidth: "70", fill: "#fff" }}
                    onClick={() => handleExpand(1)}
                  />
                )}
              </span>
            </div>
          </div>
          {currentExpanded[1] && (
            <>
              <div className="referral-settings-container">
                <div className="subheading">
                  <p>
                    Select the Social Media channels that you want to allow your
                    customers to share their referral link with! You can also
                    customise the message that you would want your customers to
                    share!
                  </p>
                </div>

                <div className="referrals-cards-block">
                  {integratelinks.map((link) => (
                    <div className="social_block" key={link.id}>
                      <SocialBlock link={link} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="toggle-next-btn">{renderButton(2)}</div>
            </>
          )}
        </section>

        {/* Rewards Settings Section */}
        <section className="global-settings">
          <div className="reward-settings" onClick={() => handleExpand(2)}>
            <div className="main-heading">
              <h2 className="main-title">Rewards Settings</h2>
              <span className="toggle-card-btn" onClick={() => handleExpand(2)}>
                {currentExpanded[2] ? (
                  <IoIosArrowUp
                    style={{ strokeWidth: "70", fill: "#fff" }}
                    onClick={() => handleExpand(2)}
                  />
                ) : (
                  <IoIosArrowDown
                    style={{ strokeWidth: "70", fill: "#fff" }}
                    onClick={() => handleExpand(2)}
                  />
                )}
              </span>
            </div>
          </div>
          {currentExpanded[2] && (
            <>
              <div className="reward-setting-container">
                <div className="subheading">
                  <p>
                    Set up the Rewards for your customers here! Select the
                    discount type and then the reward tiers!
                  </p>
                  <p>
                    {" "}
                    Note: Discount will not be applicable on Shipping. Each code
                    can be used by a customer only once.
                  </p>
                </div>

                <div className="discount-card-block">
                  <div className="sub-title">
                    <h2>Discount</h2>
                  </div>

                  <div className="discounts_input">
                    <input
                      className="social-radioInput"
                      type="radio"
                      name=""
                      id=""
                    />
                    <label htmlFor="">% off the entire order</label>
                  </div>
                  <div className="discounts_input">
                    <input
                      className="social-radioInput"
                      type="radio"
                      name=""
                      id=""
                    />
                    <label htmlFor="">$ off the entire order</label>
                  </div>
                </div>

                <div className="rewards-tiers-cardblocks">
                  {RewardData.map((reward) => (
                    <div key={reward.id} className="reward-card">
                      <RewardTier reward={reward} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="toggle-next-btn">{renderButton(3)}</div>
            </>
          )}
        </section>

        {/* Email Settings Section */}
        <section className="global-settings">
          <div
            className="email-drafts-settings"
            onClick={() => handleExpand(3)}
          >
            <div className="main-heading">
              <h2 className="main-title">Emails Settings</h2>
              <span className="toggle-card-btn" onClick={() => handleExpand(3)}>
                {currentExpanded[3] ? (
                  <IoIosArrowUp
                    style={{ strokeWidth: "70", fill: "#fff" }}
                    onClick={() => handleExpand(3)}
                  />
                ) : (
                  <IoIosArrowDown
                    style={{ strokeWidth: "70", fill: "#fff" }}
                    onClick={() => handleExpand(3)}
                  />
                )}
              </span>
            </div>
          </div>
          {currentExpanded[3] && (
            <>
              <div className="email-container">
                <div className="email-optCheck">
                  <input className="checkbox-input" type="checkbox" />
                  <label htmlFor="">
                    Enable Double Opt in for new sign-ups (This feature requires
                    Professional Plan or above)
                  </label>
                </div>
                <section>
                  <div className="email-section">
                    <h2>
                      Welcome Email Draft - This email is sent when a customer
                      signs up{" "}
                    </h2>
                    <div className="email-content">
                      {/* <img src={SideLogo} alt="Shop Logo" /> */}

                      <textarea
                        className="email-textinput"
                        rows={9}
                        value={defaultEmail}
                        onChange={setDefaultEmail}
                      />
                    </div>
                  </div>
                </section>
                <section>
                  <div className="email-section">
                    <h2>
                      Referral Email Draft - This email is sent when a referral
                      signs up{" "}
                    </h2>
                    <div className="email-content">
                      {/* <img src={SideLogo} alt="Shop Logo" /> */}
                      <textarea
                        className="email-textinput"
                        rows={9}
                        value={referralEmail}
                        onChange={setReferralEmail}
                      />
                    </div>
                  </div>
                </section>
                <section>
                  <div className="email-section">
                    <h2>
                      Reward Tier Email Draft - This email is sent when a reward
                      tier is unlocked
                    </h2>
                    <div className="email-content">
                      {/* <img src={SideLogo} alt="Shop Logo" /> */}
                      <textarea
                        className="email-textinput"
                        rows={9}
                        value={rewardEmail}
                        onChange={setRewardEmail}
                      />
                    </div>
                  </div>
                </section>
              </div>
              <div className="toggle-next-btn">{renderButton(4)}</div>
            </>
          )}
        </section>


          {/* Integrations Settings */}

          <section className="global-settings">
          <div
            className="integration--settings"
            onClick={() => handleExpand(4)}
          >
            <div className="main-heading">
              <h2 className="main-title">Integrations Settings</h2>
              <span className="toggle-card-btn" onClick={() => handleExpand(4)}>
                {currentExpanded[4] ? (
                  <IoIosArrowUp style={{strokeWidth: "70", fill:"#fff"}} onClick={() => handleExpand(4)} />
                ) : (
                  <IoIosArrowDown style={{strokeWidth: "70", fill:"#fff"}} onClick={() => handleExpand(4)} />
                )}
              </span>
            </div>
          </div>
          {currentExpanded[4] && (
            <>
              <div className="integrations-container">
                <div className="integarte__input">
                  <div className="check-input">
                    <input type="checkbox" name="" id="" />
                    <label htmlFor="">Integrate with Klaviyo</label>
                  </div>
                </div>

                <div className="integrate-api-input">
                  <div className="inputfield">
                    <label htmlFor="">
                      Private API Key - You can find the Private API Key in your
                      <Link to="https://www.klaviyo.com/login">
                        {" "}
                        Klaviyo Account Settings
                      </Link>
                    </label>
                    <input type="text" name="private-key" id="private-key" />
                  </div>
                </div>
              </div>
              <div className="toggle-next-btn">{renderButton(5)}</div>
            </>
          )}
        </section>

         {/* Template Settings */}

         <section className="global-settings">
          <div className="templates-settings" onClick={() => handleExpand(5)}>
            <div className="main-heading">
              <h2 className="main-title">Templates Settings</h2>
              <span className="toggle-card-btn" onClick={() => handleExpand(5)}>
                {currentExpanded[5] ? (
                  <IoIosArrowUp style={{strokeWidth: "70", fill:"#fff"}} onClick={() => handleExpand(5)} />
                ) : (
                  <IoIosArrowDown style={{strokeWidth: "70", fill:"#fff"}} onClick={() => handleExpand(5)} />
                )}
              </span>
            </div>
          </div>
          {currentExpanded[5] && (
            <>
              <div className="templates-container">
                <div className="subheading">
                  <p>Select all that best descibe your product(s) </p>
                </div>

                <div className="templates-blocks-container">
                  {dummyTeplates.map((template) => (
                    <div key={template.id} className="template-block">
                      <div className="check-input">
                        <input type="checkbox" name="" id="" />
                        <label htmlFor="">{template.name}</label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </section>
      </form>

      <div className="settings-savebtn">
        <button className="saveSettingsbtn" type="submit">
          Save
        </button>
      </div>
    </div>
  );
};

export default SettingComponent;
