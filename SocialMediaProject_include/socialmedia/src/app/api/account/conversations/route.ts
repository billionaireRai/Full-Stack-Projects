import { NextResponse , NextRequest } from "next/server";
import { getConversationsController , createNewConversationController } from "@/app/controllers/conversation";

export const GET = (req:NextRequest) : Promise<NextResponse> => {
    return getConversationsController(req) ;
}

export const POST = (req:NextRequest) : Promise<NextResponse> => {
    return createNewConversationController(req);
}

