import React, { useEffect, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllProducts,
  fetchProductsData,
  getProductsStatus,
} from "../app/features/productSlice";
import {
  fetchAllSettings,
  fetchGlobalSettings,
  getSettingsStatus,
} from "../app/features/settings/settingsSlice";
import {
  SideBar,
  Header,
  MainPage,
  NewCampaignForm,
} from "../components/index";
import Spinner from "../components/ui/Spinner";
import useFetchSettings from "../constant/fetchGlobalSettings";
import useFetchAllProducts from "../constant/fetchProducts";
import { useStateContext } from "../contexts/ContextProvider";
import { useThemeContext } from "../contexts/ThemeContext";
import "../index.css";

// const NewCampaignForm = React.lazy(() => import("../components/index"));

const NewCampaign = () => {
  const { activeMenu } = useStateContext();
  const { darkTheme } = useThemeContext();
  const dispatch = useDispatch();
  // let data = useFetchAllProducts("/api/2022-10/products.json", {
  //   method: "GET",
  //   headers: { "Content-Type": "application/json" },
  // });

  // const settingsData = useFetchSettings("/api/updatesettings", {
  //   method: "GET",
  //   headers: { "Content-Type": "application/json" },
  // });

  useEffect(() => {
    if (getSettingsStatus === false) {
      dispatch(fetchGlobalSettings());
    }
  }, [dispatch]);
  const srfdata = useSelector(fetchAllSettings)
  console.log(srfdata);
  
  useEffect(() => {
    if (getProductsStatus) {
      dispatch(fetchProductsData());
    }
  }, [dispatch]);
  const mydata = useSelector(fetchAllProducts)
  console.log(mydata);
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
