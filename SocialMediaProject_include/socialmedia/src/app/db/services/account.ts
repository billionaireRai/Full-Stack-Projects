import { connectWithMongoDB } from "../dbConnection";
import { NextResponse } from "next/server";
import { userCardProp } from "./user";
import follows from "../models/follows";
import { getDecodedDataFromCookie } from "@/lib/cookiehandler";
import Post from "../models/posts";
import { fmt } from "./user";
import accounts from "../models/accounts";

export const gettingAccountService = async (text:string) => {

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
    await connectWithMongoDB() ; // connecting to db...
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
