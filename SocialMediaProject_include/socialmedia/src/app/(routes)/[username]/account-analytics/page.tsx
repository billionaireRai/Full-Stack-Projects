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
  FiHeart,
  FiMessageCircle,
  FiSearch,
  FiArrowUp,
  FiArrowDown,
} from "react-icons/fi";
import { BsFillPersonCheckFill, BsGlobe } from "react-icons/bs";
import { HiOutlineSparkles } from "react-icons/hi";
import Customdropdown from "@/components/customdropdown";
import useActiveAccount from "@/app/states/useraccounts";
import { clsx } from "clsx";
import { useTheme } from "next-themes";
import { MdImportExport, MdSpaceDashboard } from "react-icons/md";
import { User } from "lucide-react";


interface Overview {
  followers: number;
  likes: number;
  comments: number;
  engagementRate: number;
}

interface VisitorSeriesItem {
  name: string;
  visitors: number;
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
  reach: number;
  engagement: number;
}

interface GrowthSeriesItem {
  name: string;
  value: number;
}

interface InteractionTypeItem {
  name: string;
  value: number;
}



// Custom Tooltip for Recharts with dark mode support
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 p-2 rounded shadow-md text-gray-900 dark:text-gray-100">
        <p className="text-sm">{`${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {`${entry.dataKey}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function UserAnalytics() {
  // UI state
  const [timeRange, setTimeRange] = useState({ value:'7d',label:'7 days',priority:"1" });
  const [loading, setLoading] = useState<boolean>(true); // used for loading animation...

  // Analytics data states
  const [overview, setOverview] = useState<Overview>({
    followers: 0,
    likes: 0,
    comments: 0,
    engagementRate: 0,
  });


  const { Account } = useActiveAccount() ; // getting the logged in account...
  const router = useRouter() ; // initializing router hook...
  const [visitorSeries, setVisitorSeries] = useState<VisitorSeriesItem[]>([]);
  const [deviceBreakdown, setDeviceBreakdown] = useState<BreakdownItem[]>([]);
  const [genderBreakdown, setGenderBreakdown] = useState<BreakdownItem[]>([]);
  const [recentUploads, setRecentUploads] = useState<RecentUploadItem[]>([]);
  const [topCountries, setTopCountries] = useState<TopCountryItem[]>([]);
  const [topPosts, setTopPosts] = useState<TopPostItem[]>([]);
  const [growthSeries, setGrowthSeries] = useState<GrowthSeriesItem[]>([]);
  const [interactionTypes, setInteractionTypes] = useState<InteractionTypeItem[]>([]);
  const [timeArray, settimeArray] = useState(
    [{value:"7d",label:'7 days', priority:"1"},{value:"30d",label:'30 days', priority:"2"},{value:"90d",label:'90 days', priority:"3"},{value:"1y",label:'1 year', priority:"4"},{value:"2y",label:'2 years', priority:"5"}]
  )

  const { theme } = useTheme();
  const tickColor = theme === 'dark' ? '#D1D5DB' : '#6B7280';
  // up from here review 

  // Colors used for charts for uniformity...
  const COLORS = ["#FF7A59", "#4EE1A0", "#7CC6FF", "#FFD86B", "#B28DFF"];

  // function for formating the number...
  const fmt = (n: number): string => {
    if (n >= 1e9) return (n / 1e9).toFixed(2) + "B";  // 1e9 = 1 * math.pow(10,9) where e = 10 ;
    if (n >= 1e6) return (n / 1e6).toFixed(2) + "M";
    if (n >= 1e3) return (n / 1e3).toFixed(2) + "K";
    return String(n); // number is in hundreds...
  };

  // useffect for loading data from backend logic...
  useEffect(() => {
    function simulateLoadData() {
      // Mock dashboard overview ...
      const ov = {
        followers: 58378,
        likes: 425365,
        comments: 85245,
        engagementRate: 4.6, // %
      };
      setOverview(ov); // updating the overview state...

      // Visitor series for chart...
      const months = [
        { name: "Jan", visitors: 22000 },
        { name: "Feb", visitors: 25000 },
        { name: "Mar", visitors: 32000 },
        { name: "Apr", visitors: 54000 },
        { name: "May", visitors: 37000 },
        { name: "Jun", visitors: 28000 },
        { name: "Jul", visitors: 66000 },
        { name: "Aug", visitors: 59000 },
        { name: "Sep", visitors: 42000 },
        { name: "Oct", visitors: 46000 },
        { name: "Nov", visitors: 48000 },
        { name: "Dec", visitors: 52000 },
      ];
      setVisitorSeries(months);

      // Device breakdown
      setDeviceBreakdown([
        { name: "Desktop", value: 23 },
        { name: "Mobile", value: 44 },
        { name: "Tablet", value: 33 },
      ]);

      // Gender breakdown for Profile Visitors
      setGenderBreakdown([
        { name: "Male", value: 52 },
        { name: "Female", value: 44 },
        { name: "Other", value: 4 },
      ]);

      // Recent uploads
      setRecentUploads([
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
      ]);

      // Top countries
      setTopCountries([
        { country: "United States", percent: 34 },
        { country: "India", percent: 21 },
        { country: "Brazil", percent: 12 },
        { country: "UK", percent: 8 },
        { country: "Germany", percent: 5 },
      ]);

      // Top posts (content performance)
      setTopPosts([
        {
          num:1,
          id: "p1",
          title: "Epic Sunrise Timelapse",
          views: 1200000,
          reach: 900000,
          engagement: 9.2,
        },
        {
          num:2,
          id: "p2",
          title: "Street Food Tour",
          views: 840000,
          reach: 600000,
          engagement: 7.1,
        },
        {
          num:3,
          id: "p3",
          title: "DIY Home Gym Setup",
          views: 610000,
          reach: 480000,
          engagement: 6.5,
        },
      ]);

      // Follower growth series (sparkline)
      setGrowthSeries([
        { name: "Day 1", value: 120 },
        { name: "Day 2", value: 140 },
        { name: "Day 3", value: 180 },
        { name: "Day 4", value: 210 },
        { name: "Day 5", value: 260 },
        { name: "Day 6", value: 300 },
        { name: "Day 7", value: 350 },
      ]);

      // Interaction type breakdown
      setInteractionTypes([
        { name: "Likes", value: 62 },
        { name: "Comments", value: 18 },
        { name: "Saves", value: 10 },
        { name: "Shares", value: 10 },
      ]);
    }

    // simulating network latency...
    setLoading(true);
    const t = setTimeout(() => {
      simulateLoadData();
      setLoading(false);
    }, 1000);

    return () => clearTimeout(t);
  }, [timeRange]);

  // API for advance analytics...
  const kpis = useMemo(() => {
    const avgDaily = Math.round(
      visitorSeries.reduce((s, m) => s + (m.visitors || 0), 0) /
        Math.max(visitorSeries.length, 1)
    );
    const topCountry = topCountries[0] || { country: "—", percent: 0 };
    const topPost = topPosts[0] || { title: "—", engagement: 0 };
    return {
      avgDailyVisitors: avgDaily,
      topCountry,
      topPost,
    };
  }, [visitorSeries, topCountries, topPosts]);

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

  return (
  <div className='h-full flex flex-col font-poppins'>
    <div className="h-fit p-4 bg-white dark:bg-black text-gray-900 dark:text-white font-poppins rounded-lg shadow-md">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold flex flex-row items-center gap-1.5"><MdSpaceDashboard /><span>Dashboard</span></h1>
            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              <div className="group relative inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-black/80 backdrop-blur-sm border border-gray-200/80 dark:border-gray-700/80 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5">
                <User className="w-4 h-4 text-gray-700 dark:text-gray-300 flex-shrink-0" />
                <span className="font-medium text-gray-900 dark:text-gray-100 truncate max-w-[150px]">{Account.name}</span>
              </div>
              <Link 
                href={`/${Account.decodedHandle}`} 
                className="group relative inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-800 dark:hover:to-gray-700 text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100 font-semibold"
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

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-gray-50 dark:group-focus:bg-black dark:bg-gray-950 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 gap-2">
              <FiSearch className="text-gray-500 dark:text-gray-400" />
              <input
                placeholder="Search posts, tags..."
                className="rounded-md px-2 py-1 outline-none text-sm placeholder:text-gray-500 dark:placeholder:text-gray-400 w-56"
              />
            </div>

            <div className="bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-600 rounded-md p-2">
              {timeArray.map((timeobj,index) => (
              <button
                key={ index+1 }
                onClick={() => setTimeRange(timeobj)}
                className={clsx("px-3 py-1 text-sm rounded cursor-pointer font-semibold hover:bg-gray-100 dark:hover:bg-gray-900", timeRange.value === timeobj.value ? "dark:bg-yellow-500 bg-yellow-400 dark:text-white" : "text-gray-700 dark:text-gray-300")}
              >
                {timeobj.value}
              </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* left column */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* Top stat cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <StatCard
                title="Followers"
                value={fmt(overview.followers)}
                delta="+2.1%" // this rate change will come from backend... 
                icon={<FiUsers className="group-hover:fill-black dark:group-hover:fill-white" />}
                colorClass="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800"
              />
              <StatCard
                title="Likes"
                value={fmt(overview.likes)}
                delta="+23.5%"
                icon={<FiHeart className="group-hover:fill-black dark:group-hover:fill-white" />}
                colorClass="bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800"
              />
              <StatCard
                title="Comments"
                value={fmt(overview.comments)}
                delta="-12.4%"
                icon={<FiMessageCircle className="group-hover:fill-black dark:group-hover:fill-white" />}
                colorClass="bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900 dark:to-red-800"
              />
              <StatCard
                title="Engagement"
                value={`${overview.engagementRate}%`}
                delta="+1.4%"
                icon={<HiOutlineSparkles className="group-hover:fill-black dark:group-hover:fill-white" />}
                colorClass="bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800"
              />
            </div>

            {/* Visitor stats area */}
            <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Visitors Stats</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Overview of traffic and reach</p>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <Customdropdown options={timeArray} selectedValue={timeRange} onChange={(newTimeRange) => setTimeRange(newTimeRange)} />
                </div>
              </div>

              <div className="mt-4 h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={visitorSeries}>
                    <defs>
                      <linearGradient id="grad" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#F0b100" stopOpacity={0.12} />
                        <stop offset="100%" stopColor="#F0b100" stopOpacity={0} />
                      </linearGradient>
                    </defs>

                    <XAxis dataKey="name" tick={{ fill: tickColor }} />
                    <YAxis tick={{ fill: tickColor }} />
                    <Tooltip content={CustomTooltip} />
                    <Line type="monotone" dataKey="visitors" stroke="#F0b100" strokeWidth={2} dot={{ r: 3 }} />
                    <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" vertical={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 bg-gray-100 dark:bg-gray-950 rounded-md">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">Avg daily visitors</div>
                  <div className="text-xl flex items-center gap-3 font-semibold text-gray-900 dark:text-gray-100">
                    <FiUsers/>
                    <span>{fmt(kpis.avgDailyVisitors)}</span>
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
                    <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">({kpis.topPost.engagement}%)</span>
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
                    <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">Recent Uploads</h3>
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
                      {recentUploads.map((r) => (
                       <tr onClick={() => router.push(`/${Account.decodedHandle}/post/${r.id}?section=Comments`)} className={`border-b cursor-pointer rounded border-gray-100/50 dark:border-gray-800/50 hover:bg-yellow-50 dark:hover:bg-gray-950`} >
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
                        // </Link>
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
                <h3 className="font-semibold">Device Usability</h3>
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
                <h3 className="font-semibold">Profile Visitors</h3>
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
                <h3 className="font-semibold flex items-center gap-2"><span>Top Performing Posts</span><HiOutlineSparkles/></h3>
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
                        Views: {fmt(p.views)} • Reach: {fmt(p.reach)}
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

            {/* Export / Quick actions */}
            <div className="bg-white dark:bg-black border border-gray-200 flex flex-col gap-2 dark:border-gray-700 rounded-xl p-3">
              <div className="text-xs text-gray-600 dark:text-gray-400 flex flex-row gap-1"><MdImportExport size={20} /><span>Export analytics for other usecases</span></div>
              <div className="grid grid-cols-2 gap-10 p-2 rounded-lg">
                <button className="bg-gradient-to-r from-[#7CC6FF] to-[#7CC6FF] hover:from-[#7CC6FF] hover:to-[#5A9FFF] dark:text-black text-white py-2 px-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer w-fit">Export CSV</button>
                <button className="bg-gradient-to-r from-[#4EE1A0] to-[#4EE1A0] hover:from-[#4EE1A0] hover:to-[#3BCF8A] dark:text-black text-white py-2 px-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer w-fit">Export PNG</button>
                <button className="bg-gradient-to-r from-[#FF7A59] to-[#FF7A59] hover:from-[#FF7A59] hover:to-[#FF6347] dark:text-black text-white py-2 px-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer w-fit">Share Report</button>
              </div>
              </div>
            </div>
          </div>
        </div>

        {/* some more advance section */}
        <div className="m-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl p-4">
            <h4 className="font-semibold">Audience Interests</h4>
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
            <h4 className="font-semibold">Content Performance Breakdown</h4>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">By format (video, image, carousel)</p>

            <div className="mt-4">
              <ResponsiveContainer width="100%" height={160}>
                <BarChart
                  data={interactionTypes}
                  barCategoryGap={20}
                  margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                >
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-gray-800" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: tickColor, fontSize: 12, textAnchor: 'end' }}
                    height={60}
                  />
                  <YAxis 
                    tick={{ fill: tickColor, fontSize: 11 }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip content={CustomTooltip} />
                  <Legend />
                  {interactionTypes.map((entry, index) => (
                    <Bar
                      key={`bar-${index}`}
                      dataKey="value"
                      fill={`url(#color${index})`}
                      radius={[6, 6, 0, 0]}
                      barSize={30}
                      isAnimationActive={true}
                      animationDuration={800}
                    />
                  ))}
                  <defs>
                    {COLORS.map((color, index) => (
                      <linearGradient key={`color${index}`} id={`color${index}`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity={0.85}/>
                        <stop offset="100%" stopColor={color} stopOpacity={0.25}/>
                      </linearGradient>
                    ))}
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl p-4">
            <h4 className="font-semibold">Sentiment Analysis</h4>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Comments and mentions sentiment</p>

            <div className="mt-4 space-y-2">
              <SentimentRow label="Positive" percent={72} color="#4EE1A0" />
              <SentimentRow label="Neutral" percent={18} color="#FFD86B" />
              <SentimentRow label="Negative" percent={10} color="#FF7A59" />
            </div>
          </div>
        </div>
        {/* Advance anlytics card... */}
        <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <h3 className="font-semibold">Advanced Analytics</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Professional insights and breakdowns</p>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Engagement Rate</div>
                      <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">{overview.engagementRate}%</div>
                    </div>
                    <div className="text-sm font-semibold text-green-400 flex items-center gap-1">
                      <FiArrowUp /> 1.4%
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Avg Watch Time</div>
                      <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">00:02:34</div>
                    </div>
                    <div className="text-sm font-semibold text-red-400 flex items-center gap-1">
                      <FiArrowDown /> 0.6%
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Top Performing Countries</div>
                    <ul className="mt-2 text-sm space-y-1">
                      {topCountries.map((c, idx) => (
                        <li key={c.country} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ background: COLORS[idx % COLORS.length] }} />
                            <span className="text-gray-900 dark:text-gray-100">{c.country}</span>
                          </div>
                          <div className="text-gray-600 dark:text-gray-400">{c.percent}%</div>
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
                          <Tooltip content={CustomTooltip} />
                          <Bar dataKey="value" fill={theme === 'dark' ? '#ffffff' : '#000000'} barSize={20} radius={[3, 3, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
      </div>
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
    <div className={`rounded-lg p-3 ${colorClass} text-gray-900 dark:text-gray-100 shadow-lg dark:shadow-gray-900 border-none cursor-pointer group hover:scale-105 transition-transform`}>
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
