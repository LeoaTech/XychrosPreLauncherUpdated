import { Suspense, lazy, useEffect } from "react";
import { SideBar, Header } from "../components/index";
import { useStateContext } from "../contexts/ContextProvider";
import "../index.css";
import useFetchUserDetails from "../constant/fetchUserDetails";
import { useDispatch } from "react-redux";
import { SaveUser } from "../app/features/users/userSlice";
import useFetchPricingPlans from "../constant/fetchPricingPlans";
import { fetchpricing } from "../app/features/pricing/pricing";
import { fetchSavePlan } from "../app/features/current_plan/current_plan";
import useFetchBillingModel from "../constant/fetchBillingModel";
import SkeletonLoader from "../components/loading_skeletons/SkeletonTable";
import { useThemeContext } from "../contexts/ThemeContext";

const UserProfile = lazy(() => import("../components/user/UserProfile"));

const UserProfilePage = () => {
  const { theme } = useThemeContext();
  const abortController = new AbortController();

  const dispatch = useDispatch();

  const { data: userDetails, error: userDetailsError } = useFetchUserDetails(
    "/api/userprofile",
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      signal: abortController.signal,
    }
  );

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

  const { data: billing, error: billingError } = useFetchBillingModel(
    "/api/subscribe-plan",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal: abortController.signal,
    }
  );

  // Page render Scroll to Top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (userDetails !== undefined) {
      dispatch(SaveUser(userDetails));
    }
    return () => {
      abortController.abort();
    };
  }, [userDetails]);

  // Dispatch Active plan data to App Store
  useEffect(() => {
    if (billing) {
      dispatch(fetchSavePlan(billing)); //Save Current Billing Details in App Store
    }
    return () => {
      abortController.abort();
    };
  }, [dispatch, billing]);

  // Get All Pricing Details with Features
  useEffect(() => {
    if (pricingData?.length > 0) {
      dispatch(fetchpricing(pricingData));
    }
    return () => {
      abortController.abort();
    };
  }, [dispatch, pricingData]);

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
            <UserProfile />
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default UserProfilePage;
