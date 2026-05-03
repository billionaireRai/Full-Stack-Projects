'use client'

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
  RadialBarChart,
  RadialBar,
  CartesianGrid,
} from "recharts";
import {
  FiUsers,
  FiArrowUp,
  FiArrowDown,
} from "react-icons/fi";
import { BsFilePdf, BsFillPersonCheckFill, BsGlobe } from "react-icons/bs";
import { HiOutlineSparkles } from "react-icons/hi";
import Customdropdown from "@/components/customdropdown";
import Notaccessablepop from "@/components/notaccessablepop";
import useActiveAccount from "@/app/states/useraccounts";
import RequireSubscription from "@/components/requireSubscription";
import useUpgradePop from "@/app/states/upgradePop";
import { useTheme } from "next-themes";
import { MdAnalytics, MdImportExport, MdSpaceDashboard } from "react-icons/md";
import { User, Loader2, Bookmark, UserRoundPlus, UserRoundMinus, ArrowBigLeft, ArrowBigRight, View, MessagesSquare, RefreshCw, ThumbsUp, Eye, Monitor, Users, Heart, Smile, BarChart3, TrendingUp, Upload } from "lucide-react";
import axiosInstance from "@/lib/interceptor";
import toast from "react-hot-toast";


interface overViewData {
  value:number;
  rate:string;
}
interface Overview {
  followers: overViewData ;
  followings:overViewData
  likes: overViewData ;
  comments: overViewData ;
  reposts: overViewData ;
  views: overViewData ;
  bookmarks:overViewData;
}

interface VisitorSeriesItem {
  name: string;
  viewers: number;
}

interface BreakdownItem {
  name: string;
  value: number;
}

interface RecentUploadItem {
  num:number;
  id: string;
  title: string;
  date: string;
  views: number;
  likes: number;
  comments: number;
}

interface TopCountryItem {
  country: string;
  percent: number;
}

interface TopPostItem {
  num: number;
  id:string;
  title: string;
  views: number;
  likes: number;
  comments: number;
}

interface GrowthSeriesItem {
  name: string;
  value: number;
}

interface InteractionTypeItem {
  name: string;
  value: number;
}

interface watchTimeType {
  hour:string ;
  min:string ;
  sec:string ;
  rate:string ;
}

// Custom Tooltip for Recharts with dark mode support
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="relative overflow-hidden rounded-xl border border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-black backdrop-blur-sm shadow-xl shadow-gray-900/10 dark:shadow-black/30 p-3 min-w-[180px]">
        {/* label header */}
        <div className="flex items-center gap-2 mb-2.5 px-3 py-2 border-b rounded-lg border-gray-100 dark:border-gray-900">
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
          <p className="text-xs font-semibold tracking-wide uppercase text-gray-500 dark:text-gray-400">
            {label}
          </p>
        </div>

        {/* data rows */}
        <div className="space-y-2">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full ring-4 ring-white dark:ring-gray-950"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                  {entry.dataKey}
                </span>
              </div>
              <span
                className="text-sm font-bold tabular-nums"
                style={{ color: entry.color }}
              >
                {entry.value?.toLocaleString?.() ?? entry.value}
              </span>
            </div>
          ))}
        </div>
      
      </div>
    );
  }
  return null;
};

