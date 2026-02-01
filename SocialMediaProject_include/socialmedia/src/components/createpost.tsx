"use client";
import React, { useState , useEffect , useRef } from "react";
import Image from "next/image";
import useCreatePost from '@/app/states/createpost';
import { useTheme } from "next-themes";
import toast from "react-hot-toast";
import Link from "next/link";
import { userCardProp } from "./usercard";
import usePoll from "@/app/states/poll";
import AccountSearch from "./accountsearch";
import AccountPoll from "./accountpoll";
import EmojiPicker ,{ EmojiClickData, Theme } from 'emoji-picker-react';
import { motion } from "framer-motion";
import useActiveAccount from "@/app/states/useraccounts";
import { MoreHorizontalIcon , UserPlusIcon , LucideGlobe, X, LocateFixed} from 'lucide-react' ;
import { TooltipContent, TooltipTrigger , Tooltip } from "./ui/tooltip";
import CreatePoll from "./createpoll";
import LocationSearch from "./locationsearch";

export default function CreatePost() {
  const maxPostLenght = 200 ; // state holding max character lenght for post...
  const [post, setPost] = useState('');
  const [DisablePostButton, setDisablePostButton] = useState<boolean>(false);
  const { Account } = useActiveAccount() ;
  const { resolvedTheme } = useTheme();
  const [showEmojiPicker, setshowEmojiPicker] = useState<boolean>(false);
  const [showTagSomeone, setshowTagSomeone] = useState<boolean>(false);
  const [showLocationSearchModal, setshowLocationSearchModal] = useState<boolean>(false);
  const [openOptions, setopenOptions] = useState(false);
  const [whoCanReply, setWhoCanReply] = useState<'everyone' | 'following' | 'mentioned' | 'verified'>('everyone');
  const { setCreatePop } = useCreatePost();
  const imageRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const gifRef = useRef<HTMLInputElement>(null);
  const [imageArr, setimageArr] = useState<string[]>([]);
  const [videoArr, setvideoArr] = useState<string[]>([]);
  const [gifArr, setgifArr] = useState<string[]>([]);
  const [MentionedTo, setMentionedTo] = useState<string[]>([]);
  const [AddLocation, setAddLocation] = useState<string[]>([]);
  const [openReplyOptions, setOpenReplyOptions] = useState(false);
  const { poll: PollInfo, isCreateOpen: showPollModal, setIsCreateOpen: setShowPollModal, isDisplayOpen: showDisplayModal, setIsDisplayOpen: setShowDisplayModal, resetPoll } = usePoll(); // extracting all states from usePoll

   // Close more options when clicking outside...
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (openOptions && !(event.target as Element).closest('.dropdown-container')) {
          setopenOptions(false)
        }
      }
  
      if (openOptions) {
        document.addEventListener('mousedown', handleClickOutside)
      }
  
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [openOptions])

    // Close reply options when clicking outside...
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (openReplyOptions && !(event.target as Element).closest('.reply-dropdown-container')) {
          setOpenReplyOptions(false)
        }
      }

      if (openReplyOptions) {
        document.addEventListener('mousedown', handleClickOutside)
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [openReplyOptions])

    // Close mobile emoji picker when clicking outside...
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (showEmojiPicker && !(event.target as Element).closest('.emoji-picker')) {
          setshowEmojiPicker(false);
        }
      };

      if (showEmojiPicker) {
        document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [showEmojiPicker]);
    // Close tag someone modal when clicking outside...
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (showTagSomeone && !(event.target as Element).closest('.tag-search-modal')) {
          setshowTagSomeone(false);
        }
      };

      if (showTagSomeone) {
        document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [showTagSomeone]);

    // Close createpoll modal when clicking outside...
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (showPollModal && !(event.target as Element).closest('.create-poll')) {
          setShowPollModal(false);
        }
      };

      if (showPollModal) {
        document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [showPollModal]);

    // Close location search modal when clicking outside...
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (showLocationSearchModal && !(event.target as Element).closest('.location-search')) {
          setshowLocationSearchModal(false);
        }
      };

      if (showLocationSearchModal) {
        document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [showLocationSearchModal]);

    // post submission logic here...
    const handlePostSubmission = () => {
      try {
        const postSubmitionApi = 
        setCreatePop(false);
        setPost('');
        resetPoll(); 
        toast.success('Post successfully created !!')
      } catch (error) {
        
      }
    }

    useEffect(() => {
      setDisablePostButton(!post.trim());
    }, [post])
    

  // funtion for emojiaddition...
  const onEmojiClick = (emojiData:EmojiClickData) => {
    setPost((prev) => prev + emojiData.emoji);
  };

  // functions for removing media/tags/locations...
  const removeArrayElement = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number) => {
    setter(prev => prev.filter((_, i) => i !== index));
  };

  // function for handling video, image, and gif url push...
  const handleMediaInclude = (e:React.ChangeEvent<HTMLInputElement>,type:string) => {
    const file = (e.target as HTMLInputElement).files?.[0]; // extrating the file...
    if (file) {
       const url = URL.createObjectURL(file);
       if (type === 'image') {
        setimageArr(prev => [...prev, url]);
       } else if (type === 'video') {
        setvideoArr(prev => [...prev, url]);
       } else if (type === 'gif') {
        setgifArr(prev => [...prev, url]);
       }
    }
  }

  return (
    <div className='fixed flex flex-col lg:flex-row overflow-y-scroll py-4 inset-0 bg-black/50 backdrop-blur-md z-50 md:items-center md:justify-start lg:justify-center lg:items-start animate-in fade-in-0 zoom-in-95 duration-300'>
      <div className="bg-white dark:bg-black rounded-3xl shadow-2xl max-h-fit max-w-2xl p-0 mx-4 my-6 relative border border-gray-100 dark:border-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between p-4 m-2 rounded-lg border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
              <img
                className="rounded-full w-16 h-16 ring-5 ring-yellow-100 dark:ring-2 transition-transform"
                src={Account.account?.avatarUrl}
                alt="profile-pic"
              />
            <div className="flex flex-col">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                lets create a post...
              </h2>
            <Link href={`/@${Account.decodedHandle}`}>
              <span className="text-gray-600 py-1 px-3 cursor-pointer hover:bg-gray-100 rounded-full dark:text-gray-400 text-xs font-medium truncate">
                @{Account.decodedHandle}
              </span>
            </Link>
            </div>
          </div>
          <button
            onClick={() => {
              setCreatePop(false);
              setPost('');
            }}
            className="cursor-pointer p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-950 transition-all duration-200 hover:scale-105"
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500 dark:text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </TooltipTrigger>
              <TooltipContent>
                Cancel Post
              </TooltipContent>
            </Tooltip>
          </button>
        </div>

      {/* Body */}
      <div className="p-6">
        <textarea
          value={post}
          maxLength={maxPostLenght}
          onChange={(e) => setPost(e.target.value)}
          placeholder="What's happening?"
          rows={4}
          className="w-full resize-none border-none outline-none text-md text-gray-900 dark:text-gray-100 bg-transparent placeholder-gray-500 dark:placeholder-gray-400 focus:ring-0 focus:outline-none"
        />

        <motion.div
          className="section-for-extra-info flex flex-col gap-1 rounded-lg p-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="img">
            {imageArr.length > 0 && (
              <motion.div
                className="flex flex-col"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
               <span className="font-bold p-2 rounded-lg">Images</span>
               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1 rounded-lg mt-2">
                {imageArr.map((url, index) => (
                  <motion.div
                    key={index}
                    className="relative group"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                  >
                    <X size={20} className="absolute opacity-0 hover:scale-110 rounded-full hover:bg-yellow-200 p-1 top-0 right-0 cursor-pointer text-yellow-500 dark:text-yellow-300 group-hover:opacity-100 transition-all duration-200" onClick={() => removeArrayElement(setimageArr, index)} />
                   <img src={url} alt="image" className="w-28 h-28 object-cover rounded-lg" />
                  </motion.div>
                ))}
               </div>
              </motion.div>
            )}
          </div>
          <div className="video">
            {videoArr.length > 0 && (
              <motion.div
                className="flex flex-col"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <span className="font-bold p-2 rounded-lg">Videos</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 rounded-lg mt-2">
                  {videoArr.map((url, index) => (
                    <motion.div
                      key={index}
                      className="relative group rounded-lg"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.05, duration: 0.2 }}
                    >
                      <X size={20} className="absolute hover:scale-110 rounded-full hover:bg-yellow-200 p-1 top-0 right-0 cursor-pointer text-yellow-500 dark:text-yellow-300 opacity-0 group-hover:opacity-100 transition-all duration-200" onClick={() => removeArrayElement(setvideoArr, index)} />
                      <video src={url} className="w-28 h-28 object-cover rounded-lg" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
          <div className="tags">
            {MentionedTo.length > 0 && (
              <motion.div
                className="flex flex-col"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                <span className="font-bold p-2 rounded-lg">Mentions</span>
                <div className="flex flex-wrap gap-2 rounded-lg mt-2">
                  {MentionedTo.map((tag, index) => (
                    <motion.div
                      key={index}
                      className="flex group items-center gap-2 bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400 p-1 rounded-lg"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.05, duration: 0.2 }}
                    >
                      <Link href={`/@${tag}`} className="p-1 px-3 rounded-lg">@{tag}</Link>
                      <X size={13} className="hidden group-hover:block hover:scale-105 transition-all duration-300 cursor-pointer text-yellow-500 dark:text-yellow-300" onClick={() => removeArrayElement(setMentionedTo, index)} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
          <div className="gifs">
            {gifArr.length > 0 && (
              <motion.div
                className="flex flex-col"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                <span className="font-bold p-2 rounded-lg">GIFs</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 rounded-lg mt-2">
                  {gifArr.map((url, index) => (
                    <motion.div
                      key={index}
                      className="relative group"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.05, duration: 0.2 }}
                    >
                      <img src={url} alt="gif" className="w-24 h-24 object-cover rounded-lg" />
                      <X size={20} className="absolute hover:scale-110 rounded-full hover:bg-yellow-200 p-1 top-0 right-0 cursor-pointer text-yellow-500 dark:text-yellow-300 opacity-0 group-hover:opacity-100 transition-all duration-200" onClick={() => removeArrayElement(setgifArr, index)} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
          <div className="locations">
            {AddLocation.length > 0 && (
              <motion.div
                className="flex flex-col"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
              >
                <span className="font-bold p-2 rounded-lg">Locations</span>
                <div className="flex flex-wrap gap-2 rounded-lg mt-2 p-2">
                  {AddLocation.map((location, index) => (
                    <motion.div
                      key={index}
                      className="relative group flex flex-row gap-1 items-center bg-yellow-100 py-1 px-3 text-yellow-600 rounded-lg"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.05, duration: 0.2 }}
                    >
                      <LocateFixed size={18} />
                      <span className="p-1 rounded-lg">{location}</span>
                      <X size={20} className="absolute -top-2 -right-2 cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-200 bg-yellow-100 dark:bg-yellow-900 rounded-full p-1 text-yellow-500 dark:text-red-300" onClick={() => removeArrayElement(setAddLocation, index)} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Media Upload Options */}
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center gap-1">
            {/* Mobile dropdown */}
            <div className="dropdown-container relative top-0 md:hidden">
              <button
                onClick={() => setopenOptions(!openOptions)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <MoreHorizontalIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              {openOptions && (
                <div className="absolute top-1/5 left-10 mb-2 bg-white dark:bg-black rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-2 z-50 min-w-[280px]">
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                     onClick={() => { imageRef.current?.click() }}
                     className="flex flex-col items-center cursor-pointer gap-2 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-700 dark:text-gray-200">
                      <Image className="dark:invert" src='/images/insert-picture-icon.png' width={24} height={24} alt='insert-pic' unoptimized />
                      <span className="text-xs font-medium">Image</span>
                    </button>
                    <button 
                     onClick={() => { videoRef.current?.click() }}
                     className="flex flex-col items-center cursor-pointer gap-2 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-700 dark:text-gray-200">
                      <Image className="dark:invert" src='/images/video-camera.png' width={24} height={24} alt='insert-video' unoptimized />
                      <span className="text-xs font-medium">Video</span>
                    </button>
                    <button
                      onClick={() => { setshowEmojiPicker(!showEmojiPicker); setopenOptions(false); }}
                      className="flex flex-col items-center cursor-pointer gap-2 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-700 dark:text-gray-200">
                      <Image src='/images/smile.png' width={24} height={24} alt='add-emoji' />
                      <span className="text-xs font-medium">Emoji</span>
                    </button>
                    <button
                      onClick={() => { setshowTagSomeone(!showTagSomeone); setopenOptions(false); }}
                      className="screen-tag flex flex-col items-center cursor-pointer gap-2 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-700 dark:text-gray-200">
                      <Image className="dark:invert" src='/images/atsign.png' width={24} height={24} alt='tag-user' unoptimized />
                      <span className="text-xs font-medium">Tag</span>
                    </button>
                    <button
                     onClick={() => { gifRef.current?.click() }}
                     className="flex flex-col items-center cursor-pointer gap-2 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-700 dark:text-gray-200">
                      <Image className="dark:invert" src='/images/insert-picture-icon.png' width={24} height={24} alt='add-gif' unoptimized />
                      <span className="text-xs font-medium">GIF</span>
                    </button>
                    <button
                      onClick={() => { setShowPollModal(true); setopenOptions(false); }}
                      className="create-poll flex flex-col items-center cursor-pointer gap-2 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-700 dark:text-gray-200">
                      <Image className="dark:invert" src='/images/poll.png' width={24} height={24} alt='create-poll' unoptimized />
                      <span className="text-xs font-medium">Poll</span>
                    </button>
                    <button 
                    onClick={() => { setshowLocationSearchModal(!showLocationSearchModal) ; setopenOptions(false) }}
                    className="flex flex-col items-center cursor-pointer gap-2 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-700 dark:text-gray-200">
                      <Image className="dark:invert" src='/images/location.png' width={24} height={24} alt='add-location' />
                      <span className="text-xs font-medium">Location</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Desktop buttons */}
            <div className="hidden md:flex items-center gap-1 relative">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    onClick={() => { imageRef.current?.click() }}
                    className="p-2 cursor-pointer rounded-full hover:bg-yellow-100 dark:hover:bg-yellow-950 transition-colors group">
                    <Image className="dark:invert group-hover:text-blue-500" src='/images/insert-picture-icon.png' width={20} height={20} alt='insert-pic' />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Add Image</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    onClick={() => { videoRef.current?.click() }}
                    className="p-2 cursor-pointer rounded-full hover:bg-yellow-100 dark:hover:bg-yellow-950 transition-colors group">
                    <Image className="dark:invert group-hover:text-blue-500" src='/images/video-camera.png' width={20} height={20} alt='insert-video' />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Add Video</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                   onClick={() => { setshowEmojiPicker(!showEmojiPicker) }}
                   className="emoji-picker p-2 cursor-pointer rounded-full hover:bg-yellow-100 dark:hover:bg-yellow-950 transition-colors group">
                    <Image src='/images/smile.png' width={20} height={20} alt='add-emoji' className="group-hover:text-blue-500" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Add Emoji</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    onClick={() => { setshowTagSomeone(!showTagSomeone) }}
                    className="screen-tag p-2 cursor-pointer rounded-full hover:bg-yellow-100 dark:hover:bg-yellow-950 transition-colors group">
                    <Image className="dark:invert group-hover:text-blue-500" src='/images/atsign.png' width={20} height={20} alt='tag-user' />
                  </button>
                </TooltipTrigger>
                <TooltipContent>mention someone</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => { gifRef.current?.click() }}
                    className="p-2 cursor-pointer rounded-full hover:bg-yellow-100 dark:hover:bg-yellow-950 transition-colors group">
                    <Image className="dark:invert group-hover:text-blue-500" src='/images/insert-picture-icon.png' width={20} height={20} alt='add-gif' />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Add GIF</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setShowPollModal(!showPollModal)}
                    className="create-poll p-2 cursor-pointer rounded-full hover:bg-yellow-100 dark:hover:bg-yellow-950 transition-colors group">
                    <Image className="dark:invert group-hover:text-blue-500" src='/images/poll.png' width={20} height={20} alt='create-poll' />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Create Poll</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                   onClick={() => { setshowLocationSearchModal(!showLocationSearchModal) }}
                   className="p-2 cursor-pointer rounded-full hover:bg-yellow-100 dark:hover:bg-yellow-950 transition-colors group">
                    <Image className="dark:invert group-hover:text-blue-500" src='/images/location.png' width={20} height={20} alt='add-location' />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Add Location</TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* responsive modals... */}
          {showEmojiPicker && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 100, damping: 10, duration: 0.2 }}
              className='emoji-picker absolute z-60 top-0 left-0 transform md:lg:-left-5'>
              <EmojiPicker onEmojiClick={(emoji) => { onEmojiClick(emoji); setshowEmojiPicker(false); }} theme={resolvedTheme === 'dark' ? Theme.DARK : resolvedTheme === 'light' ? Theme.LIGHT : Theme.AUTO} />
            </motion.div>
          )}

          {showTagSomeone && (
            <motion.div
              initial={{ opacity: 0, y: 0, x: 0, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 100, damping: 10, duration: 0.2 }}
              className='tag-search-modal absolute z-60 top-0 left-0 transform md:lg:-left-5'>
              <AccountSearch handle={String(Account?.decodedHandle)} onSelect={(handle) => { setMentionedTo((prev) => [...prev,handle]); setshowTagSomeone(false); }} placeholder="@ Search someone to tag"/>
            </motion.div>
          )}
          
          { showPollModal && (
             <motion.div
               initial={{ opacity: 0 , y:500 , x:-250, scale: 0.8 }}
               animate={{ opacity: 1, y: 400 , x:-250, scale: 1}}
               transition={{ type: 'spring', stiffness: 100, damping: 10, duration: 0.2 }}
               className='create-poll absolute z-60 -right-70 -top-30 sm:left-[35%] w-screen sm:w-lg' >
                <CreatePoll />
            </motion.div>
          )}

          { showLocationSearchModal && (
             <motion.div
               initial={{ opacity: 0 , y:500 , x:-250, scale: 0.8 }}
               animate={{ opacity: 1, y: 400 , x:-250, scale: 1}}
               transition={{ type: 'spring', stiffness: 100, damping: 10, duration: 0.2 }}
               className='location-search absolute z-60 w-md -right-65 -top-30 sm:w-lg' >
                <LocationSearch placeholder="search a location to add..." onClose={() => { setshowLocationSearchModal(false) }} visible={showLocationSearchModal} onSelect={(location) => { setAddLocation((prev) => [...prev,location] ) }}/>
            </motion.div>
          )}

          <div className="flex items-center gap-3">
            <div className="reply-dropdown-container relative">
              <button
                onClick={() => setOpenReplyOptions(!openReplyOptions)}
                className="flex items-center cursor-pointer gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-black hover:bg-gray-200 dark:hover:bg-gray-950 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                <span className="hidden sm:inline">
                  {whoCanReply === 'everyone' ? 'Everyone' : whoCanReply === 'following' ? 'Following' : whoCanReply === 'mentioned' ? 'Mentioned' : 'Verified'}
                </span>
                <span className="sm:hidden">
                  {whoCanReply === 'everyone' ? 'All' : whoCanReply === 'following' ? 'Follow' : whoCanReply === 'mentioned' ? 'Mention' : 'Verify'}
                </span>
              </button>
              {openReplyOptions && (
                <motion.div
                 initial={{ opacity: 0 , y:500 , x:-250, scale: 0.8 }}
                 animate={{ opacity: 1, y: 400 , x:-250, scale: 1}}
                 transition={{ type: 'spring', stiffness: 100, damping: 10, duration: 0.2 }} 
                 className="absolute bottom-14 z-60 left-45 sm:-left-10 md:-left-30 mt-3 w-90 bg-white dark:bg-black rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-4">
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">Who can reply?</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Choose who can reply to this post</p>
                  </div>
                  <div className="space-y-1">
                    <label
                      onClick={() => {setWhoCanReply('everyone'); setOpenReplyOptions(false);}}
                      className="flex items-center gap-3 p-3 hover:bg-blue-50 dark:hover:bg-gray-950 rounded-xl transition-colors cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="whoCanReply"
                        checked={whoCanReply === 'everyone'}
                        onChange={() => setWhoCanReply('everyone')}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <div className="flex-1">
                        <span className="text-gray-900 dark:text-white font-medium text-sm">Everyone</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Anyone can reply</p>
                      </div>
                      <LucideGlobe className="w-5 h-5 text-gray-400 dark:text-white" />
                    </label>

                    <label
                      onClick={() => {setWhoCanReply('following'); setOpenReplyOptions(false);}}
                      className="flex items-center gap-3 p-3 hover:bg-blue-50 dark:hover:bg-gray-950 rounded-xl transition-colors cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="whoCanReply"
                        checked={whoCanReply === 'following'}
                        onChange={() => setWhoCanReply('following')}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <div className="flex-1">
                        <span className="text-gray-900 dark:text-white font-medium text-sm">People you follow</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Only followers can reply</p>
                      </div>
                      <UserPlusIcon className="w-5 h-5 text-gray-400 dark:text-white" />
                    </label>

                    <label
                      onClick={() => {setWhoCanReply('mentioned'); setOpenReplyOptions(false);}}
                      className="flex items-center gap-3 p-3 hover:bg-blue-50 dark:hover:bg-gray-950 rounded-xl transition-colors cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="whoCanReply"
                        checked={whoCanReply === 'mentioned'}
                        onChange={() => setWhoCanReply('mentioned')}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <div className="flex-1">
                        <span className="text-gray-900 dark:text-white font-medium text-sm">Only mentioned</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Only tagged people can reply</p>
                      </div>
                      <Image src='/images/atsign.png' width={20} height={20} alt="mentioned" className="text-gray-400 dark:invert" />
                    </label>

                    <label
                      onClick={() => {setWhoCanReply('verified'); setOpenReplyOptions(false);}}
                      className="flex items-center gap-3 p-3 hover:bg-blue-50 dark:hover:bg-gray-950 rounded-xl transition-colors cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="whoCanReply"
                        checked={whoCanReply === 'verified'}
                        onChange={() => setWhoCanReply('verified')}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <div className="flex-1">
                        <span className="text-gray-900 dark:text-white font-medium text-sm">Verified only</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Only verified accounts</p>
                      </div>
                      <Image src='/images/yellow-tick.png' width={20} height={20} alt="verified" className="text-blue-500" />
                    </label>
                  </div>
                </motion.div>
              )}
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className={`text-sm bg-blue-50 dark:bg-gray-950 dark:text-white py-2 px-4 rounded-full font-medium ${maxPostLenght - post.length < 20 ? 'text-red-500 bg-red-50 dark:bg-red-950' : 'text-blue-500 dark:text-gray-700'}`}>
                {post.length} / {maxPostLenght}
              </span>
            </div>
            <button
              disabled={DisablePostButton}
              onClick={() => {handlePostSubmission()}}
              className={`px-8 py-2.5 text-base font-semibold rounded-full transition-all duration-200 ${
                post.trim()
                  ? "bg-yellow-500 cursor-pointer text-white hover:bg-yellow-600 shadow-lg hover:shadow-xl transform hover:scale-105"
                  : "bg-gray-200 cursor-not-allowed text-gray-400 dark:bg-gray-700 dark:text-gray-500"
              }`}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>

      {/* Poll Display */}
      { showDisplayModal && PollInfo && (
        <div className="m-6 md:w-lg">
          <AccountPoll isOpen={showDisplayModal} onClose={resetPoll} poll={PollInfo} />
        </div>
      )}
    <input
      type="file"
      accept="image/*"
      ref={imageRef}
      onChange={(e) => { handleMediaInclude(e,'image') }}
      className="hidden"
    />
    <input
      type="file"
      accept="video/*"
      ref={videoRef}
      onChange={(e) => { handleMediaInclude(e,'video') }}
      className="hidden"
    />
    <input
      type="file"
      accept="image/gif"
      ref={gifRef}
      onChange={(e) => { handleMediaInclude(e,'gif') }}
      className="hidden"
    />
    </div>
  );
}