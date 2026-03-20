import { connectWithMongoDB } from "../dbConnection";
import { UAParser } from 'ua-parser-js';
import mongoose from "mongoose";
import accounts from "../models/accounts";
import { getDecodedDataFromCookie } from "@/lib/cookiehandler";
import { NextResponse } from "next/server";
import viewStat from "../models/viewstat";
import likes from "../models/likes";
import tagged from "../models/tagged";
import Views from "../models/views";
import Post from "../models/posts";


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
