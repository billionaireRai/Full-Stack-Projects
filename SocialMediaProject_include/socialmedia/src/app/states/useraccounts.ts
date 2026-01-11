"use client"

import mongoose from "mongoose";
import { create } from "zustand";
import { persist } from "zustand/middleware";


export interface accountType {
  name:string ,
  handle:string ,
  bio:string ,
  location:{
    text:string,
    coordinates:number[] // lat,long
  },
  website:string,
  joinDate:string,
  following:string,
  followers:string,
  Posts:string,
  isCompleted:boolean,
  isVerified:boolean,
  bannerUrl:string,
  avatarUrl:string
}

export interface userCardProp {
  decodedHandle?:string | null ;
  name?:string | null;
  content?:string | null ;
  heading?:React.ReactElement;
  account?: accountType;
  IsFollowing?:boolean;
} 

interface userActiveAccountState {
  Account:userCardProp ;
  setAccount: (account:userCardProp ) => void;
}

const useActiveAccount = create<userActiveAccountState>()( persist( (set) => ({
      Account: {},
      setAccount: (account: userCardProp) => set({ Account: account }),
    }),
    {
      name: "user-active-account",
    }
  )
);

export default useActiveAccount ;
