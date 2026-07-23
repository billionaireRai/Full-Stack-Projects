import React from 'react'
import Loader from './loader'
import { motion } from 'framer-motion'

function MessageCardSkeleton({ isOdd }: { isOdd: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-start gap-3 w-full rounded-lg ${isOdd ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar skeleton */}
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
      </div>

      {/* Message bubble skeleton */}
      <div className={`flex flex-col max-w-xs sm:max-w-md lg:max-w-lg ${isOdd ? 'items-end' : 'items-start'}`}>
        {/* Name skeleton */}
        {!isOdd && (
          <div className="flex gap-1 items-center mb-1">
            <div className="h-3 w-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            <div className="h-3 w-12 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          </div>
        )}

        {/* Bubble */}
        <div
          className={`px-4 py-3 rounded-2xl ${
            isOdd
              ? 'bg-yellow-200/60 dark:bg-yellow-500/30 rounded-br-none'
              : 'bg-gray-200/60 dark:bg-gray-800/60 rounded-bl-none'
          }`}
        >
          <div className="flex flex-col gap-2">
            <div className={`h-3 rounded animate-pulse ${isOdd ? 'bg-yellow-300/50 dark:bg-yellow-400/30' : 'bg-gray-300 dark:bg-gray-700'}`} style={{ width: `${Math.random() * 60 + 80}px` }} />
            <div className={`h-3 rounded animate-pulse ${isOdd ? 'bg-yellow-300/50 dark:bg-yellow-400/30' : 'bg-gray-300 dark:bg-gray-700'}`} style={{ width: `${Math.random() * 40 + 50}px` }} />
          </div>
        </div>

        {/* Timestamp skeleton */}
        <div className="mt-1">
          <div className="h-2 w-14 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        </div>
      </div>
    </motion.div>
  )
}

export default function Messagesloader({ msgnums }: { msgnums: number }) {
  return (
    <>
      <div
        className='rounded-xl flex flex-col items-center justify-center bg-white/80 dark:bg-black/40 px-1'
        aria-live='polite'
      >
        <div className='flex items-center justify-center'>
          <Loader />
        </div>
        <div className='flex flex-col gap-1 w-full'>
          {Array.from({ length: msgnums }).map((_, i) => (
            <div key={i}>
              <MessageCardSkeleton isOdd={(i % 2 !== 0) ? true : false} />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

