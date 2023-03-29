import React, { useEffect, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../app/features/productSlice";
import { fetchSettings } from "../app/features/settings/settingsSlice";
import {
  SideBar,
  Header,
  MainPage,
  NewCampaignForm,
} from "../components/index";
import useFetchSettings from "../constant/fetchGlobalSettings";
import useFetchAllProducts from "../constant/fetchProducts";
import { useStateContext } from "../contexts/ContextProvider";
import { useThemeContext } from "../contexts/ThemeContext";
import "../index.css";


const NewCampaign = () => {
  const { activeMenu } = useStateContext();
  const { darkTheme } = useThemeContext();
  const dispatch = useDispatch();
  let productsList = useFetchAllProducts("/api/2022-10/products.json", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const settingsData = useFetchSettings("/api/updatesettings", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  useEffect(() => {
    if (settingsData) {
      dispatch(fetchSettings(settingsData));
    }
  }, [dispatch]);

  useEffect(() => {
    if (productsList.length>0) {
      dispatch(fetchProducts(productsList));
    }
  }, [dispatch,productsList]);

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
        <div
          className={darkTheme ? "main__container " : "main__container dark"}
        >
          <MainPage>
            <div className="header">
              <Header />
            </div>

            {/* <React.Suspense fallback={<Spinner size="large" />}> */}
            <NewCampaignForm />
            {/* </React.Suspense> */}
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
            {settingsData.length > 0 && data !== undefined ? (
              <NewCampaignForm />
            ) : (
              <h1
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100vh",
                  fontSize: 12,
                  color: "#fff",
                }}
              >
                Loading...
              </h1>
            )}
          </MainPage>
        </div>
      )}
    </div>
  );
};

export default NewCampaign;
