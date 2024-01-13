import React from "react";
import { storeLinks } from "../../newcampaign/dummySocial";
import { useThemeContext } from "../../../contexts/ThemeContext";


const BasicSettingsForm = ({
  handleCheckboxChange,
  handleChange,
  handleRadioChange,
  settingsData,
}) => {

  const {theme} = useThemeContext();
  return (
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
                  checked={
                    settingsData !== undefined
                      ? settingsData[`show_${storeLink?.name}`]
                      : null
                  }
                  onChange={handleCheckboxChange}
                />
                <span className="store-social-icons">{storeLink.icon}</span>
                <input
                  className={theme==="dark"?"social-text-field":"social-text-field-light"}
                  type="text"
                  name={`${storeLink?.name}`}
                  value={
                    settingsData !== undefined
                      ? settingsData[`${storeLink?.name}`]
                      : null
                  }
                  onChange={handleChange}
                />
              </div>
              <div>
                {settingsData !== undefined
                  ? settingsData[`show_${storeLink?.name}`] === true &&
                    settingsData[`${storeLink?.name}`] === "" && (
                      <p className="error-message">
                        Please Fill the Input field also{" "}
                      </p>
                    )
                  : null}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="collect__container">
        <div className="sub-title">
          <h2>Collect</h2>
          <div className={theme==="dark"?"collect__inputs":"collect__inputs-light"}>
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
          <div className={theme==="dark"?"collect__inputs":"collect__inputs-light"}>
            <input
              className="checkbox-input"
              type="radio"
              name="collect_phone"
              value="email"
              checked={settingsData?.collect_phone === false}
              onChange={handleRadioChange}
            />
            <label htmlFor="collect_phone">Email Addresses Only </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicSettingsForm;
