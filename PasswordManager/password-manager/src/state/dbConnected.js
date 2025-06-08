import { create } from "zustand";
import { persist } from 'zustand/middleware';

function getStorage() {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      return window.localStorage;
    }
  } catch (e) {
    // localStorage is unavailable
  }
  // Return a no-op storage to avoid errors when localStorage is unavailable
  return {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
  };
}

const useConnectedWithDataBase = create(
  persist(
    (set, get) => ({
      isConnected: false,
      connectToDatabase: () => {
        if (!get().isConnected) set({ isConnected: true });
      },
      disconnectToDataBase: () => {
        if (get().isConnected) set({ isConnected: false });
      },
    }),
    {
      name: 'db-connection-store', // Key for localStorage
      getStorage,
    }
  )
);