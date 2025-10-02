"use client"

import { create } from "zustand";
import { persist } from "zustand/middleware";

const useUserDerivedEncryptionKey = create(
  persist(
    (set) => ({
      encryptionKeyValue: null, // state variable holding the value of encryptionKey...
      hasHydrated: false, // flag to indicate hydration status
      // function for setting it...
      setEncryptionKeyValue: (encryptionKeyValue) => {
        set({ encryptionKeyValue });
      },
      // function for resetting it on user logout...
      resetEncryptionKeyValue: () => {
        set({ encryptionKeyValue: null });
      },
      setHasHydrated: (state) => {
        set({ hasHydrated: state });
      }
    }),
    {
      name: "encryption-key-storage",
      getStorage: () => localStorage,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      }
    }
  )
);

export default useUserDerivedEncryptionKey;
