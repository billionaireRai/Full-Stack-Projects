'use client'

import React from 'react'

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen w-full bg-white dark:bg-black transition-colors duration-300">
      <div className="flex flex-row items-center gap-6">
        <img
          src="/images/letter-B.png"
          className="w-20 h-20 animate-pulse rounded-full dark:invert"
          alt="logo"
        />
        <p className="text-lg font-medium text-gray-600 dark:text-gray-400 animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
}
