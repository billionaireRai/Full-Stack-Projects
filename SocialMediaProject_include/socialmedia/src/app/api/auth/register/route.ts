import { NextRequest , NextResponse } from "next/server";
import asyncErrorHandler from "@/app/middleware/errorMiddleware";


// POST request handler for user registeration...
export const POST = asyncErrorHandler(async (request:NextRequest) => {
    const { Name , Username , Email , Password } = await request.json() ; // extracting data from request body...
    console.log('registeration data :',await request.json());

    return NextResponse.json({ message:'User registration Successfull !!' },{ status:200 });
})
