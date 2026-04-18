import { NextResponse , NextRequest } from "next/server";
import { getNewsDataController } from "@/app/controllers/news";

export const POST = (req:NextRequest) : Promise<NextResponse> => {
    return getNewsDataController(req) ;
 }