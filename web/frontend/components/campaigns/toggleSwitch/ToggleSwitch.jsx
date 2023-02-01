import React, { useState } from "react";
import "./toggle.css";
import cx from "classnames";

const ToggleSwitch = ({ rounded, isToggled, onToggle }) => {
  const sliderCX = cx("slider", {
    rounded: rounded,
  });
  return (
    <label className="switch-label">
      <input type="checkbox" checked={isToggled} onChange={onToggle} />
      <span className={sliderCX} />
    </label>
  );
};

export default ToggleSwitch;
