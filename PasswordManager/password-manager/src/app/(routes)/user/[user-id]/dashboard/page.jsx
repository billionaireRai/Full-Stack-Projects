"use client";

import Navbar from '@/components/navbar.jsx';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend, RadialBarChart, RadialBar } from 'recharts';


export default function MainDashboardPage() {
    const [topInformation, settopInformation] = useState([
    { label: 'Total Vaults', value: '14' },
    { label: 'Items Stored', value: '274' },
    { label: 'Shared Vaults', value: '3' },
    { label: 'Breach Alerts', value: '1 Active', valueClass: 'text-red-600' },
]);

const [vaultUsageData, setvaultUsageData] = useState([
    { name: 'Jan', count: 4 },
    { name: 'Feb', count: 6 },
    { name: 'Mar', count: 10 },
    { name: 'Apr', count: 12 },
    { name: 'May', count: 15 },
]);

const [vaultTypeData, setvaultTypeData] = useState([
  { name: 'Private', value: 10 },
  { name: 'Shared', value: 4 },
]);

const [breachTrendData, setbreachTrendData] = useState([
  { name: 'Week 1', breaches: 1 },
  { name: 'Week 2', breaches: 2 },
  { name: 'Week 3', breaches: 1 },
  { name: 'Week 4', breaches: 3 },
]);

const [categoryData, setcategoryData] = useState([
  { name: 'Passwords', value: 120 },
  { name: 'Bank Info', value: 45 },
  { name: 'IDs', value: 60 },
  { name: 'Notes', value: 49 },
]);

const [storageData, setstorageData] = useState([
  { name: 'Used', value: 70, fill: '#8884d8' },
  { name: 'Available', value: 30, fill: '#d0d0d0' },
])
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 text-gray-800">
      <nav>
        <Navbar />
      </nav>
      <main className="pt-24 px-6 md:px-12 max-w-7xl mx-auto">
        <h1 className="text-4xl flex items-center gap-3 font-extrabold mb-10 text-left text-gray-900"><span>Your Vault Dashboard</span><Image width={50} height={50} src="/images/secreticon.png" alt="logo" /></h1>

        {/* Quick Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {topInformation.map((stat, i) => (
            <div key={i} className={`${stat.label === 'Breach Alerts' ? 'animate-pulse border-red-500 shadow-red-400' : "" } cursor-pointer bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition`}>
              <h2 className="text-sm font-medium text-gray-500">{stat.label}</h2>
              <p className={`text-3xl font-bold mt-2 ${stat.valueClass || 'text-gray-900'}`}>{stat.value}</p>
            </div>
          ))}
        </section>

        {/* Charts */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
          <ChartCard title="Vault Usage Over Time">
            <LineChart data={vaultUsageData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ChartCard>

          <ChartCard title="Vault Type Distribution">
            <PieChart>
              <Pie data={vaultTypeData} dataKey="value" nameKey="name" outerRadius={80} label>
                {vaultTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#60A5FA' : '#FBBF24'} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ChartCard>

          <ChartCard title="Breach Alerts Trend">
            <BarChart data={breachTrendData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="breaches" fill="#EF4444" />
            </BarChart>
          </ChartCard>

          <ChartCard title="Item Categories">
            <BarChart data={categoryData} layout="vertical">
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Bar dataKey="value" fill="#34D399" />
            </BarChart>
          </ChartCard>

          <ChartCard title="Storage Consumption">
            <RadialBarChart innerRadius="60%" outerRadius="100%" data={storageData} startAngle={90} endAngle={-270}>
              <RadialBar background clockWise dataKey="value" />
              <Tooltip />
            </RadialBarChart>
          </ChartCard>
        </section>

        {/* Quick Actions */}
        <section className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-12">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link href="/shared-vault" className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-md font-medium transition">
              Manage Sharing
            </Link>
            <button className="cursor-pointer bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2 rounded-md font-medium transition">
              Generate Vault Report
            </button>
            <button className="cursor-pointer bg-purple-500 hover:bg-purple-600 text-white px-5 py-2 rounded-md font-medium transition">
              Download Backup
            </button>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <ul className="divide-y divide-gray-200 text-sm text-gray-700">
            <li className="flex justify-between py-2">
              <span>Added new item to "Bank Vault"</span>
              <span className="text-gray-400">2 hours ago</span>
            </li>
            <li className="flex justify-between py-2">
              <span>Vault settings updated</span>
              <span className="text-gray-400">Yesterday</span>
            </li>
            <li className="flex justify-between py-2">
              <span>Shared vault access granted to John</span>
              <span className="text-gray-400">2 days ago</span>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <ResponsiveContainer width="100%" height={250}>
        {children}
      </ResponsiveContainer>
    </div>
  );
}
