import React, { useEffect, Suspense, lazy } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../app/features/productSlice";
import { fetchSettings } from "../app/features/settings/settingsSlice";
import { SideBar, Header } from "../components/index";
import useFetchSettings from "../constant/fetchGlobalSettings";
import useFetchAllProducts from "../constant/fetchProducts";
import { useStateContext } from "../contexts/ContextProvider";
import { useThemeContext } from "../contexts/ThemeContext";
import "../index.css";
import SkeletonLoader from "../components/loading_skeletons/SkeletonTable";

const NewCampaignForm = lazy(() =>
  import("../components/newcampaign/NewCampaignForm")
);

const NewCampaign = () => {
  const { activeMenu } = useStateContext();
  const { darkTheme } = useThemeContext();
  const dispatch = useDispatch();
  // Page render Scroll to Top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  let productsList = useFetchAllProducts("/api/2022-10/products.json", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const settingsData = useFetchSettings("/api/updatesettings", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  useEffect(() => {
    if (settingsData?.length > 0) {
      dispatch(fetchSettings(settingsData));
    }
  }, [dispatch, settingsData]);

  useEffect(() => {
    if (productsList?.length > 0) {
      dispatch(fetchProducts(productsList));
    }
  }, [dispatch, productsList]);

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
              <Suspense fallback={<SkeletonLoader />}>
                <NewCampaignForm />
              </Suspense>
            </div>
          </>
        ) : (
          <>
            <div className="sidebar closed">
              <SideBar />
            </div>
            <div className="main-container full">
              <Suspense fallback={<SkeletonLoader />}>
                <NewCampaignForm />
              </Suspense>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NewCampaign;
