import { NextResponse , NextRequest } from "next/server";
import { getExplorePostsOfAccountController , getOtherExploreDetailsController } from "@/app/controllers/explore";

export const GET = (req:NextRequest) : Promise<NextResponse> => { 
    return getExplorePostsOfAccountController(req); 
}

export const POST = (req:NextRequest) : Promise<NextResponse> => { 
    return getOtherExploreDetailsController(req) ;
 }