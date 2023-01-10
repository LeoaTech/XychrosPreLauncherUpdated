import React from 'react'
import { SideBar, Header, Campaign, MainPage} from "../components/index";
import { useStateContext } from "../contexts/ContextProvider";
import { useThemeContext } from '../contexts/ThemeContext';

const Campaigns = () => {
  const {activeMenu}  = useStateContext();
  const {darkTheme} = useThemeContext()

  return (
    <div className="app">
    {activeMenu ? (
      <div className={darkTheme ?"sidebar":"sidebar dark"}>
        <SideBar />
      </div>
    ) : (
      <div className={darkTheme ?"sidebar":"sidebar dark"}>
        <SideBar />
      </div>
    )}
   { activeMenu ? <div className={darkTheme ? "main__container dark":"main__container"}>
      <MainPage>
        <div className="header">
          <Header />
        </div>
        <Campaign />
      </MainPage>
    </div>:  <div className={darkTheme ?"main__container dark": "main__container"}>
      <MainPage>
        <div className="header">
          <Header />
        </div>
        <Campaign />
      </MainPage>
    </div>}
  </div>
  )
}

export default Campaigns