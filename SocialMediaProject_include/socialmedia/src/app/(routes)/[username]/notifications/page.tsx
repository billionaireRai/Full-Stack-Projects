'use client'

import React, { useState, useEffect , useRef, useCallback } from 'react';
import Link from 'next/link';
import Usercard, { userCardProp } from '@/components/usercard';
import { useRouter } from 'next/navigation';
import { handleScrollToTop } from '@/lib/windowtopscroll';
import { Users, ArrowBigUpIcon, BellOff, ArrowLeftCircle } from 'lucide-react';
import Activebeep from '@/components/activebeep';
import Trendcard from '@/components/trendcard';
import NotificationCard, { Notification } from '@/components/notificationcard';
import { MdNotifications } from 'react-icons/md';
import axiosInstance from '@/lib/interceptor';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import Notificationloader from '@/components/notificationloader';

interface trendType {
  rank: number ; 
  region: string ;
  tag: string ;
  posts: number ;
}

export default function Notifications() {
  const params = useParams() ;
  const pagesize = 15 ;
  const autoHeightGap:number = 200 ;
  // const { Account } = useActiveAccount() ;
  const router = useRouter() ;
const notificationSec = useRef<HTMLDivElement | null>(null);
  const fetchingRef = useRef<boolean>(false);
  const [Page, setPage] = useState<number>(1);
  const [hasMoreNotifications, sethasMoreNotifications] = useState<boolean>(true);
  const [Loading, setLoading] = useState<boolean>(false);
  // const [LoadingSuggestions, setLoadingSuggestions] = useState<boolean>(false);
  const [ShowLess, setShowLess] = useState<boolean>(false);
  const [suggesstionNum, setsuggesstionNum] = useState<number>(3);
const [notificationList, setNotificationList] = useState<Notification[]>([]);

  // trends array...
  const [Trends,setTrends] = useState<trendType[]>([
    // { rank: 1, region: "India", tag: "#Baaghi4Trailer", posts: 3592 },
  ]);

  // random follow suggestions data
  const [FollowSuggesstions, setFollowSuggesstions] = useState<userCardProp[]>([]);

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
  const fetchNotifications = useCallback( async() => {
    if (fetchingRef.current) return ; // prevent concurrent duplicate fetches
    fetchingRef.current = true ;
    try {
      setLoading(true);
      const notificationsApi = await axiosInstance.get(`/api/account/notifications?handle=${params?.username}&page=${Page}&pagesize=${pagesize}`);
      if (notificationsApi.status === 200) {
        const data = notificationsApi.data ;
        const newNotifications = Array.isArray(data?.notifications) ? data.notifications : [];
        setNotificationList((prev) => [...prev,...newNotifications]);
        sethasMoreNotifications(typeof data?.hasMore === 'boolean' ? data.hasMore : false);
        setLoading(false);
      }
    } catch (error) {
      console.log("An error occured in fetching notifications :",error);
      setLoading(false);
    } finally {
      fetchingRef.current = false ;
    }
  },[Page,params?.username])

  // useeffect for auto-fethcing of notifications....
  useEffect(() => {
     const notificationSection = notificationSec.current ;
     if (!notificationSection) return ;
     
     const handleScroll = () => {
       const distanceFromBottom = notificationSection.scrollHeight - notificationSection.scrollTop - notificationSection.clientHeight ;
       if (distanceFromBottom <= autoHeightGap && hasMoreNotifications && !fetchingRef.current) {
         setPage((prev) => prev + 1); // only advance page; the [Page] effect fetches
       }
      }
     
      notificationSection.addEventListener('scroll', handleScroll, { passive: true })
      return () => {
       notificationSection.removeEventListener('scroll', handleScroll)
     }
  }, [autoHeightGap,hasMoreNotifications,notificationList.length,fetchNotifications,Page])


  // function for marking notifications read...
  const MarkNotificationsRead = useCallback( async() => {
    try {
      const readUpdateApi = await axiosInstance.patch('/api/account/notifications',{ page:Page , size:pagesize });
      if (readUpdateApi.status === 200) {
        setNotificationList((prev) => prev.map((notifcn) => notifcn.isread ? notifcn : { ...notifcn, isread:true }));
        toast.success("New notifications read !!");
      }
    } catch (error) {
      console.log("An error occured in updating isRead state of notification :",error);
    }
  },[Page])

  // when the Page state changes fetch notifications...
  useEffect(() => {
    fetchNotifications() ;
  }, [Page,fetchNotifications])

  // function for getting trends...
  const getOtherExploreInfo = useCallback( async() => {
    const otherapi = await axiosInstance.post('/api/explore');
    if (otherapi.status === 200) {
      setFollowSuggesstions(otherapi.data.suggesstions);
      setTrends(otherapi.data.trendingHashtags);
    }
  },[])

  // run once on mount: fetch explore details + notifications... 
  useEffect(() => {
    getOtherExploreInfo();
    fetchNotifications();
  }, [fetchNotifications,getOtherExploreInfo])
    

  return (
    <div className='w-full h-screen flex font-poppins rounded-lg dark:bg-black p-1'>
      <div className='mainbox flex flex-col xl:flex-row-reverse w-full h-full max-w-7xl mx-auto font-poppins dark:bg-black rounded-md'>
        <div id='notification' className='right overflow-y-scroll flex flex-col gap-5 p-6'>
            {/* Who to Follow */}
            <div className='z-20 lg:block flex-1 h-fit'>
              <div className='space-y-4'>
                <div className='relative bg-white dark:bg-black rounded-xl'>
                  <div className='p-4 m-2 border-b rounded-md flex gap-2 items-center border-gray-200 dark:border-gray-700'>
                    <Users size={20} />
                    <h2 className='text-xl font-bold text-gray-900 dark:text-white'>Suggestions</h2>
                  </div>
                  <div className='p-4'>
                    {Array.isArray(FollowSuggesstions) && FollowSuggesstions.length > 0 && FollowSuggesstions.map(
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
                    className='cursor-pointer hover:bg-yellow-100 dark:hover:bg-gray-950 p-2 rounded-full text-yellow-500 hover:text-yellow-600 text-sm font-medium'
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
                {Array.isArray(Trends) && Trends?.map((trend,i) => (
                  <Trendcard key={ i + 1 } rank={trend.rank} region={trend.region} tag={trend.tag} posts={trend.posts} />
                ))}
              </ul>
              <div className='p-4'>
                <Link
                  href={`/explore?q=${encodeURIComponent('whats-happening')}&utm_source=show-more`}
                  className='cursor-pointer text-yellow-500 hover:text-yellow-600 text-sm font-medium'
                >
                  Show more
                </Link>
              </div>
            </div>
                <button
                  onClick={() => { handleScrollToTop('notification') }}
                  className='fixed right-5 bottom-10 rounded-full p-1 hover:bg-yellow-100 dark:hover:bg-gray-950 cursor-pointer z-50'
                >
                  <ArrowBigUpIcon width={40} height={40} stroke='5' className='fill-yellow-400' />
                </button>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div ref={notificationSec} id='notification' className='order-2 lg:order-1 left flex flex-col gap-2 h-full flex-1 overflow-y-scroll overflow-x-hidden bg-white dark:bg-black rounded-xl font-poppins'>
            <div className='flex flex-row items-center justify-between text-xl p-3 border-b border-gray-200 dark:border-gray-700 rounded-lg'>
              <button
                onClick={() => { router.back() }}
                className='p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 cursor-pointer'
              >
                <ArrowLeftCircle size={25} />
              </button>
              <div className='flex items-center justify-center gap-2'>
                <MdNotifications size={25} />
                <span className='font-bold'>Notifications</span>
              </div>
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
                  {Loading && (
                  <Notificationloader cardnums={6} />
                  )}

                  {!hasMoreNotifications && !Loading && (
                    <div className='pt-4 pb-2 text-center text-xs text-gray-500 dark:text-gray-400'>
                      You’ve reached the end 🎉
                    </div>
                  )}
                </div>
              </div>
              ) : Loading ? (
              <Notificationloader cardnums={6} />
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

