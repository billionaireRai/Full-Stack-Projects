import React from 'react'
import axiosInstance from '@/lib/interceptor';
import toast from 'react-hot-toast';

interface BlockUserProp {
  closeBlockPop: () => void,
  updateblockState: () => void,
  username: string,
  isBlocked: boolean,
}

export default function BlockUser({ closeBlockPop , username , updateblockState, isBlocked }: BlockUserProp) {

  // function handling logic of blocking/unblocking...
  const handleUserBlock = async (handle:string) => {
    try {
      const blockApi = await axiosInstance.patch('/api/profile',{ handle:handle , isBlock:isBlocked }) ;
      if (blockApi.status === 200) {
        updateblockState();
        closeBlockPop();
        toast.success(`Successfully ${isBlocked ? 'unblocked' : 'blocked'} user !!`);
      } else {
        toast.error('Failed to perform the action...');
      }
    } catch (error) {
      console.error('Error blocking/unblocking user:', error);
      toast.error('An error occurred. Please try again.');
    }
  }
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in-0 zoom-in-95 duration-200">
      {/* Modal */}
      <div className="relative flex items-center justify-center">
        <div className="bg-white dark:bg-black rounded-lg p-6 max-w-md mx-6 shadow-xl border border-gray-300 dark:border-gray-800">
          {/* Title */}
          <h2 className="text-black dark:text-white text-xl font-bold mb-3">Confirm {isBlocked ? 'Unblock' : 'Block'}</h2>

          {/* Description */}
          <p className="text-gray-700 dark:text-gray-300 text-sm mb-6">
            {isBlocked
              ? 'Are you sure you want to unblock this Account? You can follow them again after unblocking.'
              : 'Are you sure you want to block this Account ? If unblocked later, you will have to send a follow request again to the Account.'
            }
          </p>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={closeBlockPop}
              className="cursor-pointer flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md py-2 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {handleUserBlock(username)}}
              className="cursor-pointer flex-1 bg-red-600 hover:bg-red-700 text-white rounded-md py-2 text-sm font-medium transition-colors"
            >
              {isBlocked ? 'Unblock' : 'Block'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


