import { NextRequest , NextResponse } from "next/server";
import { StripeWebhookResponseController } from "@/app/controllers/stripe";

export const POST = (req:NextRequest) : Promise<NextResponse> => {
    return StripeWebhookResponseController(req);
}