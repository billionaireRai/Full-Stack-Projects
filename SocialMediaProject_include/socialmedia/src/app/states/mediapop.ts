"use client"

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface mediaType {
  url: string;
  media_type: string;
}

interface mediaPopState {
  isMediaPop: boolean;
  setMediaPop: (value: boolean) => void;
  mediaDetail: mediaType | null ;
  setDetails:(detail:mediaType) => void ;
}

const useMediaPop = create<mediaPopState>()( persist( (set) => ({
      isMediaPop: false,
      setMediaPop: (value: boolean) => set({ isMediaPop: value }),
      mediaDetail:null ,
      setDetails:(detail:mediaType) => set({ mediaDetail:detail })
    }),
    {
      name: "media-popup",
    }
  )
);

export default useMediaPop ;
