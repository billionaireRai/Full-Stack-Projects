import { connectWithMongoDB } from "../dbConnection";
import { NextResponse } from "next/server";
import { uploadMediaOnCloudinary } from "@/app/controllers/cloudinary";
import { getDecodedDataFromCookie } from "@/lib/cookiehandler";
import mongoose from "mongoose";
import accounts from "../models/accounts";
import Post from "../models/posts";
import Poll from "../models/polls";
import tagged from "../models/tagged";
import { fmt } from "@/lib/utils";
import Views from "../models/views";
import viewStat from "../models/viewstat";
import likes from "../models/likes";
import follows from "../models/follows";
import { accountInfoType } from "@/components/usercard";
import { sendCommentNotification, sendLikeNotification, sendMentionNotification, sendRepostNotification } from "./notifications";
import Message from "../models/messages";
import Block from "../models/blocked";
import subscriptions from "../models/subscriptions";
import { userCardProp } from "./user";
import { PostCardProps } from "@/components/postcard";

type Plan = "Free" | "Pro" | "Creator" | "Enterprise";

interface uploadedObj {
     success: boolean;
     url: string;
     public_id: string;
     resource_type: "image" | "video" | "raw" | "auto";
}

interface postDeletionType {
    postId:string,
    postOwner:string,
    deleteRequestBy:string
}

interface pollOptionType {
    text: string,
    votes: number 
}
interface polltype {
    question: string ,
    options: pollOptionType[],
    duration: number  
}

interface commentDataType {
    postId:string , 
    replyText:string , 
    mentions:string[] ,
    AddLocation:string[] 
}


export const createANewPostService = async ( data:any ) => { 
    await connectWithMongoDB() ; // establishing connection with mongoDB...

    const { postText , imgUrls , videoUrls , mentions , gifsArr , taggedLocation , canBeRepliedBy , poll } = data ; // getting out the data...

    // getting credentials from cookies...
    const user = await getDecodedDataFromCookie("accessToken");
    if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST...' });
    
    // getting the active account...
    const activeAcc = await accounts.findOne({ userId: user.id , 'account.Active':true , 'account.status':'ACTIVE' });
    if (!activeAcc) return NextResponse.json({ message: 'Current account not found' }, { status: 404 });

    // checking post restriction...
    const currentDate = new Date();
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    const totalPostsThisMonth = await Post.countDocuments({
        authorId: activeAcc._id,
        isDeleted: false,
        postType:'original',
        createdAt: { $gte: monthStart, $lt: monthEnd }
    });

    // posts limited to 20 for unverified accounts...
    if (!activeAcc.isVerified.value && ( totalPostsThisMonth >= 20 || (String(postText).length > 100))) {
        console.log("Post creation restricted , get verified !!");
        return NextResponse.json({ message: 'Post limit of this month exceeded for unverified accounts !!' }, { status: 429 });
    }

    // uploading media on cloudinary...
    const uploadedImgObjs : uploadedObj[] = await Promise.all( imgUrls.map( async (url:File) => { 
        const bytes = await url.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        const uploadedObj = await uploadMediaOnCloudinary(buffer,url.name);
        if (uploadedObj.success)  return uploadedObj ;
    }))

    const uploadedvideoObjs : uploadedObj[] = await Promise.all( videoUrls.map( async (url:File) => { 
        const bytes = await url.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        const uploadedObj = await uploadMediaOnCloudinary(buffer,url.name);
        if (uploadedObj.success)  return uploadedObj ;
    }))

    const uploadedgifsArrObjs : uploadedObj[] = await Promise.all( gifsArr.map( async (url:File) => { 
        const bytes = await url.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        const uploadedObj = await uploadMediaOnCloudinary(buffer,url.name);
        if (uploadedObj.success)  return uploadedObj ;
        
    }))

    // getting the accounts...
    const foundAccounts = await accounts.find({
        username: { $in: mentions },
        'account.status': 'ACTIVE'
    }).select('_id username').lean();

    // Create a map for quick lookup and maintain order
    const accountIdMap = new Map(foundAccounts.map(acc => [acc.username, acc._id]));
    const mentionsAccountsIds = mentions
        .map((username:string) => accountIdMap.get(username))
        .filter(Boolean); // Filter out mentions with no matching account
    const fullMediaArr = [ ...uploadedImgObjs , ...uploadedvideoObjs , ...uploadedgifsArrObjs ] ; // full array of media...
    const newPost = new Post({
        authorId:activeAcc._id,
        content:postText,
        mediaUrls: fullMediaArr.map((media) => ({ url: media.url, public_id: media.public_id, media_type: media.resource_type })),
        replyAllowedBy:canBeRepliedBy,
        mentions:mentionsAccountsIds,
        taggedLocation : taggedLocation
    })
    
    if (poll && poll.question) {
        const expiry = new Date(Date.now() + poll.duration * 1000); // expiry time based on duration...
        const newPoll = new Poll({ authorPost: newPost._id, question: poll.question, options: poll.options, duration: poll.duration, expiry });
        await newPoll.save();
    }

    await newPost.save(); // saving the post...
    return NextResponse.json({ message: 'Post created successfully!' }, { status: 200 });

}

export const postDeletionService = async (credentials:postDeletionType) => {
    const { postId , postOwner , deleteRequestBy } = credentials ; // parsing credentials in service...
    await connectWithMongoDB() ; // connecting to database...

    // getting credentials from cookies...
    const user = await getDecodedDataFromCookie("accessToken");
    if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST...' });

    // getting my active account...
    const activeAcc = await accounts.findOne({ username:deleteRequestBy , userId: user.id , 'account.Active':true , 'account.status':'ACTIVE' });
    if (!activeAcc) return NextResponse.json({ message: 'Current account not found' }, { status: 404 });

    // Update the post to mark as deleted...
    const updatedPost = await Post.findOneAndUpdate({ $and:[{ _id:postId },{ authorId:activeAcc._id  },{ isDeleted:false }] },{ isDeleted:true },{ new:true });

    if (!updatedPost) return NextResponse.json({ message: 'Post not found or already deleted' }, { status: 404 });

    return NextResponse.json({ message: 'Post deleted successfully' }, { status: 200 });
}

