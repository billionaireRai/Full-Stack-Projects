import { NextResponse , NextRequest } from "next/server";
import { getConversationsController } from "@/app/controllers/conversation";

export const GET = (req:NextRequest) : Promise<NextResponse> => {
    return getConversationsController(req) ;
}
