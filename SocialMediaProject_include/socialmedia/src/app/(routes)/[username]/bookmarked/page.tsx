'use client'

import React, { useState , useEffect , useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { motion , AnimatePresence } from 'framer-motion'
import PostCard from '@/components/postcard'
import Activebeep from '@/components/activebeep'
import { featureDemoType } from '../feed/page'
import { MoreHorizontal, Bookmark, ArrowDownUp, Shuffle, ArrowDown, ArrowUp, Heart, MessageCircle, Repeat, Eye, Check, Users , SparklesIcon , CalendarClockIcon , InfinityIcon, ArrowBigUpIcon } from 'lucide-react'
import UserCard, { userCardProp } from '@/components/usercard'
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
  const [bookmarkOptionsOpen, setBookmarkOptionsOpen] = useState<boolean>(false);
  const [selectedSort, setSelectedSort] = useState<string>('newest');

  // pagination variables...
  const PageRef = useRef<number>(1);
  const hasMorePostsRef = useRef<boolean>(true);
  const isFetchingPostsRef = useRef<boolean>(false);
  const [loadingSugg, setloadingSugg] = useState<boolean>(false);
  const [loadingPosts, setloadingPosts] = useState<boolean>(false);
  const [ShowLess, setShowLess] = useState<boolean>(false);
  const [suggesstionNum, setsuggesstionNum] = useState<number>(4);

  // sample follow suggesstions...
  const [whoToFollow, setWhoToFollow] = useState<userCardProp[]>([])

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

const [PostDetails, setPostDetails] = useState<PostType[]>([])

  // pure sort helper - never triggers state updates, just returns a sorted copy...
  const applySortToPosts = useCallback((posts: PostType[], sort: string): PostType[] => {
    const sortedPosts = [...posts];
    switch (sort) {
      case 'newest':
        return sortedPosts.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
      case 'oldest':
        return sortedPosts.sort((a, b) => new Date(a.postedAt).getTime() - new Date(b.postedAt).getTime());
      case 'likes':
        return sortedPosts.sort((a, b) => b.likes - a.likes);
      case 'comments':
        return sortedPosts.sort((a, b) => b.comments - a.comments);
      case 'reposts':
        return sortedPosts.sort((a, b) => b.reposts - a.reposts);
      case 'views':
        return sortedPosts.sort((a, b) => b.views - a.views);
      default:
        return sortedPosts;
    }
  }, []);

  // ref mirroring selectedSort so the stable fetch callback can always sort correctly...
  const selectedSortRef = useRef<string>('newest');

  // function handling reversing post order...
  function handleReversePostOrder() {
    setPostDetails((prevPosts) => [...prevPosts].reverse());
  }

  // function handling shuffling posts...
  function handleShufflePosts() {
    setPostDetails((prevPosts) => [...prevPosts].sort(() => Math.random() - 0.5));
  }

  // user-triggered sort change (no useEffect involved, so no infinite loop)...
  function handleSortChange(sort: string) {
    selectedSortRef.current = sort;
    setSelectedSort(sort);
    setBookmarkOptionsOpen(false);
    setPostDetails((prevPosts) => applySortToPosts(prevPosts, sort));
  }

  // function for api triggering...
  const getBookmarkPosts = useCallback(async() => {
    if (isFetchingPostsRef.current || !hasMorePostsRef.current) return;
    isFetchingPostsRef.current = true;
    setloadingPosts(true);
    
    try {
      const bookmarkApi = await axiosInstance.post('/api/bookmark',{ Page: PageRef.current , Size });
      if (bookmarkApi.data.success || bookmarkApi.status === 200) {
        // backend already returns posts in the PostType shape expected by this page...
        const fetchedPosts : PostType[] = bookmarkApi.data.posts ;
        hasMorePostsRef.current = bookmarkApi.data.hasMore ;
        setPostDetails((prevPosts) => {
          const merged = [...prevPosts];
          for (const post of fetchedPosts) {
            if (!merged.some((p) => p.id === post.id)) {
              merged.push(post);
            }
          }
          return applySortToPosts(merged, selectedSortRef.current);
        });
      }
    } catch (error) { 
      console.log("An Error Occured :",error);
    } finally {
      isFetchingPostsRef.current = false;
      setloadingPosts(false);
    }
  },[applySortToPosts])

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
  }, [getBookmarkPosts])


  // fetching posts by pagination (scroll listener registered once via useRef-managed handler)...
  useEffect(() => {
     const section = postsSection.current ;
     if (!section) return ;
     
     const handleScroll = () => {
       const distanceFromBottom = section.scrollHeight - section.scrollTop - section.clientHeight ;
       if (distanceFromBottom <= autoHeightGap && hasMorePostsRef.current && !isFetchingPostsRef.current) {
         getBookmarkPosts();
         PageRef.current = PageRef.current + 1;
       }
      }
      // calling scroll function to pre-fill if content is shorter than the viewport...
      handleScroll() ;
       
      section.addEventListener('scroll', handleScroll, { passive: true })
      return () => {
      section.removeEventListener('scroll', handleScroll)
     }
  }, [autoHeightGap,getBookmarkPosts])
  
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
                            onClick={() => handleSortChange('newest')}
                            className={`w-full flex items-center gap-3 px-4 py-2 text-sm rounded-lg cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-950 ${selectedSort === 'newest' ? 'bg-gray-50 dark:bg-gray-950' : ''}`}
                          >
                            <ArrowDown size={20}  />
                            <span>Newest first</span>
                            {selectedSort === 'newest' && <Check size={16} className="ml-auto stroke-2" />}
                          </button>
                          <button
                            onClick={() => handleSortChange('oldest')}
                            className={`w-full flex items-center gap-3 px-4 py-2 text-sm rounded-lg cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-950 ${selectedSort === 'oldest' ? 'bg-gray-50 dark:bg-gray-950' : ''}`}
                          >
                            <ArrowUp size={20} />
                            <span>Oldest first</span>
                            {selectedSort === 'oldest' && <Check size={16} className="ml-auto" />}
                          </button>
                          <button
                            onClick={() => handleSortChange('likes')}
                            className={`w-full flex items-center gap-3 px-4 py-2 text-sm rounded-lg cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-950 ${selectedSort === 'likes' ? 'bg-gray-50 dark:bg-gray-950' : ''}`}
                          >
                            <Heart size={20} />
                            <span>Most liked</span>
                            {selectedSort === 'likes' && <Check size={16} className="ml-auto" />}
                          </button>
                          <button
                            onClick={() => handleSortChange('comments')}
                            className={`w-full flex items-center gap-3 px-4 py-2 text-sm rounded-lg cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-950 ${selectedSort === 'comments' ? 'bg-gray-50 dark:bg-gray-950' : ''}`}
                          >
                            <MessageCircle size={20} />
                            <span>Most commented</span>
                            {selectedSort === 'comments' && <Check size={16} className="ml-auto" />}
                          </button>
                          <button
                            onClick={() => handleSortChange('reposts')}
                            className={`w-full flex items-center gap-3 px-4 py-2 text-sm rounded-lg cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-950 ${selectedSort === 'reposts' ? 'bg-gray-50 dark:bg-gray-950' : ''}`}
                          >
                            <Repeat size={20} />
                            <span>Most reposted</span>
                            {selectedSort === 'reposts' && <Check size={16} className="ml-auto" />}
                          </button>
                          <button
                            onClick={() => handleSortChange('views')}
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
                {whoToFollow?.map((usercard,index) =>
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