export const postUpdationService = async (data:any) => {
    const { postId , postText , mentions , taggedLocations , canBeRepliedBy , poll , imgUrls , videoUrls , gifsArr , existingMedia } = data ; // destructuring syntax...

    await connectWithMongoDB() ; // establish connection with mongoDB...

    // getting credentials from cookies...
    const user = await getDecodedDataFromCookie("accessToken");
    if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST...' });

    // getting my active account...
    const activeAcc = await accounts.findOne({ userId: user.id , 'account.Active':true , 'account.status':'ACTIVE' });
    if (!activeAcc) return NextResponse.json({ message: 'Current account not found' }, { status: 404 });

    if(!activeAcc.isVerified.value){
        console.log('Restircted to use this functionality !!');
        return NextResponse.json({ message: 'Post updates are restricted for unverified accounts. Please verify your account.' }, { status: 403 });
    }

    // getting accounts..
    const foundAccounts = await accounts.find({
        username: { $in: mentions },
        'account.status': 'ACTIVE'
    }).select('_id username').lean();

    // Create a map for quick lookup and maintain order
    const accountIdMap = new Map(foundAccounts.map(acc => [acc.username, acc._id]));
    const mentionsAccountsIds = mentions
        .map((username:string) => accountIdMap.get(username))
        .filter(Boolean); // Filter out mentions with no matching account

    // uploading media on cloudinary...
    const uploadedImgObjs : uploadedObj[] = imgUrls.length > 0 ? await Promise.all( imgUrls.map( async (url:File) => {
        const bytes = await url.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadedObj = await uploadMediaOnCloudinary(buffer,url.name);
        return uploadedObj.success ? uploadedObj : null;
    })) : []

    const uploadedvideoObjs : uploadedObj[] = videoUrls.length > 0 ? await Promise.all( videoUrls.map( async (url:File) => {
        const bytes = await url.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadedObj = await uploadMediaOnCloudinary(buffer,url.name);
        return uploadedObj.success ? uploadedObj : null;
    })) : [] ;

    const uploadedgifsArrObjs : uploadedObj[] = gifsArr.length > 0 ? await Promise.all( gifsArr.map( async (url:File) => {
        const bytes = await url.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadedObj = await uploadMediaOnCloudinary(buffer,url.name);
        return uploadedObj.success ? uploadedObj : null;
    })) : [];

    const fullMediaArr = [ ...uploadedImgObjs , ...uploadedvideoObjs , ...uploadedgifsArrObjs ] ; // full array of media...

    // updating the post...
    const updatedPost = await Post.findOneAndUpdate({ $and:[{ authorId:activeAcc._id },{ _id:postId }] },{
        content: postText,
        mediaUrls: [ ...existingMedia, ...fullMediaArr.map((media) => ({ url: media.url, public_id: media.public_id, media_type: media.resource_type })) ],
        replyAllowedBy: canBeRepliedBy,
        mentions: mentionsAccountsIds,
        taggedLocation: taggedLocations
    },{ new: true }) ;

    // poll related updation...
    const existingPoll = await Poll.findOne({ authorPost: updatedPost._id, expiry: { $gt: new Date() }, isActive: true });

    if (existingPoll && poll && poll.question) {
            // Updating existing poll
            const expiry = new Date(Date.now() + poll.duration * 1000);
            await Poll.findOneAndUpdate(
                { _id: existingPoll._id },
                {
                    question: poll.question,
                    options: poll.options,
                    duration: poll.duration,
                    expiry: expiry
                }
            );
    } else {
        if (poll && poll.question) {
            // Create new poll...
            const expiry = new Date(Date.now() + poll.duration * 1000);
            const newPoll = new Poll({
                authorPost: updatedPost._id,
                question: poll.question,
                options: poll.options,
                duration: poll.duration,
                expiry: expiry
            });
            await newPoll.save();
        }
    }

    if (!updatedPost) return NextResponse.json({ message: 'Post not found !!' }, { status: 404 });

    return NextResponse.json({ message: 'Post updated successfully !!' }, { status: 200 });

}

export const togglePostPinService = async (data:any) => {
    const { currentState , postid , postowner } = data ; // destructuring the data...
    await connectWithMongoDB() ; // establishing connection with mongodb...

    // getting credentials from cookies...
    const user = await getDecodedDataFromCookie("accessToken");
    if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST...' });

    // getting my active account...
    const activeAcc = await accounts.findOne({ userId: user.id, username:postowner , 'account.Active':true , 'account.status':'ACTIVE' });
    if (!activeAcc) return NextResponse.json({ message: 'Current account not found' }, { status: 404 });

    // state toggeling from true to false...
    if (currentState) {  
        await tagged.findOneAndDelete({ $and:[{ accountId:activeAcc._id },{ taggedAs:'pinned' },{ entityId:postid }] },{ new:true }) ; // getting the object...
        return NextResponse.json({ message: 'Post unpinned successfully !!' }, { status: 200 });
    } else {
        // false to true...
        const newPinTag = new tagged({
            accountId:activeAcc._id,
            taggedAs:'pinned',
            entityId:postid
        }) ;

        await newPinTag.save() ; // saving the tagged obj...
        return NextResponse.json({ message: 'Post pinned successfully !!' }, { status: 200 });
    }

}

export const togglePostHighlightService = async (postid:string) => {
    await connectWithMongoDB(); // establishing connection with mongodb...

    // getting credentials from cookies...
    const user = await getDecodedDataFromCookie("accessToken");
    if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST...' });

    // getting my active account...
    const activeAcc = await accounts.findOne({ userId: user.id, 'account.Active': true, 'account.status': 'ACTIVE' });
    if (!activeAcc) return NextResponse.json({ message: 'Current account not found' }, { status: 404 });

    // Check if the post exists and can belong to any account...
    const post = await Post.findOne({ _id: postid, isDeleted: false });
    if (!post) return NextResponse.json({ message: 'Post not found or access denied' }, { status: 404 });

    // Check if already highlighted...
    const existingHighlight = await tagged.findOne({ accountId: activeAcc._id, taggedAs: 'highlighted', entityId: postid });

    if (existingHighlight) {
        // Unhighlight OR delete the tagged document
        await tagged.findOneAndDelete({ _id: existingHighlight._id });
        return NextResponse.json({ message: 'Post unhighlighted successfully !!' }, { status: 200 });
    } else {
        // Highlight OR create new tagged document
        const newHighlightTag = new tagged({
            accountId: activeAcc._id,
            taggedAs: 'highlighted',
            entityId: postid
        });
        await newHighlightTag.save();
        return NextResponse.json({ message: 'Post highlighted successfully !!' }, { status: 200 });
    }
}

export const togglePostFavouriteService = async (postid: string) => {
    await connectWithMongoDB(); // establishing connection with mongodb...

    // getting credentials from cookies...
    const user = await getDecodedDataFromCookie("accessToken");
    if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST...' });

    // getting my active account...
    const activeAcc = await accounts.findOne({ userId: user.id, 'account.Active': true, 'account.status': 'ACTIVE' });
    if (!activeAcc) return NextResponse.json({ message: 'Current account not found' }, { status: 404 });

    // Check if the post exists...
    const post = await Post.findOne({ _id: postid, isDeleted: false });
    if (!post) return NextResponse.json({ message: 'Post not found' }, { status: 404 });

    // Check if already favourited (bookmarked)...
    const existingFavourite = await tagged.findOne({ accountId: activeAcc._id, taggedAs: 'bookmarked', entityId: postid });

    if (existingFavourite) {
        return NextResponse.json({ message: 'Post already in favourites !!' }, { status: 200 });
    } else {
        // Add to favourites
        const newFavouriteTag = new tagged({
            accountId: activeAcc._id,
            taggedAs: 'favourite',
            entityId: postid
        });
        await newFavouriteTag.save();
        return NextResponse.json({ message: 'Post added to favourites !!' }, { status: 200 });
    }
}

