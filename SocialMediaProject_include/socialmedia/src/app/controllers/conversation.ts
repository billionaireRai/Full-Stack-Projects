import asyncErrorHandler from "../middleware/errorMiddleware";
import { NextRequest , NextResponse } from "next/server";
import { getConversationsService } from "../db/services/conversations";

export const getConversationsController = asyncErrorHandler( async (req:NextRequest) => {
    const conversations = await getConversationsService();
    return NextResponse.json({ message:'Conversations fetched successfully !!' , conversations },{ status:200 })
})