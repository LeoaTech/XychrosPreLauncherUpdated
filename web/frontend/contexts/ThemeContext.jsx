import { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

const initialState = {
  dark: true,
  light: false,
};

export const ThemeProvider = ({ children }) => {
  const [lightTheme, setLightTheme] = useState(false);
  const [darkTheme, setDarkTheme] = useState(true);
  const [theme, setTheme] = useState('dark')

  return (
    <ThemeContext.Provider
      value={{
        lightTheme,
        darkTheme,
        setLightTheme,
        setDarkTheme,
        theme,setTheme
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);
