import { NextRequest , NextResponse } from "next/server";
import asyncErrorHandler from "../middleware/errorMiddleware";
import { generateReportInPDF } from "@/lib/accountreports";
import { getProfileDashboardAnalyticsService } from "../db/services/analytics";

export const runtime = "nodejs"; // for running the controller on node edge runtime...

function generateSampleData() {
  const transformedData = {
    // Overview metrics - mapped from user stats
    overview: {
      followers: {
        value:54820803,
        rate:'+12.5%'
      },
      followings:{
        value:322,
        rate:'+0.1%'
      },
      likes: {
        value:26373493,
        rate:'+4.2%'
      } ,
      comments: {
        value:48938,
        rate:'-2.7%'
      } ,
      reposts:{
        value:421,
        rate:'+0.5%'
      },
      views: {
        value:42448203,
        rate:'-2.1%'
      },
      bookmarks:{
        value:105,
        rate:'+1.2%'
      }
    },
    // Watch time - default values
    watchTime: { hour:'1', min:'36', sec:'10', rate:'+4.4%' },

    // Viewers series - from charts or default
    viewersSeries: [
    { name: "Jan", viewers: 22000 },
    { name: "Feb", viewers: 25000 },
    { name: "Mar", viewers: 32000 },
    { name: "Apr", viewers: 54000 },
    { name: "May", viewers: 60000 },
    { name: "Jun", viewers: 30000 },
    { name: "Jul", viewers: 6000 },
    { name: "Aug", viewers: 29000 },
    { name: "Sep", viewers: 70000 },
    { name: "Oct", viewers: 100000 },
    { name: "Nov", viewers: 80000 },
    { name: "Dec", viewers: 55000 },
  ],
    // Device breakdown - default values
    deviceBreakdown: [
      { name: 'Desktop', value: 30 },
      { name: 'Mobile', value: 60 },
      { name: 'Tablet', value: 10 }
    ],
    // Gender breakdown - default values
    genderBreakdown: [
      { name: 'Male', value: 50 },
      { name: 'Female', value: 45 },
      { name: 'Other', value: 5 }
    ],
    // Recent uploads - mapped from posts
    recentUploads: [
        {
          num: 1,
          id:"IBFI(@$HFE@_#(",
          title: "This incredible natural attraction is one of the must-visits",
          date: "22-02-2023",
          views: 837748,
          likes: 24467,
          comments: 2578,
        },
        {
          num: 2,
          id:"@(*RH@EF)_E)F",
          title: "The Skywalk, a glass leading out over the valley",
          date: "24-02-2023",
          views: 384753,
          likes: 87765,
          comments: 4766,
        },
        {
          num: 3,
          id:"NFD_@DEMIF$@",
          title: "Summer is the most popular time to visit these beaches",
          date: "26-02-2023",
          views: 296087,
          likes: 86298,
          comments: 3498,
        },
        {
          num: 4,
          id:"NFBU@EIF)#femi2",
          title: "The White House is the official residence for the President",
          date: "28-02-2023",
          views: 876753,
          likes: 98365,
          comments: 7876,
        },
    ],
    // Top countries - default values
    topCountries: [
      { country: 'United States', percent: 30 },
      { country: 'India', percent: 25 },
      { country: 'United Kingdom', percent: 15 },
      { country: 'Germany', percent: 10 },
      { country: 'Canada', percent: 8 }
    ],
    // Top posts - mapped from posts
    topPosts : [
       {
          num:1,
          id: "p1",
          title: "Epic Sunrise Timelapse",
          views: 1200000,
          likes: 900000,
          comments: 9.2,
        },
        {
          num:2,
          id: "p2",
          title: "Street Food Tour",
          views: 840000,
          likes: 600000,
          comments: 7.1,
        },
        {
          num:3,
          id: "p3",
          title: "DIY Home Gym Setup",
          views: 610000,
          likes: 480000,
          comments: 6.5,
        },  
    ],
    // Growth series - from charts
    growthSeries: [
      { name: "Day 1", value: 120 },
      { name: "Day 2", value: 140 },
      { name: "Day 3", value: 180 },
      { name: "Day 4", value: 210 },
      { name: "Day 5", value: 150 },
      { name: "Day 6", value: 600 },
      { name: "Day 7", value: 300 }
    ],
    // Interaction types - default values
    interactionTypes: [
      { name: 'Likes', value: 60 },
      { name: 'Comments', value: 25 },
      { name: 'Shares', value: 10 },
      { name: 'Saves', value: 5 }
    ],
    // Content performance - default values
    contentPerformance: [
      { name: 'Videos', value: 45 },
      { name: 'Images', value: 35 },
      { name: 'Text', value: 15 },
      { name: 'Other', value: 5 }
    ]
  };

  return transformedData;
}

export const generateReportForAccount = asyncErrorHandler( async (request:NextRequest) => { 
    const { timeframe , handle , year , type } = await request.json() ;

    if (!timeframe?.trim() || !handle?.trim() || isNaN(Number(year)) || !type?.trim()) {
        console.log("One OR More neccessary credentials missing !!");
        return NextResponse.json({ message:"Check incoming credentials..." },{ status:404 });
    }

        // const reportData = await getProfileDashboardAnalyticsService(handle,timeframe,year);
       let pdfBuffer = await generateReportInPDF(generateSampleData());

    // converting array buffer into Uint8Array...
    const uint8Array = new Uint8Array(pdfBuffer);
    
    const arrayBuffer = uint8Array.buffer.slice(
      uint8Array.byteOffset,
      uint8Array.byteOffset + uint8Array.byteLength
    ) as ArrayBuffer;
    
    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment"`,
      },
    });

})
