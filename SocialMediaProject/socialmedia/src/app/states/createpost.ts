"use client"

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CreatePostState {
  isCreatePop: boolean;
  setCreatePop: (value: boolean) => void;
}

const useCreatePost = create<CreatePostState>()( persist( (set) => ({
      isCreatePop: false,
      setCreatePop: (value: boolean) => set({ isCreatePop: value }),
    }),
    {
      name: "create-post-popup",
    }
  )
);

export default useCreatePost ;
