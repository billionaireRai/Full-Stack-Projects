import { NextRequest , NextResponse } from "next/server";
import { getSearchedLocation } from "@/app/controllers/user";

export const GET = (req:NextRequest) : Promise<NextResponse> => { 
    return getSearchedLocation(req) ;
} 