'use client'

import React, { useState } from 'react';
import Trendcancelpop from '@/components/trendcancelpop';
import Link from 'next/link';
import Image from 'next/image';
import { Flame, TrendingUp, Gamepad2, Briefcase, MoreHorizontalIcon, MoreHorizontal } from 'lucide-react';

// definging the type for user information...
interface userInfoType {
  name:string ,
  username:string ,
  bio:string ,
  location:string,
  website:string,
  joinDate:string,
  following:number,
  followers:number,
  Posts:string,
  isVerified:boolean,
  coverImage:string,
  avatar:string
}

interface PostType {
    id: string,
    content: string,
    timestamp: string,
    comments: number,
    reposts: number,
    likes: number
    img?:string[],
    video?:string[],
}

interface tabsTypes {
  id:string,
  label:string
}

export default function UserProfilePage() {
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [hpninPopUp, sethpninPopUp] = useState<number>(0);
  
  // Mock user data
  const user = {
    name: "John Doe",
    username: "johndoe",
    bio: "Digital creator • Photography enthusiast • Coffee lover • Building amazing things one line of code at a time",
    location: "San Francisco, CA",
    website: "johndoe-portfolio.com",
    joinDate: "Joined March 2012",
    following: 542,
    followers: 18700,
    Posts: "3,245",
    isVerified: false,
    coverImage: "data:image/webp;base64,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",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
  };

  const [UserInfo, setUserInfo] = useState<userInfoType>(user) ;
  const tabs = [
    { id: 'posts', label: 'Posts' },
    { id: 'replies', label: 'Posts & Replies' },
    { id: 'media', label: 'Media' },
    { id: 'likes', label: 'Likes' }
  ];
  const [activeTab, setActiveTab] = useState<tabsTypes>({id:'posts',label:'Posts'}); // current active tab state...

  // Mock tweets data
  const posts = [
    {
      id: "1",
      content: "Just launched my new portfolio website! Built with Next.js and Tailwind CSS. The developer experience is amazing! 🚀",
      timestamp: "2h ago",
      comments: 12,
      reposts: 45,
      likes: 128
    },
    {
      id: "2",
      content: "Beautiful sunset from the Golden Gate Bridge today. Sometimes you just have to stop and appreciate the moment. 📸",
      timestamp: "1d ago",
      comments: 8,
      reposts: 23,
      likes: 156
    },
    {
      id: "3",
      content: "Working on a new open source project. Can't wait to share it with the community! #coding #opensource",
      timestamp: "3d ago",
      comments: 34,
      reposts: 67,
      likes: 289
    }
  ];

  const [Posts, setPosts] = useState<PostType[]>(posts) ; // rendering some random posts...

  return (
    <div className='h-fit flex flex-col md:ml-72 font-poppins rounded-md p-2 dark:bg-black'>
        <div className='flex gap-2'>
          {/* Main Content - Profile */}
          <div className='flex-2 overflow-y-auto'>
            <div className="bg-white dark:bg-black text-gray-900 dark:text-white">
              {/* Header */}
              <header className="sticky top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
                <div className="px-4 py-3">
                  <div className="flex items-center">
                    <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-950 cursor-pointer rounded-full transition-colors">
                     <Image src='/images/up-arrow.png' width={30} height={30} alt='back-arrow' className='-rotate-90 dark:invert' />
                    </button>
                    <div className="ml-4">
                      <h1 className="text-xl font-bold">{UserInfo.name}</h1>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{Posts.length} Tweets</p>
                    </div>
                  </div>
                </div>
              </header>

              {/* Cover Photo */}
              <div className="relative h-48 rounded-lg bg-gradient-to-r from-blue-400 to-purple-500">
                <img 
                  src={UserInfo.coverImage} 
                  alt="Cover" 
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>

              {/* Profile Info */}
              <div className="relative px-4">
                {/* Avatar */}
                <div className="absolute -top-16 left-4">
                  <div className="relative">
                    <img 
                      src={UserInfo.avatar} 
                      alt={UserInfo.name}
                      className="w-32 h-32 rounded-full border-4 border-white dark:border-black bg-white dark:bg-black"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end pt-4 pb-3">
                  <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-950 cursor-pointer rounded-full transition-colors mr-2">
                    <MoreHorizontalIcon size={20} />
                  </button>
                  <button 
                    onClick={() => setIsFollowing(!isFollowing)}
                    className={`px-4 py-2 rounded-full font-bold text-sm cursor-pointer transition-colors ${
                      isFollowing 
                        ? 'bg-transparent border border-gray-300 dark:border-gray-700 text-black dark:text-white hover:bg-yellow-100 dark:hover:bg-gray-950 hover:text-yellow-400 dark:hover:text-blue-700' 
                        : 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200'
                    }`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                </div>

                {/* User Details */}
                <div className="space-y-3 pb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h1 className="text-xl font-bold">{UserInfo.name}</h1>
                      {UserInfo.isVerified ? (
                       <Image src='/svg/blue-tick.svg' width={25} height={25} alt='blue-tick' />
                      ) : (
                        <Link href='/subscription?utm_source=profile-page' className='border border-white hover:bg-gray-100 dark:hover:bg-gray-950 dark:border-gray-700 cursor-pointer flex flex-row items-center justify-center gap-1 px-3 py-1 rounded-full'>
                          <span>Get Verified</span><Image src='/svg/blue-tick.svg' width={18} height={18} alt='blue-tick' />
                        </Link>
                      )}
                    </div>
                    <p className="text-gray-500 text-sm dark:text-gray-400">@{UserInfo.username}</p>
                  </div>

                  <p className="text-sm">{UserInfo.bio}</p>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{UserInfo.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      <Link href={`https://www.${UserInfo.website}?utm_source=briezly-profile-page`} className="text-blue-500 hover:underline">{UserInfo.website}</Link>
                    </div>
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{UserInfo.joinDate}</span>
                    </div>
                  </div>

                  <div className="flex space-x-4 text-sm">
                    <Link href={`/@${UserInfo.username}/following`} className="hover:underline">
                      <span className="font-bold text-black dark:text-white">{UserInfo.following}</span>
                      <span className="text-gray-500 dark:text-gray-400"> Following</span>
                    </Link>
                    <Link href={`/@${UserInfo.username}/followers`} className="hover:underline">
                      <span className="font-bold text-black dark:text-white">{UserInfo.followers}</span>
                      <span className="text-gray-500 dark:text-gray-400"> Followers</span>
                    </Link>
                  </div>
                </div>

                {/* Navigation Tabs */}
                <div className="border-b border-gray-200 dark:border-gray-800">
                  <nav className="flex space-x-5">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab)}
                        className={`py-4 px-1 border-b-2 font-medium text-sm cursor-pointer transition-colors ${
                          activeTab.id === tab.id
                            ? 'dark:border-blue-500 dark:text-blue-500 text-yellow-600'
                            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Posts Feed */}
              <div className='p-2'>
                {Posts.map((post) => (
                  <div key={post.id} className="border-b border-gray-200 dark:border-gray-800 rounded-lg px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-950 shadow-xl hover:dark:shadow-gray-200 cursor-pointer transition-colors">
                    <div className="flex space-x-3">
                      <img
                        src={UserInfo.avatar}
                        alt={UserInfo.name}
                        className="w-12 h-12 rounded-full cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-sm">{UserInfo.name}</span>
                          {UserInfo.isVerified && (
                            <Image src='/svg/blue-tick.svg' width={20} height={20} alt='blue-tick' />
                          )}
                          <span className="text-gray-500 dark:text-gray-400 text-sm">@{UserInfo.username}</span>
                          <span className="text-gray-500 dark:text-gray-400 text-sm">·</span>
                          <span className="text-gray-500 dark:text-gray-400 text-sm">{post.timestamp}</span>
                        </div>
                        <p className="text-sm mt-1 mb-2">{post.content}</p>
                        <div className="flex justify-between max-w-md text-gray-500 dark:text-gray-400">
                          <button className="flex items-center space-x-1 group hover:text-blue-500 transition-colors">
                            <div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-950 transition-colors">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                            </div>
                            <span className="text-xs">{post.comments}</span>
                          </button>
                          <button className="flex items-center space-x-1 group hover:text-green-500 transition-colors">
                            <div className="p-2 rounded-full group-hover:bg-green-50 dark:group-hover:bg-green-950 transition-colors">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                            </div>
                            <span className="text-xs">{post.reposts}</span>
                          </button>
                          <button className="flex items-center space-x-1 group hover:text-red-500 transition-colors">
                            <div className="p-2 rounded-full group-hover:bg-red-50 dark:group-hover:bg-red-950 transition-colors">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                            </div>
                            <span className="text-xs">{post.likes}</span>
                          </button>
                          <button className="flex items-center space-x-1 group hover:text-blue-500 transition-colors">
                            <div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-950 transition-colors">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                              </svg>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* some other widgets... */}
          <div className='hidden lg:block flex-1 overflow-y-auto'>
            <div className='space-y-4'>
              {/* What's happening */}
              <div className='bg-gray-50 dark:bg-black rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm'>
                <div className='p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center'>
                  <h2 className='text-xl font-bold text-gray-900 dark:text-white'>What's happening</h2>
                  <svg className='h-5 w-5 text-gray-500 dark:text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />
                  </svg>
                </div>
                <div className='p-3'>
                  <Link href={`/explore?q=${encodeURIComponent('#TechInnovation')}&utm_source=trend-click`} className='happening-dropdown hover:bg-gray-100 dark:hover:bg-gray-800 p-3 rounded-lg cursor-pointer transition-colors inline-block w-full'>
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
                  <Link href={`/explore?q=${encodeURIComponent('#ClimateAction')}&utm_source=trend-click`} className='happening-dropdown hover:bg-gray-100 dark:hover:bg-gray-800 p-3 rounded-lg cursor-pointer transition-colors inline-block w-full'>
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
                  <Link href={`/explore?q=${encodeURIComponent('#Gaming')}&utm_source=trend-click`} className='happening-dropdown hover:bg-gray-100 dark:hover:bg-gray-800 p-3 rounded-lg cursor-pointer transition-colors inline-block w-full'>
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
                  <Link href={`/explore?q=${encodeURIComponent('#Business')}&utm_source=trend-click`} className='happening-dropdown hover:bg-gray-100 dark:hover:bg-gray-800 p-3 rounded-lg cursor-pointer transition-colors inline-block w-full'>
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
                <div className='p-4 border-t border-gray-200 dark:border-gray-700'>
                  <Link  href={`/explore?q=${encodeURIComponent('trend-nowdays')}&utm_source=show-more`} className='cursor-pointer text-blue-500 hover:text-blue-600 text-sm font-medium'>
                  Show more
                  </Link>
                </div>
              </div>

              {/* Who to Follow */}
              <div className='bg-gray-50 dark:bg-black rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm'>
                <div className='p-4 border-b border-gray-200 dark:border-gray-700'>
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
                    <button className='cursor-pointer bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-full text-sm font-bold hover:opacity-80 transition-opacity'>
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
                    <button className='cursor-pointer bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-full text-sm font-bold hover:opacity-80 transition-opacity'>
                      Follow
                    </button>
                  </div>
                </div>
                <div className='p-4 border-t border-gray-200 dark:border-gray-700'>
                  <button className='cursor-pointer text-blue-500 hover:text-blue-600 text-sm font-medium'>
                    Show more
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}