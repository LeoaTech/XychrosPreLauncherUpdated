import React, { useState } from "react";
import "./toggle.css";
import cx from "classnames";

const ToggleSwitch = ({ rounded, isToggled, draftCampaignToggle }) => {
  const sliderCX = cx("slider", {
    rounded: rounded,
  });
  const draftSlider = cx("draft-slider", {
    rounded: rounded,
  });
  return (
    <>
    {/* Active Or Inactive Campaign */}
      {!draftCampaignToggle ? (
        <label className="switch-label">
          <input type="checkbox" checked={isToggled} defaultChecked readOnly />
          <span className={sliderCX} />
          
        </label>
      ) : (
        // Draft Campaign
        <label className="switch-label">
          <input type="checkbox" checked={draftCampaignToggle} defaultChecked readOnly />
          <span className={draftSlider} />
        </label>
      )}
    </>
  );
};

export default ToggleSwitch;
