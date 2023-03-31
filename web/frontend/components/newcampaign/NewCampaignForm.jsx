import React, { useState, forwardRef, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { anime, template1, template2, xychrosLogo } from "../../assets/index";
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
  updateCampaign,
  fetchCampaignById,
  fetchCampaignByName,
  addNewCampaign,
} from "../../app/features/campaigns/campaignSlice";
import { storeLinks } from "./dummySocial";
import { RewardData } from "./rewardTier/RewardData";
import { useAuthenticatedFetch } from "../../hooks";
import { fetchAllSettings } from "../../app/features/settings/settingsSlice";
import { fetchAllProducts } from "../../app/features/productSlice";
import useFetchTemplates from "../../constant/fetchTemplates";

function NewCampaignForm() {
  const fetch = useAuthenticatedFetch();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const templateData = useFetchTemplates("/api/templates", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const { isEdit, setIsEdit } = useStateContext();
  const { campaignsid } = useParams();

  // Get A Single Campaign with ID
  const campaignById = useSelector((state) =>
    fetchCampaignById(state, Number(campaignsid))
  );
  const campaignName = useSelector(fetchCampaignByName); //Get the Campaign Name to verify unique campaign name
  const globalSettings = useSelector(fetchAllSettings); //Settings Data
  const productsData = useSelector(fetchAllProducts); //Get all products of Shop

  const [editCampaignData, setEditCampaignData] = useState();

  useEffect(() => {
    if (campaignById) {
      setEditCampaignData(campaignById);
    }
    if (globalSettings && productsData.length > 0) {
      console.log("render");
    }
  }, [globalSettings, productsData]);

  // Get Date for next 6 days for the Campaign end Date
  let today = new Date();
  let getNextDate = new Date();
  getNextDate.setDate(today.getDate() + 6);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(getNextDate);
  const [isLoading, setIsLoading] = useState(false); //Loading screen for aniamtion
  const [errorName, setErrorName] = useState(false);
  const [templateList, setTemplateList] = useState([]); //To store all templates received from Template db
  const [randomTemplate, setRandomTemplate] = useState();
  const [selectedTemplateData, setSelectedTemplateData] = useState(); //Store the selected template data
  const [expanded, setExpanded] = useState(Array(6).fill(false));
  const [newCampaignData, setNewCampaignData] = useState({
    collect_phone: globalSettings?.collect_phone,
    discord_link: globalSettings?.discord_link,
    double_opt_in: globalSettings?.double_opt_in,
    double_opt_in_email: globalSettings?.double_opt_in_email,
    end_date: endDate,
    facebook_link: globalSettings?.facebook_link,
    instagram_link: globalSettings?.instagram_link,
    klaviyo_integration: globalSettings?.klaviyo_integration,
    klaviyo_list_id: "",
    name: "",
    product: "",
    klaviyo_api_key: globalSettings?.klaviyo_api_key,
    referral_email: globalSettings?.referral_email,
    reward_1_code: globalSettings?.reward_1_code,
    reward_1_discount: globalSettings?.reward_1_discount,
    reward_1_tier: globalSettings?.reward_1_tier,
    reward_2_code: globalSettings?.reward_2_code,
    reward_2_discount: globalSettings?.reward_2_discount,
    reward_2_tier: globalSettings?.reward_2_tier,
    reward_3_code: globalSettings?.reward_3_code,
    reward_3_discount: globalSettings?.reward_3_discount,
    reward_3_tier: globalSettings?.reward_3_tier,
    reward_4_code: globalSettings?.reward_4_code,
    reward_4_discount: globalSettings?.reward_4_discount,
    reward_4_tier: globalSettings?.reward_4_tier,
    reward_email: globalSettings?.reward_email,
    share_discord_message: globalSettings?.share_discord_message,
    share_discord_referral: globalSettings?.share_discord_referral,
    share_email_message: globalSettings?.share_email_message,
    share_email_referral: globalSettings?.share_email_referral,
    share_facebook_message: globalSettings?.share_facebook_message,
    share_facebook_referral: globalSettings?.share_facebook_referral,
    share_instagram_message: globalSettings?.share_instagram_message,
    share_instagram_referral: globalSettings?.share_instagram_referral,
    share_snapchat_message: globalSettings?.share_snapchat_message,
    share_snapchat_referral: globalSettings?.share_snapchat_referral,
    share_tiktok_message: globalSettings?.share_tiktok_message,
    share_tiktok_referral: globalSettings?.share_tiktok_referral,
    share_twitter_message: globalSettings?.share_twitter_message,
    share_twitter_referral: globalSettings?.share_twitter_referral,
    share_whatsapp_message: globalSettings?.share_whatsapp_message,
    share_whatsapp_referral: globalSettings?.share_whatsapp_referral,
    show_discord_link: globalSettings?.show_discord_link,
    show_facebook_link: globalSettings?.show_facebook_link,
    show_instagram_link: globalSettings?.show_instagram_link,
    show_snapchat_link: globalSettings?.show_snapchat_link,
    show_tiktok_link: globalSettings?.show_tiktok_link,
    show_twitter_link: globalSettings?.show_twitter_link,
    snapchat_link: globalSettings?.snapchat_link,
    start_date: startDate,
    tiktok_link: globalSettings?.tiktok_link,
    twitter_link: globalSettings?.twitter_link,
    welcome_email: globalSettings?.welcome_email,
    template_id: null,
    discount_type: globalSettings?.discount_type,
  });

  useEffect(() => {
    if (templateData?.length > 0) {
      setTemplateList(templateData);
    }
  }, [templateData]);

  // Generate Random Templates Array with Template Ids

  useEffect(() => {
    if (templateList.length > 0) {
      const randomTemplates = [
        templateList[0],
        ...templateList
          .slice(1)
          .sort(() => 0.5 - Math.random() * 5)
          .slice(0, 2),
      ];
      setRandomTemplate(randomTemplates);
    }
  }, [templateList]);

  console.log(templateData);

  // authenticated fetch
  const authenticated_fetch = useAuthenticatedFetch();

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
    if (index === 1 && newCampaignData.name !== "") {
      if (
        isEdit
          ? campaignName.includes(editCampaignData?.name)
          : campaignName.includes(newCampaignData?.name)
      ) {
        setErrorName(true);
        setExpanded((prevExpand) =>
          prevExpand.map((state, i) => i === index - 1 && true)
        );
      } else {
        setErrorName(false);
        setExpanded((prevExpand) =>
          prevExpand.map((state, i) => (i === index ? !state : false))
        );
      }
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
    } else {
      setNewCampaignData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  async function saveCampaignTemplate(data, template) {
    await fetch("/api/create_template", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data, template),
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  }

  console.log(selectedTemplateData);

  // Save  New Campaign form  & Update Campaign Form
  const handleSaveClick = async (e) => {
    e.preventDefault();

    // Function call to save the campaign data and selected templates

    await saveCampaignTemplate(newCampaignData, selectedTemplateData);

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
        .then((data) => dispatch(updateCampaign(data)))
        .catch((err) => console.log(err));
      setIsEdit(false);
      navigate("/campaigns");
    }
    // Adding new Campaign Form
    else {
      await fetch("/api/campaignsettings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCampaignData),
      })
        .then((res) => res.json())
        .then((data) => dispatch(addNewCampaign(data)))
        .catch((err) => console.log(err));
      await authenticated_fetch("/api/create_template");
      console.log("template created");
      navigate("/campaigns");
    }
  };

  // HandleCheckbox events in the basic form settings

  function handleCheckboxChange(e) {
    const { name, checked } = e.target;

    if (isEdit) {
      setEditCampaignData({ ...editCampaignData, [name]: checked });
    } else {
      setNewCampaignData({ ...newCampaignData, [name]: checked });
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
    } else {
      setNewCampaignData((prevnewcampaignData) => ({
        ...prevnewcampaignData,
        [name]: value === "phone",
        discount_type: value,
      }));
    }
  }

  console.log(editCampaignData);

  return (
    <div className="new-campaign-container">
      <div className="newcampaign-title">
        <h1>{isEdit ? "Edit Campaign" : "New Campaign"}</h1>
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
                      {isEdit ? (
                        <>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            value={editCampaignData?.name}
                            onChange={handleChange}
                          />{" "}
                          {errorName && (
                            <p className="error-message">
                              "Campaign Name already Exists"
                            </p>
                          )}
                        </>
                      ) : (
                        <>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            value={newCampaignData?.name}
                            onChange={handleChange}
                          />
                          {errorName && (
                            <p className="error-message">
                              "Campaign Name already Exists"
                            </p>
                          )}
                        </>
                      )}
                    </div>

                    <div className="inputfield">
                      <label htmlFor="product_link">Product Link</label>
                      {isEdit ? (
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
                      ) : (
                        <div className="select-products">
                          <select
                            name="product"
                            id="product"
                            value={newCampaignData?.product}
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

                      {isEdit ? (
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
                      ) : (
                        <DatePicker
                          name="start_date"
                          minDate={new Date()}
                          showDisabledMonthNavigation
                          customInput={<ExampleCustomInput />}
                          shouldCloseOnSelect={true}
                          selected={newCampaignData?.start_date}
                          value={newCampaignData?.start_date}
                          onChange={(date) =>
                            setNewCampaignData((prev) => ({
                              ...prev,
                              ["start_date"]: date,
                            }))
                          }
                        />
                      )}
                    </div>

                    <div className="inputfield">
                      <label htmlFor="end_date">End Date</label>
                      {isEdit ? (
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
                      ) : (
                        <DatePicker
                          name="end_date"
                          minDate={new Date()}
                          customInput={<ExampleCustomInput />}
                          showDisabledMonthNavigation
                          shouldCloseOnSelect={true}
                          selected={newCampaignData?.end_date}
                          value={newCampaignData?.end_date}
                          onChange={(date) =>
                            setNewCampaignData((prev) => ({
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
                        {isEdit ? (
                          <input
                            className="social-input"
                            type="checkbox"
                            name={`show_${link?.name}`}
                            checked={editCampaignData[`show_${link?.name}`]}
                            onChange={handleCheckboxChange}
                          />
                        ) : (
                          <input
                            className="social-input"
                            type="checkbox"
                            name={`show_${link?.name}`}
                            checked={newCampaignData[`show_${link?.name}`]}
                            onChange={handleCheckboxChange}
                          />
                        )}
                        <span className="store-social-icons">{link.icon}</span>
                        {isEdit ? (
                          <input
                            className="social-inputfield"
                            type="text"
                            name={`${link?.name}`}
                            value={editCampaignData[`${link?.name}`]}
                            onChange={handleChange}
                          />
                        ) : (
                          <input
                            className="social-inputfield"
                            type="text"
                            name={`${link?.name}`}
                            value={newCampaignData[`${link?.name}`]}
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
                      {isEdit ? (
                        <input
                          className="checkbox-input"
                          type="radio"
                          name="collect_phone"
                          value="phone"
                          checked={editCampaignData?.collect_phone === true}
                          onChange={handleRadioChange}
                        />
                      ) : (
                        <input
                          className="checkbox-input"
                          type="radio"
                          name="collect_phone"
                          value="phone"
                          checked={newCampaignData?.collect_phone === true}
                          onChange={handleRadioChange}
                        />
                      )}
                      <label htmlFor="collect_phone">
                        Email Addresses and Phone Numbers{" "}
                      </label>
                    </div>
                    <div>
                      {isEdit ? (
                        <input
                          className="checkbox-input"
                          type="radio"
                          name="collect_phone"
                          value="email"
                          checked={editCampaignData?.collect_phone === false}
                          onChange={handleRadioChange}
                        />
                      ) : (
                        <input
                          className="checkbox-input"
                          type="radio"
                          name="collect_phone"
                          value="email"
                          checked={newCampaignData?.collect_phone === false}
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
                          {isEdit ? (
                            <input
                              type="checkbox"
                              name={`share_${link?.title}_referral`}
                              id={`share_${link.title}_referral`}
                              checked={
                                editCampaignData[`share_${link.title}_referral`]
                              }
                              onChange={handleCheckboxChange}
                            />
                          ) : (
                            <input
                              type="checkbox"
                              name={`share_${link?.title}_referral`}
                              id={`share_${link.title}_referral`}
                              checked={
                                newCampaignData[`share_${link.title}_referral`]
                              }
                              onChange={handleCheckboxChange}
                            />
                          )}{" "}
                          <label htmlFor="">{link.desc}</label>
                        </div>

                        <div className="referral-link-input">
                          {isEdit ? (
                            <textarea
                              className="referral-input"
                              rows={4}
                              value={
                                editCampaignData[`share_${link?.title}_message`]
                              }
                              onChange={handleChange}
                            />
                          ) : (
                            <textarea
                              className="referral-input"
                              rows={4}
                              value={
                                newCampaignData[`share_${link?.title}_message`]
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
                      {isEdit ? (
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
                      ) : (
                        <input
                          className="social-radioInput"
                          type="radio"
                          name="discount_type"
                          value="percent"
                          checked={newCampaignData?.discount_type === "percent"}
                          onChange={handleRadioChange}
                        />
                      )}
                      <label htmlFor="">% off the entire order</label>
                    </div>
                    <div>
                      {isEdit ? (
                        <input
                          className="social-radioInput"
                          type="radio"
                          name="discount_type"
                          value="amount"
                          checked={editCampaignData?.discount_type === "amount"}
                          onChange={handleRadioChange}
                        />
                      ) : (
                        <input
                          className="social-radioInput"
                          type="radio"
                          name="discount_type"
                          value="amount"
                          checked={newCampaignData?.discount_type === "amount"}
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
                              {isEdit ? (
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
                              ) : (
                                <input
                                  className="small-inputfield"
                                  type="number"
                                  name={`reward_${reward?.id}_tier`}
                                  value={
                                    newCampaignData[`reward_${reward?.id}_tier`]
                                  }
                                  onChange={handleChange}
                                />
                              )}
                            </div>
                            <div className="inputfield">
                              <label htmlFor={`reward_${reward?.id}_discount`}>
                                Discount
                              </label>
                              {isEdit ? (
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
                              ) : (
                                <input
                                  className="small-inputfield"
                                  type="number"
                                  name={`reward_${reward?.id}_discount`}
                                  value={
                                    newCampaignData[
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
                              {isEdit ? (
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
                              ) : (
                                <input
                                  className="large-field"
                                  type="text"
                                  name={`reward_${reward?.id}_code`}
                                  value={
                                    newCampaignData[`reward_${reward?.id}_code`]
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
                  {isEdit ? (
                    <input
                      className="checkbox-input"
                      type="checkbox"
                      name="double_opt_in"
                      id="double_opt_in"
                      checked={editCampaignData?.double_opt_in}
                      onChange={handleCheckboxChange}
                    />
                  ) : (
                    <input
                      className="checkbox-input"
                      type="checkbox"
                      name="double_opt_in"
                      id="double_opt_in"
                      checked={newCampaignData?.double_opt_in}
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

                      {isEdit ? (
                        <textarea
                          className="email-textinput"
                          type="text"
                          rows={9}
                          value={editCampaignData?.double_opt_in_email}
                          name="double_opt_in_email"
                          id="double_opt_in_email"
                          onChange={handleChange}
                        />
                      ) : (
                        <textarea
                          className="email-textinput"
                          type="text"
                          rows={9}
                          value={newCampaignData?.double_opt_in_email}
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

                      {isEdit ? (
                        <textarea
                          className="email-textinput"
                          rows={9}
                          value={editCampaignData?.welcome_email}
                          name="welcome_email"
                          id="welcome_email"
                          onChange={handleChange}
                        />
                      ) : (
                        <textarea
                          className="email-textinput"
                          rows={9}
                          value={newCampaignData?.welcome_email}
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

                      {isEdit ? (
                        <textarea
                          className="email-textinput"
                          rows={9}
                          name="referral_email"
                          value={editCampaignData?.referral_email}
                          onChange={handleChange}
                        />
                      ) : (
                        <textarea
                          className="email-textinput"
                          rows={9}
                          name="referral_email"
                          value={newCampaignData?.referral_email}
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

                      {isEdit ? (
                        <textarea
                          className="email-textinput"
                          rows={9}
                          name="reward_email"
                          value={editCampaignData?.reward_email}
                          onChange={handleChange}
                        />
                      ) : (
                        <textarea
                          className="email-textinput"
                          rows={9}
                          name="reward_email"
                          value={newCampaignData?.reward_email}
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
                    {isEdit ? (
                      <input
                        type="checkbox"
                        name="klaviyo_integration"
                        checked={editCampaignData?.klaviyo_integration}
                        onChange={handleCheckboxChange}
                      />
                    ) : (
                      <input
                        type="checkbox"
                        name="klaviyo_integration"
                        checked={newCampaignData?.klaviyo_integration}
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
                        {isEdit ? (
                          <input
                            type="text"
                            name="klaviyo_api_key"
                            id="klaviyo_api_key"
                            placeholder="Enter API Key"
                            value={editCampaignData?.klaviyo_api_key}
                            onChange={handleChange}
                          />
                        ) : (
                          <input
                            type="text"
                            name="klaviyo_api_key"
                            id="klaviyo_api_key"
                            placeholder="Enter API Key"
                            value={newCampaignData?.klaviyo_api_key}
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
                    {randomTemplate?.map((template, index) => (
                      <div key={template.id} className="template-card-block">
                        {template?.id === 1 ? (
                          <h3
                            onClick={(e) => {
                              isEdit
                                ? setEditCampaignData({
                                    ...editCampaignData,
                                    template_id: template?.id,
                                  })
                                : setNewCampaignData({
                                    ...newCampaignData,
                                    template_id: template?.id,
                                  });
                              setSelectedTemplateData(template);
                            }}
                          >
                            Build a custom template in the Shopify Theme Editor{" "}
                          </h3>
                        ) : (
                          template?.id > 1 && (
                            <img
                              src={index === 1 ? template1 : template2}
                              alt="template"
                              onClick={(e) => {
                                isEdit
                                  ? setEditCampaignData({
                                      ...editCampaignData,
                                      template_id: template?.id,
                                    })
                                  : setNewCampaignData({
                                      ...newCampaignData,
                                      template_id: template?.id,
                                    });
                                setSelectedTemplateData(template);
                              }}
                            />
                          )
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

      {/* Loading Animation  */}
      <div id="loading-overlay">
        <div id="loading-spinner">
          <h2>Setting Up the best templates for your campaigns</h2>
          <img src={anime} alt="image" />
        </div>
      </div>
    </div>
  );
}

export default NewCampaignForm;
