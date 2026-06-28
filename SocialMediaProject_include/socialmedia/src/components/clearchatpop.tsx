'use client'

import React from 'react'
import Link from 'next/link';
import toast from 'react-hot-toast';
import { EraserIcon } from 'lucide-react';
import { infoForChatCard } from './chataccountcard'
import useActiveChatMessages from '@/app/states/activechatmessage';
import axiosInstance from '@/lib/interceptor';

interface clearChatPopType {
    chat:infoForChatCard ;
    close:() => void ;
}

export default function Clearchatpop ({ chat , close }: clearChatPopType) {
  const { clearMessages } = useActiveChatMessages() ;

  const handleClearChatHistory = async () => {
    // const loadingtoast = toast.loading(`Clearing chat with ${chat?.handle}...`);
    // try {
    //    const clearchatapi = await axiosInstance.delete(`/api/chat/attachments?conversationid=${chat.id}`); 
    //   if (clearchatapi.status === 200) {
    //     toast.dismiss(loadingtoast);
        clearMessages(); // clearing messages from global state...
        toast.success(`Chat history with ${chat.handle} cleared successfully !!`);
        close();
    //   }
    // } catch (error) {
    //     console.log("An erroo occured in clearing chat !!");
    //     toast.error("An error occured in clearing chat !!");
    // }
  }
 return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in-0 zoom-in-95 duration-200">
      <div className="relative flex items-center justify-center">
        <div className="bg-white dark:bg-black rounded-lg py-5 px-4 max-w-md mx-6 shadow-xl border border-gray-300 dark:border-gray-950">
          {/* Title */}
          <div className='flex flex-row items-center gap-2 mb-3'>
            <EraserIcon size={20} />
            <h2 className="text-black dark:text-white text-xl font-bold">Confirm Clearing chat</h2>
          </div>

          {/* Description */}
          <p className="text-gray-700 text-left dark:text-gray-300 text-xs max-w-sm mb-6">
              Are you sure you want to <b>Clear</b> this Chat with <Link href={`/${chat.handle}`}><b>{chat.handle}</b></Link>? You wont get your chats back once cleared , <b>this action can't be undone</b>...
          </p>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={close}
              className="cursor-pointer flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-950 dark:hover:bg-black text-gray-800 dark:text-gray-200 rounded-md py-2 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {handleClearChatHistory()}}
              className="cursor-pointer flex-1 bg-red-600 hover:bg-red-700 text-white rounded-md py-2 text-sm font-medium transition-colors"
            >
              Clear chat
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}