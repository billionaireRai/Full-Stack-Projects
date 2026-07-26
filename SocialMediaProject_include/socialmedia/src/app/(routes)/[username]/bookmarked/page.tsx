'use client'

import React, { useState , useEffect , useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { motion , AnimatePresence } from 'framer-motion'
import PostCard from '@/components/postcard'
import Activebeep from '@/components/activebeep'
import { featureDemoType } from '../feed/page'
import { MoreHorizontal, Bookmark, ArrowDownUp, Shuffle, ArrowDown, ArrowUp, Heart, MessageCircle, Repeat, Eye, Check, Users , SparklesIcon , CalendarClockIcon , InfinityIcon, ArrowBigUpIcon } from 'lucide-react'
import UserCard from '@/components/usercard'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import axiosInstance from '@/lib/interceptor'
import CompLoader from '@/components/componentloader'
import { handleScrollToTop } from '@/lib/windowtopscroll'
import Loader from '@/components/loader'

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
    isCompleted?:boolean,
    isVerified?: boolean,
    plan:string,
    followers?: string,
    following?: string,
    isFollowing?: boolean,
    isHighlighted?: boolean,
    isPinned?: boolean,
    taggedLocation?: locationTaggedType[],
    poll?: pollInfoType
}


export default function Bookmarkedpage(){
  const router = useRouter() ; // intializing the useRouter hook....
  const params = useParams();
  const Size:number = 15 ;
  const autoHeightGap:number = 400 ;
  const postsSection = useRef<HTMLDivElement | null>(null);
  const pageHandle = decodeURIComponent(String(params.username)) ;
  const [Page, setPage] = useState<number>(1);
  const [hasPosts, sethasPosts] = useState<boolean>(true);
  const [bookmarkOptionsOpen, setBookmarkOptionsOpen] = useState<boolean>(false);
  const [selectedSort, setSelectedSort] = useState<string>('newest');
  const [loadingSugg, setloadingSugg] = useState<boolean>(false);
  const [loadingPosts, setloadingPosts] = useState<boolean>(false);
  const [ShowLess, setShowLess] = useState<boolean>(false);
  const [suggesstionNum, setsuggesstionNum] = useState<number>(4);

  // sample follow suggesstions...
  const [whoToFollow, setWhoToFollow] = useState([
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
          coordinates: [40.7128, -74.0060] as [number, number]
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
          coordinates: [34.0522, -118.2437] as [number, number]
        },
        website: 'https://bob-designs.com',
        joinDate: '2019-08-22',
        following: '567',
        followers: '3.4k',
        Posts: '789',
        isCompleted: true,
        isVerified: false,
        plan:'Free',
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
          coordinates: [30.2672, -97.7431] as [number, number]
        },
        website: 'https://charlie-writes.com',
        joinDate: '2018-11-10',
        following: '123',
        followers: '5.6k',
        Posts: '1,234',
        isCompleted: true,
        isVerified: true,
        plan:'Pro',
        bannerUrl: '/images/default-banner.jpg',
        avatarUrl: '/images/default-profile-pic.png'
      }
    }
  ])

  // function for showing more suggestions...
  const handleSuggesstionShow = () => {
    if (ShowLess) {
      setsuggesstionNum(4);
      setShowLess(false);
    } else {
      if ((whoToFollow.length - suggesstionNum) >= 3) {
        setsuggesstionNum(suggesstionNum + 3);
        if (suggesstionNum + 3 === whoToFollow.length) {
          setShowLess(true);
        }
      }
    }
  }

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

const featureDemo : featureDemoType[] = [
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
];

