import { SideBar, Header,NewCampaignForm ,MainPage } from "../../components/index";
import { useStateContext } from "../../contexts/ContextProvider";
import { useThemeContext } from "../../contexts/ThemeContext";
import "../../index.css";

const CampaignId = () => {
  const { activeMenu } = useStateContext();
  const { darkTheme } = useThemeContext();
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