// function to get a single post by ID (for embed functionality)
export const getPostByIdService = async (postId: string) => {
    await connectWithMongoDB();
    const post = await Post.findOne({ _id: postId, isDeleted: false });
    if (!post) {
        return NextResponse.json({ success: false, message: 'Post not found' },{ status: 404 });
    }

    const author = await accounts.findById(post.authorId);

    if (!author) {
        return NextResponse.json({ success: false, message: 'Author not found' },{ status: 404 });
    }

    // Count likes from likes collection
    const likesCount = await likes.countDocuments({ targetEntity: postId, targetType: 'post' });

    // Count reposts from Post collection 
    const repostsCount = await Post.countDocuments({ originalPostId: postId , postType:'repost', isDeleted:false  });

    // Count comments from Post collection 
    const commentsCount = await Post.countDocuments({ replyToPostId: postId , postType:'comment' ,isDeleted:false });

    // Get views from viewStat collection (cached aggregated counts)
    const viewStats = await viewStat.findOne({ postId: postId });
    const viewsCount = viewStats?.totalViews || 0;

    // Get poll data if exists
    const pollData = await Poll.findOne({ authorPost: postId, isActive: true, expiry: { $gt: new Date() } });
    
    let poll:polltype | undefined ;
    if (pollData) {
        poll = {
            question: pollData.question,
            options: pollData.options.map((opt:pollOptionType) => ({ text: opt.text, votes: opt.votes })),
            duration: pollData.duration
        };
    }

    return NextResponse.json(
        {
            success: true,
            post: {
                id: post._id.toString(),
                content: post.content,
                postedAt: new Date(post.createdAt).toUTCString(),
                comments: commentsCount,
                reposts: repostsCount,
                likes: likesCount,
                views: viewsCount,
                media: Array(post.mediaUrls).map(urlObj => ({ url:urlObj.url , media_type:urlObj.media_type })) || [],
                hashTags: post.hashTags || [],
                mentions: Array(post.mentions).map((u:string)=> u.trim()),
                isPinned: false,
                username: author.account?.name ,
                handle: `@${author.username}`,
                avatar: author.account?.avatar || '/images/default-profile-pic.png',
                isCompleted: author.account?.completed ?? false ,
                isVerified: author.isVerified?.value || false,
                plan: author.isVerified?.level || 'Free',
                taggedLocation: post.taggedLocation || [],
                poll: poll
            }
        },
        { status: 200 }
    );
};

export const postNotInterestedService = async (postid:string) => {
    await connectWithMongoDB() ; // connecting with db...

    // extracting cookies data...
    const user = await getDecodedDataFromCookie("accessToken");
    if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST...' });

    // getting my active account...
    const activeAcc = await accounts.findOne({ userId: user.id, 'account.Active': true, 'account.status': 'ACTIVE' });
    if (!activeAcc) return NextResponse.json({ message: 'Current account not found' }, { status: 404 });

    // Check if the post exists...
    const post = await Post.findOne({ _id: postid, isDeleted: false }); 
    if (!post) return NextResponse.json({ message: 'Post not found' }, { status: 404 }); // if post dosent exists...

    // Check if already marked as not interested...
    const existingNotInterested = await tagged.findOne({ accountId: activeAcc._id, taggedAs: 'not_interested', entityId: postid });

    if (existingNotInterested) return NextResponse.json({ message: 'Post already marked as not interested !!' }, { status: 200 });

    else {
        // making a new tag obj...
        const newNotInterestedTag = new tagged({
            accountId: activeAcc._id,
            taggedAs: 'not_interested',
            entityId: postid
        });

        await newNotInterestedTag.save(); // saving the obj...
        return NextResponse.json({ message: 'Post marked as not interested !!' }, { status: 200 });
    }
}

export const commentingOnAPostService = async ( data:commentDataType ) => {
    const { postId , replyText , mentions , AddLocation } = data ; // extrating the info...
    
    await connectWithMongoDB() ; // establishing DB connection...

    // extracting cookies data...
    const user = await getDecodedDataFromCookie("accessToken");
    if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST...' });

    // getting my active account...
    const activeAcc = await accounts.findOne({ userId: user.id, 'account.Active': true, 'account.status': 'ACTIVE' });
    if (!activeAcc) return NextResponse.json({ message: 'Current account not found' }, { status: 404 });

    // checking if already commented...
    const commentExists = await Post.find({ authorId:activeAcc._id , replyToPostId:postId , postType:'comment' , isDeleted:false }) ; 

    if (commentExists) {
        console.log('Duplicacy in comments not allowed !!');
        return NextResponse.json({ message:'Already commented on this post...' },{ status:404 });
    }

    const targetPost = await Post.findOne({ $and:[ { _id:postId } ,{ isDeleted:false } ] }); // getting post comment on...

    // fethcing accounts by mentions...
    const foundAccounts = await accounts.find({ username: { $in: mentions },'account.status': 'ACTIVE'}).select('_id username').lean();
    // Create a map for fast retrieval..
    const accountIdMap = new Map(foundAccounts.map(acc => [acc.username, acc._id]));
    const mentionIds = mentions
        .map(username => accountIdMap.get(username))
        .filter(Boolean); // Filter out mentions with no matching account
    

    // checking is commenting allowed for me... ['everyone','following','mentioned','verified']
    var commentingAllowed : boolean = true ;
    const allowedFor = targetPost.replyAllowedBy ; // from post...
    if (allowedFor === 'following') {
      const followobject = await follows.exists({ followerId:targetPost.authorId , followingId:activeAcc._id , isDeleted:false }) ;
      if (!followobject) commentingAllowed = false ;    
     
    } else if (allowedFor === 'mentioned' && !accountIdMap.get(activeAcc.username)) {
        commentingAllowed = false ;
    } else if (allowedFor === 'verified' && !activeAcc.isVerified.value) {
        commentingAllowed = false ;
    }

    if (!commentExists && commentingAllowed) {
        const commentPost = new Post({  
           content:replyText,
           replyAllowedBy:'everyone',
           repliedToPostId:postId,
           postType:'comment',
           mentions:mentionIds,
           taggedLocation:AddLocation
        })

        await commentPost.save() ; // saving the post in DB...

        // notification to post author about the new comment...
        if (targetPost.authorId.toString() !== activeAcc._id.toString()) {
            await sendCommentNotification(
                targetPost.authorId.toString(),   
                activeAcc._id.toString(),            
                postId,                               
                commentPost._id.toString()          
            );
        }

        // Send mention notifications to mentioned accounts...
        for (const mentionId of mentionIds) {
            const mentionIdStr = typeof mentionId === 'string' ? mentionId : String(mentionId).toString();
            // Don't send notification to the post author (they already got comment notification)
            if (mentionIdStr !== targetPost.authorId.toString() && mentionIdStr !== activeAcc._id.toString()) {
                await sendMentionNotification(
                    mentionIdStr,               
                    activeAcc._id.toString(),     
                    postId,                       
                    commentPost._id.toString()      
                );
            }
        }

        return NextResponse.json({ message:'Comment on post succssfully !!' },{ status:200 });
    }

    return NextResponse.json({ message:'Unable to comment on this post !!' },{ status:400 });
}

