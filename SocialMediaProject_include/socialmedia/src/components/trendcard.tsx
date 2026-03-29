'use client'

import { fmt } from "@/lib/utils";
import { MoreHorizontalIcon, ThumbsDown, AlertTriangle, ShieldAlert, EyeOff, Copy, MessageCirclePlusIcon } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";

export interface trendcardprop {
  rank?:number ,
  region?:string ,
  tag?:string ,
  posts:number
}

export default function TrendCard({ rank, region, tag, posts } : trendcardprop ) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if ( dropdownRef.current && !dropdownRef.current.contains(event.target as Node) ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Link href={`/explore?t=${encodeURIComponent(String(tag))}&utm_source=Trending-Nowdays`}>
        <div className="flex justify-between p-3 items-center bg-gradient-to-br cursor-pointer from-white/80 to-gray-50/80 dark:from-slate-900/80 dark:to-black/80 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-out relative overflow-hidden group">
        
        {/* Left Section */}
        <div className="flex flex-col gap-3 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-500 via-yellow-300 to-yellow-100 flex items-center justify-center shadow-md animate-pulse-slow">
              <span className="text-xs font-bold text-white">{rank}</span>
            </div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100/50 dark:bg-slate-800/50 px-3 py-1 rounded-full">
              Trending in {region}
            </span>
          </div>
          <h3 className="font-bold text-sm bg-gradient-to-r from-gray-900 via-indigo-600 to-purple-600 dark:from-white dark:via-slate-200 bg-clip-text text-transparent transition-transform">
            {tag}
          </h3>
          <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-yellow-500 dark:group-hover:text-yellow-600 transition-colors">
            <MessageCirclePlusIcon size={15}/>
            <span>{fmt(posts)} posts</span>
          </div>
        </div>

        {/* Right Section (3-dot menu) */}
        <div ref={dropdownRef} className="relative">
          {/* <button
            onClick={toggleDropdown}
            className="text-gray-500 hover:bg-white/50 dark:hover:bg-slate-800/50 p-2 rounded-xl backdrop-blur-sm cursor-pointer transition-all hover:scale-110 shadow-md dark:shadow-gray-900/50"
            aria-haspopup="true"
            aria-expanded={isDropdownOpen}
            aria-label="More options"
          >
            <MoreHorizontalIcon className="h-5 w-5" />
          </button> */}

          {/* {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-74 p-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-10 overflow-hidden">
               <button
                 className="flex items-center w-full cursor-pointer rounded-xl text-left px-5 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-slate-800 dark:hover:to-slate-700 transition-all hover:scale-[1.02]"
                 onClick={() => setIsDropdownOpen(false)}
               >
                 <ThumbsDown className="mr-2 h-4 w-4" />
                 The associated content is not relevant
               </button>
               <button
                 className="flex items-center w-full cursor-pointer rounded-lg text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-950"
                 onClick={() => setIsDropdownOpen(false)}
               >
                 <AlertTriangle className="mr-2 h-4 w-4" />
                 This trend is spam
               </button>
               <button
                 className="flex items-center w-full cursor-pointer rounded-lg text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-950"
                 onClick={() => setIsDropdownOpen(false)}
               >
                 <ShieldAlert className="mr-2 h-4 w-4" />
                 This trend is abusive or harmful
               </button>
               <button
                 className="flex items-center w-full cursor-pointer rounded-lg text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-950"
                 onClick={() => setIsDropdownOpen(false)}
               >
                 <EyeOff className="mr-2 h-4 w-4" />
                 Not interested in this
               </button>
               <button
                 className="flex items-center w-full cursor-pointer rounded-lg text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-950"
                 onClick={() => setIsDropdownOpen(false)}
               >
                 <Copy className="mr-2 h-4 w-4" />
                 This trend is a duplicate
               </button>
               <button
                 className="flex items-center w-full cursor-pointer rounded-lg text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-950"
                 onClick={() => setIsDropdownOpen(false)}
               >
                 <AlertTriangle className="mr-2 h-4 w-4" />
                 This trend is harmful or spammy
               </button>
               <button
                 className="flex items-center w-full cursor-pointer rounded-lg text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-950"
                 onClick={() => setIsDropdownOpen(false)}
               >
                 <EyeOff className="mr-2 h-4 w-4" />
                 Don't want to see this ad
               </button>
             </div>
          )} */}
        </div>
      </div>
    </Link>
  );
}
