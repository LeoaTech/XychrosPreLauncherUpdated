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
  const abortController = new AbortController();
  const dispatch = useDispatch();

  // Get Global Settings
  const { data: settings, error: settingsError } = useFetchSettings(
    "/api/updatesettings",
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      signal: abortController.signal,
    }
  );

  // Page render Scroll to Top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Get Default Settings Data
  useEffect(() => {
    if (settings !== undefined) {
      dispatch(fetchSettings({ ...settings }));
    }
    return () => {
      abortController.abort();
    };
  }, [dispatch, settings]);

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
