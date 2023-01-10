import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import {
  MdSettings,
  MdAdd,
  MdOutlineMessage,
} from "react-icons/md";
import { FaHome, FaBullhorn } from "react-icons/fa";
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
  const [isActive, setIsActive] = useState(false);

  const handleToggle = () => {
    if (activeMenu && screenSize <= 786) {
      setActiveMenu(false);
    }
  };

  const links = [
    {
      title: "Home",
      path: "/home",
      icon: <FaHome />,
    },
    {
      title: "Campaigns",
      path: "/campaigns",
      icon: <FaBullhorn />,
    },
    {
      title: "Referrals",
      path: "/referrals",
      icon: <img src={Omnichannnel} alt="referral" />,
    },
    {
      title: "Settings",
      path: "/settings",
      icon: <MdSettings style={{ color: "#fff" }} />,
    },
    {
      title: "Integrations",
      path: "/integrations",
      icon: <img src={webhook} alt="integrations" style={{ color: "#fff" }} />,
    },
    {
      title: "Support",
      path: "/support",
      icon: (
        <img
          src={CustomerSupport}
          alt="integrations"
          style={{ color: "#fff" }}
        />
      ),
    },
   
  ];

  return (
    <div className="sidebar-container">
      {activeMenu && (
        <>
          <div className="top">
            <div className="sidebar-content">
              <div className="sidebar_header">
                <img
                  onClick={handleToggle}
                  src={SideLogo}
                  alt="Logo"
                  className="sidebar-logo"
                />
                <img
                  onClick={handleToggle}
                  src={Logo}
                  alt="Logo"
                  className="onlylogo"
                />
              </div>
              {/* <button className="menu-toggle-icon">
              <MdOutlineCancel
                style={{ color: "#fff", height: "35px", width: "35px" }}
              />
            </button> */}
            </div>

            {/* Add Campaign Link */}

            <div className="add-btn-link">
              <button>
                <NavLink
                  to="/newcampaign"
                  onClick={handleToggle}
                  className="sidebar-add-btn"
                >
                  <span className="icon-img">
                    <MdAdd />
                  </span>
                  {activeMenu && <p className="add-icon-text">New Campaign</p>}
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
                    {activeMenu && <p className="icon-text">{link.title}</p>}
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
                  <MdOutlineMessage />
                </span>
                {activeMenu && <p className="icon-text">Feedback</p>}
              </NavLink>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SideBar;
