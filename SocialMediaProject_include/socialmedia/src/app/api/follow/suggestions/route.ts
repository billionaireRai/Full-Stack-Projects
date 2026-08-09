import { NextRequest , NextResponse } from "next/server";
import { getFollowersSuggestionsController , getFollowingsSuggestionsController } from "@/app/controllers/follow";

export const GET = (request:NextRequest) : Promise<NextResponse> => {
    return getFollowersSuggestionsController(request);
}

export const POST = (request:NextRequest) : Promise<NextResponse> => { 
    return getFollowingsSuggestionsController(request);
}