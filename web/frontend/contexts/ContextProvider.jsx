import { useState } from "react";
import { createContext, useContext } from "react";

const StateContext = createContext();

const initialState = {
  UserProfile: false,
  Price: false,
  Faq: false,
};

export const ContextProvider = ({ children }) => {
  // All shareable state
  const [activeMenu, setActiveMenu] = useState(true);
  const [isClicked, setIsClicked] = useState(initialState);
  const [screenSize, setScreenSize] = useState(undefined);

  const handleClick = (clicked) => {
    setIsClicked({ ...initialState, [clicked]: true });
  };

  return (
    <StateContext.Provider
      value={{
        activeMenu,
        setActiveMenu,
        setIsClicked,
        isClicked,
        handleClick,
        screenSize,setScreenSize
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
