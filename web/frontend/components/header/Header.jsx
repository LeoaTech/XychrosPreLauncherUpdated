import React, { useEffect } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { MdOutlinePriceChange } from "react-icons/md";
import { CgNotes } from "react-icons/cg";
import { HiOutlineUser } from "react-icons/hi";
import "./header.css";

import { useStateContext } from "../../contexts/ContextProvider";
import { SideLogo } from "../../assets/index";

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
    isClicked,
    setIsClicked,
    handleClick,
    screenSize,
    setScreenSize,
  } = useStateContext();

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
    } else if (screenSize < 980) {
      setActiveMenu(false);
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
          onClick={() => setActiveMenu(!activeMenu)}
        />
      </div>

      <div className="right">
        {/* price , profile,faq*/}
        <div className="right-links">
          <NavButton
            title="Pricing"
            customFunction={() => handleClick("Price")}
            color="#fff"
            icon={
              <MdOutlinePriceChange style={{ height: "35px", width: "35px" }} />
            }
          />
          <NavButton
            title="FAQs"
            customFunction={() => handleClick("Faq")}
            color="#fff"
            icon={<CgNotes style={{ height: "30px", width: "30px" }} />}
          />

          <div>
            <div
              className="userProfile"
              onClick={() => handleClick("UserProfile")}
            >
              <HiOutlineUser style={{ height: "30px", width: "30px", color:"#fff" }} />
              {/* <button>
                <MdOutlineKeyboardArrowDown
                  style={{ height: "25px", width: "28px" , fontSize:24, color: "white" }}
                />
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
