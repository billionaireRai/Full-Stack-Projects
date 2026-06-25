import { NextRequest , NextResponse } from "next/server";
import asyncErrorHandler from "../middleware/errorMiddleware";
import { getAttachmentsOfChatService } from "../db/services/chat";
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
    
})