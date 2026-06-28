
import Link from "next/link";
import useSound from "use-sound";
import toast from "react-hot-toast";
import useActiveAccount from "../states/useraccounts";
import { io } from "socket.io-client";
import { NotificationType } from "@/components/notificationcard";
import { notificationPayloadType } from "../db/services/notifications";

const notificationText: Record<NotificationType, string> = {
  follow: "started following you",
  like: "liked your post",
  comment: "commented on your post",
  mention: "mentioned you",
  repost: "reposted your post",
  post: "shared a new post",
  notification_like: "liked your notification",
  notification_comment: "replied to your notification",
};


import { Link2Icon , BellDot } from "lucide-react";

export default function useNotification() {
    const [ play ] = useSound('/audio/notification.mp3');
    const { Account } = useActiveAccount() ; // initializing state for active account...
    
    const socket = io("http://localhost:4000", { autoConnect: true, transports: ["websocket"] });

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
                  <Link className='font-bold' href={`/${payload.actor.username}`}>{payload.actor.username}</Link> 
                  {notificationText[payload.type]} on
                  <pre>{new Date(payload.createdAt).toDateString()}</pre>.
                </p>
              </div>
                 <Link
                   href={`/${Account.decodedHandle}/post/${payload.post?.id}`}
                   className="text-gray-400 hover:text-black p-1 border border-gray-200 rounded-full"
                   >
                   <Link2Icon size={18} />
                 </Link>
            </div>
          </div>
    ),{ position: "top-right" , duration:6000 })

    socket.on("notification", handleNotification); // start fromm here....
}}