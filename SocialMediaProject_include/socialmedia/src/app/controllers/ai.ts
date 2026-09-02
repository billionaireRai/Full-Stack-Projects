import { NextRequest, NextResponse } from "next/server";
import asyncErrorHandler from "../middleware/errorMiddleware";
import { aiExplanationService } from "../db/services/ai";

export const aiExplanationController = asyncErrorHandler(async (request:NextRequest) => {
    const { handle , postid , type } = await request.json() ; // loading data object...

    if (!handle) {
        console.log("Content owner handle missing !!");
        return NextResponse.json({ message:'Owner account @handle missing...' , status:400 })
    }

    return await aiExplanationService(handle,postid,type);
})