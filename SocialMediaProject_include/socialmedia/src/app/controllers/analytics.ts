import { NextRequest, NextResponse } from "next/server";
import asyncErrorHandler from "../middleware/errorMiddleware";
import { getPostAnalyticsService } from "../db/services/analytics";

export const getPostSpecificAnalyticsController = asyncErrorHandler(async (request:NextRequest) => {
    const url = new URL(request.url) ;
    const postid = url.searchParams.get('postid') ;

    if (!postid) {
        console.log('Post id missing !!');
        return NextResponse.json({ message:"Post id missing , please check..."},{ status:400 });
    }

    // await getPostAnalyticsService(postid) ;
    return NextResponse.json({ message:"Post analytics successfully fethced !!"},{ status:200 });
})