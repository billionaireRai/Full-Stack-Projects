"use client"

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface MessageCountType {
  messageCount: number;
  setmessageCount: (value: number) => void;
}

const useMessageCount = create<MessageCountType>()( persist( (set) => ({
      messageCount: 14,
      setmessageCount: (value: number) => set({ messageCount: value }),
    }),
    {
      name: "unread-notifications",
    }
  )
);

export default useMessageCount ;
