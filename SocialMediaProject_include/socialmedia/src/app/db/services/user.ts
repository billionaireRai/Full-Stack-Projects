import users from "@/app/db/models/users";
import accounts from "@/app/db/models/accounts";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { functionToTriggerSchedule } from "@/app/cronjob/accDeletionSchedule";
import { connectWithMongoDB } from "@/app/db/dbConnection";
import { loginDataType, registrationDataType } from "@/app/controllers/auth";
import { getDecodedDataFromCookie } from "@/lib/cookiehandler";
import cloudinary from "@/lib/cloudinary";
import follows from "../models/follows";
import Post from "../models/posts";
import subscriptions from "../models/subscriptions";
import mongoose from "mongoose";
import Block from "../models/blocked";
import likes from "../models/likes";
import Views from "../models/views";
import tagged from "../models/tagged";
import axios from "axios";

type Plan = "Free" | "Pro" | "Creator" | "Enterprise";

type profileEditMediaType = 'avatarUrl' | 'bannerUrl' ;

interface resType {
    email:string,
    userId:string,
    accessToken:string,
    refreshToken:string,
    accountInfo:userCardProp
}

export interface accountType {
  name:string ,
  handle:string ,
  bio:string ,
  location:{
    text:string,
    coordinates:number[] // lat,long
  },
  website:string,
  joinDate:string,
  following:string,
  followers:string,
  Posts:string,
  isCompleted:boolean,
  isVerified:boolean,
  bannerUrl:string,
  avatarUrl:string
}

export interface userCardProp {
  id?:string;
  decodedHandle?:string | null ;
  name?:string | null;
  content?:string | null ;
  heading?:React.ReactElement;
  account?: accountType;
  IsFollowing?:boolean;
}

// function for formating the number...
const fmt = (n: number): string => {
    if (n >= 1e9) return (n / 1e9).toFixed(2) + "B";  // 1e9 = 1 * math.pow(10,9) where e = 10 ;
    if (n >= 1e6) return (n / 1e6).toFixed(2) + "M";
    if (n >= 1e3) return (n / 1e3).toFixed(2) + "K";
    return String(n); // number is in hundreds...
};


// DB service related to user registration...
export async function userRegistrationService(credentials:registrationDataType) : Promise<any> {
    const { Name , Username , Email , Password , lat , long , text } = credentials ; // destructuring the data from credential...

    await connectWithMongoDB() // establishing connection with database...
    let userExists = await users.find({ email:Email }) ; // as email is unique...
    let accountExists = await accounts.find({ username:Username }); // username is unique for an account...
    if (userExists.length > 0 || accountExists.length > 0) {
        console.log('Either User/Account already exists with these credentials...');
        return NextResponse.json({messsage:'Duplicate credentials submitted either for User or Account !!'},{ status:404 });
    }

    const newUser = new users({ email:Email , password:Password }); // making new user...
    // Set location if lat and long are provided...
    
    const accessToken = newUser.generateAccessToken();
    const refreshToken = newUser.generateRefreshToken();
    
    newUser.refreshToken = { value: refreshToken.token , rfExpiry: refreshToken.expiry }
    await newUser.save() ; // saving the doc...
    
    // first account creation for this user...
    const firstAccount = new accounts({ userId:newUser._id , name:Name , username:Username.toLowerCase() , 'avatar.url':'/images/default-profile-pic.png', 'banner.url':'/images/default-banner.jpg'}) ; 
    if (lat && long) { 
        const latitude = parseFloat(lat);
        const longitude = parseFloat(long);
        firstAccount.location = {
                text: decodeURIComponent(text) ,
                coordinates: [latitude,longitude] // GeoJSON: [latitude,longitude]...
            };
    }
    await firstAccount.save(); // saving account doc to DB...
    let accountData : userCardProp = {
        decodedHandle:firstAccount.username,
        name:firstAccount.name,
        account:{
            name:firstAccount.name,
            handle:firstAccount.username,
            bio:'' ,
            location:firstAccount.location,
            website:'',
            joinDate:String(firstAccount.createdAt),
            following:'0',
            followers:'0',
            Posts:'0',
            isCompleted:false,
            isVerified:false,
            bannerUrl:firstAccount.banner.url,
            avatarUrl:firstAccount.avatar.url
        }
    }
    const info:resType = {
        email:Email,
        userId:String(newUser._id),
        accessToken:accessToken,
        refreshToken:refreshToken.token,
        accountInfo:accountData
    } 

    return info ;
    
}

