import React from 'react'

interface InterestProps {
  onClose?: () => void ,
  getStarted? : () => void
}

export default function Interest({ onClose , getStarted }: InterestProps) {

  return (
    <div className='bg-white dark:bg-black border dark:border-black border-gray-200 rounded-lg py-6 px-8 shadow-xl max-w-md w-full mx-4 relative'>
      <div className='text-center'>
        <div className='mb-4'>
          <div className='w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-3'>
            <span className='text-2xl'>🎯</span>
          </div>
          <h3 className='text-xl font-semibold text-gray-800 dark:text-white mb-2'>Discover Your Interests</h3>
          <p className='text-gray-600 dark:text-gray-500 text-sm mb-4'>
            Tell us what you're interested in to personalize your feed with relevant content.
          </p>
        </div>

        <div className='space-y-3'>
          <button
            onClick={getStarted}
            className='w-full cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors'>
            Get Started
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className='w-full cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors'
            >
              Maybe Later
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
