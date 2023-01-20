import { SideBar, Header, HomeComponent, MainPage} from "../components/index";
import { useStateContext } from "../contexts/ContextProvider";
import { useThemeContext } from "../contexts/ThemeContext";
import "../index.css";
export default function HomePage() {
  const {activeMenu}  = useStateContext()
  const {darkTheme,lightTheme} = useThemeContext()
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
     { activeMenu ? <div className={darkTheme ? "main__container":"main__container dark"}>
        <MainPage className="sidebar-overlay">
          <div className="header">
            <Header />
          </div>
          <HomeComponent />
        </MainPage>
      </div>:  <div className={darkTheme ? "main__container full":"main__container dark"}>
        <MainPage className="sidebar-overlay">
          <div className="header">
            <Header />
          </div>
          <HomeComponent />
        </MainPage>
      </div>}
    </div>
  );
}
