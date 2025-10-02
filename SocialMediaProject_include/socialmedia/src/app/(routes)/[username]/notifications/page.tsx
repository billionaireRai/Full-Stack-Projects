'use client'

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MoreHorizontalIcon, ThumbsDown, AlertTriangle, ShieldAlert, EyeOff, Copy, SettingsIcon } from 'lucide-react';
import useCreatePost from '@/app/states/createpost';
import CreatePost from '@/components/createpost';
import Activebeep from '@/components/activebeep';
import Trendcancelpop from '@/components/trendcancelpop';
import Trendcard from '@/components/trendcard';
import NotificationCard, { Notification } from '@/components/notificationcard';

const sampleNotifications: Notification[] = [
  {
    id: '1',
    type: 'follow',
    actor: {
      id: 'u1',
      name: 'John Doe',
      username: 'johndoe',
      avatarUrl: '/images/myProfile.jpg',
    },
    timestamp: new Date(Date.now() - 60000).toISOString(),
    isFollowing: false,
  },
  {
    id: '2',
    type: 'like',
    actor: {
      id: 'u2',
      name: 'Jane Smith',
      username: 'janesmith',
      avatarUrl: '/images/myProfile.jpg',
    },
    post: {
      id: 'p1',
      thumbnailUrl: '/images/like.png',
    },
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '3',
    type: 'comment',
    actor: {
      id: 'u3',
      name: 'Alice Johnson',
      username: 'alicej',
      avatarUrl: '/images/myProfile.jpg',
    },
    post: {
      id: 'p2',
      thumbnailUrl: '/images/comment.png',
    },
    commentText: 'Great post!',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
  },
];

export default function notifications() {
  const { isCreatePop } = useCreatePost() ; // create post state...
  const [hpninPopUp, sethpninPopUp] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [notificationList, setNotificationList] = useState<Notification[]>(sampleNotifications);

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <div className='h-fit flex flex-row-reverse md:ml-72 font-poppins rounded-lg dark:bg-black'>
      <div className='mainbox hidden dark:bg-black w-fit h-fit rounded-lg xl:flex flex-col lg:flex-row-reverse gap-8 p-6 max-w-7xl mx-auto font-poppins shadow-lg'>
        <div className='right w-fit lg:w-80 xl:w-96 space-y-2'>

                    {/* What's Happening */}
                    <div className='bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-4'>
                        <div className='flex gap-3 items-center mb-4'>
                            <h2 className='text-xl font-bold text-gray-900 dark:text-white'>What&apos;s Happening</h2>
                            <Activebeep />
                        </div>
                        <ul className='space-y-3'>
                            <Trendcard rank={1} region="Global" tag="#KantaraALegendChapter1" posts="1.9k" />
                            <Trendcard rank={2} region="Global" tag="Domain For Sale" posts="18.9K" />
                            <Trendcard rank={3} region="India" tag="ProudToBeWithLadakh" posts="5.2K" />
                        </ul>
                        <div className='pt-4'>
                            <Link href={`/explore?q=${encodeURIComponent('whats-happening')}&utm_source=show-more`} className='cursor-pointer text-blue-500 hover:text-blue-600 text-sm font-medium'>
                                Show more
                            </Link>
                        </div>
                    </div>

                    {/* Who to Follow */}
                    <div className='bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm'>
                        <div className='p-4 border-b border-gray-200 dark:border-slate-700'>
                            <h2 className='text-xl font-bold text-gray-900 dark:text-white'>Who to follow</h2>
                        </div>
                        <div className='p-4 space-y-4'>
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center space-x-3'>
                                    <div className='w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold'>
                                        SG
                                    </div>
                                    <div>
                                        <p className='font-bold text-gray-900 dark:text-white text-sm'>Saket Gokhale</p>
                                        <p className='text-gray-500 dark:text-gray-400 text-sm'>@saketgohale</p>
                                    </div>
                                </div>
                                <button className='cursor-pointer bg-yellow-500 dark:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-bold hover:opacity-80 transition-opacity'>
                                    Follow
                                </button>
                            </div>
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center space-x-3'>
                                    <div className='w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold'>
                                        DL
                                    </div>
                                    <div>
                                        <p className='font-bold text-gray-900 dark:text-white text-sm'>David Laid</p>
                                        <p className='text-gray-500 dark:text-gray-400 text-sm'>@davidlaid</p>
                                    </div>
                                </div>
                                <button className='cursor-pointer bg-yellow-500 dark:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-bold hover:opacity-80 transition-opacity'>
                                    Follow
                                </button>
                            </div>
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center space-x-3'>
                                    <div className='w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold'>
                                        CB
                                    </div>
                                    <div>
                                        <p className='font-bold text-gray-900 dark:text-white text-sm'>Chris Bumsted</p>
                                        <p className='text-gray-500 dark:text-gray-400 text-sm'>@chrisbumstead</p>
                                    </div>
                                </div>
                                <button className='cursor-pointer bg-yellow-500 dark:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-bold hover:opacity-80 transition-opacity'>
                                    Follow
                                </button>
                            </div>
                        </div>
                        <div className='p-4 border-t border-gray-200 dark:border-slate-700'>
                            <button className='cursor-pointer text-blue-500 hover:text-blue-600 text-sm font-medium'>
                                Show more
                            </button>
                        </div>
                    </div>
                </div>

        </div>

        {/* Main Feed Area - Left Side */}
        <div className='left flex flex-col gap-2 h-fit flex-1 bg-white dark:bg-black rounded-xl font-poppins'>
            <div className='flex flex-row items-center justify-between text-xl p-3 rounded-lg'>
                <span className='font-bold'>Notifications</span>
                <Link href='/username/settings/notifications' className='p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 cursor-pointer'><SettingsIcon /></Link>
            </div>
            <div className='notification rounded-lg'>
              {notificationList.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onFollowToggle={(userId, newState) => {
                    console.log(`User ${userId} follow state: ${newState}`);
                  }}
                  onRemove={(notificationId) => {
                    setNotificationList((prev) =>
                      prev.filter((n) => n.id !== notificationId)
                    );
                  }}
                />
              ))}
            </div>
        </div>
        { isCreatePop && (
          <CreatePost />
        )}
       
      </div>
  )
}

