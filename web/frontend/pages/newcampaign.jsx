import React, { useEffect, Suspense, lazy } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../app/features/productSlice";
import { fetchSettings } from "../app/features/settings/settingsSlice";
import { SideBar, Header } from "../components/index";
import useFetchSettings from "../constant/fetchGlobalSettings";
import useFetchAllProducts from "../constant/fetchProducts";
import { useStateContext } from "../contexts/ContextProvider";
import "../index.css";
import SkeletonLoader from "../components/loading_skeletons/SkeletonTable";
import useFetchCampaignsDetails from "../constant/fetchCampaignDetails";
import { fetchCampaignDetails } from "../app/features/campaign_details/campaign_details";

const NewCampaignForm = lazy(() =>
  import("../components/newcampaign/NewCampaignForm")
);

const NewCampaign = () => {
  const { activeMenu } = useStateContext();

  const dispatch = useDispatch();
  // Page render Scroll to Top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Get Campaign details List
  const campaignsDetails = useFetchCampaignsDetails("/api/campaigndetails", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

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

  useEffect(() => {
    if (campaignsDetails?.length > 0) {
      dispatch(fetchCampaignDetails(campaignsDetails));
    }
  }, [campaignsDetails, dispatch]);

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
