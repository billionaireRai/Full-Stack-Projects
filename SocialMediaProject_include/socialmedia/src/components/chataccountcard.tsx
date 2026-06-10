'use client'

import Link from 'next/link'
import Image from 'next/image'
import React ,{ useState , useEffect , useRef } from 'react'
import axiosInstance from '@/lib/interceptor';
import toast from 'react-hot-toast';
import { Pin } from 'lucide-react';

export interface infoForChatCard {
  id: string;
  name: string;
  handle: string;
  isVerified: boolean;
  lastMessage: string;
  timestamp: string;
  avatarUrl: string; 
  pinned:boolean;
  blocked:boolean;
  unreadCount: number;
}
interface chatAccCardProp {
    cardInfo: infoForChatCard
    countUpdate:() => void
    openChat:(value:boolean) => void
    currentChat:(card:infoForChatCard) => void
    currentOpenChat?:infoForChatCard
}

export default function ChatAccountcard({ cardInfo , currentChat , countUpdate ,openChat ,currentOpenChat }:chatAccCardProp) {
  const chatCardRef = useRef<HTMLDivElement | null>(null);
  const [isTargetChat, setisTargetChat] = useState(false) ;
  if (!cardInfo) return null ;

  // useffect for handling the target chat check...
  useEffect(() => {
    setisTargetChat(cardInfo.id === currentOpenChat?.id);
  }, [currentOpenChat, cardInfo?.id])

  // for backend operation...
  async function handleClick() {
    // try {
      // const chatclickapi = await axiosInstance.put('/api/account/conversations',{ cardInfo });
      // if (chatclickapi.status === 200) {
        openChat(true)
        currentChat(cardInfo)
        chatCardRef.current?.scrollIntoView({ behavior:'smooth',block:'center' });
        countUpdate()
      // }
    // } catch (error) {
    //   console.log("An error occured !!");
    //   toast.error("Error in clicking chat card !!");
    // }
  }
  return (
   <div className='rounded-xl'>
     <div className='rounded-full w-fit absolute'>
      {cardInfo.pinned && ( <Pin className='w-5 h-5 rotate-45 text-yellow-500'/> )}
     </div>
    <div
     ref={chatCardRef}
     onClick={handleClick}
     className={`shadow-sm hover:shadow-md dark:border-gray-600 max-w-sm rounded-xl py-3 px-2 flex items-center gap-3 bg-white hover:bg-yellow-50 dark:bg-black dark:hover:opacity-70 hover:scale-102 cursor-pointer ${isTargetChat ? 'dark:border-1 bg-yellow-100 dark:bg-zinc-950 shadow-lg' : ''}`}>
      <img
        src={cardInfo.avatarUrl}
        alt={cardInfo.name}
        className='w-13 h-13 rounded-full object-cover'
      />
      <div className='flex-1 min-w-0'>
        <div className='flex items-center gap-2 justify-between w-full truncate'>
          <div className='flex items-center justify-center gap-1'>
           <h3 className='font-semibold text-sm text-gray-900 dark:text-gray-100'>{cardInfo.name}</h3>
           <span className='text-xs text-wrap text-gray-500 truncate'>{cardInfo.handle}</span>
           {cardInfo.isVerified && 
              <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">
                <Image src='/images/yellow-tick.png' width={18} height={18} alt='verified'/>
              </span>
            }
          </div>
          <span className='text-xs text-gray-500 dark:text-gray-400 truncate'>
            {cardInfo.timestamp}
          </span>
        </div>
        <div className='flex items-center justify-between'>
          <p className='text-sm max-w-[280px] text-gray-600 dark:text-gray-300 truncate'>
            {cardInfo.lastMessage}
          </p>
          {cardInfo.unreadCount > 0 && (
            <span className='dark:bg-yellow-500 bg-yellow-400 text-black dark:text-white text-xs rounded-full w-5 h-5 text-center'>
              {cardInfo.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
   </div>
  )
}

