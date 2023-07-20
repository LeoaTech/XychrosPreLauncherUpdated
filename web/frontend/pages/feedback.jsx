import { Suspense, lazy, useEffect } from "react";
import { SideBar, Header, MainPage } from "../components/index";
import { useStateContext } from "../contexts/ContextProvider";
import { useThemeContext } from "../contexts/ThemeContext";
import "../index.css";


// Code Splitting
const Feedback = lazy(() => import("../components/feedback/Feedback"));


const FeedbackPage = () => {
  const { activeMenu } = useStateContext();
  const { darkTheme } = useThemeContext();
  // Page render Scroll to Top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])
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
              <Suspense fallback={<div>Loading...</div>}>
                <Feedback />
              </Suspense>
            </div>
          </>
        ) : (
          <>
            <div className="sidebar closed">
              <SideBar />
            </div>
            <div className="main-container full">
              <Suspense fallback={<div>Loading...</div>}>
                <Feedback />
              </Suspense>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FeedbackPage;
