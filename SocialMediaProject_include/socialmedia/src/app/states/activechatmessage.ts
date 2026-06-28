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
      messages: [
        {
          id: "1",
          sendername: "Alice Johnson",
          senderhandle: "@alice",
          text: "Hey! How's your day going?",
          timestamp: "10:00 AM",
          isOwn: false,
          avatar: "/images/myProfile.jpg",
          status: "seen",
        },
        {
          id: "2",
          sendername: "Amritansh Rai",
          senderhandle: "@amritanshdev__",
          text: "Pretty good! Working on my chat application.",
          timestamp: "10:02 AM",
          isOwn: true,
          avatar: "/images/default-profile-pic.png",
          status: "seen",
        },
        {
          id: "3",
          sendername: "Alice Johnson",
          senderhandle: "@alice",
          text: "That's awesome. Is it using Socket.IO?",
          timestamp: "10:03 AM",
          isOwn: false,
          avatar: "/images/myProfile.jpg",
          status: "seen",
        },
        {
          id: "4",
          sendername: "Amritansh Rai",
          senderhandle: "@amritanshdev__",
          text: "Yep! Real-time messaging with Zustand for state management.",
          timestamp: "10:05 AM",
          isOwn: true,
          avatar: "/images/default-profile-pic.png",
          status: "delivered",
        },
        {
          id: "5",
          sendername: "Alice Johnson",
          senderhandle: "@alice",
          text: "Nice choice. Zustand is really lightweight.",
          timestamp: "10:06 AM",
          isOwn: false,
          avatar: "/images/myProfile.jpg",
          status: "seen",
        },
        {
          id: "6",
          sendername: "Amritansh Rai",
          senderhandle: "@amritanshdev__",
          text: "Exactly! It keeps the code clean.",
          timestamp: "10:08 AM",
          isOwn: true,
          avatar: "/images/default-profile-pic.png",
          status: "sent",
        },
        {
          id: "7",
          sendername: "Alice Johnson",
          senderhandle: "@alice",
          text: "Are you planning to support image sharing too?",
          timestamp: "10:09 AM",
          isOwn: false,
          avatar: "/images/myProfile.jpg",
          status: "seen",
        },
        {
          id: "8",
          sendername: "Amritansh Rai",
          senderhandle: "@amritanshdev__",
          text: "Yes! Images, videos, documents, and voice notes.",
          timestamp: "10:10 AM",
          isOwn: true,
          avatar: "/images/default-profile-pic.png",
          status: "delivered",
        },
        {
          id: "9",
          sendername: "Alice Johnson",
          senderhandle: "@alice",
          text: "That sounds like a complete social media plus messaging platform.",
          timestamp: "10:11 AM",
          isOwn: false,
          avatar: "/images/myProfile.jpg",
          status: "seen",
        },
        {
          id: "10",
          sendername: "Amritansh Rai",
          senderhandle: "@amritanshdev__",
          text: "That's the goal 🚀",
          timestamp: "10:12 AM",
          isOwn: true,
          avatar: "/images/default-profile-pic.png",
          status: "seen",
        },
      ],
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