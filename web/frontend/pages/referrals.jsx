import React from "react";
import { SideBar, Header, Referral, MainPage } from "../components/index";
import { useStateContext } from "../contexts/ContextProvider";
import { useThemeContext } from "../contexts/ThemeContext";

const Referrals = () => {
  const { activeMenu } = useStateContext();
  const { darkTheme } = useThemeContext();

  return (
    <div className="app">
      {activeMenu ? (
        <div className={darkTheme ? "sidebar" : "sidebar dark"}>
          <SideBar />
        </div>
      ) : (
        <div className={darkTheme ? "sidebar" : "sidebar dark"}>
          <SideBar />
        </div>
      )}
      {activeMenu ? (
        <div className={darkTheme ? "main__container dark" : "main__container"}>
          <MainPage>
            <div className="header">
              <Header />
            </div>
            <Referral />
          </MainPage>
        </div>
      ) : (
        <div className={darkTheme ? "main__container dark" : "main__container"}>
          <MainPage>
            <div className="header">
              <Header />
            </div>
            <Referral />
          </MainPage>
        </div>
      )}
    </div>
  );
};

export default Referrals;
