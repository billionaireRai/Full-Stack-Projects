"use client";

// import useMessageSocket from "@/app/hooks/useMessageSocket";
import useMessageCount from "@/app/states/unreadmessages";

async function updateNotificationCount() {
  // const { setValue } = useMessageCount() ;

}

export default function UnreadMeesageWrapper() {
  updateNotificationCount()
  // useMessageSocket() ;
  return null;
}


