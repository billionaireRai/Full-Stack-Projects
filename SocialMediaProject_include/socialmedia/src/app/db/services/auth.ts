import { connectWithMongoDB } from "../dbConnection";
import { NextResponse } from "next/server";
import { getDecodedDataFromCookie } from "@/lib/cookiehandler";
import users from "../models/users";
import Presense from "../models/presense";
import accounts from "../models/accounts";

export const activeAccountLogoutService = async (handle:string) => { 
    await connectWithMongoDB() ; // establishing connection with DB...

    const user = await getDecodedDataFromCookie("accessToken");
    if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST...' });

    const activeAcc = await accounts.findOne({ userId: user.id , username:handle.substring(1) , 'account.Active':true , 'account.status':'ACTIVE' });

    if (!activeAcc) {
        console.log("LoggedIn in account not found !!");
        return NextResponse.json({ message:'Logged in account , not found !!'});
    }
    // getting the user doc...
    const userDoc = await users.findOneAndUpdate({ $and:[{ _id:user.id },{ email:user.email }] },
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

    // updating Presense state in DB...
    await Presense.updateOne({ accountId:activeAcc._id },{ onlineStatus:'offline' });
    const response = NextResponse.json({ message:'logged-out from server...'},{ status:200 }) ;

    // setting action token cookie deletion...
    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken');

    return response ; // returning a response...
}