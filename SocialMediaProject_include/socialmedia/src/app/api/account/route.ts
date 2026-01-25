import { NextRequest, NextResponse } from "next/server";
import { gettingSearchedAccountController } from "@/app/controllers/user";

export async function GET(request:NextRequest) : Promise<NextResponse> {
    return gettingSearchedAccountController(request) ;
}