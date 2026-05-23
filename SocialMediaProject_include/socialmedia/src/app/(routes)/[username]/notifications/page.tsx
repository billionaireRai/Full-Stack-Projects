'use client'

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Usercard, { userCardProp } from '@/components/usercard';
import { handleScrollToTop } from '@/lib/windowtopscroll';
import { Users, ArrowBigUpIcon, SettingsIcon } from 'lucide-react';
import Activebeep from '@/components/activebeep';
import Trendcard from '@/components/trendcard';
import NotificationCard, { Notification } from '@/components/notificationcard';
import { MdNotifications } from 'react-icons/md';

export default function notifications() {
  const [ShowLess, setShowLess] = useState<boolean>(false);
  const [suggesstionNum, setsuggesstionNum] = useState<number>(3);
  const [notificationList, setNotificationList] = useState<Notification[]>([
    {
      id: '1',
      type: 'follow',
      actor: {
        id: 'u1',
        name: 'John Doe',
        username: '@johndoe',
        isVerified: false,
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
        username: '@janesmith',
        isVerified: true,
        avatarUrl: '/images/myProfile.jpg',
      },
      post: {
        id: 'p1',
        thumbnailUrl: 'https://cdn.pixabay.com/photo/2026/05/03/03/20/03-20-08-521_1280.jpg',
      },
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: '3',
      type: 'comment',
      actor: {
        id: 'u3',
        name: 'Alice Johnson',
        username: '@alicej',
        isVerified: true,
        avatarUrl: '/images/myProfile.jpg',
      },
      post: {
        id: 'p2',
        thumbnailUrl: 'https://cdn.pixabay.com/photo/2026/05/05/09/35/09-35-14-122_1280.jpg',
      },
      commentText: 'Hey buddy light weight!!',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: '4',
      type: 'mention',
      actor: {
        id: 'u4',
        name: 'Bob Wilson',
        username: '@bobwilson',
        isVerified: false,
        avatarUrl: '/images/myProfile.jpg',
      },
      post: {
        id: 'p3',
        thumbnailUrl: 'https://cdn.pixabay.com/photo/2026/02/28/00/51/atsu_tettey-beautiful-girl-10147760_1280.jpg',
      },
      timestamp: new Date(Date.now() - 1800000).toISOString(),
    },
    {
      id: '5',
      type: 'repost',
      actor: {
        id: 'u5',
        name: 'Charlie Brown',
        username: '@charliebrown',
        isVerified: true,
        avatarUrl: '/images/myProfile.jpg',
      },
      post: {
        id: 'p4',
        thumbnailUrl: 'https://vidiq.com/_next/image/?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2F7g6d2cj1%2Fproduction%2Fda30eb0f304fa10846dd371b2df21385fb5d722f-1280x720.jpg%3Fh%3D720%26q%3D70%26auto%3Dformat&w=1080&q=70&dpl=dpl_22ELgAJEoF6JLNdpKZFXKrQupXGC',
      },
      timestamp: new Date(Date.now() - 7200000).toISOString(),
    }
  ]);

  // random follow suggestions data
  const [FollowSuggesstions, setFollowSuggesstions] = useState<userCardProp[]>([
    {
      decodedHandle: '@alice_dev',
      name: 'Alice Developer',
      IsFollowing: true,
      account: {
        name: 'Alice Developer',
        handle: '@alice_dev',
        bio: 'Full-stack developer | React enthusiast | Building the future one commit at a time.',
        location: {
          text: 'New York, NY',
          coordinates: [40.7128, -74.0060] as [number, number],
        },
        website: 'https://alice-dev.com',
        joinDate: '2020-05-15',
        following: '234',
        followers: '1.2k',
        Posts: '456',
        isCompleted: true,
        isVerified: true,
        plan: 'Pro',
        bannerUrl: '/images/default-banner.jpg',
        avatarUrl: '/images/default-profile-pic.png',
      },
    },
    {
      decodedHandle: '@bob_designer',
      name: 'Bob Designer',
      IsFollowing: false,
      account: {
        name: 'Bob Designer',
        handle: '@bob_designer',
        bio: 'Creative designer | Minimalist | Coffee addict | Turning ideas into beautiful interfaces.',
        location: {
          text: 'Los Angeles, CA',
          coordinates: [34.0522, -118.2437] as [number, number],
        },
        website: 'https://bob-designs.com',
        joinDate: '2019-08-22',
        following: '567',
        followers: '3.4k',
        Posts: '789',
        isCompleted: true,
        isVerified: false,
        plan: 'Free',
        bannerUrl: '/images/default-banner.jpg',
        avatarUrl: '/images/default-profile-pic.png',
      },
    },
    {
      decodedHandle: '@charlie_writer',
      name: 'Charlie Writer',
      IsFollowing: false,
      account: {
        name: 'Charlie Writer',
        handle: '@charlie_writer',
        bio: 'Tech writer | Blogger | Sharing insights on the latest in technology and development.',
        location: {
          text: 'Austin, TX',
          coordinates: [30.2672, -97.7431] as [number, number],
        },
        website: 'https://charlie-writes.com',
        joinDate: '2018-11-10',
        following: '123',
        followers: '5.6k',
        Posts: '1,234',
        isCompleted: true,
        isVerified: true,
        plan: 'Pro',
        bannerUrl: '/images/default-banner.jpg',
        avatarUrl: '/images/default-profile-pic.png',
      },
    },
    {
      decodedHandle: '@diana_startup',
      name: 'Diana Entrepreneur',
      IsFollowing: true,
      account: {
        name: 'Diana Entrepreneur',
        handle: '@diana_startup',
        bio: 'Entrepreneur | AI enthusiast | Founder of innovative tech solutions.',
        location: {
          text: 'Seattle, WA',
          coordinates: [47.6062, -122.3321] as [number, number],
        },
        website: 'https://diana-startup.com',
        joinDate: '2021-02-28',
        following: '345',
        followers: '890',
        Posts: '234',
        isCompleted: true,
        isVerified: false,
        plan: 'Free',
        bannerUrl: '/images/default-banner.jpg',
        avatarUrl: '/images/default-profile-pic.png',
      },
    },
    {
      decodedHandle: '@eve_photographer',
      name: 'Eve Photographer',
      IsFollowing: false,
      account: {
        name: 'Eve Photographer',
        handle: '@eve_photographer',
        bio: 'Professional photographer | Nature lover | Sharing visual stories through lenses.',
        location: {
          text: 'Denver, CO',
          coordinates: [39.7392, -104.9903] as [number, number],
        },
        website: 'https://eve-photography.com',
        joinDate: '2017-07-04',
        following: '678',
        followers: '7.8k',
        Posts: '2,345',
        isCompleted: true,
        isVerified: true,
        plan: 'Pro',
        bannerUrl: '/images/default-banner.jpg',
        avatarUrl: '/images/default-profile-pic.png',
      },
    },
  ]);

  // function for showing more suggestions...
  const handleSuggesstionShow = () => {
    if (ShowLess) {
      setsuggesstionNum(3);
      setShowLess(false);
    } else {
      if (FollowSuggesstions.length - suggesstionNum >= 3) {
        setsuggesstionNum(suggesstionNum + 3);
        if (suggesstionNum + 3 === FollowSuggesstions.length) {
          setShowLess(true);
        }
      }
    }
  };

  return (
    <div className='w-full h-full flex font-poppins rounded-lg dark:bg-black p-1'>
      <div className='mainbox flex flex-col xl:flex-row-reverse w-full h-fit max-w-7xl mx-auto font-poppins shadow-lg dark:bg-black rounded-lg'>
        <div className='right flex flex-col gap-5 p-6'>
            {/* What&apos;s Happening */}
            <div className='bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-4'>
              <div className='flex gap-3 items-center mb-4'>
                <h2 className='text-xl font-bold text-gray-900 dark:text-white'>What&apos;s Happening</h2>
                <Activebeep />
              </div>
              <ul className='space-y-5'>
                <Trendcard rank={1} region='Global' tag='#KantaraALegendChapter1' posts={19000} />
                <Trendcard rank={2} region='Global' tag='#DomainForSale' posts={18900} />
                <Trendcard rank={3} region='India' tag='#ProudToBeWithLadakh' posts={5200} />
              </ul>
              <div className='pt-4'>
                <Link
                  href={`/explore?q=${encodeURIComponent('whats-happening')}&utm_source=show-more`}
                  className='cursor-pointer text-blue-500 hover:text-blue-600 text-sm font-medium'
                >
                  Show more
                </Link>
              </div>
            </div>

            {/* Who to Follow */}
            <div className='z-20 lg:block flex-1 h-fit'>
              <div className='space-y-4'>
                <div className='relative bg-white dark:bg-black rounded-xl'>
                  <div className='p-4 m-2 border-b rounded-md flex gap-2 items-center border-gray-200 dark:border-gray-700'>
                    <Users size={20} />
                    <h2 className='text-xl font-bold text-gray-900 dark:text-white'>Suggestions</h2>
                  </div>
                  <div className='p-4'>
                    {FollowSuggesstions.map(
                      (usercard, index) =>
                        index + 1 <= suggesstionNum && (
                          <div key={index + 1} className='flex items-center justify-between'>
                            <Usercard
                              content={null}
                              decodedHandle={usercard.decodedHandle}
                              name={usercard.name}
                              IsFollowing={usercard.IsFollowing}
                              account={usercard.account}
                            />
                          </div>
                        )
                    )}
                  </div>
                </div>
                <div className='p-2 m-2 rounded-md border-t border-gray-200 dark:border-gray-700'>
                  <button
                    onClick={() => {
                      handleSuggesstionShow();
                    }}
                    className='cursor-pointer hover:bg-blue-100 dark:hover:bg-gray-950 p-2 rounded-full text-blue-500 hover:text-blue-600 text-sm font-medium'
                  >
                    {ShowLess ? 'Show less' : 'Show more'}
                  </button>
                </div>

                <button
                  onClick={() => {
                    handleScrollToTop(window);
                  }}
                  className='fixed right-5 bottom-10 rounded-full p-1 hover:bg-yellow-100 dark:hover:bg-gray-950 cursor-pointer z-50'
                >
                  <ArrowBigUpIcon width={40} height={40} stroke='5' className='fill-yellow-400' />
                </button>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className='order-2 lg:order-1 left flex flex-col gap-2 h-fit flex-1 bg-white dark:bg-black rounded-xl font-poppins'>
            <div className='flex flex-row items-center justify-between text-xl p-3 border-b border-gray-200 dark:border-gray-700 rounded-lg'>
              <div className='flex items-center justify-center gap-2'>
                <MdNotifications size={25} />
                <span className='font-bold'>Notifications</span>
              </div>
              <Link
                href='/username/settings/notifications'
                className='p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 cursor-pointer'
              >
                <SettingsIcon />
              </Link>
            </div>

            <div className='notification rounded-lg'>
              {notificationList.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onRemove={(notificationId) => {
                    setNotificationList((prev) => prev.filter((n) => n.id !== notificationId));
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
  );
}

