import { NextRequest , NextResponse , userAgent } from "next/server";
import { cookies } from "next/headers";
import asyncErrorHandler from "@/app/middleware/errorMiddleware";
import sendEmailFunction from "@/lib/email";
import { userRegistrationService, userCardProp , logginUserService, creatingUserAfterOauth } from '@/app/db/services/user';
import { generateWelcomeEmailHTML } from '@/components/welcome';
import jsonWebtoken, { JwtPayload } from "jsonwebtoken";
import users from "../db/models/users";
import { generateRandomString, generatePKCE } from "@/lib/oauthcrypto";
import { validateAndConsumeState , findOAuthState , saveOAuthState } from "@/app/db/services/oauth";
import { OAuth2Client } from "google-auth-library";
import axios from "axios";
import { loginemail } from "@/components/loginemail";

export interface returnDataType {
    userId:string,
    email:string,
    activeAccount:userCardProp
}
export interface registrationDataType {
    Name:string,
    Username:string,
    Email:string,
    Password:string,
    lat:string,
    long:string,
    text:string
}

export interface loginDataType {
    email:string,
    password:string
}

const googleClientId = process.env.GOOGLE_CLIENT_ID ;
const googleRedirect = process.env.GOOGLE_REDIRECT_REGISTER_URI ;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET ;
const facebookClientId = process.env.FACEBOOK_CLIENT_ID ;
const facebookClientSecret = process.env.FACEBOOK_CLIENT_SECRET ;
const facebookRedirect = process.env.FACEBOOK_REDIRECT_URI ;

// Collecting Ip address
function getClientIP(req:NextRequest) {
     return (
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        req.headers.get("x-real-ip") ||
        ''
     );
}

// registration controller...
export const registerUserController = asyncErrorHandler(async (request:NextRequest) => {
     const { Name , Username , Email , Password } = await request.json() ; // extracting data from request body...
    // extracting latitude and longitude from query params...
    const url = new URL(request.nextUrl);
    const lat = url.searchParams.get('lat');
    const long = url.searchParams.get('long');
    const text = url.searchParams.get('text');
    // applying some importants checks...
    if (!Name || !Username || !Email || !Password) {
        console.log('One or More credentials missing check again!!!');
        return NextResponse.json({message:'Send every neccessary credential...'},{ status:400 });
    }

    const data = await userRegistrationService({ Name, Username, Email, Password, lat, long, text }); // triggering registration function...
    // Check if the service returned an error response (NextResponse)
    if (data instanceof NextResponse) return data ; // Return the error response directly

    // setting accessToken in cookies...
    const Cookies = await cookies();
    const setCookiesForAuth = () => {
        Cookies.set('accessToken', data.accessToken);
        Cookies.set('refreshToken', data.refreshToken);
    }

    setCookiesForAuth() // calling function to set
    // sending a welcome EMAIL...
    // const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    // await sendEmailFunction({
    //    to: data?.email,
    //    subject: "Welcome to (Briezl) you social media platform",
    //    html: generateWelcomeEmailHTML({ name: Name, email: Email, handle: `@${Username}`, baseUrl:baseUrl }),
    // });

    // filtering data to send.
    const Data : returnDataType = {
        email:data?.email,
        userId:data?.userId,
        activeAccount:data?.accountInfo
    }

    return NextResponse.json({ message:'User registration Successfull !!', userCred : Data , handle:`@${Username}`},{ status:200 });

})


