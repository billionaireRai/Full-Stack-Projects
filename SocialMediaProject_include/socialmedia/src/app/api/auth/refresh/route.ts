import { NextRequest , NextResponse } from "next/server";
import { refreshTokenController } from "@/app/controllers/auth";

export const POST = (request:NextRequest) : Promise<NextResponse> => {
    return refreshTokenController(request) ;
 }