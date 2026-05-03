import { connectWithMongoDB } from "../dbConnection";
import { UAParser } from 'ua-parser-js';
import mongoose from "mongoose";
import accounts from "../models/accounts";
import { getDecodedDataFromCookie } from "@/lib/cookiehandler";
import { NextResponse } from "next/server";
import { getDeviceType } from "@/lib/deviceinfo";
import viewStat from "../models/viewstat";
import likes from "../models/likes";
import tagged from "../models/tagged";
import Views from "../models/views";
import Post from "../models/posts";
import follows from "../models/follows";


// currently only 'h' and 'y' will be used...
const unitMap: Record<string, number> = {
  m: 60 * 1000,
  h: 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000,
  y: 365 * 24 * 60 * 60 * 1000
};

const parseDesiredInterval = (intervalStr: string): number => {
  const match = intervalStr.match(/^(\d+)([dhmy])$/i);
  if (!match) throw new Error("Invalid interval");

  const [, num, unit] = match;
  return parseInt(num, 10) * unitMap[unit.toLowerCase()];
};

// function to capitalize a string...
function capitalizeString(word:string) : string {
  const firstletterCap = word.charAt(0).toUpperCase() ;
  const restword = word.substring(1) ;

  return firstletterCap.concat(restword) ;
}

export const getPostAnalyticsService = async ( postid :string , desiredInterval:string ) => {
    await connectWithMongoDB() ; // connecting with mongodb...

    const user = await getDecodedDataFromCookie("accessToken");
    if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST...' });
    
    const activeAcc = await accounts.findOne({ userId: user.id , 'account.Active':true });
    if (!activeAcc) return NextResponse.json({ message: 'Current account not found' }, { status: 404 });

    // getting the target post...
    const postToDeal = await Post.findById(postid) ;
    
    if (!postToDeal || postToDeal.isDeleted) return NextResponse.json({ message: 'Post not found or deleted' }, { status: 404 });

    const intervalStartMs = Date.now() - parseDesiredInterval(desiredInterval);

    const likesCount = await likes.countDocuments({ $and:[{ targetEntity: postid },{ createdAt:{ $gte : intervalStartMs }} ] });
    const commentsCount = await Post.countDocuments({ replyToPostId: postid, postType: 'comment', isDeleted: false , createdAt:{ $gte : intervalStartMs } });
    const repostsCount = await Post.countDocuments({ repostId: postid, postType: 'repost', isDeleted: false , createdAt:{ $gte : intervalStartMs } });
    const bookmarksCount = await tagged.countDocuments({ entityId: postid, taggedAs: 'bookmarked' , createdAt:{ $gte : intervalStartMs } });
    const viewsCount = (await viewStat.findOne({ postId: postid }))?.totalViews || 0 ;

    // reach => qualified viewed in last desired interval...
    const uniqueViewers = await Views.distinct("viewerId", {
      postId: postid,
      createdAt: { $gte: intervalStartMs },
      isQualified: true
    });
    const reach = uniqueViewers.length;

    // age demographics from all views
    const ageRanges = ['0-13', '13-17', '18-24', '25-34', '35-44', '45-54', '55-64', '65+'];

    function createDemographicsPipeline(fieldPath: string) {
      return [
        {
          $match: {
            postId: new mongoose.Types.ObjectId(postid),
            viewerId: { $ne: null },
            createdAt:{ $gte : intervalStartMs }
          }
        },
        {
          $lookup: {
            from: 'accounts',
            localField: 'viewerId',
            foreignField: '_id',
            as: 'account',
            pipeline: [
              { $match: { 'account.status': 'ACTIVE' } }
            ]
          }
        },
        { 
          $unwind: { path: '$account', preserveNullAndEmptyArrays: true } 
        },
        {
          $match: {
            [`account.interests.${fieldPath}`]: { $nin: [null, undefined, ''] }
          }
        },
        {
          $group: {
            _id: `$account.interests.${fieldPath}`,
            count: { $sum: 1 }
          }
        }
      ];
    }
    
    const ageCountsRaw = await Views.aggregate(createDemographicsPipeline('ageRange'));
    const ageCountsMap = new Map(ageCountsRaw.map(item => [item._id, item.count || 0]));
    
    let totalAgeCount = 0;
    ageRanges.forEach(range => { totalAgeCount += ageCountsMap.get(range) || 0; });
    
    // final demographics...
    const ageDemographics = ageRanges.map(range => ({
      range: range.replace(/-/g, ' - '),
      percentage: totalAgeCount > 0 ? Math.round(((ageCountsMap.get(range) || 0) / totalAgeCount) * 100 ) : 0
    })); 

    // calculating gender demographics...
    const genders = ['male','female','others'];
    const genderCountsRaw = await Views.aggregate(createDemographicsPipeline('gender'));
    const genderMap = new Map(genderCountsRaw.map(item => [item._id, item.count || 0]));

    let totalGenderCount = 0 ;
    genders.forEach(gender => { totalGenderCount += genderMap.get(gender) || 0; });

    // final gender demographics...
    const genderDemographics = genders.map(gender => ({
      type: capitalizeString(gender),
      percentage: totalGenderCount > 0 ? Math.round(((genderMap.get(gender) || 0) / totalGenderCount) * 100 ) : 0
    })); 

    // calculating location-wise demographics...
    const locationPipeline = [
      { $match: { postId: new mongoose.Types.ObjectId(postid), viewerId: { $ne: null } , createdAt:{ $gte : intervalStartMs } } },
      { $lookup: {
        from: 'accounts',
        localField: 'viewerId',
        foreignField: '_id',
        as: 'account',
        pipeline: [{ $match: { 'account.status': 'ACTIVE' } }]
      } },
      { $unwind: { path: '$account', preserveNullAndEmptyArrays: true } },
      { $match: { 'account.location.text': { $nin: [null, undefined, '', 'location'] } } },
      { $addFields: {
        splitLocation: { $split: [{ $trim: { input: "$account.location.text" } }, /(,\s*|,\s*)/] },
      } },
      { $match: { country: { $ne: '' } } },
      { $group: { _id: '$country', count: { $sum: 1 } } },
      { $sort: { count: -1 } } as mongoose.PipelineStage,
      { $limit: 10 }
    ];

    const locationCountsRaw = await Views.aggregate(locationPipeline);
    const locationMap = new Map(locationCountsRaw.map(item => [item._id, item.count]));

    let totalLocationCount = 0;
    locationCountsRaw.forEach(item => { totalLocationCount += item.count; });

    const locations = Array.from(locationMap.entries()).slice(0, 10).map(([country, count]) => ({
      country,
      percentage: totalLocationCount > 0 ? Math.round((count / totalLocationCount) * 100) : 0
    }));

    const otherLocationCount = Array.from(locationMap.values()).reduce((sum, c, i) => i >= 10 ? sum + c : sum, 0);
    if (otherLocationCount > 0) locations.push({ country: 'Others', percentage: Math.round((otherLocationCount / totalLocationCount) * 100) });

    // Hourly engagement from qualified views...
    const hourlyPipeline = [
      { $match: { postId: new mongoose.Types.ObjectId(postid), isQualified: true , createdAt:{ $gte : intervalStartMs } } },
      { $group: { _id: { $hour: '$createdAt' }, engagement: { $sum: 1 } } },
      { $sort: { engagement: -1 } } as mongoose.PipelineStage ,
      { $limit: 5 }
    ];
    const hourlyData = await Views.aggregate(hourlyPipeline);
    const hourlyEngagement = hourlyData.map(item => ({
      hour: item._id,
      engagement: item.engagement
    }));

    // Top performing days from qualified views...
    const daysPipeline = [
      { $match: { postId: new mongoose.Types.ObjectId(postid), isQualified: true , createdAt:{ $gte : intervalStartMs } } },
      { $group: { _id: { $dayOfWeek: '$createdAt' }, engagement: { $sum: 1 } } },
      { $sort: { engagement: -1 } } as mongoose.PipelineStage 
    ];

    const daysData = await Views.aggregate(daysPipeline);
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const topPerformingDays = daysData.map(item => ({
      day: dayNames[item._id] ,
      engagement: item.engagement
    })).slice(0, 7);

    while (topPerformingDays.length < 7) topPerformingDays.push({ day: dayNames[topPerformingDays.length % 7], engagement: 0 });

    // Devicewise usage breakdown...
    const devicePipeline = [
      {
        $match: {
          postId: new mongoose.Types.ObjectId(postid),
          userAgentHash: { $ne: null, $nin: [undefined, ''] },
          createdAt: { $gte: intervalStartMs }
        }
      },
      {
        $group: {
          _id: '$userAgent',
          count: { $sum: 1 }
        }
      }
    ];

    const uniqueUAs = await Views.aggregate(devicePipeline);
    const deviceCounts: Record<string, number> = { desktop: 0, laptop: 0, mobile: 0, tablet: 0 };

    for (const uaItem of uniqueUAs) {
      const parser = new UAParser(uaItem._id);
      const device = parser.getDevice();
      const cpu = parser.getCPU();

      let deviceType = 'desktop';
      if (device.type === 'mobile')  deviceType = 'mobile';
      else if (device.type === 'tablet') deviceType = 'tablet';
      else {
        if (cpu.architecture === 'amd64') deviceType = 'desktop';
        else deviceType = 'laptop';

      }

      deviceCounts[deviceType] += uaItem.count;
    }

    const totalDeviceViews = Object.values(deviceCounts).reduce((sum:number , c:number) => sum + c , 0);

    const deviceBreakdown = Object.entries(deviceCounts)
      .map(([device, count]) => ({
        device: capitalizeString(device),
        percentage: totalDeviceViews > 0 ? Math.round((count / totalDeviceViews) * 100) : 0
      }))
      .sort((a, b) => b.percentage - a.percentage);

    const metrics = {
        views: viewsCount,
        likes: likesCount,
        comments: commentsCount,
        shares: repostsCount,
        bookmarks: bookmarksCount,
        reach,
        impressions: viewsCount,
        engagementRate: ((likesCount + commentsCount + repostsCount + bookmarksCount) / Math.max(1, viewsCount) * 100).toFixed(1),
        demographics: {
            age: ageDemographics,
            gender: genderDemographics,
            locations
        },
        deviceBreakdown,
        hourlyEngagement,
        topPerformingDays
    };

    return NextResponse.json({ message: "Metrics fetched successfully!", metric: metrics }, { status: 200 });
}

