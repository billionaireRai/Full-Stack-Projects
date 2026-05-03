import Post from "../models/posts";
import likes from "../models/likes";
import accounts from "../models/accounts";
import tagged from "../models/tagged";
import Poll from "../models/polls";
import viewStat from "../models/viewstat";
import follows from "../models/follows";
import { polltype } from "./post";
import { userCardProp } from "./user";
import { fmt } from "@/lib/utils";
import { NextResponse } from "next/server";
import { pollOptionType } from "./post";
import { connectWithMongoDB } from "../dbConnection";
import { getDecodedDataFromCookie } from "@/lib/cookiehandler";
import { findDuplicates } from "@/lib/arrayduplicates";

type Plan = "Free" | "Pro" | "Creator" | "Enterprise";

export const getMutualCredentialsService = async ( target:string , from:string ) => { 
    await connectWithMongoDB() ; // connecting to database..
    
    const user = await getDecodedDataFromCookie("accessToken");
    if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST...' });
    
    const activeAcc = await accounts.findOne({ username:from.substring(1) , userId: user.id , 'account.Active':true });
    const targetAcc = await accounts.findOne({ username:target.substring(1),'account.Active':true }) ;

    if (!activeAcc || !targetAcc) return NextResponse.json({ message: 'Atleast one of account unavailable...' }, { status: 404 });

    // getting mutual accounts first...
    const bothFollowings = await follows.find({ $and:[{ followerId:{ $in:[activeAcc._id,targetAcc._id] } },{ isDeleted:false }] });
    const followingIds = bothFollowings.map(follow => follow.followingId) ;

    const mutualAccIds = findDuplicates(followingIds).flat();

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
           IsFollowing: isfollowing ? true : false ,
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
        }
    
   }

    const mutualAccounts = await Promise.all(mutualAccIds.map( async(accId) => { 
        return returnAccountDataInStructure(accId) ;
    })) 

