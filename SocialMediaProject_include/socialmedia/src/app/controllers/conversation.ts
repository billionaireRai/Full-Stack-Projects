import asyncErrorHandler from "../middleware/errorMiddleware";
import { NextRequest , NextResponse } from "next/server";
import { getConversationsService , createNewConversationService } from "../db/services/conversations";

export const getConversationsController = asyncErrorHandler( async (req:NextRequest) => {
    const conversations = await getConversationsService();
    return NextResponse.json({ message:'Conversations fetched successfully !!' , conversations },{ status:200 })
})

export const createNewConversationController = asyncErrorHandler( async (request:NextRequest) => {
    const { selectedAcc } = await request.json() ; // extracting selectedAcc from req body...

    if (!selectedAcc) {
        console.log("Selected account not defined !!");
        return NextResponse.json({ message:'Selected account not found !!' },{ status:400 });
    }

    await createNewConversationService(selectedAcc); // calling the service function...
    return NextResponse.json({ message:'New conversation successfully created !!' },{ status:200 });
})