import React, { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import {
  MdSettings,
  MdAdd,
  MdOutlineMessage,
  MdOutlineClose,
} from "react-icons/md";
import { FaHome } from "react-icons/fa";
import { HiSpeakerphone } from "react-icons/hi";
import { TbFidgetSpinner } from "react-icons/tb";
import { RiCustomerServiceLine } from "react-icons/ri";
import { GiShipWheel } from "react-icons/gi";
import "./sidebar.css";
import { useStateContext } from "../../contexts/ContextProvider";
import {
  CustomerSupport,
  Logo,
  Omnichannnel,
  profile,
  settings,
  SideLogo,
  webhook,
} from "../../assets/index";

const SideBar = () => {
  const { activeMenu, setActiveMenu, screenSize } = useStateContext();
  // const [isActive, setIsActive] = useState(false);

  const handleToggle = () => {
    if (activeMenu && screenSize <= 786) {
      setActiveMenu(false);
    }
  };

  const links = [
    {
      title: "Home",
      path: "/home",
      icon: <FaHome style={{ color: "#fff", height: 30, width: 30 }} />,
    },
    {
      title: "Campaigns",
      path: "/campaigns",
      icon: <HiSpeakerphone style={{ color: "#fff", height: 30, width: 30 }} />,
    },
    {
      title: "Referrals",
      path: "/referrals",
      icon: <GiShipWheel style={{ color: "#fff", height: 30, width: 30 }} />,
    },
    {
      title: "Settings",
      path: "/settings",
      icon: <MdSettings style={{ color: "#fff", height: 30, width: 30 }} />,
    },
    {
      title: "Integrations",
      path: "/integrations",
      icon: (
        <TbFidgetSpinner style={{ color: "#fff", height: 30, width: 30 }} />
      ),
    },
    {
      title: "Support",
      path: "/support",
      icon: (
        <RiCustomerServiceLine
          style={{ color: "#fff", height: 30, width: 30 }}
        />
      ),
    },
  ];

  return (
    <div className="sidebar-container">
      <>
        <div className="top">
          <div className="sidebar-content">
            <div className="sidebar_header">
              <MdOutlineClose
                className="close-menubtn"
                style={{ height: 30, width: 35 }}
                onClick={() => setActiveMenu(false)}
              />
              <img
                // onClick={() => setActiveMenu((prev) => !prev)}
                src={SideLogo}
                alt="Logo"
                className="sidebar-logo"
              />
              {/*  {activeMenu ? (
                
              ) : (
                <img
                  // onClick={() => setActiveMenu((prev) => !prev)}
                  src={Logo}
                  alt="Logo"
                  className="onlylogo"
                />
              )} */}
            </div>
          </div>

          {/* Add Campaign Link */}

          <div className={activeMenu ? "add-btn-link" : "addbtn-link"}>
            <button>
              <NavLink
                to="/newcampaign"
                onClick={handleToggle}
                className={activeMenu ? "sidebar-add-btn" : "sidebar-add-icon"}
              >
                <span className="add-icon-img">
                  <MdAdd style={{ height: 30, width: 30 }} />
                </span>
                <p className="add-icon-text">New Campaign</p>
              </NavLink>
            </button>
          </div>

          {/* Center links */}

          <div className="sidebar_links">
            {links.map((link) => (
              <div key={link.title}>
                <NavLink
                  to={link.path}
                  key={link.title}
                  onClick={handleToggle}
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

        <div className="bottom">
          {" "}
          <div className="sidebar-link-bottom">
            <NavLink
              to="/feedback"
              onClick={handleToggle}
              className={({ isActive }) =>
                isActive ? "activelink" : "normallink"
              }
            >
              <span className="icon-img">
                <MdOutlineMessage style={{ height: 30, width: 30 }} />
              </span>
              <p className="icon-text">Feedback</p>
            </NavLink>
          </div>
        </div>
      </>
    </div>
  );
};

export default SideBar;