// lets get account suggestions...
    const followingOfTarget = await follows.find({ $and:[{ followerId:targetAcc._id },{ isDeleted:false }] });
    const mutualFollowing = await Promise.all(followingOfTarget.map(async (followobj) => {
        const follow = await follows.findOne({ $and:[{ followerId:followobj.followingId },{ isDeleted:false }] }) ;
        return follow.followingId ;
    }).flat()) ;

    const mappedSuggesstions = await Promise.all(mutualFollowing.map(async (id) => {
        return returnAccountDataInStructure(id);
    }));
    const suggesstions = mappedSuggesstions.filter((acc) => !acc.IsFollowing);

    // sorting according to subscription level...
    const planOrder: Record<Plan, number> = { Free: 0, Pro: 1, Creator: 2, Enterprise: 3 };

    // sorting logic...
    const sortedAccSuggesstions = suggesstions.sort((a, b) => {
        const aPlan = (a.account?.plan || 'Free') as Plan;
        const bPlan = (b.account?.plan || 'Free') as Plan;
        const aLevel = planOrder[aPlan] ?? 0;
        const bLevel = planOrder[bPlan] ?? 0;
        
        if (aLevel !== bLevel) return bLevel - aLevel;
        
        const aVerified = a.account?.isVerified ?? false;
        const bVerified = b.account?.isVerified ?? false;
        if (aVerified !== bVerified) return aVerified ? -1 : 1;
            
        return 0;
    });

    // getting mutual liked posts...
    const bothLiked = await likes.find({ $and:[{ accountId:{ $in:[activeAcc._id,targetAcc._id] } },{ targetType:{ $in:['post','repost'] }}] }) ;
    const postids = bothLiked.map(likeObj => likeObj.targetEntity) ;

    const mutualLikesPostids = findDuplicates(postids).flat() ;
    const mutualLikePosts = await Promise.all(mutualLikesPostids.map(async (id) => { 
         const postMarked = await Post.findById(id);
        if (!postMarked || postMarked.isDeleted) return null;
        
        const postOwner = await accounts.findById(postMarked.authorId);
        if (!postOwner) return null;
        
        // Get counts
        const likesCount = await likes.countDocuments({ targetEntity: postMarked._id, targetType: 'post' });
         const repostsCount = await Post.countDocuments({ originalPostId: postMarked._id, postType: 'repost', isDeleted: false });
         const commentsCount = await Post.countDocuments({ replyToPostId: postMarked._id, postType: 'comment', isDeleted: false });
         // Get views cached aggregated counts
         const viewStats = await viewStat.findOne({ postId: postMarked._id });
         const viewsCount = viewStats?.totalViews || 0;
        
         // Check user interactions
          const userLiked = await likes.findOne({ accountId: activeAcc._id, targetType: 'post', targetEntity: postMarked._id });
          const userReposted = await Post.findOne({ authorId: activeAcc._id, repostId: postMarked._id, postType: 'repost',isDeleted: false });
         const userCommented = await Post.findOne({ authorId: activeAcc._id, replyToPostId: postMarked._id, postType: 'comment',isDeleted: false });
         const userBookmarked = await tagged.findOne({ accountId: activeAcc._id, taggedAs: 'bookmarked', entityId: postMarked._id });
        
         // Check if pinned/highlighted
         const isPinned = await tagged.findOne({ accountId: activeAcc._id, taggedAs: 'pinned', entityId: postMarked._id });
         const isHighlighted = await tagged.findOne({ accountId: activeAcc._id, taggedAs: 'highlighted', entityId: postMarked._id });
        
         // Check if following the post owner
        const isFollowing = await follows.findOne({ followerId: activeAcc._id, followingId: postOwner._id, isDeleted: false });
        
        // Get poll data if exists
         const pollData = await Poll.findOne({ authorPost: postMarked._id, isActive: true, expiry: { $gt: new Date() } });
         let poll: polltype | undefined;
         if (pollData) {
            poll = {
                question: pollData.question,
                options: pollData.options.map((opt: pollOptionType) => ({ text: opt.text, votes: opt.votes })),
                duration: pollData.duration
             };
        }
        
         return {
            id: postMarked._id.toString(),
            postId: postMarked._id.toString(),
            avatar: postOwner.account?.avatar || '/images/default-profile-pic.png',
            cover: postOwner.account?.bannerUrl || '/images/default-banner.jpg',
            username: postOwner.account?.name,
            handle: `@${postOwner.username}`,
            bio: postOwner.account?.bio || '',
            timestamp: new Date(postMarked.createdAt).toUTCString(),
            content: postMarked.content,
            media: Array(postMarked.mediaUrls).map(urlObj => ({ url:urlObj.url , media_type:urlObj.media_type })) || [],
            likes: likesCount,
            reposts: repostsCount,
            replies: commentsCount,
            views: viewsCount,
            isPinned: !!isPinned,
            isHighlighted: !!isHighlighted,
            userliked: !!userLiked,
            usereposted: !!userReposted,
            usercommented: !!userCommented,
            userbookmarked: !!userBookmarked,
            isCompleted: postOwner.account?.completed ?? false ,
            isVerified: postOwner.isVerified?.value || false,
            plan: postOwner.isVerified?.level || 'Free',
            followers: fmt(postOwner.followers) || '0',
            following: fmt(postOwner.following) || '0',
            hashTags: postMarked.hashTags || [],
            mentions: Array(postMarked.mentions).map((u: string) => typeof u === 'string' ? u.trim() : String(u).trim()),
            isFollowing: !!isFollowing,
            taggedLocation: postMarked.taggedLocation || [],
            poll: poll
        };
    }));
    

    return NextResponse.json({ message:"Mutual likes , accounts and suggesstions fetched !!" , suggesstions:sortedAccSuggesstions , mutuals:mutualAccounts , likes:mutualLikePosts  },{ status:200 });
}

