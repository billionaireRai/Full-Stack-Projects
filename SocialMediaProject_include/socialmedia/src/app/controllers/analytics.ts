import { NextRequest, NextResponse } from "next/server";
import asyncErrorHandler from "../middleware/errorMiddleware";
import { getPostAnalyticsService } from "../db/services/analytics";

export const getPostSpecificAnalyticsController = asyncErrorHandler(async (request:NextRequest) => {
    const url = new URL(request.url) ;
    const postid = url.searchParams.get('postid') ;
    const desiredInterval = url.searchParams.get('timeInterval');

    // debugging step...
    if (!postid || !desiredInterval) {
        console.log('postid OR interval is missing !!');
        return NextResponse.json({ message:"Post id OR interval missing , please check..."},{ status:400 });
    }

    // await getPostAnalyticsService( postid , desiredInterval ) ;
    return NextResponse.json({ message:"Post analytics successfully fethced !!"},{ status:200 });
})