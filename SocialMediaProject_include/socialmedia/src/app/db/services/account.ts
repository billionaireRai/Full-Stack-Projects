import { connectWithMongoDB } from "../dbConnection";
import { NextResponse } from "next/server";
import { userCardProp } from "./user";
import follows from "../models/follows";
import mongoose from "mongoose";
import { getDecodedDataFromCookie } from "@/lib/cookiehandler";
import Post from "../models/posts";
import subscriptions from "../models/subscriptions";
import Block from "../models/blocked";
import likes from "../models/likes";
import { fmt } from "@/lib/utils";
import accounts from "../models/accounts";

type Plan = "Free" | "Pro" | "Creator" | "Enterprise";

export const gettingAccountService = async (text:string) => {
    await connectWithMongoDB() ; // connecting to db...

    const user = await getDecodedDataFromCookie("accessToken");
    if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST...' });
    
    const activeAcc = await accounts.findOne({ userId: user.id , 'account.Active':true });
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
    const accountsMatched = await accounts.find({
        $and: [
            { $or: [{ name: { $regex: text, $options: 'i' } }, { username: { $regex: text, $options: 'i' } }] },
            { 'account.status': 'ACTIVE' }
        ]
    }) ;

    // getting the accounts information is a structure way...
    const dataToReturn = await Promise.all(accountsMatched.map((acc) => { 
        return returnAccountDataInStructure(acc._id) ;
     }));

     return NextResponse.json({ message:'Matching accounts fethced...' , searchedAcc:dataToReturn },{ status:200 });
}


export const exploreDetailsForAccountService = async () => {
    await connectWithMongoDB() ; // establishing DB connection...
    // getting cookies data...
    const user = await getDecodedDataFromCookie("accessToken");
    if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST...' });
    
    const activeAcc = await accounts.findOne({ userId: user.id , 'account.Active':true });
    if (!activeAcc) return NextResponse.json({ message: 'Current account not found' }, { status: 404 });

    // Fetch blocked account IDs
    const blockedDocs = await Block.find({ blockedByAcc: activeAcc._id, isActive: true });
    const blockedIds = blockedDocs.map(doc => doc.blockedAcc.toString());
    // generating the follow suggestions...
    const followingDocs: InstanceType<typeof follows>[] = await follows.find({ followerId : activeAcc._id , isDeleted:false});
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
    const indexOfAgeRange = ageRange.findIndex(activeAcc.interests.ageRange); // getting the index in ageRange...
    const indexOfGender = genderArray.findIndex(activeAcc.interests.gender); // same for gender...
    const filteredTopics = activeAcc.interests.topicsLoved ; // engagement topics array...

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
    const myLikes  = await likes.find({ $and:[ { accountId:activeAcc._id },{ targetType:{ $in: ['Post','Comment'] } }]}) ;
    const likedToAcc = await Promise.all(myLikes.map( async ( like ) => {
        return returnAccountDataInStructure((like.targetAccount as mongoose.Types.ObjectId).toString());
    }));
    const filteredLikedToAcc = likedToAcc.filter(acc => acc.id && !blockedIds.includes(acc.id));

    const postsContentUserCommented = await Post.find({ $and:[{ authorId:activeAcc._id },{ replyToPostId: { $exists: true, $ne: null } },{ isDeleted:false }]}) ;
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
    const suggesstionsArr = accountsWithSubs.map(item => item.acc); // usercardprop array...

    // calculating trending hashtags last 1 month...
    const totalHashtags: string[] = [];
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const postContainingHashtags = await Post.find({ hashtags: { $nin: [undefined, null, ''] }, isDeleted: false,
        createdAt: { $gte: thirtyDaysAgo }
    });
    postContainingHashtags.forEach((post) => { 
      totalHashtags.push(...post.hashtags);
    });

    const finalTags = [...new Set(totalHashtags)];

    const tagDetails = await Promise.all(finalTags.map(async (hashtag) => {
      // getting location author wise... 
      const hashtagPosts = await Post.find({ hashtags: { $in: [hashtag] }, isDeleted: false, createdAt: { $gte: thirtyDaysAgo }
      }).populate('authorId', 'location').lean();

      const postCount = await Post.countDocuments({ hashtags: { $in: [hashtag] }, isDeleted: false, createdAt: { $gte: thirtyDaysAgo }});

      // extracting location...
      const locations = hashtagPosts.map((post: any) => 
        (post.authorId && post.authorId.location?.text) || 
        (post.taggedLocation && post.taggedLocation[0]?.text) || 
        ''
      ).filter(Boolean);

      // Extract country...
      const countries = locations.map(loc => loc.split(',').pop()?.trim() || 'Unknown');
      
      const countryCounts: Record<string, number> = countries.reduce((acc, country) => {
        acc[country] = (acc[country] || 0) + 1;
        return acc;
      }, {});

      const topCountry = Object.entries(countryCounts).sort(([,a], [,b]) => b - a)[0]?.[0] || 'Global';

      return { tag: hashtag , posts:postCount , topCountry, countryPosts: countryCounts };
    }));
    
    // Top 5 by trending hashtags...
    const top5Tags = tagDetails.sort((a, b) => b.posts - a.posts).slice(0, 5).map((item, index) => ({
        rank: index + 1,
        region: item.topCountry,
        tag: item.tag,
        posts: fmt(item.posts)
    }));

    return NextResponse.json({ message: 'Explore details fetched', suggestions: suggesstionsArr, trendingHashtags: top5Tags }, { status: 200 });
}
