'use client';

import Image from 'next/image';
import toast from 'react-hot-toast';
import Link from 'next/link';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getNotificationActionText } from './notificationcard';
import EmojiPicker, { Theme, EmojiClickData } from 'emoji-picker-react';
import { useTheme } from 'next-themes';
import { X, MessageSquareText, Reply, Send } from 'lucide-react';
import axiosInstance from '@/lib/interceptor';
import { NotificationType, Post } from './notificationcard';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { userCardProp } from './usercard';

export interface Notification {
  id: string;
  type: NotificationType;
  actor: userCardProp;
  post?: Post;
  commentText?: string;
  timestamp: string;
  isFollowing?: boolean;
}

interface NotificationReplyProps {
  closeModal?: () => void;
  notification: Notification;
  icon:React.ReactNode;
  tailoredURL:string;
}

function timeAgo(timestamp: string) {
  const now = new Date();
  const past = new Date(timestamp);
  const diff = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diff < 60) return `${diff} seconds ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;

  return `${Math.floor(diff / 86400)} days ago`;
}


export default function Notificationreply({ closeModal, notification, icon, tailoredURL }: NotificationReplyProps) {
  const { resolvedTheme } = useTheme();

  const [isReplying, setisReplying] = useState<boolean>(false);
  const [EmojiPop, setEmojiPop] = useState<boolean>(false);
  const [replyText, setReplyText] = useState('');

  const maxChars = 280;

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const { actor, type, post, commentText, timestamp } = notification as Notification ;

  const actionText = useMemo(() => {
    if (!notification) return '';

    return getNotificationActionText(type, commentText);
  }, [commentText, notification, type]);

  useEffect(() => {
    if (notification) {
      setTimeout(() => textareaRef.current?.focus(), 0);
    }
  }, [notification]);

  // function to handle comment on notification...
  async function handleCommentOnNotification() {
    try {
      if (!replyText.trim()) {
        toast.error('Reply text cant be empty !!');
        return ;
      };
      const commentApi = await axiosInstance.post('/api/account/notifications', { notifcnId: notification.id , replyText });
      setisReplying(true);

      if (commentApi.status === 200) {
        toast.success('Successfully replied to notification!');
        closeModal?.();
      }
    } catch (error) {
      console.log("An error occured in replying !!");
      toast.error('Failed to send reply !!');
    } finally {
      setisReplying(false);
    }
  }

  // for slicing text till max char...
  useEffect(() => {
    if (replyText.length > maxChars) setReplyText(replyText.slice(0, maxChars));
    
  }, [replyText]);
  
  // Auto-resize textarea
  useEffect(() => {
     if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [replyText]);
  
   // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter')  handleCommentOnNotification();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [replyText]);

  // setting the clicked emoji in replytext...
  const onEmojiClick = (emojiData: EmojiClickData) => {
    setReplyText((prev) => prev + emojiData.emoji);
  };

  if (!notification) {
    return (
      <div className="fixed overflow-y-scroll inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="w-full sm:w-[92%] md:w-[38rem] lg:w-[42rem] mx-2 overflow-hidden rounded-3xl bg-white dark:bg-black shadow-2xl border border-gray-200 dark:border-zinc-900"
        >
          <div className="px-6 py-7">
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-3 rounded-2xl bg-yellow-50 dark:bg-yellow-500/10 px-4 py-3 border border-yellow-200/60 dark:border-yellow-500/20">
                <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-500/20 flex items-center justify-center">
                  <Reply className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Nothing to reply</p>
                  <p className="text-xs text-gray-500 dark:text-zinc-400">Notification details are unavailable.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }


  return (
    <div className="fixed inset-0 z-50 flex items-center overflow-y-scroll justify-center bg-black/60 backdrop-blur-md animate-in fade-in-0 duration-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ duration: 0.2 }}
        className="relative w-full sm:w-[92%] md:w-[38rem] lg:w-[42rem] mx-2 overflow-hidden rounded-3xl bg-white dark:bg-black shadow-2xl border border-gray-200 dark:border-zinc-900"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b rounded-xl border-gray-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-500/10">
              <Reply className="w-4 h-4 text-yellow-500" />
            </div>

            <div className="space-y-0.5">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Reply
              </h2>

              <p className="text-sm text-gray-500 dark:text-zinc-400">
                Join the conversation
              </p>
            </div>
          </div>

          <button
            onClick={closeModal}
            type="button"
            aria-label="close"
            className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-900 transition-all duration-200 cursor-pointer"
          >
            <X className="w-5 h-5 text-gray-700 dark:text-zinc-300" />
          </button>
        </div>

        {/* Notification Body */}
        <div className="px-6 py-5 border-b rounded-xl border-gray-200 dark:border-zinc-800">
          <div className="flex items-start gap-4">
            {/* Left Rail */}
            <div className="flex flex-col items-center w-12">
              <div className="relative">
                <Link
                  href={`/${actor.decodedHandle}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src={actor.account?.avatarUrl}
                    alt={`${actor.name}'s avatar`}
                    className="object-cover w-11 h-11 rounded-full ring-2 ring-white dark:ring-black"
                  />
                </Link>

                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-yellow-500 ring-2 ring-white dark:ring-black" />
              </div>

              <div className="w-px flex-1 mt-3 bg-gradient-to-b from-yellow-400/60 via-gray-300 dark:via-zinc-800 to-transparent" />
            </div>

            {/* Right Content */}
            <div className="flex-1 min-w-0 space-y-4">
              {/* User Info */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {actor.name}
                </span>

                <Image
                  src="/images/yellow-tick.png"
                  width={14}
                  height={14}
                  alt="verified"
                />

                <span className="text-sm text-gray-500 dark:text-zinc-400 truncate">
                  {actor.decodedHandle}
                </span>

                <span className="text-gray-400">·</span>

                <span className="text-sm text-gray-500 dark:text-zinc-400">
                  {timeAgo(timestamp)}
                </span>
              </div>

              {/* Action */}
              <div className="flex items-center gap-2.5">
                <div className="mt-0.5 text-yellow-500 dark:text-yellow-400 p-1 rounded-full ">
                  {icon}
                </div>
                <p className="text-sm font-medium leading-6 text-yellow-500 border border-yellow-500 bg-yellow-50 dark:bg-yellow-950 w-fit py-1 px-2 rounded-full dark:text-yellow-400 break-words">
                  {actionText}
                </p>
              </div>

              <div className="relative rounded-2xl w-fit overflow-hidden border border-gray-200 dark:border-zinc-800 shadow-sm hover:shadow-md">
                {/* Thumbnail link */}
                <Link
                  href={tailoredURL}
                  className="block group focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/70"
                >
                  <div className="w-50 h-50 relative">
                    {/* Image media */}
                    {post?.thumbnailUrl?.url?.trim() && post.thumbnailUrl.media_type === 'image' && (
                      <img
                        src={post.thumbnailUrl.url}
                        alt="Post thumbnail"
                        draggable={false}
                        loading="lazy"
                        className="w-full h-full object-cover rounded-2xl transition-transform duration-300 group-hover:scale-[1.04]"
                      />
                    )}

                    {/* Video media*/}
                    {post?.thumbnailUrl?.url?.trim() && post.thumbnailUrl.media_type === 'video' && (
                      <video
                        src={post.thumbnailUrl.url}
                        preload="metadata"
                        muted
                        playsInline
                        className="w-full h-full object-cover rounded-2xl"
                      />
                    )}
                  </div>
                </Link>
              </div>

              {/* Replying to */}
              <div className="text-sm text-gray-500 dark:text-zinc-400">
                Replying to{' '}
                <Link
                  href={`/${actor.decodedHandle}`}
                  className="font-medium text-yellow-500 hover:underline"
                >
                  {actor.decodedHandle}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Reply Section */}
        <div className="px-5 py-4">
          <div className="flex items-start gap-4">
            {/* Current User Avatar */}
            <Link
              href={`/${actor.decodedHandle}`}
            >
              <img
                src="/images/myProfile.jpg"
                alt="Your avatar"
                className="object-cover w-11 h-11 rounded-full"
              />
            </Link>

            {/* Input Area */}
            <div className="flex-1">
              <textarea
                ref={textareaRef}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write your reply..."
                rows={4}
                maxLength={maxChars}
                className="w-full text-gray-900 dark:text-gray-100 text-[13px] resize-none border-none outline-none placeholder-gray-500 dark:placeholder-gray-400 p-3 min-h-[120px] max-h-[150px] transition-colors duration-200 caret-yellow-500 dark:caret-yellow-400 focus:caret-yellow-500"
              />

              {/* Footer */}
              <div className="flex items-center justify-between py-2 mt-4 border-t rounded-xl border-gray-200 dark:border-zinc-800">
                {/* Left Actions */}
                <div className="flex items-center gap-3">
                  <Link
                    href={`/${actor?.decodedHandle}/post/${post?.id}?section=Comments`}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 transition-all duration-200 rounded-full cursor-pointer dark:text-zinc-400 hover:text-yellow-500 dark:hover:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-500/10"
                  >
                    <span>View post</span>

                    <Image
                      className="rotate-90 dark:invert"
                      src="/images/up-arrow.png"
                      width={16}
                      height={16}
                      alt="move"
                    />
                  </Link>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-3 relative">
                  {/* Emoji */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => setEmojiPop((prev) => !prev)}
                        className="p-2.5 rounded-full hover:bg-yellow-100 dark:hover:bg-zinc-900 transition-all duration-200 cursor-pointer"
                      >
                        <Image
                          src="/images/smile.png"
                          height={20}
                          width={20}
                          alt="emoji"
                        />
                      </button>
                    </TooltipTrigger>

                    <TooltipContent>
                      Add Emoji
                    </TooltipContent>
                  </Tooltip>

                  {/* Emoji Popup */}
                  <AnimatePresence>
                    {EmojiPop && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-14 right-0 z-[100]"
                      >
                          <EmojiPicker
                            onEmojiClick={(emoji) => { onEmojiClick(emoji) }}
                            width={320}
                            height={400}
                            previewConfig={{ showPreview: false }}
                            skinTonesDisabled
                            searchDisabled={false}
                            theme={resolvedTheme === 'dark' ? Theme.DARK : resolvedTheme === 'light' ? Theme.LIGHT : Theme.AUTO}
                          />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Reply Button */}
                  <button
                    onClick={handleCommentOnNotification}
                    disabled={!replyText.trim() || isReplying}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
                      replyText.trim()
                        ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-500 shadow-sm hover:shadow-lg shadow-yellow-400/30'
                        : 'bg-gray-200 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500 cursor-not-allowed'
                    }`}
                  >
                    {isReplying ? (
                      <>
                        <svg
                          className="w-4 h-4 animate-spin"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />

                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 
                            0 0 5.373 0 12h4zm2 
                            5.291A7.962 7.962 0 
                            014 12H0c0 3.042 
                            1.135 5.824 3 
                            7.938l3-2.647z"
                          />
                        </svg>

                        <span>Replying...</span>
                      </>
                    ) : (
                      <>
                        <span>Reply</span>

                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Character Count */}
              <div className="flex justify-end mt-3">
                <span
                  className={`text-xs font-medium ${
                    replyText.length > 250
                      ? 'text-red-500'
                      : 'text-gray-400 dark:text-zinc-500'
                  }`}
                >
                  {replyText.length}/{maxChars}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}