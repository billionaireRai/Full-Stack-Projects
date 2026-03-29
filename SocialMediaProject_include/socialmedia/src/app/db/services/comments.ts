import { connectWithMongoDB } from "../dbConnection";
import { getDecodedDataFromCookie } from "@/lib/cookiehandler";
import { NextResponse } from "next/server";
import accounts from "../models/accounts";
import Post from "../models/posts";
import mongoose from "mongoose";
import { fmt } from "@/lib/utils";
import likes from "../models/likes";
import viewStat from "../models/viewstat";
import tagged from "../models/tagged";
import follows from "../models/follows";

export const getCommentsOfAPostService = async ({ postid , page , pagesize } : { postid: string , page: number , pagesize: number }) => { 
    await connectWithMongoDB() ; // establishing connection to DB...

    const user = await getDecodedDataFromCookie("accessToken");
    if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST...' });
    
    const myAccount = await accounts.findOne({ userId: user.id , 'account.Active':true});
    if (!myAccount) return NextResponse.json({ message: 'Your account not found' }, { status: 404 });

    // getting the main post...
    const post = await Post.findById(postid) ;
    if (!post) return NextResponse.json({ message:'Post not found' },{ status:404 });

    
    // fetching comment post...
    const totalResult = await Post.aggregate([
        { $match: { replyToPostId:postid ,postType:'comment' , isDeleted:false }},
        { $group: { _id: '$authorId' } },
        { $count: 'total' }
    ]);
    const total = totalResult[0]?.total || 0; // total distinct views...

    // Pagination
    const skip = (page - 1) * pagesize;
    const hasNext = total > skip + pagesize;

    if (total === 0) return NextResponse.json({ message: 'comments not found !!', comments: [], hasNext }, { status: 200 });

    // getting comment posts...
    const commentPost = await Post.find({ replyToPostId: postid, postType: 'comment', isDeleted: false })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pagesize)
        .lean();

    const comments = await Promise.all(commentPost.map(async (comment) => {
        // Fetch nested comments, reposts, likes counts
        const commentsOnIt = await Post.find({ replyToPostId: comment._id, postType: 'comment', isDeleted: false }).lean();
        const repostsData = await Post.find({ repostId: comment._id, postType: 'repost', isDeleted: false }).lean();
        const likesData = await likes.find({ targetEntity: comment._id, targetType: 'comment' }).lean();

        // getting the cached views...
        const views = await viewStat.findOne({ postId: comment._id });
        const viewsCount = views?.totalViews || 0;

        // Fetch author account...
        const authorAccount = await accounts.findOne({ _id: comment.authorId, 'account.status': 'ACTIVE' }) ;

        if (!authorAccount) return null ; // Skip invalid authors...
        
        const followersOfAuthor = await follows.find({ followingId : authorAccount._id , isDeleted:false })
        const followingOfAuthor = await follows.find({ followerId : authorAccount._id , isDeleted:false })

        // User interactions...
        const userId = myAccount._id;
        const userLiked = await likes.exists({ accountId: userId, targetEntity: comment._id, targetType: 'comment' });
        const userReposted = await Post.exists({ authorId: userId, repostId: comment._id, postType: 'repost', isDeleted: false });
        const userCommented = commentsOnIt.some(c => c.authorId.toString() === userId.toString());
        const userBookmarked = await tagged.exists({ entityId:comment._id , taggedAs:'bookmarked', accountId:userId });

        const isFollowing = await follows.exists({ followerId: userId , followingId: comment.authorId.toString() , isDeleted:false });
        const isPinned = await tagged.exists({ entityId:comment._id , taggedAs:'pinned', accountId:userId });
        const isHighlighted = await tagged.exists({ entityId:comment._id , taggedAs:'highlighted' , accountId:userId });

        return {
            id: comment._id,
            content: comment.content || '',
            postedAt: new Date(comment.createdAt).toUTCString(),
            comments: fmt(commentsOnIt.length),
            reposts: fmt(repostsData.length),
            likes: fmt(likesData.length),
            views: fmt(viewsCount),
            mediaUrls: Array(comment.mediaUrls).map(urlObj => ({ url:urlObj.url , media_type:urlObj.media_type })) || [],
            hashTags: comment.hashtags || [],
            mentions: comment.mentions ,
            userliked: !!userLiked,
            usereposted: !!userReposted,
            usercommented: !!userCommented,
            userbookmarked: userBookmarked,
            username: authorAccount.name,
            handle: `@${authorAccount.username}`,
            avatar: authorAccount.avatar?.url || 'https://picsum.photos/seed/default/200/200',
            cover: authorAccount.banner?.url || 'https://picsum.photos/seed/cover-default/1500/500',
            bio: authorAccount.bio || '',
            isVerified: authorAccount.isVerified?.value || false,
            plan: authorAccount.isVerified?.level || 'Free',
            followers: fmt(followersOfAuthor.length),
            following: fmt(followingOfAuthor.length),
            isFollowing: isFollowing,
            isPinned: isPinned,
            userBookmarked: userBookmarked,
            isHighlighted: isHighlighted ,
            taggedLocation: comment.taggedLocation || undefined
        };
    }));

    return NextResponse.json({ message:'Comments fechted... ', comments , hasNext },{ status:200 });
}


