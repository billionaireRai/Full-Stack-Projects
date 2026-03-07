import React from 'react';
import axiosInstance from '@/lib/interceptor';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface DeletePostPopProps {
  closePopUp?: () => void;
  postId: string;
  postOwner: string;
  requestBy: string;
}

export default function DeletePostPop({ closePopUp, postId, postOwner, requestBy }: DeletePostPopProps) {
  const router = useRouter();

  const handleDeletePost = async () => {
    const loadingtoast = toast.loading('Deleting your post...');
    try {
      const deleteApi = await axiosInstance.delete(`/api/post/control?postId=${postId}&postOwner=${postOwner}&deleteRequestBy=${requestBy}`);
      if (deleteApi.status === 200) {
        toast.dismiss(loadingtoast);
        toast.success('Post deleted successfully !!');
        router.refresh(); // reloads the current page...
        closePopUp?.(); // close the modal
      } else {
        toast.dismiss(loadingtoast);
        toast.error('Deletion failed try later !!');
      }
    } catch (error) {
      console.log('An error occured :', error);
      toast.error('An Error Occured !!');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in-0 zoom-in-95 duration-200">
      {/* Modal */}
      <div className="relative flex items-center justify-center h-full">
        <div className="bg-white dark:bg-black rounded-lg p-6 max-w-sm mx-4 shadow-xl border border-gray-300 dark:border-gray-700">
          {/* Title */}
          <h2 className="text-black dark:text-white text-xl font-bold mb-4">Confirm Deletion</h2>

          {/* Description */}
          <p className="text-gray-700 dark:text-gray-300 text-sm mb-6">
            Are you sure you want to <b>delete</b> this post? <b>This action cannot be undone.</b>
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
              onClick={handleDeletePost}
              className="cursor-pointer flex-1 bg-red-600 hover:bg-red-700 text-white rounded-md px-4 py-2 text-sm font-medium transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