// loggin controller...
export const logginUserController = asyncErrorHandler( async (request:NextRequest) => {
    const { email , password } = await request.json() ; // extracting the infos...
    // debugging step for validation...
    if (!email || !password) {
        console.log("One of the credential is missing !!");
        return NextResponse.json({ message:'Missing credential please recheck...' },{ status:200 });
    }

    const serviceRes = await logginUserService({ email , password }) ; // calling the DB service function...
    if(serviceRes instanceof NextResponse) return serviceRes ; // returning if error retruns from service...

    // setting cookies...
    const Cookies = await cookies() ;
    Cookies.set('accessToken', serviceRes.accessToken);
    Cookies.set('refreshToken', serviceRes.refreshToken);

    // sending a email alert of login...
    // await sendEmailFunction({
    //    to: serviceRes?.email,
    //    subject: "Successfull login to you account",
    //    html:loginemail({ email:email , handle:serviceRes.accountInfo.decodedHandle , name:serviceRes.accountInfo.name })
    // });

    const info : returnDataType = {
        email:email,
        userId:serviceRes?.userId,
        activeAccount:serviceRes?.accountInfo
    }
    return NextResponse.json({message:'User logged In successfully', userCred:info , handle:`@${serviceRes.accountInfo.decodedHandle}`},{status:200});
})


// refrehing token controller...
export const refreshTokenController = asyncErrorHandler(async (request: NextRequest) => {
    const Cookies = await cookies(); // intializing the cookies...
    const refreshTokenValue = Cookies.get('refreshToken')?.value;

    if (!refreshTokenValue)  return NextResponse.json({ message: 'Unauthorized Access need to loggin !!' }, { status: 401 }) ;

    try {
        if (!process.env.SECRET_FOR_REFRESH_TOKEN) throw new Error('SECRET_FOR_REFRESH_TOKEN is missing in ENV file!!');

        const decodedRefreshToken = jsonWebtoken.verify(refreshTokenValue, process.env.SECRET_FOR_REFRESH_TOKEN) as JwtPayload;

        // Find user by id from refresh token..
        const user = await users.findById(decodedRefreshToken.id).select('+refreshToken');
        if (!user || !user.refreshToken || user.refreshToken.value !== refreshTokenValue) {
            return NextResponse.json({ message: 'Invalid refresh token' }, { status: 401 });
        }

        // Check if refresh token is expired...
        const currentTime = Math.floor(Date.now() / 1000);
        if (user.refreshToken.rfExpiry && currentTime > (new Date(user.refreshToken.rfExpiry).getTime() / 1000)) {
            return NextResponse.json({ message: 'Refresh token expired' }, { status: 401 });
        }

        // Generating new access and refresh tokens
        const newAccessToken = user.generateAccessToken();
        const newRefreshToken = user.generateRefreshToken();

        // Update refresh token in DB with correct structure...
        user.refreshToken = { value: newRefreshToken.token, rfExpiry: newRefreshToken.expiry }; 
        await user.save(); // saving the user...

        // Set new cookies
        Cookies.set('accessToken', newAccessToken);
        Cookies.set('refreshToken', newRefreshToken.token);

        return NextResponse.json({ message: 'Tokens refreshed successfully' }, { status: 200 });
    } catch (error) {
        console.log("Error refreshing token:", error);
        return NextResponse.json({ message: 'Invalid refresh token' }, { status: 401 });
    }
})


