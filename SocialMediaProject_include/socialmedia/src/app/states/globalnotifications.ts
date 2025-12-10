"use client"

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface globalNotificationsType {
  value: number;
  setValue: (value: number) => void;
}

const useNotificationValue = create<globalNotificationsType>()( persist( (set) => ({
      value: 0,
      setValue: (value: number) => set({ value: value }),
    }),
    {
      name: "unread-notifications",
    }
  )
);

export default useNotificationValue ;
