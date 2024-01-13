import React from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { useThemeContext } from "../../../contexts/ThemeContext";

const CardHeader = ({ title, handleExpand, currentExpanded, index }) => {
    const {theme }= useThemeContext()
  return (
    <div
      className={
        theme === "dark"
          ? `basic-settings ${
              currentExpanded[index] ? "active-form" : "inactive-form"
            }`
          : `basic-settings ${
              currentExpanded[index] ? "active-form-light" : "inactive-form-light"
            }`
      }
      onClick={() => handleExpand(index)}
    >
      <div className="main-heading">
        <h2 className="main-title">{title}</h2>
        <span className="toggle-card-btn" onClick={() => handleExpand(index)}>
          {currentExpanded[0] ? (
            <IoIosArrowUp
              style={{ strokeWidth: "70", fill: "#fff" }}
              onClick={() => handleExpand(index)}
            />
          ) : (
            <IoIosArrowDown
              style={{ strokeWidth: "70", fill: "#fff" }}
              onClick={() => handleExpand(index)}
            />
          )}
        </span>
      </div>
    </div>
  );
};

export default CardHeader;
