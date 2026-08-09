"use client";

import { io, Socket } from "socket.io-client";


type AccountConnectionFn = (accountId: string) => void;

export default function useWebSocket(accountId: string, type: string): Socket {
  const socket = io("http://localhost:5000", { autoConnect: true, transports: ["websocket"] });

  const register: AccountConnectionFn = (accountid) => {
    socket.emit("register_account", accountid);
  };

  const login: AccountConnectionFn = (accountid) => {
    socket.emit("login_account", accountid);
  };

  const handleConnect = () => {
    if (type === "register") register(accountId);
    else login(accountId);
  };

  socket.on("connect", handleConnect);

  // If already connected, emit immediately.
  if (socket.connected) handleConnect();

  return socket;
}