export const getRepliesOnPostCommentService = async ({ postid , page , pagesize } : { postid: string , page: number , pagesize: number }) => { 
    // getting the cookies data...
    const user = await getDecodedDataFromCookie("accessToken");
    if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST...' });
    
    const myAccount = await accounts.findOne({ userId: user.id , 'account.Active':true });
    if (!myAccount) return NextResponse.json({ message: 'Your account not found' }, { status: 404 });

    await connectWithMongoDB() ; // connecting to DB...

    const consideredPost = await Post.findById(postid) ; // getting the main post...
    if (!consideredPost) return NextResponse.json({ message:'Post not found' },{ status:404 });

    
    const comments = await Post.find({ $and:[{ replyToPostId:postid },{ postType:'comment' },{ isDeleted:false }] });
    const commentIds = comments.map(comment => comment._id) ;
    
    const replies = await Post.aggregate([
        { $match: { replyToPostId:{ $in:commentIds } , postType:'comment' , isDeleted:false }},
        { $group: { _id: '$authorId' } },
        { $count: 'total' }
    ]);
    
    const total = replies[0]?.total || 0; // total distinct replies....

    // Pagination variables...
    const skip = (page - 1) * pagesize;
    const hasNext = total > skip + pagesize;

    if (total === 0) return NextResponse.json({ message: 'replies not found !!', replies: [], hasNext }, { status: 200 });
    
    // getting comment posts...
    const repliesOnComment = await Post.find({ replyToPostId: { $in:commentIds }, postType: 'comment', isDeleted: false })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pagesize)
        .lean();

    const repliedData = await Promise.all(repliesOnComment.map(async (reply) => { 

        // post and authors required...
        const commentPost = await Post.findById(reply.replyToPostId) ;
        const commentAuthor = await accounts.findById(commentPost.authorId) ;
        const replyAuthor = await accounts.findById(reply.authorId) ;

        if (!commentPost || !commentAuthor || !replyAuthor) return NextResponse.json({ message:'Some post OR author missing' },{ status:404 });

        // Fetch nested data for reply...
        const nestedComments = await Post.find({ replyToPostId: reply._id, postType: 'comment', isDeleted: false }).lean();
        const nestedReposts = await Post.find({ repostId: reply._id, postType: 'repost', isDeleted: false }).lean();
        const nestedLikes = await likes.find({ targetEntity: reply._id, targetType: 'comment' }).lean();
        const nestedViews = await viewStat.findOne({ postId: reply._id });
        const nestedViewsCount = nestedViews?.totalViews || 0;

        // User interactions for reply
        const userId = myAccount._id;
        const userLikedReply = await likes.exists({ accountId: userId, targetEntity: reply._id, targetType: 'comment' });
        const userRepostedReply = await Post.exists({ authorId: userId, repostId: reply._id, postType: 'repost', isDeleted: false });
        const userCommentedReply = nestedComments.some(c => c.authorId.toString() === userId.toString());
        const userBookmarkedReply = await tagged.exists({ entityId: reply._id, taggedAs: 'bookmarked', accountId: userId });
        const replyIsFollowing = await follows.exists({ followerId: userId, followingId: reply.authorId.toString(), isDeleted: false });
        const replyIsPinned = await tagged.exists({ entityId: reply._id, taggedAs: 'pinned', accountId: userId });
        const replyIsHighlighted = await tagged.exists({ entityId: reply._id, taggedAs: 'highlighted', accountId: userId });

        // comment post data...
        const commentFollowers = await follows.find({ followingId: commentAuthor._id, isDeleted: false });
        const commentFollowing = await follows.find({ followerId: commentAuthor._id, isDeleted: false });
        const commentUserLiked = await likes.exists({ accountId: userId, targetEntity: commentPost._id, targetType: 'comment' });
        const commentUserReposted = await Post.exists({ authorId: userId, repostId: commentPost._id, postType: 'repost', isDeleted: false });
        const commentUserCommented = await Post.exists({ replyToPostId: commentPost._id, authorId: userId, postType: 'comment', isDeleted: false });
        const commentUserBookmarked = await tagged.exists({ entityId: commentPost._id, taggedAs: 'bookmarked', accountId: userId });
        const commentIsFollowing = await follows.exists({ followerId: userId, followingId: commentPost.authorId.toString(), isDeleted: false });
        const commentIsPinned = await tagged.exists({ entityId: commentPost._id, taggedAs: 'pinned', accountId: userId });
        const commentIsHighlighted = await tagged.exists({ entityId: commentPost._id, taggedAs: 'highlighted', accountId: userId });

        return {
          id: reply._id,
          postId: commentPost._id,
          postAuthorInfo: {
            name: commentAuthor.name,
            username: `@${commentAuthor.username}`,
            followers: fmt(commentFollowers.length),
            following: fmt(commentFollowing.length),
            bio: commentAuthor.bio || '',
            isVerified: commentAuthor.isVerified?.value || false,
            plan: commentAuthor.isVerified?.level || 'Free',
            isFollowing: !!commentIsFollowing,
            isPinned: !!commentIsPinned,
            isHighlighted: !!commentIsHighlighted,
            likes: fmt(await likes.countDocuments({ targetEntity: commentPost._id, targetType: 'comment' })),
            reposts: fmt(await Post.countDocuments({ repostId: commentPost._id, postType: 'repost', isDeleted: false })),
            replies: fmt(await Post.countDocuments({ replyToPostId: commentPost._id, postType: 'comment', isDeleted: false })),
            views: fmt(await viewStat.countDocuments({ postId: commentPost._id })),
            userliked: !!commentUserLiked,
            usereposted: !!commentUserReposted,
            usercommented: !!commentUserCommented,
            userbookmarked: !!commentUserBookmarked,
            avatar: commentAuthor.avatar?.url || 'https://picsum.photos/seed/default/200/200',
            banner: commentAuthor.banner?.url || 'https://picsum.photos/seed/cover-default/1500/500',
            media: Array(commentPost.mediaUrls).map(urlObj => ({ url: urlObj.url, media_type: urlObj.media_type })) || [],
            mentions: commentPost.mentions || [],
            hashTags: commentPost.hashtags || [],
            content: commentPost.content || '',
            postedAt: new Date(commentPost.createdAt).toUTCString()
          },
          commentedText: reply.content || '',
          name: replyAuthor.name,
          username: `@${replyAuthor.username}`,
          followers: fmt(await follows.countDocuments({ followingId: replyAuthor._id, isDeleted: false })),
          following: fmt(await follows.countDocuments({ followerId: replyAuthor._id, isDeleted: false })),
          bio: replyAuthor.bio || '',
          isFollowing:!!replyIsFollowing,
          isVerified: replyAuthor.isVerified?.value || false,
          plan: replyAuthor.isVerified?.level || 'Free',
          avatar: replyAuthor.avatar?.url || 'https://picsum.photos/seed/default/200/200',
          banner: replyAuthor.banner?.url || 'https://picsum.photos/seed/cover-default/1500/500',
          media: Array(reply.mediaUrls).map(urlObj => ({ url: urlObj.url, media_type: urlObj.media_type })) || [],
          mentions: reply.mentions || [],
          hashTags: reply.hashtags || [],
          repliedAt: new Date(reply.createdAt).toUTCString(),
          comments: fmt(nestedComments.length),
          reposts: fmt(nestedReposts.length),
          likes: fmt(nestedLikes.length),
          isPinned: !!replyIsPinned,
          isHighlighted: !!replyIsHighlighted,
          views: fmt(nestedViewsCount),
          userliked: !!userLikedReply,
          usereposted: !!userRepostedReply,
          usercommented: !!userCommentedReply,
          userbookmarked: !!userBookmarkedReply
        }
    }).filter(Boolean)); // Filter out nulls

    return NextResponse.json({ message: 'Replies fetched...', replies: repliedData, hasNext }, { status: 200 });
}
