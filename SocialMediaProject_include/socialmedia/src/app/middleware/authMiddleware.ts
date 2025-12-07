import { NextRequest, NextResponse } from "next/server";
import { cookies , headers } from "next/headers";
import jsonWebtoken, { JwtPayload } from "jsonwebtoken";

// request URLs whos request will be authenticated...
export const config = {
    matcher: ['/username/']
};

export default async function authMiddleware(request:NextRequest): Promise<NextResponse> {
    const { pathname } = request.nextUrl ; // URL from which request is coming...
    // Check if the request is for a protected route...
    if (pathname.startsWith('/username/')) {
        const userCookie  = await cookies(); // initializing the cookies function...
        const requestHeaders = await headers(); // same with header...

        let accessToken = userCookie.get('accessToken')?.value; // checking for accessToken...
        const authHeader = requestHeaders.get('Authorization'); // authorization header...

        // If Authorization header is present and starts with Bearer, use that token
        if (!accessToken && authHeader && authHeader.startsWith('Bearer'))  accessToken = authHeader.substring(7);
        if (!accessToken) {
            // Redirect to login page with redirect query param
            const loginurl = new URL('/auth/log-in', request.url);
            loginurl.searchParams.set('redirect-From', pathname);
            return NextResponse.redirect(loginurl,{status:300,statusText:'Redirecting user for Authentication...'});
        }

        let decodedAccessToken ; // for storing the value of accessToken...
        try {
            if (!process.env.SECRET_FOR_ACCESS_TOKEN) throw new Error('SECRET_FOR_ACCESS_TOKEN is missing in ENV file');
            
            // gives decoded-data , iat , exp...
            decodedAccessToken = jsonWebtoken.verify(accessToken, process.env.SECRET_FOR_ACCESS_TOKEN) as JwtPayload ; 
            // if access token is expired...
            const currentTime = Math.floor(Date.now() / 1000); // using GIF for converting in seconds...
            if (decodedAccessToken.exp && ( currentTime >= decodedAccessToken.exp )) {
                console.log("accessToken is EXPIRED!!!");
                return NextResponse.json({message:'Your accessToken has expired!!!'});
            }
        } catch (error) {
            console.log("An error in decoding accessToken :",error);
            return NextResponse.json({
                error: "Decoding accessToken failed...",
                status: 401
            });
        }
        // Allow the request to continue to next middleware...
        return NextResponse.next();
    }
    return NextResponse.next();
}
