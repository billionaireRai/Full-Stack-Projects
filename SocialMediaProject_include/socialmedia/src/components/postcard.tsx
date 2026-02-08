'use client'

import usePoll from '@/app/states/poll';
import React, { useState, useEffect, useRef , ReactElement } from 'react';
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
  PodcastIcon
} from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';
import { useRouter } from 'next/navigation';
import useActiveAccount from '@/app/states/useraccounts';
import Commentpopcard from './Commentpopcard';
import useUpgradePop from '@/app/states/upgradePop';
import AccountDetailPop from './accountdetailpop';
import { pollInfoType } from '@/app/states/poll';
import ViewClickPop from './viewClickPop';
import toast from 'react-hot-toast';
import axiosInstance from '@/lib/interceptor';
import EditPostPop from './editPostpop';

interface locationTaggedType {
  text: string,
  coordinates: number[]
}
interface mediaType {
  url: string;
  media_type: string;
}
interface PostCardProps {
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
  isVerified?:boolean
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
  highlighted?:boolean
  isFollowing?:boolean
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
  highlighted = false,
  isFollowing=false
}: PostCardProps) {
  const displayMedia = media || [];

  const router = useRouter() ;
  const { Account } = useActiveAccount() ;
  const { setisPop } = useUpgradePop() ; // upgrade pop handler... 
  const [postOptions, setPostOptions] = useState<boolean>(false);
  const [showAccountPopup, setShowAccountPopup] = useState<boolean>(false);
  const [viewPop, setviewPop] = useState<boolean>(false) ;
  const [isHighlighted, setIsHighlighted] = useState<boolean>(highlighted);
  const [CommentCardPop, setCommentCardPop] = useState<boolean>(false) ;
  const [showEditPostPop, setshowEditPostPop] = useState<boolean>(false);
  const [shareCardPop, setshareCardPop] = useState<boolean>(false) ;
  const [ShareDropDown, setShareDropDown] = useState<boolean>(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0 , left: 0 });
  const [sharePosition, setSharePosition] = useState({ top: 0, left: 0 });
  const avatarRef = useRef<HTMLImageElement>(null);
  const shareRef = useRef<HTMLButtonElement>(null);

  // states related to actions of each post...
  const [isLiked, setIsLiked] = useState<boolean>(userliked);
  const [localLikes, setLocalLikes] = useState<number>(likes);
  const [isReposted, setIsReposted] = useState<boolean>(usereposted);
  const [localReposts, setLocalReposts] = useState<number>(reposts);
  const [isCommented, setIsCommented] = useState<boolean>(usercommented);
  const [localComments, setLocalComments] = useState<number>(replies);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(userbookmarked);
  const [isShared, setIsShared] = useState<boolean>(false);


  const actions : actionType[] = [
      { icon: <MessageCircle className={`w-5 h-5 group-active:animate-caret-blink ${isCommented ? 'fill-yellow-500 text-yellow-500 dark:fill-blue-500 dark:text-blue-500' : ''}`} />, label: "Comment", value: localComments },
      { icon: <Repeat className={`w-5 h-5 group-active:animate-accordion-down transition-all duration-500 ${isReposted ? 'stroke-yellow-500 dark:stroke-blue-500' : ''}`} />, label: "Repost", value: localReposts },
      { icon: <Heart className={`w-5 h-5 group-active:animate-ping ${isLiked ? 'fill-yellow-500 text-yellow-500 dark:fill-blue-500 dark:text-blue-500' : ''}`} />, label: "Like", value: localLikes },
      { icon: <Eye className="w-5 h-5 group-active:scale-125 transition-all duration-300" />, label: "Views", value: views },
      { icon: <Bookmark className={`w-5 h-5 group-active:animate-ping ${isBookmarked ? 'fill-yellow-500 text-yellow-500 dark:fill-blue-500 dark:text-blue-500' : ''} `} />, label: "Bookmark" },
      { icon: <Share2 className={`w-5 h-5 ${isShared ? 'fill-yellow-500 text-yellow-500 dark:fill-blue-500 dark:text-blue-500' : ''}`} />, label: "Share", }
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

  // function handling action click...
  const actionClick = (action : actionType) => {
    if (action.label === 'Comment') setCommentCardPop(true)  ; // after successfull commmenting , will edit comment ui...
      else if (action.label === 'Like') {
        setIsLiked(!isLiked);
        setLocalLikes(isLiked ? localLikes - 1 : localLikes + 1);

      }
      else if (action.label === 'Bookmark') {
        setIsBookmarked(!isBookmarked);
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
        setIsReposted(!isReposted);
        setLocalReposts(isReposted ? localReposts - 1 : localReposts + 1);
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
    // window.navigator.clipboard()   later I will write the logic to copy post url...
    setShareDropDown(false) ;
    toast.success("Post link successfully copied !")  
   }

  const handleAvatarLeave = () => { setShowAccountPopup(false); };

  // useffect logic handling of out side clicking
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (postOptions && !(event.target as Element).closest('.dropdown-container')) {
        setPostOptions(false)
      }
    }

    if (postOptions) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [postOptions])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ShareDropDown && !(event.target as Element).closest('.share-dropdown')) {
        setShareDropDown(false)
      }
    }

    if (ShareDropDown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ShareDropDown])

  // delete post handler...
  const handleDeletePostLogic = async () => {  
    const loadingtoast = toast.loading('Deleting your post...');
    try {
      const deleteApi = await axiosInstance.delete(`/api/post/control?postId=${postId}&postOwner=${handle}&deleteRequestBy=${Account.decodedHandle}`);
      if (deleteApi.status === 200) {
        toast.dismiss(loadingtoast);
        toast.success('Post deleted successfully !!')
        router.refresh() ; // reloads the current page...
      } else {
        toast.dismiss(loadingtoast);
        toast.error('Deletion failed try later !!');
      }
    } catch (error) {
      console.log('An error occured :',error);
      toast.error('An Error Occured !!');
    }
  }

  // post edit handler...
  const handleEditingPost = async () => { 
    if (!Account.account?.isVerified)  setisPop(true) ; // showing upgrade pop up if not verified...

    else {
      setshowEditPostPop(true)
    }
   }

  // useeffect for hightlight change...
  const handleHighlightToggle = () => {
      setIsHighlighted(!isHighlighted) ;
      toast.success(`Post Highlight Changed !!`)
      router.refresh() ;
  }

  // function for handling commenting state...
  const handleCommentStateUpdate = () => {
    setIsCommented(true) ;
    setLocalComments(isCommented ? localComments - 1 : localComments + 1)
  }


  return (
    <div 
      className={`bg-white cursor-pointer dark:bg-black shadow-sm hover:shadow-gray-400 dark:hover:shadow-gray-900 dark:border-0 dark:border-b dark:border-gray-800 rounded-xl border border-gray-100 ${!showActions ? ' shadow-none m-0 p-4 cursor-none' : 'my-1 sm:p-4'}`}>
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <Link href={`/@${handle}`}>
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
            href={`/@${handle}`}
            className={`text-gray-500 dark:text-gray-400 text-xs sm:text-base truncate`}>
              @{handle}
            </Link>
            <span className="text-gray-400">·</span>
            <span className={`text-gray-500 dark:text-gray-400 ${!showActions ? 'text-xs' : 'text-sm'} truncate`}>
              {timestamp}
            </span>
            { isPinned && (
              <Tooltip>
                <TooltipTrigger>
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-yellow-100 dark:bg-blue-900/20 rounded-full border     border-yellow-200 dark:border-blue-800/50">
                    <Pin className="w-5 h-5 rotate-45 fill-yellow-500 dark:fill-blue-500 stroke-yellow-500 dark:stroke-blue-500" />
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  Pinned post
                </TooltipContent>
              </Tooltip>
            )}

            {/* Options */}
            <Tooltip>
            <TooltipTrigger asChild>
            <button
              onClick={() => { setPostOptions(true) } }
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
            {postOptions && (
              <div className="dropdown-container animate-in slide-in-from-top-2 duration-200 cursor-pointer absolute right-0 top-10 w-fit p-2 bg-white dark:bg-black shadow-gray-700 dark:shadow-gray-900 shadow-lg border border-gray-200 dark:border-gray-900 rounded-xl z-50 overflow-hidden">
                <button
                  onClick={() => { handleDeletePostLogic(); }}
                  className={`w-full  flex items-center gap-3 px-4 py-2 rounded-md cursor-pointer text-sm font-medium transition-colors text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950`}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
                <Link href={`/@${handle}/post/${postId}`}
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
                  className={`w-full  flex items-center gap-3 px-4 py-2 rounded-md cursor-pointer text-sm font-medium transition-colors text-black hover:bg-gray-100 dark:text-white dark:hover:bg-gray-950`}
                >
                  <Pin className="w-4 h-4" />
                  Pin to profile
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleHighlightToggle(); }}
                  className={`w-full ${(isHighlighted && ('highlight on profile'.toLowerCase().includes('highlight') || 'unhighlight on profile'.toLowerCase().includes('unhighlight'))) ? 'bg-yellow-100' : ''} flex items-center gap-3 px-4 py-2 rounded-md cursor-pointer text-sm font-medium transition-colors text-black hover:bg-gray-100 dark:text-white dark:hover:bg-gray-950`}
                >
                  <Star className={`w-4 h-4 ${(isHighlighted) ? 'stroke-yellow-500 fill-yellow-600':''}`} />
                  {!isHighlighted ? "Highlight on profile" : 'UnHighlight on Profile'}
                </button>
                <button
                  className={`w-full flex items-center justify-between px-4 py-2 rounded-md cursor-pointer text-sm font-medium transition-colors text-black hover:bg-gray-100 dark:text-white dark:hover:bg-gray-950`}
                >
                 <div className='flex items-center gap-3 mr-3'>
                  <List className="w-4 h-4" />
                  <span>Add to favourite</span>
                 </div>
                 <Image src='/images/yellow-tick.png'  width={20} height={20} alt='verified'/>
                </button>
                <button
                  className={`w-full  flex items-center gap-3 px-4 py-2 rounded-md cursor-pointer text-sm font-medium transition-colors text-black hover:bg-gray-100 dark:text-white dark:hover:bg-gray-950`}
                >
                  <BarChart3 className="w-4 h-4" />
                  View engagements
                </button>
              </div>
            )}
            {/* {postOptions && Account.decodedHandle !== handle && (
             <div className="dropdown-container animate-in slide-in-from-top-2 duration-200 cursor-pointer absolute right-0 top-10 w-fit p-2 bg-white dark:bg-black shadow-gray-700 dark:shadow-gray-900 shadow-lg border border-gray-200 dark:border-gray-900 rounded-xl z-50 overflow-hidden">
               <button
                className={`w-full  flex items-center gap-3 px-4 py-2 rounded-md cursor-pointer text-sm font-medium transition-colors text-black hover:bg-gray-100 dark:text-white dark:hover:bg-gray-950`}
               >
                 <Frown className="h-4 w-4" />
                 Not interested in this post
               </button>

               <button
                  className={`w-full  flex items-center gap-3 px-4 py-2 rounded-md cursor-pointer text-sm font-medium transition-colors text-black hover:bg-gray-100 dark:text-white dark:hover:bg-gray-950`}
               >
                 <UserPlus className="h-4 w-4" />
                 Follow @{handle}
               </button>

               <button
                  className={`w-full  flex items-center gap-3 px-4 py-2 rounded-md cursor-pointer text-sm font-medium transition-colors text-black hover:bg-gray-100 dark:text-white dark:hover:bg-gray-950`}
               >
                 <ListPlus className="h-4 w-4" />
                 Add to Favourite
               </button>

               <button
                  className={`w-full  flex items-center gap-3 px-4 py-2 rounded-md cursor-pointer text-sm font-medium transition-colors text-black hover:bg-gray-100 dark:text-white dark:hover:bg-gray-950`}
               >
                 <VolumeX className="h-4 w-4" />
                 Mute
               </button>
               <button
                  className={`w-full  flex items-center gap-3 px-4 py-2 rounded-md cursor-pointer text-sm font-medium transition-colors text-black hover:bg-gray-100 dark:text-white dark:hover:bg-gray-950`}
               >
                 <BarChart3 className="h-4 w-4" />
                 View post engagements
               </button>

               <button
                  className={`w-full  flex items-center gap-3 px-4 py-2 rounded-md cursor-pointer text-sm font-medium transition-colors text-black hover:bg-gray-100 dark:text-white dark:hover:bg-gray-950`}
               >
                 <Code2 className="h-4 w-4" />
                 Embed post
               </button>
               <button
                  className={`w-full  flex items-center gap-3 px-4 py-2 rounded-md cursor-pointer text-sm font-medium transition-colors text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950`}
               >
                 <Ban className="h-4 w-4" />
                 Block @{handle}
               </button>
               <button
                  className={`w-full  flex items-center gap-3 px-4 py-2 rounded-md cursor-pointer text-sm font-medium transition-colors text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950`}
               >
                 <Flag className="h-4 w-4" />
                 Report post
               </button>
             </div>
           )} */}
          </div>

          {/* Content */}
          <div className={`mt-2 text-gray-900 dark:text-gray-100 ${!showActions ? 'text-xs' : 'text-md sm:text-sm'} leading-relaxed`}>
            <div>{content}</div><div>{parseHashAndMentions(hashTags, mentions)}</div>
          </div>

          {/* Media */}
          {displayMedia && displayMedia.length > 0 && displayMedia.some(item => item.url && item.url.trim() !== '') && (
            <div className="mt-2 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              {displayMedia.filter(item => item.url && item.url.trim() !== '').length === 1 ? (
                displayMedia.filter(item => item.url && item.url.trim() !== '')[0].media_type === 'video' ? (
                  <video
                    src={displayMedia.filter(item => item.url && item.url.trim() !== '')[0].url}
                    controls
                    className="w-full max-h-[28rem] object-cover"
                  />
                ) : (
                  <img
                    src={displayMedia.filter(item => item.url && item.url.trim() !== '')[0].url}
                    alt="Post media"
                    className="w-full max-h-[28rem] object-cover"
                  />
                )
              ) : (
                <div className="grid grid-cols-2 gap-1">
                  {displayMedia.filter(item => item.url && item.url.trim() !== '').slice(0, 4).map((item,index) => (
                    item.media_type === 'video' ? (
                      <video
                        key={index}
                        src={item.url}
                        controls
                        className="w-full h-40 sm:h-52 object-cover"
                      />
                    ) : (
                      <img
                        key={index}
                        src={item.url}
                        alt={`Post media ${index + 1}`}
                        className="w-full h-40 sm:h-52 object-cover"
                      />
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
                 className="flex items-center group py-1.5 sm:py-1 sm:px-3 rounded-lg text-gray-500 dark:text-white hover:text-yellow-500    dark:hover:text-blue-500 transition-all text-sm cursor-pointer" >
                   <span onClick={() => { actionClick(action) }} className='p-2 rounded-full group-hover:bg-yellow-100    dark:group-hover:bg-gray-950'>{action.icon}</span>
                   <span className={`hidden sm:inline ${(action.label === 'Like' && isLiked) || (action.label ==='Repost' && isReposted) ||    (action.label === 'Comment' && isCommented) || (action.label === 'Bookmark' && isBookmarked) || (action.label === 'share' &&    isShared) ? 'text-yellow-500 dark:text-blue-500' : ''}`}>{action.value}</span>
                 </button>
              </TooltipTrigger>
               <TooltipContent>
                {action.label}
               </TooltipContent>
              </Tooltip>
            ))}
          </div>
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

      { showEditPostPop && <EditPostPop initialContent={content} initialLocations={taggedLocation} postId={postId} initialMentions={mentions} onClose={() => { setshowEditPostPop(false) }} initialMedia={media} initialPoll={poll} /> }

      { CommentCardPop && ( <Commentpopcard updateState={() => { handleCommentStateUpdate() }} postId={postId} avatar={avatar} name={username} handle={handle}  timestamp={timestamp} content={content} media={displayMedia} handleClose={() => { setCommentCardPop(false) }}/> )}

      { viewPop && (<ViewClickPop closePopUp={() => { setviewPop(false) }}/> )}

      { ShareDropDown && (
        <div
          onClick={(e) => { e.stopPropagation() }}
          className="fixed w-fit z-50 p-2 bg-white dark:bg-black shadow-lg dark:shadow-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl share-dropdown animate-in fade-in-0 zoom-in-95 duration-200"
          style={{ top: `${sharePosition.top}px`, left: `${sharePosition.left}px` }}
        >
          <button 
             onClick={() => { handleCopyLink() }}
             className="w-full cursor-pointer flex items-center gap-3 px-4 py-2 rounded-md text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-950 transition-colors font-semibold">
            <LinkIcon className="w-4 h-4" />
            copy link
          </button>
          <button className="w-full cursor-pointer flex items-center gap-3 px-4 py-2 rounded-md text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-950 transition-colors font-semibold">
            <Share2 className="w-4 h-4" />
            share post via...
          </button>
          <button 
          onClick={() => { setshareCardPop(true) }}
          className="w-full cursor-pointer flex items-center gap-3 px-4 py-2 rounded-md text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-950 transition-colors font-semibold">
            <Mail className="w-4 h-4" />
            send via Direct Message
          </button>
        </div>
      )}

     {shareCardPop && (
  <div 
    onClick={() => setshareCardPop(false)}
    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
  >
    <div 
      className="bg-white dark:bg-black rounded-xl h-10/11 p-3 w-full max-w-lg relative flex flex-col shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Send via Direct Message</h2>
        <button 
          onClick={() => setshareCardPop(false)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-950 cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 dark:border-gray-800">
        <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"/>
        </svg>
        <input 
          type="text" 
          placeholder="Search people"
          className="flex-1 bg-transparent outline-none text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />
      </div>

      {/* User list */}
      <div className="flex-1 overflow-y-auto p-4">
        <p className="text-gray-500 dark:text-gray-400 text-sm text-center">No profile found yet</p>
      </div>

      {/* Comment + Send */}
      <div className="border-t border-gray-200 dark:border-gray-800 px-4 py-3">
        <div className="flex items-center bg-gray-100 focus-within:bg-gray-200 transition-all duration-300 dark:bg-gray-900 rounded-lg px-4 py-2">
          <input 
            type="text" 
            placeholder="Add a comment"
            className="flex-1 bg-transparent outline-none text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
          <button 
            onClick={() => {
              toast.success("Post shared via DM!");
              setshareCardPop(false);
            }}
            className="ml-2 text-blue-500 flex items-center gap-1 border hover:border-blue-500 cursor-pointer py-1 px-2 rounded-lg font-medium disabled:opacity-50"
          >
            <span>Send</span>
            <SendHorizontalIcon/>
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
}
