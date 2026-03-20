import { NextResponse , NextRequest } from "next/server";
import { getAccountsBookmarkedAPostController } from "@/app/controllers/post";

export const GET = (req:NextRequest) : Promise<NextResponse> => {
    return getAccountsBookmarkedAPostController(req) ;
}