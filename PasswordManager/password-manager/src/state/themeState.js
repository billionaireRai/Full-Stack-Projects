"use client"

import { create } from "zustand";
import { persist } from "zustand/middleware";

const useThemeToggler = create(
  persist(
    (set) => ({
      theme: "light",
      toggleTheme: () => {
        set((state) => ({
          theme: state.theme === "light" ? "dark" : "light",
        }));
      },
    }),
    {
      name: "theme-storage",
    }
  )
);

export default useThemeToggler;
