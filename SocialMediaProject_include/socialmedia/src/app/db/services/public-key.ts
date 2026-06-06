import { NextResponse } from "next/server";
import accounts from "../models/accounts";
import { getDecodedDataFromCookie } from "@/lib/cookiehandler";
import { connectWithMongoDB } from "../dbConnection";
import pubkeys from "../models/pubkeys";

export const storePublicKeyInDBService = async ( key:string , accid:string , ip:string ) => {
    await connectWithMongoDB(); // establishing connection with mongodb...
    
    // getting credentials from cookies...
    const user = await getDecodedDataFromCookie("accessToken");
    if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST...' });
    
    // getting my active account...
    const activeAcc = await accounts.findOne({ userId: user.id, 'account.Active': true, 'account.status': 'ACTIVE' });
    if (!activeAcc) return NextResponse.json({ message: 'Current account not found' }, { status: 404 });

    await pubkeys.findOneAndUpdate({ accountId:accid , status:'active' },{ status:'unactive' }); // setting previous keys as unactive...

    await pubkeys.create({ accountId:accid , deviceIP:ip , publicKey:key });
}