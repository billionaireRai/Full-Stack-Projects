import { NextRequest } from "next/server";
import { o_authFacebookController } from "@/app/controllers/auth";

export async function GET(request:NextRequest) {
    return o_authFacebookController(request) ;
}