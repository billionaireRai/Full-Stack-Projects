'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SettingsIcon , SearchIcon, X } from 'lucide-react';
import useCreatePost from '@/app/states/createpost';
import Newscard from '@/components/newscard';
import Trendcard from '@/components/trendcard';
import PostCard from '@/components/postcard';
import CreatePost from '@/components/createpost';
import Activebeep from '@/components/activebeep';
import Trendcancelpop from '@/components/trendcancelpop';
import FollowOptionCard from '@/components/followoptioncard';

export default function explore() {
  const { isCreatePop } = useCreatePost() ; // create post state...
  const [openSettings, setopenSettings] = useState(false);
  const [LocationSetting, setLocationSetting] = useState(false);
  const [hpninPopUp, sethpninPopUp] = useState(0);
  return (
    <div className='h-fit flex flex-row-reverse md:ml-72 font-poppins rounded-lg dark:bg-black'>
      <div className='mainbox hidden dark:bg-black w-fit h-fit rounded-lg xl:flex flex-col lg:flex-row-reverse gap-8 p-6 max-w-7xl mx-auto font-poppins shadow-lg'>
        <div className='right w-fit lg:w-80 xl:w-96 space-y-2'>
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
                                            <p className='text-xs text-gray-500 dark:text-gray-400'>Political</p>
                                            <p className='text-xs text-gray-500 dark:text-gray-400'>•</p>
                                            <p className='text-xs text-gray-500 dark:text-gray-400'>41K posts</p>
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
                                            <p className='text-xs text-gray-500 dark:text-gray-400'>Tech & future</p>
                                            <p className='text-xs text-gray-500 dark:text-gray-400'>•</p>
                                            <p className='text-xs text-gray-500 dark:text-gray-400'>80K posts</p>
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
                                            <p className='text-xs text-gray-500 dark:text-gray-400'>Global</p>
                                            <p className='text-xs text-gray-500 dark:text-gray-400'>•</p>
                                            <p className='text-xs text-gray-500 dark:text-gray-400'>27K posts</p>
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

                    {/* Who to Follow */}
                    <div className='bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm'>
                        <div className='p-4 border-b border-gray-200 dark:border-slate-700'>
                            <h2 className='text-xl font-bold text-gray-900 dark:text-white'>Who to follow</h2>
                        </div>
                        <div className='p-4 space-y-4'>
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center space-x-3'>
                                    <div className='w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold'>
                                        SG
                                    </div>
                                    <div>
                                        <p className='font-bold text-gray-900 dark:text-white text-sm'>Saket Gokhale</p>
                                        <p className='text-gray-500 dark:text-gray-400 text-sm'>@saketgohale</p>
                                    </div>
                                </div>
                                <button className='cursor-pointer bg-yellow-500 dark:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-bold hover:opacity-80 transition-opacity'>
                                    Follow
                                </button>
                            </div>
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center space-x-3'>
                                    <div className='w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold'>
                                        DL
                                    </div>
                                    <div>
                                        <p className='font-bold text-gray-900 dark:text-white text-sm'>David Laid</p>
                                        <p className='text-gray-500 dark:text-gray-400 text-sm'>@davidlaid</p>
                                    </div>
                                </div>
                                <button className='cursor-pointer bg-yellow-500 dark:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-bold hover:opacity-80 transition-opacity'>
                                    Follow
                                </button>
                            </div>
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center space-x-3'>
                                    <div className='w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold'>
                                        CB
                                    </div>
                                    <div>
                                        <p className='font-bold text-gray-900 dark:text-white text-sm'>Chris Bumsted</p>
                                        <p className='text-gray-500 dark:text-gray-400 text-sm'>@chrisbumstead</p>
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

        </div>

        {/* Main Feed Area - Left Side */}
        <div className='left flex flex-col gap-2 h-fit flex-1 bg-white dark:bg-black rounded-xl font-poppins'>
            {/* Search Box */}
            <div className='p-4 flex flex-row rounded-lg items-center justify-between'>
              <div className='flex flex-row items-center gap-2 flex-1'>
                <span className='cursor-pointer'><SearchIcon className='stroke-gray-400' /></span>
                <input
                 type='text'
                 placeholder='Search'
                 className='flex-1 placeholder:font-medium p-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none dark:focus:border-blue-600 shadow-sm focus:shadow-md transition-all duration-300'
                />
              </div>
              <div className='ml-4'>
                <SettingsIcon onClick={() => { setopenSettings(true) }} className='cursor-pointer' />
              </div>
            </div>
            <div className='p-4 rounded-lg font-semibold text-lg'>
                <span>Todays News</span>
                <ul className='flex flex-col gap-1'>
                    <Newscard bannerImg="https://th.bing.com/th/id/OIP.TNixLzzbJuY8I4QUkDJrcQHaF3?w=236&h=187&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3" time='5 hours ago' newsCategory='Global-collaboration' postsCount='13.5k' profileRelated={[{avatar: []}]} />
                    <Newscard bannerImg="https://th.bing.com/th/id/OIP.TNixLzzbJuY8I4QUkDJrcQHaF3?w=236&h=187&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3" time='5 hours ago' newsCategory='Global-collaboration' postsCount='13.5k' profileRelated={[{avatar: []}]} />
                    <Newscard bannerImg="https://th.bing.com/th/id/OIP.TNixLzzbJuY8I4QUkDJrcQHaF3?w=236&h=187&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3" time='5 hours ago' newsCategory='Global-collaboration' postsCount='13.5k' profileRelated={[{avatar: []}]} />
                </ul>
            </div>
            <div className='p-4 rounded-lg font-semibold text-lg'>
                <span>Trending Nowdays</span>
                <ul className='flex flex-col gap-1'>
                    <Trendcard rank={1} region="India" tag="#Baaghi4Trailer" posts='3.5k' />
                    <Trendcard rank={2} region="India" tag="#CricketWorldCup" posts='12.8k' />
                    <Trendcard rank={3} region="USA" tag="#TarrifExposition" posts='50.1k' />
                    <Trendcard rank={4} region="Europe" tag="#AirbusTransfer" posts='34k' />
                    <Trendcard rank={5} region="India" tag="#10DayMBA" posts='72.5k' />
                </ul>
            </div>
                    <div className='p-4 rounded-lg font-semibold text-lg'>
                        <span>Might Want To Follow</span>
                        <ul className='flex flex-col gap-2'>
                            <FollowOptionCard
                              key="1"
                              avatarInitials="SG"
                              name="Saket Gokhale"
                              username="saketgokhale"
                              bio="Activist and author passionate about democracy and human rights."
                              isFollowing={false}
                              onFollowToggle={(newState) => console.log('Saket follow state:', newState)}
                            />
                            <FollowOptionCard
                              key="2"
                              avatarInitials="DL"
                              name="David Laid"
                              username="davidlaid"
                              bio="Fitness enthusiast and bodybuilder sharing workout tips and motivation."
                              isFollowing={true}
                              onFollowToggle={(newState) => console.log('David follow state:', newState)}
                            />
                            <FollowOptionCard
                              key="3"
                              avatarInitials="CB"
                              name="Chris Bumstead"
                              username="chrisbumstead"
                              bio="Professional bodybuilder and fitness coach inspiring healthy lifestyles."
                              isFollowing={false}
                              onFollowToggle={(newState) => console.log('Chris follow state:', newState)}
                            />
                            <FollowOptionCard
                              key="4"
                              avatarInitials="AL"
                              name="Alex Lee"
                              username="alexlee"
                              bio="Tech entrepreneur and software developer focused on innovative solutions."
                              isFollowing={true}
                              onFollowToggle={(newState) => console.log('Alex follow state:', newState)}
                            />
                        </ul>
                    </div>
                    <div className='p-4'>
                        <PostCard/>
                        <PostCard/>
                        <PostCard/>
                    </div>
        </div>
        { isCreatePop && (
          <CreatePost />
        )}
        { openSettings && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in-0 zoom-in-95 duration-200">
            <div className="w-full max-w-md p-6 bg-white dark:bg-black rounded-lg text-gray-900 dark:text-white font-poppins">
              <div className='flex flex-row mb-6 items-center justify-between'>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Explore settings</h2>
                <button
                  onClick={() => setopenSettings(false)}
                  className="text-gray-900 dark:text-white text-2xl font-bold cursor-pointer"
                  aria-label="Close settings modal"
                >
                  <X width={25} height={25} className='p-1 hover:bg-gray-100 dark:hover:bg-gray-950 rounded-full' />
                </button>
              </div>
              <div className='my-4'>
                <h3 className="font-bold mb-2">Location</h3>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    checked={LocationSetting}
                    onChange={() => { setLocationSetting(!LocationSetting) }}
                    type="checkbox"
                    className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">
                    Show content in this location
                    <p className="text-xs text-gray-400">
                      When this is on, you’ll see what’s happening around you right now.
                    </p>
                  </span>
                </label>
              </div>
            </div>
          </div>
        )

        }
      </div>
  )
}

