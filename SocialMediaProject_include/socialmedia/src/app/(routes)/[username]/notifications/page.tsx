'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Usercard, { userCardProp } from '@/components/usercard';
import { handleScrollToTop } from '@/lib/windowtopscroll';
import { Users, ArrowBigUpIcon, SettingsIcon , BellOff } from 'lucide-react';
import Activebeep from '@/components/activebeep';
import useActiveAccount from '@/app/states/useraccounts';
import Trendcard from '@/components/trendcard';
import NotificationCard, { Notification, NotificationCardSkeleton } from '@/components/notificationcard';
import { MdNotifications } from 'react-icons/md';
import axiosInstance from '@/lib/interceptor';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';

export default function notifications() {
  const params = useParams() ;
  const pagesize = 15 ;
  const autoHeightGap:number = 200 ;
  const { Account } = useActiveAccount() ;
  const [Page, setPage] = useState<number>(1);
  const [hasMoreNotifications, sethasMoreNotifications] = useState<boolean>(true);
  const [Loading, setLoading] = useState<boolean>(false);
  const [ShowLess, setShowLess] = useState<boolean>(false);
  const [suggesstionNum, setsuggesstionNum] = useState<number>(3);
  const [notificationList, setNotificationList] = useState<Notification[]>([
    {
      id: 'Buf942u2-2f43goj',
      type: 'follow',
      actor: {
        id: 'u1',
        decodedHandle: '@johndoe',
        name: 'John Doe',
        content: null,
        IsFollowing: false,
        account: {
          name: 'John Doe',
          handle: '@johndoe',
          bio: 'Building products with React • Coffee • Photography',
          location: {
            text: 'San Francisco, CA',
            coordinates: [37.7749, -122.4194],
          },
          website: 'https://johndoe.dev',
          joinDate: '2019-03-15',
          following: '342',
          followers: '1.2k',
          Posts: '89',
          isCompleted: true,
          isVerified: true,
          plan: 'Pro',
          bannerUrl: '/images/default-banner.jpg',
          avatarUrl: 'https://thfvnext.bing.com/th/id/OIP.On_6I6jFim_SXFBxoKSw-AHaHa?w=185&h=185&c=7&r=0&o=7&cb=thfvnextfalcon&dpr=1.3&pid=1.7&rm=3',
        },
      },
      timestamp: new Date(Date.now() - 60000).toISOString(),
      isread:false,
      isliked:false,
      isReplied:false,
    },
    {
      id: 'bb8g753gnrfmok',
      type: 'like',
      actor: {
        id: 'u2',
        decodedHandle: '@janesmith',
        name: 'Jane Smith',
        content: null,
        IsFollowing: false,
        account: {
          name: 'Jane Smith',
          handle: '@janesmith',
          bio: 'Designing calm experiences • Coffee • Travel stories',
          location: { text: 'London, UK', coordinates: [51.5072, -0.1276] },
          website: 'https://janesmith.design',
          joinDate: '2020-08-10',
          following: '811',
          followers: '2.4k',
          Posts: '312',
          isCompleted: true,
          isVerified: true,
          plan: 'Pro',
          bannerUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=60',
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=60',
        },
      },
      post: {
        id: 'p1'
      },
      isread:false,
      isliked:false,
      isReplied:true,
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'jv320efjnedmnr',
      type: 'comment',
      actor: {
        id: 'u3',
        decodedHandle: '@alicej',
        name: 'Alice Johnson',
        content: null,
        IsFollowing: false,
        account: {
          name: 'Alice Johnson',
          handle: '@alicej',
          bio: 'Frontend engineer • Motion & micro-interactions • Building community',
          location: { text: 'Toronto, ON', coordinates: [43.6532, -79.3832] },
          website: 'https://alicejohnson.dev',
          joinDate: '2018-10-02',
          following: '1,104',
          followers: '9.6k',
          Posts: '742',
          isCompleted: true,
          isVerified: true,
          plan: 'Pro',
          bannerUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=60',
          avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=256&q=60',
        },
      },
      comment: 'Hey buddy light weight!!',
      post: {
        id: 'p2',
        thumbnailUrl: { 
          url:'https://cdn.pixabay.com/photo/2026/05/05/09/35/09-35-14-122_1280.jpg',
          media_type:'image'
        },
      },
      isread:false,
      isliked:false,
      isReplied:true,
      timestamp: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'DH8ie2hiejmfcee',
      type: 'post',
      actor: {
        id: 'u4',
        decodedHandle: '@alicej',
        name: 'Alice Johnson',
        content: null,
        IsFollowing: false,
        account: {
          name: 'Alice Johnson',
          handle: '@alicej',
          bio: 'Frontend engineer • Motion & micro-interactions • Building community',
          location: { text: 'Toronto, ON', coordinates: [43.6532, -79.3832] },
          website: 'https://alicejohnson.dev',
          joinDate: '2018-10-02',
          following: '1,104',
          followers: '9.6k',
          Posts: '742',
          isCompleted: true,
          isVerified: true,
          plan: 'Pro',
          bannerUrl: 'https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1200&q=60',
          avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=60',
        },
      },
      post: {
        id: 'p3',
      },
      comment: 'Hey buddy light weight!!',
      isread:true,
      isliked:true,
      isReplied:false,
      timestamp: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: '9r3802nfkdvrk',
      type: 'mention',
      actor: {
        id: 'u4',
        name: 'Bob Wilson',
        decodedHandle: '@bobwilson',
        content: null,
        IsFollowing: false,
        account: {
          name: 'Bob Wilson',
          handle: '@bobwilson',
          bio: 'Product designer | Storyteller | Making interfaces feel effortless',
          location: { text: 'Austin, TX', coordinates: [30.2672, -97.7431] },
          website: 'https://bobwilson.design',
          joinDate: '2017-06-18',
          following: '624',
          followers: '4.1k',
          Posts: '517',
          isCompleted: true,
          isVerified: false,
          plan: 'Free',
          bannerUrl: '/images/default-banner.jpg',
          avatarUrl: 'https://thfvnext.bing.com/th/id/OIP.6jPjOg7y2h0HMPvyF2yYogHaJn?w=131&h=180&c=7&r=0&o=7&cb=thfvnextfalcon&dpr=1.3&pid=1.7&rm=3',
        },
      },
      post: {
        id: 'p4',
        thumbnailUrl:{ 
          url: 'https://cdn.pixabay.com/photo/2026/02/28/00/51/atsu_tettey-beautiful-girl-10147760_1280.jpg',
          media_type:'image'
        }
      },
      isread:true,
      isliked:false,
      isReplied:false,
      timestamp: new Date(Date.now() - 1800000).toISOString(),
    },
    {
      id: 'g2hrb0fdifjndmck',
      type: 'repost',
      actor: {
        id: 'u5',
        decodedHandle: '@charliebrown',
        name: 'Charlie Brown',
        content: null,
        IsFollowing: false,
        account: {
          name: 'Charlie Brown',
          handle: '@charliebrown',
          bio: 'Data nerd • Systems thinker • Building reliable tools',
          location: { text: 'Chicago, IL', coordinates: [41.8781, -87.6298] },
          website: 'https://charliebrown.dev',
          joinDate: '2016-09-21',
          following: '498',
          followers: '2.9k',
          Posts: '1,013',
          isCompleted: true,
          isVerified: true,
          plan: 'Pro',
          bannerUrl: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1200&q=60',
          avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=256&q=60',
        },
      },
      post: {
        id: 'p5',
        thumbnailUrl: { 
          url:'https://vidiq.com/_next/image/?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2F7g6d2cj1%2Fproduction%2Fda30eb0f304fa10846dd371b2df21385fb5d722f-1280x720.jpg%3Fh%3D720%26q%3D70%26auto%3Dformat&w=1080&q=70&dpl=dpl_22ELgAJEoF6JLNdpKZFXKrQupXGC',
          media_type:'image'
        }  
      },
      isread:true,
      isliked:false,
      isReplied:false,
      timestamp: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: '121wde0fbvt8gi3',
      type: 'notification_like',
      actor: {
        id: 'u6',
        decodedHandle: '@amritnashcoder',
        name: 'Amritansh Coder',
        content: null,
        IsFollowing: false,
        account: {
          name: 'Amritansh Coder',
          handle: '@amritnashcoder',
          bio: 'Full-stack builder • React/Node • Building scalable apps',
          location: { text: 'Gurugram, IN', coordinates: [28.4595, 77.0266] },
          website: 'https://amritnashcoder.dev',
          joinDate: '2021-01-28',
          following: '1,203',
          followers: '15.8k',
          Posts: '2,144',
          isCompleted: true,
          isVerified: true,
          plan: 'Pro',
          bannerUrl: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=60',
          avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=60',
        },
      },
      post: {
        id: 'p5',
      },
      isread:true,
      isliked:true,
      isReplied:false,
      timestamp: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: '30490mnlsdivfh45',
      type: 'notification_comment',
      comment:'Thanks for appreciation buddy !!',
      actor: {
        id: 'u6',
        decodedHandle: '@dwyanejhonson__',
        name: 'Dwyane Jhonson',
        content: null,
        IsFollowing: false,
        account: {
          name: 'Dwyane Jhonson',
          handle: '@dwyanejhonson__',
          bio: 'Full-stack builder • React/Node • Building scalable apps',
          location: { text: 'Gurugram, IN', coordinates: [28.4595, 77.0266] },
          website: 'https://dwyaneJ.dev',
          joinDate: '2021-01-28',
          following: '103',
          followers: '18k',
          Posts: '214',
          isCompleted: true,
          isVerified: true,
          plan: 'Pro',
          bannerUrl: '/images/default-banner.jpg',
          avatarUrl: 'https://thfvnext.bing.com/th/id/OIP.ifu4MSkanltVdVKnuzRjdQHaHa?w=217&h=217&c=7&r=0&o=7&cb=thfvnextfalcon&dpr=1.3&pid=1.7&rm=3',
        },
      },
      post: {
        id: 'p5',
      },
      isread:true,
      isliked:false,
      isReplied:false,
      timestamp: new Date(Date.now() - 7200000).toISOString(),
    }
  ]);

  // trends array...
  const [Trends,setTrends] = useState([
    { rank: 1, region: "India", tag: "#Baaghi4Trailer", posts: 3592 },
    { rank: 2, region: "India", tag: "#CricketWorldCup", posts: 45823 },
    { rank: 3, region: "USA", tag: "#TarrifExposition", posts: 3352 },
    { rank: 4, region: "Europe", tag: "#AirbusTransfer", posts: 67776 },
    { rank: 5, region: "India", tag: "#10DayMBA", posts: 80385 }
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
    {
      decodedHandle: '@frank_ml',
      name: 'Frank ML',
      IsFollowing: false,
      account: {
        name: 'Frank ML',
        handle: '@frank_ml',
        bio: 'Machine learning engineer | Loves building recommender systems and neat demos.',
        location: {
          text: 'Chicago, IL',
          coordinates: [41.8781, -87.6298] as [number, number],
        },
        website: 'https://frankml.dev',
        joinDate: '2018-04-19',
        following: '412',
        followers: '2.1k',
        Posts: '612',
        isCompleted: true,
        isVerified: false,
        plan: 'Free',
        bannerUrl: '/images/default-banner.jpg',
        avatarUrl: '/images/default-profile-pic.png',
      },
    },
    {
      decodedHandle: '@grace_garden',
      name: 'Grace Garden',
      IsFollowing: true,
      account: {
        name: 'Grace Garden',
        handle: '@grace_garden',
        bio: 'Urban gardening | Plant care tips | Growing calm one leaf at a time.',
        location: {
          text: 'Portland, OR',
          coordinates: [45.5152, -122.6784] as [number, number],
        },
        website: 'https://gracegarden.io',
        joinDate: '2020-09-07',
        following: '305',
        followers: '9.4k',
        Posts: '1,102',
        isCompleted: true,
        isVerified: true,
        plan: 'Pro',
        bannerUrl: '/images/default-banner.jpg',
        avatarUrl: '/images/default-profile-pic.png',
      },
    },
    {
      decodedHandle: '@henry_hikes',
      name: 'Henry Hikes',
      IsFollowing: false,
      account: {
        name: 'Henry Hikes',
        handle: '@henry_hikes',
        bio: 'Trail explorer | Hiking photos | Finding best routes and sunrise spots.',
        location: {
          text: 'Phoenix, AZ',
          coordinates: [33.4484, -112.0740] as [number, number],
        },
        website: 'https://henryhikes.com',
        joinDate: '2016-03-14',
        following: '188',
        followers: '4.7k',
        Posts: '889',
        isCompleted: true,
        isVerified: false,
        plan: 'Free',
        bannerUrl: '/images/default-banner.jpg',
        avatarUrl: '/images/default-profile-pic.png',
      },
    },
    {
      decodedHandle: '@isla_designs',
      name: 'Isla Designs',
      IsFollowing: true,
      account: {
        name: 'Isla Designs',
        handle: '@isla_designs',
        bio: 'Product design | UI patterns | Turning complex ideas into simple flows.',
        location: {
          text: 'Boston, MA',
          coordinates: [42.3601, -71.0589] as [number, number],
        },
        website: 'https://isla.design',
        joinDate: '2019-11-23',
        following: '523',
        followers: '6.2k',
        Posts: '1,540',
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

  // function to handle notification fetching logic...
  async function fetchNotifications() {
    try {
      setLoading(true);
      const notificationsApi = await axiosInstance.get(`/api/account/notifications?handle=${params?.username}&page=${Page}&pagesize=${pagesize}`);
      if (notificationsApi.status === 200) {
        const data = notificationsApi.data ;
        setNotificationList((prev) => [...prev,...data.notifications]);
        sethasMoreNotifications(data.hasMore);
        setLoading(false);
        MarkNotificationsRead(); 
      }
    } catch (error) {
      console.log("An error occured in fetching notifications...");
      setLoading(false);
    }
  }
  // useeffect for auto-fethcing of notifications....
    // useEffect(() => {
    // if ((window.innerHeight - window.scrollY) <= autoHeightGap && hasMoreNotifications)   setPage( Page + 1 ) ;

  // }, [window.scrollY]) ]


  // function for marking notifications read...
  async function MarkNotificationsRead() {
    try {
      const readUpdateApi = await axiosInstance.patch('/api/account/notifications',{ page:Page , size:pagesize });
      if (readUpdateApi.status === 200) {
        notificationList.forEach((notifcn) => { 
          if(!notifcn.isread)  notifcn.isread = true ;
        })
        toast.success("New notifications read !!");
      }
    } catch (error) {
      console.log("An error occured in updating isRead state of notification...");
    }
  }

  // when the Page state changes fetch notifications and marking read...
  useEffect(() => {
    // fetchNotifications() ;
  }, [Page])

  // function for getting trends...
  async function getOtherExploreInfo() {
    const otherapi = await axiosInstance.post('/api/explore');
    if (otherapi.status === 200) {
      setFollowSuggesstions(otherapi.data.suggesstions);
      setTrends(otherapi.data.trendingHashtags);
    }
  }

  // useffect for handling isRead feild...
  useEffect(() => {
    // getOtherExploreInfo()
  }, [])
    

  return (
    <div className='w-full h-full flex font-poppins rounded-lg dark:bg-black p-1'>
      <div className='mainbox flex flex-col xl:flex-row-reverse w-full h-fit max-w-7xl mx-auto font-poppins shadow-lg dark:bg-black rounded-lg'>
        <div className='right flex flex-col gap-5 p-6'>
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

            {/* What&apos;s Happening */}
            <div className='bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-4'>
              <div className='flex gap-3 items-center mb-4'>
                <h2 className='text-xl font-bold text-gray-900 dark:text-white'>What&apos;s Happening</h2>
                <Activebeep />
              </div>
              <ul className='space-y-5'>
                {Array.isArray(Trends) && Trends.map((trend,i) => (
                  <Trendcard key={ i + 1 } rank={trend.rank} region={trend.region} tag={trend.tag} posts={trend.posts} />
                ))}
              </ul>
              <div className='p-4'>
                <Link
                  href={`/explore?q=${encodeURIComponent('whats-happening')}&utm_source=show-more`}
                  className='cursor-pointer text-blue-500 hover:text-blue-600 text-sm font-medium'
                >
                  Show more
                </Link>
              </div>
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
                href={`/${Account.decodedHandle}/settings/notifications`}
                className='p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 cursor-pointer'
              >
                <SettingsIcon />
              </Link>
            </div>

            {Array.isArray(notificationList) && notificationList.length > 0 ? (
              <div className='notification rounded-lg'>
                {notificationList.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onRemove={(notificationId) => { setNotificationList((prev) => prev.filter((n) => n.id !== notificationId)) }}
                  />
                ))}
                {/* loading section on auto scroll trigger... */}
                <div className='relative my-4'>
                  {(Loading) && (
                    <div
                      className='rounded-xl flex flex-col gap-2 bg-white/80 dark:bg-black/40 px-1'
                      aria-live='polite'
                    >
                      <div className='flex items-center justify-center gap-3'>
                        <div className='relative h-6 w-6'>
                          <div className='absolute inset-0 rounded-full border-3 border-gray-200 dark:border-gray-700 border-t-yellow-400 dark:border-t-yellow-300 animate-spin' />
                        </div>
                      </div>
                      <div className='mt-3 space-y-2'>
                        {[1, 2, 3, 4].map((i) => ( <div key={i}> <NotificationCardSkeleton isodd={( i%2 !== 0 ) ? true : false } /></div> ))}
                      </div>
                    </div>
                  )}

                  {!hasMoreNotifications && !Loading && (
                    <div className='pt-4 pb-2 text-center text-xs text-gray-500 dark:text-gray-400'>
                      You’ve reached the end 🎉
                    </div>
                  )}
                </div>
              </div>
            ) : (
               <div className="rounded-xl bg-white dark:bg-black p-8">
                 <div className="flex flex-col items-center justify-center text-center gap-3">
                   <div className="w-12 h-12 rounded-full bg-yellow-50 dark:bg-gray-950 flex items-center justify-center">
                     <BellOff className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />
                   </div>
                   <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                     No notifications yet
                   </p>
                   <p className="text-sm text-gray-500 dark:text-gray-400">
                     When people interact with your posts—such as liking, commenting, reposting, or mentioning you—your latest activity will appear here. You can quickly jump into each notification to respond, view the post, or manage what you want to keep track of.
                   </p>
                 </div>
               </div>
            )}
          </div>
        </div>
      </div>
  );
}

