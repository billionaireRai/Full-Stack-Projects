import asyncErrorHandler from "../middleware/errorMiddleware";
import { NextRequest , NextResponse } from "next/server";
import { hightLightPostToggleService } from "../db/services/highlight";

export const hightLightPostToggleController = asyncErrorHandler( async(request:NextRequest) => {
    const { postId , changeTo } = await request.json() ;

    if (!postId || !changeTo) {
        console.log("Neccessary credential missing !!");
        return NextResponse.json({ message:'Check incoming credentials !!' },{ status:400 });
    }

    await hightLightPostToggleService({ postId , changeTo });
    return NextResponse.json({ message:'hightlight state sucessfully toggled !' },{ status:200 });
})