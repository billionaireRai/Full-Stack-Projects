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
          const { resetAccessAndRefreshToken } = require('./jwtTokens').default(); // ✅ Lazy load hook
          set({ isAuthenticated: false });
          resetAccessAndRefreshToken(); // ✅ Token reset after logout
        }
      },
    }),
    {
      name: 'user-authenticity-stored',
    }
  )
);

export default useIsUserAuthenticated;
