import { create } from "zustand";
import { persist } from "zustand/middleware";

const isUserAuthenticated = create(persist((set,get) => { 
    return {
        isAuthenticated: false,
        setisAuthenticated: () => {
            if (!get().isAuthenticated) set({ isConnected: true });
      },
      setisNotAuthenticated: () =>{
        if (get().isAuthenticated) set({ isConnected: false });
      }
    },
    {
        name: 'user-authenticity-stored',
    }
 }));
export default isUserAuthenticated ;