export default function UserAnalytics() {
  // UI state
  const date = new Date() ;
  const [timeRange, setTimeRange] = useState({ value:'7d',label:'7 days',priority:"1" });
  const [loading, setLoading] = useState<boolean>(false); // used for loading animation...
  const { Account } = useActiveAccount() ; // getting the logged in account...
  const { isPop , setisPop } = useUpgradePop() ;
  const showNotAccessable:boolean = (!Account.account?.isVerified && Account.account?.plan === 'Free' ? true : false) ;
  const [Year, setYear] = useState<number>(date.getFullYear()) ;
  const joinedDate = new Date('01-05-2020') ;  // will pass argument as 'Account.account?.joinDate'
  const router = useRouter() ; // initializing router hook...
  const [watchTime, setwatchTime] = useState<watchTimeType>({
    hour:'1',
    min:'36',
    sec:'10',
    rate:'+4.4%'
  })
  const [viewersSeries, setviewersSeries] = useState<VisitorSeriesItem[]>([
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
  ]);
  const [deviceBreakdown, setDeviceBreakdown] = useState<BreakdownItem[]>([
    { name: "Desktop", value: 23 },
    { name: "Mobile", value: 44 },
    { name: "Tablet", value: 33 },
  ]);
  const [genderBreakdown, setGenderBreakdown] = useState<BreakdownItem[]>([
    { name: "Male", value: 52 },
    { name: "Female", value: 44 },
    { name: "Other", value: 4 },
  ]);
  const [recentUploads, setRecentUploads] = useState<RecentUploadItem[]>(
    [
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
      ]
  );
  const [topCountries, setTopCountries] = useState<TopCountryItem[]>(
     [
        { country: "United States", percent: 34 },
        { country: "India", percent: 21 },
        { country: "Brazil", percent: 12 },
        { country: "UK", percent: 8 },
        { country: "Germany", percent: 5 },
      ]
  );
  const [topPosts, setTopPosts] = useState<TopPostItem[]>(
    [
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
    ]
  );
  const [growthSeries, setGrowthSeries] = useState<GrowthSeriesItem[]>( 
    [
      { name: "Day 1", value: 120 },
      { name: "Day 2", value: 140 },
      { name: "Day 3", value: 180 },
      { name: "Day 4", value: 210 },
      { name: "Day 5", value: 150 },
      { name: "Day 6", value: 600 },
      { name: "Day 7", value: 300 }
    ]);
  const [interactionTypes, setInteractionTypes] = useState<InteractionTypeItem[]>(
    [ 
      { name: "Likes", value: 62 },
      { name: "Comments", value: 50 },
      { name: "Saves", value: 5 },
      { name: "Shares", value: 20 }
    ]
  );
  const [contentPerformance, setContentPerformance] = useState<BreakdownItem[]>([
    { name: "Videos", value:122 },
    { name: "Images",  value:233 },
    { name: "Raws", value:10 },
    { name: "Autos", value:2 }
  ]);
  const [timeArray, settimeArray] = useState(
    [{value:"7d",label:'7 days', priority:"1"},{value:"30d",label:'30 days', priority:"2"},{value:"90d",label:'90 days', priority:"3"},{value:"1y",label:'1 year', priority:"4"},{value:"2y",label:'2 years', priority:"5"}]
  )

  const { theme } = useTheme();
  const tickColor = theme === 'dark' ? '#D1D5DB' : '#6B7280';
  // up from here review 

  // Colors used for charts for uniformity...
  const COLORS = ["#FF7A59", "#4EE1A0", "#7CC6FF", "#FFD86B", "#B28DFF"];

  // Analytics data states
  const [overview, setOverview] = useState<Overview>({
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
  });


  // function for formating the number includes 10 % error...
  const fmt = (n: number): string => {
    if (n >= 1e9) return (n / 1e9).toFixed(1) + "B";  // 1e9 = 1 * math.pow(10,9) where e = 10 ;
    if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
    if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
    return String(n); // number is in hundreds...
  };

  // function to get analytics data...
  async function functionToGetAnalytics() {
     const analyticsApi = await axiosInstance.post('/api/dashboard',{ handle:Account.decodedHandle , pastTime:timeRange.value , year:Year });
     if (analyticsApi.status === 200) {
      setOverview(analyticsApi.data.analytics.overview);
      setviewersSeries(analyticsApi.data.analytics.visitorseries);
      setGenderBreakdown(analyticsApi.data.analytics.genderbreakdown);
      setDeviceBreakdown(analyticsApi.data.analytics.devicebreakdown);
      setRecentUploads(analyticsApi.data.analytics.recentuploads);
      setTopCountries(analyticsApi.data.analytics.topcountries);
      setTopPosts(analyticsApi.data.analytics.topposts);
      setGrowthSeries(analyticsApi.data.analytics.growthseries);
      setInteractionTypes(analyticsApi.data.analytics.interactiontypes);
      setContentPerformance(analyticsApi.data.analytics.contentperformance);
      
     }
    }

  // useffect for loading data from backend logic...
  // useEffect(() => {
  //   async function fetchData() {
  //     setLoading(true);
  //     try {
  //       await functionToGetAnalytics();
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  //   // fetchData();
  // }, [timeRange,Year]);

  // logic for advance analytics...
  const kpis = useMemo(() => {
    const avgDaily = Math.round(viewersSeries.reduce((s, m) => s + (m.viewers || 0), 0) / Math.max(viewersSeries.length, 1)); // total visitors per month...
    const topCountry = topCountries[0] || { country: "—", percent: 0 };
    const topPost = topPosts[0] || { title: "—", engagement: 0 };
    return {
      avgDailyViewers: avgDaily,
      topCountry,
      topPost,
    };
  }, [viewersSeries, topCountries, topPosts]);

// function handling PDF export logic...
  const handleReportExport = async (exportIn:string) => {
    if ((!Account.account?.isVerified && Account.account?.plan === 'Free') || (Account.account?.isVerified && Account.account?.plan === 'Pro')) {
      setisPop(true);
      return;
    }
    const toastLoading = toast.loading(`generating report for ${Account.decodedHandle}`);
    try {
      const reportApi = await axiosInstance.post(`/api/report`,{ timeframe:timeRange.value , handle:Account.decodedHandle, year:Year , type:exportIn },{ responseType: 'blob' });

      if (reportApi.status === 200) {
        toast.dismiss(toastLoading);
        toast.success('Report successfully downloaded !!');

        const url = window.URL.createObjectURL(reportApi.data);
        const a = document.createElement("a");
        a.href = url;
        a.download = `analytics-report-${Account.decodedHandle}-${new Date().toISOString()}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      toast.dismiss(toastLoading);
      toast.error('Failed to generate report');
    }
  }

  // foo rendering sparkling line...
  function Sparkline({ data, height = 40 }: { data: GrowthSeriesItem[]; height?: number }) {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="value"
            stroke="#F0b100"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  // loading section...
  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white font-poppins p-4">
        <div className="max-w-[1400px] mx-auto space-y-6">
          {/* Header skeleton */}
          <div className="flex items-center justify-between gap-4 animate-pulse">
            <div className="space-y-3">
              <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg" />
              <div className="h-4 w-64 bg-gray-200 dark:bg-gray-800 rounded" />
            </div>
            <div className="h-10 w-32 bg-gray-200 dark:bg-gray-800 rounded-lg" />
          </div>

          {/* Stats grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 bg-gray-100 dark:bg-gray-900 rounded-lg animate-pulse" />
            ))}
          </div>

          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <Loader2 className="w-10 h-10 animate-spin rounded-full text-yellow-500" />
          </div>

          {/* Main content skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-80 bg-gray-100 dark:bg-gray-900 rounded-xl animate-pulse" />
              <div className="h-64 bg-gray-100 dark:bg-gray-900 rounded-xl animate-pulse" />
            </div>
            <div className="space-y-4">
              <div className="h-56 bg-gray-100 dark:bg-gray-900 rounded-xl animate-pulse" />
              <div className="h-56 bg-gray-100 dark:bg-gray-900 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // function to return up/Down arrow icon...
  function UpDownArrow(rateString:string) {
    return (
      <>
      { parseFloat((rateString).substring(0,rateString.length -2)) > 0 ? <FiArrowUp /> : <FiArrowDown /> }
      </>
    )
  }

  return (
  <div className='h-full flex flex-col font-poppins'>
    <div className="h-fit p-4 bg-white dark:bg-black text-gray-900 dark:text-white font-poppins rounded-lg shadow-md">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold flex flex-row items-center gap-1.5"><MdSpaceDashboard /><span>Dashboard</span></h1>
            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              <div className="group relative inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-black/80 backdrop-blur-sm border border-gray-200/80 dark:border-gray-700/80 rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] hover:-translate-y-0.5">
                <User className="w-4 h-4 text-gray-700 dark:text-gray-300 flex-shrink-0" />
                <span className="font-medium text-gray-900 dark:text-gray-100 truncate max-w-[150px]">{Account.name}</span>
              </div>
              <Link 
                href={`/${Account.decodedHandle}`} 
                className="group relative inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.02] hover:-translate-y-0.5 hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-800 dark:hover:to-gray-700 text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100 font-semibold"
              >
                  <span>{Account.decodedHandle}</span>
                <svg className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Analytics snapshot for your account — last {timeRange.label}
            </p>
          </div>
          
          {/* Time Selection section */}
          <div className="flex items-center gap-3">
            <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 bg-gray-100 dark:bg-gray-900/60 rounded-xl p-1 border border-gray-200 dark:border-gray-700/50 shadow-inner">
              {timeArray.map((timeobj, index) => (
                <button
                  key={ index + 1 }
                  onClick={() => setTimeRange(timeobj)}
                  className={`
                    relative group z-10 px-4 py-2 text-sm font-semibold cursor-pointer rounded-lg transition-all duration-200 ease-out
                    ${timeRange.value === timeobj.value 
                      ? 'text-gray-900 dark:text-white shadow-md' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-gray-800/50'
                    }
                  `}
                >
                  {timeRange.value === timeobj.value && (
                    <span className="absolute inset-0 bg-yellow-400 dark:bg-yellow-500 rounded-lg shadow-lg shadow-yellow-500/25 animate-pulse group-hover:animate-none" />
                  )}
                  <span className="relative z-10">{timeobj.value}</span>
                </button>
              ))}
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200/60 dark:border-yellow-700/30 rounded-lg">
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse shadow-sm shadow-yellow-400" />
              <span className="text-xs font-medium text-yellow-700 dark:text-yellow-400">{timeRange.label}</span>
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* left column */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* Top stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              <StatCard
                title="Likes"
                value={fmt(overview.likes.value)}
                delta={overview.likes.rate}
                icon={<ThumbsUp className="group-hover:fill-black dark:group-hover:fill-white" />}
                colorClass="bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800"
              />
              <StatCard
                title="Comments"
                value={fmt(overview.comments.value)}
                delta={overview.comments.rate}
                icon={<MessagesSquare className="group-hover:fill-black dark:group-hover:fill-white" />}
                colorClass="bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900 dark:to-red-800"
                />
              <StatCard
                title="Reposts"
                value={fmt(overview.reposts.value)}
                delta={overview.reposts.rate}
                icon={<RefreshCw className="group-hover:fill-black dark:group-hover:fill-white" />}
                colorClass="bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900 dark:to-red-800"
                />

              <StatCard
                title="Views"
                value={fmt(overview.views.value)}
                delta={overview.views.rate}
                icon={<Eye className="group-hover:fill-black dark:group-hover:fill-white" />}
                colorClass="bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800"
              />
              <StatCard
                title="Bookmarks"
                value={fmt(overview.bookmarks.value)}
                delta={overview.bookmarks.rate}
                icon={<Bookmark className="group-hover:fill-black dark:group-hover:fill-white" />}
                colorClass="bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800"
              />
              <StatCard
                title="Followers"
                value={fmt(overview.followers.value)}
                delta={overview.followers.rate} // this rate change will come from backend... 
                icon={<UserRoundPlus className="group-hover:fill-black dark:group-hover:fill-white" />}
                colorClass="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800"
              />
                <StatCard
                  title="Followings"
                  value={fmt(overview.followings.value)}
                  delta={overview.followings.rate}
                  icon={<UserRoundMinus className="group-hover:fill-black dark:group-hover:fill-white" />}
                  colorClass="bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800"
                />
            </div>

            {/* Viewers stats area */}
            <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-xl flex items-center justify-center gap-1"><View /><span>Viewership Stats</span></h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Overview of traffic and reach</p>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <Customdropdown options={timeArray} selectedValue={timeRange} onChange={(newTimeRange) => setTimeRange(newTimeRange)} />
                </div>
              </div>
              <div className="flex items-center justify-between w-full m-2 p-2 rounded-lg">
                <div className="flex flex-col item-center gap-1">
                  <span className="text-md text-black dark:text-white font-semibold">Viewers in year {Year}</span>
                  <span className="text-xs">Variation of views throughout the year</span>
                </div>
                <div className="flex item-center justify-center gap-1">
                  <ArrowBigLeft onClick={() => { setYear(Math.max(Year - 1,joinedDate.getFullYear())) }} size={30} className='hover:bg-gray-100 dark:hover:bg-gray-950 rounded-full p-1 cursor-pointer' />
                  <span>{Year}</span>
                  <ArrowBigRight onClick={() => { setYear(Math.min(Year + 1,date.getFullYear())) }} size={30} className='hover:bg-gray-100 dark:hover:bg-gray-950 rounded-full p-1 cursor-pointer' />
                </div>
              </div>

              <div className="mt-4 h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={viewersSeries}>
                    <defs>
                      <linearGradient id="grad" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#F0b100" stopOpacity={0.12} />
                        <stop offset="100%" stopColor="#F0b100" stopOpacity={0} />
                      </linearGradient>
                    </defs>

                    <XAxis dataKey="name" tick={{ fill: tickColor }} />
                    <YAxis tick={{ fill: tickColor }} />
                    <Tooltip content={CustomTooltip} />
                    <Line type="monotone" dataKey="viewers" stroke="#F0b100" strokeWidth={2} dot={{ r: 3 }} />
                    <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" vertical={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 bg-gray-100 dark:bg-gray-950 rounded-md">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">Avg daily viewers</div>
                  <div className="text-xl flex items-center gap-3 font-semibold text-gray-900 dark:text-gray-100">
                    <FiUsers/>
                    <span>{fmt(kpis.avgDailyViewers)}</span>
                  </div>
                </div>
                <div className="p-3 bg-gray-100 dark:bg-gray-950 rounded-md">
                  <div className="text-xs text-gray-600 dark:text-gray-400">Top country</div>
                  <div className="text-xl font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100">
                    <BsGlobe /> {kpis.topCountry.country}
                    <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">({kpis.topCountry.percent}%)</span>
                  </div>
                </div>
                <div className="p-3 bg-gray-100 dark:bg-gray-950 rounded-md">
                  <div className="text-xs text-gray-600 dark:text-gray-400">Top  post (engagement)</div>
                  <div className="text-xl font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100">
                    <BsFillPersonCheckFill /> {kpis.topPost.title}
                    <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">({kpis.topPost.comments}%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Uploads  */}
            <div className="w-full rounded-2xl">
              {/* Recent Uploads Table */}
              <div className="w-full bg-white/80 dark:bg-black/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-3">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b rounded-lg border-gray-200/50 dark:border-gray-700/50">
                  <div className="p-2 bg-yellow-100 dark:bg-gray-950 rounded-xl">
                    <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent flex items-center gap-1"><Upload /><span>Recent Uploads</span></h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">Latest posts and performance metrics</p>
                  </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-b from-white/50 to-gray-50/50 dark:from-black/50 dark:to-gray-900/50">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gradient-to-r from-gray-50/70 to-gray-100/70 dark:from-gray-900/70 dark:to-gray-800/70 backdrop-blur-sm sticky top-0 z-10">
                        <th className="py-4 pl-6 pr-4 font-semibold text-gray-700 dark:text-gray-300 text-left">Post</th>
                        <th className="py-4 px-3 font-semibold text-gray-700 dark:text-gray-300 text-left whitespace-nowrap">Date</th>
                        <th className="py-4 px-4 font-semibold text-gray-700 dark:text-gray-300 text-center whitespace-nowrap">Views</th>
                        <th className="py-4 px-4 font-semibold text-gray-700 dark:text-gray-300 text-center whitespace-nowrap">Likes</th>
                        <th className="py-4 pr-6 pl-4 font-semibold text-gray-700 dark:text-gray-300 text-center whitespace-nowrap">Comments</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentUploads.map((r,i) => (
                       <tr key={ i + 1 } onClick={() => router.push(`/${Account.decodedHandle}/post/${r.id}?section=Comments`)} className={`border-b cursor-pointer rounded border-gray-100/50 dark:border-gray-800/50 hover:bg-yellow-50 dark:hover:bg-gray-950`} >
                          <td className="py-4 pl-6 pr-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-yellow-400 dark:bg-gray-950 rounded-xl shadow-md flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-tight line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{r.title}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">Post {r.num}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-3">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{r.date}</div>
                          </td>
                          <td className="py-3">
                            <div className="mx-auto w-20 py-1 px-4 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg justify-center text-center group-hover:bg-blue-100/70 dark:group-hover:bg-blue-900/40">
                              <div className="font-bold text-sm text-blue-700 dark:text-blue-300">{fmt(r.views)}</div>
                              <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">views</div>
                            </div>
                          </td>
                          <td className="py-3">
                            <div className="mx-auto w-16 py-1 px-4 bg-emerald-50/50 dark:bg-emerald-900/20 rounded-lg justify-center text-center group-hover:bg-emerald-100/70 dark:group-hover:bg-emerald-900/40">
                              <div className="font-bold text-sm text-emerald-700 dark:text-emerald-300">{fmt(r.likes)}</div>
                              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">likes</div>
                            </div>
                          </td>
                          <td className="py-3 pr-6 pl-4">
                            <div className="mx-auto w-20 py-1 px-4 bg-purple-50/50 dark:bg-purple-900/20 rounded-lg justify-center text-center group-hover:bg-purple-100/70 dark:group-hover:bg-purple-900/40">
                              <div className="font-bold text-sm text-purple-700 dark:text-purple-300">{fmt(r.comments)}</div>
                              <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">comments</div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {recentUploads.length === 0 && (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No recent uploads</p>
                    <p className="text-sm">Your latest posts will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* thin column on right side... */}
          <div className="flex flex-col gap-4">
            {/* Device Usability */}
            <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-1"><Monitor /><span>Device Usability</span></h3>
                <div className="text-xs text-gray-600 dark:text-gray-400">Distribution</div>
              </div>

              <div className="mt-4 flex items-center gap-4">
                <div className="w-36 h-36">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                      innerRadius="25%"
                      outerRadius="100%"
                      data={deviceBreakdown}
                      startAngle={90}
                      endAngle={-270}
                    >
                      <RadialBar
                        dataKey="value"
                        cornerRadius={20}
                      >
                        {deviceBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </RadialBar>
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex-1">
                  {deviceBreakdown.map((d, i) => (
                    <div key={d.name} className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full" style={{ background: COLORS[i] }} />
                        <div>
                          <div className="text-sm text-gray-900 dark:text-gray-100">{d.name}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Users</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{d.value}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Profile Visitors (gender donut) */}
            <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-1"><Users /><span>Profile Visitors</span></h3>
                <div className="text-xs text-gray-600 dark:text-gray-400">Gender</div>
              </div>

              <div className="mt-4 flex items-center gap-4">
                <div className="w-28 h-28">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={genderBreakdown as any}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={44}
                        outerRadius={56}
                        paddingAngle={4}
                        startAngle={180}
                        endAngle={-180}
                      >
                        {genderBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex-1">
                  {genderBreakdown.map((g, i) => (
                    <div key={g.name} className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full" style={{ background: COLORS[i] }} />
                        <div>
                          <div className="text-sm text-gray-900 dark:text-gray-100">{g.name}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Profile visitors</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{g.value}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Posts with sparlines*/}
            <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-1"><HiOutlineSparkles/><span>Top Performing Posts</span></h3>
                <div className="text-xs text-gray-600 dark:text-gray-400">Last period</div>
              </div>

              <div className="mt-4 space-y-3">
                {topPosts.map((p, id) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between gap-3 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-950 cursor-pointer"
                  >
                    <div className="font-semibold">{id+1}</div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{p.title}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Views: {fmt(p.views)} • Reach: {fmt(p.likes)}
                      </div>
                    </div>
                    <div className="w-36">
                      {/* tiny sparkling... */}
                      <Sparkline data={growthSeries.map((g, i) => ({ ...g, value: Math.max(10, (i + 1) * 40 + id * 20) }))} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Export report action... */}
            <div className="bg-white dark:bg-black border border-gray-200 flex flex-col gap-2 dark:border-gray-700 rounded-xl p-3">
              <div className="text-xs text-gray-600 dark:text-gray-400 flex flex-row gap-1">
                 <MdImportExport size={20} />
                 <span>Export analytics for other usecases</span>
              </div>
              <div className="flex items-center justify-center p-2 rounded-lg">
                <button 
                 onClick={() => { handleReportExport('pdf') }}
                 className="flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 dark:text-black text-white py-2 px-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer w-fit">
                  <BsFilePdf />
                  <span>Export PDF Report</span>
                </button>
              </div>
              </div>
            </div>
          </div>
        </div>

        {/* some more advance section */}
        <div className="m-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl p-4">
            <h4 className="font-semibold flex items-center gap-1"><Heart /><span>Audience Interests</span></h4>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Top interests derived from engagement</p>
            <div className="mt-3 space-y-2">
              <InterestPill label="Fitness" percent={28} color={COLORS[0]} />
              <InterestPill label="Travel" percent={21} color={COLORS[1]} />
              <InterestPill label="Food" percent={17} color={COLORS[2]} />
              <InterestPill label="Tech" percent={12} color={COLORS[3]} />
              <InterestPill label="Lifestyle" percent={10} color={COLORS[4]} />
            </div>
          </div>


          <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl p-4">
            <h4 className="font-semibold flex items-center gap-1"><Smile /><span>Sentiment Analysis</span></h4>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Comments and mentions sentiment</p>

            <div className="mt-4 space-y-2">
              <SentimentRow label="Positive" percent={72} color="#4EE1A0" />
              <SentimentRow label="Neutral" percent={18} color="#FFD86B" />
              <SentimentRow label="Negative" percent={10} color="#FF7A59" />
            </div>
          </div>
        </div>

        <div className="m-6 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl p-4">
          <h4 className="font-semibold flex items-center gap-1"><BarChart3 /><span>Content Performance Breakdown</span></h4>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">By format (video, image, raw , etc...)</p>

            <div className="mt-4">
              <ResponsiveContainer width="100%" height={160}>
                  <BarChart
                  data={contentPerformance}
                  barCategoryGap={20}
                  margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                >
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-gray-800 cursor-pointer" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: tickColor, fontSize: 12, textAnchor: 'end' }}
                    height={60}
                  />
                  <YAxis
                    tick={{ fill: tickColor, fontSize: 11 }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip content={CustomTooltip} cursor={false} />
                  <defs>
                    {COLORS.map((color, index) => (
                      <linearGradient key={`color${index}`} id={`color${index}`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity={0.85}/>
                        <stop offset="100%" stopColor={color} stopOpacity={0.25}/>
                      </linearGradient>
                    ))}
                  </defs>
                  <Bar
                    dataKey="value"
                    radius={[6, 6, 0, 0]}
                    barSize={60}
                    isAnimationActive={true}
                    animationDuration={800}
                  >
                    {contentPerformance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`url(#color${index})`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        {/* Advance anlytics card... */}
        <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <h3 className="font-semibold flex items-center gap-1"><MdAnalytics />Advanced Analytics</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Professional insights and breakdowns</p>

                <div className="mt-4 space-y-3">
                 <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Engagement Rate</div>
                      <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">{fmt(overview.views.value)}</div>
                    </div>
                    <div className={`text-sm font-semibold ${ parseFloat((overview.views.rate).substring(0,overview.views.rate.length -2)) > 0 ? 'text-green-400' : 'text-red-400' } text-green-400 flex items-center gap-1`}>
                      {UpDownArrow(overview.views.rate)}<span>{overview.views.rate}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Avg Watch Time</div>
                      <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{`${watchTime.hour}:${watchTime.min}:${watchTime.sec}`}</div>
                    </div>
                    <div className={`text-sm font-semibold ${ parseFloat((watchTime.rate).substring(0,watchTime.rate.length -2)) > 0 ? 'text-green-400' : 'text-red-400' } flex items-center gap-1`}>
                      {UpDownArrow(watchTime.rate)}<span>{watchTime.rate}</span>
                    </div>
                  </div>
                 </div>

                  <div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Top Performing Countries</div>
                    <ul className="mt-2 text-sm grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {topCountries.map((c, idx) => (
                        <li key={c.country} className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ background: COLORS[idx % COLORS.length] }} />
                            <span className="text-gray-900 dark:text-gray-100">{c.country}</span>
                          </div>
                          <div className="text-gray-600 font-semibold dark:text-gray-400">{c.percent}%</div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Interaction Types</div>
                    <div className="mt-2">
                      <ResponsiveContainer width="100%" height={120}>
                        <BarChart data={interactionTypes}>
                          <XAxis dataKey="name" tick={{ fill: tickColor, fontSize: 12 }} />
                          <Tooltip content={CustomTooltip} cursor={false} />
                          <Bar dataKey="value" fill={theme === 'dark' ? '#ffffff' : '#000000'} barSize={60} radius={[3, 3, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
      </div>
    { isPop && <RequireSubscription isOpen={isPop} onClose={() => { setisPop(false) }} planname='Creator'  />}
    { showNotAccessable && (
      <Notaccessablepop username={String(Account.decodedHandle)} />
    )}
    </div>
  );
}

// some sub components... 
interface StatCardProps {
  title: string;
  value: string;
  delta: string;
  icon: React.ReactNode;
  colorClass: string;
}

function StatCard({ title, value, delta, icon, colorClass }: StatCardProps) {
  return (
    <div className={`rounded-lg p-3 ${colorClass} text-gray-900 dark:text-gray-100 shadow-lg dark:shadow-gray-900 border-none group hover:scale-105 transition-transform`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-gray-700 dark:text-gray-400">{title}</div>
          <div className="text-xl font-semibold mt-1">{value}</div>
        </div>
        <div className="text-2xl">{icon}</div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="text-xs text-gray-600 dark:text-gray-400">From last 7 days</div>
        <div className="text-sm font-semibold">{delta}</div>
      </div>
    </div>
  );
}

interface InterestPillProps {
  label: string;
  percent: number;
  color: string;
}

function InterestPill({ label, percent, color }: InterestPillProps) {
  return (
    <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-950 p-2 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-black transition-colors">
      <div className="flex items-center gap-3">
        <span className="w-3 h-3 rounded-full" style={{ background: color }} />
        <div>
          <div className="text-sm text-gray-900 dark:text-gray-100">{label}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Interest</div>
        </div>
      </div>
      <div className="text-sm text-gray-700 dark:text-gray-300">{percent}%</div>
    </div>
  );
}

interface SentimentRowProps {
  label: string;
  percent: number;
  color: string;
}

function SentimentRow({ label, percent, color }: SentimentRowProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-gray-900 dark:text-gray-100">{label}</div>
      <div className="flex-1 mx-3 h-3 rounded-full bg-gray-100 dark:bg-gray-700">
        <div
          style={{
            width: `${percent}%`,
            background: color,
            height: "100%",
            borderRadius: 8,
          }}
        />
      </div>
      <div className="text-sm text-gray-700 dark:text-gray-300">{percent}%</div>
    </div>
  );
}