export const postRepostService = async (data:{ postid:string , repostState:boolean }) => {
    const { postid , repostState } = data ; // extracting data from parameter...
    
    await connectWithMongoDB() ; // connecting with database... 
    
    // extracting cookies data...
    const user = await getDecodedDataFromCookie("accessToken");
    if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST...' });

    // getting my active account...
    const activeAcc = await accounts.findOne({ userId: user.id, 'account.Active': true, 'account.status': 'ACTIVE' });
    if (!activeAcc) return NextResponse.json({ message: 'Current account not found' }, { status: 404 });

    // checking if already reposted...
    const repostedPost = await Post.findOne({ authorId:activeAcc._id , repostId:postid , postType:'repost' , isDeleted:false }); 

    // already reposted and again triggered...
    if (repostedPost && repostState) {
        await Post.findByIdAndDelete(repostedPost._id) ;  // deleting whole record...
        return NextResponse.json({ message:'Repost action reverted...' },{ status:200 });
    }

    // logically incorrect conditions...
    if (repostedPost && !repostState) {
        console.log("Already reposted by you...");
        return NextResponse.json({ message:'Already reposted with unmatched state !!' },{ status:404 });
    }

    if (!repostedPost && repostState) {
        console.log('Repost didnt exists...');
        return NextResponse.json({ message:'Repost didnt exists !!' },{ status:404 });
    }

    // creating a repost now...
    const originalPost = await Post.findOne({ _id: postid, isDeleted: false }); // fetching the post actioned on...
    if (!originalPost) {
        console.log('Unable to find original post...')
        return NextResponse.json({ message: 'Original post not found or has been deleted !!' }, { status: 404 });
    }

    const newRepost = new Post({
        authorId: activeAcc._id,
        mediaUrls:originalPost.mediaUrls,
        replyAllowedBy:'everyone',
        postType: 'repost',
        repostId: postid,
        hashtags:originalPost.hashtags,
        mentions:originalPost.mentions,
        taggedLocation:originalPost.taggedLocation
    });
    
    await newRepost.save();

    // sending repost notification to Target acc....
    await sendRepostNotification(originalPost.authorId,activeAcc._id,originalPost._id) ;

    return NextResponse.json({ message: 'Post reposted successfully !!' }, { status: 200 });

}

export const postLikedService = async ( data:{ postId:string , isLiked:boolean } ) => {
    const { postId , isLiked } = data ; // extracting postid and isliked...

    await connectWithMongoDB() ; // establishing connection with DB...
    // extracting cookies data...
    const user = await getDecodedDataFromCookie("accessToken");
    if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST...' });

    // getting my active account...
    const activeAcc = await accounts.findOne({ userId: user.id, 'account.Active': true, 'account.status': 'ACTIVE' });
    if (!activeAcc) return NextResponse.json({ message: 'Current account not found' }, { status: 404 });

    // checking if already liked...
    const alreadyLiked = await likes.find({ $and:[{ accountId:activeAcc._id },{ targetType:'post' },{ targetEntity:postId }] });
    
    // like already exists...
    if (alreadyLiked && isLiked)  {
        console.log("Like already exists...");
        await likes.deleteOne({ accountId:activeAcc._id , targetType:'post' , targetEntity:postId }) ; // deletion of like...
        return NextResponse.json({ message:'Post successfully unliked !!' },{ status:200 });
    }

    // logically incorrect conditions...
    if (alreadyLiked && !isLiked) {
        console.log("Already Liked by you...");
        return NextResponse.json({ message:'Already Liked with unmatched state !!' },{ status:404 });
    }

    if (!alreadyLiked && isLiked) {
        console.log('Like record didnt exists...');
        return NextResponse.json({ message:'Like didnt exists !!' },{ status:404 });
    }

    // creating a new like doc...
    const postToLike = await Post.findOne({ _id:postId , isDeleted:false}) ;
    if (!postToLike) {
        console.log('Unable to find post...')
        return NextResponse.json({ message: 'post not found or has been deleted !!' }, { status: 404 });
    }

    const newLike = new likes({
        accountId:activeAcc._id,
        targetType:'post',
        targetEntity:postId
    });

    await newLike.save() ; // saving the doc in collection...

    // sending like notification...
    sendLikeNotification(postToLike.authorId,activeAcc._id,postToLike._id);

    return NextResponse.json({ message:'Post Liked successfully !!'},{ status:200 });
} 

export const postBookmarkingService = async (data:{ postId:string , isBookmarked:boolean }) => {
    const { postId , isBookmarked } = data ; 

    await connectWithMongoDB() ; // database connection...
    // extracting cookies data...
    const user = await getDecodedDataFromCookie("accessToken");
    if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST...' });

    // getting my active account...
    const activeAcc = await accounts.findOne({ userId: user.id, 'account.Active': true, 'account.status': 'ACTIVE' });
    if (!activeAcc) return NextResponse.json({ message: 'Current account not found' }, { status: 404 });

    // checking if already bookmarked...
    const alreadyMarked = await tagged.find({ $and:[{ accountId:activeAcc._id },{ taggedAs:'bookmarked' },{ entityid:postId }] });
    
    // bookmarked already exists...
    if (alreadyMarked && isBookmarked)  {
        console.log("Bookmark already exists...");
        await tagged.deleteOne({ accountId:activeAcc._id , taggedAs:'bookmarked' , entityId:postId }) ; // deletion of bookmarked...
        return NextResponse.json({ message:'Post successfully unmarked !!' },{ status:200 });
    }

    // logically incorrect conditions...
    if (alreadyMarked && !isBookmarked) {
        console.log("Already bookmarked by you...");
        return NextResponse.json({ message:'Already bookmarked with unmatched state !!' },{ status:404 });
    }

    if (!alreadyMarked && isBookmarked) {
        console.log('Bookmark record didnt exists...');
        return NextResponse.json({ message:'Bookmark didnt exists !!' },{ status:404 });
    }

    // creating a new like doc...
    const postToLike = await Post.find({ _id:postId , isDeleted:false}) ;
    if (!postToLike) {
        console.log('Unable to find post...')
        return NextResponse.json({ message: 'post not found or has been deleted !!' }, { status: 404 });
    }

    // creating a ne bookmark...
    const bookmarkTag = new tagged({ accountId:activeAcc._id , entityId:postId }) ; // new bookmark created...

    await bookmarkTag.save() ; 
    return NextResponse.json({ message:'Post successfully bookmarked !!' },{ status:200 });
}

