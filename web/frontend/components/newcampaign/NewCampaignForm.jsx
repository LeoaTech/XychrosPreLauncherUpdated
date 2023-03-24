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
import { useAuthenticatedFetch } from "../../hooks";
import { fetchAllSettings } from "../../app/features/settings/settingsSlice";
import { fetchAllProducts } from "../../app/features/productSlice";
import useFetchCampaignsData from "../../constant/fetchCampaignsData";

function NewCampaignForm() {
  const { isEdit, setIsEdit } = useStateContext();
  // For Editing Form Data
  const { campaignsid } = useParams();
  const campaignById = useSelector((state) =>
    fetchCampaignById(state, +campaignsid)
  );
  const campaignName = useSelector(fetchCampaignByName);
  const globalSettings = useSelector(fetchAllSettings);
  const productsList = useSelector(fetchAllProducts);
  const [editCampaignData, setEditCampaignData] = useState();
  const [productsData, setProductsData] = useState();
  useEffect(() => {
    if (campaignById) {
      setEditCampaignData(campaignById);
    }
  }, [campaignById]);

  useEffect(() => {
    setProductsData(productsList);
  }, [productsList]);

  const fetch = useAuthenticatedFetch();

  let today = new Date();
  let nextWeekDate = new Date();
  nextWeekDate.setDate(today.getDate() + 6);

  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(nextWeekDate);
  const [errorMsg, setErrorMsg] = useState(false);
  const [errorName, setErrorName] = useState(false);
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
    template_id: 3,
    discount_type: globalSettings?.discount_type,
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
        id="datepicker"
        value={value}
        className="example-custom-input"
        onChange={onChange}
        ref={ref}
      ></input>
    </div>
  ));

  const validateForm = () => {
    const requiredFields = document.querySelectorAll(
      "input[required], select[required]",
      "#datepicker"
    );

    let isFormValid = true;

    requiredFields.forEach((field) => {
      if (!field.value) {
        isFormValid = false;
        field.classList.add("error");
        const errorMessage = document.createElement("span");
        errorMessage.classList.add("error-message");
        errorMessage.innerHTML = "This field is required";
        field.parentNode.insertBefore(errorMessage, field.nextSibling);
      } else {
        // setErrorMsg(false);
        field.classList.remove("error");
        const errorMessage = field.parentNode.querySelector(".error-message");
        if (errorMessage) {
          errorMessage.parentNode.removeChild(errorMessage);
        }
      }
    });

    // Validation for Date INPUT field

    // var datepickerInput = document.getElementById("datepicker");

    // if (!datepickerInput.value) {
    //   isFormValid = false;
    //   setErrorMsg(true);
    // } else {
    //   setErrorMsg(false);
    // }

    return isFormValid;
  };
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
    // validateForm()
    const loadingOverlay = document.getElementById("loading-overlay");
    if (index === 1) {
      if (validateForm() === true)
        if (
          newCampaignData.name !== "" &&
          campaignName.includes(newCampaignData?.name)
        ) {
          setErrorMsg(true);
          setErrorName(true);
          setExpanded((prevExpand) =>
            prevExpand.map((state, i) => i === index - 1 && true)
          );
        } else {
          setErrorMsg(false);
          setErrorName(false);
          setExpanded((prevExpand) =>
            prevExpand.map((state, i) => (i === index ? !state : false))
          );
        }
    } else if (index === 5) {
      setExpanded((prevExpand) =>
        prevExpand.map((state, i) => (i === index ? !state : false))
      );
    } else {
      // validateForm()
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
        start_date: startDate,
        end_date: endDate,
      }));
    }
  };

  // To get Updated Campaigns

  // Save  New Campaign form  & Update Campaign Form
  const handleSaveClick = async (e) => {
    e.preventDefault();

    // Editing Camapign
    if (isEdit) {
      await fetch(`/api/campaignsettings/${campaignsid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editCampaignData),
      })
        .then((res) => res.json())
        .catch((err) => console.log(err));
      setIsEdit(false);
    }
    // Adding New Campaign
    else {
      await fetch("/api/campaignsettings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCampaignData),
      })
        .then((res) => res.json())
        .then((data) => console.log(data))
        .catch((err) => console.log(err));
    }
    handleNext(5);

    navigate("/campaigns", { replace: true });
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
  console.log(editCampaignData, "Edit campaign form");

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
                      <label htmlFor="name">Campaign Name {"*"}</label>
                      {isEdit ? (
                        <>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            required
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
                            required
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
                      <label htmlFor="product_link">Product Link {"*"}</label>
                      {isEdit ? (
                        <div className="select-products">
                          <select
                            name="product"
                            id="product"
                            required
                            value={editCampaignData?.product}
                            onChange={handleChange}
                          >
                            {" "}
                            <option>Select</option>;
                            {productsData?.map((item) => {
                              return (
                                <option key={item?.id} value={item.title}>
                                  {item.title}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      ) : (
                        <div className="select-products">
                          <select
                            name="product"
                            id="product"
                            required
                            value={newCampaignData?.product}
                            onChange={handleChange}
                          >
                            {" "}
                            <option>Select</option>;
                            {productsData?.map((item) => {
                              return (
                                <option key={item?.id} value={item.title}>
                                  {item.title}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="inputfield">
                      <label htmlFor="start_date">Start Date {"*"}</label>

                      {isEdit ? (
                        <DatePicker
                          id="datepicker"
                          minDate={new Date()}
                          showDisabledMonthNavigation
                          customInput={<ExampleCustomInput />}
                          shouldCloseOnSelect={true}
                          required
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
                          id="datepicker"
                          name="start_date"
                          minDate={new Date()}
                          required
                          showDisabledMonthNavigation
                          customInput={<ExampleCustomInput />}
                          shouldCloseOnSelect={true}
                          selectedStart
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
                      {errorMsg && (
                        <p className="error-message">
                          "Please Select a vlaid Start Date "
                        </p>
                      )}
                    </div>

                    <div className="inputfield">
                      <label htmlFor="end_date">End Date {"*"}</label>
                      {isEdit ? (
                        <DatePicker
                          id="datepicker"
                          minDate={new Date()}
                          required
                          customInput={<ExampleCustomInput />}
                          showDisabledMonthNavigation
                          shouldCloseOnSelect={true}
                          selectsEnd
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
                          id="datepicker"
                          name="end_date"
                          minDate={new Date()}
                          required
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
                      {errorMsg && (
                        <p className="error-message">
                          "Please Select a vlaid End Date "
                        </p>
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

export default NewCampaignForm;
