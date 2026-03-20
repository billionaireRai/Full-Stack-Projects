import { NextRequest , NextResponse } from "next/server";
import crypto from "crypto";
import asyncErrorHandler from "../middleware/errorMiddleware";
import { getAllViewsOfPostService, trackingPostViewService } from "../db/services/views";


export const viewCreationController = asyncErrorHandler( async (request:NextRequest) => { 
    const { postid , fromPage } = await request.json() ; // getting postid from body...

    if (!postid) {
        console.log("Post Id missing , please check...");
        return NextResponse.json({ message:'Post id missing !!' },{ status:400 });
    }

    // getting extract IP address from request headers...
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ipAddress = forwardedFor ? forwardedFor.split(",")[0].trim() : request.headers.get("x-real-ip") || "unknown";
    
    // Extract User-Agent from request headers
    const userAgent = request.headers.get("user-agent") || "unknown";
    
   //  await trackingPostViewService(postid,fromPage,idAddress,userAgent) ;
    return NextResponse.json({ message:'View created successfully !!' },{ status:200 });
})

export const getAllViewsOfPostController = asyncErrorHandler( async (request:NextRequest) => {
    const url = new URL(request.nextUrl) ;
    const postid = url.searchParams.get('postid');
    
    const page =  parseInt(String(url.searchParams.get('page')));
    const size = parseInt(String(url.searchParams.get('size')));

    if (!postid || !page || !size) {
        console.log("Important credential missing");
        return NextResponse.json({ message:'Check incoming credentials...' },{ status:400 });
    } 

    // await getAllViewsOfPostService({ postid , page , size }) ;
    return NextResponse.json({ message:'View fetched successfully !!' },{ status:200 });
})
