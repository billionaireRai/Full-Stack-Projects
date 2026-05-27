import { connectWithMongoDB } from "../dbConnection";
import { NextResponse } from "next/server";
import { getDecodedDataFromCookie } from "@/lib/cookiehandler";
import accounts from "../models/accounts";
import axios from "axios";
import notifications from "../models/notifications";


type NotificationType = 'follow' | 'like' | 'comment' | 'mention' | 'repost' | 'post' | 'notification_like' | 'notification_comment' ;
// type for notification payload...
export interface accountInvolved {
  id: string;
  name: string;
  username: string;
  isVerified:boolean
  avatarUrl?: string;
}

export interface Post {
  id: string;
  thumbnailUrl?: string;
  content?: string;
}

export interface CreateNotificationParams {
  forAccId: string; // account receiving the notification
  actor: accountInvolved ; // account who caused the notification
  type: NotificationType;
  post?: Post;
  comment?: string;
}



// notification creation and sending via socket.io
export const createAndSendNotification = async (params: CreateNotificationParams): Promise<void> => {
  const { forAccId, actor, type, post, comment } = params;

  await connectWithMongoDB(); // connecting with data base...
  // can't send notification to user itself...
  if (forAccId === actor.id) {
    console.log("Skipping self-notification...");
    return;
  }

  // Create notification in database...
  const notification = new notifications({ forAccId, actor, type, post, comment });

  // Send notification via socket server...
  try {
    const emitReq = await axios.post("http://localhost:4000/emit-notification", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipientAcc: forAccId,
        payload: {
          id: notification._id.toString(),
          type,
          actor,
          post,
          comment,
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
export const sendCommentNotification = async ( postAuthorId: string, commenter: accountInvolved, post: Post, comment: string ): Promise<void> => {
  await createAndSendNotification({
    forAccId: postAuthorId,
    actor: commenter,
    type: 'comment',
    post,
    comment
  });
};

// Creates a like notification when someone likes a post
export const sendLikeNotification = async ( postAuthorId: string, liker: accountInvolved, post: Post ): Promise<void> => {
  await createAndSendNotification({
    forAccId: postAuthorId,
    actor: liker,
    type: 'like',
    post
  });
};

// Creates a follow notification when someone follows an account
export const sendFollowNotification = async ( followedAccountId: string, follower: accountInvolved ): Promise<void> => {
  await createAndSendNotification({
    forAccId: followedAccountId,
    actor: follower,
    type: 'follow'
  });
};

// Creates a mention notification when someone mentions an account
export const sendMentionNotification = async ( mentionedAccountId: string, mentioner: accountInvolved, post: Post, comment?: string ): Promise<void> => {
  await createAndSendNotification({
    forAccId: mentionedAccountId,
    actor: mentioner,
    type: 'mention',
    post,
    comment
  });
};

// Creates a repost notification when someone reposts a post
export const sendRepostNotification = async ( postAuthorId: string, reposter: accountInvolved, post: Post ): Promise<void> => {
  await createAndSendNotification({
    forAccId: postAuthorId,
    actor: reposter,
    type: 'repost',
    post
  });
};

// Creates a new post uploaded notification to followers...
export const sendNewPostNotification = async ( followerId: string, postUploader: accountInvolved, post: Post ): Promise<void> => {
  await createAndSendNotification({
    forAccId: followerId,
    actor: postUploader,
    type: 'post',
    post
  });
};

// Creates a new comment on notification...
export const sendNotificationComment = async ( notificationAuthorId: string, commentor: accountInvolved, post: Post ): Promise<void> => {
  await createAndSendNotification({
    forAccId: notificationAuthorId,
    actor: commentor,
    type: 'notification_comment',
    post
  });
};

// Creates a new like on notification...
export const sendNotificationLike = async ( notificationAuthorId: string, liker: accountInvolved, post: Post ): Promise<void> => {
  await createAndSendNotification({
    forAccId: notificationAuthorId,
    actor: liker,
    type: 'notification_like',
    post
  });
};

export const getNotificationsService = async ( username:string , page:number , pagesize:number ) => {
   await connectWithMongoDB() ; // connecting to database..
      
    const user = await getDecodedDataFromCookie("accessToken");
    if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST...' });
      
    // getting the current active account...
    const activeAcc = await accounts.findOne({ userId: user.id , 'account.Active':true , 'account.status':'ACTIVE' });

    // security check for account...
    if (activeAcc.username !== username.substring(1)) {
      console.log(`Account handle mismatch coming: ${username} expected: ${activeAcc.usename}`);
      return NextResponse.json({ message:'Account handle mismatch !!' },{ status:404 });
    }

    // total notifications count
    const notificationCount = await notifications.countDocuments({ $and:[{ forAccId:activeAcc._id },{ }] })

    // defining the query variables...
    const skip = ( page - 1 ) * pagesize ;
    const hasMore = ( skip + pagesize ) < notificationCount ;

    // fetching notifications now...
    
    
}