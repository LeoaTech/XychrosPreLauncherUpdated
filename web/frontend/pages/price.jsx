import { Suspense, lazy, useEffect } from "react";
import { SideBar, Header } from "../components/index";
import "../index.css";
import useFetchPricingPlans from "../constant/fetchPricingPlans";
import { fetchpricing } from "../app/features/pricing/pricing";
import { useDispatch } from "react-redux";
import { fetchSavePlan } from "../app/features/current_plan/current_plan";
import useFetchBillingModel from "../constant/fetchBillingModel";
import SkeletonLoader from "../components/loading_skeletons/SkeletonTable";
import { useThemeContext } from "../contexts/ThemeContext";

const Pricing = lazy(() => import("../components/pricing/PriceComponent"));

const PricePage = () => {
  const { theme } = useThemeContext();
  const abortController = new AbortController();

  const dispatch = useDispatch();

  // Page render Scroll to Top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data: pricingData, error: pricingError } = useFetchPricingPlans(
    "/api/pricing-plans",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal: abortController.signal,
    }
  );

  // Get Current Active Plan Billing Details

  const { data: billingData, error: billingError } = useFetchBillingModel(
    "/api/subscribe-plan",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal: abortController.signal,
    }
  );

  // Get All Pricing Details with Features
  useEffect(() => {
    if (pricingData?.length > 0) {
      dispatch(fetchpricing(pricingData));
    }
    return () => {
      abortController.abort();
    };
  }, [dispatch, pricingData]);

  // Dispatch Active plan data to App Store
  useEffect(() => {
    if (billingData) {
      dispatch(fetchSavePlan(billingData)); //Save Current Billing Details in App Store
    }
    return () => {
      abortController.abort();
    };
  }, [dispatch, billingData]);

  return (
    <div className={theme === "dark" ? "app" : "app-light"}>
      <input type="checkbox" name="" id="menu-toggle" />
      <div className="overlay">
        <label htmlFor="menu-toggle"> </label>
      </div>
      <div className="sidebar">
        <div className="sidebar-container">
          <SideBar />
        </div>
      </div>
      <div className="main-content">
        <Header />
        <main>
          <Suspense fallback={<SkeletonLoader />}>
            <Pricing />
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default PricePage;
