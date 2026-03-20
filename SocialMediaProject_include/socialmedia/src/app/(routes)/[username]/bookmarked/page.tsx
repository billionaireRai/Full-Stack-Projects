'use client'

import React, { useState , useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import PostCard from '@/components/postcard'
import { Flame, TrendingUp, Gamepad2, Briefcase, MoreHorizontal, Bookmark, ArrowDownUp, Shuffle, ArrowDown, ArrowUp, Heart, MessageCircle, Repeat, Eye, Check, Users} from 'lucide-react'
import TrendingCard from '@/components/trendingcard'
import UserCard from '@/components/usercard'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import axiosInstance from '@/lib/interceptor'

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
  const pageHandle = decodeURIComponent(String(params.username)) ;
  const [bookmarkOptionsOpen, setBookmarkOptionsOpen] = useState<boolean>(false);
  const [selectedSort, setSelectedSort] = useState<string>('newest');
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
  async function getPostsAndSuggestions() {
    try {
      const apires = await axiosInstance.get('/api/bookmark');
      if (apires.status === 200) {
        setPostDetails(apires.data.posts);
        setWhoToFollow(apires.data.suggestions);
      }
    } catch (error) { 
      console.log("An Error Occured :",error);
    }
  }

  useEffect(() => {
  // getPostsAndSuggestions() ; // calling the fetching functions
  }, [])
  

  return (
    <div className='h-fit flex flex-row gap-4 font-poppins rounded-lg p-4 dark:bg-black'>
      <div className='leftContainer flex flex-col flex-1 rounded-lg'>
           <header className="sticky w-full top-0 z-10 backdrop-blur-md border-b rounded-lg mb-4 border-gray-300 dark:border-gray-800 bg-white/90 dark:bg-black/90 shadow-lg">
             <div className="p-2">
               <div className="flex items-center relative gap-2">
                 <button
                   onClick={() => { router.back() }}
                   className="p-1 hover:bg-gray-100 dark:hover:bg-gray-950 cursor-pointer rounded-full transition-all duration-200 hover:scale-105">
                   <Image src='/images/up-arrow.png' width={30} height={30} alt='back-arrow' className='-rotate-90 dark:invert' />
                 </button>
                 <div className="ml-4">
                    <h1 className="text-xl font-bold">Saved Posts<span className='text-yellow-400 p-3 dark:text-blue-500'>{PostDetails.length}</span></h1>
                  <Link href={`/${pageHandle}`} className="text-sm px-3 py-1 rounded-lg w-fit hover:bg-gray-100 transition-all duration-300 dark:hover:bg-gray-950 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">{pageHandle}</Link>
                 </div>
                  <div className='absolute right-0 mx-3 flex items-center gap-2'>
                      <p className="text-sm text-black hidden dark:text-gray-400 truncate sm:block sm:w-[170px] lg:w-fit">Posts you've saved for future</p>
                      <Bookmark width={20} height={20} className='fill-black stroke-black dark:fill-white dark:stroke-white'/>
                  </div>
                </div>
                  <div className='flex items-center justify-end gap-1'>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button 
                        onClick={() => { handleReversePostOrder() }}
                        type="button" className='cursor-pointer p-2 rounded-full hover:bg-yellow-100 dark:hover:bg-gray-950'>
                          <ArrowDownUp/>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>Reverse post order</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button 
                        onClick={() => { handleShufflePosts() }}
                        type="button" className='cursor-pointer p-2 rounded-full hover:bg-yellow-100 dark:hover:bg-gray-950'>
                          <Shuffle/>
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
                            <MoreHorizontal/>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>More options</TooltipContent>
                      </Tooltip>
                      {bookmarkOptionsOpen && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }} 
                        className="absolute right-0 mt-2 w-56 bg-white dark:bg-black rounded-lg shadow-lg dark:shadow-gray-800 border border-gray-200 dark:border-gray-700 z-50 p-2">
                          <button
                            onClick={() => { setSelectedSort('newest'); setBookmarkOptionsOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-2 text-sm rounded-lg cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-950 ${selectedSort === 'newest' ? 'bg-gray-50 dark:bg-gray-950' : ''}`}
                          >
                            <ArrowDown size={16}  />
                            <span>Newest first</span>
                            {selectedSort === 'newest' && <Check size={16} className="ml-auto stroke-2" />}
                          </button>
                          <button
                            onClick={() => { setSelectedSort('oldest'); setBookmarkOptionsOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-2 text-sm rounded-lg cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-950 ${selectedSort === 'oldest' ? 'bg-gray-50 dark:bg-gray-950' : ''}`}
                          >
                            <ArrowUp size={16} />
                            <span>Oldest first</span>
                            {selectedSort === 'oldest' && <Check size={16} className="ml-auto" />}
                          </button>
                          <button
                            onClick={() => { setSelectedSort('likes'); setBookmarkOptionsOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-2 text-sm rounded-lg cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-950 ${selectedSort === 'likes' ? 'bg-gray-50 dark:bg-gray-950' : ''}`}
                          >
                            <Heart size={16} />
                            <span>Most liked</span>
                            {selectedSort === 'likes' && <Check size={16} className="ml-auto" />}
                          </button>
                          <button
                            onClick={() => { setSelectedSort('comments'); setBookmarkOptionsOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-2 text-sm rounded-lg cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-950 ${selectedSort === 'comments' ? 'bg-gray-50 dark:bg-gray-950' : ''}`}
                          >
                            <MessageCircle size={16} />
                            <span>Most commented</span>
                            {selectedSort === 'comments' && <Check size={16} className="ml-auto" />}
                          </button>
                          <button
                            onClick={() => { setSelectedSort('reposts'); setBookmarkOptionsOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-2 text-sm rounded-lg cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-950 ${selectedSort === 'reposts' ? 'bg-gray-50 dark:bg-gray-950' : ''}`}
                          >
                            <Repeat size={16} />
                            <span>Most reposted</span>
                            {selectedSort === 'reposts' && <Check size={16} className="ml-auto" />}
                          </button>
                          <button
                            onClick={() => { setSelectedSort('views'); setBookmarkOptionsOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-2 text-sm rounded-lg cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-950 ${selectedSort === 'views' ? 'bg-gray-50 dark:bg-gray-950' : ''}`}
                          >
                            <Eye size={16} />
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
      </div>
      <div className='rightContainer hidden lg:block w-96'>
        <div className='space-y-4'>
              {/* What's happening */}
              <div className='bg-gray-50 p-2 dark:bg-black rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg transition-shadow duration-300'>
                <div className='px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center'>
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

              {/* Who to Follow */}
              <div className='relative bg-white dark:bg-black rounded-xl shadow-lg'>
                <div className='p-4 m-2 border-b rounded-md flex gap-2 items-center border-gray-200 dark:border-gray-700'>
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
    </div>
  )
}
