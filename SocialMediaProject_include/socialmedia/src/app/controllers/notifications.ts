import asyncErrorHandler from "../middleware/errorMiddleware";
import { NextResponse , NextRequest } from "next/server";
import { getNotificationsService } from "../db/services/notifications";

export const getNotificationsController = asyncErrorHandler( async (request:NextRequest) => {
    const requestUrl = new URL(request.nextUrl);
    const incomingUsername = requestUrl.searchParams.get('handle') ;
    const page = Number(requestUrl.searchParams.get('page')) ;
    const size = Number(requestUrl.searchParams.get('pagesize')) ;

    if(!incomingUsername || !page || !size) {
        console.log("Any of incoming credential missing !!");
        return NextResponse.json({ message:'Check incoming credentials...' },{ status:200 });
    }
    
    // await getNotificationsService(incomingUsername,page,size);
    return NextResponse.json({ message:'Notifications successfully fetched !!' },{ status:200 });
})

export const notificationCommentController = asyncErrorHandler( async (request:NextRequest) => {
    
})

export const notificationLikeController = asyncErrorHandler( async (request:NextRequest) => {
    
})

export const markNotificationsReadController = asyncErrorHandler( async (request:NextRequest) => {
    
})