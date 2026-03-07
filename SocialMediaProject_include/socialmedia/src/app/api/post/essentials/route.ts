import { NextRequest , NextResponse } from "next/server";
import { postPageEssentialController } from "@/app/controllers/post";
import { getPostSpecificAnalyticsController } from "@/app/controllers/analytics";

export const POST = (req:NextRequest) : Promise<NextResponse> => { 
    return postPageEssentialController(req) ;
}

export const GET = (req:NextRequest) : Promise<NextResponse> => { 
    return getPostSpecificAnalyticsController(req) ;
 }