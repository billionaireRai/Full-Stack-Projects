'use client'

import React, { useState, useEffect, useRef , ReactElement, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MoreVerticalIcon, Trash2, Edit3, Pin, Star, List, MessageCircle, BarChart3, Code, TrendingUp, FileText, Share2, Mail, Link as LinkIcon, X , SendHorizontalIcon, Heart, Repeat, Eye, Bookmark} from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';
import { useRouter } from 'next/navigation';
import Commentpopcard from './Commentpopcard';
import AccountDetailPop from './accountdetailpop';
import ViewClickPop from './viewClickPop';
import toast from 'react-hot-toast';

interface PostCardProps {
  postId:string;
  avatar?: string;
  cover?:string
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

interface actionType {
  icon:ReactElement ,
  label:string ,
  value:number
}

export default function PostCard({
  postId = '#EWR$%^FGH*(8uyg',
  avatar = '/images/myProfile.jpg',
  cover='https://img.freepik.com/premium-photo/wide-banner-with-many-random-square-hexagons-charcoal-dark-black-color_105589-1820.jpg',
  username = 'Amritansh Rai',
  handle = 'amritansh_coder',
  timestamp = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).toLocaleLowerCase(),
  content = 'I am planning to buy a new laptop, as my old one has become trash. Wants recommendation of you guys',
  media=[],
  likes = 0,
  retweets = 0,
  replies = 0,
  shares = 0,
  views = 0,
  bookmarked = 0,
  hashTags = [],
  mentions = [],
  showActions = true,
  highlighted = false
}: PostCardProps) {
  const displayMedia = media || [];

  const router = useRouter() ;
  const [postOptions, setPostOptions] = useState<boolean>(false);
  const [showAccountPopup, setShowAccountPopup] = useState<boolean>(false);
  const [viewPop, setviewPop] = useState<boolean>(false) ;
  const [isHighlighted, setIsHighlighted] = useState<boolean>(highlighted);
  const [CommentCardPop, setCommentCardPop] = useState<boolean>(false) ;
  const [shareCardPop, setshareCardPop] = useState<boolean>(false) ;
  const [ShareDropDown, setShareDropDown] = useState<boolean>(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0 , left: 0 });
  const [sharePosition, setSharePosition] = useState({ top: 0, left: 0 });
  const avatarRef = useRef<HTMLImageElement>(null);
  const shareRef = useRef<HTMLButtonElement>(null);
  const popUpControl = useMemo(() => [
      { label: "Delete", icon: <Trash2 className="w-4 h-4" />, danger: true },
      { label: "Edit", icon: <Edit3 className="w-4 h-4" /> },
      { label: "Pin to profile", icon: <Pin className="w-4 h-4" /> },
      { label: !isHighlighted ? "Highlight on profile" : 'UnHighlight on Profile', icon: <Star className={`w-4 h-4 ${(isHighlighted) ? 'stroke-yellow-500 fill-yellow-600':''}`} /> },
      { label: "Add/remove from Lists", icon: <List className="w-4 h-4" /> },
      { label: "Change who can reply", icon: <MessageCircle className="w-4 h-4" /> },
      { label: "View engagements", icon: <BarChart3 className="w-4 h-4" /> },
      { label: "Embed post", icon: <Code className="w-4 h-4" /> },
      { label: "View analytics", icon: <TrendingUp className="w-4 h-4" /> },
      { label: "Request Community Note", icon: <FileText className="w-4 h-4" /> }
  ], [isHighlighted])

  // states related to actions of each post...
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [localLikes, setLocalLikes] = useState<number>(likes);
  const [isCommented, setIsCommented] = useState<boolean>(false);
  const [localComments, setLocalComments] = useState<number>(replies);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [localBookmarks, setLocalBookmarks] = useState<number>(bookmarked);
  const [isShared, setIsShared] = useState<boolean>(false);
  const [localShares, setLocalShares] = useState<number>(shares);


  const actions = [
      { icon: <MessageCircle className={`w-5 h-5 group-active:animate-caret-blink ${isCommented ? 'fill-yellow-500 text-yellow-500 dark:fill-blue-500 dark:text-blue-500' : ''}`} />, label: "Comment", value: localComments },
      { icon: <Repeat className={`w-5 h-5 group-active:animate-accordion-down transition-all duration-500`} />, label: "Repost", value: retweets },
      { icon: <Heart className={`w-5 h-5 group-active:animate-ping ${isLiked ? 'fill-yellow-500 text-yellow-500 dark:fill-blue-500 dark:text-blue-500' : ''}`} />, label: "Like", value: localLikes },
      { icon: <Eye className="w-5 h-5 group-active:scale-125 transition-all duration-300" />, label: "Views", value: views },
      { icon: <Bookmark className={`w-5 h-5 group-active:animate-ping ${isBookmarked ? 'fill-yellow-500 text-yellow-500 dark:fill-blue-500 dark:text-blue-500' : ''} `} />, label: "Bookmark", value: localBookmarks },
      { icon: <Share2 className={`w-5 h-5 ${isShared ? 'fill-yellow-500 text-yellow-500 dark:fill-blue-500 dark:text-blue-500' : ''}`} />, label: "Share", value: localShares }
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
  const actionClick = (event: React.MouseEvent, action : actionType) => {
    event.stopPropagation();
    if (action.label === 'Comment') setCommentCardPop(true)  ; // after successfull commmenting , will edit comment ui...
      else if (action.label === 'Like') {
        setIsLiked(!isLiked);
        setLocalLikes(isLiked ? localLikes - 1 : localLikes + 1);

      }
      else if (action.label === 'Bookmark') {
        setIsBookmarked(!isBookmarked);
        setLocalBookmarks(isBookmarked ? localBookmarks - 1 : localBookmarks + 1);

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
      else if (action.label === 'Repost') {
        // repost logic
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
      onClick={() => { router.push(`/@${handle}/post/${postId}`) }}
      className={`bg-white cursor-pointer dark:bg-black shadow-sm hover:shadow-gray-400 dark:hover:shadow-gray-900 dark:border-0 dark:border-b dark:border-gray-800 rounded-xl transition-all duration-300 border border-gray-100 ${!showActions ? ' shadow-none m-0 p-2 cursor-none' : 'my-3 sm:p-4'}`}>
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
            <span><Image src='/images/yellow-tick.png'  width={20} height={20} alt='verified'/></span>
            <Link 
            href={`/@${handle}`}
            className={`text-gray-500 dark:text-gray-400 text-xs sm:text-base truncate`}>
              @{handle}
            </Link>
            <span className="text-gray-400">·</span>
            <span className={`text-gray-500 dark:text-gray-400 ${!showActions ? 'text-xs' : 'text-sm'} truncate`}>
              {timestamp}
            </span>

            {/* Options */}
          { showActions && 
            <Tooltip>
              <TooltipTrigger asChild>
            <button
              onClick={() => setPostOptions(!postOptions)}
              className={`ml-auto rounded-full p-1.5 cursor-pointer transition-colors ${postOptions ? 'bg-gray-100 dark:bg-gray-950' : 'hover:bg-gray-100 dark:hover:bg-gray-950'}`}
            >
              <MoreVerticalIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            </TooltipTrigger>
            <TooltipContent>
              More
            </TooltipContent>
            </Tooltip>
          }

            {postOptions && (
              <div className="dropdown-container animate-in slide-in-from-top-2 duration-200 cursor-pointer absolute right-0 top-10 w-fit p-2 bg-white dark:bg-black shadow-gray-700 dark:shadow-gray-900 shadow-lg border border-gray-200 dark:border-gray-900 rounded-xl z-50 overflow-hidden">
                {popUpControl.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => handleHighlightToggle()}
                    className={`w-full ${(isHighlighted && (item.label.toLowerCase().includes('highlight') || item.label.toLowerCase().includes('unhighlight'))) ? 'bg-yellow-100' : ''} flex items-center gap-3 px-4 py-2 rounded-md cursor-pointer text-sm font-medium transition-colors
                    ${item.danger
                        ? "text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
                        : "text-black hover:bg-gray-100 dark:text-white dark:hover:bg-gray-950"}`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div className={`mt-2 text-gray-900 dark:text-gray-100 ${!showActions ? 'text-xs' : 'text-md sm:text-sm'} leading-relaxed`}>
            <div>{content}</div><div>{parseHashAndMentions(hashTags, mentions)}</div>
          </div>

          {/* Media */}
          {displayMedia && displayMedia.length > 0 && displayMedia.some(url => url && url.trim() !== '') && (
            <div className="mt-2 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              {displayMedia.filter(url => url && url.trim() !== '').length === 1 ? (
                <img
                  src={displayMedia.find(url => url && url.trim() !== '')}
                  alt="Post media"
                  className="w-full max-h-[28rem] object-cover"
                />
              ) : (
                <div className="grid grid-cols-2 gap-1">
                  {displayMedia.filter(url => url && url.trim() !== '').slice(0, 4).map((url,index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Post media ${index + 1}`}
                      className="w-full h-40 sm:h-52 object-cover"
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className={`flex justify-between items-center mt-3 pt-2 ${!showActions ? "border-none" : ''} border-t border-gray-100 dark:border-gray-700`}>
            {showActions && actions.map((action, i) => (
              <Tooltip key={i}>
                <TooltipTrigger asChild>
                  <button
                  ref={action.label === 'Share' ? shareRef : null}
                  onClick={(event) => { actionClick(event, action) }}
                  className="flex items-center group py-1.5 sm:py-1 sm:px-3 rounded-lg text-gray-500 dark:text-white hover:text-yellow-500 dark:hover:text-blue-500 transition-all text-sm cursor-pointer">
                    <span className='p-2 rounded-full group-hover:bg-yellow-100 dark:group-hover:bg-gray-950'>{action.icon}</span>
                    <span className={`hidden sm:inline ${(action.label === 'Like' && isLiked) || (action.label === 'Comment' && isCommented) || (action.label === 'Bookmark' && isBookmarked) || (action.label === 'share' && isShared) ? 'text-yellow-500 dark:text-blue-500' : ''}`}>{action.value}</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{action.label}</p>
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
          bio: 'This is a sample bio for the user.', // Default bio, can be passed as prop later
          joined: timestamp,
          following: 123, // Default values, can be passed as props
          followers: 456
        }}
        visible={showAccountPopup}
        onOpen = {() => { setShowAccountPopup(true)}}
        onClose={() => setShowAccountPopup(false)}
        position={popupPosition}
      />

      { CommentCardPop && ( <Commentpopcard updateState={() => { handleCommentStateUpdate() }} postId={postId} avatar={avatar} name={username} handle={handle}  timestamp={timestamp} content={content} media={displayMedia} handleClose={() => { setCommentCardPop(false) }}/> )}

      { viewPop && (<ViewClickPop closePopUp={() => { setviewPop(false) }}/> )}

      { ShareDropDown && (
        <div
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
