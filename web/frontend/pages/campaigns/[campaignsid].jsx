import { Suspense, lazy, useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchProducts } from "../../app/features/productSlice";
import { SideBar, Header, MainPage } from "../../components/index";
import useFetchAllProducts from "../../constant/fetchProducts";
import "../../index.css";
import { useThemeContext } from "../../contexts/ThemeContext";
import SkeletonLoader from "../../components/loading_skeletons/SkeletonTable";

const NewCampaignForm = lazy(() =>
  import("../../components/newcampaign/NewCampaignForm")
);

const CampaignId = () => {
  const { theme } = useThemeContext();
  const dispatch = useDispatch();
  const abortController = new AbortController();

  let { data: productsData, error: productsError } = useFetchAllProducts(
    "/api/2022-10/products.json",
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

  useEffect(() => {
    if (productsData?.length > 0) {
      dispatch(fetchProducts(productsData));
    }
    return () => {
      abortController.abort();
    };
  }, [productsData, dispatch]);
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
            <NewCampaignForm />
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default CampaignId;
