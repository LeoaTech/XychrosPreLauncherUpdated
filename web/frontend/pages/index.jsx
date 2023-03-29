import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchCampaign } from "../app/features/campaigns/campaignSlice";
import useFetchCampaignsData from "../constant/fetchCampaignsData";
import { SideBar, Header, HomeComponent, MainPage } from "../components/index";
import { useStateContext } from "../contexts/ContextProvider";
import { useThemeContext } from "../contexts/ThemeContext";
import "../index.css";
import { fetchProducts } from "../app/features/productSlice";
import useFetchAllProducts from "../constant/fetchProducts";
import useFetchSettings from "../constant/fetchGlobalSettings";
import { fetchSettings } from "../app/features/settings/settingsSlice";

export default function HomePage() {
  const { activeMenu } = useStateContext();
  const { darkTheme } = useThemeContext();
  const dispatch = useDispatch();
  const campaigns = useFetchCampaignsData("/api/getcampaigns", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const product = useFetchAllProducts("/api/2022-10/products.json", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const settings = useFetchSettings("/api/updatesettings", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  useEffect(() => {
    if (settings) {
      dispatch(fetchSettings(settings[0]));
    }
  }, [dispatch, settings]);

  useEffect(() => {
    if (campaigns) {
      dispatch(fetchCampaign(campaigns));
    }
  }, [campaigns]);

  useEffect(() => {
    if (product) {
      dispatch(fetchProducts(product));
    }
  }, [dispatch, product]);

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
