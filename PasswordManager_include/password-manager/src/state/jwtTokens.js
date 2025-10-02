"use client"

import { create } from "zustand";
import { persist } from "zustand/middleware";

const useJWTTokens = create(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      setAccessAndRefreshToken: (AccTkn, RfhTkn) => {
        set({ accessToken: AccTkn, refreshToken: RfhTkn });
      },
      resetAccessAndRefreshToken: () => {
        if (get().accessToken && get().refreshToken) {
          set({ accessToken: null, refreshToken: null });
        }
      },
    }),
  )
);

export default useJWTTokens;
