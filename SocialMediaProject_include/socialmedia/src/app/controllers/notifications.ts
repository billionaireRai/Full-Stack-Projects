import asyncErrorHandler from "../middleware/errorMiddleware";
import { NextResponse , NextRequest } from "next/server";
import { commentOnNotificationService, deleteNotificationService, getNotificationsService, likeNotificationService, markNotificationsReadService } from "../db/services/notifications";

export const getNotificationsController = asyncErrorHandler( async (request:NextRequest) => {
    const requestUrl = new URL(request.nextUrl);
    const incomingUsername = requestUrl.searchParams.get('handle') ;
    const page = Number(requestUrl.searchParams.get('page')) ;
    const size = Number(requestUrl.searchParams.get('pagesize')) ;

    // debbuging log...
    if(!incomingUsername || !page || !size) {
        console.log("Any of incoming credential missing !!");
        return NextResponse.json({ message:'Check incoming credentials...' },{ status:404 });
    }
    
    // const data = await getNotificationsService(incomingUsername,page,size);
    return NextResponse.json({ message:'Notifications successfully fetched !!' },{ status:200 }); // ...data
})

export const markNotificationsReadController = asyncErrorHandler( async (request:NextRequest) => {
    const { page , size } = await request.json() ;

    if (!page || !size) {
        console.log(`Any of Page:${page} OR Size:${size} is missing !!`);
        return NextResponse.json({ message:'Check Page & Size parameters coming !!' },{ status:404 });
    }

    // await markNotificationsReadService(page,size) ;

    return NextResponse.json({ message:`Notifications marked read till page ${page}` },{ status:200 });
})

export const notificationLikeController = asyncErrorHandler( async (request:NextRequest) => {
    const { notifcnId , targetState } = await request.json() ; // extracting the data coming...

    if (!notifcnId || !targetState) {
        console.log("Any Of required credential Unavailable !!");
        return NextResponse.json({ message:'Neccessary credential missing !!' },{ status:404 });
    }

    // await likeNotificationService(notifcnId,targetState);

    return NextResponse.json({ message:'Required like state updated !!' },{ status:200 });
})

export const notificationCommentController = asyncErrorHandler( async (request:NextRequest) => {
    const { notifcnId , replyText } = await request.json() ;

    if (!notifcnId || !replyText) {
       console.log("Any Of required credential Unavailable !!");
       return NextResponse.json({ message:'Neccessary credential missing !!' },{ status:404 });
    }

    // await commentOnNotificationService(notifcnId,replyText) ;
    return NextResponse.json({ message:'Commented successfully on notification' },{ status:200 });
})

export const notificationDeletedController = asyncErrorHandler( async (request:NextRequest) => {
    const url = new URL(request.nextUrl);
    const notificationId = String(url.searchParams.get('notificationId'));

    // await deleteNotificationService(notificationId);
    return NextResponse.json({ message:'Commented successfully on notification' },{ status:200 });
})