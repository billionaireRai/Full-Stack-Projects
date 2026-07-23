"use client"

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mediaType } from "@/components/mediapopmodal";

export interface Message {
  id: string;
  sendername: string;
  senderhandle: string;
  text: string;
  media?: mediaType[];
  timestamp: string;
  isOwn: boolean;
  avatar: string;
  status?: "sent" | "delivered" | "seen";
}

interface chatMessagesType {
  messages: Message[];
  addMessages: (msgs: Message[]) => void;
  clearMessages: () => void;
  updateMessageStatus: (messageId: string, status: Message['status']) => void;
}


const useActiveChatMessages = create<chatMessagesType>()( persist((set) => ({
      messages: [],
      addMessages: (msgs: Message[]) => set((state) => ({ messages: [...state.messages, ...msgs] })),
      clearMessages: () => set({ messages: [] }),
      updateMessageStatus: (msgidx: string, status: Message['status']) => set((state) => ({
          messages: state.messages.map((m) => (m.id === msgidx ? { ...m, status } : m))
        })),
    }),
    {
      name: "opened-chat-messages",
    }
  )
);

export default useActiveChatMessages;