// service for user loggin (No tokens already exists)...
export async function logginUserService(data:loginDataType) : Promise<any> {
    const { email , password } = data ; // getting data destructured...

    await connectWithMongoDB(); // establishing connection to DB...
    const userdoc = await users.findOne({ email:email }).select('+password'); // geting the user by email...
    if (!userdoc) return NextResponse.json({ message: 'Invalid email entered...' }, { status: 401 });

    const isValid = await bcrypt.compare(password,userdoc.password);
    if (!isValid) {
         console.log(`Password coming for email ${email} is INVALID !!`);
         return NextResponse.json({ message: 'Invalid password entered...' }, { status: 401 });
    }    

    // Procceding with login logic... 
    const accessToken = userdoc.generateAccessToken();
    const refreshToken = userdoc.generateRefreshToken();

    userdoc.refreshToken = { value: refreshToken.token, rfExpiry: refreshToken.expiry };
    await userdoc.save();

    // Fetch account data for client global state...
    const account = await accounts.findOne({ $and:[{ userId: userdoc._id }, { 'account.Active': true },{ 'account.status':'ACTIVE' }] });
    if (!account) {
        console.log(`Account with userId ${userdoc._id} not found !!`);
        return NextResponse.json({ message: 'Account not found' }, { status: 404 });
    }
     
    const posts = await Post.find({ authorId : userdoc._id , isDeleted:false }); // taking out all the posts...
    // getting count of followers and followings... 
    const followers = await follows.find({ followingId : account._id , isDeleted:false })
    const following = await follows.find({ followerId : account._id , isDeleted:false })
    let accountData : userCardProp = {
        decodedHandle:account.username,
        name:account.name,
        account:{
            name:account.name,
            handle:account.username,
            bio:account.bio || ' ',
            location:account.location ,
            website:account.website || ' ',
            joinDate:String(account.createdAt),
            following:fmt(following.length),
            followers:fmt(followers.length),
            Posts:fmt(posts.length),
            isCompleted:account.account?.complete || false ,
            isVerified:account.isVerified?.value || false,
            bannerUrl: account.banner.url,
            avatarUrl: account.avatar.url
        }
    }
    const info:resType = {
        email:email,
        userId:String(userdoc._id),
        accessToken:accessToken,
        refreshToken:refreshToken.token,
        accountInfo:accountData
    }

    return info;
}

