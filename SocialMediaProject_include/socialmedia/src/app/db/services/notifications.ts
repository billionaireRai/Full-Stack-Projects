import { connectWithMongoDB } from "../dbConnection";
import { NextResponse } from "next/server";
import { getDecodedDataFromCookie } from "@/lib/cookiehandler";
import accounts from "../models/accounts";
import axios from "axios";
import notifications from "../models/notifications";
import Post from "../models/posts";
import follows from "../models/follows";
import { fmt } from "@/lib/utils";
import Presence from "../models/presense";


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

export interface notificationPayloadType {
   id: string;
   type:NotificationType;
   actor:accountInvolved;
   post?:Post;
   comment?:string;
   createdAt: string;
}
export interface CreateNotificationParams {
  forAccId: string; // account receiving the notification
  actor: accountInvolved ; // account who caused the notification
  type: NotificationType;
  post?: Post;
  comment?: string;
}

export const notificationText: Record<NotificationType, string> = {
  follow: "started following you",
  like: "liked your post",
  comment: "commented on your post",
  mention: "mentioned you",
  repost: "reposted your post",
  post: "shared a new post",
  notification_like: "liked your notification",
  notification_comment: "replied to your notification",
};

// notification creation and sending via socket.io
export const createAndSendNotification = async (params: CreateNotificationParams): Promise<void> => {
  const { forAccId, actor, type, post, comment } = params ;

  await connectWithMongoDB(); // connecting with data base...
  // can't send notification to user itself...
  if (forAccId === actor.id) {
    console.log("Skipping self-notification sending...");
    return ;
  }

  // Creating notification in database...
  const notification = await notifications.create({ forAccId, actor, type, post, comment }); 
  const presense = await Presence.findOne({ accountId:forAccId }) ; // getting presense state of for acc...

  // Send notification via socket server...
  if (presense && presense?.onlineStatus === 'online') {
   try {
     const emitReq = await axios.post("http://localhost:4000/emit-notification", {
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({
         recipientSocketId: presense?.socketId,
         payload: {
           id: notification._id.toString(),
           type,
           actor,
           post,
           comment,
           createdAt: notification.createdAt
         }
       })
     })
     if (emitReq.status === 200) {
       console.log(`Notification sent via socket to account : ${forAccId}`);
     }
   } catch (error) {
     console.error("Failed to send notification via socket:", error);
   }
  }
}

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

    // total notifications count...
    const notificationCount = await notifications.countDocuments({ $and:[{ forAccId:activeAcc._id },{ isDeleted:false }] })

    // defining the query variables...
    const skip = ( page - 1 ) * pagesize ;
    const hasMore = ( skip + pagesize ) < notificationCount ;

    // fetching notifications now...
    const Notifications = await notifications.find({ $and:[{ forAccId:activeAcc._id },{ isDeleted:false }] })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pagesize);

    const notificationData = await Promise.all(Notifications.map(async (notification) => {
        // fetching some required data...
        const actorAccount = await accounts.findOne({ $and:[{ _id:notification.actorId },{ 'account.status':'ACTIVE' }] });
        const postInvolved = notification.postId ? await Post.findById(notification.postId) : null ;

        const isFollowing = await follows.exists({ $and:[{ followerId: activeAcc._id },{ followingId: actorAccount._id }] })
        const followers = await follows.find({ followingId : actorAccount._id , isDeleted:false })
        const following = await follows.find({ followerId : actorAccount._id , isDeleted:false })

        const posts = await Post.countDocuments({ authorId:actorAccount._id , isDeleted:false }) ;

        // checking actor account existence...
        if (!actorAccount) {
          console.log('Actor account not found !!');
          return null ;
        }
        // checking post existence...
        if (!postInvolved) {
          console.log('Post involved not found !!');
          return null ;
        }
        // returning data in required structure...
        return {
          id: notification._id.toString() ,
          type: notification.type,
          actor: {
            id: actorAccount._id.toString(),
            decodedHandle: `@${actorAccount.username}`,
            name: actorAccount.name,
            IsFollowing: Boolean(isFollowing),
            account: {
                  name: actorAccount.account.name,
                  handle: `@${actorAccount.username}`,
                  bio: actorAccount.bio,
                  location: actorAccount.location,
                  website: actorAccount.website,
                  joinDate: new Date(actorAccount.createdAt).toDateString(),
                  following: fmt(following.length),
                  followers: fmt(followers.length),
                  Posts: fmt(posts),
                  isCompleted: actorAccount.account.completed,
                  isVerified: actorAccount.isVerified.value,
                  plan: actorAccount.isVerified.level,
                  bannerUrl: actorAccount.banner.url,
                  avatarUrl: actorAccount.avatar.url,
                }
          },
          timestamp:new Date(notification.createdAt).toISOString(),
          isread: Boolean(notification.isRead),
          isliked: Boolean(notification.isLiked),
          iscommented: notification.comment.trim() && notification.comment.length > 0 ,
          commentText: notification.comment.trim() ? notification.comment : '',
          post:{
              id: postInvolved._id.toString(),
              thumbnailUrl: { url:postInvolved.mediaUrls[0].url , media_type:postInvolved.mediaUrls[0].media_type },
              content: postInvolved.content,
            },
        };
      })
    );

    return {
        notifications: notificationData,
        hasMore,
      }
}

