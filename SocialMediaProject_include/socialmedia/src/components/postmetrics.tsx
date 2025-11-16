'use client'

import React, { useState, useEffect } from 'react'
import { Eye, Heart, MessageCircle, Repeat, Bookmark, TrendingUp, Users, MapPin, Smartphone, Monitor, Clock, BarChart3, PieChart, Activity } from 'lucide-react'
import { useParams } from 'next/navigation'

interface PostMetrics {
  views: number
  likes: number
  comments: number
  shares: number
  bookmarks: number
  reach: number
  impressions: number
  engagementRate: number
  demographics: {
    age: { range: string; percentage: number }[]
    gender: { type: string; percentage: number }[]
    locations: { country: string; percentage: number }[]
  }
  deviceBreakdown: { device: string; percentage: number }[]
  hourlyEngagement: { hour: number; engagement: number }[]
  topPerformingDays: { day: string; engagement: number }[]
}

export default function PostMetricsPage({postId}:{ postId:string }) {
  const [metrics, setMetrics] = useState<PostMetrics | null>(null)

  useEffect(() => {
    const fetchMetrics = async () => {
      // will replace this data with acctual one... 
      const mockMetrics: PostMetrics = {
        views: 12543,
        likes: 892,
        comments: 234,
        shares: 156,
        bookmarks: 78,
        reach: 9876,
        impressions: 14567,
        engagementRate: 7.2,
        demographics: {
          age: [
            { range: '18-24', percentage: 35 },
            { range: '25-34', percentage: 42 },
            { range: '35-44', percentage: 18 },
            { range: '45+', percentage: 5 }
          ],
          gender: [
            { type: 'Male', percentage: 55 },
            { type: 'Female', percentage: 40 },
            { type: 'Other', percentage: 5 }
          ],
          locations: [
            { country: 'United States', percentage: 28 },
            { country: 'India', percentage: 22 },
            { country: 'United Kingdom', percentage: 15 },
            { country: 'Canada', percentage: 12 },
            { country: 'Australia', percentage: 8 },
            { country: 'Others', percentage: 15 }
          ]
        },
        deviceBreakdown: [
          { device: 'Mobile', percentage: 68 },
          { device: 'Desktop', percentage: 25 },
          { device: 'Tablet', percentage: 7 }
        ],
        hourlyEngagement: [
          { hour: 9, engagement: 45 },
          { hour: 12, engagement: 78 },
          { hour: 15, engagement: 92 },
          { hour: 18, engagement: 85 },
          { hour: 21, engagement: 67 }
        ],
        topPerformingDays: [
          { day: 'Monday', engagement: 85 },
          { day: 'Tuesday', engagement: 92 },
          { day: 'Wednesday', engagement: 78 },
          { day: 'Thursday', engagement: 88 },
          { day: 'Friday', engagement: 95 },
          { day: 'Saturday', engagement: 72 },
          { day: 'Sunday', engagement: 68 }
        ]
      }

      setTimeout(() => {
        setMetrics(mockMetrics)
      }, 1000)
    }

    fetchMetrics()
  }, [postId])

  if (!metrics) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
        <div className="text-center">
          <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No metrics available</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Unable to load post metrics at this time.</p>
        </div>
      </div>
    )
  }

  const MetricCard = ({ icon: Icon, title, value, change, color = 'blue' }: {
    icon: React.ElementType
    title: string
    value: string | number
    change?: string
    color?: string
  }) => (
    <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100 dark:bg-${color}-900/20`}>
          <Icon className={`h-6 w-6 text-${color}-600 dark:text-${color}-400`} />
        </div>
      </div>
    </div>
  )

  const ProgressBar = ({ label, percentage }: { label: string; percentage: number }) => (
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
      <span className="text-sm font-medium text-gray-900 dark:text-white">{percentage}%</span>
    </div>
  )

  return (
    <div className="min-h-screen dark:bg-black px-6 py-2 rounded-lg">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="m-5 flex flex-col items-center justify-center">
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">Post Analytics</h1>
          <p className="text-gray-600 text-sm dark:text-gray-400 mt-2">Detailed insights and metrics for this post</p>
        </div>

        {/* Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            icon={Eye}
            title="Views"
            value={metrics.views.toLocaleString()}
            change="+12.5%"
            color="blue"
          />
          <MetricCard
            icon={Heart}
            title="Likes"
            value={metrics.likes.toLocaleString()}
            change="+8.2%"
            color="red"
          />
          <MetricCard
            icon={MessageCircle}
            title="Comments"
            value={metrics.comments.toLocaleString()}
            change="+15.3%"
            color="green"
          />
          <MetricCard
            icon={Repeat}
            title="Shares"
            value={metrics.shares.toLocaleString()}
            change="+22.1%"
            color="purple"
          />
        </div>

        {/* Engagement Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MetricCard
            icon={Bookmark}
            title="Bookmarks"
            value={metrics.bookmarks.toLocaleString()}
            change="+5.7%"
            color="yellow"
          />
          <MetricCard
            icon={Users}
            title="Reach"
            value={metrics.reach.toLocaleString()}
            change="+18.9%"
            color="indigo"
          />
          <MetricCard
            icon={TrendingUp}
            title="Engagement Rate"
            value={`${metrics.engagementRate}%`}
            change="+2.1%"
            color="orange"
          />
        </div>

        {/* Demographics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Age Distribution */}
          <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Age Distribution
            </h3>
            <div className="space-y-3">
              {metrics.demographics.age.map((ageGroup, index) => (
                <div key={index}>
                  <ProgressBar label={ageGroup.range} percentage={ageGroup.percentage} />
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-yellow-500 dark:bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${ageGroup.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gender Distribution */}
          <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Gender Distribution
            </h3>
            <div className="space-y-3">
              {metrics.demographics.gender.map((gender, index) => (
                <div key={index}>
                  <ProgressBar label={gender.type} percentage={gender.percentage} />
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-yellow-500 dark:bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${gender.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Location Insights */}
        <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Top Locations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {metrics.demographics.locations.map((location, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-950 rounded-lg">
                <span className="text-sm font-medium text-gray-900 dark:text-white">{location.country}</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">{location.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Smartphone className="h-5 w-5 mr-2" />
            Device Breakdown
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {metrics.deviceBreakdown.map((device, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center mb-2">
                  {device.device === 'Mobile' && <Smartphone className="h-8 w-8 text-yellow-500 dark:text-blue-500" />}
                  {device.device === 'Desktop' && <Monitor className="h-8 w-8 text-yellow-500 dark:text-blue-500" />}
                  {device.device === 'Tablet' && <Monitor className="h-8 w-8 text-yellow-500 dark:text-blue-500" />}
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{device.percentage}%</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{device.device}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Hourly Engagement */}
          <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Hourly Engagement
            </h3>
            <div className="space-y-3">
              {metrics.hourlyEngagement.map((hour, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{hour.hour}:00</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-yellow-500 dark:bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${hour.engagement}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white w-8">{hour.engagement}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performing Days */}
          <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Top Performing Days
            </h3>
            <div className="space-y-3">
              {metrics.topPerformingDays.map((day, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{day.day}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-yellow-500 dark:bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${day.engagement}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white w-8">{day.engagement}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
