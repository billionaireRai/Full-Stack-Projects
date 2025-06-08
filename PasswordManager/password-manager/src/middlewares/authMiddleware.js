import { NextResponse } from "next/server";
import { cookies , headers } from "next/headers";
import jsonWebToken from 'jsonwebtoken';

// protected route matcher
export const config = {
    matcher: '/user/:user-id'
};

export function authMiddleware(request) {
    const { pathname } = request.nextUrl;
    // Check if the request is for a protected route...
    if (pathname.startsWith('/user/')) {
        const userCookie = cookies(); // initializing the cookies function...
        const requestHeaders = headers(request.headers); // initializing header function

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
            decodedAccessToken = jsonWebToken.verify(accessToken, process.env.SECRET_FOR_ACCESS_TOKEN);
        } catch (error) {
            console.log("An Error Occured :",error);
            return NextResponse.json({
                error: "Unauthorized User Trying to access secured route page...",
                status: 401
            });
        }
        console.log("Correct Decoded accessToken :", decodedAccessToken); 
        //passing user info via headers if needed ( New Concept )...
        const response = NextResponse.next(); // capturing the control , going to next middleware...
        response.headers.set('userObj', JSON.stringify(decodedAccessToken));
    }
    // Allow the request to continue to next middleware...
    return NextResponse.next();
}

export default authMiddleware ;