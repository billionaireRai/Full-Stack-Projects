import { NextResponse , NextRequest } from "next/server";
import { storePublickeyInDBController } from "@/app/controllers/public-key"; 

export const POST = (req:NextRequest) : Promise<NextResponse> => {
    return storePublickeyInDBController(req) ;
}