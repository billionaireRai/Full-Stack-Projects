'use client'

import React, { useState , useEffect } from 'react';
import Image from 'next/image';
import { X, Smile, ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';

interface CommentCardInfo {
  avatar?:string ,
  username?:string ,
  handle?:string ,
  timestamp?:string,
  content?:string ,
  media?: string[],
  handleClose?:() => void
}

export default function Commentpopcard({avatar , username, handle, timestamp , content ,media , handleClose }:CommentCardInfo) {
  const [replyText, setReplyText] = useState('');
  const maxChars = 280;

  // Will pass acctual data as props from postcaard component....
  const post = {
    avatar: '/images/myProfile.jpg',
    username: 'Amritansh Rai',
    handle: 'amritansh_coder',
    timestamp: 'Dec 10',
    content: 'I am planning to buy a new laptop, as my old one has become trash. Wants recommendation of you guys',
    media: ['/images/broken-laptop.jpg'],
  };


  const handlePostReply = () => {
    if (replyText.trim()) {
      console.log('Posting reply:', replyText);
      // Handle posting logic here
      setReplyText('');
      handleClose?.();
      toast.success('successfully replied on post !!');
    }
  };

  // useffect for handling execceding allowed character length...
  useEffect(() => {
    if (replyText.length > maxChars) {
      setReplyText(replyText) ;
    }

  }, [replyText])
  

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in-0 zoom-in-95 duration-200" onClick={() => handleClose?.()}>
      <div className="bg-white p-1 border border-gray-900 dark:bg-black rounded-2xl shadow-2xl max-w-xl mx-4 max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Reply</h2>
          <button onClick={() => handleClose?.()} className="cursor-pointer p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-950 transition-colors">
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Quoted Post */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-start gap-3">
            <img
              src={avatar || post.avatar}
              alt={`${username || post.username}'s avatar`}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-900 dark:text-white text-sm truncate">{username || post.username}</span>
                <Image src="/svg/blue-tick.svg" width={14} height={14} alt="verified" />
                <span className="text-gray-500 dark:text-gray-400 text-sm truncate">@{handle || post.handle}</span>
                <span className="text-gray-400">·</span>
                <span className="text-gray-500 dark:text-gray-400 text-sm truncate">{timestamp || post.timestamp}</span>
              </div>
              <p className="text-gray-900 dark:text-white text-sm leading-relaxed mb-2">{content || post.content}</p>
              {post.media.length > 0 && (
                <img
                  src={media?.[0] || post.media[0]}
                  alt="Post media"
                  className="w-full max-h-48 object-cover rounded-lg"
                />
              )}
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Replying to <span className="text-blue-500">@{post.handle}</span></p>
            </div>
          </div>
        </div>

        {/* Reply Input */}
        <div className="p-4">
          <div className="flex gap-3">
            <img
              src="/images/myProfile.jpg" // User's avatar
              alt="Your avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Tweet your reply"
                className="w-full bg-transparent text-gray-900 dark:text-white text-lg resize-none border-none outline-none placeholder-gray-500 dark:placeholder-gray-400"
                rows={3}
                maxLength={maxChars}
              />
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="p-2 rounded-full cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-950 transition-colors">
                        <Image src='/images/smile.png' height={20} width={20} alt='emoji'/>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Emoji
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="p-2 rounded-full cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-950 transition-colors">
                        <Image className='dark:invert' src='/images/location.png' height={20} width={20} alt='location' />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Location
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
