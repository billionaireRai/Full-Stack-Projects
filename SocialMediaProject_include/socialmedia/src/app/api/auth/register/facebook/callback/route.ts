import { NextResponse , NextRequest } from "next/server";
import { o_authFacebookCallbackController } from "@/app/controllers/auth";

export async function GET(request:NextRequest) : Promise<NextResponse> {
    return o_authFacebookCallbackController(request)
}