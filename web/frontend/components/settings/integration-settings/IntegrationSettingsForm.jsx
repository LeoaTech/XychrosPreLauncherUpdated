import React from "react";
import { useThemeContext } from "../../../contexts/ThemeContext";

const IntegrationSettingsForm = ({
  handleChange,
  handleCheckboxChange,
  settingsData,
}) => {
    const {theme} = useThemeContext()
  return (
    <div className="integrations-container">
      <div className="integarte__input">
        <div className={theme==="dark"?"check-input":"check-input-light"}>
          <input
            type="checkbox"
            name="klaviyo_integration"
            id="klaviyo_integration"
            checked={settingsData?.klaviyo_integration}
            onChange={handleCheckboxChange}
          />
          <label htmlFor="klaviyo_integration">Integrate with Klaviyo</label>
        </div>
      </div>

      <div className="integrate-api-input">
        <div className={theme === "dark" ? "inputfield":"inputfield-light"}>
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
            disabled={!settingsData?.klaviyo_integration}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};

export default IntegrationSettingsForm;
