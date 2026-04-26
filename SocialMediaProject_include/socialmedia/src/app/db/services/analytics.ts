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
  const followersRate = followers > followersAfterTime ? ( followersAfterTime / ( followers - followersAfterTime ) ) * 100 : 0 ; // getting percentage change...

  // followings stats...
  const followings = (await follows.find({ followerId:activeAcc._id  })).length ;
  const followingsAfterTime = (await follows.find({ $and:[{ followerId:activeAcc._id },{ createdAt:{ $gte:pastTimeMS } }] })).length ;
  const followingsRate = followings > followingsAfterTime ? ( followingsAfterTime / ( followings - followingsAfterTime ) ) * 100 : 0 ;
  
  // likes stats...
  const accountPost = await Post.find({ $and:[{ authorId:activeAcc._id },{ isDeleted:false }] }) ;
  const postids = [...accountPost.map(post => post._id),activeAcc._id] ; // added account id in it...
  const Likes = (await likes.find({ targetEntity:{ $in:postids } })).length ;
  const LikesAfterTime = (await likes.find({ $and:[{ targetEntity:{ $in:postids } },{ createdAt:{ $gte:pastTimeMS }}] })).length ;
  const likesRate = Likes > LikesAfterTime ? ( LikesAfterTime / ( Likes - LikesAfterTime ) ) * 100 : 0 ;

  // comments stats...
  const comments = (await Post.find({ $and:[{ replyToPostId:{ $in:postids } },{ postType:'comment'  },{ isDeleted:false }] })).length ;
  const commentsAfterTime = (await Post.find({ $and:[{ replyToPostId:{ $in:postids } },{ postType:'comment'  },{ isDeleted:false },{ createdAt:{ $gte:pastTimeMS }}] })).length ;
  const commentsRate = comments > commentsAfterTime ? ( commentsAfterTime / ( comments - commentsAfterTime ) ) * 100 : 0 ;

  // repost stats...
  const reposts = (await Post.find({ $and:[{ repostId:{ $in:postids } },{ postType:'repost' },{ isDeleted:false }] })).length ; 
  const repostsAfterTime = (await Post.find({ $and:[{ repostId:{ $in:postids } },{ postType:'repost' },{ isDeleted:false },{ createdAt:{ $gte:pastTimeMS }}] })).length ; 
  const repostsRate = reposts > repostsAfterTime ? ( repostsAfterTime / ( reposts - repostsAfterTime ) ) * 100 : 0 ;

  // views stats...
  const views = (await Views.find({ $and:[{ postId:{ $in:postids } },{ isQualified:true }] })).length ;
  const viewsAfterTime = (await Views.find({ $and:[{ postId:{ $in:postids } },{ isQualified:true },{ createdAt:{ $gte:pastTimeMS }}] })).length ;
  const viewsRate = views > viewsAfterTime ? ( viewsAfterTime / ( views - viewsAfterTime ) ) * 100 : 0 ;

  // bookmarks stats...
  const bookmarks = (await tagged.find({ $and:[{ entityId:{ $in:postids }},{ taggedAs:'bookmarked' }]})).length ;
  const bookmarksAfterTime = (await tagged.find({ $and:[{ entityId:{ $in:postids }},{ taggedAs:'bookmarked' },{ createdAt:{ $gte:pastTimeMS }}]})).length ;
  const bookmarksRate = bookmarks > bookmarksAfterTime ? ( bookmarksAfterTime / ( bookmarks - bookmarksAfterTime ) ) * 100 : 0 ;

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
  const deviceStats = deviceTypes.map(name => ({ name , value: Math.ceil(((deviceCounts[name] || 0 )/totalDeviceCount) * 100 ) }));

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

  let totalGenderCount = 0 ;
  genders.forEach(gender => {
    totalGenderCount += genderMap.get(gender) ;
  });

  // final gender demographics...
  const genderDemographics = genders.map(gender => ({
    name: capitalizeString(gender),
    value: totalGenderCount > 0 ? Math.ceil(((genderMap.get(gender) || 0) / totalGenderCount) * 100 ) : 0
  })); 

  // fetching five recent posts...
  // {
//           num: 1,
//           id:"IBFI(@$HFE@_#(",
//           title: "This incredible natural attraction is one of the must-visits",
//           date: "22-02-2023",
//           views: 837748,
//           likes: 24467,
//           comments: 2578,
//         }

// const viewsCount = await viewStat.find({ $and:[{ postId:post._id }] }) ;
//       const likesCount = await likes.find({ $and:[{ targetEntity:post._id },{ createdAt:{ $gte:pastTimeMS }}] }) ;
//       const commentsCount = await Post.find({ $and:[{ replyToPostId:post._id },{ postType:'comment'  },{ isDeleted:false },{ createdAt:{ $gte:pastTimeMS }}] });

