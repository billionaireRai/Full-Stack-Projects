import { NextRequest , NextResponse } from "next/server";
import { postSendViaDMController } from "@/app/controllers/post";

export const POST = (req:NextRequest) : Promise<NextResponse> => { 
    return postSendViaDMController(req) ;
}