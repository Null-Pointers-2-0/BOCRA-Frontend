"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface ThemeContextType {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    // Load theme from localStorage on mount
    const savedTheme = localStorage.getItem("bocra-theme");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    }
  }, []);

  useEffect(() => {
    // Save theme to localStorage whenever it changes
    localStorage.setItem("bocra-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
