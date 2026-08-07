import React from 'react'
import Link from 'next/link';
import useActiveAccount from '@/app/states/useraccounts';
import Activebeep from './activebeep'
import { Sparkles , Wrench , ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion'

interface underDevProps {
    icon:React.ReactNode ;
    lable:string ;
    progress:number ;
}

export default function Underdevelopment ({ icon , lable , progress }:underDevProps ) {
  const { Account } = useActiveAccount() ; 
  return (
    <>
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden dark:bg-black px-4">
            <motion.div
               initial={{ opacity: 0, y: 24 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6, ease: 'easeOut' }}
               className="relative w-full max-w-lg rounded-3xl bg-white/70 dark:bg-black backdrop-blur-xl shadow-2xl shadow-yellow-100/50 dark:shadow-black/40 p-8 sm:p-10 text-center"
           >
               {/* App badge */}
               <div className="flex items-center justify-center gap-2 mb-6">
                   <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-100 dark:bg-yellow-500/15 p-2 text-xs font-medium text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-500/20">
                       <Activebeep />
                       <span>In Progress</span>
                   </span>
               </div>

               {/* Animated icon */}
               <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center">
                   <motion.div
                       animate={{ y: [0, -6, 0] }}
                       transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                       className="relative flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100 dark:bg-zinc-950/90 text-yellow-600 dark:text-yellow-400"
                   >
                       {icon}
                   </motion.div>
               </div>

               {/* Title */}
               <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                   {lable}
               </h1>
               <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                   We&apos;re building something special for you.
               </p>

               {/* Message */}
               <p className="mt-5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                   This page is under development. Our team is working hard to bring you a
                   great experience with this page soon. Thanks for your patience while we finish up!
               </p>

               {/* Progress indicator */}
                <div className="mt-6">
                   <div className="flex items-center justify-between text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2">
                       <span className="inline-flex items-center gap-1">
                           <Wrench size={13} />
                           Progress
                       </span>
                        <span>{progress}%</span>
                   </div>
                   <div className="h-1 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                       <motion.div
                           initial={{ width: 0 }}
                           animate={{ width: `${progress}%` }}
                           transition={{ duration: 1.2, ease: 'easeOut' }}
                           className="h-full rounded-full bg-yellow-400"
                       />
                   </div>
               </div>

               {/* Back to home */}
               <div className="mt-8 flex items-center justify-between">
                    <Link
                       href={`/${Account.decodedHandle}/feed`}
                       className="group inline-flex items-center justify-center gap-2 rounded-full bg-yellow-200 dark:bg-yellow-500 px-6 py-3 text-sm font-semibold text-zinc-900 shadow-sm shadow-yellow-300/40 hover:shadow-md"
                   >
                       <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
                       Back to Home
                   </Link>
                   <p className="mt-4 inline-flex items-center gap-1 text-xs text-zinc-400 dark:text-zinc-500">
                       <Sparkles size={12} />
                       You&apos;ll be the first to know when it launches.
                   </p>
               </div>
           </motion.div>
       </div>
    </>
  )
}

