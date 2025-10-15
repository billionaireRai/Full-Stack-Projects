"use client"

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface notificationStateProps {
  numOfNotification: number;
  setNotificationNum: (value: number) => void;
}

const useNotificationNum = create<notificationStateProps>()( persist( (set) => ({
      numOfNotification: 0,
      setNotificationNum: (value) => set({ numOfNotification : value }),
    }),
    {
      name: "notifications-number",
    }
  )
);

export default useNotificationNum ;