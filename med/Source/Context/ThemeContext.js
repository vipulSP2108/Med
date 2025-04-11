import React, { createContext, useState, useEffect, useContext } from 'react';
import { Appearance } from 'react-native';
import { darkColors, lightColors } from '../Style/Colors';
import { GlobalStateContext } from './GlobalStateContext';
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { darkMode } = useContext(GlobalStateContext);
  const [themeColors, setThemeColors] = useState(darkColors);
  
  const toggleTheme = () => {
    const newMode = !darkMode;
    // setIsDarkMode(newMode);
    setThemeColors(newMode ? darkColors : lightColors);
  };

  useEffect(() => {
    setThemeColors(darkMode ? darkColors : lightColors);
  }, [darkMode])

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      // setIsDarkMode(colorScheme === 'dark');
      setThemeColors(colorScheme === 'dark' ? darkColors : lightColors);
    });
    return () => subscription.remove();
  }, []);

  return (
    <ThemeContext.Provider value={{ themeColors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};