// Link : http://localhost:3000/@johndoe/post/1?section=All
// Account to be send : [
//   {
//     name: '',
//     handle: '',
//     bio: '',
//     location: { text: '', coordinates: [Array] },
//     website: '',
//     joinDate: '',
//     following: '0',
//     followers: '0',
//     Posts: '0',
//     isCompleted: false,
//     isVerified: false,
//     plan:'Free',
//     bannerUrl: '',
//     avatarUrl: ''
//   }
// ]
export const postSendingViaDM = async (data:{ link:string , selectedAccounts:accountInfoType[] }) => {
       const { link , selectedAccounts } = data ;

        await connectWithMongoDB() ; // establishing connection with DB...

        // extracting cookies data...
        const user = await getDecodedDataFromCookie("accessToken");
        if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST...' });

        // getting my active account...
        const activeAcc = await accounts.findOne({ userId: user.id, 'account.Active': true, 'account.status': 'ACTIVE' });
        if (!activeAcc) return NextResponse.json({ message: 'Current account not found' }, { status: 404 });

        // Extract unique handles from selected accounts...
        const handles = selectedAccounts.map(account => account.handle);
        
        // fetch all target accounts at once...
        const targetAccounts = await accounts.find({ username: { $in: handles },'account.status': 'ACTIVE' }).select('_id username').lean();

        // Create a map for quick lookup...
        const accountIdMap = new Map(targetAccounts.map(acc => [acc.username, acc._id]));

        // Build messages array for valid accounts...
        const messagesToSend = selectedAccounts
            .map(account => {
                const targetId = accountIdMap.get(account.handle);
                if (!targetId) return null; // Skip invalid handles...
                return {
                    fromId: activeAcc._id,
                    toId: targetId,
                    postLink: link,
                };
            })
            .filter(Boolean); // Remove null entries...

        if (messagesToSend.length === 0) return NextResponse.json({ message: 'No valid accounts found to send message' }, { status: 400 });

        // bulk inserting of messages...
        await Message.insertMany(messagesToSend);

        return NextResponse.json({ message:'Post shared via DM...' },{ status:200 });
}

