import { NextRequest , NextResponse } from "next/server";
import { getMutualCredentialsController , getMutualInterestPostsController } from "@/app/controllers/mutual";

export const POST = (request:NextRequest) : Promise<NextResponse> => { 
    return getMutualCredentialsController(request) ;
}

export const GET = (request:NextRequest) : Promise<NextResponse> => { 
    return getMutualInterestPostsController(request) ;
}