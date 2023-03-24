import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchProducts } from "../../app/features/productSlice";
import { SideBar, Header,NewCampaignForm ,MainPage } from "../../components/index";
import useFetchAllProducts from "../../constant/fetchProducts";
import { useStateContext } from "../../contexts/ContextProvider";
import { useThemeContext } from "../../contexts/ThemeContext";
import "../../index.css";

const CampaignId = () => {
  const { activeMenu, getProducts } = useStateContext();
  const { darkTheme } = useThemeContext();
  const dispatch = useDispatch();
  let data = useFetchAllProducts("/api/2022-10/products.json", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  useEffect(() => {
    if (data) {
      dispatch(fetchProducts(data));
    }
  }, [data, dispatch]);
  return (
    <div className="app">
      {activeMenu ? (
        <div className={darkTheme ? "sidebar" : "sidebar dark"}>
          <SideBar />
        </div>
      ) : (
        <div className={darkTheme ? "sidebar closed" : "sidebar dark"}>
          <SideBar />
        </div>
      )}
      {activeMenu ? (
        <div
          className={darkTheme ? "main__container " : "main__container dark"}
        >
          <MainPage>
            <div className="header">
              <Header />
            </div>
            <NewCampaignForm />
          </MainPage>
        </div>
      ) : (
        <div
          className={
            darkTheme ? "main__container full" : "main__container dark"
          }
        >
          <MainPage>
            <div className="header">
              <Header />
            </div>
            <NewCampaignForm />
          </MainPage>
        </div>
      )}
    </div>
  );
};

export default CampaignId;
