import React, { useState } from "react";
import "./toggle.css";
import cx from "classnames";

const ToggleSwitch = ({ rounded, isToggled, onToggle, id, start_date, end_date }) => {
  const sliderCX = cx("slider", {
    rounded: rounded,
  });
  const todayDate = new Date()
  return (
    <label className="switch-label">
      <input type="checkbox" checked={isToggled} defaultChecked
      />
      <span className={sliderCX} />
    </label>
  );
};

export default ToggleSwitch;
