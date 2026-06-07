'use client'

import Link from 'next/link'
import Image from 'next/image'
import React ,{ useState , useEffect } from 'react'

export interface infoForChatCard {
  id: string;
  name: string;
  handle: string;
  isVerified: boolean;
  lastMessage: string;
  timestamp: string;
  avatarUrl: string;
  unreadCount: number;
}
interface chatUserCardProp {
    cardInfo?: infoForChatCard ,
    onclick?:() => void ,
    currentOpenChat?:infoForChatCard
}

export default function Chatusercard ({ cardInfo , onclick , currentOpenChat }:chatUserCardProp) {
  const [isTargetChat, setisTargetChat] = useState(false) ;
  if (!cardInfo) return null;

  // useffect for handling the target chat check...
  useEffect(() => {
    setisTargetChat(cardInfo.id === currentOpenChat?.id);
  }, [currentOpenChat, cardInfo.id])

  // for backend operation...
  async function handleClick() {
    onclick?.();
  }
  return (
    <div
     onClick={handleClick}
     className={`shadow-sm hover:shadow-md dark:border-gray-600 w-full rounded-xl py-3 px-2 flex items-center gap-3 bg-white hover:bg-yellow-50 dark:bg-black dark:hover:opacity-70 hover:scale-102 cursor-pointer ${isTargetChat ? 'dark:border-2 bg-yellow-100 dark:bg-zinc-950 shadow-lg' : ''}`}>
      <img
        src={cardInfo.avatarUrl}
        alt={cardInfo.name}
        className='w-13 h-13 rounded-full object-cover'
      />
      <div className='flex-1 min-w-0'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center justify-center gap-1 truncate'>
           <h3 className='font-semibold text-sm text-gray-900 dark:text-gray-100 truncate'>{cardInfo.name}</h3>
           <Link href={`/${cardInfo.handle}`} className='text-xs text-wrap text-gray-500'><span>{cardInfo.handle}</span></Link>
           {cardInfo.isVerified && 
              <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">
                <Image src='/images/yellow-tick.png' width={18} height={18} alt='verified'/>
              </span>
            }
          </div>
          <span className='text-xs text-gray-500 dark:text-gray-400'>
            {cardInfo.timestamp}
          </span>
        </div>
        <div className='flex items-center justify-between'>
          <p className='text-sm text-gray-600 dark:text-gray-300 truncate'>
            {cardInfo.lastMessage}
          </p>
          {cardInfo.unreadCount > 0 && (
            <span className='dark:bg-yellow-500 bg-yellow-400 text-black dark:text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center'>
              {cardInfo.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

