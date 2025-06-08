'use client'

import React, { useEffect } from "react";
import useThemeToggler from "../state/themeState";

const ThemeProvider = ({ children }) => {
  const theme = useThemeToggler(state => state.theme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <>
      {children}
    </>
  );
};

export default ThemeProvider;
