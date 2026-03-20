import { connectWithMongoDB } from "../dbConnection";
import { NextResponse } from "next/server";
import accounts from "../models/accounts";
import mongoose from "mongoose";
import { getDecodedDataFromCookie } from "@/lib/cookiehandler";
import Views from "../models/views";
import viewStat from "../models/viewstat";
import Post from "../models/posts";
import follows from "../models/follows";
import { fmt } from "@/lib/utils";
import { userCardProp } from "./user";

export const trackingPostViewService = async ( postid: string, fromPage: string, ipHash?: string, userAgentHash?: string ) => {
  await connectWithMongoDB();

  // getting credentials from cookies...
  const user = await getDecodedDataFromCookie("accessToken");
  if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST...' });
      
  // getting the active account...
  const activeAcc = await accounts.findOne({ userId: user.id , 'account.Active':true , 'account.status':'ACTIVE' });
  if (!activeAcc) return NextResponse.json({ message: 'Current account not found' }, { status: 404 });

  // Check for duplicate view in last 24 hrs...
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000) ;
  const postdetails = await Post.findById(postid) ;

  // if viewing my own post...
  if (postdetails.authorId == activeAcc._id) return ;

  let duplicateQuery: any = { postId: postid , createdAt: { $gte: twentyFourHoursAgo } };

  // only authenticated accounts can view...
  if (activeAcc._id && ipHash) {
    duplicateQuery.viewerId = activeAcc._id;
    duplicateQuery.ipHash = ipHash;
  }

  // Only check for duplicates if we have identifying information
  let isDuplicate = false ;
  if (duplicateQuery && (activeAcc._id || ipHash)) {
    const existingView = await Views.findOne(duplicateQuery);
    if (existingView)  isDuplicate = true ;
    
  }

  // if duplicate, still updating viewStat without new view record...
  if (!isDuplicate) {
    // Create new view event...
    await Views.create({
      postId: postid,
      viewerId: activeAcc._id ,
      ipHash: ipHash || "anonymous",
      userAgentHash: userAgentHash || "anonymous",
      source: fromPage ,
      isQualified: !activeAcc._id ? false : true, // Only qualified if loggedin , in architecture always... 
    });
  }

  // Update view statistics...
  await viewStat.findOneAndUpdate( { postId: postid },{ $inc: { totalViews: 1 } , $set: { lastUpdatedAt: new Date() } },{ upsert: true, new: true }
);

};

export const getAllViewsOfPostService = async ({ postid , page , pagesize } : { postid: string , page: number , pagesize: number }) => {
  await connectWithMongoDB() ;

  // getting credentials from cookies...
  const user = await getDecodedDataFromCookie("accessToken");
  if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST...' });
      
  // getting the active account...
  const activeAcc = await accounts.findOne({ userId: user.id , 'account.Active':true , 'account.status':'ACTIVE' });
  if (!activeAcc) return NextResponse.json({ message: 'Current account not found' }, { status: 404 });

  // Check if post exists
  const postdetails = await Post.findById(postid);
  if (!postdetails) return NextResponse.json({ message: 'Post not found' }, { status: 404 });

  // Get total count of distinct qualified viewers
  const totalResult = await Views.aggregate([
    { $match: { postId: new mongoose.Types.ObjectId(postid), isQualified: true } },
    { $group: { _id: '$viewerId' } },
    { $count: 'total' }
  ]);
  const total = totalResult[0]?.total || 0; // total distinct views...

  // Pagination
  const skip = (page - 1) * pagesize;
  const hasNext = skip + pagesize < total;

  if (total === 0)  return NextResponse.json({ message: 'likes not found !!', navdata: [] , hasNext}, { status: 200 });


  // Get paginated distinct viewerIds
  const viewerDocs = await Views.find({ postId: new mongoose.Types.ObjectId(postid), isQualified: true }).skip(skip).limit(pagesize).select('viewerId').lean();
  const viewerIds = viewerDocs.map(doc => doc.viewerId);

  // Batch fetch accounts and compute counts - single queries per type
  const accountsData = await accounts.find({ _id: { $in: viewerIds } }).lean();

  const accountMap = new Map();
  accountsData.forEach(acc => accountMap.set(acc._id, acc));
  
  // Is following batch lookup
  const isFollowingDocs = await follows.find({ followerId: activeAcc._id, followingId: { $in: viewerIds }, isDeleted: false }).lean();
  const isFollowingMap = new Set(isFollowingDocs.map(doc => doc.followingId.toString()));

  // Map to userCardProp...
  const navdata = viewerIds.map( async (id) => {
    const acc = accountMap.get(id);
    if (!acc) return {} ;

    // follower , following and posts count...
    const followersCount = await follows.countDocuments({ followingId: id , isDeleted: false });
    const followingCount = await follows.countDocuments({ followerId: id, isDeleted: false  });
    const postsCount = await Post.countDocuments({ authorId: id, postType: { $in: ['original', 'repost'] },isDeleted: false });
    const isFollowing = isFollowingMap.has(id);

    return {
      id,
      decodedHandle: '@' + acc.username,
      name: acc.name,
      content: acc.bio || '',
      account: {
        name: acc.name,
        handle: '@'+acc.username,
        bio: acc.bio || '',
        location: {
          text: acc.location?.text || '',
          coordinates: acc.location?.coordinates || [0, 0]
        },
        website: acc.website || '',
        joinDate: acc.createdAt ? new Date(acc.createdAt).toISOString().split('T')[0] : '',
        following: fmt(followingCount),
        followers: fmt(followersCount),
        Posts: fmt(postsCount),
        isCompleted: acc.account?.completed || false,
        isVerified: acc.isVerified?.value || false,
        plan: acc.isVerified?.level || 'Free',
        bannerUrl: acc.banner?.url || '/images/default-banner.jpg',
        avatarUrl: acc.avatar?.url || '/images/default-profile-pic.png'
      },
      IsFollowing: isFollowing
    };
  });

  return NextResponse.json({  message: 'views fetched !!', navdata , hasNext:hasNext }, { status: 200 });

};
