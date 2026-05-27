import { NextRequest , NextResponse } from "next/server";
import { getNotificationsController, notificationCommentController, notificationLikeController } from "@/app/controllers/notifications";

export const GET = (req:NextRequest) : Promise<NextResponse> => { 
    return getNotificationsController(req);
}

export const POST = (req:NextRequest) : Promise<NextResponse> => { 
    return notificationCommentController(req);
}

export const PUT = (req:NextRequest) : Promise<NextResponse> => { 
    return notificationLikeController(req);
}