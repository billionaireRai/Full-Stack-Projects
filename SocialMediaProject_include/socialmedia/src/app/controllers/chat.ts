import { NextRequest , NextResponse } from "next/server";
import asyncErrorHandler from "../middleware/errorMiddleware";
import { clearChatHistoryService, getAttachmentsOfChatService, muteChatService, pinChatService } from "../db/services/chat";
import { mediaType } from "@/components/mediapopmodal";
import { userCardProp } from "../db/services/user";

export const getAttachmentsOfConversationController = asyncErrorHandler(async (request:NextRequest) => {
    const requrl = new URL(request.nextUrl);
    const chatWithHandle = requrl.searchParams.get('targetAccHandle');
    
    if (!chatWithHandle?.trim()) {
        console.log("Target account handle missing !! ",chatWithHandle);
        return NextResponse.json({ message:'Target account missing !!' },{ status:404 });
    }

    const { attachments, mentions } = await getAttachmentsOfChatService(chatWithHandle) as 
    { attachments: mediaType[] ; mentions: userCardProp[] } ;

    return NextResponse.json({ message:'Attachments fethced successfully !!', attachments, mentions },{ status:200 });
})

export const muteChatController = asyncErrorHandler(async (request:NextRequest) => {
    const { chat } = await request.json() ; // extracting chat from req body...

    if (!chat) {
        console.log("active conversation is missing !!");
        return NextResponse.json({ message:'conversation missing , please check !' },{ status:404 });
    }

    await muteChatService(chat); // calling service for mute...
    return NextResponse.json({ message:'Chat mute state toggled successfully' },{ status:200 });
})

export const pinChatController = asyncErrorHandler(async (request:NextRequest) => {
    const { chat } = await request.json() ; // extracting chat from req body...

    if (!chat) {
        console.log("active conversation is missing !!");
        return NextResponse.json({ message:'conversation missing , please check !' },{ status:404 });
    }

    await pinChatService(chat); // calling service for mute...
    return NextResponse.json({ message:'Chat mute state toggled successfully' },{ status:200 });
})

export const clearChatHistoryController = asyncErrorHandler(async (request:NextRequest) => {
    const requrl = new URL(request.nextUrl);
    const conversationid = requrl.searchParams.get('conversationid');

    if (!conversationid) {
        console.log("Chat ID is unavailable !!");
        return NextResponse.json({ message:'Chat ID missing...' },{ status:200 });
    }

    await clearChatHistoryService(conversationid); // calling service for mute...
    return NextResponse.json({ message:'Chat history cleared successfully' },{ status:200 });
})