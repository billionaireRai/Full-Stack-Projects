'use client'

import React, { useState , useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import { FilterIcon, Target, Heart, Clock, Archive, Users, Check, Flame, TrendingUp, Gamepad2, Briefcase, MoreHorizontal as MoreHorizontalIcon, User } from 'lucide-react'
import PostCard from '@/components/postcard'
import Usercard from '@/components/usercard'
import Trendcancelpop from '@/components/trendcancelpop'
import PostMetricsPage from '@/components/postmetrics'


interface postInfoType {
  postId:string;
  avatar?: string;
  username?: string;
  handle?: string;
  timestamp?: string;
  content?: string;
  media?: string[];
  likes?: number;
  retweets?: number;
  replies?: number;
  shares?: number;
  views?: number;
  bookmarked?: number;
  hashTags?: string[];
  mentions?: string[];
  showActions?:boolean;
  highlighted?:boolean
}

interface userInfoType {
  name:string ,
  username:string ,
  bio:string ,
  location:string,
  website:string,
  joinDate:string,
  following:string,
  followers:string,
  Posts:string,
  isVerified:boolean,
  coverImage:string,
  avatar:string
}

interface navOptionsType {
  label:string;
  value:string;
}

export default function paticularPost() {
  const router = useRouter() ; // initializing useRouter hook...
  const [decodedHandle, setdecodedHandle] = useState<string | null>(null) ;
  const [openFilter, setopenFilter] = useState<boolean>(false) ;
  const [currentFilter, setcurrentFilter] = useState<string>('Relevency');
  const [PostInfo, setPostInfo] = useState<postInfoType | null>(null);
  const [hpninPopUp, sethpninPopUp] = useState<number>(0);
  const [activeNav, setactiveNav] = useState<navOptionsType>({ label:'all',value:'All'}) ; // state for handling active navs...
  const [NavOptions, setNavOptions] = useState<navOptionsType[]>([
    { label:'all',value:'All'},
    { label: 'bookmark', value: 'Bookmark' },
    { label: 'metric', value: 'Metric' },
    { label: 'comments', value: 'Comments' },
    { label: 'views', value: 'Views' },
    { label: 'likes', value: 'Likes' }
  ])
  // Array of bookmark users
  const [bookmarkUsers,setbookmarkUsers] = useState<userInfoType[]>([
    {
      name: 'John Doe',
      username: 'johndoe',
      bio: 'Software Engineer passionate about coding.',
      location: 'New York',
      website: 'https://johndoe.com',
      joinDate: 'January 2020',
      following: '150',
      followers: '200',
      Posts: '50',
      isVerified: true,
      coverImage: '/images/signup-banner.png',
      avatar: '/images/myProfile.jpg'
    },
    {
      name: 'Jane Smith',
      username: 'janesmith',
      bio: 'Designer and artist.',
      location: 'California',
      website: 'https://janesmith.com',
      joinDate: 'March 2019',
      following: '120',
      followers: '180',
      Posts: '40',
      isVerified: false,
      coverImage: '/images/signup-banner.png',
      avatar: '/images/myProfile.jpg'
    }
  ]);
  
  const { username , postId } = useParams() ; // accesing URL parameters...
  // useeffect running on first page load...
  useEffect(() => {
    if (username) {
      const readbleHandle = decodeURIComponent(String(username)) ;
      setdecodedHandle(readbleHandle);
    }
    // logic of getting post information...

  }, [])

  // function for handling filter state...
  const handleChangeFilterState = (category:string) : void => { 
    if (category !== currentFilter) setcurrentFilter(category) ;
   } 
  
  return (
    <div className='h-fit flex flex-col-reverse md:flex-row gap-1 md:ml-72 font-poppins rounded-md p-2 dark:bg-black'>
      <div className='mainSection h-full rounded-md'>
        <div>
          {/* Header */}
          <header className="w-full z-10 backdrop-blur-md border-b rounded-lg mb-2 border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-black/80">
            <div className="flex flex-row items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <button 
                 onClick={() => { router.back() }}
                 className="p-1 hover:bg-gray-100 dark:hover:bg-gray-950 cursor-pointer rounded-full transition-colors">
                 <Image src='/images/up-arrow.png' width={30} height={30} alt='back-arrow' className='-rotate-90 dark:invert' />
                 </button>
                  <div className='flex flex-col items-start'>
                    <span className='text-xl font-bold'>Post By</span>
                    <Link 
                     href={`/${decodedHandle}`}
                     className='text-xs rounded-full text-gray-700 dark:text-gray-400 dark:hover:bg-gray-950 hover:bg-gray-100 px-3 py-1 cursor-pointer transition-all duration-300'>
                      {decodedHandle}
                     </Link>
                  </div>
              </div>
              <div className='flex flex-row items-center gap-2'>
                <button className='border border-gray-600 hover:scale-105 dark:border-gray-500 rounded-full px-3 py-1 font-semibold cursor-pointer transition-all duration-300'>Add Reply</button>
                <button 
                 onClick={() => { setopenFilter(!openFilter)}}
                 className='p-2 relative rounded-full cursor-pointer hover:scale-105 dark:hover:bg-gray-950 hover:bg-gray-100 transition-all duration-300'>
                  <FilterIcon />
                  { openFilter && (
                    <div className='absolute w-44 h-fit top-13 right-0 border border-gray-300 dark:border-gray-900 rounded-lg bg-white dark:bg-black shadow-xl dark:shadow-gray-950 overflow-y-auto'>
                      <ul className='p-2 space-y-1'>
                        <li
                        onClick={() => { handleChangeFilterState('Relevency') }}
                        className='px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-950 rounded cursor-pointer text-sm flex items-center justify-between'><Target className="w-4 h-4 mr-2" /><span>Relevancy</span><Check className={`w-4 h-4 ${currentFilter === 'Relevency' ? 'opacity-100 stroke-3' : 'opacity-0'}`} /></li>
                        <li
                        onClick={() => { handleChangeFilterState('Most Liked') }}
                        className='px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-950 rounded cursor-pointer text-sm flex items-center justify-between'><Heart className="w-4 h-4 mr-2" /><span>Most Liked</span><Check className={`w-4 h-4 ${currentFilter === 'Most Liked' ? 'opacity-100 stroke-3' : 'opacity-0'}`} /></li>
                        <li
                        onClick={() => { handleChangeFilterState('Newest') }}
                        className='px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-950 rounded cursor-pointer text-sm flex items-center justify-between'><Clock className="w-4 h-4 mr-2" /><span>Newest</span><Check className={`w-4 h-4 ${currentFilter === 'Newest' ? 'opacity-100 stroke-3' : 'opacity-0'}`} /></li>
                        <li
                        onClick={() => { handleChangeFilterState('Oldest') }}
                        className='px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-950 rounded cursor-pointer text-sm flex items-center justify-between'><Archive className="w-4 h-4 mr-2" /><span>Oldest</span><Check className={`w-4 h-4 ${currentFilter === 'Oldest' ? 'opacity-100 stroke-3' : 'opacity-0'}`} /></li>
                        <li
                        onClick={() => { handleChangeFilterState('Following') }}
                        className='px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-950 rounded cursor-pointer text-sm flex items-center justify-between'><Users className="w-4 h-4 mr-2" /><span>Following</span><Check className={`w-4 h-4 ${currentFilter === 'Following' ? 'opacity-100 stroke-3' : 'opacity-0'}`} /></li>
                      </ul>
                    </div>
                  )}
                </button>
              </div>
            </div>
          </header>
        </div>
        <PostCard postId={String(postId)}/>
        <nav className='border-b border-gray-400 shadow-sm rounded-lg'>
         <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-2">      
           {/* Navigation Menu */}
           <ul className="hidden md:flex items-center gap-6">
             {NavOptions.map((option, index) => (
               <li
                 key={index}
                 onClick={() => { setactiveNav(option) }}
                 className={`relative text-gray-700 rounded-t-lg dark:text-gray-200 font-medium text-[15px] cursor-pointer px-3 py-1 rounded-md transition-all duration-300 hover:bg-yellow-100 dark:hover:bg-blue-950/20 hover:text-yellow-500 dark:hover:text-blue-500 group ${activeNav === option ? 'bg-yellow-100 dark:bg-blue-950/20' : ''}`}
               >
                 {option.value}
                 {/* Underline animation */}
                 <span className="absolute rounded-full left-0 bottom-0 w-0 h-[2px] bg-yellow-500 dark:bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
               </li>
             ))}
           </ul>
         </div>
       </nav>
        <div className='renderingSec my-1 rounded-lg h-full'>
          {(activeNav.value === 'All' || activeNav.value === 'Metric') && (
            <>
            <div className='rounded-lg flex flex-col gap-2 px-4 py-2 text-xl font-semibold shadow-md'>All Records</div>
              <PostMetricsPage postId={String(postId)}/>
            </>
          )}
          {(activeNav.value === 'All' || activeNav.value === 'Bookmark') && (
            <>
            <div className='rounded-lg flex flex-col gap-2 px-4 py-2 text-xl font-semibold shadow-md'>Bookmarks By</div>
            {bookmarkUsers.map((user, index) => (
              <Usercard key={index} decodedHandle={user.username} name={user.name} content={user.bio} user={user} />
            ))}
            </>
          )}
          {(activeNav.value === 'All' || activeNav.value === 'Comments') && (
            <>
            <div className='rounded-lg flex flex-col gap-2 px-4 py-2 text-xl font-semibold shadow-md'>Commented By</div>
              Welcome to Comments section
            </>
          )}
          {(activeNav.value === 'All' || activeNav.value === 'Views') && (
            <>
            <div className='rounded-lg flex flex-col gap-2 px-4 py-2 text-xl font-semibold shadow-md'>Views By</div>
              Welcome to Views section
            </>
          )}
          {(activeNav.value === 'All' || activeNav.value === 'Likes') && (
            <>
            <div className='rounded-lg flex flex-col gap-2 px-4 py-2 text-xl font-semibold shadow-md'>Likes By</div>
              Welcome to Likes section
            </>
          )}
        </div>
      </div>
      <div className='rightContainer h-full flex-1 flex flex-col gap-2 bg-white dark:bg-black rounded-lg p-2'>
        <div className="bg-white dark:bg-black rounded-lg dark:shadow-gray-900 shadow-sm hover:shadow-md transition-all duration-300 p-4">
           <div className="relative">
             {/* 🔍 Search Icon */}
             <svg
               xmlns="http://www.w3.org/2000/svg"
               className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 transition-colors duration-300"
               fill="none"
               viewBox="0 0 24 24"
               stroke="currentColor"
             >
               <path
                 strokeLinecap="round"
                 strokeLinejoin="round"
                 strokeWidth={2}
                 d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
               />
             </svg>

             <input
               id="searchInput"
               type="text"
               placeholder="Search"
               className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-4 focus:ring-yellow-200/50 dark:focus:ring-blue-950/50 focus:border-yellow-400 dark:focus:border-blue-500 outline-none transition-all duration-200"
             />
           </div>
         </div>
         <Usercard decodedHandle={decodedHandle} name={String(PostInfo?.username)} content={String(PostInfo?.content)} heading={<h2 className="text-lg font-semibold">Relevant people</h2>}/>
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
      </div>
    </div>
  )
}

