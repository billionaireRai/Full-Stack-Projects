import accounts from "../models/accounts";
import conversation from "../models/conversation";
import { connectWithMongoDB } from "../dbConnection";
import { NextResponse } from "next/server";
import { getDecodedDataFromCookie } from "@/lib/cookiehandler";
import messages from "../models/messages";
import { userCardProp } from "./user";
import Block from "../models/blocked";
import { getDevicePublicIP } from "@/lib/pairedkeys";
import { infoForChatCard } from "@/components/chataccountcard";
import pubkeys from "../models/pubkeys";

export const getConversationsService = async () => {
    await connectWithMongoDB() ;
    
    const user = await getDecodedDataFromCookie("accessToken");
    if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST...' });
    
    const activeAcc = await accounts.findOne({ userId: user.id , 'account.Active':true });
    if (!activeAcc) return NextResponse.json({ message: 'Current active account not found' }, { status: 404 });

    // blocked conversations...
    const blockedChatsAccIds = (await Block.find({ blockedByAcc:activeAcc._id , source:'chat' })).map((block) => block.blockedAcc);

    // get converations of this account...
    const conversationDocs = await conversation.find({ participants:{ $in:[activeAcc._id] , $nin:blockedChatsAccIds } });
    const finalConvs = await Promise.all(conversationDocs.map( async (conversation) => {

        const chatWithAcc = await accounts.findOne({
            _id: { $in: conversation.participants, $ne: activeAcc._id },
            'account.status': { $in: ['ACTIVE', 'DEACTIVATED'] }
        });

        if (!chatWithAcc) return null ;

        // Fetch latest message...
        const lastMessage = await messages
            .findOne({
                $or: [
                    { fromId: activeAcc._id, toId: chatWithAcc._id },
                    { fromId: chatWithAcc._id, toId: activeAcc._id }
                ]
            })
            .sort({ createdAt: -1 });

        // getting pinned state...
        const pinned = (Array.isArray(conversation.pinnedBy) && conversation.pinnedBy.includes(activeAcc._id)) ? true : false ;

        // getting unseen incoming messages
        const unseenMessages = await messages.countDocuments({ fromId: chatWithAcc._id, toId: activeAcc._id, status: { $ne: 'seen' }}) ;

        // getting the publickey of this account...
        const deviceip = await getDevicePublicIP() ;
        const publickey = await pubkeys.findOne({ accountId:activeAcc._id , deviceIP:deviceip , status:'active' });

        if (!publickey) {
            console.log("Public key missing !!");
            return NextResponse.json({ message:'Public key missing' },{ status:404 });
        }
        return {
            id: conversation._id,
            name: chatWithAcc.name,
            handle: `@${chatWithAcc.username}`,
            lastMessage:lastMessage.content,
            timestamp: new Date(lastMessage.createdAt).toDateString(),
            isVerified: chatWithAcc.isverified.value,
            avatarUrl: chatWithAcc.avatar.url,
            pinned:pinned,
            unreadCount:unseenMessages,
            publicKey:publickey.publicKey
        }
    })) 
    
    return finalConvs ;
}

export const createNewConversationService = async (targetAcc:userCardProp) => {
   await connectWithMongoDB() ;
    
   const user = await getDecodedDataFromCookie("accessToken");
   if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST...' });
    
   const activeAcc = await accounts.findOne({ userId: user.id , 'account.Active':true });
   if (!activeAcc) return NextResponse.json({ message: 'Current active account not found' }, { status: 404 });

   const targetAccount = await accounts.findById(targetAcc.id); // fetching target account from DB...

   // creating new conversation...
   await conversation.create({ participants:[activeAcc._id,targetAccount._id] });

   // returning public key...
    const deviceip = await getDevicePublicIP() ;
    const publickey = await pubkeys.findOne({ accountId:activeAcc._id , deviceIP:deviceip , status:'active' });

    if (!publickey) {
      console.log("Public key missing !!");
      return NextResponse.json({ message:'Public key missing' },{ status:404 });
    }

    return publickey.publicKey ;
}


export const chatCardOpenService = async (card:infoForChatCard) => {
    await connectWithMongoDB() ;
    
   const user = await getDecodedDataFromCookie("accessToken");
   if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST...' });
    
   const activeAcc = await accounts.findOne({ userId: user.id , 'account.Active':true });
   if (!activeAcc) return NextResponse.json({ message: 'Current active account not found' }, { status: 404 });

   // getting the conversation required...
   const conv = await conversation.findOne({ _id:card.id , participants:{ $in:[activeAcc._id] } });

   // marking all non-seen messages as seen...
   await messages.updateMany(
    { toId:activeAcc._id , conversationId:conv._id , status:{ $ne:'seen' } , deletedFor:{ $nin:[activeAcc._id]  } },
    { status:'seen' }
   );
}