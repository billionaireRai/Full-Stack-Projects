import { NextRequest , NextResponse } from "next/server";
import asyncErrorHandler from "../middleware/errorMiddleware";
import { getCommentsOfAPostService , getRepliesOnPostCommentService } from "../db/services/comments";

export const getPostCommentsController = asyncErrorHandler( async (request:NextRequest) => {
    const url = new URL(request.nextUrl) ;
    const postid = url.searchParams.get('postid');
    
    const page =  parseInt(String(url.searchParams.get('page')));
    const size = parseInt(String(url.searchParams.get('size')));

    if (!postid || !page || !size) {
        console.log("Important credential missing");
        return NextResponse.json({ message:'Check incoming credentials...' },{ status:400 });
    } 

    // await getCommentsOfAPostService({ postid , page , size }) ;
    return NextResponse.json({ message:'Comments fetched successfully !!' },{ status:200 });
}) 

export const getRepliesOnCommentsOfPostController = asyncErrorHandler( async (request:NextRequest) => {
    const url = new URL(request.nextUrl) ;
    const postid = url.searchParams.get('postid');
    
    const page =  parseInt(String(url.searchParams.get('page')));
    const size = parseInt(String(url.searchParams.get('size')));

    if (!postid || !page || !size) {
        console.log("Important credential missing");
        return NextResponse.json({ message:'Check incoming credentials...' },{ status:400 });
    } 

    // await getRepliesOnPostCommentService({ postid , page , size }) ;
    return NextResponse.json({ message:'Replies fetched successfully !!' },{ status:200 });
})