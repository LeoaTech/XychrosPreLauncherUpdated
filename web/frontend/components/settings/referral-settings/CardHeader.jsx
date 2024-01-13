import React from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { useThemeContext } from "../../../contexts/ThemeContext";

const ReferralCardHeader = ({
  title,
  handleExpand,
  currentExpanded,
  index,
}) => {
  const { theme } = useThemeContext();
  return (
    <div
      className={
        theme === "dark"
          ? `referral-settings ${
              currentExpanded[index] ? "active-form" : "inactive-form"
            }`
          : `referral-settings ${
              currentExpanded[index] ? "active-form-light" : "inactive-form-light"
            }`
      }
    >
      <div className="main-heading">
        <h2 className="main-title">{title}</h2>
        <span className="toggle-card-btn">
          {currentExpanded[index] ? (
            <IoIosArrowUp
              style={{ strokeWidth: "70", fill: "#fff" }}
              onClick={() => handleExpand(index)}
            />
          ) : (
            <IoIosArrowDown style={{ strokeWidth: "70", fill: "#fff" }} />
          )}
        </span>
      </div>
    </div>
  );
};

export default ReferralCardHeader;
