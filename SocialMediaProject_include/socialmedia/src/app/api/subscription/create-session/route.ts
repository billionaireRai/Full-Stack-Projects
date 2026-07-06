import { NextRequest , NextResponse } from "next/server";
import { CreateSubscriptionSessionURLController } from "@/app/controllers/stripe";

export const POST = (req:NextRequest) : Promise<NextResponse> => { 
    return CreateSubscriptionSessionURLController(req);
}