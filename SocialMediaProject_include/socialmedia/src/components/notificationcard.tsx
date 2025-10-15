
import { HeartIcon, MoreHorizontalIcon, ReplyIcon, Trash2Icon } from 'lucide-react';
import React, { useState , useEffect , useRef} from 'react';
import Notificationreply from './notificationreply';
import DeleteModal from './deletemodal';
import toast from 'react-hot-toast';

export type NotificationType = 'follow' | 'like' | 'comment' | 'mention' | 'repost';

export interface User {
  id: string;
  name: string;
  username: string;
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
  actor: User;
  post?: Post;
  commentText?: string;
  timestamp: string; // ISO string or date string
  isFollowing?: boolean; // for follow notifications
}

interface NotificationCardProps {
  notification: Notification;
  onFollowToggle?: (userId: string, newState: boolean) => void;
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

export default function NotificationCard({ notification,onFollowToggle,onRemove }: NotificationCardProps) {
  const [isFollowing, setIsFollowing] = useState(notification.isFollowing || false);
  const [replyModal, setreplyModal] = useState(false) ;
  const [deletePop, setdeletePop] = useState(false);
  const [openDD, setopenDD] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleFollowToggle = () => {
    const newState = !isFollowing;
    setIsFollowing(newState);
    if (onFollowToggle) {
      onFollowToggle(notification.actor.id, newState);
    }
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove(notification.id);
    }
  };

  const { actor, type, post, commentText, timestamp } = notification ;

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
    <div className="flex flex-col md:flex-row md:items-center md:justify-between dark:shadow-gray-900 bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md cursor-pointer p-4 md:p-5 mb-3 font-poppins">
      <div className="flex items-center space-x-3 md:space-x-4 flex-1">
        <img
          src={actor.avatarUrl || '/images/default-avatar.png'}
          alt={actor.name}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover flex-shrink-0"
        />
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center space-x-2 text-sm md:text-base">
            <p className="font-bold text-gray-900 dark:text-white truncate">{actor.name}</p>
            <span className="text-gray-400 dark:text-gray-500 hidden sm:inline">·</span>
            <span className="text-gray-400 dark:text-gray-500 truncate">@{actor.username}</span>
            <span className="text-gray-400 dark:text-gray-500 hidden sm:inline">·</span>
            <span className="text-gray-400 dark:text-gray-500 text-xs truncate">{timeAgo(timestamp)}</span>
          </div>
          <div className="text-yellow-500 dark:text-blue-600 font-semibold md:text-base break-words">
            {type === 'follow' && <span className='text-xs'>Started Following you</span>}
            {type === 'like' && <span className='text-xs'>Liked your post</span>}
            {type === 'comment' && <span className='text-xs'>Commented : "{commentText}"</span>}
            {type === 'mention' && <span className='text-xs'>Mentioned you in a post . @{'amritansh_coder'}</span>}
            {type === 'repost' && <span className='text-xs'>Reposted your post</span>}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end space-x-2 md:space-x-3 mt-3 md:mt-0">
        {type === 'follow' && (
          <>
            <button
              onClick={handleFollowToggle}
              className={`px-3 py-2 md:px-4 md:py-3 rounded-full text-xs md:text-sm font-bold cursor-pointer transition-colors ${
                isFollowing
                  ? 'bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  : 'bg-yellow-500 dark:bg-blue-700 text-white hover:opacity-80'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow Back'}
            </button>
          </>
        )}

        {(type === 'like' || type === 'comment' || type === 'mention' || type === 'repost') && post && (
          <img
            src={post.thumbnailUrl}
            alt="Post thumbnail"
            className="w-4 h-4 dark:invert rounded-lg object-cover cursor-pointer flex-shrink-0"
            onClick={() => {
              window.location.href = `/username/post/${post.id}`;
            }}
          />
        )}
        <div className="relative" ref={dropdownRef}>
          <div
            onClick={(e) => { e.stopPropagation(); setopenDD(!openDD); }}
            className='hover:bg-gray-100 dark:hover:bg-gray-950 p-1 rounded-full cursor-pointer'>
            <MoreHorizontalIcon width={15} height={15} />
          </div>
          { openDD && (
            <div className="absolute flex flex-col gap-1 right-0 mt-2 w-53 p-2 dark:shadow-gray-900 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10">
              <button
                onClick={(e) => { e.stopPropagation(); setopenDD(false); toast.success('successfully liked notification !!') }}
                className="flex flex-row items-center justify-between cursor-pointer gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-950 rounded-md"
              >
                <span>Like Notification</span><HeartIcon width={20} height={20}/>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setreplyModal(true); setopenDD(false); }}
                className="flex flex-row items-center justify-between cursor-pointer gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-950 rounded-md"
              >
                <span>Reply Notification</span><ReplyIcon className='rotate-180' height={20} width={20}/>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setopenDD(false); setdeletePop(true) }}
                className="flex flex-row items-center justify-between cursor-pointer gap-2 w-full text-left px-4 py-2 text-sm text-red-500  hover:bg-red-100/50 dark:hover:bg-red-950 rounded-md transition-colors"
              >
                <span>Delete Notification</span><Trash2Icon width={20} height={20} className="text-red-500" />
              </button>
            </div>
          )
          }
        </div>
      </div>
    </div>
    { replyModal && (
      <Notificationreply closeModal={() => { setreplyModal(false) }} notification={notification} />
    )}
    { deletePop && (
      <DeleteModal closePopUp={() => { setdeletePop(false) }}/>
    )}
  </>
  );
}
