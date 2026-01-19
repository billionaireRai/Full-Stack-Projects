import { ConnectionOptions, Worker } from "bullmq";
import accounts from "@/app/db/models/accounts";
import follows from "@/app/db/models/follows";
import subscriptions from "@/app/db/models/subscriptions";
import likes from '@/app/db/models/likes';
import Message from "../db/models/messages";
import notifications from "@/app/db/models/notifications";
import Post from '@/app/db/models/posts';

new Worker( "account-deletion" , async job => {
    const { accId } = job.data ;
  
    const targetAcc = await accounts.findByIdAndUpdate(accId,{ 'account.status' : 'DELETED'}) ; // getting the target account...

    // Remove user from Followers / following lists...
    await follows.updateMany({ $or: [{ followerId: targetAcc._id }, { followingId: targetAcc._id }] },{ $set: { isDeleted: true } });

    // cancel active subscription just after current cycle of monthly payment...
    await subscriptions.findOneAndUpdate(
      { accountId: targetAcc._id, status: 'active' },
      { $set: { status: 'canceled', canceledAt: new Date() } }
    );

    // Soft delete user's posts...
    await Post.updateMany({ authorId: targetAcc._id }, { $set: { isDeleted: true } });

    // Soft delete user's likes (assuming likes have isDeleted field, otherwise delete)
    await likes.updateMany({ accountId: targetAcc._id }, { $set: { isDeleted: true } });

    // Delete notifications where user is actor or recipient
    await notifications.deleteMany({ $or: [{ userId: targetAcc._id }, { actorId: targetAcc._id }] });

    // Soft delete messages...
    await Message.updateMany(
      { $or: [{ fromId: targetAcc._id }, { toId: targetAcc._id }] },
      { $addToSet: { deletedFor: targetAcc._id } }
    );

  },
  {
    connection: process.env.REDIS_URL as ConnectionOptions
  }
);
