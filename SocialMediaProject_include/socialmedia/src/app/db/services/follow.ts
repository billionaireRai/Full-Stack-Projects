import { NextResponse } from "next/server";
import { connectWithMongoDB } from "@/app/db/dbConnection";
import { getDecodedDataFromCookie } from "@/lib/cookiehandler"; 
import accounts from "@/app/db/models/accounts";
import follows from "@/app/db/models/follows";

export async function userFollowService(handle: string, follow: boolean) {
    await connectWithMongoDB(); // establishing DB connection...

    const targetAcc = await accounts.findOne({ username: handle });
    if (!targetAcc) return NextResponse.json({ message: 'Target user not found' }, { status: 404 });

    const user = await getDecodedDataFromCookie("accessToken");
    if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST...' });

    const myAccount = await accounts.findOne({ userId: user.id , 'account.Active':true});
    if (!myAccount) return NextResponse.json({ message: 'Your account not found' }, { status: 404 });

    // Preventing self-following
    if (myAccount._id.equals(targetAcc._id)) return NextResponse.json({ message: 'Cannot follow yourself' }, { status: 400 });

    const followObject = await follows.findOne({ followerId: myAccount._id, followingId: targetAcc._id });

    if (followObject && !follow) {
        console.log('Deleting a follow obj...');
        await follows.findByIdAndDelete(followObject._id);
        return NextResponse.json({ message: 'Following removed' }, { status: 200 });
    }

    if (!followObject && follow) {
        const newFollow = new follows({ followerId: myAccount._id, followingId: targetAcc._id });
        await newFollow.save();
        return NextResponse.json({ message: 'New following created' }, { status: 200 });
    }

    // Handle remaining edge cases...
    if (followObject && follow) return NextResponse.json({ message: 'Already following' }, { status: 200 });

    if (!followObject && !follow) return NextResponse.json({ message: 'Not following' }, { status: 200 });
}
