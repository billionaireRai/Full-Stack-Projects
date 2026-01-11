import { NextRequest, NextResponse } from "next/server";
import { getUserAccountController } from "@/app/controllers/user";

export const GET = (request:NextRequest) : Promise<NextResponse> => { 
    return getUserAccountController(request) ;

}