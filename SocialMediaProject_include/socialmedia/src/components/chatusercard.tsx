'use client'

import React ,{ useState , useEffect } from 'react'
import { infoForChatCard } from '@/app/(routes)/[username]/messages/page'

interface chatUserCardProp {
    cardInfo?: infoForChatCard ,
    onclick?:() => void ,
    currentOpenChat?:string
}

export default function Chatusercard ({ cardInfo , onclick , currentOpenChat }:chatUserCardProp) {
  const [isTargetChat, setisTargetChat] = useState(false) ;
  if (!cardInfo) return null;

  // useffect for handling the target chat check...
  useEffect(() => {
    setisTargetChat(cardInfo.id === currentOpenChat);
  }, [currentOpenChat, cardInfo.id])
  

  return (
    <div
     onClick={onclick}
     className={`shadow-sm hover:shadow-md dark:border-gray-600 w-full h-16 rounded-md p-2 flex items-center gap-3 bg-white hover:bg-gray-50 dark:bg-gray-950 dark:hover:shadow-gray-900 cursor-pointer transition-colors ${isTargetChat ? 'dark:border-2 bg-yellow-100 dark:bg-blue-200 shadow-lg' : ''}`}>
      <img
        src={cardInfo.avatarUrl}
        alt={cardInfo.name}
        className='w-10 h-10 rounded-full object-cover'
      />
      <div className='flex-1 min-w-0'>
        <div className='flex items-center justify-between'>
          <h3 className='font-semibold text-sm text-gray-900 dark:text-gray-100 truncate'>
            {cardInfo.name}
          </h3>
          <span className='text-xs text-gray-500 dark:text-gray-400'>
            {cardInfo.timestamp}
          </span>
        </div>
        <div className='flex items-center justify-between'>
          <p className='text-sm text-gray-600 dark:text-gray-300 truncate'>
            {cardInfo.lastMessage}
          </p>
          {cardInfo.unreadCount > 0 && (
            <span className='dark:bg-blue-500 bg-yellow-400 text-black dark:text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center'>
              {cardInfo.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

