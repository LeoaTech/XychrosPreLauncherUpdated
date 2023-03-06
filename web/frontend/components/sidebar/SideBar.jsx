import React, { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { HiOutlineUser } from "react-icons/hi";
import {
  MdSettings,
  MdAdd,
  MdOutlineMessage,
  MdOutlineClose,
  MdOutlinePriceChange,
} from "react-icons/md";
import { CgNotes } from "react-icons/cg";
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
  const { activeMenu, setActiveMenu, screenSize, mobileMenu } =
    useStateContext();

  // const [isActive, setIsActive] = useState(false);

  const handleToggle = () => {
    if (activeMenu && screenSize <= 786) {
      setActiveMenu(false);
    }
  };

  const links = [
    {
      title: "Home",
      path: "/",
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
                style={{ height: 40, width: 40 }}
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

          <div className="add-btn-link">
            <button>
              <NavLink
                to="/newcampaign"
                onClick={handleToggle}
                className="sidebar-add-btn"
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
                  <HiOutlineUser
                    style={{ height: "30px", width: "30px", color: "#fff" }}
                  />{" "}
                </span>
                <p className="icon-text">User Profile</p>
              </NavLink>
            )}

            {mobileMenu && (
              <NavLink
                to="/faq"
                onClick={handleToggle}
                className={({ isActive }) =>
                  isActive ? "activelink" : "normallink"
                }
              >
                <span className="icon-img">
                  <CgNotes style={{ height: "30px", width: "30px" }} />{" "}
                </span>
                <p className="icon-text">FAQ</p>
              </NavLink>
            )}
            {mobileMenu && (
              <NavLink
                to="/price"
                onClick={handleToggle}
                className={({ isActive }) =>
                  isActive ? "activelink" : "normallink"
                }
              >
                <span className="icon-img">
                  <MdOutlinePriceChange
                    style={{ height: "30px", width: "30px" }}
                  />{" "}
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
