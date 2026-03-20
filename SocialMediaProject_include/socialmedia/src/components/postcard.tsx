'use client'

import React, { useState, useEffect, useRef , ReactElement } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  MoreVerticalIcon,
  Trash2,
  Edit3,
  Pin,
  Star,
  List,
  MessageCircle,
  BarChart3,
  Code,
  TrendingUp,
  FileText,
  Share2,
  Mail,
  Link as LinkIcon,
  X,
  SendHorizontalIcon,
  Heart,
  Repeat,
  Eye,
  Bookmark,
  EyeOff,
  VolumeX,
  Slash,
  Flag,
  Frown,
  UserPlus,
  ListPlus,
  Ban,
  Code2,
  Megaphone,
  PodcastIcon,
  DollarSign
} from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';
import { AxiosResponse } from 'axios';
import axiosInstance from '@/lib/interceptor';
import { useRouter } from 'next/navigation';
import useActiveAccount from '@/app/states/useraccounts';
import Commentpopcard from './Commentpopcard';
import RequireSubscription from './requireSubscription';
import useUpgradePop from '@/app/states/upgradePop';
import Shareviadm from './shareviadm';
import ReportPop from './reportPop';
import PinPostPop from './pinpostpop';
import AccountDetailPop from './accountdetailpop';
import { pollInfoType } from '@/app/states/poll';
import ViewClickPop from './viewClickPop';
import toast from 'react-hot-toast';
import EditPostPop from './editPostpop';
import DeletePostPop from './deletepostpop';
import HighlightPostPop from './highlightpostPop';
import FavouriteAddPop from './favouriteAddPop';
import BlockUser from './blockUser';
import IframeOfEmbed from './iframeOfEmbed';
import NotInterestedPop from './NotInterestedPop';
import SharePopup from './sharePopUp';

interface locationTaggedType {
  text: string,
  coordinates: number[]
}
interface mediaType {
  url: string;
  media_type: string;
}
export interface PostCardProps {
  postId:string;
  avatar?: string;
  cover?:string
  username?: string;
  handle?: string;
  bio?:string
  userliked?:boolean,
  usereposted?:boolean,
  usercommented?:boolean,
  userbookmarked?:boolean,
  isPinned?:boolean,
  isVerified?:boolean,
  plan?:string,
  followers?:string,
  following?:string,
  timestamp?: string;
  content?: string;
  media?: mediaType[];
  likes?: number;
  reposts?: number;
  replies?: number;
  shares?: number;
  views?: number;
  taggedLocation?:locationTaggedType[],
  poll?:pollInfoType;
  hashTags?: string[];
  mentions?: string[];
  showActions?:boolean;
  isHighlighted?:boolean
  isFollowing?:boolean;
  readOnly?:boolean;
  fromPage?:"feed" | "profile" | "direct" | "explore";
}

interface actionType {
  icon:ReactElement ,
  label:string ,
  value?:number
}

