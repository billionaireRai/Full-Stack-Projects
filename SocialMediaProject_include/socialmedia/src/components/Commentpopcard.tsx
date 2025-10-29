'use client'

import React, { useState , useEffect } from 'react';
import Image from 'next/image';
import EmojiPicker ,{ EmojiClickData } from 'emoji-picker-react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { X, Smile, ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import Link from 'next/link';

interface CommentCardInfo {
  postId:string,
  avatar?:string ,
  name?:string ,
  handle?:string ,
  timestamp?:string,
  content?:string ,
  media?: string[],
  updateState?:() => void,
  handleClose?:() => void
}

export default function Commentpopcard({updateState,postId ,avatar , name, handle, timestamp , content ,media , handleClose }:CommentCardInfo) {
  const [replyText, setReplyText] = useState<string>(''); // state containing text to be commented..
  const [EmojiPop, setEmojiPop] = useState<boolean>(false) ; // emoji pop state...
  const { resolvedTheme } = useTheme() ;
  const maxChars = 280;

  const handlePostReply = () => {
    if (replyText.trim()) {
      console.log('Posting reply:', replyText);
      // Handle posting logic here
      setReplyText('');
      handleClose?.(); // closing the modal
      toast.success('successfully replied on post !!');
      updateState?.(); // updating comment state on postcard...
    }
  };

  // useffect for handling execceding allowed character length...
  useEffect(() => {
    if (replyText.length > maxChars) setReplyText(replyText) ;
  }, [replyText])

  // function handling emoji selection logic...
  const onEmojiClick = (emojiData:EmojiClickData) => {
    setReplyText((prev) => prev + emojiData.emoji);
  };
  

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in-0 zoom-in-95 duration-200" onClick={() => handleClose?.()}>
      <div className="bg-white p-1 border border-gray-700 dark:bg-black rounded-2xl shadow-2xl max-w-xl mx-4 max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
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
              src={avatar}
              alt={`${name}'s avatar`}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-900 dark:text-white text-sm truncate">{name}</span>
                <Image src="/images/yellow-tick.png" width={14} height={14} alt="verified" />
                <span className="text-gray-500 dark:text-gray-400 text-sm truncate">@{handle}</span>
                <span className="text-gray-400">·</span>
                <span className="text-gray-500 dark:text-gray-400 text-sm truncate">{timestamp}</span>
              </div>
              <p className="text-gray-900 dark:text-white text-sm leading-relaxed mb-2">{content}</p>
              {(media && media.length > 0 && media[0] ) ? (
                <img
                  src={media[0]}
                  alt="Post media"
                  className="w-full max-h-48 object-cover rounded-lg"
                />
              ):(
                <div className="grid grid-cols-2 gap-1">
                  {media?.map((med) => (
                    <img
                    src={med}
                    alt="Post media"
                    className="w-full max-h-48 object-cover rounded-lg"
                    />
                   ))}
                  
                </div>
              )
            }
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Replying to <span className="text-blue-500">@{handle}</span></p>
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
                className="w-full bg-transparent text-gray-900 dark:text-white text-sm resize-none border-none outline-none placeholder-gray-500 dark:placeholder-gray-400"
                rows={3}
                maxLength={maxChars}
              />
              <div className="flex items-center justify-between mt-3 gap-10">
                <div className="flex relative items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        onClick={() => { setEmojiPop(!EmojiPop) }}
                        className="p-2 rounded-full cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-950 transition-colors">
                        <Image src='/images/smile.png' height={20} width={20} alt='emoji'/>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Emoji
                    </TooltipContent>
                  </Tooltip>
                  { EmojiPop && (
                     <motion.div
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.3 }}
                     className='absolute left-10 -bottom-5 z-[100]' >
                       {/* @ts-ignore */}
                       <EmojiPicker onEmojiClick={(emoji) => { onEmojiClick(emoji) }} theme={resolvedTheme === 'dark' ? 'dark' : resolvedTheme === 'light' ? 'light' : undefined} />
                     </motion.div>
                   )}
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
                 <div className='flex flex-row items-center justify-center px-2 py-1 gap-1 bg-blue-100 dark:bg-black rounded-lg'>
                  <button
                    onClick={handlePostReply}
                    disabled={!replyText.trim()}
                    className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Reply
                  </button>
                  <Link 
                  href={`/@${handle}/post/${postId}?section=Comments`}
                  className='flex items-center gap-1 group cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                  >
                    <span>View Comments</span><Image className='rotate-90 group-hover:animate-bounce transition-all duration-300' src='/images/up-arrow.png' width={25} height={25} alt='move'/>
                  </Link>
                 </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
