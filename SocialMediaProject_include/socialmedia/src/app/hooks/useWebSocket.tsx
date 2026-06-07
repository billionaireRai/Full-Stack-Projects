"use client";

import Link from "next/link";
import useSound from "use-sound";
import useActiveAccount from "../states/useraccounts";
import toast from "react-hot-toast";
import { Link2Icon , BellDot } from "lucide-react";
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { notificationText } from "../db/services/notifications";
import { notificationPayloadType } from "../db/services/notifications";


type AccountConnectionFn = (accountId: string) => void;

export default function useWebSocket(accountId: string, type: string) {
  const socketRef = useRef<Socket | null>(null);
  const { Account } = useActiveAccount() ;
  const [play] = useSound('/audio/notification.mp3');

  useEffect(() => {
    if (!accountId) return; // Avoid connecting without an account id...

    const socket = io("http://localhost:4000", { autoConnect: true, transports: ["websocket"] });

    socketRef.current = socket;

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

    const handleNotification = (payload:notificationPayloadType) => {
    play();
    toast.custom((t) => (
      <div
        role="status"
        aria-live="polite"
        className={`${
          t.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        } transition-all pointer-events-auto bg-white dark:bg-zinc-950 animate-in fade-in-0 zoom-in-95 duration-200 backdrop-blur-md border-l-4 border-yellow-200/70 dark:border-yellow-900 shadow-2xl rounded-2xl p-3 min-w-sm w-fit`}
      >
            <div className="flex items-center gap-3">
              <BellDot className="text-yellow-500" />
              <div className="flex-1 gap-1.5">
                <h4 className="font-semibold text-md text-gray-800 dark:text-gray-200">
                  Your post got a {payload.type} !!
                </h4>
                <p className="text-xs text-wrap max-w-sm text-gray-500 dark:text-gray-400">
                  <Link className='font-bold' href={`/${payload.actor.username}`}>{payload.actor.username}</Link> liked your post on
                  <pre>{new Date(payload.createdAt).toDateString()}</pre>.
                </p>
              </div>
                 <Link
                   href={`/${Account.decodedHandle}/post/3gn3rirg0g45}`}
                   className="text-gray-400 hover:text-black p-1 border border-gray-200 rounded-full"
                 >
                   <Link2Icon size={18} />
                 </Link>
            </div>
          </div>
    ),{ position: "top-right" , duration:6000 })
    };

    handleConnect(); // emit for establishing connection...
    socket.on("notification", handleNotification); // start fromm here....

    return () => {
      socket.off("notification", handleNotification);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [accountId, type]);

  return socketRef;
}


