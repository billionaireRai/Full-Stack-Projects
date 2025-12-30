import { NextRequest, NextResponse } from "next/server";
import { cookies , headers } from "next/headers";
import users from "../db/models/users";
import jsonWebtoken, { JwtPayload } from "jsonwebtoken";

// client URLs whos request will be authenticated...
export const config = {
    matcher: ['/username','/explore','/payment-page']
};

export default async function authMiddleware(request:NextRequest): Promise<NextResponse> {
    const { pathname } = request.nextUrl ; // URL from which request is coming...
    console.log('Request coming from path :',pathname) ; // a debugging step...
    // Check if the request is for a protected route...
    if (config.matcher.includes(pathname)) {
        const userCookie  = await cookies(); // initializing the cookies function...
        const requestHeaders = await headers(); // same with header...

        const accessTokenValue = userCookie.get('accessToken')?.value; // checking for accessToken...
        const authHeader = requestHeaders.get('Authorization'); // authorization header...

        let accessToken = accessTokenValue;
        // If Authorization header is present and starts with Bearer, use that token
        if (!accessToken && authHeader && authHeader.startsWith('Bearer'))  accessToken = authHeader.substring(7); // for mobile users.
        if (!accessToken) {
            // Redirect to login page with redirect query param
            const loginurl = new URL('/auth/log-in', request.url);
            loginurl.searchParams.set('redirect-From', pathname);
            return NextResponse.redirect(loginurl,{status:300,statusText:'Redirecting user for Authentication...'});
        }

        let decodedAccessToken ; // for storing the value of accessToken...
        try {
            if (!process.env.SECRET_FOR_ACCESS_TOKEN) throw new Error('SECRET_FOR_ACCESS_TOKEN is missing in ENV file!!');

            // gives decoded-data , iat , exp...
            decodedAccessToken = jsonWebtoken.verify(accessToken, process.env.SECRET_FOR_ACCESS_TOKEN) as JwtPayload ;
            // if access token is expired...
            const currentTime = Math.floor(Date.now() / 1000); // using GIF for converting in seconds...
            if (decodedAccessToken.exp && ( currentTime >= decodedAccessToken.exp )) {
                console.log("accessToken is EXPIRED!!!");
                return NextResponse.json({message:'ACCESS_TOKEN_EXPIRED'},{ status:401 });
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

// using the decoded data of the JWT in any ROUTE HANDLER...

// import { headers } from 'next/headers';

// export async function GET() {
//   const userId = headers().get('x-user-id');

//   if (!userId) {
//     return Response.json({ error: 'Unauthorized' }, { status: 401 });
//   }

//   return Response.json({ userId });
// }
