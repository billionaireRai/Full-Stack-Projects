"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import PollInPost from "./pollinpost";
import toast from "react-hot-toast";
import Link from "next/link";
import AccountSearch from "./accountsearch";
import usePoll, { pollInfoType } from "@/app/states/poll";
import AccountPoll from "./accountpoll";
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';
import { motion, AnimatePresence } from "framer-motion";
import useActiveAccount from "@/app/states/useraccounts";
import {
  MoreHorizontalIcon,
  UserPlusIcon,
  Globe,
  X,
  Smile,
  MapPin,
  Loader2,
  ChevronDown,
  MessagesSquareIcon
} from 'lucide-react';
import { TooltipContent, TooltipTrigger, Tooltip } from "./ui/tooltip";
import CreatePoll from "./createpoll";
import LocationSearch from "./locationsearch";
import axiosInstance from "@/lib/interceptor";

interface mediaType {
  url: string;
  media_type: string;
}
interface EditPostPopProps {
  postId: string;
  initialContent: string;
  initialMedia: mediaType[];
  initialMentions: string[];
  initialLocations: { text: string; coordinates: number[] }[];
  initialPoll?: pollInfoType;
  onClose: () => void;
}

export default function EditPostPop({
  postId,
  initialContent,
  initialMedia,
  initialMentions,
  initialLocations,
  initialPoll,
  onClose
}: EditPostPopProps) {
  const maxPostLength = 100;
  const [post, setPost] = useState(initialContent);
  const [DisablePostButton, setDisablePostButton] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const { poll, resetPoll } = usePoll();
  const { Account } = useActiveAccount();
  const { resolvedTheme } = useTheme();
  const [showEmojiPicker, setshowEmojiPicker] = useState<boolean>(false);
  const [openReplyOptions, setopenReplyOptions] = useState<boolean>(false)
  const [showPollModal, setshowPollModal] = useState<boolean>(false);
  const [showTagSomeone, setshowTagSomeone] = useState<boolean>(false);
  const [showLocationSearchModal, setshowLocationSearchModal] = useState<boolean>(false);
  const [openOptions, setopenOptions] = useState(false);
  const [whoCanReply, setWhoCanReply] = useState<'everyone' | 'following' | 'mentioned' | 'verified'>('everyone');
  const imageRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const gifRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [InitialMedia, setInitialMedia] = useState<mediaType[]>(initialMedia.filter(url => url.url && url.url.trim() !== ''));
  const [imageArr, setimageArr] = useState<string[]>([]);
  const [videoArr, setvideoArr] = useState<string[]>([]);
  const [gifArr, setgifArr] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [gifFiles, setGifFiles] = useState<File[]>([]);
  const [MentionedTo, setMentionedTo] = useState<string[]>(initialMentions);
  const [AddLocation, setAddLocation] = useState<{ text: string; coordinates: number[] }[]>(initialLocations);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [post]);

  // Close modals when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openOptions && !(event.target as Element).closest('.dropdown-container')) {
        setopenOptions(false);
      }
      if (openReplyOptions && !(event.target as Element).closest('.reply-dropdown-container')) {
        setopenReplyOptions(false);
      }
      if (showEmojiPicker && !(event.target as Element).closest('.emoji-picker-container')) {
        setshowEmojiPicker(false);
      }
      if (showTagSomeone && !(event.target as Element).closest('.tag-search-modal')) {
        setshowTagSomeone(false);
      }
      if (showPollModal && !(event.target as Element).closest('.create-poll')) {
        setshowPollModal(false);
      }
      if (showLocationSearchModal && !(event.target as Element).closest('.location-search')) {
        setshowLocationSearchModal(false);
      }
    };

    if (openOptions || openReplyOptions || showEmojiPicker || showTagSomeone || showPollModal || showLocationSearchModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openOptions, openReplyOptions, showEmojiPicker, showTagSomeone, showPollModal, showLocationSearchModal]);

  // post update logic here...
  const handlePostUpdate = async () => {
    if (!post.trim()) return;
    setIsUpdating(true);
    const loadingToast = toast.loading('updating your post...');
    try {
      const formData = new FormData();
      formData.append('postId', postId);
      formData.append('postText', post);
      formData.append('mentions', JSON.stringify(MentionedTo));
      formData.append('taggedLocation', JSON.stringify(AddLocation));
      formData.append('canBeRepliedBy', whoCanReply);
      formData.append('poll', JSON.stringify(poll || initialPoll));
      formData.append('existingMedia', JSON.stringify(InitialMedia));

      imageFiles.forEach(file => formData.append('imgUrls', file));
      videoFiles.forEach(file => formData.append('videoUrls', file));
      gifFiles.forEach(file => formData.append('gifsArr', file));

      const postUpdateApi = await axiosInstance.put('/api/post/control', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      if (postUpdateApi.status === 200) {
        toast.dismiss(loadingToast);
        toast.success('Post updated successfully!');
        onClose();
        resetPoll();
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.log('An Error Occurred: ', error);
      toast.error('Failed to update post. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  }

  useEffect(() => {
    setDisablePostButton(!post.trim());
  }, [post])

  // function for emoji addition...
  const onEmojiClick = (emojiData: EmojiClickData) => {
    setPost((prev) => prev + emojiData.emoji);
  };

  // functions for removing media/tags/locations...
  const removeArrayElement = (setters: React.Dispatch<React.SetStateAction<any[]>>[], index: number) => {
    setters.forEach(setter => setter(prev => prev.filter((_, i) => i !== index)));
  };

  // function for handling video, image, and gif url push...
  const handleMediaInclude = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = (e.target as HTMLInputElement).files?.[0]; // extracting the file...
    if (file) {
      const url = URL.createObjectURL(file); // creating a new url...
      if (type === 'image') {
        setimageArr(prev => [...prev, url]);
        setImageFiles(prev => [...prev, file]);
      } else if (type === 'video') {
        setvideoArr(prev => [...prev, url]);
        setVideoFiles(prev => [...prev, file]);
      } else if (type === 'gif') {
        setgifArr(prev => [...prev, url]);
        setGifFiles(prev => [...prev, file]);
      }
    }
    e.target.value = '';
  }

  const charPercentage = (post.length / maxPostLength) * 100;
  const getCharCountColor = () => {
    if (charPercentage > 100) return 'text-red-500';
    if (charPercentage > 90) return 'text-red-400';
    if (charPercentage > 75) return 'text-yellow-500';
    return 'text-gray-500 dark:text-gray-400';
  };

  const getReplyOptionIcon = (option: string) => {
    switch (option) {
      case 'everyone':
        return <Globe className="w-4 h-4" />;
      case 'following':
        return <UserPlusIcon className="w-4 h-4" />;
      case 'mentioned':
        return <Image src="/images/atsign.png" width={20} height={20} alt="mention" className="dark:invert" />;
      case 'verified':
        return <Image src="/images/yellow-tick.png" width={16} height={16} alt="verified" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      id="editpost-scroll"
      className='fixed inset-0 bg-black/10 backdrop-blur-xs z-50 flex items-center overflow-y-scroll justify-center p-4'
    >
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-center w-full h-full">
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="bg-white dark:bg-black w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-200 dark:border-zinc-900 max-h-[90vh] flex flex-col flex-shrink-0"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-zinc-950 bg-white dark:bg-black rounded-2xl">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-yellow-400/30 ring-offset-2 ring-offset-white dark:ring-offset-zinc-900">
                <img
                  className="w-full h-full object-cover"
                  src={Account.account?.avatarUrl || '/default-avatar.png'}
                  alt="profile-pic"
                />
              </div>
              <div className="flex flex-col items-start">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                  {Account.name}
                </h4>
                <Link href={`/${Account.decodedHandle}`} className="hover:opacity-80 transition-opacity">
                  <span className="text-xs text-gray-500 dark:text-zinc-400 rounded-full px-2 hover:text-yellow-500 hover:bg-yellow-100 dark:hover:text-yellow-400 dark:hover:bg-gray-950 transition-colors">
                    {Account.decodedHandle}
                  </span>
                </Link>
              </div>
            </div>
            <button
              onClick={onClose}
              className="cursor-pointer p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-950 transition-all duration-200 group"
            >
              <X className="w-5 h-5 text-gray-500 group-hover:text-gray-700 dark:text-zinc-400 dark:group-hover:text-zinc-200" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex gap-4">
              <div className="flex-1 min-w-0">
                <textarea
                  ref={textareaRef}
                  value={post}
                  onChange={(e) => setPost(e.target.value)}
                  placeholder="what's happening guys ??"
                  rows={1}
                  className="w-full resize-none border-none outline-none text-sm text-gray-900 dark:text-white bg-transparent placeholder-gray-400 dark:placeholder-zinc-600 focus:ring-0 min-h-[100px] max-h-[300px]"
                />

                {/* Media Preview Section */}
                <AnimatePresence>
                  {(InitialMedia.length > 0 || imageArr.length > 0 || videoArr.length > 0 || gifArr.length > 0 || MentionedTo.length > 0 || AddLocation.length > 0) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 space-y-3"
                    >
                      {/* Existing Media */}
                      {InitialMedia.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
                          {InitialMedia.map((media, index) => (
                            <motion.div
                              key={`existing-${index}`}
                              initial={{ scale: 0.9, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: index * 0.05 }}
                              className="relative group rounded-xl overflow-hidden aspect-square shadow-md"
                            >
                              {media.media_type === 'video' ? (
                                <video src={media.url} className="w-full h-full object-cover" />
                              ) : (
                                <img src={media.url} alt={media.media_type} className="w-full h-full object-cover" />
                              )}
                              <button
                                onClick={() => removeArrayElement([setInitialMedia], index)}
                                className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-sm cursor-pointer"
                              >
                                <X size={14} className="text-white" />
                              </button>
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {/* Images */}
                      {imageArr.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
                          {imageArr.map((url, index) => (
                            <motion.div
                              key={`img-${index}`}
                              initial={{ scale: 0.9, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: index * 0.05 }}
                              className="relative group rounded-xl overflow-hidden aspect-square shadow-md"
                            >
                              <img src={url} alt="image" className="w-full h-full object-cover" />
                              <button
                                onClick={() => removeArrayElement([setimageArr, setImageFiles], index)}
                                className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-sm cursor-pointer"
                              >
                                <X size={14} className="text-white" />
                              </button>
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {/* Videos */}
                      {videoArr.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          {videoArr.map((url, index) => (
                            <motion.div
                              key={`video-${index}`}
                              initial={{ scale: 0.9, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: index * 0.05 }}
                              className="relative group rounded-xl overflow-hidden bg-black shadow-md"
                            >
                              <video src={url} className="w-full h-full object-cover" />
                              <button
                                onClick={() => removeArrayElement([setvideoArr, setVideoFiles], index)}
                                className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-sm cursor-pointer"
                              >
                                <X size={14} className="text-white" />
                              </button>
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {/* GIFs */}
                      {gifArr.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mb-2">
                          {gifArr.map((url, index) => (
                            <motion.div
                              key={`gif-${index}`}
                              initial={{ scale: 0.9, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: index * 0.05 }}
                              className="relative group rounded-xl overflow-hidden shadow-md"
                            >
                              <img src={url} alt="gif" className="w-full h-60 object-cover" />
                              <button
                                onClick={() => removeArrayElement([setgifArr, setGifFiles], index)}
                                className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-sm cursor-pointer"
                              >
                                <X size={14} className="text-white" />
                              </button>
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {/* Mentions */}
                      {MentionedTo.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {MentionedTo.map((tag, index) => (
                            <motion.div
                              key={`mention-${index}`}
                              initial={{ scale: 0.9, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="flex items-center justify-center gap-1 bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 px-3 py-2.5 rounded-full text-sm font-medium shadow-sm"
                            >
                              <Link href={`/${tag}`}>
                                {tag}
                              </Link>
                              <button
                                onClick={() => removeArrayElement([setMentionedTo], index)}
                                className="ml-1 hover:text-yellow-900 dark:hover:text-yellow-300 cursor-pointer"
                              >
                                <X size={14} />
                              </button>
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {/* Locations */}
                      {AddLocation.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {AddLocation.map((location, index) => (
                            <motion.div
                              key={`location-${index}`}
                              initial={{ scale: 0.9, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="flex items-center gap-1 bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-full text-sm font-medium shadow-sm"
                            >
                              <Link
                                href={`https://www.google.com/maps?q=${location.coordinates[0]},${location.coordinates[1]}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1"
                              >
                                <MapPin size={14} />
                                <span>{location.text}</span>
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
                  )}
                </AnimatePresence>

                {/* Poll Preview */}
                {poll && (
                  <div className="mt-2">
                    <PollInPost poll={poll} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t rounded-2xl border-gray-100 dark:border-zinc-950 bg-gray-50/50 dark:bg-black">
            <div className="flex items-center justify-between">
              {/* Media Upload Options */}
              <div className="flex items-center gap-1">
                {/* Desktop Toolbar */}
                <div className="hidden md:flex items-center gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => imageRef.current?.click()}
                        className="cursor-pointer p-2.5 rounded-full hover:bg-yellow-100 dark:hover:bg-yellow-950/50 transition-colors group"
                        disabled={isUpdating}
                      >
                        <Image src="/images/insert-picture-icon.png" width={20} height={20} alt="image" className="dark:brightness-0 dark:invert opacity-75 group-hover:opacity-100" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Add Image</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => videoRef.current?.click()}
                        className="cursor-pointer p-2.5 rounded-full hover:bg-yellow-100 dark:hover:bg-yellow-950/50 transition-colors group"
                        disabled={isUpdating}
                      >
                        <Image src="/images/video-camera.png" width={20} height={20} alt="video" className="dark:brightness-0 dark:invert opacity-75 group-hover:opacity-100" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Add Video</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => setshowEmojiPicker(!showEmojiPicker)}
                        className="cursor-pointer p-2.5 rounded-full hover:bg-yellow-100 dark:hover:bg-yellow-950/50 transition-colors group emoji-picker-container"
                        disabled={isUpdating}
                      >
                        <Smile size={20} className="opacity-75 group-hover:opacity-100" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Add Emoji</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => setshowTagSomeone(!showTagSomeone)}
                        className="cursor-pointer p-2.5 rounded-full hover:bg-yellow-100 dark:hover:bg-yellow-950/50 transition-colors group tag-search-modal"
                        disabled={isUpdating}
                      >
                        <Image src="/images/atsign.png" width={20} height={20} alt="mention" className="dark:brightness-0 dark:invert opacity-75 group-hover:opacity-100" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Mention Someone</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => gifRef.current?.click()}
                        className="cursor-pointer p-2.5 rounded-full hover:bg-yellow-100 dark:hover:bg-yellow-950/50 transition-colors group"
                        disabled={isUpdating}
                      >
                        <span className="text-sm font-bold text-gray-600 dark:text-gray-400 group-hover:text-yellow-500 dark:group-hover:text-yellow-400">GIF</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Add GIF</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => setshowPollModal(!showPollModal)}
                        className="cursor-pointer p-2.5 rounded-full hover:bg-yellow-100 dark:hover:bg-yellow-950/50 transition-colors group create-poll"
                        disabled={isUpdating}
                      >
                        <Image src="/images/poll.png" width={20} height={20} alt="poll" className="dark:brightness-0 dark:invert opacity-75 group-hover:opacity-100" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Create Poll</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => setshowLocationSearchModal(!showLocationSearchModal)}
                        className="cursor-pointer p-2.5 rounded-full hover:bg-yellow-100 dark:hover:bg-yellow-950/50 transition-colors group"
                        disabled={isUpdating}
                      >
                        <Image src="/images/location.png" width={20} height={20} alt="tag-location" className="dark:brightness-0 dark:invert opacity-75 group-hover:opacity-100" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Add Location</TooltipContent>
                  </Tooltip>
                </div>

                {/* Mobile Dropdown */}
                <div className="dropdown-container relative md:hidden">
                  <button
                    onClick={() => setopenOptions(!openOptions)}
                    className="cursor-pointer p-2.5 rounded-full hover:bg-yellow-100 dark:hover:bg-yellow-950/50 transition-colors"
                    disabled={isUpdating}
                  >
                    <MoreHorizontalIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                  <AnimatePresence>
                    {openOptions && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-12 left-0 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-gray-200 dark:border-zinc-700 p-2 z-50 min-w-[200px]"
                      >
                        <button
                          onClick={() => { imageRef.current?.click(); setopenOptions(false); }}
                          className="flex cursor-pointer items-center gap-3 w-full p-3 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-950/30 transition-colors"
                        >
                          <Image src="/images/insert-picture-icon.png" width={20} height={20} alt="image" className="dark:invert" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">Image</span>
                        </button>
                        <button
                          onClick={() => { videoRef.current?.click(); setopenOptions(false); }}
                          className="flex cursor-pointer items-center gap-3 w-full p-3 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-950/30 transition-colors"
                        >
                          <Image src="/images/video-camera.png" width={20} height={20} alt="video" className="dark:invert" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">Video</span>
                        </button>
                        <button
                          onClick={() => { setshowEmojiPicker(true); setopenOptions(false); }}
                          className="flex cursor-pointer items-center gap-3 w-full p-3 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-950/30 transition-colors"
                        >
                          <Smile size={20} className="text-gray-600 dark:text-gray-400" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">Emoji</span>
                        </button>
                        <button
                          onClick={() => { setshowTagSomeone(true); setopenOptions(false); }}
                          className="flex cursor-pointer items-center gap-3 w-full p-3 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-950/30 transition-colors"
                        >
                          <Image src="/images/atsign.png" width={20} height={20} alt="mention" className="dark:invert" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">Mention</span>
                        </button>
                        <button
                          onClick={() => { gifRef.current?.click(); setopenOptions(false); }}
                          className="flex cursor-pointer items-center gap-3 w-full p-3 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-950/30 transition-colors"
                        >
                          <span className="text-sm font-bold text-gray-600 dark:text-gray-400">GIF</span>
                          <span className="text-sm text-gray-700 dark:text-gray-300">Add GIF</span>
                        </button>
                        <button
                          onClick={() => { setshowPollModal(true); setopenOptions(false); }}
                          className="flex cursor-pointer items-center gap-3 w-full p-3 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-950/30 transition-colors"
                        >
                          <Image src="/images/poll.png" width={20} height={20} alt="poll" className="dark:invert" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">Poll</span>
                        </button>
                        <button
                          onClick={() => { setshowLocationSearchModal(true); setopenOptions(false); }}
                          className="flex cursor-pointer items-center gap-3 w-full p-3 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-950/30 transition-colors"
                        >
                          <Image src="/images/location.png" width={20} height={20} alt="location" className="dark:invert" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">Location</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Right side actions */}
              <div className="flex items-center gap-3">
                {/* Reply Options */}
                <div className="reply-dropdown-container relative">
                  <button
                    onClick={() => setopenReplyOptions(!openReplyOptions)}
                    className="flex cursor-pointer items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-black hover:bg-gray-200 dark:hover:bg-gray-950 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300"
                    disabled={isUpdating}
                  >
                    {getReplyOptionIcon(whoCanReply)}
                    <span className="hidden sm:inline capitalize">
                      {whoCanReply === 'everyone' ? 'Everyone' : whoCanReply === 'following' ? 'Following' : whoCanReply === 'mentioned' ? 'Mentioned' : 'Verified'}
                    </span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  <AnimatePresence>
                    {openReplyOptions && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-10 right-0 mt-2 w-90 bg-white dark:bg-black rounded-2xl shadow-xl border border-gray-200 dark:border-zinc-700 p-4 z-50"
                      >
                        <div className="mb-4">
                          <h3 className="font-semibold flex items-center gap-1 text-gray-900 dark:text-white text-lg"><MessagesSquareIcon /><span>Who can reply ?</span></h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Choose who can reply to this post</p>
                        </div>
                        <div className="space-y-2">
                          {[
                            { value: 'everyone', label: 'Everyone', description: 'Anyone can reply', icon: <Globe className="w-5 h-5" /> },
                            { value: 'following', label: 'People you follow', description: 'Only followers can reply', icon: <UserPlusIcon className="w-5 h-5" /> },
                            { value: 'mentioned', label: 'Only mentioned', description: 'Only tagged people can reply', icon: <Image src="/images/atsign.png" width={20} height={20} alt="mention" className="dark:invert" /> },
                            { value: 'verified', label: 'Verified only', description: 'Only verified accounts', icon: <Image src="/images/yellow-tick.png" width={20} height={20} alt="verified" /> }
                          ].map((option) => (
                            <button
                              key={option.value}
                              onClick={() => {
                                setWhoCanReply(option.value as any);
                                setopenReplyOptions(false);
                              }}
                              className={`flex items-center gap-3 w-full p-3 cursor-pointer rounded-xl transition-colors ${whoCanReply === option.value
                                ? 'bg-yellow-50 dark:bg-yellow-950/30 ring-1 ring-yellow-400'
                                : 'hover:bg-gray-50 dark:hover:bg-gray-950'
                              }`}
                            >
                              <div className={`p-2 rounded-full ${whoCanReply === option.value ? 'bg-yellow-100 dark:bg-yellow-900' : 'bg-gray-100 dark:bg-gray-950'}`}>
                                {option.icon}
                              </div>
                              <div className="flex-1 text-left">
                                <p className="font-medium text-gray-900 dark:text-white text-sm">{option.label}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{option.description}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Character Count */}
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10">
                    <svg className="w-10 h-10 transform -rotate-90">
                      <circle
                        cx="20"
                        cy="20"
                        r="16"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        className="text-gray-200 dark:text-zinc-700"
                      />
                      <circle
                        cx="20"
                        cy="20"
                        r="16"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 16}`}
                        strokeDashoffset={`${2 * Math.PI * 16 * (1 - Math.min(charPercentage, 100) / 100)}`}
                        className={`${charPercentage > 100 ? 'text-red-500' : charPercentage > 90 ? 'text-red-400' : charPercentage > 75 ? 'text-yellow-500' : 'text-yellow-400'} transition-all duration-300`}
                      />
                    </svg>
                    <span className={`absolute inset-0 flex items-center justify-center text-xs font-medium ${getCharCountColor()}`}>
                      {post.length}
                    </span>
                  </div>
                </div>

                {/* Save Button */}
                <button
                  disabled={DisablePostButton || isUpdating}
                  onClick={handlePostUpdate}
                  className={`px-6 py-2.5 text-base font-semibold rounded-full transition-all duration-200 flex items-center gap-2 ${post.trim() && !isUpdating
                    ? "bg-yellow-400 cursor-pointer text-white hover:bg-yellow-500 transform hover:scale-105"
                    : "bg-gray-200 cursor-not-allowed text-gray-400 dark:bg-zinc-800 dark:text-gray-600"
                  }`}
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    'Save'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Hidden file inputs */}
          <input
            type="file"
            accept="image/*"
            ref={imageRef}
            onChange={(e) => handleMediaInclude(e, 'image')}
            className="hidden"
            multiple
          />
          <input
            type="file"
            accept="video/*"
            ref={videoRef}
            onChange={(e) => handleMediaInclude(e, 'video')}
            className="hidden"
          />
          <input
            type="file"
            accept="image/gif"
            ref={gifRef}
            onChange={(e) => handleMediaInclude(e, 'gif')}
            className="hidden"
          />
        </motion.div>

        {/* Modals */}
        <AnimatePresence>
          {showEmojiPicker && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-[60] emoji-picker-container"
            >
              <EmojiPicker
                onEmojiClick={(emojiData: EmojiClickData, e) => {
                  e.stopPropagation();
                  onEmojiClick(emojiData);
                  setshowEmojiPicker(false);
                }}
                theme={resolvedTheme === 'dark' ? Theme.DARK : Theme.LIGHT}
                autoFocusSearch={false}
              />
            </motion.div>
          )}

          {showTagSomeone && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-[60] w-full max-w-md tag-search-modal"
            >
              <AccountSearch
                handle={String(Account?.decodedHandle)}
                onSelect={(handle) => {
                  setMentionedTo((prev) => [...prev, handle]);
                  setshowTagSomeone(false);
                }}
                placeholder="@ Search someone to tag"
              />
            </motion.div>
          )}

          {showPollModal && Account.account && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-[60] w-full max-w-lg create-poll"
            >
              <CreatePoll plan={Account.account?.plan} questionLen={maxPostLength} />
            </motion.div>
          )}

          {showLocationSearchModal && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-[60] w-full max-w-md location-search"
            >
              <LocationSearch
                placeholder="Search a location to add..."
                onClose={() => setshowLocationSearchModal(false)}
                visible={showLocationSearchModal}
                onSelect={(location) => {
                  setAddLocation((prev) => [...prev, { text: location.text, coordinates: location.coordinates }]);
                  setshowLocationSearchModal(false);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Poll Display */}
        {(initialPoll || poll) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-2/5"
          >
            <AccountPoll isOpen={true} onClose={() => resetPoll()} poll={initialPoll || poll} />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
