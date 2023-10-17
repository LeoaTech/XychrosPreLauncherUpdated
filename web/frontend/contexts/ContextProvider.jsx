import { useEffect, useState } from "react";
import { createContext, useContext } from "react";

const StateContext = createContext();

export const ContextProvider = ({ children }) => {
  // All shareable state
  const [activeMenu, setActiveMenu] = useState(true);
  const [screenSize, setScreenSize] = useState(undefined);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formErrors, SetFormErrors] = useState({
    requiredInputName:false,
    campaignNameError:false,
    LaunchProductError:false,
    isReward2Error:false,
    isReward3Error:false,
    isReward4Error:false,
    discountCode1:false,
    discountCode2:false,
    discountCode3:false,
    discountCode4:false,
    rewardTierValidate:false,
    discountInvalidError:false,
    

  });
 
  return (
    <StateContext.Provider
      value={{
        activeMenu,
        setActiveMenu,
        screenSize,
        setScreenSize,
        mobileMenu,
        setMobileMenu,
        isEdit,
        setIsEdit,
        formErrors, SetFormErrors
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
