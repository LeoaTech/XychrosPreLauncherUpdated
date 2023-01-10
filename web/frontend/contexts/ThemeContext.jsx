import { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

const initialState = {
  dark: true,
  light: false,
};

export const ThemeProvider = ({ children }) => {
  const [lightTheme, setLightTheme] = useState(false);
  const [darkTheme, setDarkTheme] = useState(true);

  return (
    <ThemeContext.Provider
      value={{
        lightTheme,
        darkTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);
