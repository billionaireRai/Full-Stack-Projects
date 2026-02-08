import { NextRequest , NextResponse } from "next/server";
import { deleteMyPostController, updatePaticularPostController } from "@/app/controllers/post";

export const DELETE = async (req:NextRequest) : Promise<NextResponse> => {
    return deleteMyPostController(req) ;
} 

export const PUT = async (req:NextRequest) : Promise<NextResponse> => {
    return updatePaticularPostController(req)
}