export const o_authGoogleController = asyncErrorHandler(async (request:NextRequest) => {
        const requestUrl = new URL(request.nextUrl) ;
        const intent = (requestUrl.searchParams.get("intent") || ' ') as ' ' | 'signup' | 'login' ;
    
        if (!googleClientId || !googleRedirect) {
            return NextResponse.json(
                { error: "Google OAuth not configured , check ENV file..." },
                { status: 500 }
            );
        }
        const state = generateRandomString(32) ; // generating a random string...
        // generating PKEC ...
        const { codeVerifier, codeChallenge, codeChallengeMethod } = generatePKCE();
    
        const ip = getClientIP(request) ; // getting the client IP...
        const ua = userAgent(request) ; // getting the user device...
    
        await saveOAuthState({state,codeVerifier,intent: intent ,ipAddress: ip ,userAgent: ua});
    
        const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(googleRedirect)}&response_type=code&scope=email profile&state=${state}&access_type=offline&prompt=consent&code_challenge=${codeChallenge}&code_challenge_method=${codeChallengeMethod}` ;
        
        return NextResponse.redirect(googleAuthUrl) ;
})

export const o_authGoogleCallbackController = asyncErrorHandler(async (request:NextRequest) => {
     const url = new URL(request.nextUrl) ; // intializing the URL...

    // extracting the search params...
    const code = url.searchParams.get('code') ;  
    const state = url.searchParams.get('state') ;  

    if (!code || !state) {
        console.log("either of code OR state is missing !!");
        return NextResponse.json({message:'Important credentials missing...'});
    }

    const oAuthState = await validateAndConsumeState(String(state)) ;
    const STATE = await findOAuthState(state);
    if (!oAuthState) {
        console.log("o-auth state did'nt exists !!");
        return NextResponse.json({message:'o-auth state unavailable...'},{ status:402 });
    }

    // exchanging the code by tokens...
    const tokenUrl = 'https://oauth2.googleapis.com/token';
    const params = new URLSearchParams({})
    params.append('grant_type','authorization_code');
    params.append('code',code);
    params.append('redirect_uri',googleRedirect as string);
    params.append('client_secret',clientSecret as string);
    params.append('client_id',googleClientId as string); 
    params.append('code_verifier',STATE?.codeVerifier as string);

    const apires = await axios.post(tokenUrl, params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const { id_token } = apires.data ; // extracting the ID-token...

    if (!id_token) {
        console.log("ID token not found in googleapi response!!!");
        return NextResponse.json({ message: 'ID token missing from google side...' }, { status: 400 });
    }

    // Validate the ID token
    const client = new OAuth2Client(googleClientId);
    let ticket;
    try {
        ticket = await client.verifyIdToken({ idToken: id_token , audience: googleClientId });
    } catch (error) {
        console.log("ID token validation failed:", error);
        return NextResponse.json({ message: 'Invalid ID token' }, { status: 401 });
    }

    const payload = ticket.getPayload();

    // Check issuer
    if (payload?.iss !== 'https://accounts.google.com') {
        console.log("Invalid issuer");
        return NextResponse.json({ message: 'Invalid token issuer' }, { status: 401 });
    }

    // Check audience
    if (payload?.aud !== googleClientId) {
        console.log("Invalid audience");
        return NextResponse.json({ message: 'Invalid token audience' }, { status: 401 });
    }

    // Check expiry
    const currentTime = Math.floor(Date.now() / 1000);
    if (payload?.exp && currentTime > payload.exp) {
        console.log("Token Already expired");
        return NextResponse.json({ message: 'Token Already expired' }, { status: 401 });
    }

    // Check email_verified
    if (!payload?.email_verified) {
        console.log("Email not verified !!");
        return NextResponse.json({ message: 'Email not verified...' }, { status: 401 });
    }

    // Extract user info from payload
    const email = payload.email!;
    const name = payload.name!;
    const profilePic = payload.picture!;
    // Proceed with user registration...
    const userData = await creatingUserAfterOauth(email, name,profilePic,'google'); // executing create user command...

    // Check if the service returned an error respons...
    if (userData instanceof NextResponse) return userData ;

    // Set cookies
    const Cookies = await cookies();
    Cookies.set('accessToken', userData.accessToken);
    Cookies.set('refreshToken', userData.refreshToken);

    // Send welcome email
    // const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    // await sendEmailFunction({
    //     to: userData.email,
    //     subject: "Welcome to (Briezl) you social media platform",
    //     html: generateWelcomeEmailHTML({ name: name, email: email, handle: `@${userData.accountInfo.decodedHandle}`, baseUrl: baseUrl }),
    // });

    // Redirect to profile page
    const profileUrl = `${process.env.NODE_ENV === 'development' && process.env.NEXTAUTH_URL}/@${userData.accountInfo.decodedHandle}?utm_source=google`;
    return NextResponse.redirect(profileUrl);

})

export const o_authFacebookController = asyncErrorHandler(async (request:NextRequest) => {
    const requestUrl = new URL(request.nextUrl) ;
    const intent = (requestUrl.searchParams.get("intent") || ' ') as ' ' | 'signup' | 'login' ;

    if (!facebookClientId || !facebookRedirect) {
        console.log("Facebook OAuth not configured: missing clientId or redirectUri");
        return NextResponse.json({ error: "facebook OAuth not configured , check ENV file..." },{ status: 500 });
    }
    const state = generateRandomString(32) ; // generating a random string..
    // generating PKEC ...
    const { codeVerifier } = generatePKCE(); // extracting the code verifier...

    const ip = getClientIP(request) ; // getting the client IP...
    const ua = userAgent(request) ; // getting the user device...

    await saveOAuthState({state,codeVerifier,intent: intent ,ipAddress: ip ,userAgent: ua});

    const authorizationUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${facebookClientId}&redirect_uri=${encodeURIComponent(facebookRedirect)}&response_type=code&scope=email,public_profile&state=${state}` ;

    console.log("Facebook OAuth authorization URL:", authorizationUrl);
    return NextResponse.redirect(authorizationUrl) ; // redirecting user to facebook consent screen...
})

