import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchProducts } from "../../app/features/productSlice";
import {
  SideBar,
  Header,
  NewCampaignForm,
  MainPage,
} from "../../components/index";
import useFetchAllProducts from "../../constant/fetchProducts";
import { useStateContext } from "../../contexts/ContextProvider";
import "../../index.css";

const CampaignId = () => {
  const { activeMenu } = useStateContext();
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
              <NewCampaignForm />
            </div>
          </>
        ) : (
          <>
            <div className="sidebar closed">
              <SideBar />
            </div>
            <div className="main-container full">
              <NewCampaignForm />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CampaignId;
