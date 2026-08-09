import { NextResponse } from "next/server";
import { connectWithMongoDB } from "@/app/db/dbConnection";
import { getDecodedDataFromCookie } from "@/lib/cookiehandler";
import { reportInfoType } from "@/app/controllers/user";
import { userCardProp } from "./user";
import { fmt } from "@/lib/utils";
import sendEmailFunction from "@/lib/email";
import accounts from "@/app/db/models/accounts";
import follows from "@/app/db/models/follows";
import reports from "../models/reports";
import Post from "../models/posts";
import { newAccType } from "@/app/controllers/user";
import { generateReportEmailHTML } from "@/components/report";
import { sendFollowNotification } from "./notifications";
import conversation from "../models/conversation";
import Block from "../models/blocked";

export async function userFollowService(handle: string, follow: boolean) {
    await connectWithMongoDB(); // establishing DB connection...

    // Normalizing the handle in case it carries the '@' prefix...
    const normalizedHandle = handle.startsWith('@') ? handle.substring(1) : handle;

    const targetAcc = await accounts.findOne({ username: normalizedHandle });
    if (!targetAcc) return NextResponse.json({ message: 'Target user not found' }, { status: 404 });

    const user = await getDecodedDataFromCookie("accessToken");
    if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST...' });

    const myAccount = await accounts.findOne({ userId: user.id , 'account.Active':true});
    if (!myAccount) return NextResponse.json({ message: 'Your account not found' }, { status: 404 });

    // Preventing self-following
    if (myAccount._id.equals(targetAcc._id)) return NextResponse.json({ message: 'Cannot follow yourself' }, { status: 400 });

    const followObject = await follows.findOne({ followerId: myAccount._id, followingId: targetAcc._id , isDeleted:false });

    // UNFOLLOW flow : user wants to remove the follow...
    if (!follow) {
        if (!followObject) return NextResponse.json({ message: 'Not following this account' }, { status: 200 });

        console.log('Deleting a follow obj...');
        await follows.findByIdAndDelete(followObject._id);
        return NextResponse.json({ message: 'Following removed' }, { status: 200 });
    }

    // FOLLOW flow : user wants to follow the target account...
    if (followObject) return NextResponse.json({ message: 'Already following' }, { status: 200 });

    // No more than 20 follows for unsubscribed accounts...
    const accountsFollowedTillNow = await follows.find({ followerId: myAccount._id , isDeleted:false }) ;
    if (!myAccount.isVerified.value && accountsFollowedTillNow.length === 20) {
        console.log('Follow action restricted !!');
        return NextResponse.json({ message: 'Follow restricted , get verified !!' }, { status: 400 });
    }

    const newFollow = new follows({ followerId: myAccount._id, followingId: targetAcc._id });
    await newFollow.save();

    // sending follow notification...
    sendFollowNotification(
        targetAcc._id.toString(),
        {
            id: myAccount._id.toString(),
            name: myAccount.name,
            username: myAccount.username,
            isVerified: !!myAccount.isVerified?.value,
            avatarUrl: myAccount.avatar?.url
        }
    );
    return NextResponse.json({ message: 'New following created' }, { status: 200 });
}

