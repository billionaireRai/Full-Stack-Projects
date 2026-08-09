import { NextRequest , NextResponse } from "next/server";
import crypto from "crypto";
import asyncErrorHandler from "../middleware/errorMiddleware";
import { getAllViewsOfPostService, trackingPostViewService } from "../db/services/views";

// normalize & extract the real client IP from the available request headers...
const extractClientIP = (request: NextRequest) : string => {
    const forwardedFor = request.headers.get("x-forwarded-for");
    if (forwardedFor) {
        const ips = forwardedFor.split(",").map(ip => ip.trim()).filter(Boolean);
        // take the last non-loopback ip if present, else the last one...
        const nonLoopback = ips.filter(ip => ip !== "::1" && ip !== "127.0.0.1" && ip !== "::ffff:127.0.0.1");
        const rawIp = (nonLoopback.length ? nonLoopback : ips)[ips.length - 1];
        return normalizeIP(rawIp);
    }

    const realIp = request.headers.get("x-real-ip");
    if (realIp) return normalizeIP(realIp);

    const remoteAddr = (request as any).ip || request.headers.get("x-forwarded-for");
    return remoteAddr || "unknown";
};

// strip the IPv6-mapped prefix & normalize loopback addresses...
const normalizeIP = (ip: string) : string => {
    if (!ip || ip === "unknown") return "unknown";
    return ip.replace("::ffff:", ""); 
};

// produce a stable privacy-preserving sha-256 hash of a value...
const hashValue = (value: string) : string => {
    return crypto.createHash("sha256").update(value).digest("hex");
};


export const viewCreationController = asyncErrorHandler( async (request:NextRequest) => { 
    const body = await request.json() ; // getting postid from body...
    const postid = body.postId ?? body.postid ; // accept both camelCase and lowercase...
    const fromPage = body.fromPage || 'feed' ; // default the source page...

    if (!postid) {
        console.log("Post Id missing , please check...");
        return NextResponse.json({ message:'Post id missing !!' },{ status:400 });
    }

    // getting & normalizing the real client IP from request headers, then hashing it...
    const clientIP = extractClientIP(request);
    const ipHash = clientIP === "unknown" ? "unknown" : hashValue(clientIP);

    // Extract & hash the User-Agent from request headers
    const rawUserAgent = request.headers.get("user-agent") || "unknown";
    const userAgentHash = rawUserAgent === "unknown" ? "unknown" : hashValue(rawUserAgent);
    
    await trackingPostViewService(postid,fromPage,ipHash,userAgentHash) ;
    return NextResponse.json({ message:'View created successfully !!' },{ status:200 });
})

export const getAllViewsOfPostController = asyncErrorHandler( async (request:NextRequest) => {
    const url = new URL(request.nextUrl) ;
    const postid = url.searchParams.get('postid') ?? url.searchParams.get('postId');
    
    const page =  parseInt(String(url.searchParams.get('page')));
    const size = parseInt(String(url.searchParams.get('size')));

    if (!postid || !page || !size) {
        console.log("Important credential missing");
        return NextResponse.json({ message:'Check incoming credentials...' },{ status:400 });
    } 

    await getAllViewsOfPostService({ postid , page , size }) ;
    return NextResponse.json({ message:'View fetched successfully !!' },{ status:200 });
})
