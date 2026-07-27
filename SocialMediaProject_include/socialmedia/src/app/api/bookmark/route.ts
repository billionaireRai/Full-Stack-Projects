import { NextResponse , NextRequest } from "next/server";
import { getBookmarkPostController } from "@/app/controllers/post";
import { getBookmarkSuggestionsController } from "@/app/controllers/user";

export const POST = (req:NextRequest) : Promise<NextResponse> => { 
    return getBookmarkPostController(req) ;
}

export const GET = (req:NextRequest) => {
    return getBookmarkSuggestionsController(req);
}
