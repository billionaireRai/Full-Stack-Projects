import Post from "../models/posts";
import Poll from "../models/polls";
import likes from "../models/likes";
import Views from "../models/views";
import tagged from "../models/tagged";
import follows from "../models/follows";
import accounts from "../models/accounts";
import viewStat from "../models/viewstat";
import { fmt, getCommonElements, shuffleArray } from "@/lib/utils";
import { NextResponse } from "next/server";
import { connectWithMongoDB } from "../dbConnection";
import { getDecodedDataFromCookie } from "@/lib/cookiehandler";
import messages from "../models/messages";
import boosts from "../models/boosts";

export interface pollOptionType {
  text: string;
  votes: number;
}
export interface polltype {
  question: string;
  options: pollOptionType[];
  duration: number;
}

// different plan levels...
type Plan = "Free" | "Pro" | "Creator" | "Premium";

// categories type allowed...
type rankingCategories = "engagement" | "freshness" | "relationship" | "interest" | "reputation" | "boosted" ;

// score multiplier for each...
const categoryScoreMultiplier: Record<rankingCategories, number> = {
  engagement: 0.3, freshness: 0.2, relationship: 0.15, interest: 0.1, reputation: 0.05, boosted: 0.1,
};

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const clamp0to100 = (n: number) => Math.max(0, Math.min(100, n));

// stander log normalization...
const normLog100 = (metric: number, scale: number) => {
  if (!Number.isFinite(metric) || metric <= 0) return 0 ;
  return clamp0to100((Math.log(1 + metric) / Math.log(1 + scale)) * 100);
};

// Exponential decay function...
const normRecency100 = (ageMs: number, halfLifeHours: number) => {
  if (!Number.isFinite(ageMs) || ageMs <= 0) return 100;
  const ageHours = ageMs / (1000 * 60 * 60);
  if (!Number.isFinite(ageHours)) return 0;

  const decay = Math.pow(0.5, ageHours / Math.max(0.0001, halfLifeHours));
  return clamp0to100(decay * 100);
};

const safeRatio100 = (num: number, den: number) => {
  if (!Number.isFinite(num) || !Number.isFinite(den) || den <= 0) return 0;
  return clamp0to100(clamp01(num / den) * 100);
};

