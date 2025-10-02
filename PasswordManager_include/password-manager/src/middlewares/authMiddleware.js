import { NextResponse } from "next/server";
import { cookies , headers } from "next/headers";
import jsonWebToken from 'jsonwebtoken';

export const config = {
    matcher: ['/user/:user-id', ] // URL structure from where the request is coming...
};

export function authMiddleware(request) {
    const { pathname } = request.nextUrl;
    // Check if the request is for a protected route...
    if (pathname.startsWith('/user/')) {
        const userCookie = cookies(); // initializing the cookies function...
        const requestHeaders = headers(); // initializing header function

        let accessToken = userCookie.get('accessToken')?.value; // checking for accessToken...
        const authHeader = requestHeaders.get('Authorization'); // authorization header...

        // If Authorization header is present and starts with Bearer, use that token
        if (!accessToken && authHeader && authHeader.startsWith('Bearer '))  accessToken = authHeader.substring(7);
        if (!accessToken) {
            // Redirect to login page with redirect query param
            const loginURL = new URL('/auth/login', request.url);
            loginURL.searchParams.set('redirectFrom', pathname);
            return NextResponse.redirect(loginURL);
        }

        let decodedAccessToken ; // for storing the value of accessToken...
        try {
            decodedAccessToken = jsonWebToken.verify(accessToken, process.env.SECRET_FOR_ACCESS_TOKEN); // gives decoded-data , iat , exp
            // if access token is expired...
            const currentTime = Math.floor(Date.now() / 1000); // getting current time after converting in seconds...
            if (currentTime >= decodedAccessToken.exp) {
                console.log("accesstoken coming from user is EXPIRED...")
                return NextResponse.redirect('/auth/re-auth')
            }
        } catch (error) {
            console.log("An Error Occured :",error);
            return NextResponse.json({
                error: "Unauthorized User Trying to access secured route page...",
                status: 401
            });
        } 
        return { decodedUser : decodedAccessToken } ;
    }
    // Allow the request to continue to next middleware...
    return NextResponse.next();
}

export default authMiddleware ;