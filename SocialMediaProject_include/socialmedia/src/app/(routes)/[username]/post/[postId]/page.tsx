'use client'

import React, { useState , useEffect, useRef, useMemo, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useParams } from 'next/navigation'
import { Target, Heart, Clock, Archive, Users, Check, TrendingUp, Eye, MessageSquare, Bookmark, ChevronDown, ArrowDownUp , Shuffle , MessagesSquareIcon, UsersRound } from 'lucide-react'
import PostCard from '@/components/postcard'
import Activebeep from '@/components/activebeep'
import Commentpopcard from '@/components/Commentpopcard'
import Usercard from '@/components/usercard'
import PostMetricsPage from '@/components/postmetrics'
import { userCardProp } from '@/components/usercard'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import axiosInstance from '@/lib/interceptor'
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

export default function PostPage() {
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
  // const [PostInfo, setPostInfo] = useState<PostType | null>(null);
  const [CommentCardProp, setCommentCardProp] = useState<boolean>(false) ;
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

  const NavOptions:navOptionsType[] = useMemo(() => [
    { label: 'metric', value: 'Metric' },
    { label: 'bookmark', value: 'Bookmark' },
    { label: 'comments', value: 'Comments' },
    { label:'replies' , value:'Replies'},
    { label: 'views', value: 'Views' },
    { label: 'likes', value: 'Likes' }
  ], []);

  // for storing the post details...
  const [POST, setPOST] = useState<PostType | null>() ; // for storing post details...

    const [whoToFollow, setWhoToFollow] = useState<userCardProp[]>([])
  
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

  const [Comments, setComments] = useState<PostType[]>([])
  const [RepliedPosts, setRepliedPosts] = useState<RepliedPostsType[]>([])
  const [bookmarkAccs,setbookmarkAccs] = useState<userCardProp[]>([]);
  const [viewedAccs,setviewedAccs] = useState<userCardProp[]>([]);
  const [likedAccs,setlikedAccs] = useState<userCardProp[]>([]);

  // account information of this page...
  const [AccInfo, setAccInfo] = useState<userCardProp>();
  
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
  }, [NavOptions,searchparam,username])

  const handleChangeFilterState = (category:string) : void => { 
    if (category !== currentFilter) setcurrentFilter(category) ;
   } 
   
   // useffect for getting page essential data...
   useEffect(() => {
    async function fetchPostData() {
      const handle = decodeURIComponent(String(username)).substring(1);
      const response = await axiosInstance.post('/api/post/essentials', { postId: String(postId),username: handle });
      if (response.status == 200) {
        setPOST(response.data.mainPost);
        setAccInfo(response.data.releventAcc);
        setWhoToFollow(response.data.suggestions);
      }
    }

    fetchPostData() ;
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
  const getAllCommentsOfPost = useCallback( async () => {
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
   },[postId,commentpage])

  // function getting replies on comment...
  const getRepliesOnComments = useCallback(async () => {
    try {
      const apiResponse = await axiosInstance.get(`/api/post/replies?postid=${postId}&page=${commentpage}&size=${pagesize.current}`);
      if (apiResponse.status === 200)  {
        setRepliedPosts(apiResponse.data.replies);
        sethasreplies(apiResponse.data.hasNext);
      }
    } catch (error) {
      console.log(error);
      toast.error('An error occured...')
    }
   },[postId,commentpage])

   // getting the bookmarks...
   useEffect(() => {
    fetchingNavSpecificData(setbookmarkAccs,sethasbookmark,String(postId),'/api/post/bookmarks',bookmarkpage);
   }, [bookmarkpage,pagesize,postId])

   // getting the views...
   useEffect(() => {
   fetchingNavSpecificData(setviewedAccs,sethasviews,String(postId),'/api/post/views',viewspage);
   }, [viewspage,pagesize,postId])

   // getting all the likes
   useEffect(() => {
   fetchingNavSpecificData(setlikedAccs,sethaslikes,String(postId),'/api/post/likes',likespage);
   }, [likespage,pagesize,postId])
 
   // getting all the comments...
   useEffect(() => {
    getAllCommentsOfPost() ;
   }, [commentpage,pagesize,getAllCommentsOfPost])

   // getting all the replies..
   useEffect(() => {
    getRepliesOnComments() ;
   }, [repliespage,pagesize,getRepliesOnComments])
   
   
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
       if (openFilter && !(event.target as Element).closest('.filters')) {
         setopenFilter(false)
       }
    }
        
    if (openFilter) {
      document.addEventListener('mousedown', handleClickOutside)
    }
        
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [openFilter])

  
  return (
    <>
    <div className='h-screen flex flex-col-reverse md:flex-row gap-1 font-poppins rounded-md p-2 dark:bg-black'>
      <div className='mainSection h-full overflow-y-auto flex-2 rounded-md'>
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
            <div className='rounded-lg flex items-center gap-3 px-4 py-3 text-xl font-semibold shadow-md bg-yellow-50 dark:bg-yellow-950/10 border-l-4 border-yellow-400 dark:border-yellow-500 text-gray-900 dark:text-white'>
              <TrendingUp className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />
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
                <MessagesSquareIcon className="w-6 h-6 text-yellow-500" />
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
                onClick={() => { setcommentpage(commentpage + 1) }}
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
                    <div className='rounded-lg flex items-center justify-between gap-3 px-4 py-3 my-5 text-xl font-semibold shadow-md bg-yellow-50 dark:bg-blue-950/10 border-l-4 border-yellow-400 text-gray-900 dark:text-white'>
                       <div className='flex items-center gap-2'>
                         <MessageSquare className="w-6 h-6 text-yellow-500" />
                         <span>Replied To</span>
                       </div>
                       <div className='flex items-center gap-1'>
                         <Tooltip>
                           <TooltipTrigger asChild>
                             <button 
                             onClick={() => { handleReversePostOrder(RepliedPosts,setRepliedPosts) }}
                             type="button" className='cursor-pointer p-2 rounded-full hover:bg-yellow-100 dark:hover:bg-gray-950'>
                               <ArrowDownUp/>
                             </button>
                           </TooltipTrigger>
                           <TooltipContent>Reverse post order</TooltipContent>
                         </Tooltip>
                         <Tooltip>
                           <TooltipTrigger asChild>
                             <button 
                             onClick={() => { handleShufflePosts(RepliedPosts,setRepliedPosts) }}
                             type="button" className='cursor-pointer p-2 rounded-full hover:bg-yellow-100 dark:hover:bg-gray-950'>
                              <Shuffle/>
                            </button>
                           </TooltipTrigger>
                           <TooltipContent>Shuffle posts</TooltipContent>
                         </Tooltip>
                       </div>
                     </div>
                      {RepliedPosts?.map((post: RepliedPostsType) => (
                        <div key={post.id} className="dark:bg-black rounded-xl p-4 border border-gray-200 dark:border-gray-900 transition-shadow">
                          <div className="flex space-x-3">
                            <img
                              src={post.avatar}
                              alt='owner-profile-avatar'
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
                onClick={() => { setrepliespage(repliespage + 1) }}
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
                onClick={() => { setviewspage(viewspage + 1) }}
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
               onClick={() => { setlikespage(likespage + 1) }}
               disabled={!haslikes}
               className='flex items-center justify-center gap-2 p-3 my-2 mx-1 w-fit rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold hover:scale-95 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer'>
                 <ChevronDown className="w-4 h-4" />
               </button>
             </div>
            </>
          )}
        </div>
      </div>
      <div className='rightContainer overflow-y-auto h-full flex-1 flex flex-col gap-2 bg-white dark:bg-black rounded-lg p-2'>
         <Usercard decodedHandle={AccInfo?.decodedHandle} account={AccInfo?.account} IsFollowing={AccInfo?.IsFollowing} name={AccInfo?.name} content={AccInfo?.content} 
         heading={
          <div className='flex items-center justify-start gap-3 p-2'>
            <UsersRound size={20} />
            <h2 className="text-lg font-semibold">Relevant people</h2>
          </div>
          }
          />
          <div className='relative bg-white dark:bg-black rounded-xl'>
             <div className='p-4 m-2 border-b rounded-md flex gap-2 items-center border dark:border-gray-700'>
              <Users size={20} /><h2 className='text-xl font-bold text-gray-900 dark:text-white'>Suggestions</h2>
            </div>
             <div className='p-4'>
              {whoToFollow?.map((user, index) =>
                 index < suggesstionNum && (
                  <div key={index} className='flex items-center justify-between mb-2'>
                    <Usercard {...user} content={null} />
                  </div>
                 )
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
          <div className='bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-900'>
             {/* card to subscribe... */}
              <div className='bg-white dark:bg-black rounded-xl flex flex-col gap-2 border p-4 border-gray-200 dark:border-gray-900'>
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
                  <Link href='/subscription?plan=Pro&term=Monthly&utm_source=feed-page' className='w-fit rounded-lg'>
                    <button className='cursor-pointer w-fit py-2 px-4 mt-1 font-semibold hover:shadow-md shadow-sm shadow-yellow-100 dark:shadow-yellow-900 dark:bg-yellow-500 bg-yellow-400 transition-shadow duration-300 rounded-lg'>Subscribe</button>
                   </Link>
              </div>
          </div>
      </div>
    </div>
    { CommentCardProp && ( <Commentpopcard postId={String(POST?.id)} avatar={POST?.avatar} name={POST?.username} handle={POST?.handle}  timestamp={POST?.postedAt} content={POST?.content} media={POST?.mediaUrls} handleClose={() => { setCommentCardProp(false) }}/> )}
    </>
  )
}
