import { getFeedPostService, getFeedSuggestionsService } from "../db/services/feed";
import asyncErrorHandler from "../middleware/errorMiddleware";
import { NextRequest , NextResponse } from "next/server";

export const getAccountsFeedPostController = asyncErrorHandler(async (request:NextRequest) => {
    const { Page , size } = await request.json() ; // extracting Page & size from object body...

    if (!Page || !size) {
        console.log("Missing parameters in data object...");
        return NextResponse.json({ message:'Neccessary parameter missing !!' },{ status:400 });
    }

    return await getFeedPostService({ Page , size });
})

export const getFeedAccountSuggestionsController = asyncErrorHandler(async (request:NextRequest) => {
    return await getFeedSuggestionsService() ;
})