
import { AtSignIcon, BellIcon, HeartIcon, MessageCircleIcon, MoreHorizontalIcon, Redo2Icon, Trash2Icon, UserPlusIcon, ReplyIcon, RefreshCw, ThumbsUp, MessagesSquare, ViewIcon, StarsIcon, Heart, BellDot, BellMinusIcon } from 'lucide-react';
import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { AxiosResponse } from 'axios';
import Spinner from './spinner';
import axiosInstance from '@/lib/interceptor';
import Notificationreply from './notificationreply';
import AccountDetailPop from './accountdetailpop';
import { motion, AnimatePresence } from 'framer-motion';
import DeleteModal from './deletemodal';
import Image from 'next/image';
import toast from 'react-hot-toast';
import useActiveAccount from '@/app/states/useraccounts';
import Link from 'next/link';
import { userCardProp } from './usercard';


export type NotificationType = 'follow' | 'like' | 'comment' | 'mention' | 'repost' | 'post' | 'notification_like' | 'notification_comment' ;

interface skeletonprops {
  isodd:boolean
}


export interface Post {
  id: string;
  thumbnailUrl?: string;
  content?: string;
}

export interface Notification {
  id: string;
  type: NotificationType;
  actor: userCardProp;
  post?: Post;
  commentText?: string;
  timestamp: string; // ISO string or date string
  isread:boolean
  isliked:boolean
  iscommented:boolean
}

interface NotificationCardProps {
  notification: Notification;
  onRemove?: (notificationId: string) => void;
}

export function NotificationCardSkeleton( { isodd } :skeletonprops ) {
  return (
    <div className='flex relative flex-col md:flex-row md:items-center md:justify-between dark:shadow-gray-900 bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-4 md:p-5 mb-1 font-poppins'>
      <div className='flex items-center space-x-3 md:space-x-4 flex-1'>
        <div className='h-12 w-12 md:w-15 md:h-15 rounded-full bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 animate-pulse' />
        <div className='flex flex-col gap-2 min-w-0 flex-1'>
          <div className='flex items-center gap-2'>
            <div className='h-4 w-28 rounded bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 animate-pulse' />
            <div className='h-4 w-20 rounded bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 animate-pulse' />
          </div>
          <div className='h-4 w-64 rounded bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 animate-pulse' />
        </div>
      </div>

      <div className='flex items-center justify-end space-x-2 md:space-x-3 mt-3 md:mt-0'>
        { isodd && (
          <div className='h-9 w-16 rounded-full bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 animate-pulse' />
        )}
        <div className='h-5 w-5 rounded-full bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 animate-pulse' />
        <div className='h-5 w-5 rounded-full bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 animate-pulse' />
      </div>
    </div>
  );
}

