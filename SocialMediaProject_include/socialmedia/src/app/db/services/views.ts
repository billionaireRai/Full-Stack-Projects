import { connectWithMongoDB } from "../dbConnection";
import { NextResponse } from "next/server";
import accounts from "../models/accounts";
import { getDecodedDataFromCookie } from "@/lib/cookiehandler";
import Views from "../models/views";
import viewStat from "../models/viewstat";
import Post from "../models/posts";

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
