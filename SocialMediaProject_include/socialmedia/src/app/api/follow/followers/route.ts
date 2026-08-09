import { NextResponse , NextRequest } from "next/server";
import { getAccountFollowersController } from "@/app/controllers/follow";

export const GET = (request:NextRequest) : Promise<NextResponse> => {
    return getAccountFollowersController(request);
}

export const POST = (request:NextRequest) : Promise<NextResponse> => {
    return getAccountFollowersController(request);
}
