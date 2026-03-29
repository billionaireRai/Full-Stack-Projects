'use client'

import React, { useState , useEffect, useRef } from 'react';
import Image from 'next/image';
import EmojiPicker ,{ EmojiClickData, Theme } from 'emoji-picker-react';
import useActiveAccount from '@/app/states/useraccounts';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { X, Smile, ImageIcon, Send, MessageCircle, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import Link from 'next/link';
import AccountSearch from './accountsearch';
import LocationSearch from './locationsearch';
import axiosInstance from '@/lib/interceptor';

interface mediaType {
  url: string;
  media_type: string;
}
interface CommentCardInfo {
  postId:string,
  avatar?:string ,
  name?:string ,
  handle?:string ,
  timestamp?:string,
  content?:string ,
  media?: mediaType[],
  updateState?:() => void,
  handleClose?:() => void
}

export default function Commentpopcard({updateState,postId ,avatar , name, handle, timestamp , content ,media , handleClose }:CommentCardInfo) {
  const { Account } = useActiveAccount() ;
  const [replyText, setReplyText] = useState<string>(''); // state containing text to be commented..
  const [EmojiPop, setEmojiPop] = useState<boolean>(false) ; // emoji pop state...
  const [mentionPop, setmentionPop] = useState<boolean>(false);
  const [searchLocationPop, setsearchLocationPop] = useState<boolean>(false);
  const [mentions, setmentions] = useState<string[]>([]);
  const [AddLocation, setAddLocation] = useState<{ name: string; coordinates: number[] }[]>([]);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const { resolvedTheme } = useTheme() ;
  const [maxChars,setmaxChars] = useState(100);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handlePostReply = async () => {
    try { 
      if (replyText.trim()) {
      setIsPosting(true);
      const commentapi = await axiosInstance.post('/api/post/actions',{ postId, replyText , mentions , AddLocation }) ;
      if (commentapi.status === 200) {
        // Handle posting logic here
        setReplyText('');
        handleClose?.(); // closing the modal
        toast.success('Successfully replied on post!');
        updateState?.(); // updating comment state on postcard...
        setIsPosting(false);
      } else {
        toast.error('Commenting failed !!');
        setIsPosting(false);
      }
     }
    } catch (error) {
      toast.error('An error occured in commenting !!');
      setIsPosting(false)
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
      if (e.key === 'Escape') {
        handleClose?.();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        handlePostReply();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [replyText]);

  // Calculate character count percentage
  const charPercentage = (replyText.length / maxChars) * 100;
  const getCharCountColor = () => {
    if (charPercentage > 100) return 'text-red-500';
    if (charPercentage > 90) return 'text-red-400';
    if (charPercentage > 75) return 'text-yellow-500';
    return 'text-gray-500 dark:text-gray-400';
  };

  // function for removing elements form the array...
  const removeArrayElement = (setters: React.Dispatch<React.SetStateAction<any[]>>[], index: number) => {
    setters.forEach(setter => setter(prev => prev.filter((_, i) => i !== index)));
  };
  

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center overflow-y-scroll justify-center z-50 p-4" 
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="bg-white dark:bg-black w-full max-w-lg rounded-2xl shadow-2xl border border-gray-200 dark:border-zinc-800 max-h-fit flex flex-col" 
        onClick={(e:MouseEvent) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-black rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Reply to Post</h2>
          </div>
          <button 
            onClick={() => handleClose?.()} 
            className="cursor-pointer p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-950 transition-all duration-200 group"
          >
            <X className="w-5 h-5 text-gray-500 group-hover:text-gray-700 dark:text-zinc-400 dark:group-hover:text-zinc-200 transition-colors" />
          </button>
        </div>

        <div className="flex-1">
          {/* Quoted Post */}
          <div className="p-5 border-b border-gray-100 dark:border-zinc-800">
            <div className="flex items-start gap-3">
              <div className="relative flex-shrink-0">
                <img
                  src={avatar}
                  alt={`${name}'s avatar`}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-gray-100 dark:ring-zinc-800"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-bold text-gray-900 dark:text-white text-[15px] truncate">{name}</span>
                  <span className="text-gray-500 dark:text-zinc-400 text-[15px] truncate">{handle}</span>
                  <span className="text-gray-400">·</span>
                  <span className="text-gray-500 dark:text-zinc-400 text-[15px] truncate">{timestamp}</span>
                </div>
                <p className="text-gray-700 dark:text-zinc-200 text-sm leading-relaxed mb-3 whitespace-pre-wrap">{content}</p>
                
                {/* Media Display */}
                {(media && media.length > 0) && (
                  <div className="mb-3">
                    {media.length === 1 ? (
                      media[0].media_type === 'video' ? (
                        <video
                          src={media[0].url}
                          controls
                          className="w-full max-h-56 object-cover rounded-xl border border-gray-200 dark:border-zinc-700 shadow-sm"
                        />
                      ) : (
                        <img
                          src={media[0].url}
                          alt="Post media"
                          className="w-full max-h-56 object-cover rounded-xl border border-gray-200 dark:border-zinc-700 shadow-sm"
                        />
                      )
                    ) : (
                      <div className="grid grid-cols-2 gap-1.5">
                        {media.slice(0, 4).map((med, idx) => (
                          <div key={idx} className="relative rounded-lg overflow-hidden">
                            {med.media_type === 'video' ? (
                              <video
                                src={med.url}
                                controls
                                className="w-full h-28 object-cover"
                              />
                            ) : (
                              <img
                                src={med.url}
                                alt="Post media"
                                className="w-full h-28 object-cover"
                              />
                            )}
                            {idx === 3 && media.length > 4 && (
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <span className="text-white font-semibold text-lg">+{media.length - 4}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                <p className="text-gray-500 dark:text-zinc-500 text-sm">Replying to 
                  <Link href={`/${handle}`} className="text-yellow-500 cursor-pointer ml-1">{handle}</Link>
                </p>
              </div>
            </div>
          </div>

          {/* Reply Input */}
          <div className="p-5">
            <div className="flex gap-3">
              <div className="relative flex-shrink-0">
                <img
                  src={Account.account?.avatarUrl} // User's avatar
                  alt="Your avatar"
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-yellow-400/30"
                />
              </div>
              <div className="flex-1 min-w-0">
               <div className={`relative flex flex-row items-center rounded-3xl border transition-all duration-300 ease-out ${
                     isFocused
                       ? 'border-yellow-500/80 dark:border-yellow-400/80 ring-2 ring-yellow-400/20 dark:ring-yellow-500/30 bg-white/95 dark:bg-gray-900 shadow-lg shadow-yellow-500/10 backdrop-blur-sm scale-[1.005]'
                       : 'border-transparent bg-white/80 dark:bg-gray-950/80 shadow-sm backdrop-blur-sm hover:border-gray-200/50 dark:hover:border-zinc-700/50 hover:shadow-md'
                   }`}>
                  <textarea
                    ref={textareaRef}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Post your reply..."
                    className="w-full text-gray-900 dark:text-gray-100 text-[13px] resize-none border-none outline-none placeholder-gray-500 dark:placeholder-gray-400 p-3 min-h-[120px] max-h-[150px] transition-colors duration-200 caret-yellow-500 dark:caret-yellow-400 focus:caret-yellow-500"
                    rows={3}
                    maxLength={maxChars}
                  />
                </div>
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 space-y-3"
                      >
                  {mentions.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {mentions.map((tag, index) => (
                         <motion.div
                           key={`mention-${index}`}
                           initial={{ scale: 0.9, opacity: 0 }}
                           animate={{ scale: 1, opacity: 1 }}
                           className="flex items-center justify-center gap-1 bg-yellow-100 dark:bg-yelltext-yellow-700 dark:text-yellow-400 px-3 py-2.5 rounded-full text-sm font-medium shadow-sm"
                         >
                          <Link href={`/${tag}`} >
                            {tag}
                           </Link>
                           <button
                             onClick={() => removeArrayElement([setmentions], index)}
                             className="ml-1 hover:text-yellow-900 dark:hover:text-yellow-300 cursor-pointer"
                           >
                             <X size={14} />
                           </button>
                         </motion.div>
                       ))}
                    </div>
                  )}
                  {AddLocation.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                       {AddLocation.map((location, index) => (
                        <motion.div
                          key={`location-${index}`}
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="flex items-center gap-1 bg-blue-50 dark:bg-blue-500/20 textdark:text-blue-400 px-3 py-1.5 rounded-full text-sm font-medium shadow-sm"
                        >
                          <Link
                            href={`https://www.google.com/maps?q=${location.coordinates[0]},${location.coordinates[1]}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1"
                           >
                            <MapPin size={14} />
                             <span>{location.name}</span>
                          </Link>
                           <button
                            onClick={() => removeArrayElement([setAddLocation], index)}
                            className="ml-1 hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer"
                          >
                             <X size={14} />
                          </button>
                         </motion.div>
                       ))}
                    </div>
                   )}
                  </motion.div>
                </AnimatePresence>
                
                <div className="flex items-center justify-between mt-3">
                  <div className="flex relative items-center gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button 
                          onClick={() => { setEmojiPop(!EmojiPop) }}
                          className="p-2.5 rounded-full cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-500/20 transition-all duration-200 group"
                        >
                          <Image src='/images/smile.png' height={20} width={20} alt='emoji' className="group-hover:scale-110 transition-transform"/>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        Add emoji
                      </TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button 
                          onClick={() => { setmentionPop(!mentionPop) }}
                          className="p-2.5 rounded-full cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-500/20 transition-all duration-200 group"
                        >
                          <Image src='/images/atsign.png' height={20} width={20} alt='Attherate-sign' className="group-hover:scale-110 transition-transform  dark:invert"/>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        Mention someone
                      </TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button 
                        onClick={() => { setsearchLocationPop(!searchLocationPop) }}
                        className="p-2.5 rounded-full cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-500/20 transition-all duration-200 group">
                          <Image className='dark:invert group-hover:scale-110 transition-transform' src='/images/location.png' height={20} width={20} alt='location' />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        Add location
                      </TooltipContent>
                    </Tooltip>

                    {/* Emoji Picker Popup */}
                    <AnimatePresence>
                      {EmojiPop && (
                        <motion.div
                          key={1}
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className='absolute -left-15 bottom-13 z-[100]'
                        >
                          <div className="bg-white dark:bg-black rounded-xl shadow-2xl border border-gray-200 dark:border-zinc-700">
                            <EmojiPicker 
                              onEmojiClick={(emoji) => { 
                                onEmojiClick(emoji);
                              }} 
                              theme={resolvedTheme === 'dark' ? Theme.DARK : resolvedTheme === 'light' ? Theme.LIGHT : Theme.AUTO}
                              width={320}
                              height={400}
                              previewConfig={{ showPreview: false }}
                              skinTonesDisabled
                              searchDisabled={false}
                            />
                          </div>
                        </motion.div>
                      )}
                      {mentionPop && (
                        <motion.div
                          key={2}
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className='absolute -left-10 top-12 z-[100]'
                        >
                          <div className="bg-white dark:bg-black rounded-xl shadow-2xl border border-gray-200 dark:border-zinc-700">
                            <AccountSearch 
                            handle={String(Account.decodedHandle)}
                            onSelect={(accHandle) => { setmentions((prev) => [...prev, accHandle]) ; setmentionPop(false); }} 
                            placeholder="@ Search someone to tag" 
                            />
                          </div>
                        </motion.div>
                      )}
                      {searchLocationPop && (
                        <motion.div
                          key={3}
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className='absolute -left-10 top-12 z-[100]'
                        >
                          <div className="bg-white dark:bg-black rounded-xl shadow-2xl border border-gray-200 dark:border-zinc-700">
                            <LocationSearch 
                                visible={searchLocationPop}
                                onClose={() => { setsearchLocationPop(false) }}
                                onSelect={(location) => { setAddLocation((prev) => [...prev,{ name: location.text, coordinates: location.coordinates }] ); setsearchLocationPop(false) }}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {/* Character Counter with Progress Ring */}
                    <div className="flex items-center gap-2">
                      <div className="relative w-6 h-6">
                        <svg className="w-6 h-6 -rotate-90" viewBox="0 0 36 36">
                          <circle
                            cx="18"
                            cy="18"
                            r="16"
                            fill="none"
                            className="stroke-gray-200 dark:stroke-zinc-700"
                            strokeWidth="2"
                          />
                          <circle
                            cx="18"
                            cy="18"
                            r="16"
                            fill="none"
                            className={`${charPercentage > 100 ? 'stroke-red-500' : charPercentage > 75 ? 'stroke-yellow-500' : 'stroke-yellow-400'}`}
                            strokeWidth="2"
                            strokeDasharray={`${Math.min(charPercentage, 100)} 100`}
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                      <span className={`text-xs font-medium ${getCharCountColor()}`}>
                        {replyText.length}/{maxChars}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-4 border-t border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-black rounded-2xl">
          <div className="flex items-center justify-between gap-3">
            <Link 
              href={`/${handle}/post/${postId}?section=Comments`}
              className='flex items-center gap-2 cursor-pointer text-gray-600 dark:text-zinc-400 hover:text-yellow-500 dark:hover:text-yellow-400 px-4 py-2 rounded-full font-medium text-sm hover:bg-yellow-50 dark:hover:bg-yellow-500/10 transition-all duration-200'
            >
              <span>View Comments</span>
              <Image className='rotate-90 dark:invert' src='/images/up-arrow.png' width={18} height={18} alt='move'/>
            </Link>
            
            <button
              onClick={handlePostReply}
              disabled={!replyText.trim() || isPosting}
              className={`cursor-pointer flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 ${
                replyText.trim() 
                  ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-500 shadow-sm hover:shadow-md shadow-yellow-400/25 hover:shadow-yellow-400/40' 
                  : 'bg-gray-200 dark:bg-zinc-700 text-gray-400 dark:text-zinc-500 cursor-not-allowed'
              }`}
            >
              {isPosting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Posting...</span>
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
      </motion.div>
    </motion.div>
  );
}
