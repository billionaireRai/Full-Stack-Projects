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

interface featureDemoType {
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
const [feedPosts, setfeedPosts] = useState<PostType[]>([
  {
    postid: "post_001",
    content:
      "Finally shipped our AI scheduling feature after weeks of testing. 🚀",
    postedAt: "2026-07-15T08:30:00Z",
    comments: 34,
    reposts: 19,
    likes: 482,
    views: 5600,
    mediaUrls: [
      {
        url: "https://picsum.photos/id/1015/1200/800",
        media_type: "image",
      },
    ],
    hashTags: ["AI", "Startup", "BuildInPublic"],
    mentions: ["@team"],
    userliked: true,
    userBookmarked: true,
    usereposted: false,
    usercommented: false,
    isVerified: true,
    username: "Amritansh Rai",
    handle: "@amritansh",
    avatar: "https://i.pravatar.cc/150?img=1",
    cover: "https://picsum.photos/1200/400?1",
    bio: "Founder • Developer • Fitness",
    plan: "Pro",
    followers: "14.2K",
    following: "212",
    isFollowing: false,
    isHighlighted: true,
    isPinned: true,
  },

  {
    postid: "post_002",
    content:
      "Morning gym session before writing backend APIs. Discipline wins.",
    postedAt: "2026-07-14T06:20:00Z",
    comments: 16,
    reposts: 4,
    likes: 251,
    views: 2100,
    mediaUrls: [
      {
        url: "https://picsum.photos/id/1005/1200/800",
        media_type: "image",
      },
    ],
    hashTags: ["Fitness", "Coding"],
    userliked: false,
    userBookmarked: false,
    usereposted: false,
    usercommented: true,
    username: "Amritansh Rai",
    handle: "@amritansh",
    avatar: "https://i.pravatar.cc/150?img=1",
    isVerified: true,
  },

  {
    postid: "post_003",
    content:
      "Docker has completely changed how I deploy my applications.",
    postedAt: "2026-07-13T14:40:00Z",
    comments: 23,
    reposts: 31,
    likes: 680,
    views: 7200,
    hashTags: ["Docker", "DevOps"],
    userliked: true,
    isVerified: true,
    username: "Dev Hub",
    handle: "@devhub",
    avatar: "https://i.pravatar.cc/150?img=2",
  },

  {
    postid: "post_004",
    content: "Weekend coffee and system design diagrams.",
    postedAt: "2026-07-12T11:10:00Z",
    comments: 7,
    reposts: 1,
    likes: 88,
    views: 840,
    mediaUrls: [
      {
        url: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
        media_type: "video",
      },
    ],
    username: "Sarah",
    handle: "@sarahcodes",
    avatar: "https://i.pravatar.cc/150?img=3",
    isVerified: false,
  },

  {
    postid: "post_005",
    content: "Building Briezl one feature at a time.",
    postedAt: "2026-07-11T10:00:00Z",
    comments: 45,
    reposts: 27,
    likes: 953,
    views: 14000,
    hashTags: ["Briezl", "Startup"],
    username: "Amritansh Rai",
    handle: "@amritansh",
    avatar: "https://i.pravatar.cc/150?img=1",
    isVerified: true,
    taggedLocation: [
      {
        text: "Delhi, India",
        coordinates: [28.6139, 77.209],
      },
    ],
  },

  {
    postid: "post_006",
    content: "What feature should we build next?",
    postedAt: "2026-07-10T18:15:00Z",
    comments: 96,
    reposts: 18,
    likes: 743,
    views: 10200,
    poll: {
      question: "Choose one",
      options: [
        { text: "Stories", votes: 312 },
        { text: "Communities", votes: 224 },
        { text: "Live Audio", votes: 110 },
      ],
      duration: 86400,
    },
    username: "Briezl",
    handle: "@briezl",
    avatar: "https://i.pravatar.cc/150?img=4",
    isVerified: true,
  },

  {
    postid: "post_007",
    content: "Every bug teaches something new.",
    postedAt: "2026-07-09T16:50:00Z",
    comments: 9,
    reposts: 3,
    likes: 174,
    views: 1200,
    username: "CodeDaily",
    handle: "@codedaily",
    avatar: "https://i.pravatar.cc/150?img=5",
    isVerified: false,
  },

  {
    postid: "post_008",
    content: "React Server Components are growing on me.",
    postedAt: "2026-07-08T08:00:00Z",
    comments: 30,
    reposts: 14,
    likes: 501,
    views: 4900,
    hashTags: ["React", "NextJS"],
    username: "Frontend Guru",
    handle: "@frontendguru",
    avatar: "https://i.pravatar.cc/150?img=6",
    isVerified: true,
  },

  {
    postid: "post_009",
    content: "Beautiful sunset after a productive sprint.",
    postedAt: "2026-07-07T19:30:00Z",
    comments: 11,
    reposts: 2,
    likes: 214,
    views: 1800,
    mediaUrls: [
      {
        url: "https://picsum.photos/id/1025/1200/800",
        media_type: "image",
      },
    ],
    username: "Emily",
    handle: "@emily",
    avatar: "https://i.pravatar.cc/150?img=7",
    isVerified: false,
  },

  {
    postid: "post_010",
    content: "Microservices aren't always the answer.",
    postedAt: "2026-07-06T13:40:00Z",
    comments: 58,
    reposts: 40,
    likes: 1032,
    views: 17000,
    hashTags: ["Architecture"],
    username: "System Design",
    handle: "@sysdesign",
    avatar: "https://i.pravatar.cc/150?img=8",
    isVerified: true,
  },

  {
    postid: "post_011",
    content: "Reading Clean Architecture again.",
    postedAt: "2026-07-05T09:20:00Z",
    comments: 8,
    reposts: 1,
    likes: 92,
    views: 650,
    username: "John",
    handle: "@john",
    avatar: "https://i.pravatar.cc/150?img=9",
    isVerified: false,
  },

  {
    postid: "post_012",
    content: "Kubernetes finally clicked today.",
    postedAt: "2026-07-04T17:00:00Z",
    comments: 17,
    reposts: 7,
    likes: 304,
    views: 3100,
    hashTags: ["Kubernetes"],
    username: "Cloud Guy",
    handle: "@cloudguy",
    avatar: "https://i.pravatar.cc/150?img=10",
    isVerified: true,
  },

  {
    postid: "post_013",
    content: "Taking a break and touching some grass 🌿",
    postedAt: "2026-07-03T18:00:00Z",
    comments: 5,
    reposts: 0,
    likes: 63,
    views: 430,
    username: "Alex",
    handle: "@alex",
    avatar: "https://i.pravatar.cc/150?img=11",
    isVerified: false,
  },

  {
    postid: "post_014",
    content: "Who's attending the developer meetup this weekend?",
    postedAt: "2026-07-02T12:15:00Z",
    comments: 41,
    reposts: 8,
    likes: 411,
    views: 4200,
    taggedLocation: [
      {
        text: "Bengaluru",
        coordinates: [12.9716, 77.5946],
      },
    ],
    username: "Tech Events",
    handle: "@techevents",
    avatar: "https://i.pravatar.cc/150?img=12",
    isVerified: true,
  },

  {
    postid: "post_015",
    content: "Small improvements every single day.",
    postedAt: "2026-07-01T09:40:00Z",
    comments: 12,
    reposts: 2,
    likes: 158,
    views: 1300,
    username: "Motivation",
    handle: "@motivation",
    avatar: "https://i.pravatar.cc/150?img=13",
    isVerified: false,
  },

  {
    postid: "post_016",
    content: "Open source changed my career.",
    postedAt: "2026-06-30T15:00:00Z",
    comments: 36,
    reposts: 23,
    likes: 782,
    views: 9500,
    hashTags: ["OpenSource"],
    username: "Git Master",
    handle: "@gitmaster",
    avatar: "https://i.pravatar.cc/150?img=14",
    isVerified: true,
  },

  {
    postid: "post_017",
    content: "Anyone learning German here? 🇩🇪",
    postedAt: "2026-06-29T08:00:00Z",
    comments: 24,
    reposts: 6,
    likes: 270,
    views: 2400,
    username: "Language Learner",
    handle: "@languages",
    avatar: "https://i.pravatar.cc/150?img=15",
    isVerified: false,
  },

  {
    postid: "post_018",
    content: "The best investment is still learning.",
    postedAt: "2026-06-28T11:00:00Z",
    comments: 15,
    reposts: 5,
    likes: 198,
    views: 1600,
    username: "Business Daily",
    handle: "@bizdaily",
    avatar: "https://i.pravatar.cc/150?img=16",
    isVerified: true,
  },

  {
    postid: "post_019",
    content: "Finished reading another book on distributed systems.",
    postedAt: "2026-06-27T13:30:00Z",
    comments: 18,
    reposts: 3,
    likes: 249,
    views: 2000,
    username: "Backend Engineer",
    handle: "@backend",
    avatar: "https://i.pravatar.cc/150?img=17",
    isVerified: false,
  },

  {
    postid: "post_020",
    content:
      "Success isn't luck. It's consistency over thousands of days.",
    postedAt: "2026-06-26T21:00:00Z",
    comments: 61,
    reposts: 49,
    likes: 1420,
    views: 25200,
    hashTags: ["Success", "Discipline"],
    mentions: ["@everyone"],
    userliked: true,
    userBookmarked: true,
    usereposted: true,
    usercommented: true,
    username: "Visionary",
    handle: "@visionary",
    avatar: "https://i.pravatar.cc/150?img=18",
    isVerified: true,
    isHighlighted: true,
  },
]);

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
const [followSuggestions, setfollowSuggestions] = useState<userCardProp[]>([
        {
            decodedHandle: '@alexcoding',
            name: 'Alex Johnson',
            content: 'Frontend engineer • React • TypeScript • Building fast UIs ⚡',
            account: {
                name: 'Alex Johnson',
                handle: '@alexcoding',
                bio: 'Frontend engineer • React • TypeScript • Building fast UIs ⚡',
                location: { text: 'Austin, TX', coordinates: [30.2672, -97.7431] },
                website: 'https://alexcoding.dev',
                joinDate: 'January 2020',
                following: '1,204',
                followers: '12,480',
                Posts: '342',
                isVerified: true,
                isCompleted: true,
                plan: 'Pro',
                bannerUrl: '/images/default-banner.jpg',
                avatarUrl: '/images/myProfile.jpg',
            },
            IsFollowing: false,
        },
        {
            decodedHandle: '@devonmiles',
            name: 'Devon Miles',
            content: 'Data science + ML • Visualizing insights • Coffee & code ☕',
            account: {
                name: 'Devon Miles',
                handle: '@devonmiles',
                bio: 'Data science + ML • Visualizing insights • Coffee & code ☕',
                location: { text: 'Toronto, ON', coordinates: [43.6532, -79.3832] },
                website: 'https://devonmiles.ai',
                joinDate: 'March 2019',
                following: '842',
                followers: '9,103',
                Posts: '211',
                isVerified: true,
                isCompleted: false,
                plan: 'Creator',
                bannerUrl: '/images/default-banner.jpg',
                avatarUrl: '/images/myProfile.jpg',
            },
            IsFollowing: true,
        },
        {
            decodedHandle: '@sarahwrites',
            name: 'Sarah Writes',
            content: 'Tech writer • Systems thinking • Clear docs > clever code',
            account: {
                name: 'Sarah Writes',
                handle: '@sarahwrites',
                bio: 'Tech writer • Systems thinking • Clear docs > clever code',
                location: { text: 'London, UK', coordinates: [51.5074, -0.1278] },
                website: 'https://sarahwrites.io',
                joinDate: 'June 2021',
                following: '603',
                followers: '4,980',
                Posts: '128',
                isVerified: false,
                isCompleted: true,
                plan: 'Free',
                bannerUrl: '/images/default-banner.jpg',
                avatarUrl: '/images/myProfile.jpg',
            },
            IsFollowing: false,
        },
        {
            decodedHandle: '@mariajen',
            name: 'Maria Jen',
            content: 'Product designer • UX research • Accessibility first ♿',
            account: {
                name: 'Maria Jen',
                handle: '@mariajen',
                bio: 'Product designer • UX research • Accessibility first ♿',
                location: { text: 'Seattle, WA', coordinates: [47.6062, -122.3321] },
                website: 'https://mariajen.design',
                joinDate: 'September 2018',
                following: '1,019',
                followers: '15,201',
                Posts: '410',
                isVerified: true,
                isCompleted: false,
                plan: 'Premium',
                bannerUrl: '/images/default-banner.jpg',
                avatarUrl: '/images/myProfile.jpg',
            },
            IsFollowing: false,
        },
    ]);

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

  // function to fetch feed posts...
   async function getFeedPosts() {
     const feedApi = await axiosInstance.post(`/api/feed`,{ Page , size });
     if (feedApi.status === 200) {
       setfeedPosts((prev) => [...prev,feedApi.data.post]) ;
       sethasFeed(feedApi.data.hasNext) ;
     }
   }
        
   useEffect(() => {
    // getFeedPosts() ;
    // setPage(Page + 1);
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
                    <div className='bg-white dark:bg-black rounded-xl flex flex-col gap-2 border p-4 border-gray-200 dark:border-slate-700 shadow-sm'>
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
                            <div key={idx} className='border ring-3 ring-yellow-400/30 dark:ring-yellow-600/50 border-yellow-400 dark:border-yellow-600 flex items-center gap-2 p-2 justify-center rounded-lg'>
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
                        <div className='space-y-2'>
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
