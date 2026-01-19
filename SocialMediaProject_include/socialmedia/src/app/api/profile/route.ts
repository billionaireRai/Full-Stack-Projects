import { NextRequest, NextResponse } from "next/server";
import { getUserAccountController , getProfileSpecificDataController ,userProfileUpdationController , userProfileDeletioncontroller , BlockPaticularAccountController } from "@/app/controllers/user";

export const GET = (request:NextRequest) : Promise<NextResponse> => { 
    return getUserAccountController(request) ;

}

export const POST = (request:NextRequest) : Promise<NextResponse> => {
    return getProfileSpecificDataController(request);
}

export const PUT = (request:NextRequest) : Promise<NextResponse> => {
    return userProfileUpdationController(request);
}

export const DELETE = (request:NextRequest) : Promise<NextResponse> => {
    return userProfileDeletioncontroller(request);
}

export const PATCH = (request:NextRequest) : Promise<NextResponse> => { 
    return BlockPaticularAccountController(request)
 }