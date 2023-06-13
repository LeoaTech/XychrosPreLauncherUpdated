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
                  style={{ height: 24, width: 24 }}
                />
              }
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
              <div
                className="userProfile"
              >
                <HiOutlineUser
                  style={{ height: 20, width: 22, color: "#fff" }}
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