export const getFeedPostService = async ({ Page, size }: { Page: number; size: number }) => {
  await connectWithMongoDB();

  const user = await getDecodedDataFromCookie("accessToken");
  if (user instanceof Error) return NextResponse.json( { message: user.message },{ status: 401, statusText: "UNAUTHORIZED REQUEST..." });

  const activeAcc = await accounts.findOne({ userId: user.id, "account.Active": true });
  if (!activeAcc) return NextResponse.json( { message: "Current account not found" },{ status: 404 });

  // defining pagination variables...
  const total = await Post.countDocuments({ isDeleted: false, postType: "original",status: "published" });
  const skip = (Page - 1) * size;
  const hasNext = skip + size < total;

  // fetching posts on condition...
  const desiredPosts = await Post.find({ isDeleted: false, postType: "original", status: "published" })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size);

  const followingDocs = await follows.find({ follower: activeAcc._id, isDeleted: false });
  const followingIds = followingDocs.flatMap((f) => f.followingId);

  const structuredPost: any[] = []; // array of total posts...

  for (const post of desiredPosts) {
    const postOwner = await accounts.findById(post.authorId);
    if (!postOwner) continue ;

    const [likesCount, repostsCount, commentsCount, views] = await Promise.all([
      likes.countDocuments({ targetEntity: post._id.toString(), targetType: "post" }),
      Post.countDocuments({ repostId: post._id.toString(),postType: "repost",isDeleted: false }),
      Post.countDocuments({ replyToPostId: post._id.toString(),postType: "comment",isDeleted: false }),
      Views.countDocuments({ postId: post._id.toString() }),
    ]);

    await viewStat.findOneAndUpdate({ postId: post._id.toString() },{ totalViews: views },{ new: true });

    const [userLiked, userReposted, userCommented, userBookmarked, isPinned, isHighlighted, followers, following, isFollowing] 
    = await Promise.all([
      likes.findOne({ accountId: activeAcc._id,targetEntity: post._id.toString(),targetType: "post" }),
      Post.findOne({ authorId: activeAcc._id, repostId: post._id.toString(), postType: "repost", isDeleted: false }),
      Post.findOne({ authorId: activeAcc._id, replyToPostId: post._id.toString(), postType: "comment", isDeleted: false }),
      tagged.findOne({ accountId: activeAcc._id, taggedAs: "bookmarked", entityId: post._id.toString() }),
      tagged.findOne({ accountId: activeAcc._id, taggedAs: "pinned", entityId: post._id }),
      tagged.findOne({ accountId: activeAcc._id, taggedAs: "highlighted", entityId: post._id }),
      follows.countDocuments({ followingId: postOwner._id, isDeleted: false }),
      follows.countDocuments({ followerId: postOwner._id, isDeleted: false }),
      follows.findOne({ followerId: activeAcc._id, followingId: postOwner._id, isDeleted: false }),
    ]);

    // Get poll data if exists
    const pollData = await Poll.findOne({ authorPost: post._id,isActive: true, expiry: { $gt: new Date() } });
    let poll: polltype | undefined;
    if (pollData) {
      poll = {
        question: pollData.question,
        options: pollData.options.map((opt: pollOptionType) => ({
          text: opt.text,
          votes: opt.votes,
        })),
        duration: pollData.duration,
      };
    }

    structuredPost.push({
      postId: post._id.toString(),
      authorId: postOwner._id.toString(),
      avatar: postOwner.avatar?.url,
      cover: postOwner.banner?.url,
      username: postOwner.name,
      handle: `@${postOwner.username}`,
      bio: postOwner.bio,
      timestamp: new Date(post.createdAt).toUTCString(),
      content: post.content,
      mediaUrls: post.mediaUrls?.map((urlObj: any) => ({ url: urlObj?.url,media_type: urlObj?.media_type })),
      likes: likesCount,
      reposts: repostsCount,
      comments: commentsCount,
      views: views,
      isPinned: !!isPinned,
      isHighlighted: !!isHighlighted,
      userliked: !!userLiked,
      usereposted: !!userReposted,
      usercommented: !!userCommented,
      userbookmarked: !!userBookmarked,
      isCompleted: postOwner.account?.completed,
      isVerified: postOwner.isVerified?.value,
      plan: postOwner.isVerified?.level,
      followers: fmt(followers),
      following: fmt(following),
      hashTags: post.hashTags,
      mentions: post.mentions,
      isFollowing: !!isFollowing,
      taggedLocation: post.taggedLocation || [],
      poll,
    });
  }

  // scoring engine logic...
//   const scoredFeedPosts = await Promise.all(structuredPost.map(async (post) => {
//       const postOwner = await accounts.findById(post.authorId);
//       if (!postOwner) return { ...post, score: 0 };

//       // Precompute metrics
//       const engagementMetric = post.likes + 2 * post.comments + 2.5 * post.reposts + 0.2 * post.views;

//       const now = Date.now();
//       const createdAt = new Date(post.timestamp);
//       const ageMs = now - createdAt.getTime();

//       // Relationship...
//       const ownerFollows = await follows.find({ followerId: postOwner._id, isDeleted: false,});
//       const ownerFollowingIds = ownerFollows.flatMap((f) => f.followingId);
//       const commonFollowings = getCommonElements(followingIds,ownerFollowingIds);

//       const msgCondition = { fromId: activeAcc._id, toId: postOwner._id,deletedFor: { $nin: [activeAcc._id] } };
//       const messagesTransfered = await messages.countDocuments(msgCondition);

//       const previousLikes = await likes.countDocuments({ accountId: activeAcc._id, targetEntity: post.postId, targetType: "post" });

//       // interaction on same author timeline...
//       const authorRecentPostIds = await Post.find({ authorId: postOwner._id, status: "published", isDeleted: false })
//         .sort({ createdAt: -1 })
//         .limit(50)
//         .select("_id");
//       const authorRecentIds = authorRecentPostIds.map((p) => p._id);

