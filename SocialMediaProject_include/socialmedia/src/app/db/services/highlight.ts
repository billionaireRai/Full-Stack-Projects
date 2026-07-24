import { NextResponse } from "next/server";
import { connectWithMongoDB } from "../dbConnection";
import accounts from "../models/accounts";
import { getDecodedDataFromCookie } from "@/lib/cookiehandler";
import tagged from "../models/tagged";

export const hightLightPostToggleService = async ({ postId , changeTo }:{ postId:string ; changeTo:boolean }) => {
    await connectWithMongoDB() ; // connecting to database...
    
    // getting credentials from cookies...
    const user = await getDecodedDataFromCookie("accessToken");
    if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST...' });
              
    // getting the active account...
    const activeAcc = await accounts.findOne({ userId: user.id , 'account.Active':true , 'account.status':'ACTIVE' });
    if (!activeAcc) return NextResponse.json({ message: 'Current account not found' }, { status: 404 });


    const dbQuery = { accountId:activeAcc._id , taggedAs:'highlighted' , entityId:postId };
    const alreadyHighlighted = await tagged.findOne(dbQuery);

    if (changeTo && !alreadyHighlighted) {
        await tagged.create(dbQuery);
    }
    if (!changeTo && alreadyHighlighted) {
        await tagged.deleteOne(dbQuery);

    }
    if (changeTo && alreadyHighlighted) {
        console.log("Can't create duplicate highlights !!");
        return NextResponse.json({ message:'Duplicate highlights not allowed !!' },{ status:400 });
    }
    if (!changeTo && !alreadyHighlighted) {
        console.log("Can't delete unavailable highlight !!")
        return NextResponse.json({ message:'Highlight unavailable to delete !!' },{ status:400 });
    }
}