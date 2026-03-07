'use client'

import React from 'react';
import axiosInstance from '@/lib/interceptor';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { X, Star, Check } from 'lucide-react';

interface HighlightPostPopProps {
  visible: boolean;
  postId:string;
  onClose: () => void;
  updateState: () => void;
  action?: string;
}

export default function HighlightPostPop({
  visible,
  onClose,
  postId,
  updateState,
  action
}: HighlightPostPopProps) {
  if (!visible) return null;
  const router = useRouter() ;
   // useeffect for hightlight change...
   const handleHighlightToggle = async () => {
    const loadingtoast = toast.loading('highlighting your post...');
      try {
        const highLightApi = await axiosInstance.patch(`/api/post/control?`,{ postId:postId });
        if (highLightApi.status === 200) {
           toast.dismiss(loadingtoast)
           updateState?.() ;
           toast.success(`Post Highlight Changed !!`)
           onClose();
           router.refresh() ;
        } else {
          toast.dismiss(loadingtoast);
          toast.error('highlighting failed try later !!');
        }
      } catch (error) {
        toast.dismiss(loadingtoast)
        console.log('An error occured :', error);
        toast.error('An Error Occured !!');
      }
   }
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in-0 zoom-in-95 duration-200"
    >
      <div
        className="bg-white dark:bg-black rounded-xl p-6 w-full max-w-lg relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-950 cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span>Highlight Post</span>
          </h2>
          <p className="text-gray-600 text-sm dark:text-gray-300 mb-6">
            Highlighting this post will feature it prominently in highlight section of your profile . This action helps showcase important or favorite content, drawing attention to posts you want to emphasize. Are you sure you want to proceed with highlighting this post?
          </p>
          <div className="flex gap-3 items-center justify-center">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center gap-2 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => { handleHighlightToggle() }}
              className="px-6 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition-colors flex items-center gap-2 cursor-pointer"
            >
              {action}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