export default function PostCard({
  postId = '#EWR$%^FGH*(8uyg',
  avatar = '/images/myProfile.jpg',
  cover='https://img.freepik.com/premium-photo/wide-banner-with-many-random-square-hexagons-charcoal-dark-black-color_105589-1820.jpg',
  username = 'Amritansh Rai',
  bio='Emma just hehe my way thru life...',
  handle = 'amritansh_coder',
  followers='327k',
  following='177',
  userliked=false,
  usereposted=false,
  usercommented=false,
  userbookmarked=false,
  isPinned=false,
  isVerified=false,
  timestamp = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).toLocaleLowerCase(),
  content = 'I am planning to buy a new laptop, as my old one has become trash. Wants recommendation of you guys',
  media=[],
  likes = 0,
  reposts = 0,
  replies = 0,
  views = 0,
  taggedLocation=[],
  poll=undefined,
  hashTags = [],
  mentions = [],
  showActions = true,
  isHighlighted = false,
  isFollowing=false,
  readOnly=false,
  fromPage='feed'
}: PostCardProps) {
  const displayMedia = media || [];

  const router = useRouter() ;
  const { Account } = useActiveAccount() ;
  const { setisPop , isPop } = useUpgradePop() ; // upgrade pop handler... 
  const [postOptions, setPostOptions] = useState<boolean>(false);
  const [showAccountPopup, setShowAccountPopup] = useState<boolean>(false);
  const [viewPop, setviewPop] = useState<boolean>(false) ;
  const [ToPinPop, setToPinPop] = useState(false);
  const [planIntent, setplanIntent] = useState<string>('Pro');
  const [showBlockPop, setshowBlockPop] = useState<boolean>(false);
  const [isBlocked, setisBlocked] = useState<boolean>(false);
  const [IsFollowing, setIsFollowing] = useState<boolean>(isFollowing);
  const [CommentCardPop, setCommentCardPop] = useState<boolean>(false) ;
  const [showReportPop, setshowReportPop] = useState<boolean>(false);
  const [ShareAccrosApp, setShareAccrosApp] = useState<boolean>(false);
  const [BlurPost, setBlurPost] = useState<boolean>(false);
  const [ShowDeletePop, setShowDeletePop] = useState<boolean>(false);
  const [showEditPostPop, setshowEditPostPop] = useState<boolean>(false);
  const [HighlighPop, setHighlighPop] = useState<boolean>(false);
  const [FavouritePop, setFavouritePop] = useState<boolean>(false);
  const [shareCardPop, setshareCardPop] = useState<boolean>(false) ;
  const [ShareDropDown, setShareDropDown] = useState<boolean>(false);
  const [showEmbedPop, setshowEmbedPop] = useState<boolean>(false);
  const [NotInterested, setNotInterested] = useState<boolean>(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0 , left: 0 });
  const [sharePosition, setSharePosition] = useState({ top: 0, left: 0 });
  const postref = useRef<HTMLDivElement>(null) ;
  const avatarRef = useRef<HTMLImageElement>(null);
  const shareRef = useRef<HTMLButtonElement>(null);

  // Reusable click-outside handler
  const useClickOutside = (handlers: { isOpen: boolean; selector: string; setOpen: (value: boolean) => void }[]) => {
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        handlers.forEach(({ isOpen, selector, setOpen }) => {
          if (isOpen && !(event.target as Element).closest(selector)) {
            setOpen(false);
          }
        });
      };

      const hasOpenHandlers = handlers.some(({ isOpen }) => isOpen);
      if (hasOpenHandlers) {
        document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [handlers]);
  };

  // Using reusable click-outside...
  useClickOutside([
    { isOpen: postOptions, selector: '.dropdown-container', setOpen: setPostOptions },
    { isOpen: ShareDropDown, selector: '.share-dropdown', setOpen: setShareDropDown },
  ]);

  // states related to actions of each post...
  const [isLiked, setIsLiked] = useState<boolean>(userliked);
  const [localLikes, setLocalLikes] = useState<number>(likes);
  const [isReposted, setIsReposted] = useState<boolean>(usereposted);
  const [localReposts, setLocalReposts] = useState<number>(reposts);
  const [isCommented, setIsCommented] = useState<boolean>(usercommented);
  const [localComments, setLocalComments] = useState<number>(replies);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(userbookmarked);
  const [IsHighlighted, setIsHighlighted] = useState<boolean>(isHighlighted);
  const [IsPinned, setIsPinned] = useState<boolean>(isPinned);


  const actions : actionType[] = [
      { icon: <MessageCircle className={`w-5 h-5 group-active:animate-caret-blink ${isCommented ? 'fill-yellow-500 text-yellow-500 dark:fill-yellow-500 dark:text-yellow-500' : ''}`} />, label: "Comment", value: localComments },
      { icon: <Repeat className={`w-5 h-5 group-active:animate-accordion-down transition-all duration-500 ${isReposted ? 'stroke-yellow-500 dark:stroke-yellow-500' : ''}`} />, label: "Repost", value: localReposts },
      { icon: <Heart className={`w-5 h-5 group-active:animate-ping ${isLiked ? 'fill-yellow-500 text-yellow-500 dark:fill-yellow-500 dark:text-yellow-500' : ''}`} />, label: "Like", value: localLikes },
      { icon: <Eye className="w-5 h-5 group-active:scale-125 transition-all duration-300" />, label: "Views", value: views },
      { icon: <Bookmark className={`w-5 h-5 group-active:animate-ping ${isBookmarked ? 'fill-yellow-500 text-yellow-500 dark:fill-yellow-500 dark:text-yellow-500' : ''} `} />, label: "Bookmark" },
      { icon: <Share2 className={'w-5 h-5'} />, label: "Share", }
  ]
  const generalImage = '/images/broken-laptop.jpg';

  // Function to parse content and make hashtags and mentions clickable...
 function parseHashAndMentions (hashTags: string[], mentions: string[]) : ReactElement[] {
    let combinedArray: ReactElement[] = [] ;
    // looping through hashtag array...
    hashTags.forEach((eachHash) => {
      combinedArray.push(
        <Link
          key={`hash-${eachHash}`}
          href={`/explore?q=${encodeURIComponent('#'.concat(eachHash))}&utm_source=post-click`}
          className="dark:text-blue-500 dark:hover:text-blue-700 text-yellow-500 hover:text-yellow-600 font-medium transition-colors cursor-pointer mr-2"
        >
          #{eachHash}
        </Link>
      )
    });
    // looping through mentions array...
    mentions.forEach((eachMention) => {
      combinedArray.push(
        <Link
          key={`mention-${eachMention}`}
          href={`/@${eachMention}`}
          className="dark:text-blue-500 dark:hover:text-blue-700 text-yellow-500 hover:text-yellow-600 font-medium transition-colors cursor-pointer mr-2"
        >
          @{eachMention}
        </Link>
      )
    });

    return combinedArray;
  }

  // function handling repost logic...
  async function handleRepostToggle() {
    const loading = toast.loading( isReposted ? 'Removing the repost...' : 'Reposting the post...');
    try {
      const repostApi = await axiosInstance.get(`/api/post/actions?postId=${postId}&state=${isReposted}`);
      if (repostApi.status === 200) {
        toast.dismiss(loading);
        setIsReposted(!isReposted);
        setLocalReposts(isReposted ? localReposts - 1 : localReposts + 1);
        toast.success('Repost toggled successfully !!');
      }
    } catch (error) {
      toast.error('Error in repost action !!')
    }
  }

  // function to handle liking...
  async function handlePostLike() {
    try {
      const likeapi = await axiosInstance.put(`/api/post/actions`,{ postId , isLiked });
      if (likeapi.status === 200) {
        setIsLiked(!isLiked);
        setLocalLikes(isLiked ? localLikes - 1 : localLikes + 1);
      }
    } catch (error:any) {
      console.log("An error occured !!");
      return Error(error);
    }

  }

  // function handling bookmark logic...
  async function handlePostBookmark() {
    try {
      const bookmarkApi = await axiosInstance.patch(`/api/post/actions`,{ postId , isBookmarked }); // making axios request...
      if (bookmarkApi.status === 200) {
        setIsBookmarked(!isBookmarked);
        toast.success('Post successfully bookmarked');
      }
    } catch (error:any) {
      console.log("An error occured !!");
      toast.error('Error occured in bookmarking !!');
      return Error(error);
    }  
  }

  // function handling action click...
  const actionClick = (action : actionType) => {
    if(readOnly) {
      toast.loading('Redirecting to post page...');
      router.push(`/@${handle}/post/${postId}`);
    }
    if (action.label === 'Comment') setCommentCardPop(true)  ; // after successfull commmenting , will edit comment ui...
      else if (action.label === 'Like') {
        handlePostLike()
      }
      else if (action.label === 'Bookmark') {
        handlePostBookmark();
      }
      else if (action.label === 'Views') setviewPop(true) ;
      else if (action.label === 'Share') { // same with share as well...
         if (shareRef.current) {
           const rect = shareRef.current.getBoundingClientRect();
           const dropdownWidth = 200; // approximate width...
           let left = rect.left + window.scrollX;
           if (left + dropdownWidth > window.innerWidth) {
             left = rect.right + window.scrollX - dropdownWidth;
           }
           setSharePosition({
             top: rect.bottom + window.scrollY + 5,
             left: left
           });
         }
         setShareDropDown(true);

      }
      else {
        handleRepostToggle() ;
      }
   }

  // handle avatar hover logic...
  const handleAvatarHover = () => {
    if (avatarRef.current) {
      const rect = avatarRef.current.getBoundingClientRect();
      setPopupPosition({
        top: rect.bottom + window.scrollY ,
        left: rect.left + window.scrollX + rect.width / 2
      });
      setShowAccountPopup(true);
    }
  };

  // handle copy link of a post...
  const handleCopyLink = () => { 
    navigator.clipboard.writeText(`http://localhost:3000/@${handle}/post/${postId}?section=All`)  ;
    setShareDropDown(false) ;
    toast.success("Post link successfully copied !")  
   }

  const handleAvatarLeave = () => { setShowAccountPopup(false); };

  // post edit handler...
  const handleEditingPost = async () => { 
    if (!Account.account?.isVerified)  setisPop(true) ; // showing upgrade pop up if not verified...
    else {
      setshowEditPostPop(true)
    }
   }

   // favourite add handle...
   const handleAddFavourite = async () => {
    if (!Account.account?.isVerified) setisPop(true);
    else {
      setFavouritePop(true);
    }
   }

  // function for handling commenting state...
  const handleCommentStateUpdate = () => {
    setIsCommented(true) ;
    setLocalComments(isCommented ? localComments - 1 : localComments + 1)
  }

  // function for hitting view api...
  // const trackView = async ({ postId, fromPage }: { postId: string; fromPage: string }) => { 
  //   await axiosInstance.post('/api/post/view', { postId, fromPage });
  //  }

  // useffect for view handling...
  //    useEffect(() => {
  //    const observer = new IntersectionObserver(
  //      (entries) => {
  //        entries.forEach(entry => {
  //         if (entry.isIntersecting) {
  //           trackView({ postId , fromPage });
  //         }
  //        });
  //      },
  //      { threshold: 0.6 }
  //    );

  //    if (postref.current) observer.observe(postref.current);

  //    return () => observer.disconnect();
  //  }, []);
    // toggleing follow logic...
    async function handleFollowToggleLogic() {
      const newFollowing = !isFollowing ; // determine the new state...
      const loadingToast = toast.loading(`${newFollowing ? 'Adding to followings !!' : 'Removing from following...'}`)
      try {
        const apires: AxiosResponse = await axiosInstance.get(`/api/user/follow?accounthandle=${handle}&follow=${newFollowing}`); // api response instance...
          if (apires.status === 200) {
            setIsFollowing(newFollowing); // update state immediately on success...
            toast.dismiss(loadingToast);
            toast.success(`${newFollowing ? 'Added to your following...' : 'Removed from following !!'}`);
          } else {
            toast.error('Failed with action...');
          }
      } catch (error) {
        toast.error('Failed with action...');
    }
  }

  if (BlurPost) {
    return (
      <div className="bg-white dark:bg-black shadow-sm hover:shadow-md dark:shadow-gray-900/50 dark:border-0 dark:border-b dark:border-gray-800 rounded-xl border border-gray-100 my-1 sm:p-4">
        <div className="flex items-start gap-3">
          {/* Avatar - blurred/hidden */}
          <div className="relative">
            <img
              src={avatar}
              alt={`${username}'s avatar`}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border border-gray-200 dark:border-gray-700 blur-sm opacity-60"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
              <EyeOff className="w-5 h-5 text-black dark:text-gray-400" />
            </div>
          </div>

          {/* Hidden Post Body */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-semibold text-gray-900 dark:text-gray-100 text-base sm:text-lg truncate">
                {username}
              </span>
              <Link 
                href={`/${handle}`}
                className="text-gray-500 dark:text-gray-400 text-xs sm:text-base truncate"
              >
                {handle}
              </Link>
              <span className="text-gray-400">·</span>
              <span className="text-gray-500 dark:text-gray-400 text-sm truncate">
                {timestamp}
              </span>
            </div>

            {/* Hidden Content Message */}
            <div className="mt-3">
              <div className="flex items-center justify-center py-6 px-4 bg-gray-50 dark:bg-gray-950 rounded-xl border border-gray-100 dark:border-gray-800">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full mb-3">
                    <EyeOff className="w-6 h-6 text-black dark:text-gray-500" />
                  </div>
                  <p className="text-black dark:text-gray-300 text-sm font-medium mb-1">
                    You're not interested in this post
                  </p>
                  <p className="text-gray-500 dark:text-gray-500 text-xs">
                    This post was hidden based on your preferences
                  </p>
                </div>
              </div>
            </div>

            {/* Action to show anyway */}
            <div className="flex justify-center mt-3 pt-2">
              <button
                onClick={() => setBlurPost(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-black dark:bg-white text-white dark:text-black hover:opacity-85 dark:hover:bg-gray-400 rounded-lg transition-colors cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                Show anyway
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div 
      ref={postref}
      className={`bg-white dark:bg-black shadow-sm hover:shadow-gray-400 dark:hover:shadow-gray-900 dark:border-0 dark:border-b dark:border-gray-800 rounded-xl border border-gray-100 ${!showActions ? ' shadow-none m-0 p-3 cursor-none' : 'my-1 sm:p-4'}`}>
        <div className='flex flex-row items-center justify-end gap-1 mb-2 transition-all duration-300'>
         {isReposted && (
           <div className='text-black dark:text-white text-xs font-semibold py-0.5 px-2 shadow-md dark:shadow-gray-800 rounded-lg flex gap-1 items-center justify-center'><Repeat size={20} /><span>you reposted</span></div>
          )}
          { IsPinned && (
            <Tooltip>
               <TooltipTrigger>
                 <span className="inline-flex items-center justify-center w-8 h-8 bg-yellow-100 dark:bg-blue-900/20 rounded-full border     border-yellow-200 dark:border-yellow-800/50">
                   <Pin className="w-5 h-5 rotate-45 fill-yellow-500 stroke-yellow-500" />
                 </span>
               </TooltipTrigger>
               <TooltipContent>
                 Pinned post
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <Link href={`/${handle}`}>
        <img
          ref={avatarRef}
          src={avatar}
          alt={`${username}'s avatar`}
          className={`${!showActions ? 'w-10 h-10' : 'w-12 h-12 sm:w-14 sm:h-14'} border-none rounded-full object-cover border border-gray-200 dark:border-gray-600 cursor-pointer`}
          onMouseEnter={handleAvatarHover}
          onMouseLeave={handleAvatarLeave}
        />
        </Link>

        {/* Post Body */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="relative flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className={`font-semibold text-gray-900 dark:text-gray-100 text-base ${!showActions ? 'text-md' : 'sm:text-lg'} truncate`}>
              {username}
            </span>
            {isVerified && (
              <span><Image src='/images/yellow-tick.png'  width={20} height={20} alt='verified'/></span>
            )}
            <Link 
            href={`/${handle}`}
            className={`text-gray-500 dark:text-gray-400 text-xs sm:text-base truncate`}>
              {handle}
            </Link>
            <span className="text-gray-400">·</span>
            <span className={`text-gray-500 dark:text-gray-400 ${!showActions ? 'text-xs' : 'text-sm'} truncate`}>
              {timestamp}
            </span>

            {/* Options */}
            <Tooltip>
            <TooltipTrigger asChild>
            <button
              onClick={() => { readOnly ? router.push(`/${handle}/post/${postId}`) : setPostOptions(true) } }
              className={`ml-auto rounded-full p-1.5 cursor-pointer transition-colors ${postOptions ? 'bg-gray-100 dark:bg-gray-950' : 'hover:bg-gray-100 dark:hover:bg-gray-950'}`}
            >
              <MoreVerticalIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            </TooltipTrigger>
            <TooltipContent>
              More
            </TooltipContent>
            </Tooltip>
          
          {/* will add ( Account.decodedHandle === handle ) logic and uncomment other...  */}
            {/* {postOptions && (
              <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="dropdown-container font-semibold animate-in slide-in-from-top-2 duration-200 cursor-pointer absolute right-0 top-10 w-fit p-2 bg-white dark:bg-black shadow-gray-700 dark:shadow-gray-900 shadow-lg border border-gray-200 dark:border-gray-900 rounded-xl z-50 overflow-hidden">
                <button
                  onClick={() => { setShowDeletePop(true); }}
                  className={`w-full  flex items-center gap-3 px-4 py-2 rounded-md cursor-pointer text-sm font-medium transition-colors text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950`}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
                <Link href={`/${handle}/post/${postId}?section=All`}
                  className={`w-full  flex items-center gap-3 px-4 py-2 rounded-md cursor-pointer text-sm font-medium transition-colors text-black hover:bg-gray-100 dark:text-white dark:hover:bg-gray-950`}
                >
                    <PodcastIcon className="w-4 h-4" />
                    view full post
                </Link>
                <button
                  onClick={() => { handleEditingPost(); }}
                  className={`w-full flex items-center justify-between px-4 py-2 rounded-md cursor-pointer text-sm font-medium transition-colors text-black hover:bg-gray-100 dark:text-white dark:hover:bg-gray-950`}
                >
                 <div className='flex items-center gap-3'>
                  <Edit3 className="w-4 h-4" />
                  <span>Edit</span>
                 </div>
                 <Image src='/images/yellow-tick.png'  width={20} height={20} alt='verified'/>
                </button>
                <button
                  onClick={() => { setToPinPop(true) }}
                  className={`w-full  flex items-center gap-3 px-4 py-2 rounded-md cursor-pointer text-sm font-medium transition-colors text-black hover:bg-gray-100 dark:text-white dark:hover:bg-gray-950`}
                >
                  <Pin className={`w-4 h-4 ${IsPinned && 'stroke-yellow-400 fill-yellow-400' }`} />
                  { !IsPinned ? 'Pin to profile' : 'Unpin from profile'}
                </button>
                <button
                  onClick={() => { setHighlighPop(true)}}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-md cursor-pointer text-sm font-medium transition-colors text-black hover:bg-gray-100 dark:text-white dark:hover:bg-gray-950`}
                >
                  <Star className={`w-4 h-4 ${(IsHighlighted) ? 'stroke-yellow-500 fill-yellow-600':''}`} />
                  {!IsHighlighted ? "Highlight on profile" : 'UnHighlight on Profile'}
                </button>
                <button
                  onClick={() => { handleAddFavourite() }} 
                  className={`w-full flex items-center justify-between px-4 py-2 rounded-md cursor-pointer text-sm font-medium transition-colors text-black hover:bg-gray-100 dark:text-white dark:hover:bg-gray-950`}
                >
                 <div className='flex items-center gap-3 mr-3'>
                  <List className="w-4 h-4" />
                  <span>Add to favourite</span>
                 </div>
                 <Image src='/images/yellow-tick.png'  width={20} height={20} alt='verified'/>
                </button>
                <Link
                  href={`/${handle}/post/${postId}?section=Metric`}
                  className={`w-full  flex items-center gap-3 px-4 py-2 rounded-md cursor-pointer text-sm font-medium transition-colors text-black hover:bg-gray-100 dark:text-white dark:hover:bg-gray-950`}
                >
                  <BarChart3 className="w-4 h-4" />
                  View post analytics
                </Link>
              </motion.div>
            )} */}
            {/* && Account.decodedHandle !== handle */}
            {postOptions  && (
             <motion.div 
             initial={{ opacity: 0, scale: 0.8 }}
             animate={{ opacity: 1, scale: 1 }}
             exit={{ opacity: 0, scale: 0.8 }}  
             className="dropdown-container font-semibold cursor-pointer absolute right-0 top-10 w-fit p-2 bg-white dark:bg-black shadow-gray-700 dark:shadow-gray-900 shadow-lg border border-gray-200 dark:border-gray-900 rounded-xl z-50 overflow-hidden">
                <Link href={`/${handle}/post/${postId}?section=All`}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-md cursor-pointer text-sm font-medium transition-colors text-black hover:bg-gray-100 dark:text-white dark:hover:bg-gray-950`}
                >
                    <PodcastIcon className="w-4 h-4" />
                    view full post
                </Link>
               <button
                onClick={() => { setNotInterested(true) }}
                className={`w-full  flex items-center gap-3 px-4 py-2 rounded-md cursor-pointer text-sm font-medium transition-colors text-black hover:bg-gray-100 dark:text-white dark:hover:bg-gray-950`}
               >
                 <Frown className="h-4 w-4" />
                 Not interested in this post
               </button>
               <button
                onClick={() => { handleFollowToggleLogic() }}
                className={`w-full  flex items-center gap-3 px-4 py-2 rounded-md cursor-pointer text-sm font-medium transition-colors text-black hover:bg-gray-100 dark:text-white dark:hover:bg-gray-950`}
               >
                 <UserPlus className="h-4 w-4" />
                 {isFollowing ? 'Unfollow' : 'Follow'} {handle}
               </button>
               <button
                  onClick={() => { handleAddFavourite() }} 
                  className={`w-full  flex items-center gap-3 px-4 py-2 rounded-md cursor-pointer text-sm font-medium transition-colors text-black hover:bg-gray-100 dark:text-white dark:hover:bg-gray-950`}
               >
                 <ListPlus className="h-4 w-4" />
                 <span>Add to Favourite</span>
                 <Image src='/images/yellow-tick.png'  width={20} height={20} alt='verified'/>
               </button>
               <button
                  onClick={() => { setHighlighPop(true)  }}
                  className={`w-full ${(isHighlighted && ('highlight on profile'.toLowerCase().includes('highlight') || 'unhighlight on profile'.toLowerCase().includes('unhighlight'))) ? 'bg-yellow-100 dark:bg-yellow-950' : ''} flex items-center gap-3 px-4 py-2 rounded-md cursor-pointer text-sm font-medium transition-colors text-black hover:bg-gray-100 dark:text-white dark:hover:bg-gray-950`}
                >
                  <Star className={`w-4 h-4 ${(isHighlighted) ? 'stroke-yellow-500 fill-yellow-600':''}`} />
                  {!isHighlighted ? "Highlight on profile" : 'UnHighlight on Profile'}
                </button>
               <Link href={`/${handle}/post/${postId}?section=Metric`}
                  className={`w-full  flex items-center gap-3 px-4 py-2 rounded-md cursor-pointer text-sm font-medium transition-colors text-black hover:bg-gray-100 dark:text-white dark:hover:bg-gray-950`}
               >
                 <BarChart3 className="h-4 w-4" />
                 View post analytics
               </Link>

              {/* embeding post means controlled remote rendering... */}
               <button
                  onClick={() => { setshowEmbedPop(true); }}
                  className={`w-full  flex items-center gap-3 px-4 py-2 rounded-md cursor-pointer text-sm font-medium transition-colors text-black hover:bg-gray-100 dark:text-white dark:hover:bg-gray-950`}
               >
                 <Code2 className="h-4 w-4" />
                 Embed this post
               </button>
               <button
                  onClick={() => { setshowBlockPop(true) }}
                  className={`w-full  flex items-center gap-3 px-4 py-2 rounded-md cursor-pointer text-sm font-medium transition-colors text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950`}
               >
                 <Ban className="h-4 w-4" />
                  { isBlocked ? 'Unblock' : 'Block' } {handle}
               </button>
               <button
                  onClick={() => { setshowReportPop(true) }}
                  className={`w-full  flex items-center gap-3 px-4 py-2 rounded-md cursor-pointer text-sm font-medium transition-colors text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950`}
               >
                 <Flag className="h-4 w-4" />
                 Report post
               </button>
             </motion.div>
           )}
          </div>

          {/* Content */}
          <div className={`mt-2 text-gray-900 dark:text-gray-100 ${!showActions ? 'text-xs' : 'text-md sm:text-sm'} leading-relaxed`}>
            <div>{content}</div>
            <div className='flex flex-wrap'>{parseHashAndMentions(hashTags, mentions)}</div>
          </div>

          {/* Media */}
          {displayMedia && displayMedia.length > 0 && displayMedia.some(item => item.url && item.url.trim() !== '') && (
            <div className="mt-2 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              {displayMedia.filter(item => item.url && item.url.trim() !== '').length === 1 ? (
                displayMedia[0].media_type === 'video' ? (
                  <Link href={displayMedia[0].url}>
                   <video
                     src={displayMedia[0].url}
                     controls
                     className="w-full max-h-[28rem] object-cover"
                   />
                  </Link>
                ) : (
                  <Link href={displayMedia[0].url}>
                    <img
                     src={displayMedia[0].url}
                     alt="Post media"
                     className="w-full max-h-[28rem] object-cover"
                    />
                  </Link>
                )
              ) : (
                <div className="grid grid-cols-2 gap-1">
                  {displayMedia.filter(item => item.url && item.url.trim() !== '').slice(0, 4).map((item,index) => (
                    item.media_type === 'video' ? (
                     <Link href={item.url}>
                      <video
                        key={index}
                        src={item.url}
                        controls
                        className="w-full h-40 sm:h-52 object-cover"
                      />
                     </Link>
                    ) : (
                     <Link href={item.url}>
                      <img
                        key={index}
                        src={item.url}
                        alt={`Post media ${index + 1}`}
                        className="w-full h-40 sm:h-52 object-cover"
                      />
                     </Link>
                    )
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div onClick={(e) => { e.stopPropagation() }} className={`flex justify-between items-center mt-3 pt-2 ${!showActions ? "border-none" : 'border-t border-gray-100 dark:border-gray-700'}`}>
            {showActions && actions.map((action, i) => (
              <Tooltip key={i}>
               <TooltipTrigger asChild >
                 <button
                 key={i}
                 ref={action.label === 'Share' ? shareRef : null}
                 className="flex items-center group py-1.5 sm:py-1 sm:px-3 rounded-lg text-gray-500 dark:text-white hover:text-yellow-500    dark:hover:text-yellow-500 transition-all text-sm cursor-pointer" >
                   <span onClick={() => { actionClick(action) }} className='p-2 rounded-full group-hover:bg-yellow-100    dark:group-hover:bg-gray-950'>{action.icon}</span>
                   <span className={`hidden sm:inline ${(action.label === 'Like' && isLiked) || (action.label ==='Repost' && isReposted) ||    (action.label === 'Comment' && isCommented) || (action.label === 'Bookmark' && isBookmarked) ? 'text-yellow-500 dark:text-yellow-500' : ''}`}>{action.value}</span>
                 </button>
              </TooltipTrigger>
               <TooltipContent>
                {action.label}
               </TooltipContent>
              </Tooltip>
            ))}
          </div>
          {/* { Account.decodedHandle === handle && ( */}
          <div className='p-2 rounded-md flex items-center justify-end'>

            <div className='flex items-center justify-center gap-2 rounded-md'>
              <button className='text-white border dark:border-gray-800 hover:opacity-85 bg-black cursor-pointer py-1 px-3 rounded-md flex items-center gap-1'><DollarSign/><span>Monetize</span></button>
              <button className='text-white border dark:border-gray-800 hover:opacity-85 bg-black cursor-pointer py-1 px-4 rounded-md flex items-center gap-1'><TrendingUp/><span>Boost</span></button>
            </div>
          </div>
          {/* )} */}
        </div>
      </div>

      {/* Account Detail Popup */}
      <AccountDetailPop
        user={{
          name: username,
          handle: handle,
          cover:cover,
          avatar: avatar,
          bio:bio, // Default bio, can be passed as prop later
          joined: timestamp,
          following: following, // Default values, can be passed as props
          followers: followers
        }}
        visible={showAccountPopup}
        onOpen = {() => { setShowAccountPopup(true)}}
        onClose={() => setShowAccountPopup(false)}
        position={popupPosition}
        isFollowing={isFollowing}
      />

      { isPop && <RequireSubscription isOpen={isPop} onClose={() => { setisPop(false) }} planname={planIntent}  />}
      { showEditPostPop && <EditPostPop initialContent={content} initialLocations={taggedLocation} postId={postId} initialMentions={mentions} onClose={() => { setshowEditPostPop(false) }} initialMedia={media} initialPoll={poll} /> }


      {ShowDeletePop && <DeletePostPop postId={postId} postOwner={handle} requestBy={String(Account.decodedHandle)} closePopUp={() => { setShowDeletePop(false) }} />}

      { CommentCardPop && ( <Commentpopcard updateState={() => { handleCommentStateUpdate() }} postId={postId} avatar={avatar} name={username} handle={handle}  timestamp={timestamp} content={content} media={displayMedia} handleClose={() => { setCommentCardPop(false) }}/> )}

      { viewPop && (<ViewClickPop closePopUp={() => { setviewPop(false) }}/> )}

      { ShareDropDown && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={(e:MouseEvent) => { e.stopPropagation() }}
          className="fixed w-fit z-50 p-2 bg-white dark:bg-black shadow-lg dark:shadow-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl share-dropdown"
          style={{ top: `${sharePosition.top}px`, left: `${sharePosition.left}px` }}
        >
          <button 
             onClick={() => { handleCopyLink() }}
             className="w-full cursor-pointer flex items-center gap-3 px-4 py-2 rounded-md text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-950 transition-colors font-semibold">
            <LinkIcon className="w-4 h-4" />
            copy link
          </button>
          <button 
          onClick={() => { setShareAccrosApp(true) }}
          className="w-full cursor-pointer flex items-center gap-3 px-4 py-2 rounded-md text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-950 transition-colors font-semibold">
            <Share2 className="w-4 h-4" />
            share accross platform
          </button>
          <button 
          onClick={() => { setshareCardPop(true) }}
          className="w-full cursor-pointer flex items-center gap-3 px-4 py-2 rounded-md text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-950 transition-colors font-semibold">
            <Mail className="w-4 h-4" />
            send via Direct Message
          </button>
        </motion.div>
      )}

      { ToPinPop && ( <PinPostPop closePopUp={() => { setToPinPop(false) }} IsPinned={IsPinned} postOwner={handle} requestBy={String(Account.decodedHandle)} toggleState={() => { setIsPinned(!IsPinned) }} postId={postId} />)}

      {HighlighPop && (
      <HighlightPostPop
        visible={HighlighPop}
        onClose={() => setHighlighPop(false)}
        postId={postId}
        action={IsHighlighted ? 'Unhighlight' : 'Highlight'}
        updateState={() => { setIsHighlighted(!IsHighlighted) }}
      />
      )}

      {ShareAccrosApp && (
        <SharePopup link={`http://localhost:3000/${handle}/post/${postId}?section=All`} onClose={() => { setShareAccrosApp(false) }} followerCount={followers} followingCount={following} open={ShareAccrosApp} text={`@${handle}.${content}`} onCopy={handleCopyLink}/>
      )}
      {FavouritePop && (
        <FavouriteAddPop
          closePopUp={() => setFavouritePop(false)}
          postid={postId}
          handle={String(Account.decodedHandle)}
          itemType='Post'
        />
      )}
      {NotInterested && (
        <NotInterestedPop closePopUp={() => { setNotInterested(false) }} postId={postId} username={handle} updateState={() => { setBlurPost(true) }} />
      )}

      { showBlockPop && (
        <BlockUser closeBlockPop={() => { setshowBlockPop(false) }} username={handle} updateblockState={() => { setisBlocked(!isBlocked) }} isBlocked={isBlocked} />
      )}

      { showReportPop && (
        <ReportPop closeReportModal={() => { setshowReportPop(false) }} username={handle} postId={postId}/>
      )}

      { showEmbedPop && (
        <IframeOfEmbed
          isOpen={showEmbedPop}
          onClose={() => setshowEmbedPop(false)}
          publicEndpoint={`http://localhost:3000/embed/post/${postId}`}
          postId={postId}
          avatar={avatar}
          username={username}
          handle={handle}
          timestamp={timestamp}
          content={content}
          media={displayMedia}
          likes={localLikes}
          reposts={localReposts}
          replies={localComments}
          views={views}
          hashTags={hashTags}
          mentions={mentions}
          isVerified={isVerified}
        />
      )}

     {shareCardPop && (
      <Shareviadm closemodal={() => { setshareCardPop(false) }} link={`http://localhost:3000/${handle}/post/${postId}?section=All`} />
     )}
    </div>
  );
}
