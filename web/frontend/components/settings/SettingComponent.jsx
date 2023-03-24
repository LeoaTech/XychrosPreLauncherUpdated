import React, { useEffect, useState } from "react";
import { settings, xychrosLogo } from "../../assets";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import "./setting.css";
import { storeLinks } from "../newcampaign/dummySocial";
import { integratelinks } from "../newcampaign/socialLinks";
import { RewardData } from "../newcampaign/rewardTier/RewardData";
import { dummyTeplates } from "./dummyTemplates";
import { useAuthenticatedFetch } from "../../hooks";
import { useSelector } from "react-redux";
import { fetchAllSettings } from "../../app/features/settings/settingsSlice";

const SettingComponent = () => {
  const defaultSettings = useSelector(fetchAllSettings);
  const [settingsData, setSettingsData] = useState();
  const fetch = useAuthenticatedFetch();

  // Get Default Settings Data
  useEffect(() => {
    if (defaultSettings) {
      setSettingsData(defaultSettings);
    }
  }, [defaultSettings]);

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

  // Update Global Settings for the Shop
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("/api/updatesettings", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(settingsData),
    });
  };

  // Handle Form Save Settings

  // Handle Form Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setSettingsData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handling Checkboxes Changes
  function handleCheckboxChange(e) {
    const { name, checked } = e.target;

    setSettingsData({ ...settingsData, [name]: checked });
  }

  function handleRadioChange(event) {
    const { name, value } = event.target;
    // Update the state with the new value
    setSettingsData((prevSettingsData) => ({
      ...prevSettingsData,
      [name]: value === "phone",
      discount_type: value,
    }));
  }

  console.log("Settings", settingsData);

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
                      <div>
                        <div key={storeLink.id} className="social_card">
                          <input
                            className="check_input"
                            type="checkbox"
                            name={`show_${storeLink?.name}`}
                            checked={settingsData[`show_${storeLink?.name}`]}
                            onChange={handleCheckboxChange}
                          />
                          <span className="store-social-icons">
                            {storeLink.icon}
                          </span>
                          <input
                            className="social-text-field"
                            type="text"
                            name={`${storeLink?.name}`}
                            value={settingsData[`${storeLink?.name}`]}
                            onChange={handleChange}
                          />
                        </div>
                        <div>
                          {settingsData[`show_${storeLink?.name}`] === true &&
                            settingsData[`${storeLink?.name}`] === "" && (
                              <p className="error-message">
                                Please Fill the Input field also{" "}
                              </p>
                            )}
                        </div>
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
                        name="collect_phone"
                        value="phone"
                        checked={settingsData?.collect_phone === true}
                        onChange={handleRadioChange}
                      />
                      <label htmlFor="collect_phone">
                        Email Addresses and Phone Numbers{" "}
                      </label>
                    </div>
                    <div className="collect__inputs">
                      <input
                        className="checkbox-input"
                        type="radio"
                        name="collect_phone"
                        value="email"
                        checked={settingsData?.collect_phone === false}
                        onChange={handleRadioChange}
                      />
                      <label htmlFor="collect_phone">
                        Email Addresses Only{" "}
                      </label>
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
                      <div className="social-section">
                        <div className="social-title">
                          <span className="social-icons">{link.icon}</span>
                        </div>

                        <div className="check-input">
                          <input
                            type="checkbox"
                            name={`share_${link.title}_referral`}
                            id={`share_${link.title}_referral`}
                            checked={
                              settingsData[`share_${link.title}_referral`]
                            }
                            onChange={handleCheckboxChange}
                          />
                          <label htmlFor={`share_${link.title}_referral`}>
                            {link.desc}
                          </label>
                        </div>

                        <div className="referral-link-input">
                          <textarea
                            className="referral-input"
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
                      name="discount_type"
                      value="percent"
                      checked={settingsData?.discount_type === "percent"}
                      onChange={handleRadioChange}
                    />
                    <label htmlFor="discount_type">
                      % off the entire order
                    </label>
                  </div>
                  <div className="discounts_input">
                    <input
                      className="social-radioInput"
                      type="radio"
                      name="discount_type"
                      value="amount"
                      checked={settingsData?.discount_type === "amount"}
                      onChange={handleRadioChange}
                    />
                    <label htmlFor="discount_type">
                      $ off the entire order
                    </label>
                  </div>
                </div>

                <div className="rewards-tiers-cardblocks">
                  {RewardData.map((reward) => (
                    <div key={reward.id} className="reward-card">
                      <div classname="reward-tier-card">
                        <div className="reward-title">
                          <h2>{reward.title}</h2>
                          <span>
                            {" "}
                            {reward.is_required === true && "(Required)"}
                          </span>
                        </div>
                        <div className="reward-content">
                          <div className="reward-form">
                            <div className="inputfield">
                              <label htmlFor={`reward_${reward?.id}_tier`}>
                                No of Referrals
                              </label>
                              <input
                                className="small-inputfield"
                                type="number"
                                name={`reward_${reward?.id}_tier`}
                                value={
                                  settingsData[`reward_${reward?.id}_tier`]
                                }
                                onChange={handleChange}
                              />
                            </div>
                            <div className="inputfield">
                              <label htmlFor={`reward_${reward?.id}_discount`}>
                                Discount
                              </label>
                              <input
                                className="small-inputfield"
                                type="number"
                                name={`reward_${reward?.id}_discount`}
                                value={
                                  settingsData[`reward_${reward?.id}_discount`]
                                }
                                onChange={handleChange}
                              />
                            </div>
                            <div className="inputfield">
                              <label htmlFor={`reward_${reward?.id}_code`}>
                                Discount Code
                              </label>
                              <input
                                className="large-field"
                                type="text"
                                name={`reward_${reward?.id}_code`}
                                value={
                                  settingsData[`reward_${reward?.id}_code`]
                                }
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
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
                        src={xychrosLogo}
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
                </section>
                <section>
                  <div className="email-section">
                    <h2>
                      Welcome Email Draft - This email is sent when a customer
                      signs up{" "}
                    </h2>
                    <div className="email-content">
                      <img
                        src={xychrosLogo}
                        alt="Shop Logo"
                        className="shop-logo"
                      />

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
                <section>
                  <div className="email-section">
                    <h2>
                      Referral Email Draft - This email is sent when a referral
                      signs up{" "}
                    </h2>
                    <div className="email-content">
                      <img
                        src={xychrosLogo}
                        alt="Shop Logo"
                        className="shop-logo"
                      />
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
                <section>
                  <div className="email-section">
                    <h2>
                      Reward Tier Email Draft - This email is sent when a reward
                      tier is unlocked
                    </h2>
                    <div className="email-content">
                      <img
                        src={xychrosLogo}
                        alt="Shop Logo"
                        className="shop-logo"
                      />
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
                  <IoIosArrowUp
                    style={{ strokeWidth: "70", fill: "#fff" }}
                    onClick={() => handleExpand(4)}
                  />
                ) : (
                  <IoIosArrowDown
                    style={{ strokeWidth: "70", fill: "#fff" }}
                    onClick={() => handleExpand(4)}
                  />
                )}
              </span>
            </div>
          </div>
          {currentExpanded[4] && (
            <>
              <div className="integrations-container">
                <div className="integarte__input">
                  <div className="check-input">
                    <input
                      type="checkbox"
                      name="klaviyo_Integration"
                      id="klaviyo_Integration"
                      checked={settingsData?.klaviyo_Integration}
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor="klaviyo_Integration">
                      Integrate with Klaviyo
                    </label>
                  </div>
                </div>

                <div className="integrate-api-input">
                  <div className="inputfield">
                    <label htmlFor="klaviyo_api_key">
                      Private API Key - You can find the Private API Key in your
                      <a href="https://www.klaviyo.com/login" target="_blank">
                        {" "}
                        Klaviyo Account Settings
                      </a>
                    </label>
                    <input
                      type="text"
                      name="klaviyo_api_key"
                      id="klaviyo_api_key"
                      placeholder="Enter API Key"
                      value={settingsData?.klaviyo_api_key}
                      onChange={handleChange}
                    />
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
                  <IoIosArrowUp
                    style={{ strokeWidth: "70", fill: "#fff" }}
                    onClick={() => handleExpand(5)}
                  />
                ) : (
                  <IoIosArrowDown
                    style={{ strokeWidth: "70", fill: "#fff" }}
                    onClick={() => handleExpand(5)}
                  />
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
                        <input
                          type="checkbox"
                          name="templates"
                          checked={settingsData?.templates}
                          onChange={
                            handleCheckboxChange

                            // (e) => {
                            // if (e.target.checked) {
                            //   // concatenate the template name with comma separator
                            //   template += `${template.name}, `;
                            // } else {
                            //   // remove the template name from the string
                            //   template = template.replace(
                            //     `${template.name}, `,
                            //     " "
                            //   );

                            // }
                            // }
                          }
                        />
                        <label htmlFor="templates">{template.name}</label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </section>

        <div className="settings-savebtn">
          <button className="saveSettingsbtn" type="submit">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingComponent;
