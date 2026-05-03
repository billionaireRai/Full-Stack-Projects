
import React from "react";

type OverviewItem = {
  value: number;
  rate: string;
};

type Overview = {
  followers: OverviewItem;
  followings: OverviewItem;
  likes: OverviewItem;
  comments: OverviewItem;
  reposts: OverviewItem;
  views: OverviewItem;
  bookmarks: OverviewItem;
};

type WatchTime = {
  hour: string;
  min: string;
  sec: string;
  rate: string;
};

type SeriesItem = {
  name: string;
  viewers?: number;
  value?: number;
};

type BreakdownItem = {
  name: string;
  value: number;
};

type UploadItem = {
  num: number;
  id: string;
  title: string;
  date: string;
  views: number;
  likes: number;
  comments: number;
};

type TopCountry = {
  country: string;
  percent: number;
};

type TopPost = {
  num: number;
  id: string;
  title: string;
  views: number;
  likes: number;
  comments: number;
};

interface Props {
  overview: Overview;
  watchTime: WatchTime;
  viewersSeries: SeriesItem[];
  deviceBreakdown: BreakdownItem[];
  genderBreakdown: BreakdownItem[];
  recentUploads: UploadItem[];
  topCountries: TopCountry[];
  topPosts: TopPost[];
  growthSeries: SeriesItem[];
  interactionTypes: BreakdownItem[];
  contentPerformance: BreakdownItem[];
}


const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full min-h-[1120px] p-12 flex flex-col justify-between break-after-page bg-white">
    {children}
  </div>
);

const SectionTitle = ({ title }: { title: string }) => (
  <h2 className="text-2xl font-bold text-yellow-500 border-b border-yellow-300 pb-2 mb-6">
    {title}
  </h2>
);

const Card = ({ label, value, rate }: any) => (
  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 shadow-sm">
    <p className="text-sm text-gray-500 capitalize">{label}</p>
    <h3 className="text-2xl font-bold mt-2">
      {(value ?? 0).toLocaleString()}
    </h3>
    <p
      className={`text-sm mt-1 ${
        (rate ?? "").includes("-") ? "text-red-500" : "text-green-600"
      }`}
    >
      {rate ?? "+0%"}
    </p>
  </div>
);

const Table = ({ headers, rows }: any) => (
  <table className="w-full border border-gray-200 text-sm mt-4">
    <thead className="bg-yellow-100">
      <tr>
        {headers.map((h: string, i: number) => (
          <th key={i} className="p-3 text-left border">
            {h}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {rows.map((row: any, i: number) => (
        <tr key={i} className="odd:bg-white even:bg-gray-50">
          {row.map((cell: any, j: number) => (
            <td key={j} className="p-3 border">
              {cell}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

const AnalyticsReport = (props: any) => {
  const {
    overview,
    watchTime,
    viewersSeries,
    deviceBreakdown,
    genderBreakdown,
    recentUploads,
    topCountries,
    topPosts,
    growthSeries,
    interactionTypes,
    contentPerformance,
  } = props;

  return (
    <div className="bg-white text-gray-800">

      {/* ================= COVER PAGE ================= */}
      <PageWrapper>
        <div className="flex flex-col items-center justify-center h-full text-center">
          
          {/* LOGO */}
          <div className="w-24 h-24 bg-yellow-400 rounded-full mb-6" />

          {/* BRAND */}
          <h1 className="text-5xl font-extrabold text-yellow-500 mb-4">
            EchoFox Analytics
          </h1>

          {/* REPORT TITLE */}
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">
            Social Media Performance Report
          </h2>

          {/* ACCOUNT DETAILS */}
          <div className="text-gray-600 space-y-2">
            <p><strong>Account:</strong> @username_here</p>
            <p><strong>Platform:</strong> Instagram / X</p>
            <p>
              <strong>Generated On:</strong>{" "}
              {new Date().toLocaleString()}
            </p>
          </div>
        </div>
      </PageWrapper>

      {/* ================= SUMMARY PAGE ================= */}
      <PageWrapper>
        <div>
          <SectionTitle title="Summary Overview" />
          <div className="grid grid-cols-3 gap-6 mt-6">
            {Object.entries(overview).map(([key, val]: any) => (
              <Card key={key} label={key} value={val.value} rate={val.rate} />
            ))}
          </div>

          {/* WATCH TIME */}
          <div className="mt-10 bg-yellow-50 p-6 rounded-xl border border-yellow-200">
            <h3 className="text-xl font-semibold">
              Watch Time: {watchTime.hour}h {watchTime.min}m {watchTime.sec}s
            </h3>
            <p className="text-green-600 mt-2">{watchTime.rate}</p>
          </div>
        </div>
      </PageWrapper>

      {/* ================= VISUAL PAGE ================= */}
      <PageWrapper>
        <div>
          <SectionTitle title="Analytics Visualizations" />

          {/* Placeholder for charts */}
          <div className="grid grid-cols-2 gap-8 mt-8">
            <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center">
              Chart 1 (Growth)
            </div>
            <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center">
              Chart 2 (Engagement)
            </div>
            <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center">
              Chart 3 (Devices)
            </div>
            <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center">
              Chart 4 (Gender)
            </div>
          </div>
        </div>
      </PageWrapper>

      {/* ================= DATA TABLES PAGE ================= */}
      <PageWrapper>
        <div>
          <SectionTitle title="Detailed Analytics Data" />

          <Table
            headers={["Month", "Viewers"]}
            rows={viewersSeries.map((v: any) => [v.name, v.viewers])}
          />

          <Table
            headers={["Device", "Usage"]}
            rows={deviceBreakdown.map((d: any) => [d.name, `${d.value}%`])}
          />

          <Table
            headers={["Gender", "Distribution"]}
            rows={genderBreakdown.map((g: any) => [g.name, `${g.value}%`])}
          />
        </div>
      </PageWrapper>

      {/* ================= CONTENT PERFORMANCE ================= */}
      <PageWrapper>
        <div>
          <SectionTitle title="Content Performance & Top Posts" />

          <Table
            headers={["#", "Title", "Views", "Likes", "Comments"]}
            rows={topPosts.map((p: any) => [
              p.num,
              p.title,
              p.views,
              p.likes,
              p.comments,
            ])}
          />

          <Table
            headers={["Country", "Audience %"]}
            rows={topCountries.map((c: any) => [
              c.country,
              `${c.percent}%`,
            ])}
          />
        </div>
      </PageWrapper>

      {/* ================= FOOTER PAGE ================= */}
      <PageWrapper>
        <div className="flex flex-col justify-center items-center h-full text-center">
          <h2 className="text-2xl font-bold text-yellow-500 mb-4">
            Thank You
          </h2>

          <p className="text-gray-600 max-w-md">
            This report is generated using EchoFox Analytics Engine.
            Use insights to optimize your content strategy and growth.
          </p>

          <div className="mt-10 text-sm text-gray-400">
            <p>© {new Date().getFullYear()} EchoFox</p>
          </div>
        </div>
      </PageWrapper>

    </div>
  );
};

export default AnalyticsReport;
