import { MoreHorizontalIcon, ThumbsDown, AlertTriangle, ShieldAlert, EyeOff, Copy } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";

interface trendcardprop {
  rank?:number ,
  region?:string ,
  tag?:string ,
  posts?:string
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
    <li>
      <div className="flex justify-between items-center bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-4 cursor-pointer hover:shadow-md dark:hover:shadow-gray-900 transition-colors relative">
        
        {/* Left Section */}
        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {rank} · Trending in {region}
          </span>
          <span className="font-semibold text-gray-900 dark:text-white text-base">
            {tag}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {posts} posts
          </span>
        </div>

        {/* Right Section (3-dot menu) */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={toggleDropdown}
            className="text-gray-400 hover:bg-gray-100 p-1 rounded-full cursor-pointer dark:hover:bg-gray-950 transition"
            aria-haspopup="true"
            aria-expanded={isDropdownOpen}
            aria-label="More options"
          >
            <MoreHorizontalIcon />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-74 p-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-10 overflow-hidden">
               <button
                 className="flex items-center w-full cursor-pointer rounded-lg text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-950"
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
          )}
        </div>
      </div>
    </li>
  );
}
