import { connectWithMongoDB } from "../dbConnection";
import axios from "axios";
import notifications from "../models/notifications";


// type for notification payload...
interface CreateNotificationParams {
  forAccId: string;  // The account receiving the notification
  actorId: string;   // The account that performed the action
  type: 'like' | 'comment' | 'follow' | 'mention' | 'repost';
  postId?: string;
  commentId?: string;
}

// notification creation and sending via socket.io
export const createAndSendNotification = async (params: CreateNotificationParams): Promise<void> => {
  const { forAccId, actorId, type, postId, commentId } = params;

  await connectWithMongoDB();
  // Don't send notification if the actor is the same as the recipient
  if (forAccId === actorId) {
    console.log("Skipping self-notification...");
    return;
  }

  // Create notification in database...
  const notification = new notifications({
    forAccId,
    actorId,
    type,
    postId,
    commentId,
    isRead: false
  });

  // Send notification via socket server...
  try {
    const emitReq = await axios.post("http://localhost:4000/emit-notification", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipientAcc: forAccId,
        payload: {
          id: notification._id.toString(),
          type,
          actorId,
          postId,
          commentId,
          createdAt: notification.createdAt
        }
      })
    });
    if (emitReq.status === 200) {
      await notification.save() ;
      console.log(`Notification sent via socket to account : ${forAccId}`);
    }
  } catch (error) {
    console.error("Failed to send notification via socket:", error);
  }
};

// Creates a comment notification when comments on a post someone
export const sendCommentNotification = async ( postAuthorId: string, commenterId: string, postId: string, commentId: string ): Promise<void> => {
  await createAndSendNotification({
    forAccId: postAuthorId,
    actorId: commenterId,
    type: 'comment',
    postId,
    commentId
  });
};

// Creates a like notification when someone likes a post
export const sendLikeNotification = async ( postAuthorId: string, likerId: string, postId: string ): Promise<void> => {
  await createAndSendNotification({
    forAccId: postAuthorId,
    actorId: likerId,
    type: 'like',
    postId
  });
};

// Creates a follow notification when someone follows an account
export const sendFollowNotification = async ( followedAccountId: string, followerId: string ): Promise<void> => {
  await createAndSendNotification({
    forAccId: followedAccountId,
    actorId: followerId,
    type: 'follow'
  });
};

// Creates a mention notification when someone mentions an account
export const sendMentionNotification = async ( mentionedAccountId: string, mentionerId: string, postId: string, commentId?: string ): Promise<void> => {
  await createAndSendNotification({
    forAccId: mentionedAccountId,
    actorId: mentionerId,
    type: 'mention',
    postId,
    commentId
  });
};

// Creates a repost notification when someone reposts a post
export const sendRepostNotification = async ( postAuthorId: string, reposterId: string, postId: string ): Promise<void> => {
  await createAndSendNotification({
    forAccId: postAuthorId,
    actorId: reposterId,
    type: 'repost',
    postId
  });
};
