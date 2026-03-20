import { NextRequest , NextResponse } from "next/server";
import { getAllLikesOfPostController } from "@/app/controllers/likes";

 export const GET = (req:NextRequest) : Promise<NextResponse> => {
     return getAllLikesOfPostController(req) ;
 }