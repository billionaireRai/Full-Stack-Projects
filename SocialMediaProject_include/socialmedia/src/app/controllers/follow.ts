import { getAllTheFollowingService } from "../db/services/follow";
import asyncErrorHandler from "../middleware/errorMiddleware";
import { NextRequest , NextResponse } from "next/server";

export const getAllTheFollowingsController = asyncErrorHandler( async (request:NextRequest) => { 
    const url = new URL(request.nextUrl) ;
    const handle = url.searchParams.get('handle') ; // getting the handle...

    if (!handle) {
        console.log('Handle is required for followings...');
        return NextResponse.json({ message:'Handle missing !!'},{ status:400 }) ;
    }

    // getAllTheFollowingService(handle) ;
    return NextResponse.json({ message:'followings fetched...' },{ status:200 });
})