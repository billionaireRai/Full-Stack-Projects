import { create } from "zustand";
import { persist } from 'zustand/middleware';

const useConnectedWithDataBase = create(persist((set, get) => ({
      isConnected: false,
      connectToDatabase: () => {
       if (!get().isConnected) set({ isConnected: true });
      },
      disconnectToDataBase: () => {
        if (get().isConnected) set({ isConnected: false }); 
      }
    }),
    { name: 'db-connection-store' } // Key for localStorage 
  )
);

export default useConnectedWithDataBase;
