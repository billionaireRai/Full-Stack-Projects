"use client"

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface accountPKtype {
  publickey: CryptoKey | null ;
  setpublickey: (value:CryptoKey) => void;
}

const usePublicKey = create<accountPKtype>()( persist( (set) => ({
      publickey: null ,
      setpublickey: (value: CryptoKey) => set({ publickey: value }),
    }),
    {
      name: "loggedin-account-publickey",
    }
  )
);

export default usePublicKey ;
