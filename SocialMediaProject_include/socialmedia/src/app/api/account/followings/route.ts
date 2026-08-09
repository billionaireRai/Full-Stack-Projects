import { NextResponse , NextRequest } from "next/server";
import { getAccountFollowingsUnpaginatedController } from "@/app/controllers/follow";

export const GET = (req:NextRequest) : Promise<NextResponse> => { 
  return getAccountFollowingsUnpaginatedController(req) ;
}

export const POST = (req:NextRequest) : Promise<NextResponse> => { 
  return getAccountFollowingsUnpaginatedController(req) ;
}
