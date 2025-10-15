"use client";
import React, { useState , useEffect } from "react";
import Image from "next/image";
import useCreatePost from '@/app/states/createpost';
import toast from "react-hot-toast";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MoreHorizontalIcon , UserPlusIcon , LucideGlobe} from 'lucide-react' ;
import { TooltipContent, TooltipTrigger , Tooltip } from "./ui/tooltip";

export default function CreatePost() {
  const [post, setPost] = useState('');
  const [openOptions, setopenOptions] = useState(false);
  const [whoCanReply, setWhoCanReply] = useState<'everyone' | 'following' | 'mentioned' | 'verified'>('everyone');
  const [openReplyOptions, setOpenReplyOptions] = useState(false);
  const { data:Session } = useSession() ; // initializing the session hook...
  const { setCreatePop } = useCreatePost();
  const router = useRouter();

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

    // post submission logic here
    const handlePostSubmission = () => { 
      console.log('Posting:', post, 'Reply setting:', whoCanReply);
      setCreatePop(false);
      setPost('');
      toast.success('Post successfully created !!')
    }
  return (
    <div className='fixed inset-0 bg-black/50 backdrop-blur-md flex z-50 justify-center animate-in fade-in-0 zoom-in-95 duration-200'>
    <div className="bg-white dark:bg-black rounded-2xl shadow-xl h-fit w-full max-w-2xl mx-4 my-3 relative">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-row items-center justify-center gap-2">
          <Link href='/username'><img className="rounded-full w-13 h-13" src='/images/myProfile.jpg' alt="profile-pic" /></Link>
          <div className="flex flex-row items-center justify-center sm:gap-3">
            <span className="text-gray-500 dark:text-gray-300 text-sm font-semibold truncate">@{Session?.user?.name || 'amritansh_coder'}</span>
            <span className="text-gray-400 px-1">·</span>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Create Post
            </h2>
          </div>
        </div>
        <button
          onClick={() => {
            setCreatePop(false);
            setPost('');
          }}
          className="cursor-pointer p-2 z-50 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 transition"
        >
          <Tooltip>
            <TooltipTrigger asChild>
             <svg
               xmlns="http://www.w3.org/2000/svg"
               className="h-5 w-5 text-gray-500 dark:text-gray-300"
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
      <div className="p-4">
        <textarea
          value={post}
          onChange={(e) => setPost(e.target.value)}
          placeholder="What's Going On Buddy ??"
          rows={4}
          className="w-full resize-none border-none outline-none text-lg text-gray-900 dark:text-gray-100 bg-transparent placeholder-gray-400 dark:placeholder-gray-500"
        />

        {/* Optional: media upload */}
        <div className="flex items-center justify-between mt-3">
          <div className="dropdown-container flex relative items-center gap-4 text-blue-500">
            <span 
            onClick={() => { setopenOptions(!openOptions)}}
            className="rounded-full block sm:hidden"><MoreHorizontalIcon className={`ml-auto cursor-pointer rounded-full p-1 w-7 h-7 text-gray-600 ${ openOptions ? 'bg-yellow-200 dark:bg-gray-950' : '' }`} /></span>
            { openOptions && (
              <div className="absolute h-auto top-10 left-0 bg-white dark:bg-black rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-2 z-50 min-w-[250px]">
                <div className="flex flex-col gap-1">
                  <button className="flex items-center gap-3 w-full p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-200">
                      <Image className="dark:invert" src='/images/insert-picture-icon.png' width={20} height={20} alt='insert-pic' unoptimized />
                      <span className="text-sm font-medium">Add Image</span>
                  </button>

                  <button className="flex items-center gap-3 w-full p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-200">
                      <Image className="dark:invert" src='/images/video-camera.png' width={20} height={20} alt='insert-video' unoptimized />
                      <span className="text-sm font-medium">Add Video</span>
                  </button>

                  <button className="flex items-center gap-3 w-full p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-200">
                    <Image src='/images/smile.png' width={20} height={20} alt='add-emoji' />
                    <span className="text-sm font-medium">Add Emoji</span>
                  </button>

                  <button className="flex items-center gap-3 w-full p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-200">
                      <Image className="dark:invert" src='/images/atsign.png' width={20} height={20} alt='tag-user' unoptimized />
                      <span className="text-sm font-medium">Tag A User</span>
                  </button>

                  <button className="flex items-center gap-3 w-full p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-200">
                      <Image className="dark:invert" src='/images/insert-picture-icon.png' width={20} height={20} alt='add-gif' unoptimized />
                      <span className="text-sm font-medium">Add GIF</span>
                  </button>

                  <button className="flex items-center gap-3 w-full p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-200">
                      <Image className="dark:invert" src='/images/poll.png' width={20} height={20} alt='create-poll' unoptimized />
                      <span className="text-sm font-medium">Create Poll</span>
                  </button>

                  <button className="flex items-center gap-3 w-full p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-200">
                      <Image className="dark:invert" src='/images/location.png' width={20} height={20} alt='add-location' />
                     <span className="text-sm font-medium">Add Location</span>
                  </button>
                </div>
              </div>
            )}
          <div className="hidden sm:block">
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="cursor-pointer p-2 hover:bg-gray-200 dark:hover:bg-gray-900 rounded-full transition">
                  <Image className="dark:invert" src='/images/insert-picture-icon.png' width={20} height={20} alt='insert-pic' />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                Add Image
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="cursor-pointer p-2 hover:bg-gray-200 dark:hover:bg-gray-900 rounded-full transition">
                  <Image className="dark:invert" src='/images/video-camera.png' width={20} height={20} alt='insert-pic' />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                Add Video
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="cursor-pointer p-2 hover:bg-yellow-200 dark:hover:bg-gray-900 rounded-full transition">
                  <Image src='/images/smile.png' width={20} height={20} alt='insert-pic' />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                Add Emoji
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="cursor-pointer p-2 hover:bg-gray-200 dark:hover:bg-gray-900 rounded-full transition">
                  <Image className="dark:invert" src='/images/atsign.png' width={20} height={20} alt='insert-pic' />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                Tag A User
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="cursor-pointer p-2 hover:bg-gray-200 dark:hover:bg-gray-900 rounded-full transition">
                  <Image className="dark:invert" src='/images/insert-picture-icon.png' width={20} height={20} alt='gif' />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                Add GIF
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="cursor-pointer p-2 hover:bg-gray-200 dark:hover:bg-gray-900 rounded-full transition">
                  <Image className="dark:invert" src='/images/poll.png' width={20} height={20} alt='poll' />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                Create Poll
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="cursor-pointer p-2 hover:bg-gray-200 dark:hover:bg-gray-900 rounded-full transition">
                  <Image className="dark:invert" src='/images/location.png' width={20} height={20} alt='location' />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                Add Location
              </TooltipContent>
            </Tooltip>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="reply-dropdown-container relative">
              <button
                onClick={() => setOpenReplyOptions(!openReplyOptions)}
                className="px-4 py-1 truncate cursor-pointer bg-gray-200 dark:bg-gray-950 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-black transition"
              >
                {whoCanReply === 'everyone' ? 'Everyone can reply' : whoCanReply === 'following' ? 'People you follow' : whoCanReply === 'mentioned' ? 'Only people you mention' : 'Verified accounts only'}
              </button>
                {openReplyOptions && (
                  <div className="absolute top-full left-0 mt-2 w-[320px] md:w-[400px] bg-white dark:bg-black rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-5 z-50 animate-in slide-in-from-top-2 duration-200 max-w-sm mx-auto md:mx-0">
                    <div className="mb-4">
                      <h3 className="font-bold text-gray-900 dark:text-white text-base mb-1">Who can reply to this Post?</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Choose an audience category for replies you want to see !!!</p>
                    </div>
                    <div className="space-y-2">
                      <label
                        onClick={() => {setWhoCanReply('everyone'); setOpenReplyOptions(false);}}
                        className="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-950 rounded-lg transition-colors cursor-pointer"
                      >
                        <input 
                          type="radio" 
                          name="whoCanReply" 
                          checked={whoCanReply === 'everyone'} 
                          onChange={() => setWhoCanReply('everyone')}
                          className="w-4 h-4 mt-0.5 text-blue-600 bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 cursor-pointer" 
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-900 dark:text-white font-medium text-sm">Everyone</span>
                            <LucideGlobe className="w-4 h-4 text-gray-400" />
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Anyone on SocialMedia can reply to your post.</p>
                        </div>
                      </label>

                      <label
                        onClick={() => {setWhoCanReply('following'); setOpenReplyOptions(false);}}
                        className="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-950 rounded-lg transition-colors cursor-pointer"
                      >
                        <input 
                          type="radio" 
                          name="whoCanReply" 
                          checked={whoCanReply === 'following'} 
                          onChange={() => setWhoCanReply('following')}
                          className="w-4 h-4 mt-0.5 text-blue-600 bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 cursor-pointer" 
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-900 dark:text-white font-medium text-sm">People you follow</span>
                            <UserPlusIcon className="w-4 h-4 text-gray-400" />
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Only people you follow can reply to your post.</p>
                        </div>
                      </label>

                      <label
                        onClick={() => {setWhoCanReply('mentioned'); setOpenReplyOptions(false);}}
                        className="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-950 rounded-lg transition-colors cursor-pointer"
                      >
                        <input 
                          type="radio" 
                          name="whoCanReply" 
                          checked={whoCanReply === 'mentioned'} 
                          onChange={() => setWhoCanReply('mentioned')}
                          className="w-4 h-4 mt-0.5 text-blue-600 bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 cursor-pointer" 
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-900 dark:text-white font-medium text-sm">Only people you mention</span>
                            <Image src='/images/atsign.png' width={16} height={16} alt="mentioned" className="text-gray-400 dark:invert" />
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Only people you mention in the post can reply.</p>
                        </div>
                      </label>

                      <label
                        onClick={() => {setWhoCanReply('verified'); setOpenReplyOptions(false);}}
                        className="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-950 rounded-lg transition-colors cursor-pointer"
                      >
                        <input 
                          type="radio" 
                          name="whoCanReply" 
                          checked={whoCanReply === 'verified'} 
                          onChange={() => setWhoCanReply('verified')}
                          className="w-4 h-4 mt-0.5 text-blue-600 bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 cursor-pointer" 
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-900 dark:text-white font-medium text-sm">Verified accounts</span>
                            <Image src='/svg/blue-tick.svg' width={16} height={16} alt="verified" className="text-blue-500" />
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Only verified accounts can reply to your post.</p>
                        </div>
                      </label>
                    </div>
                  </div>
                )}
            </div>
            <button
              disabled={!post.trim()}
              onClick={() => {handlePostSubmission()}}
              className={`px-10 py-2 text-lg rounded-full font-semibold cursor-pointer transition ${
                post.trim()
                  ? "bg-yellow-400 text-white hover:bg-yellow-500 dark:bg-blue-600 dark:hover:bg-blue-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}