import { NextRequest , NextResponse } from "next/server";
import { cookies } from "next/headers";
import asyncErrorHandler from "@/app/middleware/errorMiddleware";
import sendEmailFunction from "@/lib/email";
import { userRegistrationService, userCardProp } from '@/app/db/services/user';
import { generateWelcomeEmailHTML } from '@/components/welcome';
import jsonWebtoken, { JwtPayload } from "jsonwebtoken";
import users from "../db/models/users";

export interface returnDataType {
    userId:string,
    email:string,
    activeAccount:userCardProp
}
export interface registrationDataType {
    Name:string,
    Username:string,
    Email:string,
    Password:string
}

export const registerUserController = asyncErrorHandler(async (request:NextRequest) => {
     const { Name , Username , Email , Password } = await request.json() ; // extracting data from request body...
    // applying some importants checks...
    if (!Name || !Username || !Email || !Password) {
        console.log('One or More credentials missing check again!!!');
        return NextResponse.json({message:'Send every neccessary credential...'},{ status:400 });
    }

    const data = await userRegistrationService({ Name, Username, Email, Password }); // triggering registration function...
    // Check if the service returned an error response (NextResponse)
    if (data instanceof NextResponse) return data; // Return the error response directly

    // setting accessToken in cookies...
    const Cookies = await cookies();
    const setCookiesForAuth = () => {
        Cookies.set('accessToken', data.accessToken);
        Cookies.set('refreshToken', data.refreshToken);
    }

    setCookiesForAuth() // calling function to set
    // sending a welcome EMAIL...
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    await sendEmailFunction({
       to: data?.email,
       subject: "Welcome to (Briezl) you social media platform",
       html: generateWelcomeEmailHTML({ name: Name, email: Email, handle: `@${Username}`, baseUrl:baseUrl }),
    });

    // filtering data to send.
    const Data : returnDataType = {
        email:data?.email,
        userId:data?.userId,
        activeAccount:data?.accountInfo
    }

    return NextResponse.json({ message:'User registration Successfull !!', userCred : Data , handle:`@${Username}`},{ status:200 });

})


export const logginUserController = asyncErrorHandler( async (request:NextRequest) => {
    const { email , password } = await request.json() ; // extracting the infos...
    console.log('Email & password :',email ,password); // debugginn step...

    return NextResponse.json({message:'User logged In successfully'},{status:200});
})

export const refreshTokenController = asyncErrorHandler(async (request: NextRequest) => {
    const Cookies = await cookies();
    const refreshTokenValue = Cookies.get('refreshToken')?.value;

    if (!refreshTokenValue) {
        return NextResponse.json({ message: 'Refresh token not found' }, { status: 401 });
    }

    try {
        if (!process.env.SECRET_FOR_REFRESH_TOKEN) throw new Error('SECRET_FOR_REFRESH_TOKEN is missing in ENV file!!');

        const decodedRefreshToken = jsonWebtoken.verify(refreshTokenValue, process.env.SECRET_FOR_REFRESH_TOKEN) as JwtPayload;

        // Find user by id from refresh token
        const user = await users.findById(decodedRefreshToken.id).select('+refreshToken');
        if (!user || !user.refreshToken || user.refreshToken.value !== refreshTokenValue) {
            return NextResponse.json({ message: 'Invalid refresh token' }, { status: 401 });
        }

        // Check if refresh token is expired
        const currentTime = Math.floor(Date.now() / 1000);
        if (user.refreshToken.rfExpiry && new Date(user.refreshToken.rfExpiry).getTime() / 1000 < currentTime) {
            return NextResponse.json({ message: 'Refresh token expired' }, { status: 401 });
        }

        // Generate new tokens
        const newAccessToken = user.generateAccessToken();
        const newRefreshToken = user.generateRefreshToken();

        // Update refresh token in DB
        user.refreshToken = { value: newRefreshToken.token, rfExpiry: newRefreshToken.expiry };
        await user.save();

        // Set new cookies
        Cookies.set('accessToken', newAccessToken);
        Cookies.set('refreshToken', newRefreshToken.token);

        return NextResponse.json({ message: 'Tokens refreshed successfully' }, { status: 200 });
    } catch (error) {
        console.log("Error refreshing token:", error);
        return NextResponse.json({ message: 'Invalid refresh token' }, { status: 401 });
    }
})
