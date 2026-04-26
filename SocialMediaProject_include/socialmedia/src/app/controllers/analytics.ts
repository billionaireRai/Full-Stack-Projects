import { NextRequest, NextResponse } from "next/server";
import asyncErrorHandler from "../middleware/errorMiddleware";
import { getPostAnalyticsService , getProfileDashboardAnalyticsService } from "../db/services/analytics";

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

export const getProfileDashboardAnalyticsController = asyncErrorHandler(async (request:NextRequest) => {
    const { handle , pastTime , year } = await request.json() ; // extracting the data coming...
    
    if (!handle || !pastTime || !year) {
        console.log("Check the incoming variable !!");
        return NextResponse.json({ message:"Variable missing , please check..." },{ status:404 });
    }

    // await getProfileDashboardAnalyticsService(handle,pastTime) ;
    return NextResponse.json({ message:"Controller successfully triggered..." },{ status:200 });
})