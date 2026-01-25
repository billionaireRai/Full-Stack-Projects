import { NextResponse } from "next/server";
import { connectWithMongoDB } from "@/app/db/dbConnection";
import { getDecodedDataFromCookie } from "@/lib/cookiehandler";
import { reportInfoType } from "@/app/controllers/user";
import { userCardProp } from "./user";
import { fmt } from "./user";
import sendEmailFunction from "@/lib/email";
import accounts from "@/app/db/models/accounts";
import follows from "@/app/db/models/follows";
import reports from "../models/reports";
import Post from "../models/posts";
import users from "../models/users";
import { newAccType } from "@/app/controllers/user";
import { generateReportEmailHTML } from "@/components/report";
import asyncErrorHandler from "@/app/middleware/errorMiddleware";

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

export async function userReportService(report:reportInfoType) {
    await connectWithMongoDB() ; // establishing Db connection...

    const user = await getDecodedDataFromCookie("accessToken");
    if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST...' });

    const myAccount = await accounts.findOne({ userId: user.id , 'account.Active':true});
    if (!myAccount) return NextResponse.json({ message: 'Your account not found' }, { status: 404 });

    const reportedAccount = await accounts.findOne({ username: (report.reportedFor).substring(1) });

    const reportEntry = new reports({ reportedBy:myAccount._id, reportedEntityId:reportedAccount._id, reportedEntityType:'account', reasonCategory:report.selectedOne.value, description:report.description, priority:report.selectedOne.priority });

    await reportEntry.save() ; // saving the report doc...

    // sending a report confirmation email...
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

    await sendEmailFunction({
       to: user.email ,
       subject: "Report Submitted Successfully - Briezl",
       html: generateReportEmailHTML({ description: report.description, reason: report.selectedOne.label, reportedFor: report.reportedFor }),
    });

    return NextResponse.json({ message: 'Report submitted successfully' }, { status: 200 });
}

export const newAccountCreationService = async (newAcc:newAccType) => { 
    await connectWithMongoDB() ; // connecting to database...

    const user = await getDecodedDataFromCookie("accessToken");
    if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST...' });

    const viewerAcc = await accounts.findOne({ userId: user.id , 'account.Active':true });
    if (!viewerAcc) return NextResponse.json({ message: 'Current account not found' }, { status: 404 });

    const NewAccount = new accounts({
        userId:viewerAcc._id,
        name:newAcc.Name ,
        username:newAcc.Username,
        'avatar.url':'/images/default-profile-pic.png', 
        'banner.url':'/images/default-banner.jpg',
        'account.Active':false ,
        'account.Type':newAcc.accType.label,
    }) ;

    await NewAccount.save() ; // saving the createed doc...

    return NextResponse.json({ message: 'Account created successfully...' }, { status: 200 });
}

export const fetchingAccountsService = async (handle:string) => {
    await connectWithMongoDB() ; // connecting to database..

    const user = await getDecodedDataFromCookie("accessToken");
    if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST...' });

    const activeAcc = await accounts.findOne({ username:handle , userId: user.id , 'account.Active':true });
    if (!activeAcc) return NextResponse.json({ message: 'Current account not found' }, { status: 404 });

    async function returnAccountDataInStructure(accountId:string) : Promise<userCardProp> {
        const paticularAcc = await accounts.findById(accountId) ;
        // getting count of followers and followings...
        const followers = await follows.find({ followingId : paticularAcc._id , isDeleted:false })
        const following = await follows.find({ followerId : paticularAcc._id , isDeleted:false })
        const posts = await Post.find({ authorId:paticularAcc._id , isDeleted:false }) ;
        const isfollowing = await follows.exists({$and:[{ followerId:activeAcc._id },{ followingId:paticularAcc._id },{ isDeleted:false }]}) ;
    
        return {
            id: paticularAcc._id.toString(),
            decodedHandle:paticularAcc.username,
            name:paticularAcc.name,
            content:paticularAcc.bio,
            account:{
                name:paticularAcc.name ,
                handle:paticularAcc.username ,
                bio:paticularAcc.bio ,
                location:{
                  text:paticularAcc.location.text,
                  coordinates:paticularAcc.location.coordinates // lat,long
                },
                website:paticularAcc.website,
                joinDate:String(paticularAcc.createdAt),
                following:fmt(following.length),
                followers:fmt(followers.length),
                Posts:fmt(posts.length),
                isCompleted:paticularAcc.account.completed,
                isVerified:paticularAcc.isVerified.value,
                bannerUrl:paticularAcc.banner.url,
                avatarUrl:paticularAcc.avatar.url
            },
            IsFollowing: isfollowing ? true : false
        }
    
    }

    const allAccounts = await accounts.find({ $and:[{ userId:user.id },{ 'account.status':{ $in: ['ACTIVE','DEACTIVATED'] } }]}) ;

    const structuredAcc = allAccounts.map((acc) => { 
        return returnAccountDataInStructure(acc._id) ;
    })

    return NextResponse.json({ message: 'accounts fetched...' , allAccs:structuredAcc }, { status: 200 });
}

export const switchAccountService =  async (toAccount:userCardProp) => {
    await connectWithMongoDB() ; // establishing connection to db...

    const user = await getDecodedDataFromCookie("accessToken");
    if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST...' });

    // removing active state from current account...
    const removing = await accounts.findOneAndUpdate(
        { username:toAccount.decodedHandle , userId: user.id , 'account.Active':true , 'account.status':'ACTIVE' },
        { 'account.Active':false } , { new:true }
    );

    // adding active state toAccount...
    const newActive = await accounts.findOneAndUpdate(
        { username:toAccount.decodedHandle , userId:user.id , 'account.Active':false , 'account.status':'ACTIVE' },
        { 'account.Active':true } , { new:true }
    ) ;

    if (!removing || !newActive) {
        console.log('Any of 2 Accounts is missing !!');
        return NextResponse.json({ message:'Anyone account undefined !!' },{ status:400 }) ;
    }
    
    return NextResponse.json({ message:'Account successfully switched...' },{ status:200 });
}