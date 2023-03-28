import React, { useState, forwardRef, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { anime, xychrosLogo } from "../../assets/index";
import { AiOutlineCalendar } from "react-icons/ai";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { integratelinks } from "./socialLinks";
import { useStateContext } from "../../contexts/ContextProvider";
import "./newcampaign.css";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import "./socialsBlocks/social.css";
import "./rewardTier/RewardTier.css";
import {
  fetchCampaign,
  fetchCampaignById,
  fetchCampaignByName,
} from "../../app/features/campaigns/campaignSlice";
import { storeLinks } from "./dummySocial";
import { RewardData } from "./rewardTier/RewardData";
import { useAppQuery, useAuthenticatedFetch } from "../../hooks";
import { fetchAllSettings } from "../../app/features/settings/settingsSlice";
import { fetchAllProducts } from "../../app/features/productSlice";

function EditCampaignForm() {
  const { isEdit, setIsEdit, setUpdatedCampaigns,getProducts } = useStateContext();
  console.log(isEdit);
  const { campaignsid } = useParams();
  const campaignById = useSelector((state) =>
    fetchCampaignById(state, +campaignsid)
  );
  const campaignName = useSelector(fetchCampaignByName);
  const globalSettings = useSelector(fetchAllSettings);
  const productsData = useSelector(fetchAllProducts);
  const [editCampaignData, setEditCampaignData] = useState({});

  useEffect(() => {
    if (campaignById) {
      setEditCampaignData(campaignById);
    }

    if (globalSettings && productsData) {
      console.log("render");
    }
  }, [globalSettings, productsData]);

  const fetch = useAuthenticatedFetch();

  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState(false);
  const [expanded, setExpanded] = useState(Array(6).fill(false));

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

  // Handle Card Expands and Collapse Events
  const handleExpand = (index) => {
    setExpanded((prevExpand) =>
      prevExpand.map((state, i) => (i === index ? !state : false))
    );
  };

  // Handle Next Button event for each
  const handleNext = (index) => {
    const loadingOverlay = document.getElementById("loading-overlay");
    if (index === 1 && editCampaignData?.name !== "") {
      if (campaignName.includes(editCampaignData?.name)) {
        setErrorMsg(true);
        setExpanded((prevExpand) =>
          prevExpand.map((state, i) => i === index - 1 && true)
        );
      } else {
        setErrorMsg(false);
        setExpanded((prevExpand) =>
          prevExpand.map((state, i) => (i === index ? !state : false))
        );
      }
    } else if (index === 5) {
      loadingOverlay.style.display = "block";

      setTimeout(function () {
        // Hide loading overlay and proceed to next step
        loadingOverlay.style.display = "none";
        // Add code here to proceed to next step

        setExpanded((prevExpand) =>
          prevExpand.map((state, i) => (i === index ? !state : false))
        );
      }, 4000);
    } else {
      setExpanded((prevExpand) =>
        prevExpand.map((state, i) => (i === index ? !state : false))
      );
    }
  };

  // Handle State change events

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (isEdit) {
      setEditCampaignData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  // Save  New Campaign form  & Update Campaign Form
  const handleSaveClick = async (e) => {
    e.preventDefault();

    // Editing Camapign Form
    if (isEdit) {
      await fetch(`/api/campaignsettings/${campaignsid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editCampaignData),
      })
        .then((res) => res.json())
        .then((data) => setUpdatedCampaigns((prev) => [...prev, data]))
        .catch((err) => console.log(err));
      setIsEdit(false);
      navigate("/campaigns", { replace: true });
    }
  };

  // HandleCheckbox events in the basic form settings

  function handleCheckboxChange(e) {
    const { name, checked } = e.target;

    if (isEdit) {
      setEditCampaignData({ ...editCampaignData, [name]: checked });
    }
  }

  // Handle Radio button Change events

  function handleRadioChange(event) {
    const { name, value } = event.target;
    // Update the state with the new value
    if (isEdit) {
      setEditCampaignData((prevcampaignData) => ({
        ...prevcampaignData,
        [name]: value === "phone",
        discount_type: value,
      }));
    }
  }
  console.log(editCampaignData, "Edit campaign form");

  return (
    <div className="new-campaign-container">
      <div className="newcampaign-title">
        <h1> Edit Campaign </h1>
      </div>
      <form onSubmit={handleSaveClick}>
        {/* Basic Settings Input Form Section  */}
        <section className="newcampaign-settings">
          <div className="basic-form-settings" onClick={() => handleExpand(0)}>
            <div className="card-header">
              <h2 className="card-title">Basic Settings</h2>
              <span className="toggle-btn" onClick={() => handleExpand(0)}>
                {expanded[0] ? (
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
          {expanded[0] && (
            <>
              <div className="campaign-form">
                <div className="input-form-groups">
                  <div className="form-group">
                    <div className="inputfield">
                      <label htmlFor="name">Campaign Name</label>
                      {isEdit && (
                        <>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            value={editCampaignData?.name}
                            onChange={handleChange}
                          />{" "}
                          {errorMsg && (
                            <p className="error-message">
                              "Campaign Name already Exists"
                            </p>
                          )}
                        </>
                      )}
                    </div>

                    <div className="inputfield">
                      <label htmlFor="product_link">Product Link</label>
                      {isEdit && (
                        <div className="select-products">
                          <select
                            name="product"
                            id="product"
                            value={editCampaignData?.product}
                            onChange={handleChange}
                          >
                            {" "}
                            <option>Select</option>;
                            {productsData?.map((item) => {
                              return (
                                <option value={item.title}>{item.title}</option>
                              );
                            })}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="inputfield">
                      <label htmlFor="start_date">Start Date</label>

                      {isEdit && (
                        <DatePicker
                          minDate={new Date()}
                          showDisabledMonthNavigation
                          customInput={<ExampleCustomInput />}
                          shouldCloseOnSelect={true}
                          selected={
                            editCampaignData?.start_date
                              ? new Date(editCampaignData.start_date)
                              : null
                          }
                          value={
                            editCampaignData?.start_date
                              ? new Date(editCampaignData.start_date)
                              : null
                          }
                          onChange={(date) =>
                            setEditCampaignData((prev) => ({
                              ...prev,
                              ["start_date"]: date,
                            }))
                          }
                        />
                      )}
                    </div>

                    <div className="inputfield">
                      <label htmlFor="end_date">End Date</label>
                      {isEdit && (
                        <DatePicker
                          minDate={new Date()}
                          customInput={<ExampleCustomInput />}
                          showDisabledMonthNavigation
                          shouldCloseOnSelect={true}
                          selected={
                            editCampaignData?.end_date
                              ? new Date(editCampaignData.end_date)
                              : null
                          }
                          value={
                            editCampaignData?.end_date
                              ? new Date(editCampaignData.end_date)
                              : null
                          }
                          onChange={(date) =>
                            setEditCampaignData((prev) => ({
                              ...prev,
                              ["end_date"]: date,
                            }))
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
                        {isEdit && (
                          <input
                            className="social-input"
                            type="checkbox"
                            name={`show_${link?.name}`}
                            checked={editCampaignData[`show_${link?.name}`]}
                            onChange={handleCheckboxChange}
                          />
                        )}
                        <span className="store-social-icons">{link.icon}</span>
                        {isEdit && (
                          <input
                            className="social-inputfield"
                            type="text"
                            name={`${link?.name}`}
                            value={editCampaignData[`${link?.name}`]}
                            onChange={handleChange}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="collect-setup">
                  <div className="collect-settings">
                    <h2 className="sub-heading">Collect</h2>

                    <div>
                      {isEdit && (
                        <input
                          className="checkbox-input"
                          type="radio"
                          name="collect_phone"
                          value="phone"
                          checked={editCampaignData?.collect_phone === true}
                          onChange={handleRadioChange}
                        />
                      )}
                      <label htmlFor="collect_phone">
                        Email Addresses and Phone Numbers{" "}
                      </label>
                    </div>
                    <div>
                      {isEdit && (
                        <input
                          className="checkbox-input"
                          type="radio"
                          name="collect_phone"
                          value="email"
                          checked={editCampaignData?.collect_phone === false}
                          onChange={handleRadioChange}
                        />
                      )}
                      <label htmlFor="collect_phone">
                        Email Addresses only
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="next-btn-toggle">{renderButton(1)}</div>
            </>
          )}
        </section>

        {/* Referal Settings */}
        <section className="newcampaign-settings">
          <div className="referrals-settings" onClick={() => handleExpand(1)}>
            <div className="card-header">
              <h2 className="card-title">Referral Settings</h2>
              <span className="toggle-btn" onClick={() => handleExpand(1)}>
                {expanded[1] ? (
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

          {expanded[1] && (
            <>
              <div className="referral-settings-form">
                <div className="referral-container">
                  <p>
                    Select the Social Media channels that you want to allow your
                    customers to share their referral link with!
                    <br /> You can also customise the message that you would
                    want your customers to share!
                  </p>
                </div>
                <div className="social-links-container">
                  {integratelinks.map((link) => (
                    <div className="social_block" key={link.id}>
                      <div className="social-section">
                        <div className="social-title">
                          <span className="social-icons">{link.icon}</span>
                        </div>

                        <div className="check-input">
                          {isEdit && (
                            <input
                              type="checkbox"
                              name={`share_${link?.title}_referral`}
                              id={`share_${link.title}_referral`}
                              checked={
                                editCampaignData[`share_${link.title}_referral`]
                              }
                              onChange={handleCheckboxChange}
                            />
                          )}{" "}
                          <label htmlFor="">{link.desc}</label>
                        </div>

                        <div className="referral-link-input">
                          {isEdit && (
                            <textarea
                              className="referral-input"
                              rows={4}
                              value={
                                editCampaignData[`share_${link?.title}_message`]
                              }
                              onChange={handleChange}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="referral-nextbtn">{renderButton(2)}</div>
            </>
          )}
        </section>

        {/* Reward Settings */}

        <section className="newcampaign-settings">
          <div className="rewards-settings" onClick={() => handleExpand(2)}>
            <div className="card-header">
              <h2 className="card-title">Reward Settings</h2>
              <span className="toggle-btn" onClick={() => handleExpand(2)}>
                {expanded[2] ? (
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

          {expanded[2] && (
            <>
              <div className="rewards-settings-form">
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
                      {isEdit && (
                        <input
                          className="social-radioInput"
                          type="radio"
                          name="discount_type"
                          value="percent"
                          checked={
                            editCampaignData?.discount_type === "percent"
                          }
                          onChange={handleRadioChange}
                        />
                      )}
                      <label htmlFor="">% off the entire order</label>
                    </div>
                    <div>
                      {isEdit && (
                        <input
                          className="social-radioInput"
                          type="radio"
                          name="discount_type"
                          value="amount"
                          checked={editCampaignData?.discount_type === "amount"}
                          onChange={handleRadioChange}
                        />
                      )}{" "}
                      <label htmlFor="">$ off the entire order</label>
                    </div>
                  </div>
                </div>

                <div className="rewards-container">
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
                              {isEdit && (
                                <input
                                  className="small-inputfield"
                                  type="number"
                                  name={`reward_${reward?.id}_tier`}
                                  value={
                                    editCampaignData[
                                      `reward_${reward?.id}_tier`
                                    ]
                                  }
                                  onChange={handleChange}
                                />
                              )}
                            </div>
                            <div className="inputfield">
                              <label htmlFor={`reward_${reward?.id}_discount`}>
                                Discount
                              </label>
                              {isEdit && (
                                <input
                                  className="small-inputfield"
                                  type="number"
                                  name={`reward_${reward?.id}_discount`}
                                  value={
                                    editCampaignData[
                                      `reward_${reward?.id}_discount`
                                    ]
                                  }
                                  onChange={handleChange}
                                />
                              )}
                            </div>
                            <div className="inputfield">
                              <label htmlFor={`reward_${reward?.id}_code`}>
                                Discount Code
                              </label>
                              {isEdit && (
                                <input
                                  className="large-field"
                                  type="text"
                                  name={`reward_${reward?.id}_code`}
                                  value={
                                    editCampaignData[
                                      `reward_${reward?.id}_code`
                                    ]
                                  }
                                  onChange={handleChange}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="reward-section">{renderButton(3)}</div>
            </>
          )}
        </section>

        {/* Email Settings */}
        <section className="newcampaign-settings">
          <div className="emails-settings" onClick={() => handleExpand(3)}>
            <div className="card-header">
              <h2 className="card-title">Email Settings</h2>
              <span className="toggle-btn" onClick={() => handleExpand(3)}>
                {expanded[3] ? (
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
          {expanded[3] && (
            <>
              <div className="email-container">
                <div className="email-optCheck">
                  {isEdit && (
                    <input
                      className="checkbox-input"
                      type="checkbox"
                      name="double_opt_in"
                      id="double_opt_in"
                      checked={editCampaignData?.double_opt_in}
                      onChange={handleCheckboxChange}
                    />
                  )}
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

                      {isEdit && (
                        <textarea
                          className="email-textinput"
                          type="text"
                          rows={9}
                          value={editCampaignData?.double_opt_in_email}
                          name="double_opt_in_email"
                          id="double_opt_in_email"
                          onChange={handleChange}
                        />
                      )}
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

                      {isEdit && (
                        <textarea
                          className="email-textinput"
                          rows={9}
                          value={editCampaignData?.welcome_email}
                          name="welcome_email"
                          id="welcome_email"
                          onChange={handleChange}
                        />
                      )}
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

                      {isEdit && (
                        <textarea
                          className="email-textinput"
                          rows={9}
                          name="referral_email"
                          value={editCampaignData?.referral_email}
                          onChange={handleChange}
                        />
                      )}
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

                      {isEdit && (
                        <textarea
                          className="email-textinput"
                          rows={9}
                          name="reward_email"
                          value={editCampaignData?.reward_email}
                          onChange={handleChange}
                        />
                      )}
                    </div>
                  </div>
                </section>
              </div>
              <div className="email-setting-section">
                <div></div>
                <div>{renderButton(4)}</div>
              </div>
            </>
          )}
        </section>

        {/* Integration Settings */}

        <section className="newcampaign-settings">
          <div className="integration-settings" onClick={() => handleExpand(4)}>
            <div className="card-header">
              <h2 className="card-title">Integration Settings</h2>
              <span className="toggle-btn" onClick={() => handleExpand(4)}>
                {expanded[4] ? (
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

          {expanded[4] && (
            <>
              <div className="integration-container">
                <div className="integration-block-content">
                  <div className="check-input">
                    {isEdit && (
                      <input
                        type="checkbox"
                        name="klaviyo_integration"
                        checked={editCampaignData?.klaviyo_integration}
                        onChange={handleCheckboxChange}
                      />
                    )}
                    <label htmlFor="klaviyo_integration">
                      Integrate with Klaviyo
                    </label>
                  </div>

                  <div className="integration-settings-container">
                    <div className="form-group">
                      <div className="inputfield">
                        <label htmlFor="klaviyo_api_key">Private API Key</label>
                        {isEdit && (
                          <input
                            type="text"
                            name="klaviyo_api_key"
                            id="klaviyo_api_key"
                            placeholder="Enter API Key"
                            value={editCampaignData?.klaviyo_api_key}
                            onChange={handleChange}
                          />
                        )}
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="inputfield">
                        <label htmlFor="">List to Add Users</label>

                        <div className="select-user-input">
                          <select>
                            <option value="john">John Dape</option>
                            <option value="janee">Janee</option>
                            <option selected value="Mickey">
                              Mickey Author
                            </option>
                            <option value="Laurwes">Laurwes</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="integrate-setting-btn">{renderButton(5)}</div>
            </>
          )}
        </section>

        {/* Template Settings */}

        <section className="newcampaign-settings">
          <div className="template-settings" onClick={() => handleExpand(5)}>
            <div className="card-header">
              <h2 className="card-title">Template Settings</h2>
              <span className="toggle-btn" onClick={() => handleExpand(5)}>
                {expanded[5] ? (
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

          {expanded[5] && (
            <>
              <div className="template-container">
                <div className="template-content">
                  <p>Select one of the following specially curated template</p>
                </div>
                <div className="templates-block-container">
                  <div className="template-cards">
                    {[1, 2, 3].map((item, index) => (
                      <div key={index} className="template-card-block">
                        {index === 2 ? (
                          <h3>
                            Build a custom template in the Shopify Theme Editor{" "}
                          </h3>
                        ) : (
                          <img
                            src="https://images.unsplash.com/photo-1677530248563-e6105354fafb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxNnx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60"
                            alt="template"
                            onClick={(e) =>
                              setEditCampaignData({
                                ...editCampaignData,
                                template_id: index,
                              })
                            }
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="laststep">
                  <p>
                    After the Campaign is created, you will be navigated to your
                    Shopify Theme Editor to finalize your settings.
                  </p>
                </div>
              </div>
              <div className="template-end">
                <div>
                  <button className="saveFormBtn" type="submit">
                    {isEdit ? "Update Campaign" : "Create Campaign"}
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </form>

      {/* Loading overlay  */}
      <div id="loading-overlay">
        <div id="loading-spinner">
          <h2>Setting Up the best templates for your campaigns</h2>
          <img src={anime} alt="image" />
        </div>
      </div>
    </div>
  );
}

export default EditCampaignForm;
