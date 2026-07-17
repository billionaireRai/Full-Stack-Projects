import { NextRequest , NextResponse } from "next/server";
import { getAccountsFeedPostController } from "@/app/controllers/feed";

export const POST = (request:NextRequest) : Promise<NextResponse> => { 
  return getAccountsFeedPostController(request) ;
}