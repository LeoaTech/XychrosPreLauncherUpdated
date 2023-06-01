import { useEffect } from "react";
import { SideBar, Header, Pricing, MainPage } from "../components/index";
import { useStateContext } from "../contexts/ContextProvider";
import "../index.css";
import useFetchPricingPlans from "../constant/fetchPricingPlans";
import { fetchpricing } from "../app/features/pricing/pricing";
import { useDispatch } from "react-redux";
import useFetchCurrentPlan from "../constant/fetchCurrentPlan";
import {  fetchSavePlan } from "../app/features/current_plan/current_plan";

const PricePage = () => {
  const { activeMenu } = useStateContext();
  const dispatch = useDispatch()
  // Page render Scroll to Top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])
  const response = useFetchPricingPlans("/api/pricing-plans", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  // Get Current Plan Active 
  const response2 = useFetchCurrentPlan("/api/get-current-app", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  let planName;
  // Get All Pricing Details with Features
  useEffect(() => {
    if (response.length > 0) {
      dispatch(fetchpricing(response));
    }
  }, [dispatch, response]);

  const freePlan = response?.find((plan) => plan.plan_name === 'Free')

  // Dispatch Active plan data to App Store  
  useEffect(() => {
    if (response2) {
      planName = response2?.name
      if (Object.keys(response2).length > 0) {
        const saveCurrentPlan = response?.find((plan) => plan.plan_name === planName);
        let currentActivePlan = { ...saveCurrentPlan, subscribe_id: response2?.id, status: response2?.status, billing_required: true }
        dispatch(fetchSavePlan(currentActivePlan));
      } else {
        dispatch(fetchSavePlan(freePlan));
      }
    }
  }, [dispatch, response2]);

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
              <Pricing />
            </div>
          </>
        ) : (
          <>
            <div className="sidebar closed">
              <SideBar />
            </div>
            <div className="main-container full">
              <Pricing />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PricePage;
