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
import { fetchSavePlan } from "../app/features/current_plan/current_plan";
import useFetchCurrentPlan from "../constant/fetchCurrentPlan";
import useFetchPricingPlans from "../constant/fetchPricingPlans";

export default function HomePage() {
  const { activeMenu } = useStateContext();
  const { darkTheme } = useThemeContext();
  const dispatch = useDispatch();
  // Page render Scroll to Top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])

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
  const pricingPlans = useFetchPricingPlans("/api/pricing-plans", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }); 
  const activePlan = useFetchCurrentPlan("/api/get-current-app", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });


  const freePlan = pricingPlans?.find((plan) => plan?.plan_name === 'Free')

  let planName;
  useEffect(() => {
    if (activePlan) {
      planName = activePlan?.name

      if (Object.keys(activePlan).length > 0) {
        const saveCurrentPlan = pricingPlans?.find((plan) => plan?.plan_name === planName);
        let currentActivePlan = { ...saveCurrentPlan, subscribe_id: activePlan?.id, status: activePlan?.status, billing_required: true }
        dispatch(fetchSavePlan(currentActivePlan));
      } else {
        dispatch(fetchSavePlan(freePlan));
      }
    }
  }, [dispatch, activePlan]);



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
              <HomeComponent />
            </div>
          </>
        ) : (
          <>
            <div className="sidebar closed">
              <SideBar />
            </div>
            <div className="main-container full">
              <HomeComponent />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
