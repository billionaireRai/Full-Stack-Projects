import { NextRequest , NextResponse } from "next/server";
import { getNotificationsController, notificationCommentController, notificationLikeController ,markNotificationsReadController, notificationDeletedController } from "@/app/controllers/notifications";

export const GET = (req:NextRequest) : Promise<NextResponse> => { 
    return getNotificationsController(req);
}

export const PUT = (req:NextRequest) : Promise<NextResponse> => { 
    return notificationLikeController(req);
}

export const POST = (req:NextRequest) : Promise<NextResponse> => { 
    return notificationCommentController(req);
}

export const PATCH = (req:NextRequest) : Promise<NextResponse> => { 
    return markNotificationsReadController(req);
 }

export const DELETE = (req:NextRequest) : Promise<NextResponse> => {
  return notificationDeletedController(req);
}
