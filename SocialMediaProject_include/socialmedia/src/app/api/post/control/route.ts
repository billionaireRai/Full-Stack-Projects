import { NextRequest , NextResponse } from "next/server";
import { deleteMyPostController, updatePaticularPostController , togglePinnedPostController, toggleHighlightPostController, addToFavouriteController } from "@/app/controllers/post";

export const DELETE = async (req:NextRequest) : Promise<NextResponse> => {
    return deleteMyPostController(req) ;
} 

export const PUT = async (req:NextRequest) : Promise<NextResponse> => {
    return updatePaticularPostController(req)
}

export const GET = async (req:NextRequest) : Promise<NextResponse> => {
    return togglePinnedPostController(req);
}

export const PATCH = async (req:NextRequest) : Promise<NextResponse> => {
    return toggleHighlightPostController(req) ;
}

export const POST = async (req:NextRequest) : Promise<NextResponse> => {
    return addToFavouriteController(req);
}