export const o_authFacebookCallbackController = asyncErrorHandler(async (request:NextRequest) => {
    const requestURL = new URL(request.nextUrl);
    const code = requestURL.searchParams.get('code');
    const state = requestURL.searchParams.get('state');

    if (!code || !state) {
        console.log("either of code OR state is missing !!");
        return NextResponse.json({message:'Important credentials missing...'});
    }

    // verifying the state from DB...
    const oAuthState = await validateAndConsumeState(String(state)) ; // validation the o-auth request...
    if (!oAuthState) {
        console.log("o-auth state did'nt exists !!");
        return NextResponse.json({message:'o-auth state unavailable...'},{ status:402 });
    }

    // making request for tokens...
    const tokenUrl = `https://graph.facebook.com/v18.0/oauth/access_token?client_id=${facebookClientId}&client_secret=${facebookClientSecret}&redirect_uri=${encodeURIComponent(facebookRedirect as string)}&code=${code}`;

    const tokenRes = await axios.get(tokenUrl);

    // extracting access_token...
    const { access_token } = tokenRes.data ;

    if (!access_token) {
        console.log("Access token not found in Facebook response");
        return NextResponse.json({ message: 'Access token missing from Facebook' }, { status: 400 });
    }

    // getting user info...
    const userUrl = `https://graph.facebook.com/me?fields=name,email,picture&access_token=${access_token}` ;
    const dataRes = await axios.get(userUrl);
    const { name , email , picture } = dataRes.data ; // taking name and email out...

    if (!email) {
        console.log("Email not found in Facebook user info");
        return NextResponse.json({ message: 'Email missing from Facebook' }, { status: 400 });
    }

    // Proceed with user registration...
    const userinfo = await creatingUserAfterOauth(email, name, picture, 'facebook'); // executing create user command...

    // Check if the service returned an error respons...
    if (userinfo instanceof NextResponse) return userinfo ;

    // Set cookies
    const Cookies = await cookies();
    Cookies.set('accessToken', userinfo.accessToken);
    Cookies.set('refreshToken', userinfo.refreshToken);

    // Send welcome email
    // const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    // await sendEmailFunction({
    //     to: userinfo.email,
    //     subject: "Welcome to (Briezl) you social media platform",
    //     html: generateWelcomeEmailHTML({ name: name, email: email, handle: `@${userinfo.accountInfo.decodedHandle}`, baseUrl: baseUrl }),
    // });

    // Redirect to profile page
    const profileUrl = `${process.env.NODE_ENV === 'development' && process.env.NEXTAUTH_URL}/@${userinfo.accountInfo.decodedHandle}?utm_source=facebook`;
    return NextResponse.redirect(profileUrl);
})
    