export async function userReportService(report: reportInfoType) {
    await connectWithMongoDB();

    const user = await getDecodedDataFromCookie("accessToken");
    if (user instanceof Error)  return NextResponse.json({ message: user.message }, { status: 401 });

    const myAccount = await accounts.findOne({ userId: user.id, 'account.Active': true });

    if (!myAccount) return NextResponse.json({ message: 'Your account not found' }, { status: 404 });

    let reportedEntityId , reportedEntityType ; // declaring required varaibles...


    const reportedAccount = await accounts.findOne({ 
        username: report.reportedFor.substring(1) , 'account.status':{ $nin:['DELETION_PENDING', 'DELETED', 'SUSPENDED']} 
    });

    if (!reportedAccount) return NextResponse.json({ message: 'Account to Report for not found !!' }, { status: 404 });

    if (report.postId) {
        // POST REPORT FLOW...
        const reportedPost = await Post.findById(report.postId);

        if (!reportedPost) return NextResponse.json({ message: 'Post not found' }, { status: 404 });

        reportedEntityId = reportedPost._id;
        reportedEntityType = 'post';

    } else if (report.convid){
        const conv = await conversation.findOne({ _id:report.convid , participants:{ $in:[myAccount._id] } , isDeleted:false });

        if (!conv) return NextResponse.json({ message: 'Conversation to report not found !!' }, { status: 404 });

        reportedEntityId = conv._id ;
        reportedEntityType = 'chat';

    } else {

        reportedEntityId = reportedAccount._id;
        reportedEntityType = 'profile';
    }

    const reportEntry = new reports({
        reportedBy: myAccount._id,
        reportedEntityId,
        reportedEntityType,
        reasonCategory: report.selectedOne.value,
        description: report.description,
        priority: report.selectedOne.priority
    });

    await reportEntry.save(); // saving to the collection...

    await sendEmailFunction({
        to: user.email,
        subject: "Report Submitted Successfully - Briezl",
        html: generateReportEmailHTML({ description: report.description, reason: report.selectedOne.label, reportedFor: report.reportedFor , postid:report.postId , convid:report.convid }),
    });

    return NextResponse.json({ message: 'Report submitted successfully' }, { status: 200 });
}


export const newAccountCreationService = async (newAcc:newAccType) => { 
    await connectWithMongoDB() ; // connecting to database...

    const user = await getDecodedDataFromCookie("accessToken");
    if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST...' });

    if (newAcc.userid !== user.id) return NextResponse.json({ message:'Invalid user ID sent...' },{ status:404 });
    
    const viewerAcc = await accounts.findOne({ userId: user.id , 'account.Active':true });
    if (!viewerAcc) return NextResponse.json({ message: 'Current account not found' }, { status: 404 });

    const NewAccount = new accounts({
        userId:user.id ,
        name:newAcc.Name ,
        username:newAcc.Username,
        'avatar.url':'/images/default-profile-pic.png', 
        'banner.url':'/images/default-banner.jpg',
        'account.Active':false
    }) ;

    await NewAccount.save() ; // saving the createed doc...

    return NextResponse.json({ message: 'Account created successfully...' , newAccId:NewAccount._id }, { status: 200 });
}

export const fetchingAccountsService = async (handle: string) => {
    await connectWithMongoDB(); // connecting to database..
    const user = await getDecodedDataFromCookie("accessToken");
    if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST...' });

    const activeAcc = await accounts.findOne({ username:handle ,userId:user.id, 'account.Active':true, 'account.status':{ $in:['ACTIVE','DEACTIVATED']}});

    if (!activeAcc) return NextResponse.json({ message: 'Current account not found', handle, viewerUserId: user.id }, { status: 404 });

    async function returnAccountDataInStructure(accountId:string) : Promise<userCardProp> {
        const paticularAcc = await accounts.findById(accountId) ;
        // getting count of followers and followings...
        const followers = await follows.find({ followingId : paticularAcc._id , isDeleted:false })
        const following = await follows.find({ followerId : paticularAcc._id , isDeleted:false })
        const posts = await Post.find({ authorId:paticularAcc._id , isDeleted:false }) ;
        const isfollowing = await follows.exists({$and:[{ followerId:activeAcc._id },{ followingId:paticularAcc._id },{ isDeleted:false }]}) ;
    
        return {
            id: paticularAcc._id.toString(),
            decodedHandle:`@${paticularAcc.username}`,
            name:paticularAcc.name,
            content:paticularAcc.bio,
            account:{
                name:paticularAcc.name ,
                handle:`@${paticularAcc.username}` ,
                bio:paticularAcc.bio ,
                location:{
                  text:paticularAcc.location.text,
                  coordinates:paticularAcc.location.coordinates // lat,long
                },
                website:paticularAcc.website,
                joinDate:new Date(paticularAcc.createdAt).toDateString(),
                following:fmt(following.length),
                followers:fmt(followers.length),
                Posts:fmt(posts.length),
                isCompleted:paticularAcc.account.completed,
                isVerified:paticularAcc.isVerified.value,
                plan:paticularAcc.isVerified?.level || 'Free',
                bannerUrl:paticularAcc.banner.url,
                avatarUrl:paticularAcc.avatar.url
            },
            IsFollowing: isfollowing ? true : false
        }
    
    }

    const allAccounts = await accounts.find({ $and:[{ userId:user.id },{ 'account.status':{ $in: ['ACTIVE','DEACTIVATED'] } }]}) ;

    const structuredAcc = await Promise.all(allAccounts.map( async(acc) => { 
        return await returnAccountDataInStructure(acc._id) ;
    }))

    return NextResponse.json({ message: 'Accounts fetched successfully' , allAccs:structuredAcc }, { status: 200 });
}

