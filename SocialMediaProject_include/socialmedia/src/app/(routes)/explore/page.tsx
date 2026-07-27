'use client'

import React, { useState , useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence , motion } from 'framer-motion';
import CompLoader from '@/components/componentloader';
import { SettingsIcon , SearchIcon , Users, TrendingUp, MessageCircleHeartIcon } from 'lucide-react';
import Newscard from '@/components/newscard';
import Trendcard from '@/components/trendcard';
import PostCard from '@/components/postcard';
import Activebeep from '@/components/activebeep';
import Usercard from '@/components/usercard';
import ExploreSettings from '@/components/exploresettings';
import { userCardProp } from '@/components/usercard';
import { useSearchParams } from 'next/navigation';
import axiosInstance from '@/lib/interceptor';
import useActiveAccount from '@/app/states/useraccounts';
import Loader from '@/components/loader';
interface newsCardType {
  source: string;
  category: string;
  gradient: string;
  title: string;
  timeAgo: string;
  location: string;
  href: string;
}

interface trendcarddata {
  rank:number ; 
  region:string ; 
  tag:string ; 
  posts: number ;
}

interface mediaType {
  url: string;
  media_type: string;
}

interface locationTaggedType {
  text: string;
  coordinates: number[];
}

interface pollInfoType {
  question: string;
  options: Array<{ text: string; votes: number }>;
  duration: number;
}


export interface PostType {
  postid: string;
  content: string;
  postedAt: string;
  comments: number;
  reposts: number;
  likes: number;
  views: number;
  mediaUrls?: mediaType[];
  hashTags?: string[];
  mentions?: string[];
  userBookmarked?: boolean;
  userliked?: boolean;
  usereposted?: boolean;
  usercommented?: boolean;
  userbookmarked?: boolean;
  username?: string;
  handle?: string;
  avatar?: string;
  cover?: string;
  bio?: string;
  isVerified: boolean;
  plan?: string;
  followers?: string;
  following?: string;
  isFollowing?: boolean;
  isHighlighted?: boolean;
  isPinned?: boolean;
  taggedLocation?: locationTaggedType[];
  poll?: pollInfoType;
}


