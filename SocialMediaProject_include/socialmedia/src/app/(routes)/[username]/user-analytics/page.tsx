'use client'

import React, { useEffect, useMemo, useState } from "react";
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
import { clsx } from "clsx";
import { useTheme } from "next-themes";


interface Overview {
  followers: number;
  likes: number;
  comments: number;
  engagementRate: number;
}

interface timeObj {
  value:string ,
  label:string
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
  id: number;
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
  id: string;
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
  const [timeRange, setTimeRange] = useState<timeObj>({value:'7d',label:'7 days'});
  const [loading, setLoading] = useState<boolean>(true);

  // Analytics data states
  const [overview, setOverview] = useState<Overview>({
    followers: 0,
    likes: 0,
    comments: 0,
    engagementRate: 0,
  });


  const [visitorSeries, setVisitorSeries] = useState<VisitorSeriesItem[]>([]);
  const [deviceBreakdown, setDeviceBreakdown] = useState<BreakdownItem[]>([]);
  const [genderBreakdown, setGenderBreakdown] = useState<BreakdownItem[]>([]);
  const [recentUploads, setRecentUploads] = useState<RecentUploadItem[]>([]);
  const [topCountries, setTopCountries] = useState<TopCountryItem[]>([]);
  const [topPosts, setTopPosts] = useState<TopPostItem[]>([]);
  const [growthSeries, setGrowthSeries] = useState<GrowthSeriesItem[]>([]);
  const [interactionTypes, setInteractionTypes] = useState<InteractionTypeItem[]>([]);
  const [timeArray, settimeArray] = useState<timeObj[]>(
    [{value:"7d",label:'7 days'},{value:"30d",label:'30 days'},{value:"90d",label:'90 days'},{value:"1y",label:'1 year'},{value:"2y",label:'2 years'}]
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
          id: 1,
          title: "This incredible natural attraction is one of the must-visits",
          date: "22-02-2023",
          views: 837748,
          likes: 24467,
          comments: 2578,
        },
        {
          id: 2,
          title: "The Skywalk, a glass leading out over the valley",
          date: "24-02-2023",
          views: 384753,
          likes: 87765,
          comments: 4766,
        },
        {
          id: 3,
          title: "Summer is the most popular time to visit these beaches",
          date: "26-02-2023",
          views: 296087,
          likes: 86298,
          comments: 3498,
        },
        {
          id: 4,
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
          id: "p1",
          title: "Epic Sunrise Timelapse",
          views: 1200000,
          reach: 900000,
          engagement: 9.2,
        },
        {
          id: "p2",
          title: "Street Food Tour",
          views: 840000,
          reach: 600000,
          engagement: 7.1,
        },
        {
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
            stroke="#FF7A59"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  // for loading...
  if (loading) {
    return (
      <div className="min-h-[60vh] flex text-center text-md font-semibold text-gray-600">
        Loading analytics...
      </div>
    );
  }

  return (
  <div className='h-full flex flex-col md:ml-72 font-poppins'>
    <div className="h-fit p-4 bg-white dark:bg-black text-gray-900 dark:text-white font-poppins rounded-lg shadow-md">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-semibold">Dashboard</h1>
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
              <button
                onClick={() => setTimeRange({value:"7d", label:"7 days"})}
                className={clsx("px-3 py-1 text-sm rounded cursor-pointer font-semibold hover:bg-gray-100 dark:hover:bg-gray-900", timeRange.value === "7d" ? "dark:bg-blue-500 bg-yellow-400 dark:text-white" : "text-gray-700 dark:text-gray-300")}
              >
                7d
              </button>
              <button
                onClick={() => setTimeRange({value:"30d", label:"30 days"})}
                className={clsx("px-3 py-1 text-sm rounded cursor-pointer font-semibold hover:bg-gray-100 dark:hover:bg-gray-900", timeRange.value === "30d" ? "dark:bg-blue-500 bg-yellow-400 dark:text-white" : "text-gray-700 dark:text-gray-300")}
              >
                30d
              </button>
              <button
                onClick={() => setTimeRange({value:"90d", label:"90 days"})}
                className={clsx("px-3 py-1 text-sm rounded cursor-pointer font-semibold hover:bg-gray-100 dark:hover:bg-gray-900", timeRange.value === "90d" ? "dark:bg-blue-500 bg-yellow-400 dark:text-white" : "text-gray-700 dark:text-gray-300")}
              >
                90d
              </button>
              <button
                onClick={() => setTimeRange({value:"1y", label:"1 year"})}
                className={clsx("px-3 py-1 text-sm rounded cursor-pointer font-semibold hover:bg-gray-100 dark:hover:bg-gray-900", timeRange.value === "1y" ? "dark:bg-blue-500 bg-yellow-400 dark:text-white" : "text-gray-700 dark:text-gray-300")}
              >
                1y
              </button>
              <button
                onClick={() => setTimeRange({value:"2y", label:"2 years"})}
                className={clsx("px-3 py-1 text-sm rounded cursor-pointer font-semibold hover:bg-gray-100 dark:hover:bg-gray-900", timeRange.value === "2y" ? "dark:bg-blue-500 bg-yellow-400 dark:text-white" : "text-gray-700 dark:text-gray-300")}
              >
                2y
              </button>
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
                icon={<FiUsers />}
                colorClass="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800"
              />
              <StatCard
                title="Likes"
                value={fmt(overview.likes)}
                delta="+23.5%"
                icon={<FiHeart />}
                colorClass="bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800"
              />
              <StatCard
                title="Comments"
                value={fmt(overview.comments)}
                delta="-12.4%"
                icon={<FiMessageCircle />}
                colorClass="bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900 dark:to-red-800"
              />
              <StatCard
                title="Engagement"
                value={`${overview.engagementRate}%`}
                delta="+1.4%"
                icon={<HiOutlineSparkles />}
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
                  <Customdropdown selectedValue={timeRange} onChange={setTimeRange} options={timeArray}/>
                </div>
              </div>

              <div className="mt-4 h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={visitorSeries}>
                    <defs>
                      <linearGradient id="grad" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#FF7A59" stopOpacity={0.12} />
                        <stop offset="100%" stopColor="#FF7A59" stopOpacity={0} />
                      </linearGradient>
                    </defs>

                    <XAxis dataKey="name" tick={{ fill: tickColor }} />
                    <YAxis tick={{ fill: tickColor }} />
                    <Tooltip content={CustomTooltip} />
                    <Line type="monotone" dataKey="visitors" stroke="#FF7A59" strokeWidth={2} dot={{ r: 3 }} />
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

            {/* Recent Uploads + Advanced breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Recent Uploads Table */}
              <div className="lg:col-span-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Recent Upload</h3>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Latest posts and metrics</div>
                </div>

                <div className="mt-4">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="text-gray-600 dark:text-gray-400 text-xs">
                        <th className="py-2">Name</th>
                        <th className="py-2">Date</th>
                        <th className="py-2">Views</th>
                        <th className="py-2">Likes</th>
                        <th className="py-2">Comments</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentUploads.map((r) => (
                        <tr key={r.id} className="border-t border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-950">
                          <td className="py-3 pr-4">
                            <div className="text-xs md:text-sm font-semibold text-gray-900 dark:text-gray-100">{r.title}</div>
                          </td>
                          <td className="py-3 text-gray-900 dark:text-gray-100">{r.date}</td>
                          <td className="py-4 text-gray-900 dark:text-gray-100">{fmt(r.views)}</td>
                          <td className="py-4 text-gray-900 dark:text-gray-100">{fmt(r.likes)}</td>
                          <td className="py-4 text-gray-900 dark:text-gray-100">{fmt(r.comments)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Advanced analytics card */}
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
              <div className="text-xs text-gray-600 dark:text-gray-400">Updated just now</div>
              <div className="flex flex-col gap-3 p-2 rounded-lg">
                <button className="bg-gradient-to-r from-[#7CC6FF] to-[#7CC6FF] hover:from-[#7CC6FF] hover:to-[#5A9FFF] dark:text-black text-white py-2 px-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer w-fit">Export CSV</button>
                <button className="bg-gradient-to-r from-[#4EE1A0] to-[#4EE1A0] hover:from-[#4EE1A0] hover:to-[#3BCF8A] dark:text-black text-white py-2 px-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer w-fit">Export PNG</button>
                <button className="bg-gradient-to-r from-[#FF7A59] to-[#FF7A59] hover:from-[#FF7A59] hover:to-[#FF6347] dark:text-black text-white py-2 px-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer w-fit">Share Report</button>
              </div>
              </div>
            </div>
          </div>
        </div>

        {/* some more advance section */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
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
                  data={[
                    { format: "Video", value: 62 },
                    { format: "Image", value: 28 },
                    { format: "Carousel", value: 10 },
                  ]}
                >
                  <XAxis dataKey="format" tick={{ fill: tickColor }} />
                  <Tooltip content={CustomTooltip} />
                  <Bar dataKey="value" fill={theme === 'dark' ? '#ffffff' : '#000000'} radius={[6, 6, 0, 0]} />
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
    <div className={`rounded-lg p-3 ${colorClass} text-gray-900 dark:text-gray-100 shadow-lg dark:shadow-gray-900 border-none cursor-pointer hover:scale-105 transition-transform`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-gray-700 dark:text-gray-400">{title}</div>
          <div className="text-xl font-semibold mt-1">{value}</div>
        </div>
        <div className="text-2xl opacity-90">{icon}</div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="text-xs text-gray-600 dark:text-gray-400">From last 7 days</div>
        <div className="text-sm text-gray-700 dark:text-gray-300">{delta}</div>
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
