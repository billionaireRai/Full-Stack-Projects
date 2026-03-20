import { connectWithMongoDB } from "../dbConnection";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { userCardProp } from "./user";
import { getDecodedDataFromCookie } from "@/lib/cookiehandler";
import { fmt } from "@/lib/utils";
import accounts from "../models/accounts";
import follows from "../models/follows";
import likes from "../models/likes";
import Post from "../models/posts";

export const getAllTheLikesOfPostService = async ({ postid , page , pagesize } : { postid: string , page: number , pagesize: number }) => { 
    await connectWithMongoDB() ; // connecting to database...

    // getting credentials from cookies...
    const user = await getDecodedDataFromCookie("accessToken");
    if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST...' });
          
    // getting the active account...
    const activeAcc = await accounts.findOne({ userId: user.id , 'account.Active':true , 'account.status':'ACTIVE' });
    if (!activeAcc) return NextResponse.json({ message: 'Current account not found' }, { status: 404 });

    // checking post existence...
    const postExists = await Post.findById(postid) ;
    if (!postExists) return NextResponse.json({ message:'Post not found !!' },{ status:404 }) ;

    const totalResult = await likes.aggregate([
      { $match: { targetEntity: new mongoose.Types.ObjectId(postid), targetType: 'Post' } },
      { $group: { _id: '$accountId' } },
      { $count: 'total' }
    ]);
    const total = totalResult[0]?.total || 0; // total distinct views...
    
    // Pagination related values...
    const skip = (page - 1) * pagesize ; 
    const hasNext = skip + pagesize < total ;
    
    if (total === 0)  return NextResponse.json({ message: 'likes not found !!', navdata: [] , hasNext }, { status: 200 }) ;
    

    // getting the structured data...
    const likeObjs = await likes.find({ $and:[{ targetEntity:postid },{ targetType:'Post' }] }).skip(skip).limit(pagesize) ;
    const likesByAccIds = likeObjs.map( like => like.accountId ) ;

    async function returnAccountDataInStructure(accountId: string): Promise<userCardProp> {
         const particularAcc = await accounts.findById(accountId);
         if (!particularAcc) return {}  ;
            
         // getting count of followers and followings...
        const postCategory = ['original','repost'] ;
        const followers = await follows.find({ followingId: particularAcc._id, isDeleted: false });
        const following = await follows.find({ followerId: particularAcc._id, isDeleted: false });
        const posts = await Post.find({ authorId:particularAcc._id , postType: { $in:postCategory } ,isDeleted:false }) ;
        const isFollowing = await follows.exists({ followerId: activeAcc._id, followingId: particularAcc._id, isDeleted: false });
            
         return {
             id: particularAcc._id.toString(),
             decodedHandle: '@'+particularAcc.username,
             name: particularAcc.name,
             content: particularAcc.bio,
             account: {
                 name: particularAcc.name,
                 handle:'@'+particularAcc.username,
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

    const navdetails = await Promise.all(likesByAccIds.map((accid) => { 
        return returnAccountDataInStructure(accid);
     }))

     return NextResponse.json({ message:"likes fetched !!" , navdata:navdetails , hasNext:hasNext },{ status:200 }) ;
}