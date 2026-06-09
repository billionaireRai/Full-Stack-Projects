"use client"

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface globalNotificationsType {
  notificationCount: number;
  setnotificationCount: (value: number) => void;
}

const useNotificationValue = create<globalNotificationsType>()( persist( (set) => ({
      notificationCount: 3,
      setnotificationCount: (value: number) => set({ notificationCount: value }),
    }),
    {
      name: "unread-notifications",
    }
  )
);

export default useNotificationValue ;
