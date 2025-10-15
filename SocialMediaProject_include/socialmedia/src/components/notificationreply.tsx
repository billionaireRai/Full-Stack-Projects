'use client'

import Image from 'next/image';
import toast from 'react-hot-toast';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { NotificationType, User, Post } from './notificationcard'; // importing the notification type...
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

export interface Notification {
  id: string;
  type: NotificationType;
  actor: User;
  post?: Post;
  commentText?: string;
  timestamp: string; // ISO string or date string
  isFollowing?: boolean; // for follow notifications
}

interface notificationReplyProps {
  closeModal?: () => void,
  notification?: Notification
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

export default function Notificationreply({ closeModal, notification }: notificationReplyProps) {
  const [replyText, setReplyText] = useState('');
  const maxChars = 280;

  const handlePostReply = () => {
    if (replyText.trim()) {

      setReplyText('');
      closeModal?.();
      toast.success('Successfully replied to notification!');
    }
  };

  // useEffect for handling exceeding allowed character length...
  useEffect(() => {
    if (replyText.length > maxChars) {
      setReplyText(replyText.slice(0, maxChars));
    }
  }, [replyText]);

  if (!notification) return null;

  const { actor, type, post, commentText, timestamp } = notification ; // extracting the variables from notification...

  const getActionText = () => {
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
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in-0 zoom-in-95 duration-200" >
      <div className="bg-white p-1 border border-gray-900 dark:bg-black rounded-2xl dark:shadow-gray-950 shadow-2xl w-full sm:w-3/4 md:w-1/2 lg:w-1/3 mx-4 max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Reply</h2>
          <button onClick={closeModal} className="cursor-pointer p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-950 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quoted Notification */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-start gap-3">
            <Link href={`/@${actor.username}`}>
               <img
                 src={actor.avatarUrl || '/images/default-avatar.png'}
                 alt={`${actor.name}'s avatar`}
                 className="w-10 h-10 rounded-full object-cover"
               />
            </Link>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-900 dark:text-white text-sm truncate">{actor.name}</span>
                <Image src="/svg/blue-tick.svg" width={14} height={14} alt="verified" />
                <span className="text-gray-500 dark:text-gray-400 text-sm truncate">@{actor.username}</span>
                <span className="text-gray-400">·</span>
                <span className="text-gray-500 dark:text-gray-400 text-sm truncate">{timeAgo(timestamp)}</span>
              </div>
              <p className="text-yellow-500 dark:text-blue-600 font-semibold text-sm mb-2">{getActionText()}</p>
              {post?.thumbnailUrl && (
                <Link href='/@username/post/postid'>
                   <img
                     // src={post?.thumbnailUrl}
                     src={'https://c.ndtvimg.com/2025-07/litqpqbk_trump-modi-_625x300_16_July_25.jpg?downsize=516:320&w=516'}
                     alt="Post thumbnail"
                     className="w-full max-h-48 object-cover rounded-lg"
                   />
                </Link>
              )}
              <Link href={`@/${actor.username}`} className="text-gray-500 dark:text-gray-400 text-sm mt-2">Replying to <span className="text-blue-500">@{actor.username}</span></Link>
            </div>
          </div>
        </div>

        {/* Reply Input */}
        <div className="p-4">
          <div className="flex gap-3">
            <Link href='/@username '>
              <img
                src="/images/myProfile.jpg" // User's avatar
                alt="Your avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
            </Link>
            <div className="flex-1">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="make your reply"
                className="w-full bg-transparent text-gray-900 dark:text-white text-lg resize-none border-none outline-none placeholder-gray-500 dark:placeholder-gray-400"
                rows={3}
                maxLength={maxChars}
              />
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger>
                     <button className="p-2 rounded-full cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-950 transition-colors">
                       <Image src='/images/smile.png' height={20} width={20} alt='emoji'/>
                     </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    add Emoji
                  </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger>
                     <button className="p-2 rounded-full cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-950 transition-colors">
                       <Image className='dark:invert' src='/images/location.png' height={20} width={20} alt='location' />
                     </button>
                     </TooltipTrigger>
                     <TooltipContent>
                      add Location
                     </TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm ${replyText.length > maxChars * 0.9 ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                    {replyText.length}/{maxChars}
                  </span>
                  <button
                    onClick={handlePostReply}
                    disabled={!replyText.trim()}
                    className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
