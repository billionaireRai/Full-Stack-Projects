import { NextRequest, NextResponse } from "next/server";
import { getAnAccountController } from "@/app/controllers/user";
import { gettingSearchedAccountController } from "@/app/controllers/user";

export async function GET(request:NextRequest) : Promise<NextResponse> {
    return gettingSearchedAccountController(request) ;
}

export async function POST(request:NextRequest) : Promise<NextResponse> {
    return getAnAccountController(request);
}