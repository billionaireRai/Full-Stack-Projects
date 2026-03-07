'use client'

import React,{ useState } from 'react'
import Link from 'next/link'
import { MoreHorizontal, Flame, TrendingUp, Gamepad2, Briefcase, X, Ban, AlertTriangle, EyeOff, Copy } from 'lucide-react'

interface TrendingCardProps {
  id: number
  trendName: string
  postCount: string
  category: string
  iconType: 'flame' | 'trending' | 'gamepad' | 'briefcase'
  gradientFrom: string
  gradientTo: string
}

const iconMap = {
  flame: <Flame className="w-4 h-4 text-white" />,
  trending: <TrendingUp className="w-4 h-4 text-white" />,
  gamepad: <Gamepad2 className="w-4 h-4 text-white" />,
  briefcase: <Briefcase className="w-4 h-4 text-white" />
}

export default function TrendingCard({
  id,
  trendName,
  postCount,
  category,
  iconType,
  gradientFrom,
  gradientTo,
}: TrendingCardProps) {

  const [showOption, setshowOption] = useState<boolean>(false);
  return (
    <Link 
      href={`/explore?q=${trendName}&utm_source=trend-click`}
      className="happening-dropdown hover:bg-gray-100 dark:hover:bg-gray-950 p-3 rounded-lg cursor-pointer transition-all duration-200 inline-block w-full"
    >
      <div className="flex items-center justify-center space-x-3">
        <div className={`w-8 h-8 bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-full flex items-center justify-center`}>
          {iconMap[iconType]}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-500 dark:text-gray-400">{category}</p>
          <p className="font-bold text-gray-900 dark:text-white">{trendName.substring(1)}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{postCount} posts</p>
        </div>
        <div 
          onClick={(e) => { e.preventDefault() ; e.stopPropagation() ; setshowOption(!showOption) }} 
          className="relative"
        >
          <MoreHorizontal className="hover:border p-1 border-gray-400 rounded-full cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 transition-colors" />
          {showOption && (
            <div className="absolute flex flex-col animate-in slide-in-from-top-2 duration-200 gap-1.5 right-7 top-0 mt-2 w-[300px] bg-white dark:bg-black dark:shadow-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 z-50 p-2">
              <button
                className="w-full text-left px-4 py-2 cursor-pointer rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100   dark:hover:bg-gray-950 rounded-t-lg"
              >
            <div className="flex items-center gap-2">
              <X size={16} />
              <span>content is not relevant</span>
            </div>
              </button>
              <button
                className="w-full text-left px-4 py-2 cursor-pointer rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100   dark:hover:bg-gray-950"
              >
            <div className="flex items-center gap-2">
              <Ban size={16} />
              <span>This trend is spam</span>
            </div>
              </button>
              <button
                onClick={() => {
          
                }}
                className="w-full text-left px-4 py-2 cursor-pointer rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100   dark:hover:bg-gray-950"
              >
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} />
              <span>This trend is abusive OR harmful</span>
            </div>
              </button>
              <button
                className="w-full text-left px-4 py-2 cursor-pointer rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100   dark:hover:bg-gray-950"
              >
            <div className="flex items-center gap-2">
              <EyeOff size={16} />
              <span>Not interested in this</span>
            </div>
              </button>
              <button
                className="w-full text-left px-4 py-2 cursor-pointer rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100   dark:hover:bg-gray-950"
              >
                <div className="flex items-center gap-2">
                  <Copy size={16} />
                  <span>This trend is a duplicate</span>
                </div>
              </button>
              <button
                className="w-full text-left px-4 py-2 cursor-pointer rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100   dark:hover:bg-gray-950"
              >
            <div className="flex items-center gap-2">
              <Ban size={16} />
              <span>This trend is spammy</span>
            </div>
              </button>
              <button
                className="w-full text-left px-4 py-2 cursor-pointer rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100   dark:hover:bg-gray-950 rounded-b-lg"
              >
            <div className="flex items-center gap-2">
              <EyeOff size={16} />
              <span>Don't want to see this ad</span>
            </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
