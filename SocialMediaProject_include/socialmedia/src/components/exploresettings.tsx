'use client'

import React from "react"
import { X } from "lucide-react"

interface ExploreSettingsProps {
  LocationSetting: boolean;
  toggleLocation: () => void;
  close: () => void;
}

export default function ExploreSettings({ LocationSetting, toggleLocation, close }: ExploreSettingsProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in-0 zoom-in-95 duration-200">
      <div className="w-full max-w-md p-6 bg-white dark:bg-black rounded-lg text-gray-900 dark:text-white font-poppins">
        <div className='flex flex-row mb-6 items-center justify-between'>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Explore settings</h2>
          <button
            onClick={close}
            className="text-gray-900 dark:text-white text-2xl font-bold cursor-pointer"
            aria-label="Close settings modal"
          >
            <X width={25} height={25} className='p-1 hover:bg-gray-100 dark:hover:bg-gray-950 rounded-full' />
          </button>
        </div>

        {/* Location */}
        <div className='my-4'>
          <h3 className="font-bold mb-2">Location</h3>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              checked={LocationSetting}
              onChange={toggleLocation}
              type="checkbox"
              className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm">
              Show content in this location
              <p className="text-xs text-gray-400">
                When this is on, you'll see what's happening around you right now.
              </p>
            </span>
          </label>
        </div>

        {/* Trends */}
        <div className='my-4'>
          <h3 className="font-bold mb-2">Trends</h3>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              id="trends"
              defaultChecked
              className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm">
              Show trends for you
              <p className="text-xs text-gray-400">
                See trending topics based on your interests.
              </p>
            </span>
          </label>
        </div>

        {/* Personalized */}
        <div className='my-4'>
          <h3 className="font-bold mb-2">Personalized</h3>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              id="personalized"
              defaultChecked
              className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm">
              Show personalized content
              <p className="text-xs text-gray-400">
                Recommendations based on accounts you follow.
              </p>
            </span>
          </label>
        </div>

        {/* Interests */}
        <div className='my-4'>
          <h3 className="font-bold mb-2">Interests</h3>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              id="interests"
              defaultChecked
              className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm">
              Show content matching interests
              <p className="text-xs text-gray-400">
                Content from topics you've selected.
              </p>
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
