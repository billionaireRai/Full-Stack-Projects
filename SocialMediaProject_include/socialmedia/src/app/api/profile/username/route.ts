import { NextRequest , NextResponse } from "next/server";
import { accountRepostSubmittionController , newAccountCreationController ,getAllAccountsOfUserController , switchTheActiveAccountController } from "@/app/controllers/user";

export const POST = (req:NextRequest) : Promise<NextResponse> => { 
    return accountRepostSubmittionController(req);
}

export const PATCH = (req:NextRequest) : Promise<NextResponse> => {
    return newAccountCreationController(req);
}

export const GET = (req:NextRequest) : Promise<NextResponse> => {
    return getAllAccountsOfUserController(req);
}

export const PUT = (req:NextRequest) : Promise<NextResponse> => {
    return switchTheActiveAccountController(req);
}
