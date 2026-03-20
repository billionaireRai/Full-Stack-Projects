import { NextRequest , NextResponse } from "next/server";
import asyncErrorHandler from "../middleware/errorMiddleware";
import { getAllTheLikesOfPostService } from "../db/services/likes";

export const getAllLikesOfPostController = asyncErrorHandler(async (request:NextRequest) => {
    const url = new URL(request.nextUrl) ;
    const postid = url.searchParams.get('postid');
    
    const page =  parseInt(String(url.searchParams.get('page')));
    const size = parseInt(String(url.searchParams.get('size')));

    if (!postid || !page || !size) {
        console.log("Important credential missing");
        return NextResponse.json({ message:'Check incoming credentials...' },{ status:400 });
    } 

    // await getAllTheLikesOfPostService({ postid , page , size });
    return NextResponse.json({ message:'Post likes fetched !!' },{ status:200 });
})