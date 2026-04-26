import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [activeCity, setActiveCity] = useState(null);

  useEffect(() => {
    if (activeCity && activeCity.themeColor) {
      document.documentElement.style.setProperty('--city-theme-color', activeCity.themeColor);
    } else {
      document.documentElement.style.setProperty('--city-theme-color', '#0284c7'); // Default Electric Blue
    }
  }, [activeCity]);

  return (
    <ThemeContext.Provider value={{ activeCity, setActiveCity }}>
      {children}
    </ThemeContext.Provider>
  );
};
