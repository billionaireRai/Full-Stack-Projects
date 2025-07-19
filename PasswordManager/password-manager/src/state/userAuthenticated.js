"use client"

import { create } from "zustand";
import { persist } from "zustand/middleware";
import useJWTTokens from "@/state/jwtTokens.js";

const useIsUserAuthenticated = create(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      setIsAuthenticated: () => {
        if (!get().isAuthenticated) set({ isAuthenticated: true });
      },

      setIsNotAuthenticated: () => {
        if (get().isAuthenticated){
          set({ isAuthenticated: false });
          useJWTTokens.getState().resetAccessAndRefreshToken();
        }
      },
    }),
    {
      name: "user-auth-storage",
    }
  )
);

export default useIsUserAuthenticated;
