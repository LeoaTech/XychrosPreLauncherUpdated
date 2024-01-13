import React, { useEffect, useState } from "react";
import "./setting.css";

import CardHeader from "./basic-settings/CardHeader";
import NextButton from "./basic-settings/NextButton";
import { useAuthenticatedFetch } from "../../hooks";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllSettings,
  fetchSettings,
} from "../../app/features/settings/settingsSlice";
import BasicSettingsForm from "./basic-settings/BasicSettingsForm";
import { useThemeContext } from "../../contexts/ThemeContext";
import ReferralCardHeader from "./referral-settings/CardHeader";
import ReferralNextButton from "./referral-settings/NextButton";
import ReferralSettingsForm from "./referral-settings/ReferralSettingsForm";
import RewardCardHeader from "./reward-settings/CardHeader";
import RewardNextButton from "./reward-settings/NextButton";
import EmailCardHeader from "./email-settings/CardHeader";
import IntegrationCardHeader from "./integration-settings/CardHeader";
import IntegrationNextButton from "./integration-settings/NextButton";
import IntegrationSettingsForm from "./integration-settings/IntegrationSettingsForm";
import EmailNextButton from "./email-settings/NextButton";
import EmailSettingsForm from "./email-settings/EmailSettingsForm";
import RewardSettingsForm from "./reward-settings/RewardSettingsForm";

