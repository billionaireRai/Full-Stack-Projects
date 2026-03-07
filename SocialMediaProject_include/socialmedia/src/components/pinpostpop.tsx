import React from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import axiosInstance from '@/lib/interceptor'
import { Pin } from 'lucide-react'

interface pinPostPopProp {
  closePopUp?: () => void,
  toggleState?:() => void,
  IsPinned:boolean,
  postOwner:string,
  requestBy:string,
  postId:string
}

export default function PinPostPop({ closePopUp, toggleState , IsPinned , postOwner ,requestBy, postId }: pinPostPopProp) {
  const router = useRouter() ;
  // function hanlding pining of post...
    const handlePinPost = async () => { 
      const loadingtoast = toast.loading('Pinning your post...');
      try {
        const pinApi = await axiosInstance.get(`/api/post/control?currentPinState=${IsPinned}&postOwner=${postOwner}&pinRequestBy=${requestBy}&postId=${postId}`);
        if (pinApi.status === 200) {
          toast.dismiss(loadingtoast);
          toast.success('Post pinned successfully !!')
          toggleState?.(); // toggling the IsPinned state in postcard...
          closePopUp?.();
          router.refresh() ; // reloads the current page...
        } else {
          toast.dismiss(loadingtoast);
          toast.error('Pinning failed try later !!');
        }
      } catch (error) {
        console.log('An error occured :',error);
        toast.error('An Error Occured !!');
      }
    }
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in-0 zoom-in-95 duration-200">
      {/* Modal */}
      <div className="relative flex items-center justify-center h-full">
        <div className="bg-white dark:bg-black rounded-lg p-6 max-w-md mx-4 shadow-xl border border-gray-300 dark:border-gray-900">
          {/* Icon and Title */}
          <div className="flex items-center gap-3 mb-4">
            <Pin className="w-6 h-6 text-yellow-500 rotate-45" />
            <h2 className="text-black dark:text-white text-xl font-bold">Confirm Pin Post</h2>
          </div>

          {/* Description */}
          <p className="text-gray-700 dark:text-gray-300 text-sm mb-6">
            Pinning this post will make it appear at the top of your profile. This action can be undone later. Are you sure you want to proceed?
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
              onClick={handlePinPost}
              className="cursor-pointer flex-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded-md px-4 py-2 text-sm font-medium transition-colors"
            >
              Pin Post
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
