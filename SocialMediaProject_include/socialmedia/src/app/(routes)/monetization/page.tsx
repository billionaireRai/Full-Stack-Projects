'use client'

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  DollarSign,
  Users,
  BarChart,
  Zap,
} from "lucide-react";

export default function MonetizationPage() {
  const router = useRouter() ;
  return (
  <div className='h-fit flex flex-col md:ml-72 font-poppins rounded-md p-2 dark:bg-black'>
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 rounded-lg dark:text-white font-poppins transition-colors duration-500">
      <header className="w-full z-10 backdrop-blur-md border-b rounded-lg mb-5 border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-black/80">
        <div className="px-4 py-3">
          <div className="flex items-center gap-0">
             <button 
              onClick={() => { router.back() }}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-950 cursor-pointer rounded-full transition-colors">
              <Image src='/images/up-arrow.png' width={30} height={30} alt='back-arrow' className='-rotate-90 dark:invert' />
             </button>
          </div>
        </div>
      </header>
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="flex flex-col items-center gap-2 text-center pt-16 px-6"
      >
        <h1 className="text-4xl flex flex-row gap-3 md:text-5xl font-bold mb-3">
          <span>Make money on</span><Image className="rounded-full" src='/images/letter-B.png' width={50} height={30} alt="logo" /> 
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-lg">
          The first step to monetization is getting Verified with X Premium.
        </p>
        <Link 
          href='/subscription?utm_source=monetization-page'
          className="mt-6 group flex items-center gap-2 cursor-pointer bg-yellow-400 hover:bg-yellow-500 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-6 py-3 rounded-lg hover:rounded-full text-sm font-semibold transition-all duration-200">
          <span>Become a Premium Creator</span>
          <ArrowRight className="group-hover:animate-caret-blink stroke-4" size={18} />
        </Link>
      </motion.div>

      {/* Feature Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto mt-20 px-6">
        {/* Get Paid to Post */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="rounded-2xl p-5 shadow-md bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 transition-all duration-500"
        >
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="text-blue-500 stroke-black dark:stroke-white rounded-full" size={26} />
            <h2 className="text-2xl font-semibold">Get paid to post</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">
            Earn from sharing high-quality content. The more you engage users on
            Briezl, the more you earn.
          </p>
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3, type: "spring", stiffness: 100 }}
            className="rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-black p-5 text-center shadow-lg transition-shadow duration-300"
          >
            <p className="font-semibold text-lg">🎉 You got paid!</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              $816.54 has been deposited into your account.
            </p>
          </motion.div>
          <Link
            href={`/monetization/details?q=Creator-revenue-sharing-eligibility`}
            className="mt-5 inline-block text-yellow-500 dark:text-blue-500 cursor-pointer hover:bg-white dark:hover:bg-black p-2 rounded-lg text-sm"
          >
            Creator revenue sharing eligibility
          </Link>
        </motion.div>

        {/* Build a Fanbase */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="rounded-2xl p-5 shadow-md bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 transition-all duration-500"
        >
          <div className="flex items-center gap-3 mb-4">
            <Users className="text-purple-500 stroke-black dark:stroke-white rounded-full" size={26} />
            <h2 className="text-2xl font-semibold">Build a fanbase</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 leading-relaxed">
            Offer exclusive content to your biggest supporters and earn
            recurring income.
          </p>
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5, type: "spring", stiffness: 200 }}
            className="rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-black p-5 text-center shadow-lg transition-shadow duration-300"
          >
            <p className="font-semibold text-lg">👥 Subscribers</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              Exclusive content access granted.
            </p>
          </motion.div>
          <Link
            href={`/monetization/details?q=Subscriptions-eligibility`}
            className="mt-5 inline-block text-yellow-500 dark:text-blue-500 cursor-pointer hover:bg-white dark:hover:bg-black p-2 rounded-lg text-sm"
          >
            Subscriptions eligibility
          </Link>
        </motion.div>
      </div>

      {/* Premium Tools Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto mt-20 px-6 mb-16">
        {/* Premium Tools */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="rounded-2xl p-5 shadow-md bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 transition-all duration-500"
        >
          <div className="flex items-center gap-3 mb-4">
            <BarChart className="text-green-500 stroke-black dark:stroke-white rounded-full" size={26} />
            <h2 className="text-2xl font-semibold">
              Make better content with Premium tools
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 leading-relaxed">
            Unlock longer posts, Media Studio, Analytics, and get priority
            support.
          </p>
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.7, type: "spring", stiffness: 100 }}
            className="rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-black p-5 text-center shadow-lg transition-shadow duration-300"
          >
            <p className="font-semibold text-lg">📊 Analytics Snapshot</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              Track audience demographics and post performance.
            </p>
          </motion.div>
        </motion.div>

        {/* More Reach = More Earnings */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="rounded-2xl p-5 shadow-md bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 transition-all duration-500"
        >
          <div className="flex items-center gap-3 mb-4">
            <Zap className="text-yellow-500 stroke-black dark:stroke-white rounded-full" size={26} />
            <h2 className="text-2xl font-semibold">
              More reach = more earnings
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 leading-relaxed">
            Benefit from a Reply Boost, giving you the extra visibility to grow
            faster.
          </p>
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.9, type: "spring", stiffness: 100 }}
            className="rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-black p-5 text-center shadow-lg transition-shadow duration-300"
          >
            <p className="font-semibold text-lg">🚀 Your reply is boosted!</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              Get seen by more users and grow your influence.
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t rounded-lg flex flex-row items-center gap-2 justify-evenly border-gray-200 dark:border-gray-800 py-6 text-center text-gray-500 dark:text-gray-400 text-sm">
        <div className="flex flex-row items-center gap-2 justify-center">
           <Image src='/images/letter-B.png' className="rounded-full" width={30} height={30} alt="logo" /><span>© {new Date().getFullYear()} Monetization — Earn from your posts <b className="px-3">|</b> Content creation starts here </span>
        </div>
        <Link 
          href='/subscription?utm_source=monetization-page'
          className="mt-6 group flex items-center gap-2 cursor-pointer bg-yellow-400 hover:bg-yellow-500 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-6 py-3 rounded-lg hover:rounded-full text-sm font-semibold transition-all duration-200">
          <span>Become a Premium Creator</span>
          <ArrowRight className="group-hover:animate-caret-blink stroke-4" size={18} />
        </Link>
      </footer>
    </div>
   </div>
  );
}
