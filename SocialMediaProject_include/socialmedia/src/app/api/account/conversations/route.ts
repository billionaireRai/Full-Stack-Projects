import { NextResponse , NextRequest } from "next/server";
import { getConversationsController , createNewConversationController, chatCardOpenController, blockConversationController, conversationDeletionController } from "@/app/controllers/conversation";

export const GET = (req:NextRequest) : Promise<NextResponse> => {
    return getConversationsController(req) ;
}

export const POST = (req:NextRequest) : Promise<NextResponse> => {
    return createNewConversationController(req) ;
}

export const PUT = (req:NextRequest) : Promise<NextResponse> => {
    return chatCardOpenController(req) ;
}

export const PATCH = (req:NextRequest) : Promise<NextResponse> => { 
    return blockConversationController(req);
}

export const DELETE = (req:NextRequest) : Promise<NextResponse> => { 
    return conversationDeletionController(req);
}
