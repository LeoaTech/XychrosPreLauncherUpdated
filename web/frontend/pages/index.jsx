import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  fetchCampaign,
  fetchAllCampaigns,
} from "../app/features/campaigns/campaignSlice";
import useFetchCampaignsData from "../constant/fetchCampaignsData";
import { SideBar, Header, HomeComponent, MainPage } from "../components/index";
import { useStateContext } from "../contexts/ContextProvider";
import { useThemeContext } from "../contexts/ThemeContext";
import "../index.css";
import { useSelector } from "react-redux";

export default function HomePage() {
  const { activeMenu } = useStateContext();
  const { darkTheme, lightTheme } = useThemeContext();
  const dispatch = useDispatch();
  let data = useFetchCampaignsData("/api/getcampaigns", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  useEffect(() => {
    if (data) {
      dispatch(fetchCampaign(data));
    }
  }, [dispatch, data]);

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
          <MainPage className="sidebar-overlay">
            <div className="header">
              <Header />
            </div>
            <HomeComponent />
          </MainPage>
        </div>
      ) : (
        <div
          className={
            darkTheme ? "main__container full" : "main__container dark"
          }
        >
          <MainPage className="sidebar-overlay">
            <div className="header">
              <Header />
            </div>
            <HomeComponent />
          </MainPage>
        </div>
      )}
    </div>
  );
}