export async function creatingUserAfterOauth(email: string, name: string,pic:string,provider:string) {
    await connectWithMongoDB();
    // Check if user already exists
    let existingUser = await users.findOne({ email });
    if (existingUser) {
        // User exists, generate tokens
        const accessToken = existingUser.generateAccessToken();
        const refreshToken = existingUser.generateRefreshToken();

        existingUser.refreshToken = { value: refreshToken.token, rfExpiry: refreshToken.expiry };
        await existingUser.save();

        // Fetch account data
        const account = await accounts.findOne({ $and:[{ userId: existingUser._id }, { 'account.Active': true },{ 'account.status':'ACTIVE' }] });
        if (!account) return NextResponse.json({ message: 'Account not found' }, { status: 404 }) ;

        const posts = await Post.find({ authorId : existingUser._id , isDeleted:false });
        const followers = await follows.find({ followingId : account._id , isDeleted:false });
        const following = await follows.find({ followerId : account._id , isDeleted:false });

        let accountData: userCardProp = {
            decodedHandle: account.username,
            name: account.name,
            account: {
                name: account.name,
                handle: account.username,
                bio: account.bio,
                location: account.location,
                website: account.website,
                joinDate: String(account.createdAt),
                following: fmt(following.length),
                followers: fmt(followers.length),
                Posts: fmt(posts.length),
                isCompleted: account.completed,
                isVerified: account.isVerified.value,
                bannerUrl: account.banner.url,
                avatarUrl: account.avatar.url
            }
        };

        const info: resType = {
            email,
            userId: String(existingUser._id),
            accessToken,
            refreshToken: refreshToken.token,
            accountInfo: accountData
        };

        return info;
    }

    // Generate a new user credentials...
    let baseUsername = name.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 15);
    let username = baseUsername;
    let counter = 1;
    while (await accounts.findOne({ username })) {
        username = `${baseUsername}${counter}`;
        counter++;
    }

    // Create new user with dummy password for OAuth...
    const dummyPassword = 'oauth_dummy_password_' + Math.random().toString(36);
    const newUser = new users({
        email,
        password: dummyPassword,
        o_auth: { authProvider: provider, isUsed: true }
    });

    const accessToken = newUser.generateAccessToken();
    const refreshToken = newUser.generateRefreshToken();

    newUser.refreshToken = { value: refreshToken.token, rfExpiry: refreshToken.expiry };
    await newUser.save();

    // Create account
    const newAccount = new accounts({ userId: newUser._id, name, username, 'avatar.url':pic ? pic :'/images/default-profile-pic.png', 'banner.url':'/images/default-banner.jpg'});
    await newAccount.save();


    let accountData: userCardProp = {
        decodedHandle: newAccount.username,
        name: newAccount.name,
        account: {
            name: newAccount.name,
            handle: newAccount.username,
            bio: newAccount.bio || '',
            location: newAccount.location ,
            website: newAccount.website || '',
            joinDate: String(newAccount.createdAt),
            following: '0',
            followers: '0',
            Posts:'0',
            isCompleted: newAccount.account?.completed || false,
            isVerified: newAccount.isVerified?.value || false,
            bannerUrl: newAccount.banner.url,
            avatarUrl: newAccount.avatar.url
        }
    };

    const info: resType = {
        email,
        userId: String(newUser._id),
        accessToken,
        refreshToken: refreshToken.token,
        accountInfo: accountData
    };

    return info;
}

export async function accountFetchingService(handle:string) {
    await connectWithMongoDB() ; // establishing the connection with DB...

    const user = await getDecodedDataFromCookie("accessToken");
    // Return the error response...
    if (user instanceof Error) return NextResponse.json({ message:user.message },{ status:401, statusText: 'UNAUTHORIZED REQUEST...' });

    // Get viewer's account
    const myAccount = await accounts.findOne({ userId:user.id, 'account.Active': true, 'account.status':'ACTIVE' });
    if (!myAccount) return NextResponse.json({ message: 'Viewer account not found' }, { status: 404 });

    // getting account details...
    const account = await accounts.findOne({ username:handle, 'account.Active': true ,'account.status':'ACTIVE'})  ;
    if (!account) {
        console.log('account unavailable , check account handle !!');
        return NextResponse.json({message:'account unavailable...'},{status:400});
    }

    // Check if viewer has blocked this account
    const isBlocked = await Block.exists({ blockedByAcc: myAccount._id, blockedAcc: account._id, isActive: true });

    const posts = await Post.find({ authorId:account._id , isDeleted:false}) ;
    // getting count of followers and followings...
    const followers = await follows.find({ followingId : account._id , isDeleted:false })
    const following = await follows.find({ followerId : account._id , isDeleted:false })

    const formatedOne : userCardProp = {
        decodedHandle:account.username,
        name:account.name,
        content:account.bio,
        account: {
            name:account.name ,
            handle:account.username ,
            bio:account.bio ,
            location:{
              text:account.location.text,
              coordinates:account.location.coordinates // lat,long
            },
            website:account.website,
            joinDate:String(account.createdAt),
            following:fmt(following.length),
            followers:fmt(followers.length),
            Posts:fmt(posts.length),
            isCompleted:account.account?.completed || false,
            isVerified:account.isVerified?.value || false,
            bannerUrl:account.banner.url,
            avatarUrl:account.avatar.url
        }
    }

    return { formatedOne:formatedOne , isBlocked:isBlocked ? true : false };

}

