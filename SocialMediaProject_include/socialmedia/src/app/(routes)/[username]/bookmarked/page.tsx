'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import PostCard from '@/components/postcard'
import { Flame, TrendingUp, Gamepad2, Briefcase, MoreHorizontal,Bookmark} from 'lucide-react'
import Trendcancelpop from '@/components/trendcancelpop'


interface PostType {
    id: string,
    content: string,
    postedAt: string,
    comments: number,
    reposts: number,
    likes: number,
    views: number,
    bookmarks: number,
    mediaUrls?:string[],
    hashTags?:string[],
    mentions?:string[]
}


export default function Bookmarkedpage(){
  const [hpninPopUp, sethpninPopUp] = useState<number>(0);
  const router = useRouter() ; // intializing the useRouter hook....

  // function converting date to readable format...
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };
  const [PostDetails, setPostDetails] = useState<PostType[]>([
    {
      id: '1',
      content: 'Excited to share my latest project! #coding #webdev',
      postedAt: '2023-10-01T10:00:00Z',
      comments: 5,
      reposts: 2,
      likes: 15,
      views: 120,
      bookmarks: 3,
      mediaUrls: ['https://picsum.photos/seed/1/400/300'],
      hashTags: ['coding', 'webdev'],
      mentions: ['user1']
    },
    {
      id: '2',
      content: 'Beautiful sunset today! Nature is amazing.',
      postedAt: '2023-10-02T18:30:00Z',
      comments: 8,
      reposts: 5,
      likes: 25,
      views: 200,
      bookmarks: 7,
      mediaUrls: ['https://picsum.photos/seed/2/400/300'],
      hashTags: ['nature', 'sunset'],
      mentions: []
    },
    {
      id: '3',
      content: 'Just finished reading an amazing book. Highly recommend!',
      postedAt: '2023-10-03T14:20:00Z',
      comments: 12,
      reposts: 3,
      likes: 30,
      views: 180,
      bookmarks: 5,
      mediaUrls: [],
      hashTags: ['books', 'reading'],
      mentions: ['author']
    },
    {
      id: '4',
      content: 'New recipe alert! Homemade pizza night. 🍕',
      postedAt: '2023-10-04T20:15:00Z',
      comments: 6,
      reposts: 1,
      likes: 20,
      views: 150,
      bookmarks: 4,
      mediaUrls: ['https://picsum.photos/seed/4/400/300'],
      hashTags: ['food', 'recipe'],
      mentions: []
    },
    {
      id: '5',
      content: 'Working on some exciting updates for the app. Stay tuned!',
      postedAt: '2023-10-05T09:45:00Z',
      comments: 9,
      reposts: 4,
      likes: 18,
      views: 140,
      bookmarks: 6,
      mediaUrls: [],
      hashTags: ['app', 'updates'],
      mentions: ['team']
    },
    {
      id: '6',
      content: 'Weekend vibes! Time to relax and recharge.',
      postedAt: '2023-10-06T16:00:00Z',
      comments: 4,
      reposts: 2,
      likes: 22,
      views: 160,
      bookmarks: 2,
      mediaUrls: ['https://picsum.photos/seed/6/400/300'],
      hashTags: ['weekend', 'relax'],
      mentions: []
    },
    {
      id: '7',
      content: 'Tech conference was incredible! Learned so much.',
      postedAt: '2023-10-07T12:30:00Z',
      comments: 15,
      reposts: 7,
      likes: 35,
      views: 250,
      bookmarks: 8,
      mediaUrls: [],
      hashTags: ['tech', 'conference'],
      mentions: ['speaker1', 'speaker2']
    },
    {
      id: '8',
      content: 'Morning coffee and coding session. Perfect start to the day!',
      postedAt: '2023-10-08T08:00:00Z',
      comments: 3,
      reposts: 1,
      likes: 12,
      views: 90,
      bookmarks: 3,
      mediaUrls: ['https://picsum.photos/seed/8/400/300'],
      hashTags: ['coffee', 'coding'],
      mentions: []
    },
    {
      id: '9',
      content: 'Exploring new hiking trails this weekend. Adventure awaits!',
      postedAt: '2023-10-09T11:45:00Z',
      comments: 7,
      reposts: 3,
      likes: 28,
      views: 190,
      bookmarks: 5,
      mediaUrls: ['https://picsum.photos/seed/9/400/300'],
      hashTags: ['hiking', 'adventure'],
      mentions: ['friend']
    },
    {
      id: '10',
      content: 'Just launched my new website! Check it out and let me know what you think.',
      postedAt: '2023-10-10T15:20:00Z',
      comments: 11,
      reposts: 6,
      likes: 40,
      views: 300,
      bookmarks: 9,
      mediaUrls: ['https://picsum.photos/seed/10/400/300'],
      hashTags: ['website', 'launch'],
      mentions: ['colleague']
    }
  ])

  return (
    <div className='h-fit flex flex-row gap-4 md:ml-72 font-poppins rounded-lg p-4 dark:bg-black'>
      <div className='rightContainer flex flex-col flex-1 rounded-lg'>
           <header className="sticky w-full top-0 z-10 backdrop-blur-md border-b rounded-lg mb-4 border-gray-300 dark:border-gray-800 bg-white/90 dark:bg-black/90 shadow-lg">
             <div className="px-3 py-3">
               <div className="flex items-center relative gap-2">
                 <button
                   onClick={() => { router.back() }}
                   className="p-2 hover:bg-gray-100 dark:hover:bg-gray-950 cursor-pointer rounded-full transition-all duration-200 hover:scale-105">
                   <Image src='/images/up-arrow.png' width={30} height={30} alt='back-arrow' className='-rotate-90 dark:invert' />
                 </button>
                 <div className="ml-4">
                    <h1 className="text-xl font-bold">Bookmarked Posts<span className='text-yellow-400 p-3 dark:text-blue-500'>{PostDetails.length}</span></h1>
                  <Link href={`/@${'amritnash_coder'}`} className="text-sm p-2 rounded-lg w-fit hover:bg-gray-100 transition-all duration-300 dark:hover:bg-gray-950 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">{'@amritansh_coder'}</Link>
                 </div>
                  <div className='absolute right-0 mx-3 flex items-center gap-2'>
                      <p className="text-sm text-black dark:text-gray-400">Posts you've saved for later reference</p>
                      <Bookmark width={20} height={20} className='fill-black stroke-black dark:fill-white dark:stroke-white'/>
                  </div>
                </div>
              </div>
            </header>
            <div className='postSection flex flex-col flex-1 rounded-lg'>
              {PostDetails.map((post,index) => (
                <PostCard
                  key={index}
                  postId={post.id}
                  content={post.content}
                  timestamp={formatDate(post.postedAt)}
                  likes={post.likes}
                  retweets={post.reposts}
                  replies={post.comments}
                  views={post.views}
                  bookmarked={post.bookmarks}
                  media={post.mediaUrls}
                  hashTags={post.hashTags}
                  mentions={post.mentions}
                />
              ))}
            </div>
      </div>
      <div className='leftContainer hidden lg:block w-96'>
        <div className='space-y-6'>
              {/* What's happening */}
              <div className='bg-gray-50 dark:bg-black rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300'>
                <div className='p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center'>
                  <h2 className='text-xl font-bold text-gray-900 dark:text-white'>What's happening</h2>
                  <svg className='h-5 w-5 text-gray-500 dark:text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />
                  </svg>
                </div>
                <div className='p-3 space-y-2'>
                  <Link href={`/explore?q=${encodeURIComponent('#TechInnovation')}&utm_source=trend-click`} className='happening-dropdown hover:bg-gray-100 dark:hover:bg-gray-950 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.02] inline-block w-full'>
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
                        <MoreHorizontal className='w-4 h-4 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 transition-colors' />
                        { hpninPopUp === 1 && (
                          <Trendcancelpop setNumber={() => { sethpninPopUp(0) }} />
                        )}
                      </div>
                    </div>
                  </Link>
                  <Link href={`/explore?q=${encodeURIComponent('#ClimateAction')}&utm_source=trend-click`} className='happening-dropdown hover:bg-gray-100 dark:hover:bg-gray-950 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.02] inline-block w-full'>
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
                        <MoreHorizontal className='w-4 h-4 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 transition-colors' />
                        { hpninPopUp === 2 && (
                          <Trendcancelpop setNumber={() => { sethpninPopUp(0) }} />
                        )}
                      </div>
                    </div>
                  </Link>
                  <Link href={`/explore?q=${encodeURIComponent('#Gaming')}&utm_source=trend-click`} className='happening-dropdown hover:bg-gray-100 dark:hover:bg-gray-950 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.02] inline-block w-full'>
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
                        <MoreHorizontal className='w-4 h-4 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 transition-colors' />
                        { hpninPopUp === 3 && (
                          <Trendcancelpop setNumber={() => { sethpninPopUp(0) }} />
                        )}
                      </div>
                    </div>
                  </Link>
                  <Link href={`/explore?q=${encodeURIComponent('#Business')}&utm_source=trend-click`} className='happening-dropdown hover:bg-gray-100 dark:hover:bg-gray-950 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.02] inline-block w-full'>
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
                        <MoreHorizontal className='w-4 h-4 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 transition-colors' />
                        { hpninPopUp === 4 && (
                          <Trendcancelpop setNumber={() => { sethpninPopUp(0) }} />
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
                <div className='p-3 border-t border-gray-200 dark:border-gray-700'>
                  <Link href={`/explore?q=${encodeURIComponent('trend-nowdays')}&utm_source=show-more`} className='cursor-pointer text-blue-500 hover:text-blue-600 text-sm font-medium transition-colors'>
                    Show more
                  </Link>
                </div>
              </div>

              {/* Who to Follow */}
              <div className='bg-gray-50 dark:bg-black rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300'>
                <div className='p-4 border-b border-gray-200 dark:border-gray-700'>
                  <h2 className='text-xl font-bold text-gray-900 dark:text-white'>Who to follow</h2>
                </div>
                <div className='p-4 space-y-6'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-4'>
                      <div className='w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold hover:scale-105 transition-transform'>
                        JD
                      </div>
                      <div>
                        <p className='font-bold text-gray-900 dark:text-white text-sm'>John Doe</p>
                        <p className='text-gray-500 dark:text-gray-400 text-sm'>@johndoe</p>
                      </div>
                    </div>
                    <button className='cursor-pointer bg-black dark:bg-white text-white dark:text-black px-5 py-2 rounded-full text-sm font-bold hover:opacity-80 hover:scale-105 transition-all duration-200'>
                      Follow
                    </button>
                  </div>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-4'>
                      <div className='w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold hover:scale-105 transition-transform'>
                        JS
                      </div>
                      <div>
                        <p className='font-bold text-gray-900 dark:text-white text-sm'>Jane Smith</p>
                        <p className='text-gray-500 dark:text-gray-400 text-sm'>@janesmith</p>
                      </div>
                    </div>
                    <button className='cursor-pointer bg-black dark:bg-white text-white dark:text-black px-5 py-2 rounded-full text-sm font-bold hover:opacity-80 hover:scale-105 transition-all duration-200'>
                      Follow
                    </button>
                  </div>
                </div>
                <div className='p-3 border-t border-gray-200 dark:border-gray-700'>
                  <button className='cursor-pointer text-blue-500 hover:text-blue-600 text-sm font-medium transition-colors'>
                    Show more
                  </button>
                </div>
              </div>
        </div>
      </div>
    </div>
  )
}

