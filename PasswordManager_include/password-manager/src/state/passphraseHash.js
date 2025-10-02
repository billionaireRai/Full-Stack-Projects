"use client"

import { create } from "zustand";
import { persist } from "zustand/middleware";

const useUserPassPhraseHash = create(
  persist(
    (set) => ({
      PassPhraseHashValue: null, // state variable holding the value of encryptionKey...
      // function for setting it...
      setPassPhraseHashValue: (PassPhraseHashValue) => {
        set({ PassPhraseHashValue });
      },
      // function for resetting it on user logout...
      resetPassPhraseHashValue: () => {
        set({ PassPhraseHashValue: null });
      },
    }),
    {
      name: "PassPhraseHashValue-storage",
      getStorage: () => localStorage
    }
  )
);

export default useUserPassPhraseHash;
