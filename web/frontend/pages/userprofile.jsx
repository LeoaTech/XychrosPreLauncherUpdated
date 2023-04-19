import { useEffect } from "react";
import { SideBar, Header, UserProfile, MainPage } from "../components/index";
import { useStateContext } from "../contexts/ContextProvider";
import { useThemeContext } from "../contexts/ThemeContext";
import "../index.css";

const UserProfilePage = () => {
  const { activeMenu } = useStateContext();
  const { darkTheme } = useThemeContext();
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
              <UserProfile />
            </div>
          </>
        ) : (
          <>
            <div className="sidebar closed">
              <SideBar />
            </div>
            <div className="main-container full">
              <UserProfile />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
