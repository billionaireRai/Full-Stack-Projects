import { NextRequest , NextResponse } from "next/server";
import { getPostCommentsController } from '@/app/controllers/comments'

export const GET = (req:NextRequest) : Promise<NextResponse> => { 
    return getPostCommentsController(req) ;
}