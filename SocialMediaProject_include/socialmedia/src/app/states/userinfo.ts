"use client"

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface user {
    userId:string,
    email:string,
}
interface userinfoType {
  User:user
  setUserInfo: (USER:user) => void;
}

const useUserInfo = create<userinfoType>()( persist( (set) => ({
      User: {
        userId:'',
        email:'',
      },
      setUserInfo: (USER: user) => set({ User: USER}),
    }),
    {
      name: "user-personal-info",
    }
  )
);

export default useUserInfo ;
