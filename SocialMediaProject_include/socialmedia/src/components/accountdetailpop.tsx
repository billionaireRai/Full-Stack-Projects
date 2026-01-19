'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import axiosInstance from '@/lib/interceptor'
import { AxiosResponse } from 'axios'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import Spinner from './spinner'

interface UserDetails {
  name: string
  handle: string
  avatar: string
  bio?: string
  joined?: string
  following: string
  followers: string
  cover?: string
}

interface AccountDetailPopProps {
  user: UserDetails
  visible: boolean
  onOpen?: () => void
  onClose?: () => void
  position?: { top: number; left: number }
  isFollowing:boolean
}

export default function AccountDetailPop({ user,visible,onOpen,onClose,position = { top: 0, left: 0 } , isFollowing }: AccountDetailPopProps) {
  const [Loading, setLoading] = useState<boolean>(false);
  const [IsFollowing, setIsFollowing] = useState(isFollowing);
  
  // function handling toggle follow logic...
  async function handleFollowToggleLogic() {
    setLoading(true); // from the starting...
      const newFollowing = !IsFollowing; // determine the new state...
      try {
        const apires: AxiosResponse = await axiosInstance.get(`/api/user/follow?accounthandle=${user.handle}&follow=${newFollowing}`); // api response instance...
          if (apires.status === 200) {
            setIsFollowing(newFollowing); // update state immediately on success...
            toast.success(`${newFollowing ? 'Added to your following...' : 'Removed from following !!'}`);
          } else {
            toast.error('Failed with action...');
          }
      } catch (error) {
        toast.error('Failed with action...');
      } finally {
        setLoading(false);
      }
    }
    
  if (!visible) return null ;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.18 }}
      className="fixed z-50 w-[23%] p-1 rounded-2xl border border-gray-200 dark:shadow-gray-700 dark:border-gray-800 bg-white dark:bg-black shadow-md overflow-hidden"
      style={{ top: position.top, left: position.left }}
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
    >
      {/* Header Cover */}
      <div className="relative h-30 w-full rounded-md bg-gray-100 dark:bg-gray-950">
        {user.cover && (
          <img
            src={user.cover}
            alt={`${user.name} cover`}
            className="object-cover rounded-lg"
          />
        )}
      </div>

      {/* Avatar + Action */}
      <div className="relative px-4">
        <div className="flex items-start justify-between -mt-8">
          <img
            src={user.avatar}
            alt={`${user.name} avatar`}
            className="rounded-full w-18 h-18 border-2 border-white dark:border-black object-cover"
          />
          <button
            onClick={(e) => { e.stopPropagation(); handleFollowToggleLogic(); }}
            className={`text-sm font-semibold px-4 py-2
               ${IsFollowing
               ? 'bg-white border border-gray-300 dark:border-gray-600 dark:bg-gray-950 dark:text-blue-500 hover:bg-yellow-100        dark:hover:bg-gray-950 hover:text-yellow-400 dark:hover:text-blue-700 cursor-pointer'
               : 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 cursor-pointer'
               } rounded-full`}
          >
            { Loading ? <Spinner/> : (IsFollowing ? 'following' : 'follow') }
          </button>
        </div>

        {/* User Info */}
        <div className="mt-2 flex flex-row gap-2.5 items-center">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base truncate">
            {user.name}
          </h3>
          <span><Image src='/images/yellow-tick.png' width={20} height={20} alt='blue-tick' /></span>
          <span className='text-gray-700'>.</span>
          <p className="text-gray-500 dark:text-gray-400 text-sm truncate">@{user.handle}</p>
        </div>

        {/* Bio */}
        {user.bio && (
          <p className="mt-2 text-gray-900 dark:text-gray-500 text-xs leading-relaxed">
            {user.bio}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 mt-3">
          <Link href={`/@${user.handle}/followings`} className="flex items-center group gap-2">
            <span className="font-bold text-gray-900 dark:text-gray-100">
              {user.following.toLocaleString()}
            </span>
            <span className="text-gray-500 group-hover:underline dark:text-gray-400 text-sm">
              Following
            </span>
          </Link>
          <Link href={`/@${user.handle}/followers`} className="flex items-center group gap-2">
            <span className="font-bold text-gray-900 dark:text-gray-100">
              {user.followers.toLocaleString()}
            </span>
            <span className="text-gray-500 group-hover:underline dark:text-gray-400 text-sm">
              Followers
            </span>
          </Link>
        </div>

        {/* Joined */}
           <p className="text-gray-500 dark:text-gray-400 text-xs mt-3 mb-4">
             Joined{' '}
             {user.joined || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short'})}
           </p>
           <Link href={`/@${user.handle}`}>
             <button className='cursor-pointer w-full font-semibold mb-2 py-2 px-4 rounded-lg hover:opacity-80 bg-yellow-400'>View Profile</button>
           </Link>
      </div>
    </motion.div>
  )
}
