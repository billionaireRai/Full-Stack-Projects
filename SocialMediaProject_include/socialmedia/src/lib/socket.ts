"use client";

import { io } from "socket.io-client";

export const socket = io("http://localhost:4000", {
  autoConnect: true
});

export const SocketMessaging = io("http://localhost:5000",{
  autoConnect:true
})