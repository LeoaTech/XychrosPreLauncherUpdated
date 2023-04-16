import React, { useEffect } from "react";
import { SideBar, Header, Referral, MainPage } from "../components/index";
import { useStateContext } from "../contexts/ContextProvider";
import { useThemeContext } from "../contexts/ThemeContext";
import "../index.css";

const Referrals = () => {
  const { activeMenu } = useStateContext();
  const { darkTheme, lightTheme } = useThemeContext();
 // Page render Scroll to Top
 useEffect(()=>{
  window.scrollTo(0, 0);
},[])
  return (
    <div className="app">
      {activeMenu ? (
        <div className="header">
          <Header />
        </div>
      ) : (
        <div className="header">
          <Header />
        </div>
      )}
      <div className="main-app">
        {activeMenu ? (
          <>
            <div className="sidebar">
              <SideBar />
            </div>
            <div className="main-container">
              <Referral />
            </div>
          </>
        ) : (
          <>
            <div className="sidebar closed">
              <SideBar />
            </div>
            <div className="main-container full">
              <Referral />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Referrals;
