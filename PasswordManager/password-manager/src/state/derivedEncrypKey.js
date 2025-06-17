"use client"

import { create } from "zustand";
import { persist } from "zustand/middleware";

const useUserDerivedEncryptionKey = create(
  persist(
    (set) => ({
      encryptionKeyValue: null, // state variable holding the value of encryptionKey...
      // function for setting it...
      setEncryptionKeyValue: (encryptionKeyValue) => {
        set({ encryptionKeyValue });
      },
      // function for resetting it on user logout...
      resetEncryptionKeyValue: () => {
        set({ encryptionKeyValue: null });
      },
    }),
    {
      name: "encryption-key-storage",
      getStorage: () => localStorage
    }
  )
);

export default useUserDerivedEncryptionKey;
