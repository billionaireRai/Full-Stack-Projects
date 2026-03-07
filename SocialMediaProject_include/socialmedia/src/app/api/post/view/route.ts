import { NextRequest , NextResponse } from "next/server";
import { viewCreationController } from "@/app/controllers/view";

export const POST = (req:NextRequest) : Promise<NextResponse> => { 
    return viewCreationController(req);
 }