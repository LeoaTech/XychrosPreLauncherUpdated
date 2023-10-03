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

const UserProfile = lazy(() => import("../components/user/UserProfile"));

const UserProfilePage = () => {
  const { activeMenu } = useStateContext();
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

  const {data:billing,error:billingError} = useFetchBillingModel("/api/subscribe-plan", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    signal: abortController.signal,
  });

  // Page render Scroll to Top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (userDetails?.length > 0) {
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

  console.log(billing);
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
                <UserProfile />
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
                <UserProfile />
              </Suspense>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
