'use client'

import React from 'react'
import { Frown, X } from 'lucide-react'
import toast from 'react-hot-toast'
import axiosInstance from '@/lib/interceptor'

interface NotInterestedPopProps {
  closePopUp: () => void,
  updateState:() => void,
  postId: string,
  username?: string
}

export default function NotInterestedPop({ closePopUp, postId, username , updateState }: NotInterestedPopProps) {
  
  // Handler for not interested action - API logic to be added by user
  const handleNotInterested = async () => {
    const loadingToast = toast.loading('Not interested proccessing...');
    try {
      const response = await axiosInstance.post(`/api/post`, { postId });
      if (response.status === 200) {
        toast.dismiss(loadingToast);
        updateState() ; // state updation in postcard...
        toast.success('Post hidden from your feed !!');
        closePopUp();
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Failed to hide post !!');
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in-0 zoom-in-95 duration-200">
      <div className="bg-white dark:bg-black border border-gray-800 dark:border-gray-900 rounded-xl shadow-2xl p-6 w-full max-w-lg mx-4 relative">
        <button
          className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-950 dark:hover:text-gray-200 transition-colors"
          onClick={() => { closePopUp() }}
        >
          <X size={15} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-yellow-100 dark:bg-gray-950 rounded-full flex items-center justify-center mb-4">
            <Frown size={32} className="text-yellow-500" />
          </div>
          
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Not Interested?
          </h2>
          
          <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
            Are you sure you want to hide this post from <b>{username}</b> ? You won't see this post in your feed anymore.
          </p>

          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={handleNotInterested}
              className="cursor-pointer w-full px-4 py-2.5 text-sm font-medium text-white bg-yellow-400 rounded-lg hover:bg-yellow-500 active:bg-yellow-400 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Yes, hide this post
            </button>
            
            <button
              onClick={() => { closePopUp() }}
              className="cursor-pointer w-full px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-950 rounded-lg hover:bg-gray-200 dark:hover:bg-black transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>

          </div>
        </div>
      </div>
    </div>
  )
}
