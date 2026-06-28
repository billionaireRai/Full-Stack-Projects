import { NextResponse , NextRequest } from "next/server";
import { clearChatHistoryController, getAttachmentsOfConversationController , muteChatController } from "@/app/controllers/chat";

export const GET = (req:NextRequest) : Promise<NextResponse> => {
    return getAttachmentsOfConversationController(req) ;
}

export const PATCH = (req:NextRequest) : Promise<NextResponse> => {
    return muteChatController(req) ;
}

export const DELETE = (req:NextRequest) : Promise<NextResponse> => { 
    return clearChatHistoryController(req) ;
}