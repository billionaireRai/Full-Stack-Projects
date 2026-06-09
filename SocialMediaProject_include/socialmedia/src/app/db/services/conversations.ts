import accounts from "../models/accounts";
import conversation from "../models/conversation";
import { connectWithMongoDB } from "../dbConnection";
import { NextResponse } from "next/server";
import { getDecodedDataFromCookie } from "@/lib/cookiehandler";
import messages from "../models/messages";

export const getConversationsService = async () => {
    await connectWithMongoDB() ;
    
    const user = await getDecodedDataFromCookie("accessToken");
    if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST...' });
    
    const activeAcc = await accounts.findOne({ userId: user.id , 'account.Active':true });
    if (!activeAcc) return NextResponse.json({ message: 'Current active account not found' }, { status: 404 });

    // get converations of this account...
    const conversationDocs = await conversation.find({ participants:{ $in:[activeAcc._id] } });
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

        // getting unseen incoming messages
        const unseenMessages = await messages.countDocuments({ fromId: chatWithAcc._id, toId: activeAcc._id, status: { $ne: 'seen' }}) ;

        return {
            id: conversation._id,
            name: chatWithAcc.name,
            handle: `@${chatWithAcc.username}`,
            lastMessage:lastMessage.content,
            timestamp: new Date(lastMessage.createdAt).toDateString(),
            isVerified: chatWithAcc.isverified.value,
            avatarUrl: chatWithAcc.avatar.url,
            unreadCount:unseenMessages
        }
    })) 
    
    return finalConvs ;
}