export default function Explore() {
  const searchparam = useSearchParams() ; // initializing search param hook...
  const pagesize:number = 20 ;
  const autoHeightGap:number = 400 ;
  const hashtopic = searchparam.get('t') ;
  const { Account } = useActiveAccount() ;
  const [Page, setPage] = useState<number>(1) ;
  const [hasExplore, sethasExplore] = useState<boolean>(true);
  const pageCategory : "feed" | "profile" | "direct" | "explore" = "explore" ;

  const [openSettings, setopenSettings] = useState(false);
  const [loadingPosts, setloadingPosts] = useState<boolean>(false);
  const [loadingsuggestions, setloadingsuggestions] = useState<boolean>(true);
  const [loadingTrends, setloadingTrends] = useState<boolean>(false);
  const [LocationSetting, setLocationSetting] = useState(false);
  // const [hpninPopUp, sethpninPopUp] = useState(0);
  const [ShowLess, setShowLess] = useState<boolean>(false);
  const [suggesstionNum, setsuggesstionNum] = useState<number>(3);

  const leftSectionRef = useRef<HTMLDivElement | null>(null);

  const [suggestionAcc,setsuggestionAcc] =useState<userCardProp[]>([
     {
      decodedHandle: '@diana_startup',
      name: 'Diana Entrepreneur',
      IsFollowing: true,
      account: {
        name: 'Diana Entrepreneur',
        handle: '@diana_startup',
        bio: 'Entrepreneur | AI enthusiast | Founder of innovative tech solutions.',
        location: {
          text: 'Seattle, WA',
          coordinates: [47.6062, -122.3321] as [number, number]
        },
        website: 'https://diana-startup.com',
        joinDate: '2021-02-28',
        following: '345',
        followers: '890',
        Posts: '234',
        isCompleted:true,
        isVerified: false,
        plan:'Free',
        bannerUrl: '/images/default-banner.jpg',
        avatarUrl: '/images/default-profile-pic.png'
      }
    }
  ]);
      
      const [Trends,setTrends] = useState<trendcarddata[]>([
        { rank: 1, region: "India", tag: "#Baaghi4Trailer", posts: 3592 },
      ]);

      const newsData :newsCardType[] = [
        {
          source: "CNN",
          category: `${(Account.account?.location.text) ?? 'World'}-News`,
          gradient: 'from-blue-500 via-purple-500 to-indigo-600',
          title: `Major Breaking News from ${Account.account?.location.text ?? 'world'}...`,
          timeAgo: "about 12hr",
          location: "Politics",
          href: `/news?n=${encodeURIComponent(`Major-Breaking-News-from-politics&cat=politics&utm_source=news-click`)}`
        },
        {
          source: "BBC",
          category: "Sports News",
          gradient: 'from-black via-gray-900 to-white',
          title: "Top Sports News Across World",
          timeAgo: "about 12hr",
          location: "Sports",
          href: `/news?n=${encodeURIComponent('Top-Sports-News-Across-World')}&cat=sports&utm_source=news-click`
        },
        {
          source: "TG",
          category: "Technology",
          gradient: 'from-red-500 via-orange-500 to-yellow-600',
          title: "Technology revolution & innovation with AI",
          timeAgo: "about 12hr",
          location: "Technology",
          href: `/news?n=${encodeURIComponent('Technology-revolution-and-innovation-with-AI')}&cat=technology&utm_source=news-click`
        },
        {
          source: "TWP",
          category: "Entertainment News",
          gradient: 'from-green-500 via-green-300 to-white',
          title: "News about entertainment industry around world",
          timeAgo: "about 12hr",
          location: "Entertainment",
          href: `/news?n=${encodeURIComponent('News-About-Entertainment-Industry-Around-World')}&cat=entertainment&utm_source=news-click`
        },
        {
          source: "ABP",
          category: "Crypto Market News",
          gradient: 'from-blue-500 via-blue-300 to-white',
          title: "Updates about crypto market & exchanges",
          timeAgo: "about 12hr",
          location: "Business",
          href: `/news?n=${encodeURIComponent('Updates-About-Crypto-Market-And-Exchanges')}&cat=business&utm_source=news-click`
        }
      ];

      const [explorePosts, setexplorePosts] = useState<PostType[]>([])
      
      // function fetching trendings , follow-suggestions , news...
      async function getOtherExploreInfo() {
        setloadingTrends(true);
        const otherapi = await axiosInstance.post('/api/explore');
        if (otherapi.status === 200) {
          setsuggestionAcc(otherapi.data.suggestions);
          setTrends(otherapi.data.trendingHashtags);
          setloadingsuggestions(false);
          setloadingTrends(false);
        }
      }

      
      // function to get posts...
     const functionFetchPosts = useCallback( async (hashtag?: string) => {
        try {
          setloadingPosts(true);
          const postapi = await axiosInstance.get(`/api/explore?hashtag=${encodeURIComponent(hashtag ?? '')}&size=${pagesize}&page=${Page}`);

          if (postapi.status === 200) {
            setexplorePosts((prev) => [...prev,...postapi.data.explore]);
            sethasExplore(postapi.data.hasNext);
          }
        } catch (err) {
          console.error('Failed to fetch explore posts:', err);
        } finally {
          setloadingPosts(false);
        }
      },[Page])
      
      useEffect(() => {
        getOtherExploreInfo() ;
        if (hashtopic) {
          const decodedT = decodeURIComponent(String(hashtopic)).substring(1); // pattern #something
            functionFetchPosts(decodedT); // getting explore posts 
            setPage(Page + 1);
          } else {
            functionFetchPosts() ;
            setPage(Page + 1);
        }
      }, [hashtopic,functionFetchPosts,Page])

    // fetching posts by pagination...
    useEffect(() => {
      const exploreSection = leftSectionRef.current ;
      if (!exploreSection) return ;
      
      const handleScroll = () => {
        const distanceFromBottom = exploreSection.scrollHeight - exploreSection.scrollTop - exploreSection.clientHeight ;
  
        if (distanceFromBottom <= autoHeightGap && hasExplore) {
           if (hashtopic) {
            const decodedT = decodeURIComponent(String(hashtopic)).substring(1); // pattern #something
            functionFetchPosts(decodedT); // getting explore posts 
            setPage(Page + 1);
          } else {
            functionFetchPosts() ;
            setPage(Page + 1);
          }
        }
       }
       // calling scroll function...
       handleScroll() ;
      
       exploreSection.addEventListener('scroll', handleScroll, { passive: true })
       return () => {
        exploreSection.removeEventListener('scroll', handleScroll)
      }
   }, [autoHeightGap,hasExplore,explorePosts.length,Page,hashtopic,functionFetchPosts])
      
  // function for showing more suggestions...
  const handleSuggesstionShow = () => {
    if (ShowLess) {
      setsuggesstionNum(3);
      setShowLess(false);
    } else {
      if ( ( suggestionAcc.length - suggesstionNum ) >= 3 ) {
        setsuggesstionNum(suggesstionNum + 3);
        if (suggesstionNum + 3 === suggestionAcc.length) {
          setShowLess(true);
        }
      }
    }
  }
  

  return (
    <div className='h-fit flex flex-row-reverse font-poppins overflow-y-hidden rounded-lg dark:bg-black'>
      <div className='mainbox hidden dark:bg-black w-fit max-h-screen rounded-lg xl:flex flex-col lg:flex-row-reverse gap-4 p-4 max-w-7xl mx-auto font-poppins'>
        <div
          className={`right w-fit overflow-y-auto no-scrollbar lg:w-80 xl:w-96 space-y-2 overscroll-contain sticky top-0`}
        >
           <div className='bg-white p-2 dark:bg-black rounded-xl shadow-lg'>
               <div className='flex flex-col items-center gap-1.5'>
                    {/* account suggestions according to my preference... */}
                    {(suggestionAcc  && !loadingsuggestions) ? (
                    <div className='relative bg-white dark:bg-black rounded-xl shadow-lg'>
                        <div className='p-4 m-2 border-b rounded-md flex gap-2 items-center dark:border-gray-700'>
                          <Users size={20} /><h2 className='text-xl font-bold text-gray-900 dark:text-white'>Who to follow !!</h2>
                        </div>
                          <div className='p-4 w-full'>
                            {suggestionAcc.slice(0, suggesstionNum).map((user, index) => (
                              <div key={index} className='flex items-center justify-between mb-2'>
                                <Usercard {...user} content={null} />
                              </div>
                            ))
                          }
                          </div>
                        <div className='p-2 m-2 rounded-md border-t border-gray-200 dark:border-gray-700'>
                           <button 
                            onClick={() => { handleSuggesstionShow() }}
                            className='cursor-pointer hover:bg-yellow-100 dark:hover:bg-gray-950 p-2 rounded-full text-yellow-500 hover:text-yellow-600 text-sm font-medium'>
                             { ShowLess ? 'Show less'  :'Show more' }
                           </button>
                         </div>
                      </div>
                    ) : (
                       <Loader />
                    )}
                    {/* Today's News */}
                    {/* On hover of each redirect => '/explore?n=endcodeurlcomponent(newstitle)&utm_source=news-click*/}
                    <div className='p-4 rounded-lg border-b w-full border-gray-200 dark:border-slate-700 flex items-center justify-between'>
                      <h2 className='text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3'><span>Today's News</span><Activebeep /></h2>
                      <Image className='dark:invert' src='/images/newspaper-folded.png' height={25} width={25} alt='newspaper' />
                    </div>
                    {newsData.map((newsItem, index) => (
                       <Newscard key={index} {...newsItem} />
                     ))}
                      </div>
                        <div className='p-2 m-2 rounded-md border-t border-gray-200 dark:border-gray-700'>
                           <Link  href={`/explore?q=${encodeURIComponent('todays-news')}&utm_source=show-more`} className='cursor-pointer hover:bg-yellow-100 dark:hover:bg-gray-950 p-2 rounded-full text-yellow-500 hover:text-yellow-600 text-sm font-medium'>
                                Show more
                            </Link>
                        </div>
                      </div>
                </div>
        </div>
        {/* Main explore post Area - Left Side */}
        <div
          className={`left flex flex-col gap-2 h-fit flex-1 bg-white dark:bg-black rounded-xl font-poppins max-h-screen no-scrollbar overscroll-contain overflow-y-auto`}
          ref={leftSectionRef}
        >
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
                <div className='flex items-center justify-between m-2'>
                  <span>Trending Nowdays</span>
                  <TrendingUp size={20}/>
                </div>

                <ul className='flex flex-col gap-1'>
                  {( Trends.length > 0 && !loadingTrends ) ? Trends?.map((trend, index) => (
                    <Trendcard 
                      key={index}
                      rank={trend.rank} 
                      region={trend.region} 
                      tag={trend.tag} 
                      posts={trend.posts} 
                    />
                  )) : (
                    <Loader />
                  )}
                </ul>
            </div>
            <div className='p-4 space-y-2'>
               <div className='flex items-center text-lg font-semibold justify-between m-2'>
                  <span>Explore Post</span>
                  <MessageCircleHeartIcon size={20}/>
               </div>
               <div>
                {(explorePosts).map((post,index) => (
                  <PostCard 
                    key={index} 
                    postId={post.postid}
                    fromPage={pageCategory}
                    avatar={post.avatar}
                    cover={post.cover}
                    username={post.username}
                    handle={post.handle}
                    bio={post.bio}
                    content={post.content}
                    media={post.mediaUrls}
                    hashTags={post.hashTags}
                    mentions={post.mentions}
                    timestamp={post.postedAt}
                    likes={post.likes}
                    reposts={post.reposts}
                    replies={post.comments}
                    views={post.views}
                    taggedLocation={post.taggedLocation}
                    poll={post.poll}
                    userliked={post.userliked}
                    usereposted={post.usereposted}
                    usercommented={post.usercommented}
                    userbookmarked={post.userbookmarked}
                    isPinned={post.isPinned}
                    isVerified={post.isVerified}
                    plan={post.plan}
                    followers={post.followers}
                    following={post.following}
                    isFollowing={post.isFollowing}
                    isHighlighted={post.isHighlighted}    
                  />
                ))}
                </div>
                 <AnimatePresence>
                    {loadingPosts && (
                      <motion.div
                        className="flex flex-col items-center justify-center gap-4 mt-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <motion.div
                          className="w-8 h-8 border-4 border-yellow-200 dark:border-yellow-300 border-t-yellow-500 dark:border-t-yellow-400 rounded-full animate-spin"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1 , repeat: Infinity , ease: "linear" }}
                        />
                        <CompLoader />
                      </motion.div>
                    )}
                 </AnimatePresence>
            </div>
            {openSettings && (
              <ExploreSettings
                LocationSetting={LocationSetting}
                toggleLocation={() => setLocationSetting(!LocationSetting)}
                close={() => setopenSettings(false)}
              />
            )}
            </div>
          </div>
      )}