const [PostDetails, setPostDetails] = useState<PostType[]>([
{
      id: '1',
      content: 'Excited to share my latest project! #coding #webdev',
      postedAt: '2023-10-01T10:00:00Z',
      comments: 5,
      reposts: 2,
      likes: 15,
      views: 120,
      mediaUrls: [{ url: 'https://picsum.photos/seed/1/400/300', media_type: 'image' }],
      hashTags: ['coding', 'webdev'],
      mentions: ['user1'],
      userliked: true,
      userBookmarked:true,
      usereposted: false,
      usercommented: false,
      userbookmarked: true,
      username: 'Amritansh Rai',
      handle: '@amritansh_coder',
      avatar: '/images/myProfile.jpg',
      cover: 'https://img.freepik.com/premium-photo/wide-banner-with-many-random-square-hexagons-charcoal-dark-black-color_105589-1820.jpg',
      bio: 'Emma just hehe my way thru life...',
      isCompleted:true,
      isVerified: false,
      plan:'Free',
      followers: '327k',
      following: '177',
      isFollowing: true,
      isHighlighted: true,
      isPinned: false,
      taggedLocation: [{ text: 'San Francisco, CA', coordinates: [37.7749, -122.4194] }],
      poll: undefined
    },
    {
      id: '2',
      content: 'Beautiful sunset today! Nature is amazing.',
      postedAt: '2023-10-02T18:30:00Z',
      comments: 8,
      reposts: 5,
      likes: 25,
      views: 200,
      mediaUrls: [{ url: 'https://picsum.photos/seed/2/400/300', media_type: 'image' }],
      hashTags: ['nature', 'sunset'],
      mentions: [],
      userliked: false,
      userBookmarked:true,
      usereposted: true,
      usercommented: true,
      userbookmarked: true,
      username: 'Sarah Johnson',
      handle: '@sarah_nature',
      avatar: 'https://picsum.photos/seed/avatar2/200/200',
      cover: 'https://picsum.photos/seed/cover2/1500/500',
      bio: 'Nature photographer & travel enthusiast',
      isCompleted:true,
      isVerified: false,
      isFollowing:true,
      isPinned:false,
      isHighlighted:false,
      plan:'Free',
      followers: '12.5k',
      following: '892'
    },
    {
      id: '3',
      content: 'Just finished reading an amazing book. Highly recommend!',
      postedAt: '2023-10-03T14:20:00Z',
      comments: 12,
      reposts: 3,
      likes: 30,
      views: 180,
      mediaUrls: [],
      hashTags: ['books', 'reading'],
      mentions: ['author'],
      userliked: true,
      userBookmarked:true,
      usereposted: false,
      usercommented: false,
      userbookmarked: true,
      username: 'Michael Chen',
      handle: '@mike_reads',
      avatar: 'https://picsum.photos/seed/avatar3/200/200',
      cover: 'https://picsum.photos/seed/cover3/1500/500',
      bio: 'Book lover | Tech enthusiast | Coffee addict',
      isCompleted:true,
      isVerified: true,
      plan:'Pro',
      followers: '45.2k',
      following: '1.2k',
      isFollowing: false,
      isHighlighted: false,
      isPinned: true,
      taggedLocation: [],
      poll: { question: 'What genre of books do you prefer?', options: [{ text: 'Fiction', votes: 45 }, { text: 'Non-Fiction', votes: 32 }, { text: 'Science Fiction', votes: 28 }, { text: 'Mystery', votes: 21 }], duration: 24 }
    },
    {
      id: '4',
      content: 'New recipe alert! Homemade pizza night. 🍕',
      postedAt: '2023-10-04T20:15:00Z',
      comments: 6,
      reposts: 1,
      likes: 20,
      views: 150,
      mediaUrls: [{ url: 'https://picsum.photos/seed/4/400/300', media_type: 'image' }],
      hashTags: ['food', 'recipe'],
      mentions: [],
      userliked: false,
      userBookmarked:true,
      usereposted: false,
      usercommented: true,
      userbookmarked: true,
      username: 'Emma Wilson',
      handle: '@emma_cooks',
      avatar: 'https://picsum.photos/seed/avatar4/200/200',
      cover: 'https://picsum.photos/seed/cover4/1500/500',
      bio: 'Home chef | Food blogger | Pizza enthusiast',
      isCompleted:true,
      isVerified: true,
      plan:'Creator',
      followers: '8.3k',
      following: '456'
    },
    {
      id: '5',
      content: 'Working on some exciting updates for the app. Stay tuned!',
      postedAt: '2023-10-05T09:45:00Z',
      comments: 9,
      reposts: 4,
      likes: 18,
      views: 140,
      mediaUrls: [],
      hashTags: ['app', 'updates'],
      mentions: ['team'],
      userliked: true,
      userBookmarked:true,
      usereposted: true,
      usercommented: false,
      userbookmarked: true,
      username: 'David Kim',
      handle: '@david_dev',
      avatar: 'https://picsum.photos/seed/avatar5/200/200',
      cover: 'https://picsum.photos/seed/cover5/1500/500',
      bio: 'Full-stack developer | Building cool stuff',
      isCompleted:true,
      isVerified: false,
      plan:'Free',
      followers: '89.7k',
      following: '234',
      isFollowing: true,
      isHighlighted: false,
      isPinned: false,
      taggedLocation: [{ text: 'New York, NY', coordinates: [40.7128, -74.0060] }],
      poll: { question: 'Which feature are you most excited for?', options: [{ text: 'Dark Mode', votes: 156 }, { text: 'New Dashboard', votes: 89 }, { text: 'Real-time Notifications', votes: 124 }, { text: 'API Access', votes: 67 }], duration: 48 }
    },
    {
      id: '6',
      content: 'Weekend vibes! Time to relax and recharge.',
      postedAt: '2023-10-06T16:00:00Z',
      comments: 4,
      reposts: 2,
      likes: 22,
      views: 160,
      mediaUrls: [{ url: 'https://picsum.photos/seed/6/400/300', media_type: 'image' }],
      hashTags: ['weekend', 'relax'],
      mentions: [],
      userliked: false,
      userBookmarked:true,
      usereposted: false,
      usercommented: false,
      userbookmarked: true,
      username: 'Lisa Thompson',
      handle: '@lisa_relax',
      avatar: 'https://picsum.photos/seed/avatar6/200/200',
      cover: 'https://picsum.photos/seed/cover6/1500/500',
      bio: 'Yoga instructor | Wellness advocate',
      isCompleted:true,
      isVerified: true,
      isFollowing:true,
      isPinned:true,
      isHighlighted:false,
      plan:'Pro',
      followers: '22.1k',
      following: '567'
    },
    {
      id: '7',
      content: 'Tech conference was incredible! Learned so much.',
      postedAt: '2023-10-07T12:30:00Z',
      comments: 15,
      reposts: 7,
      likes: 35,
      views: 250,
      mediaUrls: [],
      hashTags: ['tech', 'conference'],
      mentions: ['speaker1', 'speaker2'],
      userliked: true,
      userBookmarked:true,
      usereposted: false,
      usercommented: true,
      userbookmarked: true,
      username: 'James Wilson',
      handle: '@james_tech',
      avatar: 'https://picsum.photos/seed/avatar7/200/200',
      cover: 'https://picsum.photos/seed/cover7/1500/500',
      bio: 'Tech entrepreneur | Speaker | Innovator',
      isCompleted:true,
      isVerified: true,
      plan:'Pro',
      followers: '156k',
      following: '890',
      isFollowing: false,
      isHighlighted: true,
      isPinned: true,
      taggedLocation: [{ text: 'Austin, TX', coordinates: [30.2672, -97.7431] }],
      poll: { question: 'Which tech topic interests you most?', options: [{ text: 'AI & ML', votes: 234 }, { text: 'Web Development', votes: 189 }, { text: 'Cybersecurity', votes: 156 }, { text: 'Cloud Computing', votes: 112 }], duration: 72 }
    },
    {
      id: '8',
      content: 'Morning coffee and coding session. Perfect start to the day!',
      postedAt: '2023-10-08T08:00:00Z',
      comments: 3,
      reposts: 1,
      likes: 12,
      views: 90,
      mediaUrls: [{ url: 'https://picsum.photos/seed/8/400/300', media_type: 'image' }],
      hashTags: ['coffee', 'coding'],
      mentions: [],
      userliked: false,
      userBookmarked:true,
      usereposted: true,
      usercommented: false,
      userbookmarked: true,
      username: 'Alex Rivera',
      handle: '@alex_code',
      avatar: 'https://picsum.photos/seed/avatar8/200/200',
      cover: 'https://picsum.photos/seed/cover8/1500/500',
      bio: 'Software engineer | Coffee lover',
      isCompleted:true,
      isVerified: false,
      plan:'Free',
      followers: '5.6k',
      following: '321'
    },
    {
      id: '9',
      content: 'Exploring new hiking trails this weekend. Adventure awaits!',
      postedAt: '2023-10-09T11:45:00Z',
      comments: 7,
      reposts: 3,
      likes: 28,
      views: 190,
      mediaUrls: [{ url: 'https://picsum.photos/seed/9/400/300', media_type: 'image' }],
      hashTags: ['hiking', 'adventure'],
      mentions: ['friend'],
      userliked: true,
      userBookmarked:true,
      usereposted: false,
      usercommented: true,
      userbookmarked: true,
      username: 'Rachel Green',
      handle: '@rachel_hikes',
      avatar: 'https://picsum.photos/seed/avatar9/200/200',
      cover: 'https://picsum.photos/seed/cover9/1500/500',
      bio: 'Adventure seeker | Hiking enthusiast',
      isCompleted:true,
      isVerified: true,
      plan:'Pro',
      followers: '18.9k',
      following: '445'
    },
    {
      id: '10',
      content: 'Just launched my new website! Check it out and let me know what you think.',
      postedAt: '2023-10-10T15:20:00Z',
      comments: 11,
      reposts: 6,
      likes: 40,
      views: 300,
      mediaUrls: [{ url: 'https://picsum.photos/seed/10/400/300', media_type: 'image' }],
      hashTags: ['website', 'launch'],
      mentions: ['colleague'],
      userliked: false,
      userBookmarked:true,
      usereposted: false,
      usercommented: false,
      userbookmarked: true,
      username: 'Chris Anderson',
      handle: '@chris_web',
      avatar: 'https://picsum.photos/seed/avatar10/200/200',
      cover: 'https://picsum.photos/seed/cover10/1500/500',
      bio: 'Web designer & developer | Creator',
      isCompleted:true,
      isVerified: false,
      plan:'Free',
      followers: '67.3k',
      following: '678'
    }
  ])

  // function handling reversing post order...
  function handleReversePostOrder() {
    const reversedOrder = [...PostDetails].reverse(); 
    setPostDetails(reversedOrder);
  }

  // function handling shuffling posts...
  function handleShufflePosts() {
    const shuffledPosts = [...PostDetails].sort(() => Math.random() - 0.5);
    setPostDetails(shuffledPosts);
  }

    // useeffect for sorting...
  useEffect(() => {
    switch (selectedSort) {
      case 'newest':
        const newestPost = [...PostDetails].sort(( a , b ) =>  new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime() );
        setPostDetails(newestPost);
        break;
      
      case 'oldest':
        const oldestPost = [...PostDetails].sort(( a , b ) =>  new Date(a.postedAt).getTime() - new Date(b.postedAt).getTime() );
        setPostDetails(oldestPost);
        break;

      case 'likes':
        const mostLikedPost = [...PostDetails].sort(( a , b ) => b.likes - a.likes); 
        setPostDetails(mostLikedPost);
        break;

      case 'comments':
        const mostCommented = [...PostDetails].sort(( a , b ) => b.comments - a.comments); 
        setPostDetails(mostCommented);
        break;

      case 'reposts':
        const mostReposts = [...PostDetails].sort(( a , b ) => b.reposts - a.reposts); 
        setPostDetails(mostReposts);
        break;

      case 'views':
        const mostViewed = [...PostDetails].sort(( a , b ) => b.views - a.views); 
        setPostDetails(mostViewed);
        break;

      default:
        break;
    }
  
    
  }, [selectedSort,bookmarkOptionsOpen])

  // function for api triggering...
  async function getBookmarkPosts() {
    setloadingPosts(true);
    try {
      const bookmarkApi = await axiosInstance.post('/api/bookmark',{ Page , Size });
      if (bookmarkApi.data.success || bookmarkApi.status === 200) {
        setPostDetails(bookmarkApi.data.posts);
        sethasPosts(bookmarkApi.data.hasMore);
        setloadingPosts(false);
      }
    } catch (error) { 
      console.log("An Error Occured :",error);
      setloadingPosts(false);
    } finally {
      setloadingPosts(false);
    }
  }

  // function to get suggestions...
  async function getAccountSuggestions() {
    setloadingSugg(true);
    try {
      const suggApi = await axiosInstance.get('/api/bookmark');
      if (suggApi.data.success || suggApi.status === 200) {
        setWhoToFollow(suggApi.data.suggestions);
        setloadingSugg(false);
      }
    } catch (error) {
      console.log('An Error Occured :',error);
      setloadingSugg(false);
    } finally {
      setloadingSugg(false);
    }

  }

  useEffect(() => {
  getBookmarkPosts() ; // calling the fetching functions
  getAccountSuggestions();
  }, [])


  // fetching posts by pagination...
  useEffect(() => {
     const section = postsSection.current ;
     if (!section) return ;
     
     const handleScroll = () => {
       const distanceFromBottom = section.scrollHeight - section.scrollTop - section.clientHeight ;
       if (distanceFromBottom <= autoHeightGap && hasPosts) {
         getBookmarkPosts();
         setPage(Page + 1);
       }
      }
      // calling scroll function...
      handleScroll() ;
       
      section.addEventListener('scroll', handleScroll, { passive: true })
      return () => {
      section.removeEventListener('scroll', handleScroll)
     }
  }, [autoHeightGap,hasPosts,PostDetails.length])
  
   // useeffect for more popup closing...
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (bookmarkOptionsOpen && !(event.target as Element).closest('.option-pop')) {
           setBookmarkOptionsOpen(false)
         }
      }
        
      if (bookmarkOptionsOpen) {
        document.addEventListener('mousedown', handleClickOutside)
      }
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [bookmarkOptionsOpen])

  return (
    <div className='h-screen flex flex-row gap-4 font-poppins rounded-lg p-4 dark:bg-black'>
      <div ref={postsSection} id='leftcon' className='leftContainer flex flex-col flex-1 overflow-y-scroll rounded-lg'>
           <header className="sticky top-0 w-full z-10 backdrop-blur-sm border-b rounded-lg mb-4 border-gray-300 dark:border-gray-900 bg-white/90 dark:bg-black/90 shadow-lg">
             <div className="p-2">
               <div className="flex items-center relative gap-2">
                 <button
                   onClick={() => { router.back() }}
                   className="p-1 hover:bg-gray-100 dark:hover:bg-gray-950 cursor-pointer rounded-full transition-all duration-200 hover:scale-105">
                   <Image src='/images/up-arrow.png' width={30} height={30} alt='back-arrow' className='-rotate-90 dark:invert' />
                 </button>
                 <div className="ml-4">
                    <h1 className="text-xl font-bold">Saved Posts<span className='text-yellow-400 p-3 dark:text-yellow-500'>{PostDetails.length}</span></h1>
                  <Link href={`/${pageHandle}`} className="text-xs px-3 py-1 rounded-lg w-fit hover:bg-yellow-100 transition-all duration-300 dark:hover:bg-gray-950 text-yellow-500 dark:text-yellow-400">{pageHandle}</Link>
                 </div>
                  <div className='absolute right-0 mx-3 flex items-center gap-2'>
                      <p className="text-xs text-black hidden dark:text-gray-400 truncate sm:block sm:w-[170px] lg:w-fit">Posts you've saved for future</p>
                      <Bookmark width={20} height={20} className='fill-black stroke-black dark:fill-white dark:stroke-white'/>
                  </div>
                </div>
                  <div className='flex items-center justify-end gap-1'>
                     <button 
                      onClick={() => { handleScrollToTop('leftcon') }}
                      type="button" className='cursor-pointer p-2 rounded-full text-yellow-500 hover:bg-yellow-100 dark:hover:bg-gray-950'>
                       <ArrowBigUpIcon size={25} />
                     </button>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button 
                        onClick={() => { handleReversePostOrder() }}
                        type="button" className='cursor-pointer p-2 rounded-full hover:bg-yellow-100 dark:hover:bg-gray-950'>
                          <ArrowDownUp size={16} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>Reverse post order</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button 
                        onClick={() => { handleShufflePosts() }}
                        type="button" className='cursor-pointer p-2 rounded-full hover:bg-yellow-100 dark:hover:bg-gray-950'>
                          <Shuffle size={16} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>Shuffle posts</TooltipContent>
                    </Tooltip>
                    <div className="relative">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button 
                            type="button" 
                            onClick={() => setBookmarkOptionsOpen(!bookmarkOptionsOpen)}
                            className='cursor-pointer p-2 rounded-full hover:bg-yellow-100 dark:hover:bg-gray-950'
                          >
                            <MoreHorizontal size={16} />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>More options</TooltipContent>
                      </Tooltip>
                      {bookmarkOptionsOpen && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9, y: 0 }}
                          animate={{ opacity: 1, scale: 1, y: -8 }}
                          exit={{ opacity: 0, scale: 0.95, y: -4 }}
                          transition={{ duration: 0.15, ease: 'easeOut' }}
                          style={{ transformOrigin: 'top right', willChange: 'transform, opacity' }}
                          className="option-pop absolute right-0 top-0 w-56 bg-white dark:bg-black rounded-lg shadow-lg dark:shadow-gray-800 border border-gray-200 dark:border-gray-900 z-50 p-1">
                          <button
                            onClick={() => { setSelectedSort('newest'); setBookmarkOptionsOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-2 text-sm rounded-lg cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-950 ${selectedSort === 'newest' ? 'bg-gray-50 dark:bg-gray-950' : ''}`}
                          >
                            <ArrowDown size={20}  />
                            <span>Newest first</span>
                            {selectedSort === 'newest' && <Check size={16} className="ml-auto stroke-2" />}
                          </button>
                          <button
                            onClick={() => { setSelectedSort('oldest'); setBookmarkOptionsOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-2 text-sm rounded-lg cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-950 ${selectedSort === 'oldest' ? 'bg-gray-50 dark:bg-gray-950' : ''}`}
                          >
                            <ArrowUp size={20} />
                            <span>Oldest first</span>
                            {selectedSort === 'oldest' && <Check size={16} className="ml-auto" />}
                          </button>
                          <button
                            onClick={() => { setSelectedSort('likes'); setBookmarkOptionsOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-2 text-sm rounded-lg cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-950 ${selectedSort === 'likes' ? 'bg-gray-50 dark:bg-gray-950' : ''}`}
                          >
                            <Heart size={20} />
                            <span>Most liked</span>
                            {selectedSort === 'likes' && <Check size={16} className="ml-auto" />}
                          </button>
                          <button
                            onClick={() => { setSelectedSort('comments'); setBookmarkOptionsOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-2 text-sm rounded-lg cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-950 ${selectedSort === 'comments' ? 'bg-gray-50 dark:bg-gray-950' : ''}`}
                          >
                            <MessageCircle size={20} />
                            <span>Most commented</span>
                            {selectedSort === 'comments' && <Check size={16} className="ml-auto" />}
                          </button>
                          <button
                            onClick={() => { setSelectedSort('reposts'); setBookmarkOptionsOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-2 text-sm rounded-lg cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-950 ${selectedSort === 'reposts' ? 'bg-gray-50 dark:bg-gray-950' : ''}`}
                          >
                            <Repeat size={20} />
                            <span>Most reposted</span>
                            {selectedSort === 'reposts' && <Check size={16} className="ml-auto" />}
                          </button>
                          <button
                            onClick={() => { setSelectedSort('views'); setBookmarkOptionsOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-2 text-sm rounded-lg cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-950 ${selectedSort === 'views' ? 'bg-gray-50 dark:bg-gray-950' : ''}`}
                          >
                            <Eye size={20} />
                            <span>Most viewed</span>
                            {selectedSort === 'views' && <Check size={16} className="ml-auto" />}
                          </button>
                        </motion.div>
                      )}
                    </div>
                  </div>
              </div>
            </header>
            <div className='postSection flex flex-col flex-1 rounded-lg'>
              {PostDetails.map((post,index) => (
                <PostCard
                  key={index}
                  postId={post.id}
                  username={post.username}
                  handle={post.handle}
                  avatar={post.avatar}
                  cover={post.cover}
                  bio={post.bio}
                  isVerified={post.isVerified}
                  isFollowing={post.isFollowing}
                  isHighlighted={post.isHighlighted}
                  isPinned={post.isPinned}
                  taggedLocation={post.taggedLocation}
                  poll={post.poll}
                  followers={post.followers}
                  following={post.following}
                  content={post.content}
                  timestamp={formatDate(post.postedAt)}
                  likes={post.likes}
                  reposts={post.reposts}
                  replies={post.comments}
                  views={post.views}
                  userliked={post.userliked}
                  usereposted={post.usereposted}
                  usercommented={post.usercommented}
                  userbookmarked={post.userbookmarked}
                  media={post.mediaUrls}
                  hashTags={post.hashTags}
                  mentions={post.mentions}
                />
              ))}
            </div>
              <AnimatePresence>
                {loadingPosts && (
                  <motion.div
                    className="flex flex-col items-center justify-center gap-4 mt-5"
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
      <div className='rightContainer overflow-y-scroll hidden lg:block w-96'>
        <div className='space-y-4'>
            {/* Who to Follow */}
            {!loadingSugg && ( 
            <div className='relative bg-white dark:bg-black rounded-xl shadow-lg'>
              <div className='p-4 m-2 border-b rounded-md flex gap-2 items-center border-gray-200 dark:border-gray-900'>
                <Users size={20} /><h2 className='text-xl font-bold text-gray-900 dark:text-white'>Suggestions</h2>
              </div>
              <div className='p-4'>
                {whoToFollow.map((usercard,index) =>
                  (index+1) <= suggesstionNum && (
                  <div key={index + 1} className='flex items-center justify-between'>
                   <UserCard content={null} decodedHandle={usercard.decodedHandle} name={usercard.name} IsFollowing={usercard.IsFollowing}
                   account={usercard.account} />
                  </div>)
                )}
              </div>
              <div className='p-2 m-2 rounded-md border-t border-gray-200 dark:border-gray-900'>
                <button 
                  onClick={() => { handleSuggesstionShow() }}
                  className='cursor-pointer hover:bg-yellow-100 dark:hover:bg-gray-950 p-2 rounded-full text-yellow-500 hover:text-yellow-600 text-sm font-medium'>
                  { ShowLess ? 'Show less' : 'Show more' }
                </button>
              </div>
            </div>
            )}
            {loadingSugg && (
              <Loader />
            )}
        </div>
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
      </div>
    </div>
  )
}
