import { useEffect, useState } from "react";
import { createContext, useContext } from "react";

const CampaignContext = createContext();

export const CampaignsProvider = ({ children }) => {
  const [isEdit, setIsEdit] = useState(false);

  return (
    <CampaignContext.Provider
      value={{
        activeMenu,
        setActiveMenu,
        screenSize,
        setScreenSize,
        mobileMenu,
        setMobileMenu,
        isEdit,
        setIsEdit,
        isViewable,
        setIsViewable,
        updatedCampaigns,
        setUpdatedCampaigns,
        getProducts,
        setGetProducts,
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
};

export const useCampaignContext = () => useContext(CampaignContext);
