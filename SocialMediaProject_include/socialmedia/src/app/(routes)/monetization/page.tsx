'use client'

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  DollarSign,
  BarChart,
  BarChart3,
  CreditCard,
  Target,
  TrendingUp,
  Users,
  ClockPlusIcon,
} from "lucide-react";

export default function MonetizationPage() {
  const router = useRouter() ;

return (
<div className='h-full overflow-y-scroll flex flex-col font-poppins rounded-md dark:bg-black'>
    <div className="h-fit bg-white dark:bg-black text-gray-900 rounded-lg dark:text-white font-poppins">
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
        className="flex flex-col items-center gap-2 text-center pt-10 px-6"
      >
        <div className="text-2xl flex flex-col items-center justify-center md:text-5xl font-bold mb-3">
          <Image className="rounded-full dark:invert" src='/images/letter-B.png' width={80} height={80} alt="logo" /> 
          <span>Make money on briezl</span>
        </div>
        <p className="text-gray-600 dark:text-gray-400 max-w-3/4 text-sm">
          The first step to monetization is getting Verified with <b>Briezl Pro</b>. Once you're verified, you unlock access to our full suite of earning tools, including creator revenue sharing, in-stream ads, subscriber communities, and exclusive sponsorship opportunities. Our verification badge also signals to your audience and to brands that you're a trusted, legitimate creator, which helps you build stronger relationships and attract higher-paying partnerships.
        </p>
        <Link 
          href='/subscription?plan=Pro&term=Monthly&utm_source=monetization-page'
          className="mt-6 group flex items-center gap-2 cursor-pointer bg-yellow-400 hover:bg-yellow-500 dark:bg-yellow-500 dark:hover:bg-yellow-600 text-white px-6 py-3 rounded-lg hover:rounded-full text-sm font-semibold transition-all duration-200">
          <span>Become a <b>Pro</b> account</span>
          <ArrowRight className="group-hover:animate-caret-blink stroke-4" size={18} />
        </Link>
      </motion.div>

      <div className="rounded-lg w-full flex items-center justify-center text-sm text-gray-500 gap-2 mt-10">
        <div className="max-w-xl flex flex-col items-center justify-center gap-3">
          <span><ClockPlusIcon size={30} /></span>
          <p>Most of these monetization features are still under development for now. We're working hard behind the scenes to bring them to life, and we'll keep you updated as soon as they're launched. Stay tuned for updates!</p>
        </div>
      </div>

 {/* Monetization Methods */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto mt-10 px-6">

  {/* Get Paid to Post */}
  <motion.div
    whileHover={{ scale: 1.03 }}
    transition={{ type: "spring", stiffness: 200 }}
    className="rounded-2xl p-5 shadow-md bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800"
  >
    <div className="flex items-center gap-3 mb-4">
      <DollarSign
        className="text-yellow-500 stroke-black dark:stroke-white rounded-full"
        size={26}
      />
      <h2 className="text-2xl font-semibold">Get paid from posts</h2>
    </div>

    <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">
      Earn money from the performance of your content. The more people
      discover and engage with your posts, the more your eligible content
      can earn.
    </p>

    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        delay: 0.3,
        type: "spring",
        stiffness: 100,
      }}
      className="rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-black p-5 shadow-lg"
    >
      <div className="flex items-center justify-between">
        <p className="font-semibold text-lg">🎉 You got paid!</p>

        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400">
          +$40.00
        </span>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="text-3xl font-bold">$40.00</p>
          <p className="text-gray-500 text-xs mt-1">
            Creator earnings
          </p>
        </div>

        <div className="text-right">
          <p className="font-semibold">40K</p>
          <p className="text-gray-500 text-xs">new views</p>
        </div>
      </div>

      <div className="mt-4 h-2 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "78%" }}
          transition={{ duration: 1.2, delay: 0.7 }}
          className="h-full rounded-full bg-yellow-400"
        />
      </div>
    </motion.div>
  </motion.div>


  {/* Ads Revenue */}
  <motion.div
    whileHover={{ scale: 1.03 }}
    transition={{ type: "spring", stiffness: 200 }}
    className="rounded-2xl p-5 shadow-md bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800"
  >
    <div className="flex items-center gap-3 mb-4">
      <BarChart3
        className="text-green-500 stroke-black dark:stroke-white"
        size={26}
      />

      <h2 className="text-2xl font-semibold">Ads revenue</h2>
    </div>

    <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">
      Earn a share of advertising revenue generated around eligible
      content and audience activity on Briezl.
    </p>

    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        delay: 0.4,
        type: "spring",
        stiffness: 100,
      }}
      className="rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-black p-5 shadow-lg"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="font-semibold">Ad performance</p>
          <p className="text-xs text-gray-500">Last 30 days</p>
        </div>

        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400">
          ↑ 18.4%
        </span>
      </div>

      <div className="flex items-end gap-6">
        <div>
          <p className="text-3xl font-bold">$126.84</p>
          <p className="text-xs text-gray-500 mt-1">
            Estimated earnings
          </p>
        </div>

        <div>
          <p className="font-semibold">184K</p>
          <p className="text-xs text-gray-500 mt-1">
            Monetized impressions
          </p>
        </div>
      </div>

      <div className="flex items-end gap-1 h-12 mt-5">
        {[35, 48, 42, 65, 55, 72, 61, 84, 76, 92, 81, 100].map(
          (height, index) => (
            <motion.div
              key={index}
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.05 }}
              className="flex-1 rounded-t bg-green-500/70"
            />
          )
        )}
      </div>
    </motion.div>
  </motion.div>


  {/* Subscriptions */}
  <motion.div
    whileHover={{ scale: 1.03 }}
    transition={{ type: "spring", stiffness: 200 }}
    className="rounded-2xl p-5 shadow-md bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800"
  >
    <div className="flex items-center gap-3 mb-4">
      <CreditCard
        className="text-purple-500 stroke-black dark:stroke-white"
        size={26}
      />

      <h2 className="text-2xl font-semibold">Subscriptions</h2>
    </div>

    <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">
      Build a recurring income stream by offering exclusive content,
      communities, perks and experiences to your subscribers.
    </p>

    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        delay: 0.5,
        type: "spring",
        stiffness: 100,
      }}
      className="rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-black p-5 shadow-lg"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-semibold">Creator subscription</p>
          <p className="text-xs text-gray-500 mt-1">
            Premium community
          </p>
        </div>

        <span className="text-purple-500 font-bold">$9.99/mo</span>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-5">
        <div className="rounded-lg bg-gray-100 dark:bg-black p-3">
          <p className="text-xl font-bold">1,284</p>
          <p className="text-xs text-gray-500">Active subscribers</p>
        </div>

        <div className="rounded-lg bg-gray-100 dark:bg-black p-3">
          <p className="text-xl font-bold">$12.8K</p>
          <p className="text-xs text-gray-500">Monthly revenue</p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-green-500">
        <TrendingUp size={14} />
        <span>+86 subscribers this month</span>
      </div>
    </motion.div>

  </motion.div>


  {/* Sponsorships */}
  <motion.div
    whileHover={{ scale: 1.03 }}
    transition={{ type: "spring", stiffness: 200 }}
    className="rounded-2xl p-5 shadow-md bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800"
  >
    <div className="flex items-center gap-3 mb-4">
      <Target
        className="text-red-500 stroke-black dark:stroke-white"
        size={26}
      />

      <h2 className="text-2xl font-semibold">Sponsorships</h2>
    </div>

    <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">
      Connect with brands and turn your audience, expertise and content
      into paid sponsorship opportunities.
    </p>

    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        delay: 0.6,
        type: "spring",
        stiffness: 100,
      }}
      className="rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-black p-5 shadow-lg"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">New brand opportunity</p>
          <p className="font-semibold mt-1">TechNova</p>
        </div>

        <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-500 dark:bg-red-950">
          New
        </span>
      </div>

      <div className="mt-4 rounded-lg bg-gray-100 dark:bg-black p-4">
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Campaign</span>
          <span className="text-sm font-semibold">1 sponsored post</span>
        </div>

        <div className="flex justify-between mt-2">
          <span className="text-sm text-gray-500">Offer</span>
          <span className="text-lg font-bold">$750</span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-4 flex gap-2"
      >
        <button className="flex-1 rounded-lg bg-red-500 text-white text-xs font-semibold py-2">
          Review offer
        </button>

        <button className="px-4 rounded-lg border border-gray-300 dark:border-gray-700 text-xs">
          Later
        </button>
      </motion.div>
    </motion.div>

  </motion.div>


  {/* Affiliate Marketing */}
  <motion.div
    whileHover={{ scale: 1.03 }}
    transition={{ type: "spring", stiffness: 200 }}
    className="rounded-2xl p-5 shadow-md bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800"
  >
    <div className="flex items-center gap-3 mb-4">
      <TrendingUp
        className="text-orange-500 stroke-black dark:stroke-white"
        size={26}
      />

      <h2 className="text-2xl font-semibold">Affiliate marketing</h2>
    </div>

    <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">
      Recommend products and services you genuinely use and earn a
      commission when your audience makes qualifying purchases.
    </p>

    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        delay: 0.7,
        type: "spring",
        stiffness: 100,
      }}
      className="rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-black p-5 shadow-lg"
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold">Affiliate performance</p>
          <p className="text-xs text-gray-500">This month</p>
        </div>

        <TrendingUp className="text-orange-500" size={20} />
      </div>

      <div className="grid grid-cols-3 gap-2 mt-5 text-center">
        <div>
          <p className="font-bold text-lg">8.4K</p>
          <p className="text-[11px] text-gray-500">Clicks</p>
        </div>

        <div>
          <p className="font-bold text-lg">342</p>
          <p className="text-[11px] text-gray-500">Conversions</p>
        </div>

        <div>
          <p className="font-bold text-lg text-orange-500">$684</p>
          <p className="text-[11px] text-gray-500">Commission</p>
        </div>
      </div>

      <div className="mt-5 h-2 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "68%" }}
          transition={{ duration: 1, delay: 1 }}
          className="h-full rounded-full bg-orange-500"
        />
      </div>
    </motion.div>
  </motion.div>


  {/* Merchandise */}
  <motion.div
    whileHover={{ scale: 1.03 }}
    transition={{ type: "spring", stiffness: 200 }}
    className="rounded-2xl p-5 shadow-md bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800"
  >
    <div className="flex items-center gap-3 mb-4">
      <Users
        className="text-indigo-500 stroke-black dark:stroke-white"
        size={26}
      />

      <h2 className="text-2xl font-semibold">Merchandise</h2>
    </div>

    <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">
      Turn your personal brand into products your community can buy,
      from clothing and accessories to creator-exclusive collections.
    </p>

    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        delay: 0.8,
        type: "spring",
        stiffness: 100,
      }}
      className="rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-black p-5 shadow-lg"
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold">Store overview</p>
          <p className="text-xs text-gray-500">Last 7 days</p>
        </div>

        <span className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-500 dark:bg-indigo-950">
          Live
        </span>
      </div>

      <div className="mt-5 flex justify-between">
        <div>
          <p className="text-2xl font-bold">126</p>
          <p className="text-xs text-gray-500">Orders</p>
        </div>

        <div>
          <p className="text-2xl font-bold">$3,240</p>
          <p className="text-xs text-gray-500">Sales</p>
        </div>

        <div>
          <p className="text-2xl font-bold text-green-500">+24%</p>
          <p className="text-xs text-gray-500">Growth</p>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2">
        <div className="flex -space-x-2">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="w-7 h-7 rounded-full border-2 border-white dark:border-black bg-gray-300 dark:bg-gray-700"
            />
          ))}
        </div>

        <p className="text-xs text-gray-500">
          126 customers purchased this week
        </p>
      </div>
    </motion.div>
  </motion.div>
 </div>

      {/* Premium Tools Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto mt-20 px-6 mb-16">
        {/* Premium Tools */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="rounded-2xl p-5 shadow-md bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800"
        >
          <div className="flex items-center gap-3 mb-4">
            <BarChart className="text-green-500 stroke-black dark:stroke-white rounded-full" size={26} />
            <h2 className="text-2xl font-semibold">
              Make better content with Premium tools
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 leading-relaxed">
            Unlock longer posts, AI enhancements, Analytics, get priority in suggestions & support with many other features .
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

      </div>


      {/* Footer */}
      <footer className="border-t rounded-lg flex flex-row items-center gap-2 justify-evenly border-gray-200 dark:border-gray-800 py-6 text-center text-gray-500 dark:text-gray-400 text-sm">
        <div className="flex flex-row items-center gap-2 justify-center">
           <Image src='/images/letter-B.png' className="rounded-full dark:invert" width={30} height={30} alt="logo" /><span>© {new Date().getFullYear()} Monetization — Earn from your posts <b className="px-3">|</b> Content creation starts here </span>
        </div>
        <Link 
          href='/subscription?plan=Pro&term=Monthly&utm_source=monetization-page'
          className="mt-6 group flex items-center gap-2 cursor-pointer bg-yellow-400 hover:bg-yellow-500 dark:bg-yellow-500 dark:hover:bg-yellow-600 text-white px-6 py-3 rounded-lg hover:rounded-full text-sm font-semibold transition-all duration-200">
          <span>Become a Pro account</span>
          <ArrowRight className="group-hover:animate-caret-blink stroke-4" size={18} />
        </Link>
      </footer>
    </div>
   </div>
  );
}
