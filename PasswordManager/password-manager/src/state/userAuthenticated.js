"use client"

import { create } from "zustand";
import { persist } from "zustand/middleware";

const useIsUserAuthenticated = create(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      setIsAuthenticated: () => {
        if (!get().isAuthenticated) set({ isAuthenticated: true });
      },

      setIsNotAuthenticated: () => {
        if (get().isAuthenticated){
          const { resetAccessAndRefreshToken } = require('@/state/jwtTokens.js').default(); // Lazy load hook
          set({ isAuthenticated: false });
          resetAccessAndRefreshToken(); // Token reset after logout
        }
      },
    }),
    {
      name: "user-auth-storage",
    }
  )
);

export default useIsUserAuthenticated;
