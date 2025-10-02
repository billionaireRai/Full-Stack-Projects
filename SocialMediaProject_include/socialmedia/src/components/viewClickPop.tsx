import React from 'react'

interface viewProp {
  closePopUp?: () => void
}

export default function viewClickPop({ closePopUp }: viewProp) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in-0 zoom-in-95 duration-200">
      {/* Modal */}
      <div className="relative flex items-center justify-center h-full">
        <div className="bg-white dark:bg-black rounded-lg p-6 max-w-sm mx-4 shadow-xl border border-gray-300 dark:border-gray-700">
          {/* Title */}
          <h2 className="text-black dark:text-white text-xl font-bold mb-4">Views</h2>

          {/* Description */}
          <p className="text-gray-700 dark:text-gray-300 text-sm mb-6">
            Number of times this post has been viewed by our users.
          </p>

          {/* Dismiss button */}
          <button
            onClick={closePopUp}
            className="cursor-pointer w-full bg-black hover:bg-gray-900 dark:bg-white text-white dark:text-black rounded-md px-4 py-2 text-sm font-medium dark:hover:bg-gray-100 transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  )
}