export const getProfileDashboardAnalyticsService = async (handle:string , pastTime:string, year:number) => {
  await connectWithMongoDB() ; // connecting with mongodb...

  const user = await getDecodedDataFromCookie("accessToken");
  if (user instanceof Error) return NextResponse.json({ message: user.message }, { status: 401, statusText: 'UNAUTHORIZED REQUEST...' });
    
  const activeAcc = await accounts.findOne({ userId: user.id , 'account.Active':true });
  if (!activeAcc) return NextResponse.json({ message: 'Current account not found' }, { status: 404 });

  if (handle.substring(1) !== activeAcc.username)  return NextResponse.json({ message:'Account handle mismatch !!' },{ status:200 }) ;
  
  // fetching respective data from DB...
  const pastTimeMS = new Date(pastTime) ;

  // followers stats...
  const followers = (await follows.find({ followingId:activeAcc._id  })).length ;
  const followersAfterTime = (await follows.find({ $and:[{ followingId:activeAcc._id },{ createdAt:{ $gte:pastTimeMS } }] })).length ;
  const followersRate = followers > followersAfterTime ? Math.ceil( followersAfterTime / ( followers - followersAfterTime ) ) * 100 : 0 ; // getting percentage change...

  // followings stats...
  const followings = (await follows.find({ $and:[{ followerId:activeAcc._id  },{ isDeleted:false }]})).length ;
  const followingsAfterTime = (await follows.find({ $and:[{ followerId:activeAcc._id },{ createdAt:{ $gte:pastTimeMS } },{ isDeleted:false }] })).length ;
  const followingsRate = followings > followingsAfterTime ? Math.ceil( followingsAfterTime / ( followings - followingsAfterTime ) ) * 100 : 0 ;
  
  // likes stats...
  const accountPost = await Post.find({ $and:[{ authorId:activeAcc._id },{ isDeleted:false }] }) ;
  const postids = [...accountPost.map(post => post._id),activeAcc._id] ; // added account id in it...
  const Likes = (await likes.find({ targetEntity:{ $in:postids } })).length ;
  const LikesAfterTime = (await likes.find({ $and:[{ targetEntity:{ $in:postids } },{ createdAt:{ $gte:pastTimeMS }}] })).length ;
  const likesRate = Likes > LikesAfterTime ? Math.ceil( LikesAfterTime / ( Likes - LikesAfterTime ) ) * 100 : 0 ;

  // comments stats...
  const comments = (await Post.find({ $and:[{ replyToPostId:{ $in:postids } },{ postType:'comment'  },{ isDeleted:false }] })).length ;
  const commentsAfterTime = (await Post.find({ $and:[{ replyToPostId:{ $in:postids } },{ postType:'comment'  },{ isDeleted:false },{ createdAt:{ $gte:pastTimeMS }}] })).length ;
  const commentsRate = comments > commentsAfterTime ? Math.ceil( commentsAfterTime / ( comments - commentsAfterTime ) ) * 100 : 0 ;

  // repost stats...
  const reposts = (await Post.find({ $and:[{ repostId:{ $in:postids } },{ postType:'repost' },{ isDeleted:false }] })).length ; 
  const repostsAfterTime = (await Post.find({ $and:[{ repostId:{ $in:postids } },{ postType:'repost' },{ isDeleted:false },{ createdAt:{ $gte:pastTimeMS }}] })).length ; 
  const repostsRate = reposts > repostsAfterTime ? Math.ceil( repostsAfterTime / ( reposts - repostsAfterTime ) ) * 100 : 0 ;

  // views stats...
  const views = (await Views.find({ $and:[{ postId:{ $in:postids } },{ isQualified:true }] })).length ;
  const viewsAfterTime = (await Views.find({ $and:[{ postId:{ $in:postids } },{ isQualified:true },{ createdAt:{ $gte:pastTimeMS }}] })).length ;
  const viewsRate = views > viewsAfterTime ? Math.ceil( viewsAfterTime / ( views - viewsAfterTime ) ) * 100 : 0 ;

  // bookmarks stats...
  const bookmarks = (await tagged.find({ $and:[{ entityId:{ $in:postids }},{ taggedAs:'bookmarked' }]})).length ;
  const bookmarksAfterTime = (await tagged.find({ $and:[{ entityId:{ $in:postids }},{ taggedAs:'bookmarked' },{ createdAt:{ $gte:pastTimeMS }}]})).length ;
  const bookmarksRate = bookmarks > bookmarksAfterTime ? Math.ceil( bookmarksAfterTime / ( bookmarks - bookmarksAfterTime ) ) * 100 : 0 ;

  // visitors related stats...
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  // aggregation pipeline for views...
  const monthlyData = await Views.aggregate([
    {
      $match: {
        postId: { $in: postids },
        isQualified: true,
        createdAt: { $gte: new Date(year, 0, 1), $lt: new Date(year + 1, 0, 1) }
      }
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        viewers: { $sum: 1 }
      }
    }
  ]);
  const viewsMap = new Map(monthlyData.map((d: any) => [d._id - 1, d.viewers]));
  const viewersSeries = monthNames.map((name, i) => ({ name , viewers: viewsMap.get(i) || 0 }));

  // calculating viewership based on device type...
  const deviceTypes = ['tablet', 'mobile', 'laptop', 'desktop'];
  const deviceCounts: Record<string, number> = { desktop: 0, laptop: 0, mobile: 0, tablet: 0 };
  const devicePipeline = [
    {
      $match: {
        postId: { $in: postids },
        isQualified: true,
        createdAt: { $gte: pastTimeMS }
      }
    },
    {
      $group: {
        _id: '$userAgent',
        count: { $sum: 1 }
      }
    }
  ];

  const uniqueUAs = await Views.aggregate(devicePipeline);
  for (const ua of uniqueUAs) {
    const devicetype = capitalizeString(getDeviceType(ua)) ; 
    deviceCounts[devicetype] += ua.count;
  }
  const totalDeviceCount = Object.values(deviceCounts).reduce((acc,count) => acc + count , 0) ;
  const deviceStats = deviceTypes.map(name => ({ name , value: (Math.ceil((deviceCounts[name] || 0 )/totalDeviceCount) * 100 ) }));

  // gender demographics stats...
  const genderDemoPipeline = [
        {
          $match: {
            postId: { $in:postids },
            viewerId: { $ne: null },
            createdAt:{ $gte : pastTimeMS }
          }
        },
        {
          $lookup: {
            from: 'accounts',
            localField: 'viewerId',
            foreignField: '_id',
            as: 'account',
            pipeline: [
              { $match: { 'account.status': 'ACTIVE' } }
            ]
          }
        },
        { 
          $unwind: { path: '$account', preserveNullAndEmptyArrays: true } 
        },
        {
          $match: {
            ['account.interests.gender']: { $nin: [null, undefined, ''] }
          }
        },
        {
          $group: {
            _id: '$account.interests.gender',
            count: { $sum: 1 }
          }
        }
      ];

  const genders = ['male','female','others'];
  const genderData = await Views.aggregate(genderDemoPipeline);
  const genderMap = new Map(genderData.map(data => [data._id, data.count || 0]));

  let totalGenderCount : number = 0 ;
  genders.forEach(gender => {
    totalGenderCount += genderMap.get(gender) ;
  });

  // final gender demographics...
  const genderDemographics = genders.map(gender => ({
    name: capitalizeString(gender),
    value: totalGenderCount > 0 ? (Math.ceil((genderMap.get(gender) || 0) / totalGenderCount) * 100 ) : 0
  })); 

    // fetching top 5 posts...
    const topPostsRaw = await Promise.all(accountPost.map(async (post,i) => {
      const views = await viewStat.find({ $and:[{ postId:post._id }] }) ;
      const likess = await likes.find({ $and:[{ targetEntity:post._id },{ createdAt:{ $gte:pastTimeMS }}] }) ;
      const comments = await Post.find({ $and:[{ replyToPostId:post._id },{ postType:'comment'  },{ isDeleted:false },{ createdAt:{ $gte:pastTimeMS }}] });

      return {
        num: i + 1 ,
        id:post._id ,
        title:post.content ,
        views:views.length ,
        likes:likess.length ,
        comments:comments.length
      }
    }));
    const topPosts = topPostsRaw.sort((post1,post2) => post2.views - post1.views || post2.likes - post1.likes || post2.comments - post1.comments).slice(0,4);


    // fetching recent 5 posts from account...
    const recentPost = await Promise.all(accountPost.sort((post_1,post_2) => new Date(post_2.createdAt).getTime() - new Date(post_1.createdAt).getTime()).slice(0,4).map( async (post,i) =>{
      const views = await viewStat.find({ $and:[{ postId:post._id }] }) ;
      const likess = await likes.find({ $and:[{ targetEntity:post._id },{ createdAt:{ $gte:pastTimeMS }}] }) ;
      const comments = await Post.find({ $and:[{ replyToPostId:post._id },{ postType:'comment'  },{ isDeleted:false },{ createdAt:{ $gte:pastTimeMS }}] });
      return {
        num: i + 1 ,
        id:post._id ,
        title:post.content ,
        date:new Date(post.createdAt).toUTCString(),
        views:views.length ,
        likes:likess.length ,
        comments:comments.length
      }
    }));

    // calculating top 5 country usage...    
    // "Mehrauli Tehsil, IN" general structure...
    const areaWiseViewPipeline = [
        {
          $match: {
            postId: { $in:postids },
            viewerId: { $ne: null },
            createdAt:{ $gte : pastTimeMS }
          }
        },
        {
          $lookup: {
            from: 'accounts',
            localField: 'viewerId',
            foreignField: '_id',
            as: 'account',
            pipeline: [ { $match: { 'account.status': 'ACTIVE' } } ]
          }
        },
        { 
          $unwind: { path: '$account', preserveNullAndEmptyArrays: true } 
        },
        {
          $match: {
            ['account.location.text']: { $nin: [null, undefined, ''] }
          }
        },
        {
           $group: {
             _id: {
               $trim: {
                 input: {
                   $arrayElemAt: [
                     { $split: ["$account.location.text", ","] },1
                   ]
                 }
                }
             },
             count: { $sum: 1 }
           }
        }
     ];
     const locationWiseViewData = await Views.aggregate(areaWiseViewPipeline) ;
     const locationSorted = locationWiseViewData.sort((loc_1,loc_2) => loc_2.count - loc_1.count ).slice(0,4) ;

     let locationCount : number = 0 ;
     locationSorted.forEach((loc) => locationCount += loc.count ) ;
     
     const finalLocationDemo = locationSorted.map((loc) => {
      const percentage = Math.ceil(loc.count/locationCount)  * 100 ;

      return {
        country: loc._id ,
        percent: percentage
      }
     }) ;

     // media content posted...
    const mediaCounts : Record<string,number> = { videos:0 , images:0 , raw:0 , auto:0 } ;
    const totalMediasArr = accountPost.map(post => post.mediaUrls) ;

    totalMediasArr.forEach(media => mediaCounts[media.media_type] += 1) ;
    
    const finalMediaArr = Object.keys(mediaCounts).map(key => {
      return { name:capitalizeString(key) , value:mediaCounts[key] } ;
    })

    // actions values for bar chart...
    const actionForBarGraph = 
    [
        { name: "Likes", value: LikesAfterTime },
        { name: "Comments", value: commentsAfterTime },
        { name:"views" , value: viewsAfterTime },
        { name: "Repost", value: repostsAfterTime },
        { name: "Bookmarks", value: bookmarksAfterTime }
    ]

  // calculating followers trend 
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const followersCount: Record<string, number> = { Sunday: 0, Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0 };

  const followersAfterTimeDocs = await follows.find({
    $and: [
      { followingId: activeAcc._id },
      { createdAt: { $gte: pastTimeMS } },
      { isDeleted: false }
    ]
  });

  followersAfterTimeDocs.forEach((followerDoc) => {
    const dateOfCreation = new Date(followerDoc.createdAt);
    const dayName = weekdays[dateOfCreation.getDay()];
    followersCount[dayName] += 1;
  });

  const growthSeries = weekdays.map((day) => ({
    name: day,
    value: followersCount[day] || 0
  }));

  // final response payload matching frontend expectations
  const analyticsPayload = {
    overview: {
      followers: { value: followers, rate: followersRate > 0 ? `+${followersRate}%` : '0%' },
      followings: { value: followings, rate: followingsRate > 0 ? `+${followingsRate}%` : '0%' },
      likes: { value: Likes, rate: likesRate > 0 ? `+${likesRate}%` : '0%' },
      comments: { value: comments, rate: commentsRate > 0 ? `+${commentsRate}%` : '0%' },
      reposts: { value: reposts, rate: repostsRate > 0 ? `+${repostsRate}%` : '0%' },
      views: { value: views, rate: viewsRate > 0 ? `+${viewsRate}%` : '0%' },
      bookmarks: { value: bookmarks, rate: bookmarksRate > 0 ? `+${bookmarksRate}%` : '0%' }
    },
    visitorseries: viewersSeries,
    genderbreakdown: genderDemographics,
    devicebreakdown: deviceStats,
    recentuploads: recentPost,
    topcountries: finalLocationDemo,
    topposts: topPosts,
    growthseries: growthSeries,
    interactiontypes: actionForBarGraph,
    contentperformance: finalMediaArr
  };

  return analyticsPayload ;
}

