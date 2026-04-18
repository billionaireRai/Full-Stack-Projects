import { NextRequest , NextResponse } from "next/server";
import { getVerifiedUrlForQRController } from "@/app/controllers/post";

export const POST = (request:NextRequest) : Promise<NextResponse> => { 
    return getVerifiedUrlForQRController(request) ;
}