export const getMutualInterestPostsService = async (target:string,from:string,page:number,size:number) => {
    await connectWithMongoDB() ; // connecting to database..
    
    const user = await getDecodedDataFromCookie("accessToken");
    if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST...' });
    
    const activeAcc = await accounts.findOne({ username:from.substring(1) , userId: user.id , 'account.Active':true });
    const targetAcc = await accounts.findOne({ username:target.substring(1),'account.Active':true }) ;

    if (!activeAcc || !targetAcc) return NextResponse.json({ message: 'Atleast one of account unavailable...' }, { status: 404 });

    const commonInterests = findDuplicates([...activeAcc.interests.topicsLoved,...targetAcc.interests.topicsLoved]); // getting common interests topics...
    let ageRangeArr : string[] ;
    if (activeAcc.interests.ageRange === targetAcc.interests.ageRange)  ageRangeArr = [...targetAcc.interests.ageRange] ; 
    else  ageRangeArr = [...targetAcc.interests.ageRange,...activeAcc.interests.ageRange] ;

    // getting accounts with common interest included...
    const accountWithInterest = await accounts.find({ $and:[{ 'interests.ageRange':{ $in:ageRangeArr } },{ 'interests.topicsLoved':{ $in:commonInterests } },{ isDeleted:false },{ 'account.status':'ACTIVE' }] }) ;

    // getting total posts and pagination values...
    const accIds = accountWithInterest.map(acc => acc._id) ;
    const totalPosts = await Post.find({ $and:[{ authorId:{ $in:accIds } },{ postType:{ $nin:['comment'] } },{ isDeleted:false }] }) ;

    const skipPosts = (page - 1 ) * size ;
    const hasMore = (skipPosts + size) < totalPosts.length ; 

    const Posts = await Post.find({ $and:[{ authorId:{ $in:accIds } },{ postType:{ $nin:['comment'] } },{ isDeleted:false }] }).skip(skipPosts).limit(size).lean() ;

    const finalPosts = Posts.map(async (post) => {
        const postOwner = await accounts.findById(post.authorId);
        
        // Get counts
         const likesCount = await likes.countDocuments({ targetEntity: post._id, targetType: 'post' });
        const repostsCount = await Post.countDocuments({ originalPostId: post._id, postType: 'repost', isDeleted: false });
         const commentsCount = await Post.countDocuments({ replyToPostId: post._id, postType: 'comment', isDeleted: false });
         // Get views cached aggregated counts
         const viewStats = await viewStat.findOne({ postId: post._id });
         const viewsCount = viewStats?.totalViews || 0;

         // Check user interactions
         const userLiked = await likes.findOne({ accountId: activeAcc._id, targetType: 'post', targetEntity: post._id });
         const userReposted = await Post.findOne({ authorId: activeAcc._id, repostId: post._id, postType: 'repost',isDeleted: false });
         const userCommented = await Post.findOne({ authorId: activeAcc._id, replyToPostId: post._id, postType: 'comment',isDeleted: false });
         const userBookmarked = await tagged.findOne({ accountId: activeAcc._id, taggedAs: 'bookmarked', entityId: post._id });
        
          // Check if pinned/highlighted
         const isPinned = await tagged.findOne({ accountId: activeAcc._id, taggedAs: 'pinned', entityId: post._id });
         const isHighlighted = await tagged.findOne({ accountId: activeAcc._id, taggedAs: 'highlighted', entityId: post._id });
        
         // Check if following the post owner
         const isFollowing = await follows.findOne({ followerId: activeAcc._id, followingId: postOwner._id, isDeleted: false });
        
         // Get poll data if exists
         const pollData = await Poll.findOne({ authorPost: post._id, isActive: true, expiry: { $gt: new Date() } });
        let poll: polltype | undefined;
        if (pollData) {
              poll = {
                  question: pollData.question,
                  options: pollData.options.map((opt: pollOptionType) => ({ text: opt.text, votes: opt.votes })),
                  duration: pollData.duration
              };
          }

          return {
              id: post._id,
              postId: post._id,
              avatar: postOwner.account?.avatar || '/images/default-profile-pic.png',
              cover: postOwner.account?.bannerUrl || '/images/default-banner.jpg',
              username: postOwner.account?.name,
              handle: `@${postOwner.username}`,
              bio: postOwner.account?.bio || '',
              timestamp: new Date(post.createdAt).toUTCString(),
              content: post.content,
              media: Array(post.mediaUrls).map(urlObj => ({ url:urlObj.url , media_type:urlObj.media_type })) || [],
             likes: likesCount,reposts: repostsCount,
             replies: commentsCount,
             views: viewsCount,
             isPinned: !!isPinned,
             isHighlighted: !!isHighlighted,
             userliked: !!userLiked,
             usereposted: !!userReposted,
             usercommented: !!userCommented,
             userbookmarked: !!userBookmarked,
             isCompleted: postOwner.account?.completed ?? false ,
             isVerified: postOwner.isVerified?.value || false,
             plan: postOwner.isVerified?.level || 'Free',
             followers: fmt(postOwner.followers) || '0',
             following: fmt(postOwner.following) || '0',
              hashTags: post.hashTags || [],
             mentions: Array(post.mentions).map((u: string) => typeof u === 'string' ? u.trim() : String(u).trim()),
             isFollowing: !!isFollowing,
             taggedLocation: post.taggedLocation || [],
             poll: poll
         };
    });
    
    return NextResponse.json({ message:'mutual interest posts fetched...' , interestedPost:finalPosts , hasMore:hasMore },{ status:200 });
}