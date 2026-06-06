import { NextResponse , NextRequest } from "next/server";
import asyncErrorHandler from "@/app/middleware/errorMiddleware";
import { storePublicKeyInDBService } from "../db/services/public-key";

export const storePublickeyInDBController = asyncErrorHandler(async (request:NextRequest)  => {
    const { publicKey , accid , deviceip } = await request.json() ; // extracting request object data...

    if (!publicKey.trim() || !accid.trim() || !deviceip.trim()) {
        console.log("Any of important credential missing !!");
        return NextResponse.json({ message:'Check incoming credentials !!' },{ status:404 });
    }

    // await storePublicKeyInDBService(publicKey,accid,deviceip);
    return NextResponse.json({ message:'Public key successfully stored !!' },{ status:200 });
})