import { useEffect, lazy, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllSettings,
  fetchSettings,
} from "../app/features/settings/settingsSlice";
import { SideBar, Header } from "../components/index";
import useFetchSettings from "../constant/fetchGlobalSettings";
import { useThemeContext } from "../contexts/ThemeContext";
import "../index.css";
import SkeletonLoader from "../components/loading_skeletons/SkeletonTable";

const Settings = lazy(() => import("../components/settings/SettingComponent"));

const SettingsPage = () => {
  const { theme } = useThemeContext();
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
            <Settings />
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
