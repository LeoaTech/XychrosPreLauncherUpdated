import { Suspense, lazy, useEffect } from "react";
import { SideBar, Header } from "../components/index";
import { useStateContext } from "../contexts/ContextProvider";
import "../index.css";
import useFetchPricingPlans from "../constant/fetchPricingPlans";
import { fetchpricing } from "../app/features/pricing/pricing";
import { useDispatch } from "react-redux";
import { fetchSavePlan } from "../app/features/current_plan/current_plan";
import useFetchBillingModel from "../constant/fetchBillingModel";
import SkeletonLoader from "../components/loading_skeletons/SkeletonTable";

const Pricing = lazy(() => import("../components/pricing/PriceComponent"));

const PricePage = () => {
  const { activeMenu } = useStateContext();
  const dispatch = useDispatch();

  // Page render Scroll to Top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const response = useFetchPricingPlans("/api/pricing-plans", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Get Current Active Plan Billing Details

  const billing = useFetchBillingModel("/api/subscribe-plan", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Get All Pricing Details with Features
  useEffect(() => {
    if (response.length > 0) {
      dispatch(fetchpricing(response));
    }
  }, [dispatch, response]);

  // Dispatch Active plan data to App Store
  useEffect(() => {
    if (billing) {
      dispatch(fetchSavePlan(billing)); //Save Current Billing Details in App Store
    }
  }, [dispatch, billing]);

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
                <Pricing />
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
                <Pricing />
              </Suspense>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PricePage;
