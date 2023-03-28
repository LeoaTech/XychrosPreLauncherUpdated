import { useEffect, useState } from "react";
import { createContext, useContext } from "react";

const StateContext = createContext();

export const ContextProvider = ({ children }) => {
  // All shareable state
  const [activeMenu, setActiveMenu] = useState(true);
  const [screenSize, setScreenSize] = useState(undefined);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

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
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
