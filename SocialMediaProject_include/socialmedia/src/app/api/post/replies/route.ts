import { NextRequest, NextResponse } from "next/server";
import { getRepliesOnCommentsOfPostController } from "@/app/controllers/comments";

export const GET = (req:NextRequest) : Promise<NextResponse> => { 
    return getRepliesOnCommentsOfPostController(req) ;
 }