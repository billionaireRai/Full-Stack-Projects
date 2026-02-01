import { NextResponse , NextRequest } from "next/server";
import { getAllTheFollowingsController } from "@/app/controllers/follow";

export const GET = (req:NextRequest) : Promise<NextResponse> => { 
    return getAllTheFollowingsController(req) ;
 }