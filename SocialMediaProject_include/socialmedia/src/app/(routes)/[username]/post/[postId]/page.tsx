'use client'

import React, { useState , useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import { FilterIcon, Target, Heart, Clock, Archive, Users, Check, Flame, TrendingUp, Gamepad2, Briefcase, MoreHorizontal as MoreHorizontalIcon, User, Eye, MessageSquare, Bookmark, ChevronDown } from 'lucide-react'
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

interface innerPostAuthorInfo {
  name: string;
  username: string;
  isVerified: boolean;
  followers:string,
  following:string,
  avatar: string;
  content: string;
  postedAt: string;
}

interface RepliedPostsType {
  id:string,
  postId:string,
  postAuthorInfo:innerPostAuthorInfo,
  commentedText:string,
  mediaUrls:string[],
  hashTags?:string[],
  mentions?:string[],
  repliedAt:string,
  comments:number,
  reposts:number,
  likes:number,
  views:number,
  bookmarks:number
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
  const [activeNav, setactiveNav] = useState<navOptionsType>({ label:'comments',value:'Comments'}) ; // state for handling active navs...
  const [NavOptions, setNavOptions] = useState<navOptionsType[]>([
    { label:'all',value:'All'},
    { label: 'bookmark', value: 'Bookmark' },
    { label: 'metric', value: 'Metric' },
    { label: 'comments', value: 'Comments' },
    { label: 'views', value: 'Views' },
    { label: 'likes', value: 'Likes' }
  ])

  // array holding comments by user...
  const [Comments, setComments] = useState<postInfoType[]>([
    {
      postId: 'comment1',
      avatar: '/images/myProfile.jpg',
      username: 'Alice Johnson',
      handle: 'alicej',
      timestamp: '2h',
      content: 'Great post! I totally agree with your thoughts on this topic.',
      likes: 5,
      retweets: 1,
      replies: 2,
      shares: 0,
      views: 15,
      bookmarked: 1,
      hashTags: ['Tech'],
      mentions: [],
      showActions: true,
      highlighted: false
    },
    {
      postId: 'comment2',
      avatar: '/images/myProfile.jpg',
      username: 'Bob Wilson',
      handle: 'bobw',
      timestamp: '1h',
      content: 'This is really insightful. Thanks for sharing!',
      likes: 8,
      retweets: 2,
      replies: 1,
      shares: 1,
      views: 22,
      bookmarked: 0,
      hashTags: [],
      mentions: ['amritansh_coder'],
      showActions: true,
      highlighted: false
    },
    {
      postId: 'comment3',
      avatar: '/images/myProfile.jpg',
      username: 'Charlie Brown',
      handle: 'charlieb',
      timestamp: '45m',
      content: 'I have a question about this. Can you elaborate more?',
      likes: 3,
      retweets: 0,
      replies: 3,
      shares: 0,
      views: 10,
      bookmarked: 2,
      hashTags: ['Question'],
      mentions: [],
      showActions: true,
      highlighted: false
    },
    {
      postId: 'comment4',
      avatar: '/images/myProfile.jpg',
      username: 'Diana Prince',
      handle: 'dianap',
      timestamp: '30m',
      content: 'Love this! Keep up the good work.',
      likes: 12,
      retweets: 3,
      replies: 0,
      shares: 2,
      views: 35,
      bookmarked: 1,
      hashTags: ['Motivation'],
      mentions: [],
      showActions: true,
      highlighted: false
    },
    {
      postId: 'comment5',
      avatar: '/images/myProfile.jpg',
      username: 'Ethan Hunt',
      handle: 'ethanh',
      timestamp: '20m',
      content: 'This reminds me of a similar experience I had.',
      likes: 6,
      retweets: 1,
      replies: 1,
      shares: 0,
      views: 18,
      bookmarked: 0,
      hashTags: [],
      mentions: [],
      showActions: true,
      highlighted: false
    },
    {
      postId: 'comment6',
      avatar: '/images/myProfile.jpg',
      username: 'Fiona Green',
      handle: 'fionag',
      timestamp: '15m',
      content: 'Excellent point! I never thought about it that way.',
      likes: 9,
      retweets: 2,
      replies: 2,
      shares: 1,
      views: 28,
      bookmarked: 3,
      hashTags: ['Insight'],
      mentions: [],
      showActions: true,
      highlighted: false
    },
    {
      postId: 'comment7',
      avatar: '/images/myProfile.jpg',
      username: 'George King',
      handle: 'georgek',
      timestamp: '10m',
      content: 'Thanks for the information. Very helpful!',
      likes: 7,
      retweets: 1,
      replies: 0,
      shares: 0,
      views: 20,
      bookmarked: 1,
      hashTags: [],
      mentions: [],
      showActions: true,
      highlighted: false
    },
    {
      postId: 'comment8',
      avatar: '/images/myProfile.jpg',
      username: 'Hannah Lee',
      handle: 'hannahl',
      timestamp: '5m',
      content: 'I agree completely. Well said!',
      likes: 4,
      retweets: 0,
      replies: 1,
      shares: 0,
      views: 12,
      bookmarked: 0,
      hashTags: [],
      mentions: [],
      showActions: true,
      highlighted: false
    }
  ])

  // Array of replied posts
  const [RepliedPosts, setRepliedPosts] = useState<RepliedPostsType[]>([
    {
      id: 'reply1',
      postId: 'comment1',
      postAuthorInfo: {
        name: 'Alice Johnson',
        username: 'alicej',
        isVerified: true,
        followers: '150',
        following: '200',
        avatar: '/images/myProfile.jpg',
        content: 'Great post! I totally agree with your thoughts on this topic.',
        postedAt: '2h'
      },
      commentedText: 'Thanks for the feedback! I appreciate your support.',
      mediaUrls: [],
      hashTags: ['Tech'],
      mentions: ['alicej'],
      repliedAt: '1h',
      comments: 2,
      reposts: 1,
      likes: 5,
      views: 15,
      bookmarks: 1
    },
    {
      id: 'reply2',
      postId: 'comment2',
      postAuthorInfo: {
        name: 'Bob Wilson',
        username: 'bobw',
        isVerified: false,
        followers: '180',
        following: '250',
        avatar: '/images/myProfile.jpg',
        content: 'This is really insightful. Thanks for sharing!',
        postedAt: '1h'
      },
      commentedText: 'Glad you found it helpful! What part resonated with you the most?',
      mediaUrls: ['/images/sample.jpg'],
      hashTags: [],
      mentions: ['bobw'],
      repliedAt: '45m',
      comments: 1,
      reposts: 0,
      likes: 8,
      views: 22,
      bookmarks: 0
    },
    {
      id: 'reply3',
      postId: 'comment3',
      postAuthorInfo: {
        name: 'Charlie Brown',
        username: 'charlieb',
        isVerified: true,
        followers: '220',
        following: '400',
        avatar: '/images/myProfile.jpg',
        content: 'I have a question about this. Can you elaborate more?',
        postedAt: '45m'
      },
      commentedText: 'Sure, I\'d be happy to explain further. What specifically would you like to know?',
      mediaUrls: [],
      hashTags: ['Question'],
      mentions: ['charlieb'],
      repliedAt: '30m',
      comments: 3,
      reposts: 0,
      likes: 3,
      views: 10,
      bookmarks: 2
    },
    {
      id: 'reply4',
      postId: 'comment4',
      postAuthorInfo: {
        name: 'Diana Prince',
        username: 'dianap',
        isVerified: false,
        followers: '160',
        following: '350',
        avatar: '/images/myProfile.jpg',
        content: 'Love this! Keep up the good work.',
        postedAt: '30m'
      },
      commentedText: 'Thank you so much! Your encouragement means a lot.',
      mediaUrls: [],
      hashTags: ['Motivation'],
      mentions: ['dianap'],
      repliedAt: '20m',
      comments: 0,
      reposts: 1,
      likes: 12,
      views: 35,
      bookmarks: 1
    },
    {
      id: 'reply5',
      postId: 'comment5',
      postAuthorInfo: {
        name: 'Ethan Hunt',
        username: 'ethanh',
        isVerified: true,
        followers: '300',
        following: '450',
        avatar: '/images/myProfile.jpg',
        content: 'This reminds me of a similar experience I had.',
        postedAt: '20m'
      },
      commentedText: 'That\'s interesting! I\'d love to hear about your experience if you\'d like to share.',
      mediaUrls: [],
      hashTags: [],
      mentions: ['ethanh'],
      repliedAt: '15m',
      comments: 1,
      reposts: 0,
      likes: 6,
      views: 18,
      bookmarks: 0
    },
    {
      id: 'reply6',
      postId: 'comment6',
      postAuthorInfo: {
        name: 'Fiona Green',
        username: 'fionag',
        isVerified: false,
        followers: '180',
        following: '290',
        avatar: '/images/myProfile.jpg',
        content: 'Excellent point! I never thought about it that way.',
        postedAt: '15m'
      },
      commentedText: 'I\'m glad it gave you a new perspective! Thanks for reading.',
      mediaUrls: [],
      hashTags: ['Insight'],
      mentions: ['fionag'],
      repliedAt: '10m',
      comments: 2,
      reposts: 1,
      likes: 9,
      views: 28,
      bookmarks: 3
    }
  ])

  // Array of bookmark users
  const [bookmarkUsers,setbookmarkUsers] = useState<userInfoType[]>([
    {
      name: 'John Doe',
      username: '@johndoe',
      bio: 'Software Engineer passionate about coding, with over 5 years of experience in full-stack development. I love building scalable web applications using React, Node.js, and cloud technologies. Always eager to learn new frameworks and contribute to open-source projects.',
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
      username: '@janesmith',
      bio: 'Designer and artist specializing in digital art and UI/UX design. I create visually stunning interfaces and illustrations that tell stories. With a background in fine arts, I blend creativity with technology to deliver engaging user experiences.',
      location: 'California',
      website: 'https://janesmith.com',
      joinDate: 'March 2019',
      following: '120',
      followers: '180',
      Posts: '40',
      isVerified: false,
      coverImage: '/images/signup-banner.png',
      avatar: '/images/myProfile.jpg'
    },
    {
      name: 'Alex Johnson',
      username: '@alexj',
      bio: 'Data Scientist exploring the world of AI and machine learning. Passionate about turning data into insights that drive decisions. Coffee lover and avid reader.',
      location: 'Seattle',
      website: 'https://alexj.com',
      joinDate: 'July 2021',
      following: '180',
      followers: '250',
      Posts: '65',
      isVerified: true,
      coverImage: '/images/signup-banner.png',
      avatar: '/images/myProfile.jpg'
    },
    {
      name: 'Maria Garcia',
      username: '@mariag',
      bio: 'Marketing Specialist with a knack for digital campaigns. I help brands tell their stories through creative strategies and social media magic.',
      location: 'Madrid',
      website: 'https://mariag.com',
      joinDate: 'September 2018',
      following: '200',
      followers: '320',
      Posts: '80',
      isVerified: false,
      coverImage: '/images/signup-banner.png',
      avatar: '/images/myProfile.jpg'
    },
    {
      name: 'David Lee',
      username: '@davidl',
      bio: 'Product Manager bridging the gap between technology and business. Focused on building products that users love. Tech enthusiast and startup advisor.',
      location: 'Toronto',
      website: 'https://davidl.com',
      joinDate: 'November 2017',
      following: '220',
      followers: '400',
      Posts: '90',
      isVerified: true,
      coverImage: '/images/signup-banner.png',
      avatar: '/images/myProfile.jpg'
    },
    {
      name: 'Emily Chen',
      username: '@emilyc',
      bio: 'Graphic Designer creating visual identities that resonate. From logos to branding, I bring ideas to life with color and creativity.',
      location: 'Sydney',
      website: 'https://emilyc.com',
      joinDate: 'May 2020',
      following: '140',
      followers: '190',
      Posts: '45',
      isVerified: false,
      coverImage: '/images/signup-banner.png',
      avatar: '/images/myProfile.jpg'
    },
    {
      name: 'Michael Brown',
      username: '@michaelb',
      bio: 'Cybersecurity Expert protecting digital assets in an ever-evolving threat landscape. Advocate for privacy and secure online practices.',
      location: 'Berlin',
      website: 'https://michaelb.com',
      joinDate: 'April 2016',
      following: '300',
      followers: '500',
      Posts: '120',
      isVerified: true,
      coverImage: '/images/signup-banner.png',
      avatar: '/images/myProfile.jpg'
    },
    {
      name: 'Sophia Patel',
      username: '@sophiap',
      bio: 'Entrepreneur and content creator sharing tips on productivity and personal growth. Building communities that inspire positive change.',
      location: 'Mumbai',
      website: 'https://sophiap.com',
      joinDate: 'December 2019',
      following: '250',
      followers: '380',
      Posts: '70',
      isVerified: false,
      coverImage: '/images/signup-banner.png',
      avatar: '/images/myProfile.jpg'
    }
  ]);

  // Array of viewed users
  const [viewedUsers,setviewedUsers] = useState<userInfoType[]>([
    {
      name: 'Alice Johnson',
      username: '@alicej',
      bio: 'Tech enthusiast and blogger. Sharing insights on the latest in AI and machine learning. Lover of coffee and coding marathons.',
      location: 'San Francisco',
      website: 'https://alicej.com',
      joinDate: 'February 2021',
      following: '200',
      followers: '300',
      Posts: '75',
      isVerified: true,
      coverImage: '/images/signup-banner.png',
      avatar: '/images/myProfile.jpg'
    },
    {
      name: 'Bob Wilson',
      username: '@bobw',
      bio: 'Photographer and traveler. Capturing the world one frame at a time. Always on the lookout for new adventures.',
      location: 'London',
      website: 'https://bobw.com',
      joinDate: 'April 2018',
      following: '180',
      followers: '250',
      Posts: '60',
      isVerified: false,
      coverImage: '/images/signup-banner.png',
      avatar: '/images/myProfile.jpg'
    },
    {
      name: 'Emma Davis',
      username: '@emmad',
      bio: 'UX Designer passionate about creating intuitive user experiences. Advocate for accessibility and inclusive design.',
      location: 'Austin',
      website: 'https://emmad.com',
      joinDate: 'June 2020',
      following: '220',
      followers: '350',
      Posts: '85',
      isVerified: true,
      coverImage: '/images/signup-banner.png',
      avatar: '/images/myProfile.jpg'
    },
    {
      name: 'Frank Miller',
      username: '@frankm',
      bio: 'Full-stack developer with a love for open-source projects. Building tools that make developers\' lives easier.',
      location: 'Berlin',
      website: 'https://frankm.com',
      joinDate: 'August 2019',
      following: '190',
      followers: '280',
      Posts: '70',
      isVerified: false,
      coverImage: '/images/signup-banner.png',
      avatar: '/images/myProfile.jpg'
    },
    {
      name: 'Grace Lee',
      username: '@gracel',
      bio: 'Data Analyst turning numbers into stories. Passionate about data visualization and business intelligence.',
      location: 'Toronto',
      website: 'https://gracel.com',
      joinDate: 'October 2021',
      following: '160',
      followers: '240',
      Posts: '55',
      isVerified: true,
      coverImage: '/images/signup-banner.png',
      avatar: '/images/myProfile.jpg'
    },
    {
      name: 'Henry Wilson',
      username: '@henryw',
      bio: 'Cybersecurity consultant helping organizations protect their digital assets. Speaker on privacy and security topics.',
      location: 'Sydney',
      website: 'https://henryw.com',
      joinDate: 'January 2018',
      following: '250',
      followers: '400',
      Posts: '95',
      isVerified: false,
      coverImage: '/images/signup-banner.png',
      avatar: '/images/myProfile.jpg'
    },
    {
      name: 'Isabella Garcia',
      username: '@isabellag',
      bio: 'Content creator and social media strategist. Helping brands connect with their audience through authentic storytelling.',
      location: 'Madrid',
      website: 'https://isabellag.com',
      joinDate: 'March 2022',
      following: '180',
      followers: '320',
      Posts: '65',
      isVerified: true,
      coverImage: '/images/signup-banner.png',
      avatar: '/images/myProfile.jpg'
    },
    {
      name: 'Jack Thompson',
      username: '@jackt',
      bio: 'Product Manager focused on user-centric design. Bridging the gap between engineering and business needs.',
      location: 'Vancouver',
      website: 'https://jackt.com',
      joinDate: 'July 2017',
      following: '210',
      followers: '380',
      Posts: '80',
      isVerified: false,
      coverImage: '/images/signup-banner.png',
      avatar: '/images/myProfile.jpg'
    }
  ]);

  // Array of liked users
  const [likedUsers,setlikedUsers] = useState<userInfoType[]>([
    {
      name: 'Charlie Brown',
      username: '@charlieb',
      bio: 'Musician and songwriter. Creating melodies that touch the soul. Fan of indie rock and late-night jam sessions.',
      location: 'Austin',
      website: 'https://charlieb.com',
      joinDate: 'June 2017',
      following: '220',
      followers: '400',
      Posts: '90',
      isVerified: true,
      coverImage: '/images/signup-banner.png',
      avatar: '/images/myProfile.jpg'
    },
    {
      name: 'Diana Prince',
      username: '@dianap',
      bio: 'Entrepreneur and fitness coach. Empowering others to live healthier lives. Passionate about wellness and business growth.',
      location: 'Miami',
      website: 'https://dianap.com',
      joinDate: 'August 2019',
      following: '160',
      followers: '350',
      Posts: '55',
      isVerified: false,
      coverImage: '/images/signup-banner.png',
      avatar: '/images/myProfile.jpg'
    },
    {
      name: 'Ethan Hunt',
      username: '@ethanh',
      bio: 'Action movie enthusiast and stunt coordinator. Turning impossible missions into cinematic reality.',
      location: 'Los Angeles',
      website: 'https://ethanh.com',
      joinDate: 'May 2016',
      following: '300',
      followers: '450',
      Posts: '110',
      isVerified: true,
      coverImage: '/images/signup-banner.png',
      avatar: '/images/myProfile.jpg'
    },
    {
      name: 'Fiona Green',
      username: '@fionag',
      bio: 'Environmental scientist dedicated to sustainable solutions. Advocating for green technologies and eco-friendly living.',
      location: 'Portland',
      website: 'https://fionag.com',
      joinDate: 'September 2020',
      following: '180',
      followers: '290',
      Posts: '60',
      isVerified: false,
      coverImage: '/images/signup-banner.png',
      avatar: '/images/myProfile.jpg'
    },
    {
      name: 'George King',
      username: '@georgek',
      bio: 'Chef and food blogger sharing culinary adventures. From farm to table, exploring flavors around the world.',
      location: 'Chicago',
      website: 'https://georgek.com',
      joinDate: 'November 2018',
      following: '250',
      followers: '380',
      Posts: '75',
      isVerified: true,
      coverImage: '/images/signup-banner.png',
      avatar: '/images/myProfile.jpg'
    },
    {
      name: 'Hannah Lee',
      username: '@hannahl',
      bio: 'Fashion designer blending tradition with modernity. Creating wearable art that tells a story.',
      location: 'Paris',
      website: 'https://hannahl.com',
      joinDate: 'February 2019',
      following: '200',
      followers: '320',
      Posts: '85',
      isVerified: false,
      coverImage: '/images/signup-banner.png',
      avatar: '/images/myProfile.jpg'
    },
    {
      name: 'Ian Moore',
      username: '@ianm',
      bio: 'Software architect designing scalable systems. Passionate about clean code and innovative tech solutions.',
      location: 'Boston',
      website: 'https://ianm.com',
      joinDate: 'July 2015',
      following: '280',
      followers: '420',
      Posts: '100',
      isVerified: true,
      coverImage: '/images/signup-banner.png',
      avatar: '/images/myProfile.jpg'
    },
    {
      name: 'Julia Adams',
      username: '@juliaa',
      bio: 'Journalist uncovering stories that matter. Focused on investigative reporting and social justice issues.',
      location: 'Washington D.C.',
      website: 'https://juliaa.com',
      joinDate: 'April 2021',
      following: '190',
      followers: '310',
      Posts: '50',
      isVerified: false,
      coverImage: '/images/signup-banner.png',
      avatar: '/images/myProfile.jpg'
    }
  ]);

  // Current user info for replies
  const [UserInfo, setUserInfo] = useState({
    name: 'Amritansh Rai',
    username: 'amritansh_coder',
    avatar: '/images/myProfile.jpg',
    isVerified: true
  });
  
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
      <div className='mainSection h-full flex-2 rounded-md'>
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
                 className='p-2 relative rounded-full cursor-pointer dark:hover:bg-gray-950 hover:bg-gray-100 transition-all duration-300'>
                  <FilterIcon />
                  { openFilter && (
                    <div className='absolute w-44 h-fit top-13 right-5 border border-gray-300 dark:border-gray-900 rounded-lg bg-white dark:bg-black shadow-xl dark:shadow-gray-950 overflow-y-auto'>
                      <ul className='p-2 space-y-1'>
                        <li
                        onClick={() => { handleChangeFilterState('Relevency') }}
                        className='px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-950 rounded-md cursor-pointer text-sm flex items-center justify-between'><Target className="w-4 h-4 mr-2" /><span>Relevancy</span><Check className={`w-4 h-4 ${currentFilter === 'Relevency' ? 'opacity-100 stroke-3' : 'opacity-0'}`} /></li>
                        <li
                        onClick={() => { handleChangeFilterState('Most Liked') }}
                        className='px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-950 rounded-md cursor-pointer text-sm flex items-center justify-between'><Heart className="w-4 h-4 mr-2" /><span>Most Liked</span><Check className={`w-4 h-4 ${currentFilter === 'Most Liked' ? 'opacity-100 stroke-3' : 'opacity-0'}`} /></li>
                        <li
                        onClick={() => { handleChangeFilterState('Newest') }}
                        className='px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-950 rounded-md cursor-pointer text-sm flex items-center justify-between'><Clock className="w-4 h-4 mr-2" /><span>Newest</span><Check className={`w-4 h-4 ${currentFilter === 'Newest' ? 'opacity-100 stroke-3' : 'opacity-0'}`} /></li>
                        <li
                        onClick={() => { handleChangeFilterState('Oldest') }}
                        className='px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-950 rounded-md cursor-pointer text-sm flex items-center justify-between'><Archive className="w-4 h-4 mr-2" /><span>Oldest</span><Check className={`w-4 h-4 ${currentFilter === 'Oldest' ? 'opacity-100 stroke-3' : 'opacity-0'}`} /></li>
                        <li
                        onClick={() => { handleChangeFilterState('Following') }}
                        className='px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-950 rounded-md cursor-pointer text-sm flex items-center justify-between'><Users className="w-4 h-4 mr-2" /><span>Following</span><Check className={`w-4 h-4 ${currentFilter === 'Following' ? 'opacity-100 stroke-3' : 'opacity-0'}`} /></li>
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
                 className={`relative text-gray-700 rounded-t-lg dark:text-gray-200 font-medium text-[15px] cursor-pointer px-3 py-1 rounded-md transition-all duration-300 hover:bg-yellow-100 dark:hover:bg-blue-950/20 hover:text-yellow-500 dark:hover:text-blue-500 group ${activeNav.value === option.value ? 'bg-yellow-100 text-yellow-500 dark:text-blue-500 dark:bg-blue-950/20' : ''}`}
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
            <div className='rounded-lg flex items-center gap-3 px-4 py-3 text-xl font-semibold shadow-md bg-yellow-50 dark:bg-blue-950/10 border-l-4 border-yellow-400 dark:border-blue-500 text-gray-900 dark:text-white'>
              <TrendingUp className="w-6 h-6 text-yellow-500 dark:text-blue-400" />
              All Records
            </div>
              <PostMetricsPage postId={String(postId)}/>
            </>
          )}
          {(activeNav.value === 'All' || activeNav.value === 'Bookmark') && (
            <>
            <div className='rounded-lg flex items-center gap-3 px-4 py-3 my-5 text-xl font-semibold shadow-md bg-yellow-50 dark:bg-blue-950/10 border-l-4 border-yellow-400 dark:border-blue-500 text-gray-900 dark:text-white'>
              <Bookmark className="w-6 h-6 text-yellow-500 dark:text-blue-400" />
              Bookmarked By
            </div>
            {bookmarkUsers.map((user, index) => (
              <Usercard key={index} decodedHandle={user.username} name={user.name} content={user.bio} user={user} />
            ))}
            {/* {bookmarkUsers.length > 10 && ( */}
             <div>
               <button className='flex items-center justify-center gap-2 p-3 my-2 mx-1 w-full rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 dark:from-blue-500 dark:to-blue-600 text-white font-semibold hover:scale-95 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer'>
                 Load More
                 <ChevronDown className="w-4 h-4 stroke-3" />
               </button>
             </div>
            {/* )} */}
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
                              src={UserInfo.avatar}
                              alt={UserInfo.name}
                              className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-3">
                                <span className="font-bold text-sm">{UserInfo.name}</span>
                                {UserInfo.isVerified && (
                                  <Image src='/images/yellow-tick.png' width={20} height={20} alt='blue-tick' />
                                )}
                                <span className="text-gray-500 dark:text-gray-400 text-sm">@{UserInfo.username}</span>
                                <span className="text-gray-500 dark:text-gray-400 text-sm">·</span>
                                <span className="text-gray-500 dark:text-gray-400 text-sm">{post.repliedAt}</span>
                              </div>
                              <div className="space-y-3">
                                <Link href={`/@${post.postAuthorInfo.username}/post/${post.postId}`} className="text-blue-500 hover:underline text-sm inline-block">Replied to post</Link>
                                <div className="ml-4 border-l-2 rounded-md border-gray-300 dark:border-gray-600 pl-4">
                                  <PostCard
                                    postId={post.id}
                                    avatar={post.postAuthorInfo.avatar}
                                    username={post.postAuthorInfo.name}
                                    handle={post.postAuthorInfo.username}
                                    timestamp={post.postAuthorInfo.postedAt}
                                    content={post.postAuthorInfo.content}
                                    hashTags={['opensource','webdevproject']}
                                    mentions={['saketghokhale','ezsnippet']}
                                    media={[]}
                                    likes={0}
                                    retweets={0}
                                    replies={0}
                                    shares={0}
                                    views={0}
                                    bookmarked={0}
                                  />
                                </div>
                                <PostCard
                                  postId={post.id}
                                  avatar={UserInfo.avatar}
                                  username={UserInfo.name}
                                  handle={UserInfo.username}
                                  timestamp={post.repliedAt}
                                  content={post.commentedText}
                                  media={post.mediaUrls}
                                  likes={post.likes}
                                  retweets={post.reposts}
                                  replies={post.comments}
                                  shares={0}
                                  views={post.views}
                                  bookmarked={post.bookmarks}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
            {/* {bookmarkUsers.length > 10 && ( */}
             <div>
               <button className='flex items-center justify-center gap-2 p-3 my-2 mx-1 w-full rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 dark:from-blue-500 dark:to-blue-600 text-white font-semibold hover:scale-95 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer'>
                 Load More
                 <ChevronDown className="w-4 h-4 stroke-3" />
               </button>
             </div>
            {/* )} */}
            </>
          )}
          {(activeNav.value === 'All' || activeNav.value === 'Views') && (
            <>
            <div className='rounded-lg flex items-center gap-3 px-4 py-3 my-5 text-xl font-semibold shadow-md bg-yellow-50 dark:bg-blue-950/10 border-l-4 border-yellow-400 dark:border-blue-500 text-gray-900 dark:text-white'>
              <Eye className="w-6 h-6 text-yellow-500 dark:text-blue-400" />
              Viewed By
            </div>
            {viewedUsers.map((user, index) => (
              <Usercard key={index} decodedHandle={user.username} name={user.name} content={user.bio} user={user} />
            ))}
            {/* {viewedUsers.length > 10 && ( */}
             <div>
               <button className='flex items-center justify-center gap-2 p-3 my-2 mx-1 w-full rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 dark:from-blue-500 dark:to-blue-600 text-white font-semibold hover:scale-95 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer'>
                 Load More
                 <ChevronDown className="w-4 h-4 stroke-3" />
               </button>
             </div>
            {/* )} */}
            </>
          )}
          {(activeNav.value === 'All' || activeNav.value === 'Likes') && (
            <>
            <div className='rounded-lg flex items-center gap-3 px-4 py-3 my-5 text-xl font-semibold shadow-md bg-yellow-50 dark:bg-blue-950/10 border-l-4 border-yellow-400 dark:border-blue-500 text-gray-900 dark:text-white'>
              <Heart className="w-6 h-6 text-yellow-500 dark:text-blue-400" />
              Liked By
            </div>
            {likedUsers.map((user, index) => (
              <Usercard key={index} decodedHandle={user.username} name={user.name} content={user.bio} user={user} />
            ))}
            {/* {viewedUsers.length > 10 && ( */}
             <div>
               <button className='flex items-center justify-center gap-2 p-3 my-2 mx-1 w-full rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 dark:from-blue-500 dark:to-blue-600 text-white font-semibold hover:scale-95 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer'>
                 Load More
                 <ChevronDown className="w-4 h-4 stroke-3" />
               </button>
             </div>
            {/* )} */}
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

