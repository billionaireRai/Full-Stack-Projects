import { NextRequest , NextResponse } from "next/server";
import { getPostForEmbedPageController , postNotInterestedController } from "@/app/controllers/post";

export const GET = (request:NextRequest) : Promise<NextResponse> => {
    return getPostForEmbedPageController(request) ;
}

export const POST = (request:NextRequest) : Promise<NextResponse> => { 
    return postNotInterestedController(request);
}