export const switchAccountService =  async (toAccount:userCardProp) => {
    await connectWithMongoDB() ; // establishing connection to db...

    const user = await getDecodedDataFromCookie("accessToken");
    if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST...' });

    // removing active state from current account...
    const removing = await accounts.findOneAndUpdate(
        { userId: user.id , 'account.Active':true , 'account.status':'ACTIVE' },
        { 'account.Active':false } , { new:true }
    );

    // adding active state toAccount...
    const newActive = await accounts.findOneAndUpdate(
        { username:toAccount.decodedHandle?.substring(1) , userId:user.id , 'account.Active':false , 'account.status':{ $in:['ACTIVE','DEACTIVATED']} },
        { 'account.Active':true , 'account.status':'ACTIVE' } , { new:true }
    ) ;

    if (!removing || !newActive) {
        console.log('Any of 2 Accounts is missing !!');
        return NextResponse.json({ message:'Anyone account undefined !!' },{ status:400 }) ;
    }
    
    return NextResponse.json({ message:'Account successfully switched...' },{ status:200 });
}

export const getAllTheFollowingService = async (handle:string,page:number,size:number) => {
    await connectWithMongoDB() ;

    const user = await getDecodedDataFromCookie("accessToken");
    if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST...' });

    const normalizedHandle = handle.startsWith('@') ? handle.substring(1) : handle;

    const activeAcc = await accounts.findOne({ username:normalizedHandle , userId: user.id , 'account.Active':true , 'account.status':{ $in:['ACTIVE','DEACTIVATED'] } });
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
            decodedHandle:`@${paticularAcc.username}`,
            name:paticularAcc.name,
            content:paticularAcc.bio,
            account:{
                name:paticularAcc.name ,
                handle:`@${paticularAcc.username}` ,
                bio:paticularAcc.bio ,
                location:{
                  text:paticularAcc.location.text,
                  coordinates:paticularAcc.location.coordinates // lat,long
                },
                website:paticularAcc.website,
                joinDate:new Date(paticularAcc.createdAt).toDateString(),
                following:fmt(following.length),
                followers:fmt(followers.length),
                Posts:fmt(posts.length),
                isCompleted:paticularAcc.account.completed,
                isVerified:paticularAcc.isVerified.value,
                plan:paticularAcc.isVerified?.level || 'Free',
                bannerUrl:paticularAcc.banner.url,
                avatarUrl:paticularAcc.avatar.url
            },
            IsFollowing: isfollowing ? true : false
        }
    
    }

    const accountFollowingId = (await follows.find({ $and:[{ followerId:activeAcc._id },{ isDeleted:false }]})).map( obj => obj.followingId );
    const accountToSend = await Promise.all(accountFollowingId.map((accid) => {
        return returnAccountDataInStructure(accid)
     }))

    // sorting the following accounts in decreasing order of subscription level...
    const planOrder: Record<string, number> = { Free: 0, Pro: 1, Creator: 2, Premium: 3 };

    const sortedAccounts = accountToSend.sort((a, b) => {
        const aPlan = (a.account?.plan || 'Free') as string;
        const bPlan = (b.account?.plan || 'Free') as string;
        const aLevel = planOrder[aPlan] ?? 0;
        const bLevel = planOrder[bPlan] ?? 0;

        if (aLevel !== bLevel) return bLevel - aLevel; // higher subscription first...

        // tie-breaker : verified accounts first...
        const aVerified = a.account?.isVerified ?? false;
        const bVerified = b.account?.isVerified ?? false;
        if (aVerified !== bVerified) return aVerified ? -1 : 1;

        return 0;
    });

    // applying pagination...
    const startIndex = (page - 1) * size;
    const paginatedFollowings = sortedAccounts.slice(startIndex, startIndex + size);

    return NextResponse.json({ message: 'Following accounts fetched successfully', followings: paginatedFollowings }, { status: 200 });
}

