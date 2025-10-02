import React from 'react'
import Link from 'next/link'

export default function Bluetickhover (){
  return (
    <div className="m-2 w-80 bg-white bg-opacity-90 dark:bg-black dark:bg-opacity-90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-300 dark:border-gray-700 z-10">
      <h2 className="text-black dark:text-white text-lg font-semibold mb-3 flex items-center">
        <img src="/svg/blue-tick.svg" alt="Verified" className="w-5 h-5 mr-2" />
        Verified account
      </h2>
      <div className="flex items-center mb-4 text-gray-700 dark:text-gray-300">
        <img src="/svg/blue-tick.svg" alt="Verified" className="w-4 h-4 mr-2 flex-shrink-0" />
        <span>This account is Verified as loyal user by Our Algorithms </span>
      </div>
      <div className="flex items-center mb-4 text-gray-700 dark:text-gray-300">
        <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span>This account is verified. <a href="#" className="text-blue-400 hover:underline">Learn more</a></span>
      </div>
      <div className="flex items-center mb-4 text-gray-700 dark:text-gray-300">
        <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>Verified since August 2025.</span>
      </div>
      <Link href='/subscription'>
        <button className="w-full cursor-pointer bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
          Upgrade to get verified
        </button>
      </Link>
    </div>
  )
}
