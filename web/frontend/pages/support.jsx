import React, { useEffect, lazy, Suspense } from "react";
import { SideBar, Header, MainPage } from "../components/index";
import { useStateContext } from "../contexts/ContextProvider";
import { useThemeContext } from "../contexts/ThemeContext";
import "../index.css";
import SkeletonLoader from "../components/loading_skeletons/SkeletonTable";

const Support = lazy(() => import("../components/support/SupportComponent"));

const SupportPage = () => {
  const { activeMenu } = useStateContext();
  const { darkTheme } = useThemeContext();
  // Page render Scroll to Top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
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
                <Support />
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
                <Support />
              </Suspense>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SupportPage;