export const markNotificationsReadService = async ( page:number , size:number) => {
  await connectWithMongoDB() ; // connecting to database..
      
  const user = await getDecodedDataFromCookie("accessToken");
  if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST...' });
      
  // getting the current active account...
  const activeAcc = await accounts.findOne({ userId: user.id , 'account.Active':true , 'account.status':'ACTIVE' }); 

  if (!activeAcc) {
    console.log("Current loggedin account not found !!");
    return NextResponse.json({ message:'LoggedIn account not found !!' },{ status:404 });
  }

  // defining skip variable for new fetching...
  const skip = ( page - 1 ) * size ;

  // fetching notifications now...
  const Notifications = await notifications.find({ $and:[{ forAccId:activeAcc._id },{ isDeleted:false }] }).sort({ createdAt:-1 }).skip(skip).limit(size);

  const notificationIds = Notifications.map((notifcn) => notifcn._id) ;

  // bulk update in data in notifications collection...
  await notifications.updateMany({ _id:{ $in:notificationIds }},{ isRead:true });
}

export const likeNotificationService = async ( id:string , updateTo:boolean ) => {
  await connectWithMongoDB() ; // connecting to database..
      
  const user = await getDecodedDataFromCookie("accessToken");
  if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST...' });
      
  // getting the current active account...
  const activeAcc = await accounts.findOne({ userId: user.id , 'account.Active':true , 'account.status':'ACTIVE' }); 

    if (!activeAcc) {
    console.log("Current loggedin account not found !!");
    return NextResponse.json({ message:'LoggedIn account not found !!' },{ status:404 });
  }

  await notifications.findByIdAndUpdate(id,{ isLiked:updateTo }); // updating the like state...

}

export const commentOnNotificationService = async ( id:string , reply:string ) => {
  await connectWithMongoDB() ; // connecting to database..
      
  const user = await getDecodedDataFromCookie("accessToken");
  if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST...' });

  // getting the current active account...
  const activeAcc = await accounts.findOne({ userId: user.id , 'account.Active':true , 'account.status':'ACTIVE' }); 

  if (!activeAcc) {
    console.log("Current loggedin account not found !!");
    return NextResponse.json({ message:'LoggedIn account not found !!' },{ status:404 });
  }

  await notifications.findByIdAndUpdate(id,{ comment:reply.trim() }) ;

}

export const deleteNotificationService = async ( id:string ) => {
  await connectWithMongoDB() ; // connecting to database..
      
  const user = await getDecodedDataFromCookie("accessToken");
  if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST...' });

  // getting the current active account...
  const activeAcc = await accounts.findOne({ userId: user.id , 'account.Active':true , 'account.status':'ACTIVE' }); 

  if (!activeAcc) {
    console.log("Current loggedin account not found !!");
    return NextResponse.json({ message:'LoggedIn account not found !!' },{ status:404 });
  }

  await notifications.findByIdAndUpdate(id,{ isDeleted:true }) ;

}