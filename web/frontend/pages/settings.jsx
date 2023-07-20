import { useEffect, lazy, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllSettings,
  fetchSettings,
} from "../app/features/settings/settingsSlice";
import { SideBar, Header } from "../components/index";
import useFetchSettings from "../constant/fetchGlobalSettings";
import { useStateContext } from "../contexts/ContextProvider";
import { useThemeContext } from "../contexts/ThemeContext";
import "../index.css";
import SkeletonLoader from "../components/loading_skeletons/SkeletonTable";

const Settings = lazy(() => import("../components/settings/SettingComponent"));

const SettingsPage = () => {
  const { activeMenu } = useStateContext();
  const { darkTheme } = useThemeContext();
  const dispatch = useDispatch();
  // Page render Scroll to Top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const data = useFetchSettings("/api/updatesettings", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  useEffect(() => {
    if (data?.length > 0) {
      dispatch(fetchSettings(data[0]));
    }
  }, [dispatch, data]);
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
                <Settings />
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
                <Settings />
              </Suspense>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