function timeAgo(timestamp: string) {
  const now = new Date();
  const past = new Date(timestamp);
  const diff = Math.floor((now.getTime() - past.getTime()) / 1000); // seconds

  if (diff < 60) return `${diff} seconds ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}

export function getNotificationActionText( type: NotificationType,commentText?: string,) {
  switch (type) {
    case 'follow':
      return 'Started following you';

    case 'like':
      return 'Liked your post';

    case 'comment':
      return `Commented: "${commentText}"`;

    case 'mention':
      return 'Mentioned you in a post';
      
    case 'repost':
      return 'Reposted your post';

    case 'post':
      return 'New post uploaded';
    
    case 'notification_like':
      return 'Liked your notification';
      
    case 'notification_comment':
      return 'Liked your notification';
    
  }
}


export default function NotificationCard({ notification , onRemove }: NotificationCardProps) {
  const { Account } = useActiveAccount() ;
  const avatarRef = useRef<HTMLAnchorElement>(null);
  const { actor, type, post, commentText, timestamp, isread ,isliked , iscommented } = notification ; // extracting the notification infos...
  const [Loading, setLoading] = useState<boolean>(false);
  const [isLiked, setisLiked] = useState<boolean>(isliked);
  const [isCommented, setisCommented] = useState<boolean>(iscommented);
  const [isFollowing, setisFollowing] = useState(actor.IsFollowing);
  const [replyModal, setreplyModal] = useState(false) ;
  const [deletePop, setdeletePop] = useState(false);
  const [ShowAccPopup, setShowAccPopup] = useState<boolean>(false);
  const [openDD, setopenDD] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null)
  const notificationIcon: Record<NotificationType, React.ReactNode> = {
    follow: <UserPlusIcon size={16} />,
    like: <ThumbsUp size={16} />,
    comment: <MessagesSquare size={16} />,
    mention: <AtSignIcon size={16} />,
    repost: <RefreshCw size={16} />,
    post: <StarsIcon size={16} />,
    notification_like: <BellDot size={16} />,
    notification_comment:<BellMinusIcon size={16}/>
  };
  const currentNotificationIcon:React.ReactNode = notificationIcon[type] ;

  const handleFollowToggle = async () => {
        setLoading(true); // from the starting...
        const newFollowing = !isFollowing; // determine the new state...
        try {
          const apires: AxiosResponse = await axiosInstance.get(`/api/user/follow?accounthandle=${actor.decodedHandle}&follow=${newFollowing}`); // api response instance...
            if (apires.status === 200) {
              setisFollowing(newFollowing); // update state immediately on success...
              toast.success(`${newFollowing ? 'Added to your following...' : 'Removed from following !!'}`);
            } else {
              toast.error('Failed with action...');
            }
        } catch (error) {
          toast.error('Failed with action...');
        } finally {
          setLoading(false);
        }
  };

  const handleRemove = () => {
    onRemove?.(notification.id) ;
  };

  // function for handling liking notification...
  function handleLikeToggle() {
    setopenDD(false); setisLiked(!isLiked);
  }


   // Close dropdown if clicked outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setopenDD(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    function getTailoredURL(notificationtype: NotificationType): string {
      if (notificationtype === 'follow') return `/${actor.decodedHandle}`;

      if (notificationtype === 'post' || notificationtype === 'mention') return `/${actor.decodedHandle}/post/${post?.id}`;

      return `/${Account.decodedHandle}/post/${post?.id}`;
    }

  // functions handling acccount details pop...
  const handleAvatarHover = () => {
    if (avatarRef.current) {
      const rect = avatarRef.current.getBoundingClientRect();
      setPopupPosition({
        top: rect.bottom , // from avatar bottom...
        left: rect.left + rect.width / 2 // Center horizontally on avatar
      });
      setShowAccPopup(true);
    }
  };

  const handleAvatarLeave = () => {
    setShowAccPopup(false);
  };


  return (
    <>
    <div className={`flex relative flex-col md:flex-row md:items-center md:justify-between dark:shadow-gray-900 bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md cursor-pointer p-4 md:p-5 mb-1 font-poppins ${! isread && 'bg-yellow-100'}`}>
      <div className="flex items-center space-x-3 md:space-x-4 flex-1">
        <div className='relative'>
          <Link href={`/${actor.decodedHandle}`} ref={avatarRef} onMouseEnter={handleAvatarHover} onMouseLeave={handleAvatarLeave} >
            <img
              src={actor.account?.avatarUrl}
              className="w-12 h-12 md:w-15 md:h-15 rounded-full object-cover flex-shrink-0"
            />
          </Link>
          <div className='absolute'>
              <AccountDetailPop
               user={{
                  name: String(actor.name),
                  handle: String(actor.decodedHandle),
                  avatar: String(actor.account?.avatarUrl),
                  bio: String(actor.account?.bio),
                  joined: String(actor.account?.joinDate),
                  following: String(actor.account?.following),
                  followers: String(actor.account?.followers),
                  cover: actor.account?.bannerUrl
                }}
                visible={ShowAccPopup}
                onOpen={() => setShowAccPopup(true)}
                onClose={() => setShowAccPopup(false)}
                position={popupPosition}
                isFollowing={Boolean(isFollowing)}
              />
          </div>
        </div>
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <div className="flex items-center space-x-2 text-sm md:text-base">
            <p className="font-bold text-gray-900 dark:text-white truncate">{actor.name}</p>
            <span className="text-gray-400 dark:text-gray-500 hidden sm:inline">·</span>
            <Link href={`/${actor.decodedHandle}`} className="text-gray-400 text-xs dark:text-gray-500 truncate">{actor.decodedHandle}</Link>
            {actor?.account?.isVerified && (
              <span><Image src='/images/yellow-tick.png' width={20} height={20} alt='yellow-tick' /></span>
            )}
            <span className="text-gray-400 dark:text-gray-500 text-xs truncate">{timeAgo(timestamp)}</span>
          </div>
          <div className="text-yellow-500 font-semibold md:text-base break-words">
            {type === 'follow' && <NotificationContainer icon={currentNotificationIcon} text='Started following you' />}
            {type === 'like' && <NotificationContainer icon={currentNotificationIcon} text='Liked your post' />}
            {type === 'comment' && <NotificationContainer icon={currentNotificationIcon} text={`Commented : ${commentText}`} />}
            {type === 'post' && <NotificationContainer icon={currentNotificationIcon} text={'New post uploaded'} />}
            {type === 'notification_like' && <NotificationContainer icon={currentNotificationIcon} text={'Liked your notification'} />}
            {type === 'notification_comment' && <NotificationContainer icon={currentNotificationIcon} text={`Comment on your notification : ${commentText}`} />}
            {type === 'mention' && <NotificationContainer icon={currentNotificationIcon} text='Mentioned you in a post' />}
            {type === 'repost' && <NotificationContainer icon={currentNotificationIcon} text='Reposted your post' />}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end space-x-2 md:space-x-3 mt-3 md:mt-0">
        {type === 'follow' && (
          <div>
            <button
              onClick={handleFollowToggle}
              className={`px-3 py-2 md:px-4 md:py-3 rounded-full text-xs md:text-sm font-bold cursor-pointer transition-colors ${
                isFollowing
                  ? 'bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  : 'bg-yellow-500 text-white hover:opacity-80'
              }`}
            >
              { Loading ? <Spinner/> : ( isFollowing ? 'Following' : 'Add Following' ) }
            </button>
          </div>
        )}

        {(type === 'like' || type === 'comment' || type === 'mention' || type === 'repost') && post?.thumbnailUrl ? (
          <Link href={getTailoredURL(type)}>
          <img
            src={post.thumbnailUrl}
            alt='Post-Thumbnail'
            className="w-18 h-18 rounded-lg object-cover cursor-pointer flex-shrink-0"
            />
          </Link>
        ):(
          <Link href={getTailoredURL(type)} className='cursor-pointer hover:invert hover:border border-gray-500 text-gray-500 rounded-full p-1'>
            <ViewIcon size={18} />
          </Link>
        )}
         <div className="relative" ref={dropdownRef}>
          <div
            onClick={(e) => { e.stopPropagation(); setopenDD(!openDD); }}
            className='hover:bg-gray-100 dark:hover:bg-gray-950 p-1 rounded-full cursor-pointer'>
            <MoreHorizontalIcon width={15} height={15} />
          </div>
          { openDD && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }} 
              className="absolute flex flex-col gap-1 right-0 mt-2 w-55 p-2 dark:shadow-gray-900 bg-white dark:bg-black border border-gray-200 dark:border-gray-900 rounded-md shadow-lg z-10">
              { !type.startsWith('notification') && (
                <>
                <button
                  onClick={() => { handleLikeToggle() }}
                  className="flex flex-row items-center justify-between cursor-pointer gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-950 rounded-md"
                >
                  <span>{ isLiked ? 'Unlike' : 'Like' } Notification</span><HeartIcon width={20} height={20} className={`${isLiked && 'fill-black dark:fill-white'}`} />
                </button>
                <button
                  onClick={() => { setreplyModal(true); setopenDD(false); }}
                  className="flex flex-row items-center justify-between cursor-pointer gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-950 rounded-md"
                >
                  <span>{ isCommented ? 'Commented' : 'Make A Comment' }</span><MessageCircleIcon height={20} width={20} className={`${isCommented && 'fill-black dark:fill-white'}`}/>
                </button>
               </>
              )}
              <button
                onClick={() => { setopenDD(false); setdeletePop(true) }}
                className="flex flex-row items-center justify-between cursor-pointer gap-2 w-full text-left px-4 py-2 text-sm text-red-500  hover:bg-red-100/50 dark:hover:bg-red-950 rounded-md transition-colors"
              >
                <span>Delete Notification</span><Trash2Icon width={20} height={20} className="text-red-500" />
              </button>
            </motion.div>
          )
          }
        </div>
      </div>
      {isLiked && (
        <motion.div
          className="rounded-full p-1 absolute right-0 top-0"
          initial={{ scale: 0.2, rotate: -20, opacity: 0 }}
          animate={{ 
            scale: [0.2, 1.35, 0.95, 1],
            rotate: [0, -10, 10, 0],
            opacity: 1,
          }}
          transition={{ duration: 0.8, times: [0, 0.35, 0.6, 1], ease: 'easeOut' }}
        >
            <Heart strokeWidth={2} color="#f0b100" fill='#f0b100' size={20} />
        </motion.div>
      )}


      {isCommented && (
        <motion.div>

        </motion.div>
      )}
    </div>
    { replyModal && (
      <Notificationreply closeModal={() => { setreplyModal(false) }} notification={notification} icon={currentNotificationIcon} tailoredURL={getTailoredURL(type)} />
    )}
    { deletePop && (
      <DeleteModal closePopUp={() => { setdeletePop(false) }} onDelete={() => { handleRemove() }} itemType='notification'/>
    )}
  </>
  );
}

function NotificationContainer({ icon , text }:{ icon:React.ReactNode , text:string }) {
  return (
    <>
      <div className='text-xs border border-yellow-500 bg-yellow-50 dark:bg-yellow-950 w-fit py-1 px-2 rounded-full flex items-center justify-start gap-1'>
        {icon}
        <span>{text}</span>
      </div>
    </>
  );
}