export const getAccountFollowersService = async (handle:string,page:number,size:number) => {
    await connectWithMongoDB() ; // connecting to database...

    const user = await getDecodedDataFromCookie("accessToken");
    if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST...' });

    const normalizedHandle = handle.startsWith('@') ? handle.substring(1) : handle;

    // The authenticated viewer's account (used only for the IsFollowing state)...
    const viewerAcc = await accounts.findOne({ userId:user.id , 'account.Active':true , 'account.status':{ $in:['ACTIVE','DEACTIVATED'] } });
    if (!viewerAcc) return NextResponse.json({ message: 'Current account not found' }, { status: 404 });

    // The account whose followers are being viewed (may be any account, not just your own)...
    const activeAcc = await accounts.findOne({ username:normalizedHandle , 'account.status':{ $in:['ACTIVE','DEACTIVATED'] } });
    if (!activeAcc) return NextResponse.json({ message: 'Account not found' }, { status: 404 });

    async function returnAccountDataInStructure(accountId:string) : Promise<userCardProp> {
        const paticularAcc = await accounts.findById(accountId) ;
        // getting count of followers and followings...
        const followers = await follows.find({ followingId : paticularAcc._id , isDeleted:false })
        const following = await follows.find({ followerId : paticularAcc._id , isDeleted:false })
        const posts = await Post.find({ authorId:paticularAcc._id , isDeleted:false }) ;
        const isfollowing = await follows.exists({$and:[{ followerId:viewerAcc._id },{ followingId:paticularAcc._id },{ isDeleted:false }]}) ;
    
        return {
            id: paticularAcc._id.toString(),
            decodedHandle:`@${paticularAcc.username}`,
            name:paticularAcc.name,
            content:paticularAcc.bio,
            account:{
                name:paticularAcc.name ,
                handle:`@${paticularAcc.username}` ,
                bio:paticularAcc.bio ,
                location:{
                  text:paticularAcc.location.text,
                  coordinates:paticularAcc.location.coordinates // lat,long
                },
                website:paticularAcc.website,
                joinDate:new Date(paticularAcc.createdAt).toDateString(),
                following:fmt(following.length),
                followers:fmt(followers.length),
                Posts:fmt(posts.length),
                isCompleted:paticularAcc.account.completed,
                isVerified:paticularAcc.isVerified.value,
                plan:paticularAcc.isVerified?.level || 'Free',
                bannerUrl:paticularAcc.banner.url,
                avatarUrl:paticularAcc.avatar.url
            },
            IsFollowing: isfollowing ? true : false
        }
    
    }

    // getting the followers of activeAcc (accounts that follow the active account)...
    const followerAccountsId = (await follows.find({ $and:[{ followingId:activeAcc._id },{ isDeleted:false }]})).map( obj => obj.followerId );

    // structuring all the follower accounts into userCardProp...
    const followerAccounts = await Promise.all(followerAccountsId.map((accid) => {
        return returnAccountDataInStructure(accid)
    }));

    // sorting the follower accounts in decreasing order of subscription level...
    const planOrder: Record<string, number> = { Free: 0, Pro: 1, Creator: 2, Premium: 3 };

    const sortedAccounts = followerAccounts.sort((a, b) => {
        const aPlan = (a.account?.plan || 'Free') as string;
        const bPlan = (b.account?.plan || 'Free') as string;
        const aLevel = planOrder[aPlan] ?? 0;
        const bLevel = planOrder[bPlan] ?? 0;

        if (aLevel !== bLevel) return bLevel - aLevel; // higher subscription first...

        // tie-breaker : verified accounts first...
        const aVerified = a.account?.isVerified ?? false;
        const bVerified = b.account?.isVerified ?? false;
        if (aVerified !== bVerified) return aVerified ? -1 : 1;

        return 0;
    });

// applying pagination...
    const startIndex = (page - 1) * size;
    const paginatedFollowers = sortedAccounts.slice(startIndex, startIndex + size);

    // determining whether more followers are available for the next page...
    const hasMore = startIndex + size < sortedAccounts.length;

    return NextResponse.json({ message: 'Followers fetched successfully', followers: paginatedFollowers , hasMore }, { status: 200 });
}

