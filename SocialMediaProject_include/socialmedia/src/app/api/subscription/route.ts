import { NextRequest , NextResponse } from "next/server";
import { CancelSubscriptionController } from "@/app/controllers/stripe";

export const DELETE = (req:NextRequest) : Promise<NextResponse> => { 
    return CancelSubscriptionController(req) ;
}