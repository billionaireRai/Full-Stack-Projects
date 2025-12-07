"use client"

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface switchAccountState {
  isPopOpen: boolean;
  setisPopOpen: (value: boolean) => void;
}

const useSwitchAccount = create<switchAccountState>()( persist( (set) => ({
      isPopOpen: false,
      setisPopOpen: (value: boolean) => set({ isPopOpen: value }),
    }),
    {
      name: "switch-account-pop",
    }
  )
);

export default useSwitchAccount ;
