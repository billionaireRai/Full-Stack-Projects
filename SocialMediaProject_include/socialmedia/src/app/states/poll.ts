"use client"

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface pollInfoType {
  question: string;
  options: string[];
  duration: number;
}

interface PollState {
  poll: pollInfoType | null;
  isCreateOpen: boolean;
  isDisplayOpen: boolean;
  setPoll: (poll: pollInfoType | null) => void;
  setIsCreateOpen: (value: boolean) => void;
  setIsDisplayOpen: (value: boolean) => void;
  resetPoll: () => void;
}

const usePoll = create<PollState>()( persist( (set) => ({
      poll: null,
      isCreateOpen: false,
      isDisplayOpen: false,
      setPoll: (poll: pollInfoType | null) => set({ poll }),
      setIsCreateOpen: (value: boolean) => set({ isCreateOpen: value }),
      setIsDisplayOpen: (value: boolean) => set({ isDisplayOpen: value }),
      resetPoll: () => set({ poll: null, isCreateOpen: false, isDisplayOpen: false }),
    }),
    {
      name: "poll-state",
    }
  )
);

export default usePoll;
