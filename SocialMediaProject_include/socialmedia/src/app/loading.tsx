'use client'

import React from 'react'

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen w-full bg-white dark:bg-black transition-colors duration-300">
      <div className="flex flex-col items-center gap-6">

        {/* Spinner */}
        <div className="w-14 h-14 border-4 border-gray-300 dark:border-gray-700 border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin"></div>

        {/* Text */}
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300 animate-pulse">
          Loading, please wait...
        </p>
      </div>
    </div>
  );
}
