import React, { useEffect, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import {
  MdOutlinePriceChange,
  MdLightMode,
  MdNightlightRound,
} from "react-icons/md";
import { CgNotes } from "react-icons/cg";
import { FaUser } from "react-icons/fa";
import "./header.css";

import { useStateContext } from "../../contexts/ContextProvider";
import { BlackLogo, ViralLaunch } from "../../assets/index";
import { Link } from "react-router-dom";
import { useThemeContext } from "../../contexts/ThemeContext";

const NavButton = ({ title, customFunction, color, icon, dotColor }) => (
  <span>
    {" "}
    <button
      type="button"
      onClick={customFunction}
      style={{ color }}
      className="nav-btn"
    >
      <span className="nav-btn-icon" />
      {icon} <span className="nav-btn-text">{title}</span>
    </button>
  </span>
);

const Header = () => {
  const {
    activeMenu,
    setActiveMenu,
    setMobileMenu,
    handleClick,
    screenSize,
    setScreenSize,
  } = useStateContext();
  const { theme, setTheme } = useThemeContext();
  const [isActive, setIsActive] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setScreenSize(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (screenSize > 980) {
      setActiveMenu(true);
      setMobileMenu(false);
    } else if (screenSize < 980) {
      setActiveMenu(false);
      setMobileMenu(true);
    }
  }, [screenSize]);

  const profileActionButton = {
    cursor: "pointer",
    color: theme === "dark" ? "#fff" : "#000",
    height: 20,
    width: 22,
  };

  return (
    <div className="navbar__container">
      <div className="left">
        <NavButton
          customFunction={() => setActiveMenu(!activeMenu)}
          color={theme === "dark" ? "#fff" : "#000"}
          icon={<AiOutlineMenu style={{ height: 24, width: 24 }} />}
        />
      </div>
      <div className="extra">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div className="extra">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div className="center">
        {/* logo */}
        {theme === "dark" ? (
          <img
            src={ViralLaunch}
            alt="Viral Launch"
            // onClick={() => setActiveMenu(!activeMenu)}
          />
        ) : (
          <img
            src={BlackLogo}
            alt="Viral Launch"
            // onClick={() => setActiveMenu(!activeMenu)}
          />
        )}
      </div>

      <div className="right">
        {/* price , profile,faq*/}
        <div className="right-links">
          <div className="theme-toggle-icon">
            {theme === "dark" && (
              <MdNightlightRound
                onClick={() => setTheme("light")}
                style={{
                  height: 20,
                  width: 24,
                  marginTop: "5px",
                  color:"#FFF"
                }}
              />
            )}
            {theme === "light" && (
              <MdLightMode
                onClick={() => setTheme("dark")}
                style={{
                  height: 20,
                  width: 24,
                  marginTop: "5px",
                  color:"black"
                }}
              />
            )}{" "}
          </div>
          <Link to="/price" onClick={() => setIsActive(true)}>
            <NavButton
              title="Pricing"
              className={({ isActive }) => (isActive ? "" : "header-links")}
              color={theme === "dark" ? "#fff" : "#000"}
              icon={<MdOutlinePriceChange style={{ height: 24, width: 24 }} />}
            />
          </Link>

          {/* Uncomment this Line when FAQ page is ready */}

          {/* <Link to="/faq">
            <NavButton
              title="FAQs"
              color="#fff"
              className={({ isActive }) =>
                isActive ? "" : "header-links"
              }
              icon={<CgNotes style={{ height: 20, width: 24 }} />}
            />
          </Link> */}
          <div>
            <Link to="/userprofile">
              <div className="userProfile">
                <FaUser style={profileActionButton} />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
