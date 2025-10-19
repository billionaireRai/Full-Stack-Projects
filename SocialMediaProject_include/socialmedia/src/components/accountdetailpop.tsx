'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface UserDetails {
  name: string
  handle: string
  avatar: string
  bio?: string
  joined?: string
  following: number
  followers: number
  cover?: string
}

interface AccountDetailPopProps {
  user: UserDetails
  visible: boolean
  onOpen?: () => void
  onClose?: () => void
  position?: { top: number; left: number }
}

export default function AccountDetailPop({
  user,
  visible,
  onOpen,
  onClose,
  position = { top: 0, left: 0 }
}: AccountDetailPopProps) {
  if (!visible) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.18 }}
      className="fixed z-50 w-1/4 p-3 rounded-2xl border border-gray-200 dark:shadow-gray-700 dark:border-gray-800 bg-white dark:bg-black shadow-md overflow-hidden"
      style={{ top: position.top, left: position.left }}
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
    >
      {/* Header Cover */}
      <div className="relative h-30 w-full rounded-md bg-gray-100 dark:bg-gray-950">
        {user.cover && (
          <Image
            src={user.cover}
            alt={`${user.name} cover`}
            fill
            className="object-cover"
          />
        )}
      </div>

      {/* Avatar + Action */}
      <div className="relative px-4">
        <div className="flex items-start justify-between -mt-8">
          <img
            src={user.avatar}
            alt={`${user.name} avatar`}
            className="rounded-full w-18 h-18 border-4 border-white dark:border-black object-cover"
          />
          <button
            className="rounded-xl border bg-yellow-400 cursor-pointer dark:bg-blue-600 border-gray-300 dark:border-gray-700 py-2 px-5 text-sm font-semibold text-gray-900 dark:text-white hover:opacity-80 transition"
          >
            Follow
          </button>
        </div>

        {/* User Info */}
        <div className="mt-2 flex flex-row gap-2.5 items-center">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base truncate">
            {user.name}
          </h3>
          <span><Image src='/svg/blue-tick.svg' width={20} height={20} alt='blue-tick' /></span>
          <span className='text-gray-700'>.</span>
          <p className="text-gray-500 dark:text-gray-400 text-sm truncate">@{user.handle}</p>
        </div>

        {/* Bio */}
        {user.bio && (
          <p className="mt-2 text-gray-900 dark:text-gray-200 text-sm leading-relaxed">
            {user.bio}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900 dark:text-gray-100">
              {user.following.toLocaleString()}
            </span>
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              <Link href='/username/followings'>Following</Link>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900 dark:text-gray-100">
              {user.followers.toLocaleString()}
            </span>
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              <Link href='/username/followers'>Followers</Link>
            </span>
          </div>
        </div>

        {/* Joined */}
           <p className="text-gray-500 dark:text-gray-400 text-xs mt-3 mb-4">
             Joined{' '}
             {user.joined || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short'})}
           </p>
           <Link href='/username'>
             <button className='cursor-pointer w-full font-semibold m-1 py-2 px-4 rounded-lg hover:opacity-80 bg-yellow-400 dark:bg-blue-600'>View Profile</button>
           </Link>
      </div>
    </motion.div>
  )
}
