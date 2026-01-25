import { connectWithMongoDB } from "../dbConnection";
import { NextResponse } from "next/server";
import { getDecodedDataFromCookie } from "@/lib/cookiehandler";
import users from "../models/users";

export const activeAccountLogoutService = async (handle:string) => { 
    await connectWithMongoDB() ; // establishing connection with DB...

    const user = await getDecodedDataFromCookie("accessToken");
    if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST...' });

    // getting the user doc...
    const userDoc = await users.findOneAndUpdate(
        { $and:[{ _id:user.id },{ email:user.email }] },
        {  refreshToken: {
            value:'',
            rfExpiry:new Date()
        } },
        { new:true }
    ) ;  

    if (!userDoc) {
        console.log('User didnt exists !!');
        return NextResponse.json({ message: 'userdoc unavailable' },{ status:400 }) ;
    }

    const response = NextResponse.json({ message:'logged-out from server...'},{ status:200 }) ;

    // setting action token cookie deletion...
    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken');

    return response ; // returning a response...
}