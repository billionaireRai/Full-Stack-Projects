"use client"

import { create } from "zustand";
import { persist } from "zustand/middleware";


export interface userType {
  name:string ,
  handle:string ,
  bio:string ,
  location:string,
  website:string,
  joinDate:string,
  following:string,
  followers:string,
  Posts:string,
  isVerified:boolean,
  coverImage:string,
  avatar:string
}

interface userCardProp {
  decodedHandle?:string | null ;
  name?:string | null;
  content?:string | null ;
  heading?:React.ReactElement;
  user?: userType;
  IsFollowing?:boolean;
} 

interface userAccountState {
  Accounts:userCardProp[];
  setAccounts: (account:userCardProp[] ) => void;
}

const useAllAccounts = create<userAccountState>()( persist( (set) => ({
      Accounts: [{}],
      setAccounts: (account: userCardProp[]) => set({ Accounts: account }),
    }),
    {
      name: "user-all-accounts",
    }
  )
);

export default useAllAccounts ;
