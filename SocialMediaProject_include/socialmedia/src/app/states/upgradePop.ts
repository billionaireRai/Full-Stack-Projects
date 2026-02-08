"use client"

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface upgradePop {
  isPop: boolean;
  setisPop: (value: boolean) => void;
}

const useUpgradePop = create<upgradePop>()( persist( (set) => ({
      isPop: false,
      setisPop: (value: boolean) => set({ isPop: value }),
    }),
    {
      name: "upgrade-pop",
    }
  )
);

export default useUpgradePop ;
