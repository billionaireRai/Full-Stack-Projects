'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import axiosInstance from '@/lib/interceptor'
import toast from 'react-hot-toast'
import { MdFavorite } from 'react-icons/md'

interface FavouriteAddPopProp {
  closePopUp?: () => void
  postid:string
  handle:string
  itemType?: string
}

export default function FavouriteAddPop({ closePopUp, handle ,postid ,itemType = 'item' }: FavouriteAddPopProp) {
    const router = useRouter() ; // initializing router hook...
  const handleAddToFavourite = async () => {
    const loadingtoast = toast.loading('Adding to favourite...');
     try {
     const highLightApi = await axiosInstance.post(`/api/post/control`,{ postId:postid });
     if (highLightApi.status === 200) {
        toast.dismiss(loadingtoast)
        toast.success(`Added to favourite !!`)
        closePopUp?.();
        // router.push(`@/${handle}/favourites`) ;
     } else {
       toast.dismiss(loadingtoast);
       toast.error('Failed To add try later !!');
     }
     } catch (error) {
     toast.dismiss(loadingtoast)
     console.log('An error occured :', error);
     toast.error('An Error Occured !!');
     }
  } 
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in-0 zoom-in-95 duration-200">
      {/* Modal */}
      <div className="relative flex items-center justify-center h-full">
        <div className="bg-white dark:bg-black rounded-lg p-6 max-w-md mx-4 shadow-xl border border-gray-300 dark:border-gray-700">
          {/* Title */}
          <div className='flex items-center gap-2.5 mb-3'>
            <MdFavorite size={25}/>
            <h2 className="text-black dark:text-white text-xl font-bold">Add to Favourite</h2>
          </div>

          {/* Description */}
          <p className="text-gray-700 dark:text-gray-300 text-sm mb-6">
            Are you sure you want to add this {itemType} to your favourites? Your favourites act as preference signals, guiding recommendations and prioritizing content you’re more likely to enjoy across the platform.
          </p>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={closePopUp}
              className="cursor-pointer flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md px-4 py-2 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {handleAddToFavourite()}}
              className="cursor-pointer flex-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded-md px-4 py-2 text-sm font-medium transition-colors"
            >
              Add to Favourite
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
