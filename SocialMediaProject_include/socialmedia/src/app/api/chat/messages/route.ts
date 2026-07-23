import { fetchMessagesController } from "@/app/controllers/chat";
import { NextRequest , NextResponse } from "next/server";

export const POST = (request:NextRequest) : Promise<NextResponse> => {
    return fetchMessagesController(request);
}