export const profileSpecificDataService = async (handle:string) => {
    await connectWithMongoDB() ; // connection to DB...

    const user = await getDecodedDataFromCookie("accessToken");
    if (user instanceof Error) return NextResponse.json({ message:user.message },{ status:401, statusText: 'UNAUTHORIZED REQUEST...' });

    const myAccount = await accounts.findOne({ username:handle , 'account.status':'ACTIVE' , 'account.Active':true }) ; // getting my account...

    // Fetch blocked account IDs
    const blockedDocs = await Block.find({ blockedByAcc: myAccount._id, isActive: true });
    const blockedIds = blockedDocs.map(doc => doc.blockedAcc.toString());
    // generating the follow suggestions...
    const followingDocs: InstanceType<typeof follows>[] = await follows.find({ followerId : myAccount._id , isDeleted:false});
    const followingAccountId : string[] = followingDocs.map((followObj) => followObj.followingId ) ;
    
    // getting the mutual followers...
    const mutualFollowingId = followingAccountId.map(async (accountId : string) => {
        const thereFollowings : InstanceType<typeof follows>[] = await follows.find({ followerId:accountId , isDeleted:false }) ;
        return thereFollowings.map((followobj) => followobj.followingId.toString()) ;
    }) ;

    async function returnAccountDataInStructure(accountId:string) : Promise<userCardProp> {
        const paticularAcc = await accounts.findById(accountId) ;
        // getting count of followers and followings...
        const followers = await follows.find({ followingId : paticularAcc._id , isDeleted:false })
        const following = await follows.find({ followerId : paticularAcc._id , isDeleted:false })
        const posts = await Post.find({ authorId:paticularAcc._id , isDeleted:false }) ;
        const isfollowing = await follows.exists({$and:[{ followerId:myAccount._id },{ followingId:paticularAcc._id },{ isDeleted:false }]}) ;

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

    // Resolve and flatten mutual following IDs...
    const resolvedMutualFollowing = await Promise.all(mutualFollowingId);
    const flattenedMutualIds = resolvedMutualFollowing.flat();

    // getting the accounts of mutual followers...
    const mutualFriendAccounts = await Promise.all(flattenedMutualIds.map(async (accId: string) => {
            return returnAccountDataInStructure(accId);
        })
    );
    const filteredMutualFriendAccounts = mutualFriendAccounts.filter(acc => acc.id && !blockedIds.includes(acc.id));

    // getting more accounts for suggestions...
    const ageRange = ['0-13','13-17', '18-24', '25-34', '35-44', '45-54', '55-64', '65+'] ;
    const genderArray = ['male', 'female', 'none'] ;
    const indexOfAgeRange = ageRange.findIndex(myAccount.interests.ageRange); // getting the index in ageRange...
    const indexOfGender = genderArray.findIndex(myAccount.interests.gender); // same for gender...
    const filteredTopics = myAccount.interests.topicsLoved ; // engagement topics array...

    // opposite gender filter for increasing engagement...
    const moreAccounts = await accounts.find({
        $and:[
            {'interests.gender' : genderArray[indexOfGender] === 'none' ? ' ' : !(genderArray[indexOfGender])},
            { 'interests.ageRange' : (ageRange.length - indexOfAgeRange)  >= 2  ? (ageRange[indexOfAgeRange] || ageRange[indexOfAgeRange + 1] || ageRange[indexOfAgeRange + 2])  : (ageRange[ageRange.length - 1] || ageRange[ageRange.length - 2]) },
            {'interests.topicsLoved' : { $in: filteredTopics } },
            { _id: { $nin: blockedIds } },
        ]
    }) ;

    // getting account whose content , user like & comment...
    const myLikes  = await likes.find({ $and:[ { accountId:myAccount._id },{ targetType:{ $in: ['Post','Comment'] } }]}) ;
    const likedToAcc = await Promise.all(myLikes.map( async ( like ) => {
        return returnAccountDataInStructure((like.targetAccount as mongoose.Types.ObjectId).toString());
    }));
    const filteredLikedToAcc = likedToAcc.filter(acc => acc.id && !blockedIds.includes(acc.id));

    const postsContentUserCommented = await Post.find({ $and:[{ authorId:myAccount._id },{ replyToPostId: { $exists: true, $ne: null } },{ isDeleted:false }]}) ;
    const accountsWhosPost = await Promise.all(postsContentUserCommented.map( async (post) => {
        const commentedOnPost = await Post.findById(post.replyToPostId) ;
        return returnAccountDataInStructure(commentedOnPost.authorId) ;
    })) ;
    const filteredAccountsWhosPost = accountsWhosPost.filter(acc => acc.id && !blockedIds.includes(acc.id));

    // removing the duplicacy from account array...
    const uniqueAccArr = [...new Set([...filteredMutualFriendAccounts,...moreAccounts,...filteredLikedToAcc,...filteredAccountsWhosPost])];
    // sorting the array based on subscription level...
    const planOrder: Record<Plan, number> = { Free: 0, Pro: 1, Creator: 2, Enterprise: 3 };

    const accountsWithSubs = await Promise.all(uniqueAccArr.map(async (acc) => {
        const account = await accounts.findOne({ username: acc.decodedHandle , 'account.status':'ACTIVE' });
        const sub = account ? await subscriptions.findOne({ accountId: account._id, status: 'active' }) : null;
        return { acc , plan: (sub?.plan as Plan) || 'free', isVerified: acc.account?.isVerified || false };
    }));

    // sorting logic...
    accountsWithSubs.sort((a, b) => {
        const aLevel = planOrder[a.plan]; // plan hierarchy based on number...
        const bLevel = planOrder[b.plan];
        if (aLevel !== bLevel) return bLevel - aLevel; // higher subscription first...
        if (a.isVerified !== b.isVerified) return a.isVerified ? -1 : 1; // verified first...
        
        return 0;
    });

    // final sorted array...
    const sortedArr = accountsWithSubs.map(item => item.acc);

    // getting all the posts...
    const accountPosts = await Post.find({ $and:[{ authorId:myAccount._id },{ replyToPostId: null },{ postType:'original' },{ isDeleted:false }]}) ; // getting the posts...
    const structuredPost = Promise.all(accountPosts.map( async (post) => {
        const commentsOnPost = await Post.find({ $and:[{ replyToPostId:post._id },{ postType:'comment' },{ isDeleted:false }] });
        const repostsOnPost = await Post.find({ $and:[{ postType:'repost' },{ replyToPostId:post._id },{ isDeleted:false }] });
        const likesOnPost = await likes.find({ $and:[{ targetType:'post' },{ targetEntity:post._id }]});
        const viewsOnPost = await Views.find({ postId:post._id }) ; // a single condition required...

        // Calculate user interactions...
        const userLiked = await likes.exists({ $and: [{ accountId: myAccount._id }, { targetType: 'post' }, { targetEntity: post._id }] });
        const userReposted = await Post.exists({ $and: [{ authorId: myAccount._id }, { postType: 'repost' }, { replyToPostId: post._id }, { isDeleted: false }] });
        const userCommented = await Post.exists({ $and: [{ authorId: myAccount._id }, { postType: 'comment' }, { replyToPostId: post._id }, { isDeleted: false }] });
        const userBookmarked = await tagged.exists({ $and: [{ accountId: myAccount._id }, { postId: post._id },{ taggedAs:'bookmarked' }] });

        return {
            id:post._id,
            content:post.content,
            postedAt:new Date(post.createdAt).toDateString(),
            comments:fmt(commentsOnPost.length),
            reposts:fmt(repostsOnPost.length),
            likes:fmt(likesOnPost.length),
            views:fmt(viewsOnPost.length),
            mediaUrls: Array(post.mediaUrls).map(urlObj => urlObj.url ),
            hashTags: post.hashags,
            mentions: post.mentions,
            userliked: userLiked ? true : false,
            usereposted: userReposted ? true : false,
            usercommented: userCommented ? true : false,
            userbookmarked: userBookmarked ? true : false
        }
    }));

    // getting the replied posts...
    const repliedPosts = await Post.find({ $and:[{ authorId:myAccount._id },{ replyToPostId: { $exists: true, $ne: null } },{ postType:'comment' },{ isDeleted:false }]});

    const structuredRepliedPost = await Promise.all(repliedPosts.map( async (repliedpost) => { 
        const authorPost = await Post.findById(repliedpost.replyToPostId) ; // getting the inner post...
        const accountInfo = await accounts.findById(authorPost.authorId) ;
        const followersOfAuthor = await follows.find({ followingId : accountInfo._id , isDeleted:false })
        const followingOfAuthor = await follows.find({ followerId : accountInfo._id , isDeleted:false })

        const commentsPost = await Post.find({ $and:[{ replyToPostId:repliedpost._id },{ postType:'comment' },{ isDeleted:false }] });
        const repostsPost = await Post.find({ $and:[{ postType:'repost' },{ replyToPostId:repliedpost._id },{ isDeleted:false }] });
        const likesPost = await likes.find({ $and:[{ targetType:'post' },{ targetEntity:repliedpost._id }]});
        const viewsPost = await Views.find({ postId:repliedpost._id }) ; // a single condition required...
        // Calculate user interactions for repliedpost
        const userLiked = await likes.exists({ $and: [{ accountId: myAccount._id }, { targetType: 'post' }, { targetEntity: repliedpost._id }] });
        const userReposted = await Post.exists({ $and: [{ authorId: myAccount._id }, { postType: 'repost' }, { replyToPostId: repliedpost._id }, { isDeleted: false }] });
        const userCommented = await Post.exists({ $and: [{ authorId: myAccount._id }, { postType: 'comment' }, { replyToPostId: repliedpost._id }, { isDeleted: false }] });
        const userBookmarked = await tagged.exists({ $and: [{ accountId: myAccount._id }, { postId: repliedpost._id },{ taggedAs:'bookmarked' }] });
        
        return {
            id:repliedpost._id,
            postId:repliedpost.replyToPostId,
            postAuthorInfo : {
                name :accountInfo.name,
                username:accountInfo.username,
                followers:fmt(followersOfAuthor.length),
                following:fmt(followingOfAuthor.length),
                isVerified:accountInfo.isVerified.value,
                avatar:accountInfo.avatar.url,
                banner:accountInfo.banner.url,
                mediaUrls:Array(authorPost.mediaUrls).map(urlObj => urlObj.url ),
                mentions:authorPost.mentions,
                hashTags:authorPost.hashTags,
                content:authorPost.content,
                postedAt:new Date(authorPost.createdAt).toDateString()
            },
            commentedText:repliedpost.content,
            mediaUrls:Array(repliedpost.mediaUrls).map(urlObj => urlObj.url ),
            mentions:repliedpost.mentions,
            hashTags:repliedpost.hashtags,
            repliedAt:new Date(repliedpost.createdAt).toDateString(),
            comments:fmt(commentsPost.length),
            reposts:fmt(repostsPost.length),
            likes:fmt(likesPost.length),
            views:fmt(viewsPost.length),
            userliked: userLiked ? true : false,
            usereposted: userReposted ? true : false,
            usercommented: userCommented ? true : false,
            userbookmarked: userBookmarked ? true : false
        }
     }));

     // getting media related data...
     const userPosts = await Post.find({ $and:[{ authorId:myAccount._id },{ isDeleted:false }]}); // getting users posts...
     const usermedia = await Promise.all(userPosts.map((post) => {
        let allImages: string[] = [] ;
        let allVideos: string[] = [] ;
        let allDocs: string[] = [] ;

        if (post.mediaUrls && Array.isArray(post.mediaUrls)) {
            post.mediaUrls.forEach((urlObj:{ url:string , public_id:string }) => {
                const lowerUrl = urlObj.url.toLowerCase(); // converting the url to lowercase...
                if (lowerUrl.endsWith('.jpg') || lowerUrl.endsWith('.jpeg') || lowerUrl.endsWith('.png') || lowerUrl.endsWith('.gif') || lowerUrl.endsWith('.webp')) {
                    allImages.push(urlObj.url);
                } else if (lowerUrl.endsWith('.mp4') || lowerUrl.endsWith('.avi') || lowerUrl.endsWith('.mov') || lowerUrl.endsWith('.wmv')){
                    allVideos.push(urlObj.url);
                } else {
                    allDocs.push(urlObj.url);
                }
            });
            return { images:allImages , videos:allVideos , docs:allDocs } ;
        } else {
            return { images:[] , videos:[] , docs:[] } ;
        }
     }));

     // getting the posts user liked... 
     const likedPosts = await Promise.all(myLikes.map( async (likeobj) => { 
        const commentsPost = await Post.find({ $and:[{ replyToPostId:likeobj.targetEntity },{ postType:'comment' },{ isDeleted:false }] });
        const repostsPost = await Post.find({ $and:[{ postType:'repost' },{ replyToPostId:likeobj.targetEntity },{ isDeleted:false }] });
        const likesPost = await likes.find({ $and:[{ targetType:'post' },{ targetEntity:likeobj.targetEntity }]});
        const viewsPost = await Views.find({ postId:likeobj.targetEntity }) ; // a single condition required...

        const post = await Post.findById(likeobj.targetEntity) ; // getting each post...

        // Calculate user interactions for the liked post
        const userLiked = await likes.exists({ $and: [{ accountId: myAccount._id }, { targetType: 'post' }, { targetEntity: post._id }] });
        const userReposted = await Post.exists({ $and: [{ authorId: myAccount._id }, { postType: 'repost' }, { replyToPostId: post._id }, { isDeleted: false }] });
        const userCommented = await Post.exists({ $and: [{ authorId: myAccount._id }, { postType: 'comment' }, { replyToPostId: post._id }, { isDeleted: false }] });
        const userBookmarked = await tagged.exists({ $and: [{ accountId: myAccount._id }, { postId: post._id },{ taggedAs:'bookmarked' }] });
        return {
            id:post._id,
            content:post.content,
            postedAt:new Date(post.createdAt).toDateString(),
            comments:fmt(commentsPost.length),
            reposts:fmt(repostsPost.length),
            likes:fmt(likesPost.length),
            views:fmt(viewsPost.length),
            mediaUrls: Array(post.mediaUrls).map(urlObj => urlObj.url ),
            hashTags: post.hashtags,
            mentions: post.mentions,
            userliked: userLiked ? true : false,
            usereposted: userReposted ? true : false,
            usercommented: userCommented ? true : false,
            userbookmarked: userBookmarked ? true : false
        }

      }));

      // calculating the highlighted post...
      const taggedPost = await tagged.find({ $and:[{ accountId:myAccount._id },{ taggedAs:'highlighted' }] });
      const highlightedOnes = await Promise.all(taggedPost.map( async (taggedobj) => { 
        const reqPost = await Post.findById(taggedobj.postId) ; // getting the exact post...

        const commentsPost = await Post.find({ $and:[{ replyToPostId:taggedobj.postId },{ postType:'comment' },{ isDeleted:false }] });
        const repostsPost = await Post.find({ $and:[{ postType:'repost' },{ replyToPostId:taggedobj.postId },{ isDeleted:false }] });
        const likesPost = await likes.find({ $and:[{ targetType:'post' },{ targetEntity:taggedobj.postId }]});
        const viewsPost = await Views.find({ postId:taggedobj.postId }) ; // a single condition required...

        const userLiked = await likes.exists({ $and: [{ accountId: myAccount._id }, { targetType: 'post' }, { targetEntity: reqPost._id }] });
        const userReposted = await Post.exists({ $and: [{ authorId: myAccount._id }, { postType: 'repost' }, { replyToPostId: reqPost._id }, { isDeleted: false }] });
        const userCommented = await Post.exists({ $and: [{ authorId: myAccount._id }, { postType: 'comment' }, { replyToPostId: reqPost._id }, { isDeleted: false }] });
        const userBookmarked = await tagged.exists({ $and: [{ accountId: myAccount._id }, { postId: reqPost._id },{ taggedAs:'bookmarked' }] });

        return {
            id:reqPost._id,
            content:reqPost.content,
            postedAt:new Date(reqPost.createdAt).toDateString(),
            comments:fmt(commentsPost.length),
            reposts:fmt(repostsPost.length),
            likes:fmt(likesPost.length),
            views:fmt(viewsPost.length),
            mediaUrls: Array(reqPost.mediaUrls).map(urlObj => urlObj.url ),
            hashTags: reqPost.hashtags,
            mentions: reqPost.mentions,
            userliked: userLiked ? true : false,
            usereposted: userReposted ? true : false,
            usercommented: userCommented ? true : false,
            userbookmarked: userBookmarked ? true : false
        }

       }))

    return {
        suggestions:sortedArr,
        posts: structuredPost,
        replies:structuredRepliedPost,
        medias:usermedia,
        likedPosts: likedPosts,
        highlights:highlightedOnes

    }
}

export const profileUpdateService = async (data: accountType) => {
    try {
        await connectWithMongoDB();

        const user = await getDecodedDataFromCookie("accessToken");
        if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST.' });

        const [cityname, countrycode] = data.location.text.split(',').map(s => s.trim());
        const geocodingFinalUrl = `${process.env.GEOCODING_URL}q=${encodeURIComponent(cityname)},${encodeURIComponent(countrycode)}&limit=1&appid=${process.env.NEXT_PUBLIC_GEOCODING_API_KEY}`;

        const locationApi = await axios.get(geocodingFinalUrl);
        if (!locationApi.data || locationApi.data.length === 0) return NextResponse.json({ message: 'Location not found' }, { status: 400 });

        const { lat, lon } = locationApi.data[0]; // extracting the required data...

        const Account = await accounts.findOne({ $and:[{ userId:user.id },{ 'account.Active':true }]}) ; 

         // uploading media on cloud...
        if (Account.avatar?.public_id) {
            await cloudinary.uploader.destroy(Account.avatar.public_id); // deleteing the existing avatar...
        }
        if (Account.banner?.public_id) {
            await cloudinary.uploader.destroy(Account.banner.public_id); // deleteing the existing banner...
        }

        // function returning media url and public_id...
        const cloudinaryMediaInfo =  (title:profileEditMediaType) => {
            const [ baseUrl , public_id ] = data[title].split('SEP').map(part => part.trim()) ; // splitting the url... 
            return {
                url:baseUrl,
                public_id:public_id
            }
         }

        const updatedAccount = await accounts.findOneAndUpdate(
            { $and: [{ userId: user.id }, { 'account.Active': true }] },
            {
                avatar: cloudinaryMediaInfo('avatarUrl'),
                banner: cloudinaryMediaInfo('bannerUrl'),
                name: data.name,
                username: data.handle,
                location: {
                    text: data.location.text,
                    coordinates: [lat, lon]
                },
                website: data.website,
                bio: data.bio
            },
            { new: true }
        );

        if (!updatedAccount) return NextResponse.json({ message: 'Account not found or update failed' }, { status: 404 });

        return NextResponse.json({ message: 'Profile updated successfully'}, { status: 200 });
    } catch (error) {
        console.error('Profile update error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
};

export const profileDeletionService = async (handle:string) => {
    await connectWithMongoDB() ; // connecting with mongodb...

    // Find the account by handle...
    const account = await accounts.findOne({ username: handle, 'account.status': 'ACTIVE' , 'account.Active':true});
    if (!account) return NextResponse.json({ message: 'Account Not found...' }, { status: 500 })

    // Setting account to deletion pending with scheduled deletion date 15 days 
    const scheduledDeletionAt = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000); // 15 days
    await accounts.findByIdAndUpdate(account._id, {'account.status': 'DELETION_PENDING','account.scheduledDeletionAt': scheduledDeletionAt , 'account.Active':false});

    functionToTriggerSchedule() ; // calling the deletion scheduler...
 }

export const blockingAccountService = async (handle:string , isBlock:boolean) => { 
    await connectWithMongoDB() ; // connecting to database...

    const user = await getDecodedDataFromCookie("accessToken");
    if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST.' });

    const myAccount = await accounts.findOne({ $and:[{ userId:user.id },{ 'account.Active':true }, { 'account.status':'ACTIVE' }]}) ;
    const targetAccount = await accounts.findOne({ username:handle }) ;

    if (!isBlock) {
        await Block.deleteOne({ $and:[{ blockedByAcc:myAccount._id },{ blockedAcc:targetAccount._id },{ isActive:true }] }) ;
    }

    const newBlockedDoc = new Block({ blockedByAcc:myAccount._id ,blockedAcc:targetAccount._id }) ;
    await newBlockedDoc.save() ; // saving the doc...
    await follows.findOneAndUpdate({ $or:[{ followerId:myAccount._id , followingId:targetAccount._id },{ followerId:targetAccount._id , followingId:myAccount._id }]},{ isDeleted:true })


}