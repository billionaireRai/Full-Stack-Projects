'use client'

import React , { useState , useEffect } from 'react';
import Interestpage from '@/components/interestselection';
import PostCard from '@/components/postcard';
import Activebeep from '@/components/activebeep';
import CreatePost from '@/components/createpost';
import Trendcancelpop from '@/components/trendcancelpop';
import useCreatePost from '@/app/states/createpost';
import Interest from '@/components/interestpop';
import Link from 'next/link';
import Image from 'next/image';
import { Flame, TrendingUp, Gamepad2, Briefcase , MoreHorizontalIcon} from 'lucide-react';

export default function feed() {
    const { isCreatePop } = useCreatePost() ;
    const [hpninPopUp, sethpninPopUp] = useState<number>() ;
    // const [showInterest, setshowInterest] = useState(false) ;
    // const [Start, setStart] = useState(false)
    // useEffect(() => {
    //   let timer = setTimeout(() => {
    //     setshowInterest(true)
    //    }, 2000)
    //   return () => {
    //     clearTimeout(timer) ;
    //   }

    // }, [])

     useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (hpninPopUp && !(event.target as Element).closest('.happening-dropdown')) {
            sethpninPopUp(0)
          }
        }
    
        if (hpninPopUp) {
          document.addEventListener('mousedown', handleClickOutside)
        }
    
        return () => {
          document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [hpninPopUp])

    return (
        <div className='h-full flex flex-col md:ml-72 font-poppins'>
            {/* interest popup modal... */}
            {/* {showInterest && (
                <div className='fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in-0 zoom-in-95 duration-200'>
                    <Interest getStarted={() => { setshowInterest(false) ; setStart(true) }} onClose={() => setshowInterest(false)} />
                </div>
            )} */}
            {/* main selection popup... */}
            {/* {Start && (
                <div className='fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in-0 zoom-in-95 duration-200'>
                    <Interestpage />
                </div>
            )} */}
            <div className='mainbox dark:bg-black w-full h-fit rounded-lg flex flex-col lg:flex-row-reverse gap-8 p-6 max-w-7xl mx-auto font-poppins shadow-lg'>
                {/* Right Sidebar */}
                <div className='right w-full lg:w-80 xl:w-96 hidden xl:block  space-y-2'>
                    {/* Search Box */}
                    <div className='bg-white w-full dark:bg-black rounded-xl dark:border-slate-700 p-4'>
                        <div className='relative'>
                            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                <svg className='h-5 w-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                                </svg>
                            </div>
                            <input
                                type='text'
                                placeholder='Search'
                                className='w-full placeholder:font-medium pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/70 dark:focus:ring-blue-600/50 focus:border-yellow-400 dark:focus:border-blue-600 shadow-sm focus:shadow-md transition-all duration-300'
                            />
                        </div>
                    </div>
                    {/* card to subscribe... */}
                    <div className='bg-white dark:bg-black rounded-xl flex flex-col gap-2 border p-4 border-gray-200 dark:border-slate-700 shadow-sm'>
                        <span className='text-xl font-semibold'>Subscribe to Premium</span>
                        <p className='text-sm'>
                            Subscribe to unlock new features and if eligible , recieve a share of revenue...
                        </p>
                        <Link href='/subscription?utm_source=feed-page'><button className='cursor-pointer w-fit py-2 px-4 font-semibold dark:bg-blue-700 bg-yellow-400 rounded-lg'>Subscribe</button></Link>
                    </div>
                    {/* Today's News */}
                    {/* On hover of each redirect => '/explore?q=endcodeurlcomponent(newstitle)&utm_source=news-click*/}
                    <div className='bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm'>
                        <div className='p-4 border-b border-gray-200 dark:border-slate-700 flex justify-between'>
                            <h2 className='text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3'><span>Today's News</span><Activebeep /></h2>
                            <Image className='dark:invert' src='/images/newspaper-folded.png' height={25} width={25} alt='newspaper' />
                        </div>
                        <div className='p-3'>
                            <Link href={`/explore?q=${encodeURIComponent('Major-Tech-Companies-Report-Q4-Earnings')}&utm_source=news-click`} className='hover:bg-yellow-50 dark:hover:bg-gray-950 p-3 rounded-lg cursor-pointer transition-colors block'>
                                <div className='flex items-start space-x-3'>
                                    <div className='w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xs'>
                                        CNN
                                    </div>
                                    <div className='flex-1'>
                                        <p className='text-sm text-gray-500 dark:text-gray-400'>Breaking News</p>
                                        <p className='font-bold text-gray-900 dark:text-white'>Major Tech Companies Report Q4 Earnings</p>
                                        <div className='flex items-center space-x-4 mt-1'>
                                            <p className='text-xs text-gray-500 dark:text-gray-400'>2h ago</p>
                                            <p className='text-xs text-gray-500 dark:text-gray-400'>•</p>
                                            <p className='text-xs text-gray-500 dark:text-gray-400'>1.2M views</p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                            <Link href={`/explore?q=${encodeURIComponent('AI-Revolution-Continues-to-Transform-Industries')}&utm_source=news-click`} className='hover:bg-yellow-50 dark:hover:bg-gray-950 p-3 rounded-lg cursor-pointer transition-colors block'>
                                <div className='flex items-start space-x-3'>
                                    <div className='w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs'>
                                        TC
                                    </div>
                                    <div className='flex-1'>
                                        <p className='text-sm text-gray-500 dark:text-gray-400'>Technology</p>
                                        <p className='font-bold text-gray-900 dark:text-white'>AI Revolution Continues to Transform Industries</p>
                                        <div className='flex items-center space-x-4 mt-1'>
                                            <p className='text-xs text-gray-500 dark:text-gray-400'>4h ago</p>
                                            <p className='text-xs text-gray-500 dark:text-gray-400'>•</p>
                                            <p className='text-xs text-gray-500 dark:text-gray-400'>856K views</p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                            <Link href={`/explore?q=${encodeURIComponent('Global-Climate-Summit-Reaches-Historic-Agreement')}&utm_source=news-click`} className='hover:bg-yellow-50 dark:hover:bg-gray-950 p-3 rounded-lg cursor-pointer transition-colors block'>
                                <div className='flex items-start space-x-3'>
                                    <div className='w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-xs'>
                                        BBC
                                    </div>
                                    <div className='flex-1'>
                                        <p className='text-sm text-gray-500 dark:text-gray-400'>World News</p>
                                        <p className='font-bold text-gray-900 dark:text-white'>Global Climate Summit Reaches Historic Agreement</p>
                                        <div className='flex items-center space-x-4 mt-1'>
                                            <p className='text-xs text-gray-500 dark:text-gray-400'>6h ago</p>
                                            <p className='text-xs text-gray-500 dark:text-gray-400'>•</p>
                                            <p className='text-xs text-gray-500 dark:text-gray-400'>2.1M views</p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <div className='p-4 border-t border-gray-200 dark:border-slate-700'>
                            <Link  href={`/explore?q=${encodeURIComponent('todays-news')}&utm_source=show-more`} className='cursor-pointer text-blue-500 hover:text-blue-600 text-sm font-medium'>
                                Show more
                            </Link>
                        </div>
                    </div>
                    {/* What's happening */}
                    {/* On hover of each redirect => '/explore?q=endcodeurlcomponent(thetrendwithHastag)&utm_source=trend-click*/}
                    <div className='bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm'>
                        <div className='p-4 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center'>
                            <h2 className='text-xl font-bold text-gray-900 dark:text-white'>What's happening</h2>
                            <svg className='h-5 w-5 text-gray-500 dark:text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />
                            </svg>
                        </div>
                        <div className='p-3'>
                            <Link href={`/explore?q=${encodeURIComponent('#TechInnovation')}&utm_source=trend-click`} className='happening-dropdown hover:bg-yellow-50 dark:hover:bg-gray-950 p-3 rounded-lg cursor-pointer transition-colors inline-block w-full'>
                                <div className='flex items-start space-x-3'>
                                    <div className='w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center'>
                                        <Flame className="w-4 h-4 text-white" />
                                    </div>
                                    <div className='flex-1 min-w-0'>
                                        <p className='text-sm text-gray-500 dark:text-gray-400'>Trending</p>
                                        <p className='font-bold text-gray-900 dark:text-white'>#TechInnovation</p>
                                        <p className='text-xs text-gray-500 dark:text-gray-400'>42.1K posts</p>
                                    </div>
                                    <div onClick={(e) => { e.stopPropagation(); sethpninPopUp(1) }} className="relative">
                                        <MoreHorizontalIcon className='w-4 h-4 cursor-pointer' />
                                        { hpninPopUp === 1 && (
                                            <Trendcancelpop setNumber={() =>  {sethpninPopUp(0) }}/>
                                        )}
                                    </div>
                                </div>
                            </Link>
                            <Link href={`/explore?q=${encodeURIComponent('#ClimateAction')}&utm_source=trend-click`} className='happening-dropdown hover:bg-yellow-50 dark:hover:bg-gray-950 p-3 rounded-lg cursor-pointer transition-colors inline-block w-full'>
                                <div className='flex items-start space-x-3'>
                                    <div className='w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center'>
                                        <TrendingUp className="w-4 h-4 text-white" />
                                    </div>
                                    <div className='flex-1 min-w-0'>
                                        <p className='text-sm text-gray-500 dark:text-gray-400'>Trending</p>
                                        <p className='font-bold text-gray-900 dark:text-white'>#ClimateAction</p>
                                        <p className='text-xs text-gray-500 dark:text-gray-400'>28.7K posts</p>
                                    </div>
                                    <div onClick={(e) => { e.stopPropagation(); sethpninPopUp(2) }} className='relative'>
                                        <MoreHorizontalIcon className='w-4 h-4 cursor-pointer' />
                                        { hpninPopUp === 2 && (
                                            <Trendcancelpop setNumber={() =>  {sethpninPopUp(0) }}/>
                                        )}
                                    </div>
                                </div>
                            </Link>
                            <Link href={`/explore?q=${encodeURIComponent('#Gaming')}&utm_source=trend-click`} className='happening-dropdown hover:bg-yellow-50 dark:hover:bg-gray-950 p-3 rounded-lg cursor-pointer transition-colors inline-block w-full'>
                                <div className='flex items-start space-x-3'>
                                    <div className='w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center'>
                                        <Gamepad2 className="w-4 h-4 text-white" />
                                    </div>
                                    <div className='flex-1 min-w-0'>
                                        <p className='text-sm text-gray-500 dark:text-gray-400'>Trending</p>
                                        <p className='font-bold text-gray-900 dark:text-white'>#Gaming</p>
                                        <p className='text-xs text-gray-500 dark:text-gray-400'>156K posts</p>
                                    </div>
                                    <div onClick={(e) => { e.stopPropagation(); sethpninPopUp(3) }} className='relative'>
                                        <MoreHorizontalIcon className='w-4 h-4 cursor-pointer' />
                                        { hpninPopUp === 3 && (
                                            <Trendcancelpop setNumber={() =>  {sethpninPopUp(0) }}/>
                                        )}
                                    </div>
                                </div>
                            </Link>
                            <Link href={`/explore?q=${encodeURIComponent('#Business')}&utm_source=trend-click`} className='happening-dropdown hover:bg-yellow-50 dark:hover:bg-gray-950 p-3 rounded-lg cursor-pointer transition-colors inline-block w-full'>
                                <div className='flex items-start space-x-3'>
                                    <div className='w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center'>
                                        <Briefcase className="w-4 h-4 text-white" />
                                    </div>
                                    <div className='flex-1 min-w-0'>
                                        <p className='text-sm text-gray-500 dark:text-gray-400'>Trending</p>
                                        <p className='font-bold text-gray-900 dark:text-white'>#Business</p>
                                        <p className='text-xs text-gray-500 dark:text-gray-400'>89.3K posts</p>
                                    </div>
                                    <div onClick={(e) => { e.stopPropagation(); sethpninPopUp(4) }} className='relative'> 
                                        <MoreHorizontalIcon className='w-4 h-4 cursor-pointer' />
                                        { hpninPopUp === 4 && (
                                            <Trendcancelpop setNumber={() =>  {sethpninPopUp(0) }}/>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <div className='p-4 border-t border-gray-200 dark:border-slate-700'>
                            <Link  href={`/explore?q=${encodeURIComponent('trend-nowdays')}&utm_source=show-more`} className='cursor-pointer text-blue-500 hover:text-blue-600 text-sm font-medium'>
                            Show more
                            </Link>
                        </div>
                    </div>

                    {/* Who to Follow */}
                    <div className='bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm'>
                        <div className='p-4 border-b border-gray-200 dark:border-slate-700'>
                            <h2 className='text-xl font-bold text-gray-900 dark:text-white'>Who to follow</h2>
                        </div>
                        <div className='p-4 space-y-4'>
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center space-x-3'>
                                    <div className='w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold'>
                                        JD
                                    </div>
                                    <div>
                                        <p className='font-bold text-gray-900 dark:text-white text-sm'>John Doe</p>
                                        <p className='text-gray-500 dark:text-gray-400 text-sm'>@johndoe</p>
                                    </div>
                                </div>
                                <button className='cursor-pointer bg-yellow-500 dark:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-bold hover:opacity-80 transition-opacity'>
                                    Follow
                                </button>
                            </div>
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center space-x-3'>
                                    <div className='w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold'>
                                        JS
                                    </div>
                                    <div>
                                        <p className='font-bold text-gray-900 dark:text-white text-sm'>Jane Smith</p>
                                        <p className='text-gray-500 dark:text-gray-400 text-sm'>@janesmith</p>
                                    </div>
                                </div>
                                <button className='cursor-pointer bg-yellow-500 dark:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-bold hover:opacity-80 transition-opacity'>
                                    Follow
                                </button>
                            </div>
                        </div>
                        <div className='p-4 border-t border-gray-200 dark:border-slate-700'>
                            <button className='cursor-pointer text-blue-500 hover:text-blue-600 text-sm font-medium'>
                                Show more
                            </button>
                        </div>
                    </div>
                </div>
                {/* Main Feed Area - Left Side */}
                <div className='left flex-1 h-fit bg-white dark:bg-black rounded-xl'>
                    <div className=''>
                        <PostCard />
                        <PostCard />
                    </div>
                </div>
             { isCreatePop && (
                <CreatePost />
              )}
            </div>
        </div>

    )
}
