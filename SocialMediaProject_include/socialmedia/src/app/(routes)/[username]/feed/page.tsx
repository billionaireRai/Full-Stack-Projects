'use client'

import React, { useState , useEffect , useRef } from 'react';
import PostCard from '@/components/postcard';
import Activebeep from '@/components/activebeep';
import AccountSearch from '@/components/accountsearch';
import { AnimatePresence, motion } from 'framer-motion';
import useActiveAccount from '@/app/states/useraccounts';
import Link from 'next/link';
import Image from 'next/image';
import { PostType } from '../../explore/page';
import UserCard, { userCardProp } from '@/components/usercard';
import { CalendarClockIcon, ImagesIcon, Infinity, InfinityIcon, SearchIcon, SparklesIcon, UserPlus2Icon } from 'lucide-react';
import CompLoader from '@/components/componentloader';
import axiosInstance from '@/lib/interceptor';
import Loader from '@/components/loader';

export interface featureDemoType {
  icon:React.JSX.Element ;
  lable:string
}

export default function feed() {
  const { Account } = useActiveAccount() ;
const pageCategory : "feed" | "profile" | "direct" | "explore" = "feed" ;
const size:number = 20 ;
const autoHeightGap:number = 400 ;
const feedSection = useRef<HTMLDivElement | null>(null);
const [Page, setPage] = useState<number>(1);
const [hasFeed, sethasFeed] = useState<boolean>(false);
const [ShowLess, setShowLess] = useState<boolean>(false);
const [suggesstionNum, setsuggesstionNum] = useState<number>(3);
const [showSearchPop, setshowSearchPop] = useState<boolean>(false);
const [loadingPosts, setloadingPosts] = useState<boolean>(false);
const [loadingsuggestions, setloadingsuggestions] = useState<boolean>(false);
const [feedPosts, setfeedPosts] = useState<PostType[]>([]) ;

const [featureDemo, setfeatureDemo] = useState<featureDemoType[]>([
  {
    icon:<SparklesIcon size={25} />,
    lable:'AI powered features for enhancement of you post content'
  },
  {
    icon:<CalendarClockIcon size={25} />,
    lable:'Schedule your post to get uploaded automatically in future'
  },
  {
    icon:<InfinityIcon size={25} />,
    lable:'Unlimited posting & commenting in any time bracket'
  },

])
const [followSuggestions, setfollowSuggestions] = useState<userCardProp[]>([]);

  // function for showing more suggestions...
  const handleSuggesstionShow = () => {
    if (ShowLess) {
      setsuggesstionNum(3);
      setShowLess(false);
    } else {
      if ( ( followSuggestions.length - suggesstionNum ) >= 3 ) {
        setsuggesstionNum(suggesstionNum + 3);
        if (suggesstionNum + 3 === followSuggestions.length) {
          setShowLess(true);
        }
      }
    }
  }

  // function fetching suggestions...
  async function getAccountSuggestions() {
    setloadingsuggestions(true);
    const suggApi = await axiosInstance.get('/api/feed');
     if (suggApi.status === 200) {
      setfollowSuggestions(suggApi.data.suggestions);
      setloadingsuggestions(false);
     } else {
      setloadingsuggestions(false);
     }
  }

  // function to fetch feed posts...
   async function getFeedPosts() {
    setloadingPosts(true);
     const feedApi = await axiosInstance.post(`/api/feed`,{ Page , size });
     if (feedApi.status === 200) {
       setfeedPosts((prev) => [...prev, ...(feedApi.data.posts)]) ;
       sethasFeed(feedApi.data.hasNext) ;
       setloadingPosts(false);
     }
   }
        
   useEffect(() => {
    getAccountSuggestions();
    getFeedPosts() ;
    setPage(Page + 1);
   }, [])
  
  // fetching posts by pagination...
  useEffect(() => {
     const feedsection = feedSection.current ;
     if (!feedsection) return ;
     
     const handleScroll = () => {
       const distanceFromBottom = feedsection.scrollHeight - feedsection.scrollTop - feedsection.clientHeight ;
       if (distanceFromBottom <= autoHeightGap && hasFeed) {
         getFeedPosts();
         setPage(Page + 1);
       }
      }
      // calling scroll function...
      handleScroll() ;
     
      feedsection.addEventListener('scroll', handleScroll, { passive: true })
      return () => {
       feedsection.removeEventListener('scroll', handleScroll)
     }
  }, [autoHeightGap,hasFeed,feedPosts.length])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
       if (showSearchPop && !(event.target as Element).closest('.search-pop')) {
         setshowSearchPop(false)
       }
    }
      
    if (showSearchPop) {
      document.addEventListener('mousedown', handleClickOutside)
    }
       
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showSearchPop])
  

    return (
        <div className='h-screen flex flex-col font-poppins rounded-lg'>
            <div className='mainbox dark:bg-black w-full h-screen rounded-lg flex flex-col lg:flex-row-reverse gap-5 p-1 max-w-7xl mx-auto font-poppins shadow-lg'>
                {/* Right Sidebar */}
                <div className='right w-full overflow-y-scroll lg:w-80 xl:w-96 hidden xl:block space-y-2 m-2'>
                    {/* card to subscribe... */}
                    <div className='bg-white dark:bg-black rounded-xl flex flex-col gap-2 border p-4 border-gray-200 dark:border-gray-900 shadow-sm'>
                        <div className='flex item-center justify-between gap-3'>
                          <div className='flex items-center justify-start gap-2'>
                            <span className='text-xl font-semibold'>Upgrade subscription</span>
                            <span className='flex items-center justify-center bg-yellow-100 dark:bg-gray-950 p-1 rounded-full'>
                                <Image src='/images/yellow-tick.png' width={18} height={18} alt='subscribed-account'/>
                            </span>
                          </div>
                          <Activebeep />
                        </div>
                        <p className='text-xs text-gray-400'>
                            Upgrading your subscription plan allows you to unlock new features and if eligible , recieve a share of revenue...
                        </p>
                        <div className='borer border-black p-2 flex flex-col gap-2 rounded-lg'>
                          {featureDemo.length > 0 && featureDemo.map((feature,idx) => (
                            <div key={idx} className='border ring-3 ring-yellow-400/30 dark:ring-yellow-600/20 border-yellow-400 dark:border-yellow-600 flex items-center gap-2 p-2 justify-center rounded-lg'>
                              <span>{feature.icon}</span>
                              <span className='text-xs text-gray-500'>{feature.lable}</span>
                            </div>
                          ))}
                        </div>
                        <Link href='/subscription?plan=Pro&term=Monthly&utm_source=feed-page' className='w-fit rounded-lg'>
                          <button className='cursor-pointer w-fit py-2 px-4 mt-1 font-semibold hover:shadow-md shadow-sm shadow-yellow-100 dark:shadow-yellow-900 dark:bg-yellow-500 bg-yellow-400 transition-shadow duration-300 rounded-lg'>Subscribe</button>
                        </Link>
                    </div>
                    {/* Who to Follow */}
                    <div className='bg-white dark:bg-black rounded-xl'>
                        <div className='p-4 flex items-center justify-start gap-3 border-b rounded-lg border-gray-200 dark:border-slate-700'>
                            <UserPlus2Icon size={30} />
                            <h2 className='text-xl font-bold text-gray-900 dark:text-white'>Who to follow</h2>
                        </div>
                        <div className='flex flex-col gap-2 items-center justify-center'>
                         {followSuggestions.map((u,index) => 
                             (index+1) <= suggesstionNum && (
                                <UserCard
                                    key={u.decodedHandle}
                                    decodedHandle={u.decodedHandle}
                                    name={u.name}
                                    content={u.content}
                                    IsFollowing={u.IsFollowing}
                                    account={u.account}
                                />
                            ))}
                            {loadingsuggestions && (
                              <Loader loadingtext={`loading suggestions`} />
                            )}
                        </div>
                        <div className='p-4 border-t rounded-lg border-gray-200 dark:border-slate-700'>
                            <button 
                             onClick={() => { handleSuggesstionShow() }}
                             className='cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-950 p-2 rounded-full text-yellow-500 hover:text-yellow-600 text-sm font-medium'>
                              { ShowLess ? 'Show less' : 'Show more' }
                            </button>
                        </div>
                    </div>
                </div>
                {/* Main Feed Area - Left Side */}
                <div ref={feedSection} className='left relative flex-1 h-full overflow-y-scroll bg-white dark:bg-black rounded-xl'>
                  <div className="flex items-center justify-between sticky top-0 rounded-lg p-2 bg-white/70 dark:bg-black/70 backdrop-blur-md">
                    <div className='flex w-fit items-center font-bold justify-center gap-2 p-2 rounded-lg'>
                      <ImagesIcon size={40} />
                      <span>Feed posts</span>
                    </div>
                    {/* Search Container */}
                    <div className="search-pop relative w-fit rounded-xl p-1">
                        <button onClick={() => { setshowSearchPop(true) }} type="button" className='cursor-pointer w-fit text-white
                       dark:text-black bg-black dark:bg-white hover:shadow-md shadow-sm rounded-full flex items-center justify-center gap-2 p-2'>
                          <SearchIcon size={25} />
                          <span>Search Account</span>
                        </button>
                    </div>
                  </div>
                    <div className='px-1 flex flex-col gap-0'>
                    {feedPosts.length > 0 && feedPosts.map((p) => (
                        <PostCard
                            key={p.postid}
                            postId={p.postid}
                            fromPage={pageCategory}
                            avatar={p.avatar}
                            cover={p.cover}
                            username={p.username}
                            handle={p.handle}
                            bio={p.bio}
                            content={p.content}
                            media={p.mediaUrls}
                            hashTags={p.hashTags}
                            mentions={p.mentions}
                            timestamp={p.postedAt}
                            likes={p.likes}
                            reposts={p.reposts}
                            replies={p.comments}
                            views={p.views}
                            taggedLocation={p.taggedLocation}
                            poll={p.poll}
                            userliked={p.userliked}
                            usereposted={p.usereposted}
                            usercommented={p.usercommented}
                            userbookmarked={p.userBookmarked}
                            isPinned={p.isPinned}
                            isVerified={p.isVerified}
                            plan={p.plan}
                            followers={p.followers}
                            following={p.following}
                            isFollowing={p.isFollowing}
                            isHighlighted={p.isHighlighted}
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
            </div>
             {showSearchPop && (
               <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0 , y: 10 }}
                  animate={{ opacity: 1 , duration:1000  , y: 0}}
                  exit={{ opacity: 0 , y: -10 }}
                  className="fixed inset-0 bg-black/10 backdrop-blur-xs flex items-start z-50 animate-in fade-in-0 zoom-in-95 duration-200">
                    <AccountSearch placeholder='Search any account...' handle={String(Account.decodedHandle)} onSelect={() => { setshowSearchPop(false) }} />
                </motion.div>
               </AnimatePresence>
              )}
        </div>

    )
}
