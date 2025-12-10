"use client"

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface userAuthorized {
  isAuth: boolean;
  setisAuth: (value: boolean) => void;
}

const useAuthenticationState = create<userAuthorized>()( persist( (set) => ({
      isAuth: false,
      setisAuth: (value: boolean) => set({ isAuth: value }),
    }),
    {
      name: "user-authorized-state",
    }
  )
);

export default useAuthenticationState ;
