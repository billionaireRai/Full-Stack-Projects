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
  const maxPostLenght = 28 ; // state holding max character lenght for post...
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
    <div className='fixed inset-0 bg-black/50 backdrop-blur-md flex z-50 justify-center animate-in fade-in-0 zoom-in-95 duration-300'>
      <div className="bg-white dark:bg-black rounded-3xl shadow-2xl h-fit w-full max-w-2xl mx-4 my-6 relative border border-gray-100 dark:border-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <Link href='/username'>
              <img
                className="rounded-full w-12 h-12 ring-5 ring-yellow-100 dark:ring-2 dark:ring-blue-800 transition-transform hover:scale-105"
                src='/images/myProfile.jpg'
                alt="profile-pic"
              />
            </Link>
            <div className="flex flex-col">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Create Post
              </h2>
              <span className="text-gray-600 dark:text-gray-400 text-xs font-medium truncate">
                @{Session?.user?.name || 'amritansh_coder'}
              </span>
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
          className="w-full resize-none border-none outline-none text-xl text-gray-900 dark:text-gray-100 bg-transparent placeholder-gray-500 dark:placeholder-gray-400 focus:ring-0 focus:outline-none"
        />

        {/* Media Upload Options */}
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center gap-1">
            {/* Mobile dropdown */}
            <div className="dropdown-container relative top-0 sm:hidden">
              <button
                onClick={() => setopenOptions(!openOptions)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <MoreHorizontalIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              {openOptions && (
                <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-black rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-3 z-50 min-w-[280px]">
                  <div className="grid grid-cols-2 gap-2">
                    <button className="flex flex-col items-center cursor-pointer gap-2 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-700 dark:text-gray-200">
                      <Image className="dark:invert" src='/images/insert-picture-icon.png' width={24} height={24} alt='insert-pic' unoptimized />
                      <span className="text-xs font-medium">Image</span>
                    </button>
                    <button className="flex flex-col items-center cursor-pointer gap-2 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-700 dark:text-gray-200">
                      <Image className="dark:invert" src='/images/video-camera.png' width={24} height={24} alt='insert-video' unoptimized />
                      <span className="text-xs font-medium">Video</span>
                    </button>
                    <button className="flex flex-col items-center cursor-pointer gap-2 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-700 dark:text-gray-200">
                      <Image src='/images/smile.png' width={24} height={24} alt='add-emoji' />
                      <span className="text-xs font-medium">Emoji</span>
                    </button>
                    <button className="flex flex-col items-center cursor-pointer gap-2 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-700 dark:text-gray-200">
                      <Image className="dark:invert" src='/images/atsign.png' width={24} height={24} alt='tag-user' unoptimized />
                      <span className="text-xs font-medium">Tag</span>
                    </button>
                    <button className="flex flex-col items-center cursor-pointer gap-2 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-700 dark:text-gray-200">
                      <Image className="dark:invert" src='/images/insert-picture-icon.png' width={24} height={24} alt='add-gif' unoptimized />
                      <span className="text-xs font-medium">GIF</span>
                    </button>
                    <button className="flex flex-col items-center cursor-pointer gap-2 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-700 dark:text-gray-200">
                      <Image className="dark:invert" src='/images/poll.png' width={24} height={24} alt='create-poll' unoptimized />
                      <span className="text-xs font-medium">Poll</span>
                    </button>
                    <button className="flex flex-col items-center cursor-pointer gap-2 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-700 dark:text-gray-200">
                      <Image className="dark:invert" src='/images/location.png' width={24} height={24} alt='add-location' />
                      <span className="text-xs font-medium">Location</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Desktop buttons */}
            <div className="hidden sm:flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group">
                    <Image className="dark:invert group-hover:text-blue-500" src='/images/insert-picture-icon.png' width={20} height={20} alt='insert-pic' />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Add Image</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group">
                    <Image className="dark:invert group-hover:text-blue-500" src='/images/video-camera.png' width={20} height={20} alt='insert-video' />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Add Video</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group">
                    <Image src='/images/smile.png' width={20} height={20} alt='add-emoji' className="group-hover:text-blue-500" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Add Emoji</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group">
                    <Image className="dark:invert group-hover:text-blue-500" src='/images/atsign.png' width={20} height={20} alt='tag-user' />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Tag Someone</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group">
                    <Image className="dark:invert group-hover:text-blue-500" src='/images/insert-picture-icon.png' width={20} height={20} alt='add-gif' />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Add GIF</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group">
                    <Image className="dark:invert group-hover:text-blue-500" src='/images/poll.png' width={20} height={20} alt='create-poll' />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Create Poll</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group">
                    <Image className="dark:invert group-hover:text-blue-500" src='/images/location.png' width={20} height={20} alt='add-location' />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Add Location</TooltipContent>
              </Tooltip>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="reply-dropdown-container relative">
              <button
                onClick={() => setOpenReplyOptions(!openReplyOptions)}
                className="flex items-center cursor-pointer gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-black hover:bg-gray-200 dark:hover:bg-gray-950 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                <LucideGlobe className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {whoCanReply === 'everyone' ? 'Everyone' : whoCanReply === 'following' ? 'Following' : whoCanReply === 'mentioned' ? 'Mentioned' : 'Verified'}
                </span>
                <span className="sm:hidden">
                  {whoCanReply === 'everyone' ? 'All' : whoCanReply === 'following' ? 'Follow' : whoCanReply === 'mentioned' ? 'Mention' : 'Verify'}
                </span>
              </button>
              {openReplyOptions && (
                <div className="absolute top-full left-0 mt-3 w-90 bg-white dark:bg-black rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 z-50">
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
                </div>
              )}
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className={`text-sm bg-blue-50 dark:bg-gray-950 dark:text-white py-2 px-4 rounded-full font-medium ${maxPostLenght - post.length < 20 ? 'text-red-500 bg-red-50 dark:bg-red-950' : 'text-blue-500 dark:text-gray-700'}`}>
                {post.length} / {maxPostLenght}
              </span>
            </div>
            <button
              disabled={!post.trim()}
              onClick={() => {handlePostSubmission()}}
              className={`px-8 py-2.5 cursor-pointer text-base font-semibold rounded-full transition-all duration-200 ${
                post.trim()
                  ? "bg-blue-500 text-white hover:bg-blue-600 shadow-lg hover:shadow-xl transform hover:scale-105"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"
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