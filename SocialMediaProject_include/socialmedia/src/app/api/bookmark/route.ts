import { NextResponse , NextRequest } from "next/server";
import { getBookmarkPostAndSuggestionsController } from "@/app/controllers/post";

export const GET = (req:NextRequest) : Promise<NextResponse> => { 
    return getBookmarkPostAndSuggestionsController(req) ;
}