import { Suspense, lazy, useEffect } from "react";
import { SideBar, Header, MainPage } from "../components/index";
import { useStateContext } from "../contexts/ContextProvider";
import { useThemeContext } from "../contexts/ThemeContext";
import "../index.css";
import SkeletonLoader from "../components/loading_skeletons/SkeletonTable";

// Code Splitting
const Feedback = lazy(() => import("../components/feedback/Feedback"));

const FeedbackPage = () => {
  const { darkTheme, theme } = useThemeContext();
  // Page render Scroll to Top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
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
            <Feedback />
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default FeedbackPage;
