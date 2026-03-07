import { NextRequest , NextResponse } from "next/server";
import crypto from "crypto";
import asyncErrorHandler from "../middleware/errorMiddleware";
import { trackingPostViewService } from "../db/services/views";

//  function to hash ip and useragent...
function hashString(input: string): string {
    return crypto.createHash("sha256").update(input).digest("hex");
}

export const viewCreationController = asyncErrorHandler( async (request:NextRequest) => { 
    const { postid , fromPage } = await request.json() ; // getting postid from body...

    if (!postid) {
        console.log("Post Id missing , please check...");
        return NextResponse.json({ message:'Post id missing !!' },{ status:400 });
    }

    // getting extract IP address from request headers...
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ipAddress = forwardedFor ? forwardedFor.split(",")[0].trim() : request.headers.get("x-real-ip") || "unknown";
    
    // Extract User-Agent from request headers
    const userAgent = request.headers.get("user-agent") || "unknown";
    
    // Hash the IP address and User-Agent
    const ipHash = hashString(ipAddress);
    const userAgentHash = hashString(userAgent);

   //  await trackingPostViewService(postid,fromPage,ipHash,userAgentHash) ;
    return NextResponse.json({ message:'View created successfully !!' },{ status:200 });
})
