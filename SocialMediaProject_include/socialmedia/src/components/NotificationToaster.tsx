"use client";

import useNotification from "@/app/hooks/useNotification";
import useNotificationValue from "@/app/states/globalnotifications";

async function updateNotificationCount() {
  const { setValue } = useNotificationValue() ;

}

export default function NotificationToaster() {
  updateNotificationCount()
  useNotification();
  return null;
}


