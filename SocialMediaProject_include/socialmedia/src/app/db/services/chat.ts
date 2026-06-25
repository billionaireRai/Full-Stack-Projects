import { NextResponse } from "next/server";
import accounts from "../models/accounts";
import { connectWithMongoDB } from "../dbConnection";
import { getDecodedDataFromCookie } from "@/lib/cookiehandler";
import follows from "../models/follows";
import Post from "../models/posts";
import conversation from "../models/conversation";
import { fmt } from "@/lib/utils";
import messages from "../models/messages";
import { mediaType } from "@/components/mediapopmodal";
import { userCardProp } from "./user";

export const getAttachmentsOfChatService = async (targetHandle:string) => {
    await connectWithMongoDB() ; // connecting with mongodb...
    
    const user = await getDecodedDataFromCookie("accessToken");
    if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST...' });
        
    const activeAcc = await accounts.findOne({ userId: user.id , 'account.Active':true });
    if (!activeAcc) return NextResponse.json({ message: 'Current account not found' }, { status: 404 });

    const targetAcc = await accounts.findOne({ username:targetHandle.substring(1) , 'account.status':{ $nin:['DELETED','SUSPENDED']} });
    // getting all the images...
    const Conversation = await conversation.findOne({ participants:{ $in:[activeAcc._id,targetAcc._id] } , deletedBy:{ $nin:[activeAcc._id]} });

    const Messages = await messages.find(
      { 
        conversationId:Conversation._id,
        $or:[{ fromId:activeAcc._id , toId:targetAcc._id },{ fromId:targetAcc._id , toId:activeAcc._id}],
        deletedFor:{ $nin:[activeAcc._id] }
      }
    )

    
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
    // getting all media attachments...
    const attachments = Messages.flatMap((message) => (
        (Array.isArray(message.mediaUrls) && message.mediaUrls.length > 0 ) ? message.mediaUrls : []).map((media: mediaType) => ({
            url: media.url,
            media_type: media.media_type
      }))
    );

    // getting mentioned account...
    const mentionHandle = Array.from(new Set(Messages.flatMap((message) => Array.isArray(message.mentions) ? message.mentions : [])
    )).slice(0, 50); // safety cap to avoid huge fan-out

    const mentionAccounts = await accounts.find(
        {
           username: { $in: mentionHandle },
           'account.status': { $nin: ['DELETED', 'SUSPENDED'] },
        }
    );
    const mentionAccIds = mentionAccounts.map((acc) => acc._id); // getting ids for mentioned accounts...

    // getting structured data...
    const mentions = await Promise.all(mentionAccIds.map((accountId) => returnAccountDataInStructure(accountId)));

    return { attachments , mentions };
}