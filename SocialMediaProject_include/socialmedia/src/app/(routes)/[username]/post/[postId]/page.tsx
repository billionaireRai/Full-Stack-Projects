'use client'

import React, { useState , useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useParams } from 'next/navigation'
import { FilterIcon, Target, Heart, Clock, Archive, Users, Check, Flame, TrendingUp, Gamepad2, Briefcase, MoreHorizontal as MoreHorizontalIcon, User, Eye, MessageSquare, Bookmark, ChevronDown, ArrowDownUp , Shuffle ,Share2, UserPlusIcon, UserCheck, CommandIcon, Reply } from 'lucide-react'
import { FiSearch } from "react-icons/fi";
import { motion } from 'framer-motion'
import PostCard from '@/components/postcard'
import Commentpopcard from '@/components/Commentpopcard'
import TrendingCard from '@/components/trendingcard'
import Usercard from '@/components/usercard'
import PostMetricsPage from '@/components/postmetrics'
import { PostCardProps } from '@/components/postcard'
import { accountInfoType, userCardProp } from '@/components/usercard'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import axiosInstance from '@/lib/interceptor'
import { getPostByIdService } from '@/app/db/services/post'
import toast from 'react-hot-toast'


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
    isVerified:boolean,
    plan?: string
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
    isPinned:boolean;
    plan:string;
    isFollowing:boolean;
    isHighlighted:boolean;
    likes: number;
    reposts: number;
    replies: number;
    views: number;
    shares: number;
    userliked: boolean;
    usereposted: boolean;
    usercommented: boolean;
    userbookmarked: boolean;
    avatar: string;
    banner: string;
    media: mediaType[];
    mentions: string[];
    hashTags: string[];
    content: string;
    postedAt: string;
    taggedLocation?: locationTaggedType[];
    poll?: pollInfoType;
  };
  // Reply author info at outer level - the user who replied to the comment
  name: string;
  username: string;
  followers: string;
  following: string;
  bio: string;
  isVerified: boolean;
  plan:string;
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
  const pagesize = useRef(15) ; // on every loadmore...
  // states for pagination functionality...
  const [bookmarkpage, setbookmarkpage] = useState<number>(1);
  const [commentpage, setcommentpage] = useState<number>(1);
  const [repliespage, setrepliespage] = useState<number>(1);
  const [viewspage, setviewspage] = useState<number>(1);
  const [likespage, setlikespage] = useState<number>(1);
  const [hasbookmark, sethasbookmark] = useState<boolean>(true);
  const [hascomment, sethascomment] = useState<boolean>(true);
  const [hasreplies, sethasreplies] = useState<boolean>(true);
  const [hasviews, sethasviews] = useState<boolean>(true);
  const [haslikes, sethaslikes] = useState<boolean>(true);
  const pageCategory : "feed" | "profile" | "direct" | "explore" = "direct" ;
  const [decodedHandle, setdecodedHandle] = useState<string | null>(null) ;
  const [openFilter, setopenFilter] = useState<boolean>(false) ;
  const [currentFilter, setcurrentFilter] = useState<string>('Relevency');
  const [PostInfo, setPostInfo] = useState<PostType | null>(null);
  const [CommentCardProp, setCommentCardProp] = useState<boolean>(false) ;
  const [hpninPopUp, sethpninPopUp] = useState<number>(0);
  const [activeNav, setactiveNav] = useState<navOptionsType>({ label:'metric',value:'Metric'}) ;
  const [ShowLess, setShowLess] = useState<boolean>(false);
  const [suggesstionNum, setsuggesstionNum] = useState<number>(3);
  const filterArr = [
    { icon: Target, label: 'Relevancy', value: 'Relevency' },
    { icon: Heart, label: 'Most Liked', value: 'Most Liked' },
    { icon: Clock, label: 'Newest', value: 'Newest' },
    { icon: Archive, label: 'Oldest', value: 'Oldest' },
    { icon: Users, label: 'Following', value: 'Following' }
  ]

  const [NavOptions, setNavOptions] = useState<navOptionsType[]>([
    { label: 'metric', value: 'Metric' },
    { label: 'bookmark', value: 'Bookmark' },
    { label: 'comments', value: 'Comments' },
    { label:'replies' , value:'Replies'},
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
      isPinned:true,
      isHighlighted:false,
      usereposted:true,
      usercommented:false,
      userbookmarked:false,
      username: "Amritansh Rai",
      handle: "@amritansh_coder",
      avatar: "https://picsum.photos/seed/avatar1/200/200",
      cover: "https://picsum.photos/seed/cover1/1500/500",
      bio: "Full-stack developer | React enthusiast | Building the future one commit at a time.",
      isVerified: true,
      plan:'Pro',
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
        decodedHandle: '@alice_dev',
        name: 'Alice Developer',
        IsFollowing: true,
        account: {
          name: 'Alice Developer',
          handle: '@alice_dev',
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
          plan:'Pro',
          bannerUrl: '/images/default-banner.jpg',
          avatarUrl: '/images/default-profile-pic.png'
        }
      },
      {
        decodedHandle: '@bob_designer',
        name: 'Bob Designer',
        IsFollowing: false,
        account: {
          name: 'Bob Designer',
          handle: '@bob_designer',
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
          isVerified: true,
          plan:'Pro',
          bannerUrl: '/images/default-banner.jpg',
          avatarUrl: '/images/default-profile-pic.png'
        }
      },
      {
        decodedHandle: '@charlie_writer',
        name: 'Charlie Writer',
        IsFollowing: false,
        account: {
          name: 'Charlie Writer',
          handle: '@charlie_writer',
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
          isVerified: false,
          plan:'Free',
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

const [Comments, setComments] = useState<PostType[]>([
    {
      id: 'cmt-456',
      content: 'This looks stunning! Great capture @sarah_nature #photography #sunsetvibes',
      postedAt: 'Oct 3, 2023 2:15 PM',
      comments: 3,
      reposts: 12,
      likes: 67,
      views: 1450,
      mediaUrls: [{ url: 'https://picsum.photos/seed/comment3/450/300', media_type: 'image' }],
      hashTags: ['photography', 'sunsetvibes', 'naturelove'],
      mentions: ['sarah_nature'],
      userliked: true,
      usereposted: false,
      usercommented: false,
      userbookmarked: false,
      username: 'Mike Photographer',
      handle: '@mike_photo',
      avatar: 'https://picsum.photos/seed/avatar3/200/200',
      cover: 'https://picsum.photos/seed/cover3/1500/500',
      bio: 'Professional photographer capturing moments in nature 🌅',
      isVerified: true,
      plan:'Pro',
      followers: '25.8k',
      following: '1.2k',
      isFollowing:true ,
      isPinned:false ,
      userBookmarked:true,
      isHighlighted:false,
      poll:undefined,
      taggedLocation:undefined
    },
    {
      id: 'cmt-789',
      content: 'Love the colors! Where was this taken?',
      postedAt: 'Oct 3, 2023 4:30 PM',
      comments: 1,
      reposts: 3,
      likes: 45,
      views: 890,
      mediaUrls: [],
      hashTags: ['sunset'],
      mentions: [],
      userliked: false,
      usereposted: false,
      usercommented: true,
      userbookmarked: true,
      username: 'Travel Lover',
      handle: '@travelwithjane',
      avatar: 'https://picsum.photos/seed/avatar4/200/200',
      cover: 'https://picsum.photos/seed/cover4/1500/500',
      bio: 'Exploring the world one sunset at a time ✈️🌍',
      isVerified: false,
      plan:'Free',
      followers: '8.7k',
      following: '456',
      isFollowing:false ,
      isPinned:true ,
      userBookmarked:false,
      isHighlighted:false,
      poll:undefined,
      taggedLocation:undefined
    }
  ])

  const [RepliedPosts, setRepliedPosts] = useState<RepliedPostsType[]>([
  {
      id: "4",
      postId: '4224',
      postAuthorInfo: {
        name: "Sarah Tech",
        username: "@sarah_dev",
        followers:'120k',
        following:'89',
        bio:'Full-stack developer | Open source contributor',
        isVerified: false,
        plan:'Free',
        isFollowing: false,
        isPinned: false,
        isHighlighted: false,
        likes: 123,
        reposts: 45,
        replies: 12,
        views: 1000,
        shares: 23,
        userliked: false,
        usereposted: false,
        usercommented: true,
        userbookmarked: false,
        avatar: "/images/default-profile-pic.png",
        banner:'https://picsum.photos/seed/cover-sarah/1500/500',
        media: [{url: 'https://picsum.photos/seed/tutorial/450/300', media_type: 'image'}],
        mentions:['techcommunity'],
        hashTags:['Coding','JavaScript','React'],
        content: "Check out my latest tutorial on building scalable React applications! 🚀 #NextJS #Development",
        postedAt: "5d ago",
        taggedLocation: [],
        poll: undefined
      },
      commentedText: "Great tutorial! Really helped me understand the concepts better. 👍 Thanks @sarah_dev #React #Tutorial",
      name: "James Clear",
      username: "@jamesclear__",
      followers:'10k',
      following:'89',
      bio:'A CEO, founder of multiple tech companies... Building the future of tech.',
      isVerified: true,
      plan:'Pro',
      avatar: "https://picsum.photos/seed/james/200/200",
      banner:'https://picsum.photos/seed/banner-james/1500/500',
      media: [{url: 'https://picsum.photos/seed/comment/450/300', media_type: 'image'}],
      mentions:['sarah_dev'],
      hashTags:['React','Tutorial','Development'],
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

  const [bookmarkAccs,setbookmarkAccs] = useState<userCardProp[]>([
    {
      decodedHandle: '@johndoe',
      name: 'John Doe',
      IsFollowing: false,
      account: {
        name: 'John Doe',
        handle: '@johndoe',
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
        plan:'Pro',
        isCompleted: true,
        bannerUrl: '/images/signup-banner.png',
        avatarUrl: '/images/myProfile.jpg'
      }
    }
  ]);

  const [viewedAccs,setviewedAccs] = useState<userCardProp[]>([
    {
      decodedHandle: '@alicej',
      name: 'Alice Johnson',
      IsFollowing: true,
      account: {
        name: 'Alice Johnson',
        handle: '@alicej',
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
        isVerified: false,
        plan:'Free',
        isCompleted: true,
        bannerUrl: '/images/signup-banner.png',
        avatarUrl: '/images/myProfile.jpg'
      }
    }
  ]);

  const [likedAccs,setlikedAccs] = useState<userCardProp[]>([
    {
      decodedHandle: '@charlieb',
      name: 'Charlie Brown',
      IsFollowing: false,
      account: {
        name: 'Charlie Brown',
        handle: '@charlieb',
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
        plan:'Pro',
        isCompleted: true,
        bannerUrl: '/images/signup-banner.png',
        avatarUrl: '/images/myProfile.jpg'
      }
    }
  ]);

  // account information of this page...
  const [AccInfo, setAccInfo] = useState<userCardProp>(
    {
      id:'2BVFT^YVU*(0',
      decodedHandle: '@jhondoe',
      name: 'Jhon Doe',
      IsFollowing: true,
      account: {
        name: 'Jhon Doe',
        handle: '@jhondoe',
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
        plan: 'Pro',
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
   

   // useffect for getting page essential data...
   useEffect(() => {
    async function fetchPostData() {
      const response = await axiosInstance.post('/api/post/essentials', { postId: String(postId),username: String(username) });
      if (response.status == 200) {
        setPOST(response.data.mainPost);
        setAccInfo(response.data.releventAcc);
        setWhoToFollow(response.data.suggestions);
      }
    }

    // await fetchPostData() 
   }, [postId, username])

   // standard function for getting Nav specific data...
   async function fetchingNavSpecificData(ArrUpdater:React.Dispatch<React.SetStateAction<userCardProp[]>>,stateUpdater:React.Dispatch<React.SetStateAction<boolean>>,postid:string,apiEndpoint:string,pagenum:number) {
    try {
      const apiResponse = await axiosInstance.get(`${apiEndpoint}?postid=${postid}&page=${pagenum}&size=${pagesize.current}`);
      if (apiResponse.status === 200)  { 
        ArrUpdater(apiResponse.data.navdata);
        stateUpdater(apiResponse.data.hasNext);
      }
    } catch (error) {
      console.log(error);
      toast.error('An error occured...')
    }
   }

   // function getting comments and likes...
   async function getAllCommentsOfPost() {
    try {
      const apiResponse = await axiosInstance.get(`/api/post/comment?postid=${postId}&page=${commentpage}&size=${pagesize.current}`);
      if (apiResponse.status === 200)  {
        setComments(apiResponse.data.comments);
        sethascomment(apiResponse.data.hasNext);
      }
    } catch (error) {
      console.log(error);
      toast.error('An error occured...')
    }
   }

   // getting the bookmarks...
   useEffect(() => {
    // fetchingNavSpecificData(setbookmarkUsers,sethasbookmark,String(postId),'/api/post/bookmarks',bookmarkpage);
   }, [bookmarkpage,pagesize])

   // getting the views...
   useEffect(() => {
  //  fetchingNavSpecificData(setviewedUsers,sethasviews,String(postId),'/api/post/views',viewspage);
   }, [viewspage,pagesize])

   // getting all the likes
   useEffect(() => {
  //  fetchingNavSpecificData(setlikedUsers,sethaslikes,String(postId),'/api/post/likes',likespage);
   }, [likespage,pagesize])
 
   // getting all the comments...
   useEffect(() => {
    // getAllCommentsOfPost() ;
   }, [commentpage,pagesize])

   // getting all the replies..
   useEffect(() => {

   }, [repliespage,pagesize])
   
   
// function handling reversing post order...
  function handleReversePostOrder<T>(arr: T[], stateUpdater: React.Dispatch<React.SetStateAction<T[]>>) {
    const reversedOrder = [...arr].reverse();
    stateUpdater(reversedOrder);
  }

// function handling shuffling posts...
  function handleShufflePosts<T>(arr: T[], stateUpdater: React.Dispatch<React.SetStateAction<T[]>>) {
    const shuffledPosts = [...arr].sort(() => Math.random() - 0.5);
    stateUpdater(shuffledPosts);
  }

  
  return (
    <>
    <div className='h-fit flex flex-col-reverse md:flex-row gap-1 font-poppins rounded-md p-2 dark:bg-black'>
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
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="hover:bg-yellow-100 dark:hover:bg-gray-950 rounded-full transition-colors cursor-pointer p-2">
                      <UserCheck className="w-4 h-4" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    Verified accounts
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href={`/${AccInfo.decodedHandle}/mutual-accounts`} className="p-2 hover:bg-yellow-100 dark:hover:bg-gray-950 rounded-full transition-colors">
                      <CommandIcon className="w-4 h-4" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    See mutual accounts
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                   <span 
                    onClick={() => { setCommentCardProp(true) }}
                    className="p-2 hover:bg-yellow-100 dark:hover:bg-gray-950 rounded-full transition-colors">
                      <MessageSquare className="w-4 h-4" />
                   </span>    
                  </TooltipTrigger>
                  <TooltipContent>
                    Comment on post
                  </TooltipContent>
                </Tooltip>
               </div>
                <button 
                 onClick={() => { setopenFilter(!openFilter)}}
                 className='p-2 relative rounded-full cursor-pointer dark:hover:bg-gray-950 hover:bg-yellow-100 transition-all duration-300'>
                  <FilterIcon size={16} />
                  { openFilter && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }} 
                      className='absolute w-45 h-fit -top-5 right-10 border border-gray-300 dark:border-gray-900 rounded-lg bg-white dark:bg-black shadow-xl dark:shadow-gray-950 overflow-y-auto'>

                      <ul className='p-2 space-y-1'>
                        {filterArr.map((filter) => (
                          <li
                            key={filter.value}
                            onClick={() => handleChangeFilterState(filter.value)}
                            className='px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-950 rounded-md cursor-pointer text-sm flex items-center gap-2'
                          >
                            <filter.icon className="w-4 h-4 mr-2" />
                            <span>{filter.label}</span>
                            <Check className={`w-4 h-4 ${currentFilter === filter.value ? 'opacity-100 stroke-2 text-green-500' : 'opacity-0'}`} />
                          </li>
                        ))}
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
            avatar={POST.avatar}
            cover={POST.cover}
            username={POST.username}
            handle={POST.handle}
            bio={POST.bio}
            timestamp={POST.postedAt}
            content={POST.content}
            likes={POST.likes}
            reposts={POST.reposts}
            replies={POST.comments}
            views={POST.views}
            shares={0}
            media={POST.mediaUrls}
            hashTags={POST.hashTags}
            mentions={POST.mentions}
            userliked={POST.userliked}
            usereposted={POST.usereposted}
            usercommented={POST.usercommented}
            userbookmarked={POST.userbookmarked}
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
          {(activeNav.value === 'Metric') && (
            <>
            <div className='rounded-lg flex items-center gap-3 px-4 py-3 text-xl font-semibold shadow-md bg-yellow-50 dark:bg-blue-950/10 border-l-4 border-yellow-400 dark:border-blue-500 text-gray-900 dark:text-white'>
              <TrendingUp className="w-6 h-6 text-yellow-500 dark:text-blue-400" />
              Post Analytics
            </div>
            <div>
              <PostMetricsPage postId={String(postId)} />
            </div>
            </>
          )}
          {( activeNav.value === 'Bookmark') && (
            <>

            <div className='rounded-lg flex items-center justify-between gap-3 px-4 py-3 my-5 text-xl font-semibold shadow-md bg-yellow-50 dark:bg-blue-950/10 border-l-4 border-yellow-400 text-gray-900 dark:text-white'>
              <div className='flex items-center gap-2'>
                <Bookmark className="w-6 h-6 text-yellow-500" />
                <span>Bookmarked By</span>
              </div>
              <div className='flex items-center gap-1'>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                    onClick={() => { handleReversePostOrder(bookmarkAccs,setbookmarkAccs) }}
                    type="button" className='cursor-pointer p-2 rounded-full hover:bg-yellow-100 dark:hover:bg-gray-950'>
                      <ArrowDownUp/>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Reverse post order</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                    onClick={() => { handleShufflePosts(bookmarkAccs,setbookmarkAccs) }}
                    type="button" className='cursor-pointer p-2 rounded-full hover:bg-yellow-100 dark:hover:bg-gray-950'>
                     <Shuffle/>
                   </button>
                  </TooltipTrigger>
                  <TooltipContent>Shuffle posts</TooltipContent>
                </Tooltip>
              </div>
            </div>

            {bookmarkAccs?.map((acc, index) => (
              <Usercard key={index} {...acc} />
            )) || null}
             <div className='flex items-center justify-center'>
               <button 
               disabled={!hasbookmark}
               onClick={() => { setbookmarkpage(bookmarkpage + 1) }}
               className='flex items-center justify-center gap-2 p-3 my-2 mx-1 w-fit rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold hover:scale-95 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer'>
                 <ChevronDown className="w-4 h-4" />
               </button>
             </div>
            </>
          )}
          {(activeNav.value === 'Comments') && (
            <>

            <div className='rounded-lg flex items-center justify-between gap-3 px-4 py-3 my-5 text-xl font-semibold shadow-md bg-yellow-50 dark:bg-blue-950/10 border-l-4 border-yellow-400 text-gray-900 dark:text-white'>
              <div className='flex items-center gap-2'>
                <MessageSquare className="w-6 h-6 text-yellow-500" />
                <span>Commented By</span>
              </div>
              <div className='flex items-center gap-1'>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                    onClick={() => { handleReversePostOrder(Comments,setComments) }}
                    type="button" className='cursor-pointer p-2 rounded-full hover:bg-yellow-100 dark:hover:bg-gray-950'>
                      <ArrowDownUp/>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Reverse post order</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                    onClick={() => { handleShufflePosts(Comments,setComments) }}
                    type="button" className='cursor-pointer p-2 rounded-full hover:bg-yellow-100 dark:hover:bg-gray-950'>
                     <Shuffle/>
                   </button>
                  </TooltipTrigger>
                  <TooltipContent>Shuffle posts</TooltipContent>
                </Tooltip>
              </div>
            </div>

            {Comments?.map((comment, index) => (
              <PostCard 
                key={index}
                postId={comment.id}
                avatar={comment.avatar}
                cover={comment.cover}
                username={comment.username}
                handle={comment.handle}
                bio={comment.bio}
                timestamp={comment.postedAt}
                content={comment.content}
                likes={comment.likes}
                reposts={comment.reposts}
                replies={comment.comments}
                views={comment.views}
                shares={0}
                media={comment.mediaUrls}
                hashTags={comment.hashTags}
                mentions={comment.mentions}
                userliked={comment.userliked}
                usereposted={comment.usereposted}
                usercommented={comment.usercommented}
                userbookmarked={comment.userbookmarked}
                isVerified={comment.isVerified}
                followers={comment.followers}
                following={comment.following}
                isFollowing={comment.isFollowing}
                isHighlighted={comment.isHighlighted}
                isPinned={comment.isPinned}
                plan={comment.plan}
                poll={comment.poll}
                fromPage={pageCategory}
                taggedLocation={comment.taggedLocation}
              />
            )) || null}
            <div className='flex items-center justify-center'>
               <button 
                disabled={!hascomment}
                className='flex items-center justify-center gap-2 p-3 my-2 mx-1 w-fit rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold hover:scale-95 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer'>
                  <ChevronDown className="w-4 h-4" />
               </button>
             </div>
            </>
          )}

            <div className='space-y-4'>
              {(activeNav.value === 'Replies') && (
                <>
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
                                <Link href={`/${post.username}`} className="text-gray-500 dark:text-gray-400 text-sm">{post.username}</Link>
                                <span className="text-gray-500 dark:text-gray-400 text-sm">·</span>
                                <span className="text-gray-500 dark:text-gray-400 text-sm">{post.repliedAt}</span>
                              </div>
                              <div className="space-y-3">
                                <Link href={`/${post.postAuthorInfo.username}/post/${post.postId}`} className="text-blue-500 hover:underline text-sm inline-block">Replied to post</Link>
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
                                    isHighlighted={false}
                                    isPinned={false}
                                    plan={post.postAuthorInfo.plan}
                                    timestamp={post.postAuthorInfo.postedAt}
                                    content={post.postAuthorInfo.content}
                                    likes={post.postAuthorInfo.likes}
                                    reposts={post.postAuthorInfo.reposts}
                                    replies={post.postAuthorInfo.replies}
                                    views={post.postAuthorInfo.views}
                                    hashTags={post.postAuthorInfo.hashTags}
                                    mentions={post.postAuthorInfo.mentions}
                                    media={post.postAuthorInfo.media}
                                    userliked={post.postAuthorInfo.userliked}
                                    usereposted={post.postAuthorInfo.usereposted}
                                    usercommented={post.postAuthorInfo.usercommented}
                                    userbookmarked={post.postAuthorInfo.userbookmarked}
                                    isFollowing={post.postAuthorInfo.isFollowing}
                                    fromPage={pageCategory}
                                    taggedLocation={post.postAuthorInfo.taggedLocation || []}
                                    poll={post.postAuthorInfo.poll}
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
             <div className='flex items-center justify-center'>
               <button 
                disabled={!hasreplies}
                className='flex items-center justify-center gap-2 p-3 my-2 mx-1 w-fit rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold hover:scale-95 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer'>
                 <ChevronDown className="w-4 h-4" />
               </button>
             </div>
                  </>
                )}          
            </div>
          {(activeNav.value === 'Views') && (
            <>

            <div className='rounded-lg flex items-center justify-between gap-3 px-4 py-3 my-5 text-xl font-semibold shadow-md bg-yellow-50 dark:bg-blue-950/10 border-l-4 border-yellow-400 text-gray-900 dark:text-white'>
              <div className='flex items-center gap-2'>
                <Eye className="w-6 h-6 text-yellow-500" />
                <span>Viewed By</span>
              </div>
              <div className='flex items-center gap-1'>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                    onClick={() => { handleReversePostOrder(viewedAccs,setviewedAccs) }}
                    type="button" className='cursor-pointer p-2 rounded-full hover:bg-yellow-100 dark:hover:bg-gray-950'>
                      <ArrowDownUp/>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Reverse post order</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                    onClick={() => { handleShufflePosts(viewedAccs,setviewedAccs) }}
                    type="button" className='cursor-pointer p-2 rounded-full hover:bg-yellow-100 dark:hover:bg-gray-950'>
                     <Shuffle/>
                   </button>
                  </TooltipTrigger>
                  <TooltipContent>Shuffle posts</TooltipContent>
                </Tooltip>
              </div>
            </div>

            {viewedAccs?.map((acc, index) => (
              <Usercard key={index} {...acc} />
            )) || null}
             <div className='flex items-center justify-center'>
              <button 
                disabled={!hasviews}
                className='flex items-center justify-center gap-2 p-3 my-2 mx-1 w-fit rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold hover:scale-95 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer'>
                 <ChevronDown className="w-4 h-4" />
               </button>
             </div>
            </>
          )}
          {(activeNav.value === 'Likes') && (
            <>

            <div className='rounded-lg flex items-center justify-between gap-3 px-4 py-3 my-5 text-xl font-semibold shadow-md bg-yellow-50 dark:bg-blue-950/10 border-l-4 border-yellow-400 text-gray-900 dark:text-white'>
              <div className='flex items-center gap-2'>
                <Heart className="w-6 h-6 text-yellow-500" />
                <span>Liked By</span>
              </div>
              <div className='flex items-center gap-1'>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                    onClick={() => { handleReversePostOrder(likedAccs,setlikedAccs) }}
                    type="button" className='cursor-pointer p-2 rounded-full hover:bg-yellow-100 dark:hover:bg-gray-950'>
                      <ArrowDownUp/>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Reverse post order</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                    onClick={() => { handleShufflePosts(likedAccs,setlikedAccs) }}
                    type="button" className='cursor-pointer p-2 rounded-full hover:bg-yellow-100 dark:hover:bg-gray-950'>
                     <Shuffle/>
                   </button>
                  </TooltipTrigger>
                  <TooltipContent>Shuffle posts</TooltipContent>
                </Tooltip>
              </div>
            </div>

            {likedAccs?.map((acc, index) => (
              <Usercard key={index} {...acc} />
            )) || null}
             <div className='flex items-center justify-center'>
              <button 
               disabled={!haslikes}
               className='flex items-center justify-center gap-2 p-3 my-2 mx-1 w-fit rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold hover:scale-95 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer'>
                 <ChevronDown className="w-4 h-4" />
               </button>
             </div>
            </>
          )}
        </div>
      </div>
      <div className='rightContainer h-full flex-1 flex flex-col gap-2 bg-white dark:bg-black rounded-lg p-2'>
         <Usercard decodedHandle={AccInfo.decodedHandle} account={AccInfo.account} IsFollowing={AccInfo.IsFollowing} name={AccInfo.name} content={null} heading={<h2 className="text-lg font-semibold">Relevant people</h2>}/>
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
    { CommentCardProp && ( <Commentpopcard postId={String(POST?.id)} avatar={POST?.avatar} name={POST?.username} handle={POST?.handle}  timestamp={POST?.postedAt} content={POST?.content} media={POST?.mediaUrls} handleClose={() => { setCommentCardProp(false) }}/> )}
    </>
  )
}