const SettingComponent = () => {
  const { theme } = useThemeContext();
  const defaultSettings = useSelector(fetchAllSettings);

  const dispatch = useDispatch();
  const [settingsData, setSettingsData] = useState({
    reward_1_code: "",
    reward_1_discount: null,
    reward_1_tier: null,
    reward_2_code: "",
    reward_2_discount: null,
    reward_2_tier: null,
    reward_3_code: "",
    reward_3_discount: null,
    reward_3_tier: null,
    reward_4_code: "",
    reward_4_discount: null,
    reward_4_tier: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const fetch = useAuthenticatedFetch();

  // Get Default Settings Data
  useEffect(() => {
    if (defaultSettings !== undefined) {
      setSettingsData((prevSettingsData) => ({
        ...prevSettingsData,
        ...defaultSettings,
      }));
    }
  }, [defaultSettings]);

  const [currentExpanded, setCurrentExpanded] = useState([
    true,
    false,
    false,
    false,
    false,
    false,
  ]);

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

  const handlePrevious = (index) => {
    setCurrentExpanded((prevExpand) =>
      prevExpand.map((state, i) => (i === index ? !state : false))
    );
  };

  // Check if all fields in a tier are filled
  const isTierFilled = (tier) => {
    return (
      settingsData[`reward_${tier}_tier`] &&
      settingsData[`reward_${tier}_discount`] &&
      settingsData[`reward_${tier}_code`]
    );
  };

  // Enable or disable fields based on whether the previous tier is filled
  const isFieldDisabled = (tier) => {
    return tier > 1 && !isTierFilled(tier - 1);
  };

  const [rewardTierValidate, setRewardTierValidate] = useState(false);

  // Before moving to the next form, replace empty strings with null
  const prepareFieldsForSubmission = () => {
    const preparedFields = { ...fields };
    for (let tier = 3; tier <= 4; tier++) {
      if (!isTierFilled(tier)) {
        preparedFields[`reward_${tier}_tier`] = null;
        preparedFields[`reward_${tier}_discount`] = null;
      }
    }
    return preparedFields;
  };

  // Handle Next Button event for each
  const handleNext = (index) => {
    // if (index == 3) {
    //   const preparedFields = prepareFieldsForSubmission();
    //   setSettingsData(...settingsData, ...preparedFields);
    //   setCurrentExpanded((prevExpand) =>
    //     prevExpand.map((state, i) => (i === index ? !state : false))
    //   );
    // } else
    if (index === 4) {
      if (settingsData.reward_3_tier === "") {
        settingsData.reward_3_tier = null;
      }
      if (settingsData.reward_3_discount === "") {
        settingsData.reward_3_discount = null;
      }
      if (settingsData.reward_4_tier === "") {
        settingsData.reward_4_tier = null;
      }
      if (settingsData.reward_4_discount === "") {
        settingsData.reward_4_discount = null;
      }
      document.getElementById("settings-save").disabled = false;
      document.getElementById("settings-save").style.cursor = "pointer";
      setCurrentExpanded((prevExpand) =>
        prevExpand.map((state, i) => (i === index ? !state : false))
      );
    } else {
      setCurrentExpanded((prevExpand) =>
        prevExpand.map((state, i) => (i === index ? !state : false))
      );
    }
  };

  // Handle Reward Settings
  // Check if all fields are filled
  const isReward1Filled =
    !!settingsData[`reward_1_tier`] &&
    !!settingsData[`reward_1_discount`] &&
    !!settingsData[`reward_1_code`];
  const isReward2Filled =
    !!settingsData[`reward_2_tier`] &&
    !!settingsData[`reward_2_discount`] &&
    !!settingsData[`reward_2_code`];
  const isReward3Filled =
    !!settingsData[`reward_3_tier`] &&
    !!settingsData[`reward_3_discount`] &&
    !!settingsData[`reward_3_code`];
  const isReward4Filled =
    !!settingsData[`reward_4_tier`] &&
    !!settingsData[`reward_4_discount`] &&
    !!settingsData[`reward_4_code`];

  // Update Global Settings for the Shop
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isReward1Filled && isReward2Filled) {
      setIsLoading(true);

      await fetch("/api/updatesettings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settingsData),
      })
        .then((res) => res.json())
        .then((data) => {
          dispatch(fetchSettings(data[0]));
        })
        .catch((err) => console.log(err));

      handleNext(4);
      setIsLoading(false);
      handleNext(0);

      document.getElementById("settings-save").setAttribute("disabled", "");
      document.getElementById("settings-save").style.color = "#f5f5f5";
      document.getElementById("settings-save").style.cursor = "none";
    }
  };

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

    setSettingsData({
      ...settingsData,
      [name]: checked,
      klaviyo_integration: checked,
    });
  }

  // Handle Radio Change Event
  function handleRadioChange(event) {
    const { name, value } = event.target;
    // Update the state with the new value
    setSettingsData((prevSettingsData) => ({
      ...prevSettingsData,
      collect_phone: value === "phone",
      // discount_type: value,
    }));
  }

  // Handle Radio Change Event
  function handleDiscountRadioChange(event) {
    const { name, value } = event.target;
    // Update the state with the new value
    setSettingsData((prevSettingsData) => ({
      ...prevSettingsData,
      // [name]: value,

      discount_type: value,
    }));
  }

  console.log(defaultSettings);

  return (
    <div
      className={
        theme === "dark" ? "settings-container" : "settings-container-light"
      }
    >
      <div
        className={
          theme === "dark" ? "settings-heading" : "settings-heading-light"
        }
      >
        <h1>Global Settings</h1>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Basic Settings Section */}
        <section
          className={
            theme === "dark" ? "global-settings" : "global-settings-light"
          }
        >
          <CardHeader
            handleExpand={handleExpand}
            currentExpanded={currentExpanded}
            index={0}
            title="Basic Settings"
          />

          {currentExpanded[0] && defaultSettings && (
            <>
              <BasicSettingsForm
                handleChange={handleChange}
                handleCheckboxChange={handleCheckboxChange}
                handleRadioChange={handleRadioChange}
                settingsData={settingsData}
              />
              <NextButton index={1} renderButton={renderButton} />
            </>
          )}
        </section>

        {/* Referral Settings Section */}

        <section
          className={
            theme === "dark" ? "global-settings" : "global-settings-light"
          }
        >
          <ReferralCardHeader
            handleExpand={handleExpand}
            currentExpanded={currentExpanded}
            index={1}
            title="Referral Settings"
          />
          {currentExpanded[1] && defaultSettings && (
            <>
              <ReferralSettingsForm
                handleChange={handleChange}
                handleCheckboxChange={handleCheckboxChange}
                settingsData={settingsData}
              />
              <ReferralNextButton
                handleNext={handleNext}
                handlePrevious={handlePrevious}
                prevIndex={0}
                nextIndex={2}
              />
            </>
          )}
        </section>
        {/* Rewards Settings Section */}
        <section
          className={
            theme === "dark" ? "global-settings" : "global-settings-light"
          }
        >
          <RewardCardHeader
            handleExpand={handleExpand}
            currentExpanded={currentExpanded}
            title="Reward Settings"
            index={2}
          />
          {currentExpanded[2] && (
            <>
              <RewardSettingsForm
                settingsData={settingsData}
                handleDiscountRadioChange={handleDiscountRadioChange}
                rewardTierValidate={rewardTierValidate}
                isFieldDisabled={isFieldDisabled}
                handleChange={handleChange}
              />
              <RewardNextButton
                prevIndex={1}
                nextIndex={3}
                handleNext={handleNext}
                handlePrevious={handlePrevious}
              />
            </>
          )}
        </section>

        {/* Email Settings Section */}
        <section
          className={
            theme === "dark" ? "global-settings" : "global-settings-light"
          }
        >
          <EmailCardHeader
            handleExpand={handleExpand}
            currentExpanded={currentExpanded}
            index={3}
            title="Email Settings"
          />
          {currentExpanded[3] && (
            <>
              <EmailSettingsForm
                handleChange={handleChange}
                settingsData={settingsData}
              />
              <EmailNextButton
                handleNext={handleNext}
                handlePrevious={handlePrevious}
                prevIndex={2}
                nextIndex={4}
              />
            </>
          )}
        </section>

        {/* Integrations Settings */}
        <section
          className={
            theme === "dark" ? "global-settings" : "global-settings-light"
          }
        >
          <IntegrationCardHeader
            handleExpand={handleExpand}
            currentExpanded={currentExpanded}
            index={4}
            title="Integrations Settings"
          />
          {currentExpanded[4] && (
            <>
              <IntegrationSettingsForm
                handleChange={handleChange}
                handleCheckboxChange={handleCheckboxChange}
                settingsData={settingsData}
              />
              <IntegrationNextButton
                handlePrevious={handlePrevious}
                prevIndex={3}
              />
            </>
          )}
        </section>

        <div className="settings-savebtn">
          <button
            id="settings-save"
            className="saveSettingsbtn"
            type="submit"
            disabled
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingComponent;
