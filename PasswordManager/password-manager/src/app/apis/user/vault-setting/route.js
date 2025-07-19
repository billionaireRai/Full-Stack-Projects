import asyncErrorHandler from "@/middlewares/errorMiddleware";
import { connectWithMongoDB } from "@/db/dbConnection";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const POST = asyncErrorHandler( async (request) => {
    
})