//       return {
//         num: i + 1 ,
//         id:post._id ,
//         title:post.content ,
//         date:new Date(post.createdAt).toUTCString() ,
//         views:viewsCount.length ,
//         likes:likesCount.length ,
//         comments:commentsCount.length 
    const recentPost = accountPost.sort((post_1,post_2) => new Date(post_1.createdAt) - new Date(post_2.createdAt))


}

//     // overview of accounts (total interaction values...)
// {
//     followers: {
//       value:54820803,
//       rate:'+12.5%'
//     },
//     followings:{
//       value:322,
//       rate:'+0.1%'
//     },
//     likes: {
//       value:26373493,
//       rate:'+4.2%'
//     } ,
//     comments: {
//       value:48938,
//       rate:'-2.7%'
//     } ,
//     reposts:{
//       value:421,
//       rate:'+0.5%'
//     },
//     views: {
//       value:42448203,
//       rate:'+5.1%'
//     },
//     bookmarks:{
//       value:105,
//       rate:'+1.2%'
//     }
//   }

//       // Visitor series for chart...
//      [
//         { name: "Jan", visitors: 22000 },
//         { name: "Feb", visitors: 25000 },
//         { name: "Mar", visitors: 32000 },
//         { name: "Apr", visitors: 54000 },
//         { name: "May", visitors: 37000 },
//         { name: "Jun", visitors: 28000 },
//         { name: "Jul", visitors: 66000 },
//         { name: "Aug", visitors: 59000 },
//         { name: "Sep", visitors: 42000 },
//         { name: "Oct", visitors: 46000 },
//         { name: "Nov", visitors: 48000 },
//         { name: "Dec", visitors: 52000 },
//       ];

//       // Device breakdown
//       [
//         { name: "Desktop", value: 23 },
//         { name: "Mobile", value: 44 },
//         { name: "Tablet", value: 33 },
//       ];

//       // Gender breakdown for Profile Visitors
//      [
//         { name: "Male", value: 52 },
//         { name: "Female", value: 44 },
//         { name: "Other", value: 4 },
//       ]

//       // Recent uploads
//       [
//         {
//           num: 1,
//           id:"IBFI(@$HFE@_#(",
//           title: "This incredible natural attraction is one of the must-visits",
//           date: "22-02-2023",
//           views: 837748,
//           likes: 24467,
//           comments: 2578,
//         },
//         {
//           num: 2,
//           id:"@(*RH@EF)_E)F",
//           title: "The Skywalk, a glass leading out over the valley",
//           date: "24-02-2023",
//           views: 384753,
//           likes: 87765,
//           comments: 4766,
//         },
//         {
//           num: 3,
//           id:"NFD_@DEMIF$@",
//           title: "Summer is the most popular time to visit these beaches",
//           date: "26-02-2023",
//           views: 296087,
//           likes: 86298,
//           comments: 3498,
//         },
//         {
//           num: 4,
//           id:"NFBU@EIF)#femi2",
//           title: "The White House is the official residence for the President",
//           date: "28-02-2023",
//           views: 876753,
//           likes: 98365,
//           comments: 7876,
//         },
//       ]

//       // Top countries
//       [
//         { country: "United States", percent: 34 },
//         { country: "India", percent: 21 },
//         { country: "Brazil", percent: 12 },
//         { country: "UK", percent: 8 },
//         { country: "Germany", percent: 5 },
//       ];

//       // Top posts (content performance)
//         [{
//           num:1,
//           id: "p1",
//           title: "Epic Sunrise Timelapse",
//           views: 1200000,
//           reach: 900000,
//           engagement: 9.2,
//         },
//         {
//           num:2,
//           id: "p2",
//           title: "Street Food Tour",
//           views: 840000,
//           reach: 600000,
//           engagement: 7.1,
//         },
//         {
//           num:3,
//           id: "p3",
//           title: "DIY Home Gym Setup",
//           views: 610000,
//           reach: 480000,
//           engagement: 6.5,
//         },  ]

//       // Follower growth series (sparkline)
//         [{ name: "Day 1", value: 120 },
//         { name: "Day 2", value: 140 },
//         { name: "Day 3", value: 180 },
//         { name: "Day 4", value: 210 },
//         { name: "Day 5", value: 260 },
//         { name: "Day 6", value: 300 },
//         { name: "Day 7", value: 350 }]

//       // Interaction type breakdown
//         [{ name: "Likes", value: 62 },
//         { name: "Comments", value: 18 },
//         { name: "Saves", value: 10 },
//         { name: "Shares", value: 10 }]

 // content performance breakdown
    // { name: "Videos", value:32 },
    // { name: "Images", value:41 },
    // { name: "Gifs", value:10 },
    // { name: "Mixed", value:2 }
