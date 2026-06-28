import { NextResponse } from "next/server";
import accounts from "../models/accounts";
import { connectWithMongoDB } from "../dbConnection";
import { getDecodedDataFromCookie } from "@/lib/cookiehandler";
import follows from "../models/follows";
import Post from "../models/posts";
import conversation from "../models/conversation";
import { fmt } from "@/lib/utils";
import messages from "../models/messages";
import Presense from "../models/presense";
import { mediaType } from "@/components/mediapopmodal";
import { userCardProp } from "./user";
import { infoForChatCard } from "@/components/chataccountcard";
import Mutes from "../models/mute";
import { EncryptedMessage } from "@/lib/encryption";

interface messageCreationPayload {
  conversationId:string;
  encryptedMessage:EncryptedMessage;
  mediaFiles?: File[];
  mentions?: string[];
};

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

export const muteChatService = async (chat:infoForChatCard) => {
    await connectWithMongoDB() ; // connecting with mongodb...
    
    const user = await getDecodedDataFromCookie("accessToken");
    if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST..'});
        
    const activeAcc = await accounts.findOne({ userId: user.id , 'account.Active':true });
    if (!activeAcc) return NextResponse.json({ message: 'Current account not found' }, { status: 404 });

    const otherAcc = await accounts.findOne({ username:chat.handle.substring(1) , 'account.status':{ $nin:['DELETED','SUSPENDED']} });
    
    // getting the mute doc...
    const muteExists = await Mutes.exists({ mutedByAcc:activeAcc._id , mutedAcc:otherAcc._id , source:'chat' , isActive:true });

    if (!muteExists) {
        await Mutes.create({ mutedByAcc:activeAcc._id , mutedAcc:otherAcc._id , source:'chat' });
    } else {
        await Mutes.findOneAndUpdate({ mutedByAcc:activeAcc._id , mutedAcc:otherAcc._id , source:'chat' , isActive:true },{ isActive:false });
    }
}

export const pinChatService = async (chat:infoForChatCard) => {
    await connectWithMongoDB() ; // connecting with mongodb...
    
    const user = await getDecodedDataFromCookie("accessToken");
    if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST..'});
        
    const activeAcc = await accounts.findOne({ userId: user.id , 'account.Active':true });
    if (!activeAcc) return NextResponse.json({ message: 'Current account not found' }, { status: 404 });

    const targetAcc = await accounts.findOne({ username:chat.handle.substring(1) , 'account.status':{ $nin:['DELETED','SUSPENDED']} });
    // getting all the images...

    const Conversation = await conversation.findOne({ participants:{ $in:[activeAcc._id,targetAcc._id] } , deletedBy:{ $nin:[activeAcc._id]} });

    const alreadyExists = Array(Conversation.pinnedBy).includes(activeAcc._id); // checking pinned stated for active account...

    await conversation.findOneAndUpdate({ _id: Conversation._id },
        alreadyExists ? { $pull: { pinnedBy: activeAcc._id } } : { $addToSet: { pinnedBy: activeAcc._id } }
    );

}

export const clearChatHistoryService = async (chatid:string) => {
    await connectWithMongoDB() ; // connecting with mongodb...
    
    const user = await getDecodedDataFromCookie("accessToken");
    if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST..'});
        
    const activeAcc = await accounts.findOne({ userId: user.id , 'account.Active':true });
    if (!activeAcc) return NextResponse.json({ message: 'Current account not found' }, { status: 404 });

    const Conversation = await conversation.findOne({ _id:chatid , deletedBy:{ $nin:[activeAcc._id]} });

    // updating all message between two accounts...
    await messages.updateMany({ conversationId:Conversation._id },{ $addToSet:{ deletedFor:activeAcc._id }});
}

export const messageCreationService = async (data:messageCreationPayload) => {
    await connectWithMongoDB() ; // connecting with mongodb...
    
    const user = await getDecodedDataFromCookie("accessToken");
    if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST..'});
        
    const activeAcc = await accounts.findOne({ userId: user.id , 'account.Active':true });
    if (!activeAcc) return NextResponse.json({ message: 'Current account not found' }, { status: 404 });

    const { conversationId , encryptedMessage , mediaFiles , mentions } = data ;

    
    const Conversation = await conversation.findOne(
        { _id:conversationId , participants:{ $in:[activeAcc._id] } , deletedBy:{ $nin:[activeAcc._id]} }
    );
    
    const [ withAccId ] = Conversation.participants.filter((accid:string) => accid !== (activeAcc._id));
    
    const presenseState = await Presense.findOne({ accountId:withAccId , onlineStatus:'online' }) ; // getting presense state of for acc...

    await messages.create({
        fromId:activeAcc._id,
        toId:withAccId,
        conversationId,
        encryptedMsg: encryptedMessage.cipherText,
        iv: encryptedMessage.iv ,
        senderEncryptedKey: encryptedMessage.senderEncryptedKey,
        receiverEncryptedKey: encryptedMessage.receiverEncryptedKey ,
        algorithm: encryptedMessage.algorithm ,
        mentions: mentions?.map(mention => mention.substring(1)),
        status: 'sent',
    });
    
    return presenseState ;
}