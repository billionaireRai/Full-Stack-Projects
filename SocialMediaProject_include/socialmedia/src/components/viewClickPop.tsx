import { Eye } from 'lucide-react';
import React,{ useEffect } from 'react'

interface viewProp {
  count:number ;
  closePopUp: () => void ;
}

export default function viewClickPop({ closePopUp , count }: viewProp) {

    useEffect(() => {
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') closePopUp();
      };
  
      window.addEventListener('keydown', onKeyDown);
      return () => window.removeEventListener('keydown', onKeyDown);
    }, [closePopUp]);
    
  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in-0 zoom-in-95 duration-200">
      {/* Modal */}
      <div className="relative flex items-center justify-center h-full">
        <div className="bg-white dark:bg-black rounded-lg p-6 max-w-md mx-4 shadow-xl border border-gray-300 dark:border-gray-700">
          {/* Title */}
          <h2 className="text-black flex items-center justify-between dark:text-white text-xl font-bold mb-4">
            <div className='flex items-center justify-center gap-1'>
              <Eye size={25} />
              <span>Views</span>
            </div>
            <div className='border border-yellow-500 text-yellow-500 bg-yellow-100 py-1 px-2 rounded-full'>{count}</div>
          </h2>

          {/* Description */}
          <p className="text-gray-700 dark:text-gray-300 text-xs mb-6">
          The view count indicates how many times this post has appeared on other users' screens — whether in their feed, on your profile, or when opened directly. This helps you understand your content's overall reach and visibility across the platform.
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