export const getBookmarkAndSuggestionService = async () => {
    await connectWithMongoDB(); // connecting with database...

    // extracting cookies data...
    const user = await getDecodedDataFromCookie("accessToken");
    if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST...' });
    // getting my active account...
    const activeAcc = await accounts.findOne({ userId: user.id, 'account.Active': true, 'account.status': 'ACTIVE' });
    if (!activeAcc) return NextResponse.json({ message: 'Current account not found' }, { status: 404 });


    // Helper function to return account data in structure
    async function returnAccountDataInStructure(accountId: string): Promise<userCardProp> {
        const particularAcc = await accounts.findById(accountId);
        if (!particularAcc) return {} as userCardProp ;
        
        // getting count of followers and followings...
        const postCategory = ['original','repost'];
        const followers = await follows.find({ followingId: particularAcc._id, isDeleted: false });
        const following = await follows.find({ followerId: particularAcc._id, isDeleted: false });
        const posts = await Post.find({ authorId:particularAcc._id , postType: { $in:postCategory } ,isDeleted:false }) ;
        const isFollowing = await follows.exists({ followerId: activeAcc._id, followingId: particularAcc._id, isDeleted: false });

        return {
            id: particularAcc._id.toString(),
            decodedHandle:`@${particularAcc.username}`,
            name: particularAcc.name,
            content: particularAcc.bio,
            account: {
                name: particularAcc.name,
                handle:`@${particularAcc.username}`,
                bio: particularAcc.bio || '',
                location: {
                    text: particularAcc.location?.text || '',
                    coordinates: particularAcc.location?.coordinates || [0, 0]
                },
                website: particularAcc.website || '',
                joinDate: particularAcc.createdAt ? new Date(particularAcc.createdAt).toDateString() : '',
                following: fmt(following.length),
                followers: fmt(followers.length),
                Posts: fmt(posts.length),
                isCompleted: particularAcc.account?.completed || false,
                isVerified: particularAcc.isVerified?.value || false,
                plan: particularAcc.isVerified?.level || 'Free',
                bannerUrl: particularAcc.banner?.url || '/images/default-banner.jpg',
                avatarUrl: particularAcc.avatar?.url || '/images/default-profile-pic.png'
            },
            IsFollowing: isFollowing ? true : false
        };
    }

    // getting the bookmarked posts
    const bookmarks = await tagged.find({ $and: [{ accountId: activeAcc._id }, { taggedAs: 'bookmarked' }] });

    const posts = await Promise.all(bookmarks.map(async (bookmark: any) => {
        const postMarked = await Post.findById(bookmark.entityId);
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
        const userReposted = await Post.findOne({ authorId: activeAcc._id, repostId: postMarked._id, postType: 'repost', isDeleted: false });
        const userCommented = await Post.findOne({ authorId: activeAcc._id, replyToPostId: postMarked._id, postType: 'comment', isDeleted: false });
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

    // Filter out null values...
    const filteredPosts = posts.filter(Boolean);

    // getting account suggestions from bookmarked posts...
    const suggestedAccountsPromises = filteredPosts.map(async (post: any) => {
        const account = await accounts.findOne({ username: post?.handle, 'account.status': 'ACTIVE' });
        if (!account) return null;
        const posts = await Post.find({ authorId: account._id, isDeleted: false });
        const isFoll = await follows.exists({ followerId: activeAcc._id, followingId: account._id, isDeleted: false });
        return {
            id:account._id.toString(),
            decodedHandle:`@${account.username}`,
            name: account.name,
            content:account.bio,
            IsFollowing: isFoll ? true : false ,
            account: {
                name: account.name,
                handle: `@${account.username}`,
                bio: account.bio || '',
                location: {
                    text: account.location?.text || '',
                    coordinates: account.location?.coordinates || [0, 0]
                },
                website: account.website || '',
                joinDate: account.createdAt ? new Date(account.createdAt).toDateString() : '',
                following: fmt(account.followings) || '0',
                followers: fmt(account.followers) || '0',
                Posts: fmt(posts.length),
                isCompleted: account.account?.completed || false,
                isVerified: account.isVerified?.value || false,
                plan: account.isVerified?.level || 'Free',
                bannerUrl: account.banner?.url || '/images/default-banner.jpg',
                avatarUrl: account.avatar?.url || '/images/default-profile-pic.png'
            }
        };
    });

    const suggestedFromMarked = await Promise.all(suggestedAccountsPromises);
    const filteredSuggestedFromMarked = suggestedFromMarked.filter(Boolean); // filtering the nulll values...

    // getting suggestions from relations...
    // Fetch blocked account IDs
    const blockedDocs = await Block.find({ blockedByAcc: activeAcc._id, isActive: true });
    const blockedIds = blockedDocs.map(doc => doc.blockedAcc.toString());

    // generating the follow suggestions...
    const followingDocs = await follows.find({ followerId: activeAcc._id, isDeleted: false });
    const followingAccountId: string[] = followingDocs.map((followObj) => followObj.followingId.toString());

    // getting the mutual followers...
    const mutualFollowingIdPromises = followingAccountId.map(async (accountId: string) => {
        const thereFollowings = await follows.find({ followerId: accountId, isDeleted: false });
        return thereFollowings.map((followobj) => followobj.followingId.toString());
    });

    // Resolve and flatten mutual following IDs...
    const resolvedMutualFollowing = await Promise.all(mutualFollowingIdPromises);
    const flattenedMutualIds = resolvedMutualFollowing.flat();

    // getting the accounts of mutual followers...
    const mutualFriendAccounts = await Promise.all(flattenedMutualIds.map(async (accId: string) => {
        return returnAccountDataInStructure(accId);
    }));
    const filteredMutualFriendAccounts = mutualFriendAccounts.filter(acc => acc.id && !blockedIds.includes(acc.id));

    // Combine and deduplicate suggestions
    const allSuggestions = [new Set([...filteredSuggestedFromMarked, ...filteredMutualFriendAccounts])];

// sorting the array based on subscription level...
    const planOrder: Record<Plan, number> = { "Free": 0, "Pro": 1, "Creator": 2, "Enterprise": 3 };

    const accountsWithSubs = Array.from(allSuggestions).map((acc: any) => {
        const account = accounts.findOne({ username: acc.decodedHandle, 'account.status': 'ACTIVE' });
        const plan: Plan = (acc.account.plan as Plan) || 'Free';
        return { acc, plan, isVerified: acc.account?.isVerified || false };
    });

    // sorting logic...
    accountsWithSubs.sort((a, b) => {
        const aLevel = planOrder[a.plan]; 
        const bLevel = planOrder[b.plan];
        if (aLevel !== bLevel) return bLevel - aLevel; // higher subscription first...
        if (a.isVerified !== b.isVerified) return a.isVerified ? -1 : 1; // verified first...

        return 0 ;
    });

    // final sorted array...
    const finalAcc = accountsWithSubs.map(item => item.acc);
    return NextResponse.json({ success: true, posts: filteredPosts, suggestions: finalAcc }, { status: 200 });
}

export const getPostPageEssentialService = async ({ postId, username }: { postId: string, username: string }) => {
    await connectWithMongoDB(); // connecting to database...

    // extracting cookies data...
    const user = await getDecodedDataFromCookie("accessToken");
    if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST...' });
    // getting my active account...
    const activeAcc = await accounts.findOne({ userId: user.id, 'account.Active': true, 'account.status': 'ACTIVE' });
    if (!activeAcc) return NextResponse.json({ message: 'Current account not found' }, { status: 404 });

    // getting the details of main post...
    const pagePost = await Post.findOne({ _id: postId, isDeleted: false });
    if (!pagePost) {
        return NextResponse.json({ success: false, message: 'Post not found' }, { status: 404 });
    }

    const author = await accounts.findOne({ $and:[{ _id:pagePost.authorId },{ username:username }] }); // getting the page specific account
    if (!author) {
        return NextResponse.json({ success: false, message: 'Author not found' }, { status: 404 });
    }

    // Get counts from collections
    const likesCount = await likes.countDocuments({ targetEntity: postId, targetType: 'post' });
    const repostsCount = await Post.countDocuments({ originalPostId: postId, postType: 'repost', isDeleted: false });
    const commentsCount = await Post.countDocuments({ replyToPostId: postId, postType: 'comment', isDeleted: false });
    const viewStats = await viewStat.findOne({ postId: postId });
    const viewsCount = viewStats?.totalViews || 0;

    // Check user interactions with the post
    const userLiked = await likes.findOne({ accountId: activeAcc._id, targetType: 'post', targetEntity: postId });
    const userReposted = await Post.findOne({ authorId: activeAcc._id, repostId: postId, postType: 'repost', isDeleted: false });
    const userCommented = await Post.findOne({ authorId: activeAcc._id, replyToPostId: postId, postType: 'comment', isDeleted: false });
    const userBookmarked = await tagged.findOne({ accountId: activeAcc._id, taggedAs: 'bookmarked', entityId: postId });

    // Check if pinned or highlighted
    const isPinned = await tagged.findOne({ accountId: author._id, taggedAs: 'pinned', entityId: postId });
    const isHighlighted = await tagged.findOne({ accountId: author._id, taggedAs: 'highlighted', entityId: postId });

    // Check if following the post author
    const isFollowing = await follows.findOne({ followerId: activeAcc._id, followingId: author._id, isDeleted: false });

    // Get poll data if exists
    const pollData = await Poll.findOne({ authorPost: postId, isActive: true, expiry: { $gt: new Date() } });
    let poll: polltype | undefined;
    if (pollData) {
        poll = {
            question: pollData.question,
            options: pollData.options.map((opt: pollOptionType) => ({ text: opt.text, votes: opt.votes })),
            duration: pollData.duration
        };
    }

    // Get followers and following counts
    const followersCount = await follows.find({ followingId: author._id, isDeleted: false });
    const followingCount = await follows.find({ followerId: author._id, isDeleted: false });

    const postdata = {
        id: pagePost._id.toString(),
        content: pagePost.content,
        postedAt: new Date(pagePost.createdAt).toUTCString(),
        comments: commentsCount,
        reposts: repostsCount,
        likes: likesCount,
        views: viewsCount,
        mediaUrls: Array(pagePost.mediaUrls).map(urlObj => ({ url:urlObj.url , media_type:urlObj.media_type })) || [],
        hashTags: pagePost.hashTags || [],
        mentions: Array(pagePost.mentions).map((u: string) => typeof u === 'string' ? u.trim() : String(u).trim()),
        userliked: !!userLiked,
        isPinned: !!isPinned,
        isHighlighted: !!isHighlighted,
        usereposted: !!userReposted,
        usercommented: !!userCommented,
        userbookmarked: !!userBookmarked,
        username: author.name ,
        handle: `@${author.username}`,
        avatar: author.avatar.url || '/images/default-profile-pic.png',
        cover: author.banner.url || '/images/default-banner.jpg',
        bio: author.bio || '',
        isCompleted: author.account?.completed ?? false ,
        isVerified: author.isVerified?.value || false,
        plan: author.isVerified?.level || 'Free',
        followers: fmt(followersCount.length),
        following: fmt(followingCount.length),
        isFollowing: !!isFollowing,
        taggedLocation: pagePost.taggedLocation || [],
        poll: poll
    };

    
    // Helper function to return account data in structure
    async function returnAccountDataInStructure(accountId: string): Promise<userCardProp> {
        const particularAcc = await accounts.findById(accountId);
        if (!particularAcc) return {} as userCardProp ;
        
        // getting count of followers and followings...
          const postCategory = ['original','repost'] ;
        const followers = await follows.find({ followingId: particularAcc._id, isDeleted: false });
        const following = await follows.find({ followerId: particularAcc._id, isDeleted: false });
        const posts = await Post.find({ authorId:pagePost.authorId , postType: { $in:postCategory } ,isDeleted:false }) ;
        const isFollowing = await follows.exists({ followerId: activeAcc._id, followingId: particularAcc._id, isDeleted: false });
        
        return {
            id: particularAcc._id.toString(),
            decodedHandle:`@${particularAcc.username}`,
            name: particularAcc.name,
            content: particularAcc.bio,
            account: {
                name: particularAcc.name,
                handle: `@${particularAcc.username}`,
                bio: particularAcc.bio || '',
                location: {
                    text: particularAcc.location?.text || '',
                    coordinates: particularAcc.location?.coordinates || [0, 0]
                },
                website: particularAcc.website || '',
                joinDate: particularAcc.createdAt ? new Date(particularAcc.createdAt).toDateString() : '',
                following: fmt(following.length),
                followers: fmt(followers.length),
                Posts: fmt(posts.length),
                isCompleted: particularAcc.account?.completed || false,
                isVerified: particularAcc.isVerified?.value || false,
                plan: particularAcc.isVerified?.level || 'Free',
                bannerUrl: particularAcc.banner?.url || '/images/default-banner.jpg',
                avatarUrl: particularAcc.avatar?.url || '/images/default-profile-pic.png'
            },
            IsFollowing: isFollowing ? true : false
        };
    }
    
    // lets get the relevent person...
    const postAuthor = await returnAccountDataInStructure(author._id) ;

    // generating account suggestions...
    // Get the post author's followings (accounts the author follows)...
    const authorFollowingDocs = await follows.find({ followerId: author._id, isDeleted: false });
    const authorFollowingIds: string[] = authorFollowingDocs.map((followObj) => followObj.followingId.toString());

    // Get blocked account IDs to exclude
    const blockedDocs = await Block.find({ blockedByAcc: activeAcc._id, isActive: true });
    const blockedIds = blockedDocs.map(doc => doc.blockedAcc.toString());

    // Get accounts that the active user already follows (to filter them out)
    const activeUserFollowingDocs = await follows.find({ followerId: activeAcc._id, isDeleted: false });
    const activeUserFollowingIds = new Set(activeUserFollowingDocs.map(doc => doc.followingId.toString()));

    // Get mutual followers (followers of the author's followings)
    const mutualFollowingIdPromises = authorFollowingIds.map(async (accountId: string) => {
        const thereFollowings = await follows.find({ followerId: accountId, isDeleted: false });
        return thereFollowings.map((followobj) => followobj.followingId.toString());
    });

    // Resolve and flatten mutual following IDs
    const resolvedMutualFollowing = await Promise.all(mutualFollowingIdPromises);
    const flattenedMutualIds = resolvedMutualFollowing.flat();

    // Get account details for mutual friends and filter out blocked and already following
    const mutualFriendAccountsPromises = (flattenedMutualIds as string[])
        .filter((accId: string) => !activeUserFollowingIds.has(accId) && !blockedIds.includes(accId))
        .filter((accId: string, index: number, self: string[]) => self.indexOf(accId) === index) // Remove duplicates
        .slice(0, 20) // Limit to 20 suggestions
        .map(async (accId: string) => {
            return returnAccountDataInStructure(accId);
        });

    const mutualFriendAccounts = await Promise.all(mutualFriendAccountsPromises);
    const filteredMutualFriendAccounts = mutualFriendAccounts.filter((acc: userCardProp) => acc.id);

    // Also get the author's direct followers...
    const authorFollowerDocs = await follows.find({ followingId: author._id, isDeleted: false });
    const authorFollowerIds = authorFollowerDocs
        .map((doc: any) => doc.followerId.toString())
        .filter((accId: string) => !activeUserFollowingIds.has(accId) && !blockedIds.includes(accId))
        .filter((accId: string, index: number, self: string[]) => self.indexOf(accId) === index) // Remove duplicates
        .slice(0, 20); // Limit to 20 suggestions

    const authorFollowerAccountsPromises = authorFollowerIds.map(async (accId: string) => {
        return returnAccountDataInStructure(accId);
    });

    const authorFollowerAccounts = await Promise.all(authorFollowerAccountsPromises);
    const filteredAuthorFollowerAccounts = authorFollowerAccounts.filter((acc: userCardProp) => acc.id);

    // Combine both suggestion sources...
    const allSuggestionIds = new Set([...filteredMutualFriendAccounts.map((acc: userCardProp) => acc.id),...filteredAuthorFollowerAccounts.map((acc: userCardProp) => acc.id)]);

    // Get full account data for all suggestions
    const allSuggestionsPromises = Array.from(allSuggestionIds).map(async (accId) => {
        return returnAccountDataInStructure(String(accId));
    });

    const allSuggestions = await Promise.all(allSuggestionsPromises);
    const filteredSuggestions = allSuggestions.filter((acc: userCardProp) => acc.id);

    // Sort by subscription level
    type SuggestionPlan = "free" | "pro" | "creator" | "enterprise";
    const planOrder: Record<SuggestionPlan, number> = { free: 0, pro: 1, creator: 2, enterprise: 3 };

    const accountsWithSubs = await Promise.all(filteredSuggestions.map(async (acc: userCardProp) => {
        const account = await accounts.findOne({ username: acc.decodedHandle, 'account.status': 'ACTIVE' });
        const sub = account ? await subscriptions.findOne({ accountId: account._id, status: 'active' }) : null;
        return { acc, plan: (sub?.plan as SuggestionPlan) || 'free', isVerified: acc.account?.isVerified || false };
    }));

    // Sort by subscription level...
    accountsWithSubs.sort((a: { plan: SuggestionPlan; isVerified: boolean; acc: userCardProp }, b: { plan: SuggestionPlan; isVerified: boolean; acc: userCardProp }) => {
        const aLevel = planOrder[a.plan] || 0;
        const bLevel = planOrder[b.plan] || 0;
        if (aLevel !== bLevel) return bLevel - aLevel; // higher subscription first
        if (a.isVerified !== b.isVerified) return a.isVerified ? -1 : 1; // verified first
        return 0;
    });

    // Final sorted suggestions array...
    const suggestions = accountsWithSubs.map((item: { acc: userCardProp }) => item.acc);
    return NextResponse.json({ success: true, mainPost: postdata , releventAcc:postAuthor, suggestions : suggestions }, { status: 200 });
}

export const getAccountsBookmarkedAPostService = async ({ postid , page , pagesize } : { postid: string , page: number , pagesize: number }) => {
    await connectWithMongoDB() ; // establishing connection to DB...

    // extracting cookies data...
    const user = await getDecodedDataFromCookie("accessToken");
    if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST...' });
    // getting my active account...
    const activeAcc = await accounts.findOne({ userId: user.id, 'account.Active': true, 'account.status': 'ACTIVE' });
    if (!activeAcc) return NextResponse.json({ message: 'Current account not found' }, { status: 404 });

     // checking post existence...
     const postExists = await Post.findById(postid) ;
     if (!postExists) return NextResponse.json({ message:'Post not found !!' },{ status:404 }) ;

     const totalResult = await tagged.aggregate([
          { $match: { entityId: new mongoose.Types.ObjectId(postid), taggedAs: 'Bookmarked' } },
          { $group: { _id: '$accountId' } },
          { $count: 'total' }
        ]);
        const total = totalResult[0]?.total || 0; // total distinct views...
        
        // skip configuration and fetching bookmarks...
        const toSkip = ( page - 1 ) * pagesize ;
        const hasNext = toSkip + pagesize < total;

        if (total === 0)  return NextResponse.json({ message: 'likes not found !!', navdata: [] , hasNext }, { status: 200 }) ;
        

     // Helper function to return account data in structure
    async function returnAccountDataInStructure(accountId: string): Promise<userCardProp> {
        const particularAcc = await accounts.findById(accountId);
        if (!particularAcc) return {} as userCardProp ;
        
        // getting count of followers and followings...
          const postCategory = ['original','repost'] ;
        const followers = await follows.find({ followingId: particularAcc._id, isDeleted: false });
        const following = await follows.find({ followerId: particularAcc._id, isDeleted: false });
        const posts = await Post.find({ authorId:particularAcc._id , postType: { $in:postCategory } ,isDeleted:false }) ;
        const isFollowing = await follows.exists({ followerId: activeAcc._id, followingId: particularAcc._id, isDeleted: false });
        
        return {
            id: particularAcc._id.toString(),
            decodedHandle: `@${particularAcc.username}`,
            name: particularAcc.name,
            content: particularAcc.bio,
            account: {
                name: particularAcc.name,
                handle:`@${particularAcc.username}`,
                bio: particularAcc.bio || '',
                location: {
                    text: particularAcc.location?.text || '',
                    coordinates: particularAcc.location?.coordinates || [0, 0]
                },
                website: particularAcc.website || '',
                joinDate: particularAcc.createdAt ? new Date(particularAcc.createdAt).toDateString() : '',
                following: fmt(following.length),
                followers: fmt(followers.length),
                Posts: fmt(posts.length),
                isCompleted: particularAcc.account?.completed || false,
                isVerified: particularAcc.isVerified?.value || false,
                plan: particularAcc.isVerified?.level || 'Free',
                bannerUrl: particularAcc.banner?.url || '/images/default-banner.jpg',
                avatarUrl: particularAcc.avatar?.url || '/images/default-profile-pic.png'
            },
            IsFollowing: isFollowing ? true : false
        };
    }

    const taggedObjs =  await tagged.find({ $and :[{ entityId:postid },{ taggedAs:'bookmarked' }] }).skip(toSkip).limit(pagesize) ;
    const accns = await Promise.all(taggedObjs.map((obj) => { 
        return returnAccountDataInStructure(obj.accountId) ;
     }))

     return NextResponse.json({ message:'Bookmarked by accounts fetched !!' , navdata:accns , hasNext:hasNext },{ status:200 })
}

export const getExplorePostsService = async ({ hashtag , page , size } : { hashtag: string , page: number , size: number }) => {
    // extracting cookies data...
    const user = await getDecodedDataFromCookie("accessToken");
    if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST...' });
    // getting my active account...
    const activeAcc = await accounts.findOne({ userId: user.id, 'account.Active': true, 'account.status': 'ACTIVE' });
    if (!activeAcc) return NextResponse.json({ message: 'Current account not found' }, { status: 404 });

    await connectWithMongoDB() ; // connecting to database...

    const hashQuerySection = hashtag ? { hashtags: { $in: [hashtag] }} : { } ; // include hash in query only if exists...

    // getting doc total count...
    const total = await Post.countDocuments({ $and:[ hashQuerySection ,{ isDeleted: false }] });
        const skip = (page - 1) * size ;
        const hasNext = (skip + size) < total ;

    // query including the paticular hasgtag...
    const desiredPosts = await Post.find({ $and:[ hashQuerySection ,{ isDeleted: false }] })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(size)

    const formattedPosts = [];
    for (const post of desiredPosts) {
        const postOwner = await accounts.findById(post.authorId);
        if (!postOwner) continue;

        const likesCount = await likes.countDocuments({ targetEntity: post._id.toString(), targetType: 'post' });
        const repostsCount = await Post.countDocuments({ repostId: post._id.toString(), postType: 'repost', isDeleted: false });
        const commentsCount = await Post.countDocuments({ replyToPostId: post._id.toString(), postType: 'comment', isDeleted: false });
        const viewStats = await viewStat.findOne({ postId: post._id.toString() });
        const viewsCount = viewStats?.totalViews || 0;

        const userLiked = await likes.findOne({ accountId: activeAcc._id, targetEntity: post._id.toString(), targetType: 'post' });
        const userReposted = await Post.findOne({ authorId: activeAcc._id, repostId: post._id.toString(), postType: 'repost', isDeleted: false });
        const userCommented = await Post.findOne({ authorId: activeAcc._id, replyToPostId: post._id.toString(), postType: 'comment', isDeleted: false });
        const userBookmarked = await tagged.findOne({ accountId: activeAcc._id, taggedAs: 'bookmarked', entityId: post._id.toString() });

        const isPinned = await tagged.findOne({ accountId: activeAcc._id, taggedAs: 'pinned', entityId: post._id });
        const isHighlighted = await tagged.findOne({ accountId: activeAcc._id, taggedAs: 'highlighted', entityId: post._id });

        const isFollowing = await follows.findOne({ followerId: activeAcc._id, followingId: postOwner._id, isDeleted: false });

        let poll = undefined;
        const pollData = await Poll.findOne({ authorPost: post._id, isActive: true, expiry: { $gt: new Date() } });
        if (pollData) {
            poll = {
                question: pollData.question,
                options: pollData.options.map((opt: any) => ({ text: opt.text, votes: opt.votes })),
                duration: pollData.duration
            };
        }

        formattedPosts.push({
            id: post._id.toString(),
            postId: post._id.toString(),
            avatar: postOwner.avatar?.url ,
            username: postOwner.name,
            handle: `@${postOwner.username}`,
            bio: postOwner.bio ,
            timestamp: new Date(post.createdAt).toUTCString(),
            content: post.content,
            media: Array(post.mediaUrls)?.map((urlObj) => ({ url: urlObj.url, media_type: urlObj.media_type })),
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
            isCompleted: postOwner.account?.completed ,
            isVerified: postOwner.isVerified?.value ,
            plan: postOwner.isVerified?.level ,
            followers: fmt(await follows.countDocuments({ followingId: postOwner._id, isDeleted: false })),
            following: fmt(await follows.countDocuments({ followerId: postOwner._id, isDeleted: false })),
            hashTags: post.hashTags ,
            mentions: Array(post.mentions).map((u: any) => typeof u === 'string' ? u.trim() : u.toString().trim()),
            isFollowing: !!isFollowing,
            taggedLocation: post.taggedLocation || [],
            poll
        });
    }

// arranging posts with decreasing order of subscription plan...
    const planArrange : Record<Plan,number> = { "Free": 0 , "Pro": 1 , "Creator": 2 , "Enterprise": 3 } ;

    const aarangedViaPlan = formattedPosts.sort((postA,postB) => {
        const planA: Plan = postA.plan ;
        const planB: Plan = postB.plan ;
        const planAValue = planArrange[planA];
        const planBValue = planArrange[planB];
        if (planAValue !== planBValue) return planBValue - planAValue ; // higher subscription first...
        if (postA.isVerified !== postB.isVerified) return postA.isVerified ? -1 : 1 ; // verified first...
        return 0 ;
    })

    return NextResponse.json({ success: true, explore:aarangedViaPlan , hasNext }, { status: 200 });
}
