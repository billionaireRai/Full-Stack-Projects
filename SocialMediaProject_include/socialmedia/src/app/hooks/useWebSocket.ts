"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

type AccountConnectionFn = (accountId: string) => void;

export default function useWebSocket( accountId:string , type:string ) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!accountId) return ; // Avoid connecting without a account id to register.

    const socket = io("http://localhost:4000", { autoConnect: true, transports: ["websocket"] });

    socketRef.current = socket ;

    const register: AccountConnectionFn = (accountid) => {
      socket.emit("register_account", accountid) ;
    };

    const login: AccountConnectionFn = (accountid) => { 
      socket.emit("login_account",accountid)
    };

    socket.on("connect", () => {
      if (type === 'register') register(accountId) ;
      else login(accountId) ;
      
    });

    return () => {
      socket.off("connect");
      socket.disconnect();
      socketRef.current = null;
    };

  }, [accountId]);

  return socketRef;
}

