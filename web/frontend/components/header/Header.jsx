import React, { useEffect, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { MdOutlinePriceChange } from "react-icons/md";
import { CgNotes } from "react-icons/cg";
import { HiOutlineUser } from "react-icons/hi";
import "./header.css";

import { useStateContext } from "../../contexts/ContextProvider";
import { SideLogo } from "../../assets/index";
import { Link } from "react-router-dom";

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

  return (
    <div className="navbar__container">
      <div className="left">
        <NavButton
          customFunction={() => setActiveMenu(!activeMenu)}
          color="#fff"
          icon={<AiOutlineMenu style={{ height: "45px", width: "35px" }} />}
        />
      </div>
      <div className="center">
        {/* logo */}
        <img
          src={SideLogo}
          alt="XychrosLogo"
          // onClick={() => setActiveMenu(!activeMenu)}
        />
      </div>

      <div className="right">
        {/* price , profile,faq*/}
        <div className="right-links">
          <Link to="/price" onClick={() => setIsActive(true)}>
            <NavButton
              title="Pricing"
              className={({ isActive }) =>
                isActive ? "" : "header-links"
              }
              color="#fff"
              icon={
                <MdOutlinePriceChange
                  style={{ height: "35px", width: "35px" }}
                />
              }
            />
          </Link>

          <Link to="/faq">
            <NavButton
              title="FAQs"
              color="#fff"
              icon={<CgNotes style={{ height: "30px", width: "30px" }} />}
            />
          </Link>
          <div>
            <Link to="/userprofile">
              <div
                className="userProfile"
                onClick={() => handleClick("UserProfile")}
              >
                <HiOutlineUser
                  style={{ height: "30px", width: "30px", color: "#fff" }}
                />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