async function getRandomAccountSuggestions(viewerAcc:any) : Promise<userCardProp[]> {
    // 1. Fetch blocked account IDs (accounts the viewer has blocked or has been blocked by)...
    const blockedDocs = await Block.find({ $or:[{ blockedByAcc:viewerAcc._id },{ blockedAcc:viewerAcc._id }] , isActive:true });
    const blockedIds = blockedDocs.map(doc => doc.blockedByAcc.equals(viewerAcc._id) ? doc.blockedAcc.toString() : doc.blockedByAcc.toString());

    // 2. Suggestion pool : all ACTIVE accounts except the viewer and blocked ones...
    const suggestionPool = await accounts.find({
        $and:[
            { _id: { $ne: viewerAcc._id } },
            { _id: { $nin: blockedIds } },
            { 'account.status':'ACTIVE' }
        ]
    });

    // 3. Structure each account into the userCardProp shape...
    async function returnAccountDataInStructure(accountId:string) : Promise<userCardProp> {
        const paticularAcc = await accounts.findById(accountId) ;
        // getting count of followers and followings...
        const followers = await follows.find({ followingId : paticularAcc._id , isDeleted:false })
        const following = await follows.find({ followerId : paticularAcc._id , isDeleted:false })
        const posts = await Post.find({ authorId:paticularAcc._id , isDeleted:false }) ;
        const isfollowing = await follows.exists({$and:[{ followerId:viewerAcc._id },{ followingId:paticularAcc._id },{ isDeleted:false }]}) ;
    
        return {
            id: paticularAcc._id.toString(),
            decodedHandle:`@${paticularAcc.username}`,
            name:paticularAcc.name,
            content:paticularAcc.bio,
            account:{
                name:paticularAcc.name ,
                handle:`@${paticularAcc.username}` ,
                bio:paticularAcc.bio ,
                location:{
                  text:paticularAcc.location.text,
                  coordinates:paticularAcc.location.coordinates // lat,long
                },
                website:paticularAcc.website,
                joinDate:new Date(paticularAcc.createdAt).toDateString(),
                following:fmt(following.length),
                followers:fmt(followers.length),
                Posts:fmt(posts.length),
                isCompleted:paticularAcc.account.completed,
                isVerified:paticularAcc.isVerified.value,
                plan:paticularAcc.isVerified?.level || 'Free',
                bannerUrl:paticularAcc.banner.url,
                avatarUrl:paticularAcc.avatar.url
            },
            IsFollowing: isfollowing ? true : false
        }
    
    }

    // Structure the pool and drop accounts the viewer already follows...
    const structuredPool = (await Promise.all(
        suggestionPool.map((acc) => returnAccountDataInStructure(acc._id))
    )).filter(acc => !acc.IsFollowing);

    // Fisher-Yates shuffle for a truly random order...
    for (let i = structuredPool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [structuredPool[i], structuredPool[j]] = [structuredPool[j], structuredPool[i]];
    }

    // Return the top 4 random accounts as suggestions...
    return structuredPool.slice(0, 4);
}

