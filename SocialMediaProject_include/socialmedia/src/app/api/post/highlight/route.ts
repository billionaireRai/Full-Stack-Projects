import { NextRequest , NextResponse } from "next/server";
import { hightLightPostToggleController } from "@/app/controllers/highlight";

export const POST = (req:NextRequest) : Promise<NextResponse> => {
    return hightLightPostToggleController(req);
}
