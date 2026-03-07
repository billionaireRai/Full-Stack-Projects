import { NextRequest , NextResponse } from "next/server";
import { commentOnPostController, postBookmarkController, postLikeController, postRepostController } from "@/app/controllers/post";

export const POST = (req:NextRequest) : Promise<NextResponse> => { 
    return commentOnPostController(req) ;
}

export const GET = (req:NextRequest) : Promise<NextResponse> => { 
    return postRepostController(req) ;
}

export const PUT = (req:NextRequest) : Promise<NextResponse> => { 
    return postLikeController(req);
}

export const PATCH = (req:NextRequest) : Promise<NextResponse> => { 
    return postBookmarkController(req);
}