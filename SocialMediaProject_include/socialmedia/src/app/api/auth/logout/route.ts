import { NextResponse , NextRequest } from "next/server";
import { accountLogoutController } from "@/app/controllers/auth";

export const POST = (request:NextRequest) : Promise<NextResponse> => { 
    return accountLogoutController(request) ;
 }