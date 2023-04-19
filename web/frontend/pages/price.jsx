import { useEffect } from "react";
import { SideBar, Header, Pricing, MainPage } from "../components/index";
import { useStateContext } from "../contexts/ContextProvider";
import "../index.css";

const PricePage = () => {
  const { activeMenu } = useStateContext();
   // Page render Scroll to Top
   useEffect(()=>{
    window.scrollTo(0, 0);
  },[])
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
              <Pricing />
            </div>
          </>
        ) : (
          <>
            <div className="sidebar closed">
              <SideBar />
            </div>
            <div className="main-container full">
              <Pricing />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PricePage;