//       const previousComments = await Post.countDocuments({ authorId: activeAcc._id, replyToPostId: { $in: authorRecentIds }, postType: "comment", isDeleted: false });

//       const previousReposts = await Post.countDocuments({ authorId: activeAcc._id, replyToPostId: { $in: authorRecentIds }, postType: "repost", isDeleted: false });

//       const previousBookmarks = await tagged.countDocuments({ accountId: activeAcc._id, taggedAs: "bookmarked", entityId: { $in: authorRecentIds } });

//       // Convert relationship raw metric to 0..100
//       const relationshipMetric = commonFollowings.length + 
//       (2 * previousLikes + 5 * previousComments + 8 * messagesTransfered + 6 * previousBookmarks + 4 * previousReposts );

//       // Interest overlap
//       const myTopics = activeAcc?.interests?.topicsLoved || [];
//       const ownerTopics = postOwner?.interests?.topics || [];
//       const overlap = getCommonElements(myTopics, ownerTopics);
//       const interestScore100 = safeRatio100(overlap.length,myTopics.length);

//       // Reputation 
//       const planScore: Record<Plan, number> = { Free: 0, Pro: 1, Creator: 2, Premium: 3 };
//       const ownerCreatedAt = new Date(postOwner.createdAt);
//       const ownerAgeMs = now - ownerCreatedAt.getTime();

//       // cap reputation age at ~5 years for normalization
//       const reputationBase100 = normRecency100(ownerAgeMs, 24 * 365 * 2); // ~2 years half-life-ish
//       const plan = (post.plan as Plan) || "Free";
//       const reputationPlanBonus100 = (planScore[plan] / 3) * 20; // up to +20
//       const reputationScore100 = clamp0to100(
//         reputationBase100 * 0.8 + reputationPlanBonus100
//       );

//       // Freshness
//       const freshnessScore100 = normRecency100(ageMs, 36); // half-life 36h

//       // Engagement normalization
//       const engagementScore100 = normLog100(engagementMetric, 50000);

//       // Relationship normalization
//       const relationshipScore100 = normLog100(relationshipMetric, 5000);

//       // Boost
//       let boostedScore100 = 0;
//       const boostCampaign = await boosts.findOne({ postId: post.postId,accountId: postOwner._id,status: "active" });
//       if (boostCampaign) {
//         const remaining = Math.max(0, boostCampaign.targetViews - boostCampaign.consumedViews) || 0 ;
//         const expiryMs = new Date(boostCampaign.expiry).getTime() - now ;
//         // nearer expiry => lower, but remaining budget => higher....
//         const remaining100 = normLog100(remaining, 100000);
//         const pacing100 = normLog100(boostCampaign.pacingRate || 0, 10000);
//         const timeLeftHours = Math.max(0, expiryMs) / (1000 * 60 * 60);
//         const timeLeft100 = normRecency100(timeLeftHours * 60 * 60 * 1000, 12); // convert to ms, half-life 12h
//         boostedScore100 = clamp0to100(0.5 * remaining100 + 0.3 * pacing100 + 0.2 * timeLeft100);
//       }

//       // Final weighted score...
//       const finalScore = ( engagementScore100 * categoryScoreMultiplier.engagement + freshnessScore100 * categoryScoreMultiplier.freshness + relationshipScore100 * categoryScoreMultiplier.relationship + interestScore100 * categoryScoreMultiplier.interest + reputationScore100 * categoryScoreMultiplier.reputation + boostedScore100 * categoryScoreMultiplier.boosted );

//       // Small deterministic overrides...
//       const pinBoost = post.isPinned ? 8 : 0 ;
//       const highlightBoost = post.isHighlighted ? 5 : 0 ;

//       return { ...post, score: clamp0to100(finalScore / 1.0 + pinBoost + highlightBoost) };
//     })
//   );

//   scoredFeedPosts.sort((postA,postB) => (postB.score) - (postA.score)) ;

  const shuffledFeedPosts = shuffleArray(structuredPost);

  return NextResponse.json({ message: "Fetched feed posts successfully !!", posts: shuffledFeedPosts , hasNext },{ status: 200 });
};

