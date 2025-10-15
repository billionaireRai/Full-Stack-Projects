"use client"

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface unreadMessageProp {
  unreadMessage: number;
  setUnreadMessage: (value: number) => void;
}

const useUnreadMessage = create<unreadMessageProp>()( persist( (set) => ({
      unreadMessage: 0,
      setUnreadMessage: (value) => set({ unreadMessage : value }),
    }),
    {
      name: "unread-messages-number",
    }
  )
);

export default useUnreadMessage ;