"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

type RegisterUserFn = (accountId: string) => void;

export default function useWebSocket(accountId?: string) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!accountId) return ; // Avoid connecting without a account id to register.

    const socket = io("http://localhost:4000", { autoConnect: true, transports: ["websocket"] });

    socketRef.current = socket ;

    const register: RegisterUserFn = (accountid) => {
      socket.emit("register_account", accountid) ;
    };

    socket.on("connect", () => {
      register(accountId) ;
    });

    return () => {
      socket.off("connect");
      socket.disconnect();
      socketRef.current = null;
    };

  }, [accountId]);

  return socketRef;
}

