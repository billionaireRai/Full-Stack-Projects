"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export default function useMessageSocket() {
    const socket = io("http://localhost:5000", { autoConnect: true, transports: ["websocket"] });

    return () => {
      socket.disconnect();
    };

}
