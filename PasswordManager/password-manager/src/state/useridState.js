"use client"

import { create } from "zustand";
import { persist } from "zustand/middleware";

const useUserID = create(persist((set, get) => ({
      userId: null,
      setUserId: (id) => {
        set({ userId: id });
      },
      resetUserId: () => {
        set({ userId: null });
      },
    }),
    {
      name: "userId-storage",
    }
  )
);

export default useUserID;
