'use client'

import React, { useState , useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useParams } from 'next/navigation'
import { FilterIcon, Target, Heart, Clock, Archive, Users, Check, Flame, TrendingUp, Gamepad2, Briefcase, MoreHorizontal as MoreHorizontalIcon, User, Eye, MessageSquare, Bookmark, ChevronDown, Share2, UserPlusIcon, UserCheck, CommandIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import PostCard from '@/components/postcard'
import TrendingCard from '@/components/trendingcard'
import Usercard from '@/components/usercard'
import PostMetricsPage from '@/components/postmetrics'
import { PostCardProps } from '@/components/postcard'
import { accountInfoType, userCardProp } from '@/components/usercard'
import { Tooltip } from '@/components/ui/tooltip'
import { TooltipContent, TooltipTrigger } from '@radix-ui/react-tooltip'
import axiosInstance from '@/lib/interceptor'
import { getPostByIdService } from '@/app/db/services/post'


interface mediaType {
  url: string;
  media_type: string;
}

interface locationTaggedType {
  text: string,
  coordinates: number[]
}

interface pollInfoType {
  question: string;
  options: { text: string; votes: number }[];
  duration: number;
}
interface PostType {
    id: string,
    content: string,
    postedAt: string,
    comments: number,
    reposts: number,
    likes: number,
    views: number,
    mediaUrls?:mediaType[],
    hashTags?:string[],
    mentions?:string[],
    userBookmarked?:boolean,
    userliked?: boolean,
    usereposted?: boolean,
    usercommented?: boolean,
    userbookmarked?: boolean,
    username?: string,
    handle?: string,
    avatar?: string,
    cover?: string,
    bio?: string,
    isVerified?: boolean,
    followers?: string,
    following?: string,
    isFollowing?: boolean,
    isHighlighted?: boolean,
    isPinned?: boolean,
    taggedLocation?: locationTaggedType[],
    poll?: pollInfoType
}


interface navOptionsType {
  label:string;
  value:string;
}

interface RepliedPostsType {
  id: string;
  postId: string;
  postAuthorInfo: {
    name: string;
    username: string;
    followers: string;
    following: string;
    bio: string;
    isVerified: boolean;
    avatar: string;
    banner: string;
    media: mediaType[];
    mentions: string[];
    hashTags: string[];
    content: string;
    postedAt: string;
  };
  // Reply author info at outer level - the user who replied to the comment
  name: string;
  username: string;
  followers: string;
  following: string;
  bio: string;
  isVerified: boolean;
  avatar: string;
  banner: string;
  media: mediaType[];
  mentions: string[];
  hashTags: string[];
  commentedText: string;
  repliedAt: string;
  comments: number;
  reposts: number;
  likes: number;
  isPinned: boolean;
  isHighlighted: boolean;
  views: number;
  userliked: boolean;
  usereposted: boolean;
  usercommented: boolean;
  userbookmarked: boolean;
}

export default function paticularPost() {
  const router = useRouter() ;
  const pageCategory : "feed" | "profile" | "direct" | "explore" = "direct" ;
  const [decodedHandle, setdecodedHandle] = useState<string | null>(null) ;
  const [openFilter, setopenFilter] = useState<boolean>(false) ;
  const [currentFilter, setcurrentFilter] = useState<string>('Relevency');
  const [PostInfo, setPostInfo] = useState<PostType | null>(null);
  const [hpninPopUp, sethpninPopUp] = useState<number>(0);
  const [activeNav, setactiveNav] = useState<navOptionsType>({ label:'all',value:'All'}) ;
  const [ShowLess, setShowLess] = useState<boolean>(false);
  const [suggesstionNum, setsuggesstionNum] = useState<number>(3);
  const [NavOptions, setNavOptions] = useState<navOptionsType[]>([
    { label:'all',value:'All'},
    { label: 'bookmark', value: 'Bookmark' },
    { label: 'metric', value: 'Metric' },
    { label: 'comments', value: 'Comments' },
    { label: 'views', value: 'Views' },
    { label: 'likes', value: 'Likes' }
  ])

  // for storing the post details...
  const [POST, setPOST] = useState<PostType | null>({
      id: "1",
      content: "Just launched my new portfolio website! Built with Next.js and Tailwind CSS. The developer experience is amazing! 🚀",
      postedAt: "2h ago",
      comments: 12,
      reposts: 45,
      likes: 128,
      views: 1000,
      mediaUrls: [],
      hashTags: ["NextJS", "TailwindCSS", "WebDev"],
      mentions: ["vercel", "reactjs"],
      userliked:true,
      isPinned:false,
      isHighlighted:false,
      usereposted:true,
      usercommented:false,
      userbookmarked:false,
      username: "Amritansh Rai",
      handle: "amritansh_coder",
      avatar: "https://picsum.photos/seed/avatar1/200/200",
      cover: "https://picsum.photos/seed/cover1/1500/500",
      bio: "Full-stack developer | React enthusiast | Building the future one commit at a time.",
      isVerified: true,
      followers: "327k",
      following: "177",
      isFollowing: false,
      taggedLocation: [{ text: "San Francisco, CA", coordinates: [37.7749, -122.4194] }],
      poll: {
        question: "What's your favorite JavaScript framework?",
        options: [
          { text: "React", votes: 150 },
          { text: "Vue", votes: 80 },
          { text: "Angular", votes: 45 },
          { text: "Svelte", votes: 60 }
        ],
        duration: 24
      }
    }) ; // for storing post details...

    const [whoToFollow, setWhoToFollow] = useState<userCardProp[]>([
      {
        decodedHandle: 'alice_dev',
        name: 'Alice Developer',
        IsFollowing: true,
        account: {
          name: 'Alice Developer',
          handle: 'alice_dev',
          bio: 'Full-stack developer | React enthusiast | Building the future one commit at a time.',
          location: {
            text: 'New York, NY',
            coordinates: [40.7128, -74.0060]
          },
          website: 'https://alice-dev.com',
          joinDate: '2020-05-15',
          following: '234',
          followers: '1.2k',
          Posts: '456',
          isCompleted: true,
          isVerified: true,
          bannerUrl: '/images/default-banner.jpg',
          avatarUrl: '/images/default-profile-pic.png'
        }
      },
      {
        decodedHandle: 'bob_designer',
        name: 'Bob Designer',
        IsFollowing: false,
        account: {
          name: 'Bob Designer',
          handle: 'bob_designer',
          bio: 'Creative designer | Minimalist | Coffee addict | Turning ideas into beautiful interfaces.',
          location: {
            text: 'Los Angeles, CA',
            coordinates: [34.0522, -118.2437]
          },
          website: 'https://bob-designs.com',
          joinDate: '2019-08-22',
          following: '567',
          followers: '3.4k',
          Posts: '789',
          isCompleted: true,
          isVerified: false,
          bannerUrl: '/images/default-banner.jpg',
          avatarUrl: '/images/default-profile-pic.png'
        }
      },
      {
        decodedHandle: 'charlie_writer',
        name: 'Charlie Writer',
        IsFollowing: false,
        account: {
          name: 'Charlie Writer',
          handle: 'charlie_writer',
          bio: 'Tech writer | Blogger | Sharing insights on the latest in technology and development.',
          location: {
            text: 'Austin, TX',
            coordinates: [30.2672, -97.7431]
          },
          website: 'https://charlie-writes.com',
          joinDate: '2018-11-10',
          following: '123',
          followers: '5.6k',
          Posts: '1,234',
          isCompleted: true,
          isVerified: true,
          bannerUrl: '/images/default-banner.jpg',
          avatarUrl: '/images/default-profile-pic.png'
        }
      }
    ])
  
    const handleSuggesstionShow = () => {
      if (ShowLess) {
        setsuggesstionNum(3);
        setShowLess(false);
      } else {
        if ((whoToFollow.length - suggesstionNum) >= 3) {
          setsuggesstionNum(suggesstionNum + 3);
          if (suggesstionNum + 3 >= whoToFollow.length) {
            setShowLess(true);
          }
        } else {
          setsuggesstionNum(whoToFollow.length);
          setShowLess(true);
        }
      }
    }

  const [Comments, setComments] = useState<PostCardProps[]>([
    {
      postId: '2',
      content: 'Beautiful sunset today! Nature is amazing.',
      timestamp: 'Oct 2, 2023',
      replies: 8,
      reposts: 5,
      likes: 25,
      views: 200,
      media: [{ url: 'https://picsum.photos/seed/2/400/300', media_type: 'image' }],
      hashTags: ['nature', 'sunset'],
      mentions: [],
      userliked: false,
      usereposted: true,
      usercommented: true,
      userbookmarked: true,
      username: 'Sarah Johnson',
      handle: 'sarah_nature',
      avatar: 'https://picsum.photos/seed/avatar2/200/200',
      cover: 'https://picsum.photos/seed/cover2/1500/500',
      bio: 'Nature photographer & travel enthusiast',
      isVerified: false,
      followers: '12.5k',
      following: '892'
    },
  ])

  const [RepliedPosts, setRepliedPosts] = useState<RepliedPostsType[]>([
  {
      id: "4",
      postId: '4224',
      postAuthorInfo: {
        name: "Sarah Tech",
        username: "sarah_dev",
        followers:'120k',
        following:'89',
        bio:'Full-stack developer | Open source contributor',
        isVerified: true,
        avatar: "/images/default-profile-pic.png",
        banner:'',
        media:[],
        mentions:['techcommunity'],
        hashTags:['Coding','JavaScript'],
        content: "Check out my latest tutorial on building scalable React applications!",
        postedAt: "5d ago"
      },
      commentedText: "Great tutorial! Really helped me understand the concepts better. 👍",
      name: "James Clear",
      username: "jamesclear__",
      followers:'120k',
      following:'89',
      bio:'A CEO , founder of multiple tech companies...',
      isVerified: true,
      avatar: "/images/default-profile-pic.png",
      banner:'',
      media: [],
      mentions:['sarah_dev'],
      hashTags:['React','Tutorial'],
      repliedAt: "4d ago",
      comments: 56,
      reposts: 89,
      likes: 456,
      isPinned:false,
      isHighlighted:false,
      views: 1200,
      userliked:false,
      usereposted:true,
      usercommented:false,
      userbookmarked:true
    }
  ])

  const [bookmarkUsers,setbookmarkUsers] = useState<userCardProp[]>([
    {
      decodedHandle: 'johndoe',
      name: 'John Doe',
      IsFollowing: false,
      account: {
        name: 'John Doe',
        handle: 'johndoe',
        bio: 'Software Engineer passionate about coding',
        location: {
          text: 'New York',
          coordinates: [40.7128, -74.0060]
        },
        website: 'https://johndoe.com',
        joinDate: 'January 2020',
        following: '150',
        followers: '200',
        Posts: '50',
        isVerified: true,
        isCompleted: true,
        bannerUrl: '/images/signup-banner.png',
        avatarUrl: '/images/myProfile.jpg'
      }
    }
  ]);

  const [viewedUsers,setviewedUsers] = useState<userCardProp[]>([
    {
      decodedHandle: 'alicej',
      name: 'Alice Johnson',
      IsFollowing: true,
      account: {
        name: 'Alice Johnson',
        handle: 'alicej',
        bio: 'Tech enthusiast and blogger',
        location: {
          text: 'San Francisco',
          coordinates: [37.7749, -122.4194]
        },
        website: 'https://alicej.com',
        joinDate: 'February 2021',
        following: '200',
        followers: '300',
        Posts: '75',
        isVerified: true,
        isCompleted: true,
        bannerUrl: '/images/signup-banner.png',
        avatarUrl: '/images/myProfile.jpg'
      }
    }
  ]);

  const [likedUsers,setlikedUsers] = useState<userCardProp[]>([
    {
      decodedHandle: 'charlieb',
      name: 'Charlie Brown',
      IsFollowing: false,
      account: {
        name: 'Charlie Brown',
        handle: 'charlieb',
        bio: 'Musician and songwriter',
        location: {
          text: 'Austin',
          coordinates: [30.2672, -97.7431]
        },
        website: 'https://charlieb.com',
        joinDate: 'June 2017',
        following: '220',
        followers: '400',
        Posts: '90',
        isVerified: true,
        isCompleted: true,
        bannerUrl: '/images/signup-banner.png',
        avatarUrl: '/images/myProfile.jpg'
      }
    }
  ]);

  // account information of this page...
  const [UserInfo, setUserInfo] = useState<userCardProp>(
    {
      id:'2BVFT^YVU*(0',
      decodedHandle: 'jhondoe',
      name: 'Jhon Doe',
      IsFollowing: true,
      account: {
        name: 'Jhon Doe',
        handle: 'jhondoe',
        bio: 'Tech enthusiast and blogger',
        location: {
          text: 'San Francisco',
          coordinates: [37.7749, -122.4194]
        },
        website: 'https://jhondoe.dev',
        joinDate: 'February 2021',
        following: '200',
        followers: '300',
        Posts: '75',
        isVerified: true,
        isCompleted: true,
        bannerUrl: '/images/signup-banner.png',
        avatarUrl: '/images/myProfile.jpg'
      }
    }
  );
  
  const { username , postId } = useParams() ;
  const searchparam = useSearchParams() ;
  
  useEffect(() => {
    if (username) {
      const readbleHandle = decodeURIComponent(String(username)) ;
      setdecodedHandle(readbleHandle);
    }
    if (searchparam.get('section')) {
      const targetNav = NavOptions.find((option) =>  option.value === searchparam.get('section') )
      targetNav && setactiveNav(targetNav) ;
    }
  }, [])

  const handleChangeFilterState = (category:string) : void => { 
    if (category !== currentFilter) setcurrentFilter(category) ;
   } 

   // fetching essential data...
   async function getPageEssentialData(postId : string , username:string) {
    try {
      const essentialApi = await axiosInstance.post('/api/post/essentials',{ postId , username }) ;
      if (essentialApi.status == 200) {

      }
    } catch (error) {
      
    }
   }

   // useffect for getting page essential data...
   useEffect(() => {
    async function fetchPostData() {
      const response = await axiosInstance.post('/api/post/essentials', { postId: String(postId),username: String(username) });
      if (response.status == 200) {
        setPOST(response.data.mainPost);
        setUserInfo(response.data.releventAcc);
        setWhoToFollow(response.data.suggestions);
      }
    }

    // await fetchPostData() 
   }, [postId, username])
   
  
  return (
    <>
    <div className='h-fit flex flex-col-reverse md:flex-row gap-1 md:ml-72 font-poppins rounded-md p-2 dark:bg-black'>
      <div className='mainSection h-full flex-2 rounded-md'>
        <div>
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
               <div className='flex items-center gap-1 border border-gray-600 dark:border-gray-500 rounded-full p-2 font-semibold cursor-pointer'>
                <span className="p-2 hover:bg-yellow-100 dark:hover:bg-gray-950 rounded-full transition-colors cursor-pointer">
                  <UserCheck className="w-4 h-4" />
                </span>
                  <Link href={`/@${UserInfo.decodedHandle}/mutual-accounts`} className="p-2 hover:bg-yellow-100 dark:hover:bg-gray-950 rounded-full transition-colors">
                    <CommandIcon className="w-4 h-4" />
                  </Link>
                <span className="p-2 hover:bg-yellow-100 dark:hover:bg-gray-950 rounded-full transition-colors">
                  <MessageSquare className="w-4 h-4" />
                </span>    
               </div>
                <button 
                 onClick={() => { setopenFilter(!openFilter)}}
                 className='p-2 relative rounded-full cursor-pointer dark:hover:bg-gray-950 hover:bg-yellow-100 transition-all duration-300'>
                  <FilterIcon />
                  { openFilter && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.1, ease: "easeOut" }}
                      className='absolute w-44 h-fit top-13 right-5 border border-gray-300 dark:border-gray-900 rounded-lg bg-white dark:bg-black shadow-xl dark:shadow-gray-950 overflow-y-auto'>
                      <ul className='p-2 space-y-1'>
                        <li
                        onClick={() => { handleChangeFilterState('Relevency') }}
                        className='px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-950 rounded-md cursor-pointer text-sm flex items-center gap-2'><Target className="w-4 h-4 mr-2" /><span>Relevancy</span><Check className={`w-4 h-4 ${currentFilter === 'Relevency' ? 'opacity-100 stroke-3' : 'opacity-0'}`} /></li>
                        <li
                        onClick={() => { handleChangeFilterState('Most Liked') }}
                        className='px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-950 rounded-md cursor-pointer text-sm flex items-center gap-2'><Heart className="w-4 h-4 mr-2" /><span>Most Liked</span><Check className={`w-4 h-4 ${currentFilter === 'Most Liked' ? 'opacity-100 stroke-3' : 'opacity-0'}`} /></li>
                        <li
                        onClick={() => { handleChangeFilterState('Newest') }}
                        className='px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-950 rounded-md cursor-pointer text-sm flex items-center gap-2'><Clock className="w-4 h-4 mr-2" /><span>Newest</span><Check className={`w-4 h-4 ${currentFilter === 'Newest' ? 'opacity-100 stroke-3' : 'opacity-0'}`} /></li>
                        <li
                        onClick={() => { handleChangeFilterState('Oldest') }}
                        className='px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-950 rounded-md cursor-pointer text-sm flex items-center gap-2'><Archive className="w-4 h-4 mr-2" /><span>Oldest</span><Check className={`w-4 h-4 ${currentFilter === 'Oldest' ? 'opacity-100 stroke-3' : 'opacity-0'}`} /></li>
                        <li
                        onClick={() => { handleChangeFilterState('Following') }}
                        className='px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-950 rounded-md cursor-pointer text-sm flex items-center gap-2'><Users className="w-4 h-4 mr-2" /><span>Following</span><Check className={`w-4 h-4 ${currentFilter === 'Following' ? 'opacity-100 stroke-3' : 'opacity-0'}`} /></li>
                      </ul>
                    </motion.div>
                  )}
                </button>
              </div>
            </div>
          </header>
        </div>
        {POST && (
          <PostCard 
            postId={POST.id || String(postId)}
            content={POST.content}
            timestamp={POST.postedAt}
            replies={POST.comments}
            reposts={POST.reposts}
            likes={POST.likes}
            views={POST.views}
            media={POST.mediaUrls}
            hashTags={POST.hashTags}
            mentions={POST.mentions}
            userliked={POST.userliked}
            usereposted={POST.usereposted}
            usercommented={POST.usercommented}
            userbookmarked={POST.userbookmarked}
            username={POST.username}
            handle={POST.handle}
            avatar={POST.avatar}
            cover={POST.cover}
            bio={POST.bio}
            isVerified={POST.isVerified}
            followers={POST.followers}
            following={POST.following}
            isFollowing={POST.isFollowing}
            isHighlighted={POST.isHighlighted}
            isPinned={POST.isPinned}
            taggedLocation={POST.taggedLocation}
            poll={POST.poll}
            fromPage={pageCategory}
          />
        )}
        {!POST && (
          <PostCard postId={String(postId)} fromPage={pageCategory} />
        )}
        <nav className='border-b border-gray-400 shadow-sm rounded-lg'>
         <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-2">      
           <ul className="hidden md:flex items-center gap-6">
             {NavOptions.map((option, index) => (
               <li
                 key={index}
                 onClick={() => { setactiveNav(option) }}
                 className={`relative text-gray-700 rounded-t-lg dark:text-gray-200 font-medium text-[15px] cursor-pointer px-3 py-1 rounded-md transition-all duration-300 hover:bg-yellow-100 dark:hover:bg-blue-950/20 hover:text-yellow-500 dark:hover:text-blue-500 group ${activeNav.value === option.value ? 'bg-yellow-100 text-yellow-500 dark:text-blue-500 dark:bg-blue-950/20' : ''}`}
               >
                 {option.value}
                 <span className="absolute rounded-full left-0 bottom-0 w-0 h-[2px] bg-yellow-500 dark:bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
               </li>
             ))}
           </ul>
         </div>
       </nav>
        <div className='renderingSec my-1 rounded-lg h-full'>
          {(activeNav.value === 'All' || activeNav.value === 'Metric') && (
            <>
            <div className='rounded-lg flex items-center gap-3 px-4 py-3 text-xl font-semibold shadow-md bg-yellow-50 dark:bg-blue-950/10 border-l-4 border-yellow-400 dark:border-blue-500 text-gray-900 dark:text-white'>
              <TrendingUp className="w-6 h-6 text-yellow-500 dark:text-blue-400" />
              All Records
            </div>
              <PostMetricsPage postId={String(postId)} />
            </>
          )}
          {(activeNav.value === 'All' || activeNav.value === 'Bookmark') && (
            <>
            <div className='rounded-lg flex items-center gap-3 px-4 py-3 my-5 text-xl font-semibold shadow-md bg-yellow-50 dark:bg-blue-950/10 border-l-4 border-yellow-400 dark:border-blue-500 text-gray-900 dark:text-white'>
              <Bookmark className="w-6 h-6 text-yellow-500 dark:text-blue-400" />
              Bookmarked By
            </div>
            {bookmarkUsers.map((user, index) => (
              <Usercard key={index} {...user} />
            ))}
             <div>
               <button className='flex items-center justify-center gap-2 p-3 my-2 mx-1 w-full rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 dark:from-blue-500 dark:to-blue-600 text-white font-semibold hover:scale-95 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer'>
                 Load More
                 <ChevronDown className="w-4 h-4 stroke-3" />
               </button>
             </div>
            </>
          )}
          {(activeNav.value === 'All' || activeNav.value === 'Comments') && (
            <>
            <div className='rounded-lg flex items-center gap-3 px-4 py-3 my-5 text-xl font-semibold shadow-md bg-yellow-50 dark:bg-blue-950/10 border-l-4 border-yellow-400 dark:border-blue-500 text-gray-900 dark:text-white'>
              <MessageSquare className="w-6 h-6 text-yellow-500 dark:text-blue-400" />
              Commented By
            </div>
            {Comments.map((comment, index) => (
              <PostCard key={index} {...comment} />
            ))}
            <div className='space-y-4'>
                    <div className='space-y-6'>
                      {RepliedPosts.map((post: RepliedPostsType) => (
                        <div key={post.id} className="dark:bg-black rounded-xl p-4 border border-gray-200 dark:border-gray-900 transition-shadow">
                          <div className="flex space-x-3">
                            <img
                              src={post.avatar}
                              className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-3">
                                <span className="font-bold text-sm">{post.name}</span>
                                {post.isVerified && (
                                  <Image src='/images/yellow-tick.png' width={20} height={20} alt='blue-tick' />
                                )}
                                <span className="text-gray-500 dark:text-gray-400 text-sm">@{post.username}</span>
                                <span className="text-gray-500 dark:text-gray-400 text-sm">·</span>
                                <span className="text-gray-500 dark:text-gray-400 text-sm">{post.repliedAt}</span>
                              </div>
                              <div className="space-y-3">
                                <Link href={`/@${post.postAuthorInfo.username}/post/${post.postId}`} className="text-blue-500 hover:underline text-sm inline-block">Replied to post</Link>
                                <div className="ml-4 border-l-2 rounded-md border-gray-300 dark:border-gray-600 pl-4">
                                <PostCard
                                    postId={post.id}
                                    avatar={post.postAuthorInfo.avatar}
                                    cover={post.postAuthorInfo.banner}
                                    username={post.postAuthorInfo.name}
                                    handle={post.postAuthorInfo.username}
                                    followers={post.postAuthorInfo.followers}
                                    following={post.postAuthorInfo.following}
                                    bio={post.postAuthorInfo.bio}
                                    isVerified={post.postAuthorInfo.isVerified}
                                    timestamp={post.postAuthorInfo.postedAt}
                                    content={post.postAuthorInfo.content}
                                    hashTags={post.postAuthorInfo.hashTags}
                                    mentions={post.postAuthorInfo.mentions}
                                    media={post.postAuthorInfo.media}
                                    likes={0}
                                    reposts={0}
                                    replies={0}
                                    views={0}
                                    shares={0}
                                    showActions={false}
                                    fromPage={pageCategory}
                                    taggedLocation={undefined}
                                    poll={undefined}
                                  />
                                </div>
                                <PostCard
                                  postId={post.id}
                                  avatar={post.avatar}
                                  username={post.name}
                                  handle={post.username}
                                  timestamp={post.repliedAt}
                                  content={post.commentedText}
                                  likes={post.likes}
                                  reposts={post.reposts}
                                  replies={post.comments}
                                  views={post.views}
                                  shares={0}
                                  userliked={post.userliked}
                                  usereposted={post.usereposted}
                                  usercommented={post.usercommented}
                                  userbookmarked={post.userbookmarked}
                                  followers={post.followers}
                                  following={post.following}
                                  bio={post.bio}
                                  isVerified={post.isVerified}
                                  media={post.media}
                                  hashTags={post.hashTags}
                                  mentions={post.mentions}
                                  isPinned={post.isPinned}
                                  isHighlighted={post.isHighlighted}
                                  isFollowing={false}
                                  readOnly={true}
                                  fromPage={pageCategory}
                                  taggedLocation={undefined}
                                  poll={undefined}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
             <div>
               <button className='flex items-center justify-center gap-2 p-3 my-2 mx-1 w-full rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 dark:from-blue-500 dark:to-blue-600 text-white font-semibold hover:scale-95 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer'>
                 Load More
                 <ChevronDown className="w-4 h-4 stroke-3" />
               </button>
             </div>
            </>
          )}
          {(activeNav.value === 'All' || activeNav.value === 'Views') && (
            <>
            <div className='rounded-lg flex items-center gap-3 px-4 py-3 my-5 text-xl font-semibold shadow-md bg-yellow-50 dark:bg-blue-950/10 border-l-4 border-yellow-400 dark:border-blue-500 text-gray-900 dark:text-white'>
              <Eye className="w-6 h-6 text-yellow-500 dark:text-blue-400" />
              Viewed By
            </div>
            {viewedUsers.map((user, index) => (
              <Usercard key={index} {...user} />
            ))}
             <div>
               <button className='flex items-center justify-center gap-2 p-3 my-2 mx-1 w-full rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 dark:from-blue-500 dark:to-blue-600 text-white font-semibold hover:scale-95 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer'>
                 Load More
                 <ChevronDown className="w-4 h-4 stroke-3" />
               </button>
             </div>
            </>
          )}
          {(activeNav.value === 'All' || activeNav.value === 'Likes') && (
            <>
            <div className='rounded-lg flex items-center gap-3 px-4 py-3 my-5 text-xl font-semibold shadow-md bg-yellow-50 dark:bg-blue-950/10 border-l-4 border-yellow-400 dark:border-blue-500 text-gray-900 dark:text-white'>
              <Heart className="w-6 h-6 text-yellow-500 dark:text-blue-400" />
              Liked By
            </div>
            {likedUsers.map((user, index) => (
              <Usercard key={index} {...user} />
            ))}
             <div>
               <button className='flex items-center justify-center gap-2 p-3 my-2 mx-1 w-full rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 dark:from-blue-500 dark:to-blue-600 text-white font-semibold hover:scale-95 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer'>
                 Load More
                 <ChevronDown className="w-4 h-4 stroke-3" />
               </button>
             </div>
            </>
          )}
        </div>
      </div>
      <div className='rightContainer h-full flex-1 flex flex-col gap-2 bg-white dark:bg-black rounded-lg p-2'>
         <Usercard decodedHandle={UserInfo.decodedHandle} account={UserInfo.account} IsFollowing={UserInfo.IsFollowing} name={UserInfo.name} content={null} heading={<h2 className="text-lg font-semibold">Relevant people</h2>}/>
           <div className='bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm'>
                <div className='p-4 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center'>
                     <h2 className='text-xl font-bold text-gray-900 dark:text-white'>What's happening</h2>
                    <svg className='h-5 w-5 text-gray-500 dark:text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />
                            </svg>
                </div>
                <div className='p-3 space-y-2'>
                            <TrendingCard
                               id={1}
                               trendName="#TechInnovation"
                               postCount="45.2K"
                               category="Technology"
                               iconType="trending"
                               gradientFrom="from-blue-500"
                               gradientTo="to-cyan-500"
                             />
                             <TrendingCard
                               id={2}
                               trendName="#ClimateAction"
                               postCount="28.7K"
                               category="Trending"
                               iconType="flame"
                               gradientFrom="from-orange-500"
                               gradientTo="to-red-500"
                             />
                             <TrendingCard
                               id={3}
                               trendName="#Gaming"
                               postCount="156K"
                               category="Gaming"
                               iconType="gamepad"
                               gradientFrom="from-purple-500"
                               gradientTo="to-pink-500"
                             />
                             <TrendingCard
                               id={4}
                               trendName="#Business"
                               postCount="89.3K"
                               category="Business"
                               iconType="briefcase"
                               gradientFrom="from-green-500"
                               gradientTo="to-emerald-500"
                             />
                        </div>
                        <div className='p-3 border-t flex items-center justify-between border-gray-200 dark:border-gray-700'>
                  <Link href={`/explore?q=${encodeURIComponent('trend-nowdays')}&utm_source=show-more`} className='cursor-pointer text-blue-500 rounded-full hover:bg-blue-100 p-2 hover:text-blue-600 text-sm font-medium transition-colors'>
                    Show more
                  </Link>
                </div>
                    </div>
                  <div className='relative bg-white dark:bg-black rounded-xl shadow-lg'>
                     <div className='p-4 m-2 border-b rounded-md flex gap-2 items-center borderdark:border-gray-700'>
                      <Users size={20} /><h2 className='text-xl font-bold text-gray-900 dark:text-white'>Suggestions</h2>
                    </div>
                     <div className='p-4'>
                      {whoToFollow.map((user, index) =>
                         index < suggesstionNum && (
                          <div key={index} className='flex items-center justify-between mb-2'>
                            <Usercard {...user} content={null} />
                          </div>
                         )
                      )}
                     </div>
                    <div className='p-2 m-2 rounded-md border-t border-gray-200 dark:border-gray-700'>
                      <button 
                        onClick={() => { handleSuggesstionShow() }}
                        className='cursor-pointer hover:bg-blue-100 dark:hover:bg-gray-950 p-2 rounded-full text-blue-500 hover:text-blue-600 text-sm font-medium'>
                        { ShowLess ? 'Show less' : 'Show more' }
                      </button>
                     </div>
                  </div>
      </div>
    </div>
    </>
  )
}
