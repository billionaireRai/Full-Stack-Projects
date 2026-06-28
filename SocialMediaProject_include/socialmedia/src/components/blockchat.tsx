import React,{ useEffect } from "react";
import Link from "next/link";
import axiosInstance from '@/lib/interceptor';
import toast from 'react-hot-toast';
import { BanIcon } from 'lucide-react';
import { infoForChatCard } from "./chataccountcard";

interface BlockChatProp {
closeBlockPop: () => void,
updateblockState: (value:boolean) => void,
conv: infoForChatCard,
}

export default function BlockChatPop({ closeBlockPop , updateblockState , conv }:BlockChatProp) {

  // function handling logic of blocking/unblocking...
  const handleChatBlock = async () => {
    const loadingToast = toast.loading(`Please wait ${conv.blockedTo ? 'unblocking' : 'blocking'} chat ${conv.handle} `)
    const updateTo = !conv.blockedTo ;
    try {
      const blockChatApi = await axiosInstance.patch('/api/account/conversations',{ username:conv.handle.substring(1) ,conversationid:conv.id , changeTo:updateTo }) ;
      if (blockChatApi.status === 200) {
        updateblockState(updateTo);
        closeBlockPop();
        toast.dismiss(loadingToast);
        toast.success(`Successfully ${conv.blockedTo ? 'unblocked' : 'blocked'} chat ${conv.handle} !!`);
      } else {
        toast.error('Failed to perform the action...');
        toast.dismiss(loadingToast);
      }
    } catch (error) {
      console.error('Error blocking/unblocking user:', error);
      toast.dismiss(loadingToast);
      toast.error('An error occurred. Please try again.');
    }
  }
  
  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in-0 zoom-in-95 duration-200">
      <div className="relative flex items-center justify-center">
        <div className="bg-white dark:bg-black rounded-lg py-5 px-4 max-w-md mx-6 shadow-xl border border-gray-300 dark:border-gray-950">
          {/* Title */}
          <div className='flex flex-row items-center gap-2 mb-3'>
            <BanIcon size={20} />
            <h2 className="text-black dark:text-white text-xl font-bold">Confirm {conv.blockedTo ? 'Unblock' : 'Block'}</h2>
          </div>

          {/* Description */}
          <p className="text-gray-700 text-left dark:text-gray-300 text-xs max-w-sm mb-6">
            {conv.blockedTo
              ? <>Are you sure you want to <b>UnBlock</b> this Chat with <Link href={`/${conv.handle}`}><b>{conv.handle}</b></Link>? You can start chatting again after unblocking.</>
              : <>Are you sure you want to <b>Block</b> this Chat with <Link href={`/${conv.handle}`}><b>{conv.handle}</b></Link> ? All the notifications , chats , media wont be accessable...</>
            }
          </p>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={closeBlockPop}
              className="cursor-pointer flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-950 dark:hover:bg-black text-gray-800 dark:text-gray-200 rounded-md py-2 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {handleChatBlock()}}
              className="cursor-pointer flex-1 bg-red-600 hover:bg-red-700 text-white rounded-md py-2 text-sm font-medium transition-colors"
            >
              {conv.blockedTo ? 'Unblock' : 'Block'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 
