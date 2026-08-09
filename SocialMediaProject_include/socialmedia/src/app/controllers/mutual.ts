import { NextResponse , NextRequest } from "next/server";
import asyncErrorHandler from "../middleware/errorMiddleware";
import { getMutualCredentialsService , getMutualInterestPostsService } from "../db/services/mutual";

export const getMutualCredentialsController = asyncErrorHandler( async (request:NextRequest) => { 
    const { targetHandle , fromHandle } = await request.json() ; // extracting data from request body...

    if (!targetHandle.trim() || !fromHandle.trim()) {
        console.log("Check the @handles coming !!");
        return NextResponse.json({ message:'Neccessary credential missing...'},{ status:404 });
    }

return await getMutualCredentialsService(targetHandle,fromHandle);
 })

export const getMutualInterestPostsController = asyncErrorHandler(async (request:NextRequest) => {
    const url = new URL(request.nextUrl) ;
    const target = url.searchParams.get('targetHandle') ;
    const from = url.searchParams.get('fromHandle') ;
    const page = url.searchParams.get('page');
    const size = url.searchParams.get('size');

    if (!target?.trim() || !from?.trim() || !page?.trim() || !size?.trim()) {
        console.log("Some of the neccessary credential missing !!");
        return NextResponse.json({ message:"Check variables coming..." },{ status:404 });
    }
    
return await getMutualInterestPostsService(target,from,parseInt(page),parseInt(size));
})
