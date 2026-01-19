import { NextRequest, NextResponse } from "next/server";
import { triggerFollowToggleController } from "@/app/controllers/user";

export async function GET(request:NextRequest) : Promise<NextResponse> {
    return triggerFollowToggleController(request) ;   
}