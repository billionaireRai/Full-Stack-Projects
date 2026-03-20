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

    if (total === 0) return NextResponse.json({ message: 'comments not found !!', comments: [], hasNext, total }, { status: 200 });

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
            mediaUrls: comment.mediaUrls || [],
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
            followers: fmt(authorAccount.followers || 0),
            following: fmt(authorAccount.followings || 0),
            isFollowing: isFollowing,
            isPinned: isPinned,
            userBookmarked: userBookmarked,
            isHighlighted: isHighlighted ,
            taggedLocation: comment.taggedLocation || undefined
        };
    }));

    return NextResponse.json({ message:'Comments fechted... ', comments , hasNext },{ status:200 });
}

// comment structure...
//  {
//       id: 'cmt-456',
//       content: 'This looks stunning! Great capture @sarah_nature #photography #sunsetvibes',
//       postedAt: 'Oct 3, 2023 2:15 PM',
//       comments: 3,
//       reposts: 12,
//       likes: 67,
//       views: 1450,
//       mediaUrls: [{ url: 'https://picsum.photos/seed/comment3/450/300', media_type: 'image' }],
//       hashTags: ['photography', 'sunsetvibes', 'naturelove'],
//       mentions: ['sarah_nature'],
//       userliked: true,
//       usereposted: false,
//       usercommented: false,
//       userbookmarked: false,
//       username: 'Mike Photographer',
//       handle: '@mike_photo',
//       avatar: 'https://picsum.photos/seed/avatar3/200/200',
//       cover: 'https://picsum.photos/seed/cover3/1500/500',
//       bio: 'Professional photographer capturing moments in nature 🌅',
//       isVerified: true,
//       plan:'Pro',
//       followers: '25.8k',
//       following: '1.2k',
//       isFollowing:true ,
//       isPinned:false ,
//       userBookmarked:true,
//       isHighlighted:false,
//       poll:undefined,
//       taggedLocation:undefined
//     }

// replies structure...
// {
//       id: "4",
//       postId: '4224',
//       postAuthorInfo: {
//         name: "Sarah Tech",
//         username: "@sarah_dev",
//         followers:'120k',
//         following:'89',
//         bio:'Full-stack developer | Open source contributor',
//         isVerified: false,
//         plan:'Free',
//         isFollowing: false,
//         isPinned: false,
//         isHighlighted: false,
//         likes: 123,
//         reposts: 45,
//         replies: 12,
//         views: 1000,
//         shares: 23,
//         userliked: false,
//         usereposted: false,
//         usercommented: true,
//         userbookmarked: false,
//         avatar: "/images/default-profile-pic.png",
//         banner:'https://picsum.photos/seed/cover-sarah/1500/500',
//         media: [{url: 'https://picsum.photos/seed/tutorial/450/300', media_type: 'image'}],
//         mentions:['techcommunity'],
//         hashTags:['Coding','JavaScript','React'],
//         content: "Check out my latest tutorial on building scalable React applications! 🚀 #NextJS #Development",
//         postedAt: "5d ago"
//       },
//       commentedText: "Great tutorial! Really helped me understand the concepts better. 👍 Thanks @sarah_dev #React #Tutorial",
//       name: "James Clear",
//       username: "@jamesclear__",
//       followers:'120k',
//       following:'89',
//       bio:'A CEO, founder of multiple tech companies... Building the future of tech.',
//       isVerified: true,
//       plan:'Pro',
//       avatar: "https://picsum.photos/seed/james/200/200",
//       banner:'https://picsum.photos/seed/banner-james/1500/500',
//       media: [{url: 'https://picsum.photos/seed/comment/450/300', media_type: 'image'}],
//       mentions:['sarah_dev'],
//       hashTags:['React','Tutorial','Development'],
//       repliedAt: "4d ago",
//       comments: 56,
//       reposts: 89,
//       likes: 456,
//       isPinned:false,
//       isHighlighted:false,
//       views: 1200,
//       userliked:false,
//       usereposted:true,
//       usercommented:false,
//       userbookmarked:true
//     }