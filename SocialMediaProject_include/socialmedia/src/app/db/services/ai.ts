import { NextResponse } from "next/server";
import Post from "../models/posts";
import accounts from "../models/accounts";
import follows from "../models/follows";
import likes from "../models/likes";
import Views from "../models/views";
import polls from "../models/polls";
import tagged from "../models/tagged";
import { pollOptionType , polltype } from "./post";
import { connectWithMongoDB } from "../dbConnection";
import { getDecodedDataFromCookie } from "@/lib/cookiehandler";
import { fmt } from "@/lib/utils";
import { explainPostOrProfile } from "@/lib/aifeatures";
import { PostSummaryMeta, ProfileSummaryMeta } from "@/lib/aifeatures";

export const aiExplanationService = async (username:string,postid:string,type:string) => {
  await connectWithMongoDB() ; // connecting with mongodb...

  const user = await getDecodedDataFromCookie("accessToken");
  if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST...' });
    
  const activeAcc = await accounts.findOne({ userId: user.id , 'account.Active':true });
  if (!activeAcc) return NextResponse.json({ message: 'Current account not found' }, { status: 404 });

  var finalData : PostSummaryMeta | ProfileSummaryMeta | null = null ; 

  // getting data according to type...
  if (type === 'account' && !postid) {
    const explainAcc = await accounts.findOne({ username:username.substring(1) , 'account.status':'ACTIVE' });

    if (!explainAcc) {
        console.log("Account to get explained missing !!");
        return NextResponse.json({ message:'Account to get explained missing !!' , status:400 });
    }
    const followers = await follows.countDocuments({ followingId : explainAcc._id , isDeleted:false })
    const followings = await follows.countDocuments({ followerId : explainAcc._id , isDeleted:false })
    const posts = await Post.countDocuments({ authorId:explainAcc._id , isDeleted:false }) ;

    const Posts = await Post.find({ authorId:explainAcc._id , isDeleted:false }) ;
    const requiredField = Posts.map((post) =>  { [post.category,...post.hashtags] })

    const contentCategories = requiredField.join(',');

    finalData = {
       name: explainAcc.name,
       handle: ('@').concat(explainAcc.username),
       bio: explainAcc.bio.trim(),
       followers: fmt(followers),
       following: fmt(followings),
       posts: fmt(posts),
       joinDate:new Date(explainAcc.createdAt).toDateString() ,
       location: explainAcc.location,
       website: explainAcc.website.trim(),
       isVerified: explainAcc.isVerified.value,
       plan: explainAcc.isVerified?.level,
       interests: explainAcc.interests?.topicsLoved ,
       contentCategories:contentCategories
    }

  } 

  if (type === 'post' && postid) {
    const ownerAcc = await accounts.findOne({ username:username.substring(1) , 'account.status':'ACTIVE' });
    const targetPost = await Post.findOne({ _id:postid , authorId:ownerAcc._id , status:'published' , isDeleted:false });

    if (!ownerAcc) {
        console.log("Account to get explained missing !!");
        return NextResponse.json({ message:'Account to get explained missing !!' , status:400 });
    }
    if (!targetPost) {
        console.log("Post to get explained missing !!");
        return NextResponse.json({ message:'Post to get explained missing !!' , status:400 });
    }

    const Likes = await likes.countDocuments({ targetEntity: targetPost._id.toString(), targetType: "post" });
    const reposts = await  Post.countDocuments({ repostId: targetPost._id.toString(),postType: "repost",isDeleted: false });
    const comments = await Post.countDocuments({ replyToPostId: targetPost._id.toString(),postType: "comment",isDeleted: false });
    const views = await Views.countDocuments({ postId: targetPost._id.toString() });
    const bookmarks = await tagged.countDocuments({ taggedAs: "bookmarked", entityId: targetPost._id.toString() });

    const pollData = await polls.findOne({ authorPost: targetPost._id });
    let Poll: polltype | null = null ;
    if (pollData) {
      Poll = {
        question: pollData.question,
        options: pollData.options.map((opt: pollOptionType) => ({ text: opt.text , votes: opt.votes })),
        duration: pollData.duration,
      };
    }

    finalData = {
      name: ownerAcc.name,
      handle: ownerAcc.username,
      content: targetPost.content.trim(),
      hashtags: targetPost.hashtags,
      mentions: targetPost.mentions,
      media: targetPost.mediaUrls?.length > 0 ? targetPost.mediaUrls?.map((media:any) =>  ({ url: media?.url,media_type: media?.media_type })) : [] ,
      likes: fmt(Likes),
      reposts: fmt(reposts),
      comments: fmt(comments),
      views: fmt(views),
      bookmarks: fmt(bookmarks),
      postedAt: new Date(targetPost.createdAt).toUTCString(),
      taggedLocation: targetPost.taggedLocation || [],
      poll: Poll ,
      category: targetPost.category,
      keywords: targetPost.keywords
    }
  }

  // feeding data to AI...
  const explanationObj = await explainPostOrProfile(finalData);
  return NextResponse.json({ message:'AI explanation ready !!' , Explain:explanationObj },{ status:200 });
}

