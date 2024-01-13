import React, { Fragment, useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import {
  MdSettings,
  MdAdd,
  MdOutlineMessage,
  MdOutlineClose,
  MdOutlinePriceChange,
} from "react-icons/md";
import { FaHome, FaUser } from "react-icons/fa";
import { HiSpeakerphone } from "react-icons/hi";
import { GiShipWheel } from "react-icons/gi";
import "./sidebar.css";
import { useStateContext } from "../../contexts/ContextProvider";
import { CustomerSupport, ViralLaunch } from "../../assets/index";

const SideBar = () => {
  const {
    activeMenu,
    setActiveMenu,
    screenSize,
    mobileMenu,
    setMobileMenu,
    setScreenSize,
  } = useStateContext();

  // const [isActive, setIsActive] = useState(false);

  // const handleToggle = () => {
  //   if (activeMenu && screenSize < 700) {
  //     setActiveMenu(false);
  //   }
  // };
  const [blurBackground, setBlurBackground] = useState(false);

  const handleToggle = () => {
    setActiveMenu(!activeMenu);
    setBlurBackground(!activeMenu && screenSize < 700); // Toggle blur when opening the sidebar on mobile
  };

  const handleNavLinkClick = () => {
    if (screenSize < 700) {
      setActiveMenu(false);
      setBlurBackground(false);
    }
  };

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
      setMobileMenu(false);
    } else if (screenSize < 980) {
      setMobileMenu(true);
    }
  }, [screenSize]);

  const links = [
    {
      title: "Home",
      path: "/",
      icon: <FaHome style={{ color: "#fff", height: 24, width: 24 }} />,
    },
    {
      title: "Campaigns",
      path: "/campaigns",
      icon: <HiSpeakerphone style={{ color: "#fff", height: 24, width: 24 }} />,
    },
    {
      title: "Referrals",
      path: "/referrals",
      icon: <GiShipWheel style={{ color: "#fff", height: 24, width: 24 }} />,
    },
    {
      title: "Settings",
      path: "/settings",
      icon: <MdSettings style={{ color: "#fff", height: 24, width: 24 }} />,
    },
    {
      title: "Support",
      path: "/support",
      icon: (
        <img
          src={CustomerSupport}
          alt="customer-support"
          style={{ color: "#fff", height: 24, width: 24 }}
        />
      ),
    },
  ];

  return (
    <Fragment>
      <div
        className={`side-bar-container ${
          blurBackground ? "blur-background" : ""
        }`}
      >
        <>
          <div className="top">
            <div className="sidebar-content">
              <div className="sidebar_header">
                
                <span>
                  <img src={ViralLaunch} alt="Logo" className="sidebar-logo" />
                </span>
              </div>
            </div>

            {/* Add Campaign Link */}

            <div className="btn-link-add">
              <button className="add-button">
                <Link to="/newcampaign">
                  <p>
                    <span>
                      <MdAdd className="add-btn-icon" />
                    </span>
                    <span className="add-btn-text">New Campaign</span>
                  </p>
                </Link>
              </button>
            </div>

            {/* Center links */}

            <div className="sidebar_links">
              {links.map((link) => (
                <div key={link.title}>
                  <NavLink
                    to={link.path}
                    key={link.title}
                    // onClick={handleToggle}
                    className={({ isActive }) =>
                      isActive ? "activelink" : "normallink"
                    }
                  >
                    <span className="icon-img">{link.icon}</span>
                    <p className="icon-text">{link.title}</p>
                  </NavLink>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Bottom Links and Mobile View Links */}

          <div className="bottom">
            {" "}
            <div className="sidebar-link-bottom">
              {mobileMenu && (
                <NavLink
                  to="/userprofile"
                  onClick={handleToggle}
                  className={({ isActive }) =>
                    isActive ? "activelink" : "normallink"
                  }
                >
                  <span className="icon-img">
                    <FaUser />{" "}
                  </span>
                  <p className="icon-text">User Profile</p>
                </NavLink>
              )}

              {/* Hide the FAQ Page Link (Temporary)*/}
              {/*
            {mobileMenu && (
              <NavLink
                to="/faq"
                onClick={handleToggle}
                className={({ isActive }) =>
                  isActive ? "activelink" : "normallink"
                }
              >
                <span className="icon-img">
                  <CgNotes />{" "}
                </span>
                <p className="icon-text">FAQ</p>
              </NavLink>
            )} */}
              {mobileMenu && (
                <NavLink
                  to="/price"
                  onClick={handleToggle}
                  className={({ isActive }) =>
                    isActive ? "activelink" : "normallink"
                  }
                >
                  <span className="icon-img">
                    <MdOutlinePriceChange style={{height:24, width:24}}/>{" "}
                  </span>
                  <p className="icon-text">Pricing</p>
                </NavLink>
              )}

              <NavLink
                to="/feedback"
                onClick={handleToggle}
                className={({ isActive }) =>
                  isActive ? "activelink" : "normallink"
                }
              >
                <span className="icon-img">
                  <MdOutlineMessage style={{ height: 24, width: 24 }} />
                </span>
                <p className="icon-text">Feedback</p>
              </NavLink>
            </div>
          </div>
        </>
      </div>
      {/* <div class="sidebar-overlay" onClick={handleToggle}></div> */}
    </Fragment>
  );
};

export default SideBar;
