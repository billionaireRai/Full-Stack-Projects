import { NextRequest , NextResponse } from "next/server";
import { o_authGoogleCallbackController } from "@/app/controllers/auth";

// https://localhost:3000/api/auth/google/register/callback?code=AUTH_CODE&state=randomString
export async function GET(request:NextRequest) : Promise<NextResponse> {
   return o_authGoogleCallbackController(request) ;
}
