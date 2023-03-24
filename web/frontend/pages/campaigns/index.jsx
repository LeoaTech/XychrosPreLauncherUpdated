import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllCampaigns,
  fetchCampaignsData,
  getCampaignsError,
  getCampaignsStatus,
} from "../../app/features/campaigns/campaignSlice";
import { SideBar, Header, Campaign, MainPage } from "../../components/index";
import { useStateContext } from "../../contexts/ContextProvider";
import { useThemeContext } from "../../contexts/ThemeContext";
import { useAuthenticatedFetch } from "../../hooks";

const Campaigns = () => {
  const { activeMenu } = useStateContext();
  const { darkTheme } = useThemeContext();
  const fetch = useAuthenticatedFetch();
  const dispatch = useDispatch();

  return (
    <div className="app">
      {activeMenu ? (
        <div className={darkTheme ? "sidebar" : "sidebar dark"}>
          <SideBar />
        </div>
      ) : (
        <div className={darkTheme ? "sidebar closed" : "sidebar dark"}>
          <SideBar />
        </div>
      )}
      {activeMenu ? (
        <div className={darkTheme ? "main__container" : "main__container dark"}>
          <MainPage>
            <div className="header">
              <Header />
            </div>
            <Campaign />
          </MainPage>
        </div>
      ) : (
        <div
          className={
            darkTheme ? "main__container full" : "main__container dark"
          }
        >
          <MainPage>
            <div className="header">
              <Header />
            </div>
            <Campaign />
          </MainPage>
        </div>
      )}
    </div>
  );
};

export default Campaigns;
