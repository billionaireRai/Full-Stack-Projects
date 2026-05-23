
import { AtSignIcon, BellIcon, HeartIcon, MessageCircleIcon, MoreHorizontalIcon, Redo2Icon, Trash2Icon, UserPlusIcon, ReplyIcon, RefreshCw, ThumbsUp, MessagesSquare } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { AxiosResponse } from 'axios';
import Spinner from './spinner';
import axiosInstance from '@/lib/interceptor';
import Notificationreply from './notificationreply';
import { motion } from 'framer-motion';
import DeleteModal from './deletemodal';
import Image from 'next/image';
import toast from 'react-hot-toast';
import useActiveAccount from '@/app/states/useraccounts';
import Link from 'next/link';


export type NotificationType = 'follow' | 'like' | 'comment' | 'mention' | 'repost';

export interface accountInvolved {
  id: string;
  name: string;
  username: string;
  isVerified:boolean
  avatarUrl?: string;
}

export interface Post {
  id: string;
  thumbnailUrl?: string;
  content?: string;
}

export interface Notification {
  id: string;
  type: NotificationType;
  actor: accountInvolved;
  post?: Post;
  commentText?: string;
  timestamp: string; // ISO string or date string
  isFollowing?: boolean; // for follow notifications
}

interface NotificationCardProps {
  notification: Notification;
  onRemove?: (notificationId: string) => void;
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

export default function NotificationCard({ notification , onRemove }: NotificationCardProps) {
  const { Account } = useActiveAccount() ;
  const { actor, type, post, commentText, timestamp } = notification ; // extracting the notification infos...
  const [Loading, setLoading] = useState<boolean>(false);
  const [isFollowing, setIsFollowing] = useState(notification.isFollowing || false);
  const [replyModal, setreplyModal] = useState(false) ;
  const [deletePop, setdeletePop] = useState(false);
  const [openDD, setopenDD] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleFollowToggle = async () => {
        // setLoading(true); // from the starting...
        // const newFollowing = !isFollowing; // determine the new state...
        // try {
        //   const apires: AxiosResponse = await axiosInstance.get(`/api/user/follow?accounthandle=${actor.username}&follow=${newFollowing}`); // api response instance...
        //     if (apires.status === 200) {
        //       setisFollowing(newFollowing); // update state immediately on success...
        //       toast.success(`${newFollowing ? 'Added to your following...' : 'Removed from following !!'}`);
        //     } else {
        //       toast.error('Failed with action...');
        //     }
        // } catch (error) {
        //   toast.error('Failed with action...');
        // } finally {
        //   setLoading(false);
        // }
  };

  const handleRemove = () => {
    onRemove?.(notification.id) ;
  };


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

  return (
    <>
    <div className="flex flex-col md:flex-row md:items-center md:justify-between dark:shadow-gray-900 bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md cursor-pointer p-4 md:p-5 mb-1 font-poppins">
      <div className="flex items-center space-x-3 md:space-x-4 flex-1">
        <img
          src={actor.avatarUrl}
          alt={actor.name}
          className="w-12 h-12 md:w-15 md:h-15 rounded-full object-cover flex-shrink-0"
        />
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <div className="flex items-center space-x-2 text-sm md:text-base">
            <p className="font-bold text-gray-900 dark:text-white truncate">{actor.name}</p>
            <span className="text-gray-400 dark:text-gray-500 hidden sm:inline">·</span>
            <span className="text-gray-400 dark:text-gray-500 truncate">{actor.username}</span>
            {actor?.isVerified && (
              <span><Image src='/images/yellow-tick.png' width={20} height={20} alt='yellow-tick' /></span>
            )}
            <span className="text-gray-400 dark:text-gray-500 text-xs truncate">{timeAgo(timestamp)}</span>
          </div>
          <div className="text-yellow-500 font-semibold md:text-base break-words">
            {type === 'follow' && <div className='text-xs flex items-center justify-start gap-1'><UserPlusIcon /><span>Started following you</span></div>}
            {type === 'like' && <div className='text-xs flex items-center justify-start gap-1'><ThumbsUp/><span>Liked your post</span></div>}
            {type === 'comment' && (
              <div className='text-xs flex items-center justify-start gap-1'><MessagesSquare/><span>Commented: {commentText ?? ''}</span></div>
            )}
            {type === 'mention' && 
            <div className='text-xs flex items-center justify-start gap-1'>
              <AtSignIcon/>
              <span>Mentioned you in a post</span>
            </div>}
            {type === 'repost' && <div className='text-xs flex items-center justify-start gap-1'><RefreshCw/><span>Reposted your post</span></div>}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end space-x-2 md:space-x-3 mt-3 md:mt-0">
        {type === 'follow' && (
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
        )}

        {(type === 'like' || type === 'comment' || type === 'mention' || type === 'repost') && post && (
          <Link href={`/${Account.decodedHandle}/post/${post.id}`}>
          <img
            src={post.thumbnailUrl}
            alt="Post thumbnail"
            className="w-18 h-18 dark:invert rounded-lg object-cover cursor-pointer flex-shrink-0"
            />
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
              className="absolute flex flex-col gap-1 right-0 mt-2 w-53 p-2 dark:shadow-gray-900 bg-white dark:bg-black border border-gray-200 dark:border-gray-900 rounded-md shadow-lg z-10">
              <button
                onClick={() => { setopenDD(false); toast.success('successfully liked notification !!') }}
                className="flex flex-row items-center justify-between cursor-pointer gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-950 rounded-md"
              >
                <span>Like Notification</span><HeartIcon width={20} height={20}/>
              </button>
              <button
                onClick={() => { setreplyModal(true); setopenDD(false); }}
                className="flex flex-row items-center justify-between cursor-pointer gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-950 rounded-md"
              >
                <span>Give A Reply</span><MessageCircleIcon height={20} width={20}/>
              </button>

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
    </div>
    { replyModal && (
      <Notificationreply closeModal={() => { setreplyModal(false) }} notification={notification} />
    )}
    { deletePop && (
      <DeleteModal closePopUp={() => { setdeletePop(false) }} onDelete={() => { handleRemove() }} itemType='notification'/>
    )}
  </>
  );
}
