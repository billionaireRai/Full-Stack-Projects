import { NextRequest , NextResponse } from "next/server";
import { viewCreationController , getAllViewsOfPostController } from "@/app/controllers/view";

export const POST = (req:NextRequest) : Promise<NextResponse> => { 
    return viewCreationController(req);
 }
 
 export const GET = (req:NextRequest) : Promise<NextResponse> => {
     return getAllViewsOfPostController(req) ;
 }