export const getFollowerSuggestionsService = async (handle:string) => {
    await connectWithMongoDB() ; // connecting to database...

    const user = await getDecodedDataFromCookie("accessToken");
    if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST...' });

    // The authenticated viewer's account (self is excluded from suggestions)...
    const viewerAcc = await accounts.findOne({ userId:user.id , 'account.Active':true , 'account.status':{ $in:['ACTIVE','DEACTIVATED'] } });
    if (!viewerAcc) return NextResponse.json({ message: 'Current account not found' }, { status: 404 });

    // Random, non-self, non-blocked & not-yet-followed suggestions for the initial phase...
    const top4Suggestions = await getRandomAccountSuggestions(viewerAcc);

    return NextResponse.json({ message: 'Follower suggestions fetched successfully', suggestions: top4Suggestions }, { status: 200 });
}

export const getFollowingsSuggestionsService = async (handle:string) => {
    await connectWithMongoDB() ; // connecting to database...

    const user = await getDecodedDataFromCookie("accessToken");
    if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST...' });

    // The authenticated viewer's account (self is excluded from suggestions)...
    const viewerAcc = await accounts.findOne({ userId:user.id , 'account.Active':true , 'account.status':{ $in:['ACTIVE','DEACTIVATED'] } });
    if (!viewerAcc) return NextResponse.json({ message: 'Current account not found' }, { status: 404 });

    // Random, non-self, non-blocked & not-yet-followed suggestions for the initial phase...
    const top4Suggestions = await getRandomAccountSuggestions(viewerAcc);

    return NextResponse.json({ message: 'Followings suggestions fetched successfully', suggestions: top4Suggestions }, { status: 200 });
}

export const getFollowingsForAccountService = async (handle:string) => {
    await connectWithMongoDB() ; // connecting to database...

    const user = await getDecodedDataFromCookie("accessToken");
    if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST...' });

    const normalizedHandle = handle.startsWith('@') ? handle.substring(1) : handle;

    const activeAcc = await accounts.findOne({ username:normalizedHandle , userId:user.id , 'account.Active':true , 'account.status':{ $in:['ACTIVE','DEACTIVATED'] } });
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
            decodedHandle:`@${paticularAcc.username}`,
            name:paticularAcc.name,
            content:paticularAcc.bio,
            account:{
                name:paticularAcc.name ,
                handle:`@${paticularAcc.username}` ,
                bio:paticularAcc.bio ,
                location:{
                  text:paticularAcc.location.text,
                  coordinates:paticularAcc.location.coordinates // lat,long
                },
                website:paticularAcc.website,
                joinDate:new Date(paticularAcc.createdAt).toDateString(),
                following:fmt(following.length),
                followers:fmt(followers.length),
                Posts:fmt(posts.length),
                isCompleted:paticularAcc.account.completed,
                isVerified:paticularAcc.isVerified.value,
                plan:paticularAcc.isVerified?.level || 'Free',
                bannerUrl:paticularAcc.banner.url,
                avatarUrl:paticularAcc.avatar.url
            },
            IsFollowing: isfollowing ? true : false
        }
    
    }

    // getting ALL the followings of activeAcc (accounts activeAcc follows) - NO pagination...
    const followingAccountsId = (await follows.find({ $and:[{ followerId:activeAcc._id },{ isDeleted:false }]})).map( obj => obj.followingId );

    // structuring all the following accounts into userCardProp...
    const followingAccounts = await Promise.all(followingAccountsId.map((accid) => {
        return returnAccountDataInStructure(accid)
    }));

    // sorting the following accounts in decreasing order of subscription level...
    const planOrder: Record<string, number> = { Free: 0, Pro: 1, Creator: 2, Premium: 3 };

    const sortedAccounts = followingAccounts.sort((a, b) => {
        const aPlan = (a.account?.plan || 'Free') as string;
        const bPlan = (b.account?.plan || 'Free') as string;
        const aLevel = planOrder[aPlan] ?? 0;
        const bLevel = planOrder[bPlan] ?? 0;

        if (aLevel !== bLevel) return bLevel - aLevel; // higher subscription first...

        // tie-breaker : verified accounts first...
        const aVerified = a.account?.isVerified ?? false;
        const bVerified = b.account?.isVerified ?? false;
        if (aVerified !== bVerified) return aVerified ? -1 : 1;

        return 0;
    });

    // returning ALL the followings at once (no pagination)...
    return NextResponse.json({ message: 'Followings fetched successfully' , followings: sortedAccounts }, { status: 200 });
}

