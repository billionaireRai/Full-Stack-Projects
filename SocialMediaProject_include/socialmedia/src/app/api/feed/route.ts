import { NextRequest , NextResponse } from "next/server";
import { getAccountsFeedPostController, getFeedAccountSuggestionsController } from "@/app/controllers/feed";

export const POST = (request:NextRequest) : Promise<NextResponse> => { 
  return getAccountsFeedPostController(request) ;
}

export const GET = (request:NextRequest) : Promise<NextResponse> => { 
  return getFeedAccountSuggestionsController(request);
}