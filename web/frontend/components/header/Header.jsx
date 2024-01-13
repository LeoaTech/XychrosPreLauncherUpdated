import React, { useEffect, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import {
  MdOutlinePriceChange,
  MdLightMode,
  MdNightlightRound,
} from "react-icons/md";
import { FaUser } from "react-icons/fa";
import "./header.css";

import { useStateContext } from "../../contexts/ContextProvider";
import { BlackLogo, ViralLaunch } from "../../assets/index";
import { Link } from "react-router-dom";
import { useThemeContext } from "../../contexts/ThemeContext";

const Header = () => {
  const { theme, setTheme } = useThemeContext();
  const { screenSize,setScreenSize } = useStateContext();
  const profileActionButton = {
    cursor: "pointer",
    color: theme === "dark" ? "#fff" : "#000",
    height: 20,
    width: 22,
  };

  
  return (
    <header>
      <div className="header-wrapper">
        <label htmlFor="menu-toggle">
          <AiOutlineMenu
            style={theme == "dark" ? { color: "#fff" } : { color: "#000" }}
          />
        </label>
      </div>
      <div className="header-title">
        {theme === "dark" ? (
          <img className="dark-logo" src={ViralLaunch} alt="Viral Launch" />
        ) : (
          <img className="light-logo" src={BlackLogo} alt="Viral Launch" />
        )}
      </div>
      <div className="header-action">
        <div className="theme-toggle-icon">
          {theme === "dark" && (
            <MdNightlightRound
              onClick={() => setTheme("light")}
              style={{
                height: 20,
                width: 24,
                color: "#FFF",
              }}
            />
          )}
          {theme === "light" && (
            <MdLightMode
              onClick={() => setTheme("dark")}
              style={{
                height: 20,
                width: 24,
                color: "black",
              }}
            />
          )}{" "}
        </div>
        <div>
          <Link to="/price">
            <span className="header-action-link">
              <MdOutlinePriceChange style={profileActionButton} />
              <span style={profileActionButton}>Pricing</span>
            </span>
          </Link>
        </div>
        <div>
          <Link to="/userprofile">
            <div className="userProfile">
              <FaUser style={profileActionButton} />
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