export const getAccountFollowingsService = async (handle:string,page:number,size:number) => {
    await connectWithMongoDB() ; // connecting to database...

    const user = await getDecodedDataFromCookie("accessToken");
    if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST...' });

    const normalizedHandle = handle.startsWith('@') ? handle.substring(1) : handle;

    const activeAcc = await accounts.findOne({ username:normalizedHandle , userId:user.id , 'account.Active':true , 'account.status':{ $in:['ACTIVE','DEACTIVATED'] } });
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
            decodedHandle:`@${paticularAcc.username}`,
            name:paticularAcc.name,
            content:paticularAcc.bio,
            account:{
                name:paticularAcc.name ,
                handle:`@${paticularAcc.username}` ,
                bio:paticularAcc.bio ,
                location:{
                  text:paticularAcc.location.text,
                  coordinates:paticularAcc.location.coordinates // lat,long
                },
                website:paticularAcc.website,
                joinDate:new Date(paticularAcc.createdAt).toDateString(),
                following:fmt(following.length),
                followers:fmt(followers.length),
                Posts:fmt(posts.length),
                isCompleted:paticularAcc.account.completed,
                isVerified:paticularAcc.isVerified.value,
                plan:paticularAcc.isVerified?.level || 'Free',
                bannerUrl:paticularAcc.banner.url,
                avatarUrl:paticularAcc.avatar.url
            },
            IsFollowing: isfollowing ? true : false
        }
    
    }

    // getting the followings of activeAcc (accounts activeAcc follows)...
    const followingAccountsId = (await follows.find({ $and:[{ followerId:activeAcc._id },{ isDeleted:false }]})).map( obj => obj.followingId );

    // structuring all the following accounts into userCardProp...
    const followingAccounts = await Promise.all(followingAccountsId.map((accid) => {
        return returnAccountDataInStructure(accid)
    }));

    // sorting the following accounts in decreasing order of subscription level...
    const planOrder: Record<string, number> = { Free: 0, Pro: 1, Creator: 2, Premium: 3 };

    const sortedAccounts = followingAccounts.sort((a, b) => {
        const aPlan = (a.account?.plan || 'Free') as string;
        const bPlan = (b.account?.plan || 'Free') as string;
        const aLevel = planOrder[aPlan] ?? 0;
        const bLevel = planOrder[bPlan] ?? 0;

        if (aLevel !== bLevel) return bLevel - aLevel; // higher subscription first...

        // tie-breaker : verified accounts first...
        const aVerified = a.account?.isVerified ?? false;
        const bVerified = b.account?.isVerified ?? false;
        if (aVerified !== bVerified) return aVerified ? -1 : 1;

        return 0;
    });

// applying pagination...
    const startIndex = (page - 1) * size;
    const paginatedFollowings = sortedAccounts.slice(startIndex, startIndex + size);

    // determining whether more followings are available for the next page...
    const hasMore = startIndex + size < sortedAccounts.length;

    return NextResponse.json({ message: 'Followings fetched successfully', followings: paginatedFollowings , hasMore }, { status: 200 });
}
