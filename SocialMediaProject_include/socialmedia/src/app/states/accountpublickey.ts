"use client"

import { create } from "zustand";

interface accountPKtype {
  publickey: CryptoKey | null ;
  setpublickey: (value:CryptoKey) => void;
}

const usePublicKey = create<accountPKtype>()( (set) => ({
      publickey: null ,
      setpublickey: (value: CryptoKey) => set({ publickey: value }),
    })
);

export default usePublicKey ;
