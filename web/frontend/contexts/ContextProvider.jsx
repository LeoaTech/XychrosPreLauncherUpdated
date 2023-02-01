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
  const [mobileMenu, setMobileMenu] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isViewable, setIsViewable] = useState(false);

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
        screenSize,
        setScreenSize,
        mobileMenu,
        setMobileMenu,
        isEdit,
        setIsEdit,
        isViewable,
        setIsViewable
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
