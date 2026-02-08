 'use client'

import React, { useState , useEffect, useRef } from 'react';
import Trendcancelpop from '@/components/trendcancelpop';
import ReportPop from '@/components/reportPop';
import RequireSubscription from "@/components/requireSubscription"
import BlockUser from '@/components/blockUser';
import useUpgradePop from "@/app/states/upgradePop";
import Link from 'next/link';
import Image from 'next/image';
import Usercard from '@/components/usercard';
import Spinner from '@/components/spinner';
import PostCard from '@/components/postcard';
import ProfileEditor from '@/components/profileeditor';
import { useRouter } from 'next/navigation';
import { getlatestprofileInfo } from '@/lib/getlatestaccountInfo';
import useActiveAccount, { accountType, userCardProp } from '@/app/states/useraccounts';
import { handleScrollToTop } from '@/lib/windowtopscroll';
import { MoreHorizontalIcon, MapPin, Link as LinkIcon, Calendar , Edit2Icon , Share2Icon , CopyIcon , BanIcon, Flag, FileText , Users, ArrowBigUpIcon , Delete, BarChart3, Bell, Shield, Settings, Download, MessageCircle, List, VolumeX, ExternalLink} from 'lucide-react';
import toast from 'react-hot-toast';
import { useParams } from 'next/navigation';
import axiosInstance from '@/lib/interceptor';
import { AxiosResponse } from 'axios';
import DeleteModal from '@/components/deletemodal';
import SharePopup from '@/components/sharePopUp';

interface mediaType {
  url: string;
  media_type: string;
}

interface PostType {
    id: string,
    content: string,
    postedAt: string,
    comments: number,
    reposts: number,
    likes: number,
    views: number,
    media?: mediaType[],
    hashTags?:string[],
    mentions?:string[],
    userliked?: boolean,
    usereposted?: boolean,
    usercommented?: boolean,
    userbookmarked?: boolean
}

interface innerPostAuthorInfo {
  name: string;
  username: string;
  isVerified: boolean;
  followers:string,
  following:string,
  bio:string,
  avatar: string,
  banner:string
  media:mediaType[]
  mentions:string[]
  hashTags:string[]
  content: string;
  postedAt: string;
}

interface RepliedPostsType {
  id:string,
  postId:string,
  postAuthorInfo:innerPostAuthorInfo,
  commentedText:string,
  media:mediaType[],
  hashTags?:string[],
  mentions?:string[],
  repliedAt:string,
  comments:number,
  reposts:number,
  likes:number,
  views:number,
  userliked?: boolean,
  usereposted?: boolean,
  usercommented?: boolean,
  userbookmarked?: boolean
}

interface userAllMedias {
  images:string[],
  videos:string[],
  docs:string[]
}

interface tabsTypes {
  id:string,
  label:string
}

export default function UserProfilePage() {
  const { Account,setAccount } = useActiveAccount() ; // active account hook...
  const router = useRouter() ;
  const { isPop , setisPop } = useUpgradePop() ;
  const { username } = useParams() ; // taking the username from URL...
  const fetchedHandlesRef = useRef<Set<string>>(new Set()); // ref to track fetched handles
  const [isFollowing, setisFollowing] = useState<boolean>(false);
  const [isSelf, setisSelf] = useState<boolean>(false) ;
  const [hpninPopUp, sethpninPopUp] = useState<number>(0);
  const [ShowLess, setShowLess] = useState<boolean>(false);
  const [planIntent, setplanIntent] = useState<string>('Pro');
  const [suggesstionNum, setsuggesstionNum] = useState<number>(4);
  const [showDeleteAccPop,setshowDeleteAccPop] = useState<boolean>(false);
  const [OpenProfileEditor, setOpenProfileEditor] = useState<boolean>(false) ;
  const [Loading, setLoading] = useState(false);
  const [OpenReportPop, setOpenReportPop] = useState<boolean>(false)
  const [showBlockPop, setshowBlockPop] = useState<Boolean>(false)
  const [SharePop, setSharePop] = useState<boolean>(false)
  const [IsBlocked, setIsBlocked] = useState<boolean>(false);
  const [showProfileOptions, setShowProfileOptions] = useState<boolean>(false);
  
  // random user data
  let user = {
    name: "John Doe",
    handle: "johndoe",
    bio: "Digital creator • Photography enthusiast • Coffee lover • Building amazing things one line of code at a time",
    location: {
       text:'San Francisco, CA',
       coordinates: [28.450637197292124, 77.14711048980648] as [number, number],
    },
    website: "https://www.johndoe-portfolio.com",
    joinDate: "Joined March 2012",
    following: '542',
    followers: '187k',
    Posts: "3,245",
    isCompleted:false,
    isVerified: false,
    bannerUrl: "/images/default-banner.jpg",
    avatarUrl: "/images/default-profile-pic.png"
  };

  const [AccountInfo,setAccountInfo] = useState<accountType>(user) ;
  const tabs = [
    {id:'all' , label:'All'},
    { id: 'posts', label: 'Posts' },
    { id: 'replies', label: 'Replied-Posts' },
    { id: 'media', label: 'Media' },
    { id: 'likes', label: 'Likes' },
    { id: 'highlights', label: 'Highlights' }
  ];

  const [activeTab, setActiveTab] = useState<tabsTypes>({id:'all',label:'All'}); // current active tab state...

  // random follow suggestions data
  const [FollowSuggesstions, setFollowSuggesstions] = useState<userCardProp[]>([
    {
      decodedHandle: 'alice_dev',
      name: 'Alice Developer',
      IsFollowing: true,
      account: {
        name: 'Alice Developer',
        handle: 'alice_dev',
        bio: 'Full-stack developer | React enthusiast | Building the future one commit at a time.',
        location: {
          text: 'New York, NY',
          coordinates: [40.7128, -74.0060] as [number, number]
        },
        website: 'https://alice-dev.com',
        joinDate: '2020-05-15',
        following: '234',
        followers: '1.2k',
        Posts: '456',
        isCompleted: true,
        isVerified: true,
        bannerUrl: '/images/default-banner.jpg',
        avatarUrl: '/images/default-profile-pic.png'
      }
    },
    {
      decodedHandle: 'bob_designer',
      name: 'Bob Designer',
      IsFollowing: false,
      account: {
        name: 'Bob Designer',
        handle: 'bob_designer',
        bio: 'Creative designer | Minimalist | Coffee addict | Turning ideas into beautiful interfaces.',
        location: {
          text: 'Los Angeles, CA',
          coordinates: [34.0522, -118.2437] as [number, number]
        },
        website: 'https://bob-designs.com',
        joinDate: '2019-08-22',
        following: '567',
        followers: '3.4k',
        Posts: '789',
        isCompleted: true,
        isVerified: false,
        bannerUrl: '/images/default-banner.jpg',
        avatarUrl: '/images/default-profile-pic.png'
      }
    },
    {
      decodedHandle: 'charlie_writer',
      name: 'Charlie Writer',
      IsFollowing: false,
      account: {
        name: 'Charlie Writer',
        handle: 'charlie_writer',
        bio: 'Tech writer | Blogger | Sharing insights on the latest in technology and development.',
        location: {
          text: 'Austin, TX',
          coordinates: [30.2672, -97.7431] as [number, number]
        },
        website: 'https://charlie-writes.com',
        joinDate: '2018-11-10',
        following: '123',
        followers: '5.6k',
        Posts: '1,234',
        isCompleted: true,
        isVerified: true,
        bannerUrl: '/images/default-banner.jpg',
        avatarUrl: '/images/default-profile-pic.png'
      }
    },
    {
      decodedHandle: 'diana_startup',
      name: 'Diana Entrepreneur',
      IsFollowing: true,
      account: {
        name: 'Diana Entrepreneur',
        handle: 'diana_startup',
        bio: 'Entrepreneur | AI enthusiast | Founder of innovative tech solutions.',
        location: {
          text: 'Seattle, WA',
          coordinates: [47.6062, -122.3321] as [number, number]
        },
        website: 'https://diana-startup.com',
        joinDate: '2021-02-28',
        following: '345',
        followers: '890',
        Posts: '234',
        isCompleted: true,
        isVerified: false,
        bannerUrl: '/images/default-banner.jpg',
        avatarUrl: '/images/default-profile-pic.png'
      }
    },
    {
      decodedHandle: 'eve_photographer',
      name: 'Eve Photographer',
      IsFollowing: false,
      account: {
        name: 'Eve Photographer',
        handle: 'eve_photographer',
        bio: 'Professional photographer | Nature lover | Sharing visual stories through lenses.',
        location: {
          text: 'Denver, CO',
          coordinates: [39.7392, -104.9903] as [number, number]
        },
        website: 'https://eve-photography.com',
        joinDate: '2017-07-04',
        following: '678',
        followers: '7.8k',
        Posts: '2,345',
        isCompleted: true,
        isVerified: true,
        bannerUrl: '/images/default-banner.jpg',
        avatarUrl: '/images/default-profile-pic.png'
      }
    }
  ])

  const [posts,setposts] = useState<PostType[]>([
    {
      id: "1",
      content: "Just launched my new portfolio website! Built with Next.js and Tailwind CSS. The developer experience is amazing! 🚀",
      postedAt: "2h ago",
      comments: 12,
      reposts: 45,
      likes: 128,
      views: 1000,
      media: [],
      userliked:true,
      usereposted:true,
      usercommented:false,
      userbookmarked:false
    }
  ]);

   const [repliedPostData,setrepliedPostData] = useState<RepliedPostsType[]>([
    {
      id: "3",
      postId: '4223',
      postAuthorInfo: {
        name: "Amritansh Rai",
        username: "amritansh_coder",
        followers:'352.7k',
        following:'242',
        bio:'love you guys...',
        isVerified: true,
        avatar: "/images/myProfile.jpg",
        banner:'',
        media:[],
        mentions:['notsofit','vedantchoudhary'],
        hashTags:['GSOC','opensource'],
        content: "Working on a new open source project. Can't wait to share it with the community!",
        postedAt: "3d ago"
      },
      commentedText: "Thats the spirit bro , just dont stop and keep upscaling!!!",
      media: [],
      mentions:['notsofit','vedantchoudhary'],
      hashTags:['GSOC','opensource'],
      repliedAt: "3d ago",
      comments: 34,
      reposts: 67,
      likes: 289,
      views: 500,
      userliked:true,
      usereposted:false,
      usercommented:true,
      userbookmarked:false
    }
  ]);

  let [likedPosts,setlikedPosts] = useState<PostType[]>([
    {
      id: "liked1",
      content: "Excited to announce my new project! It's been a journey of learning and growth.",
      postedAt: "1h ago",
      comments: 15,
      reposts: 25,
      likes: 120,
      views: 500,
      media: [{ url: "https://picsum.photos/400/300?random=10", media_type: "image" }],
      hashTags: ["webdev", "react"],
      mentions: ["developer1"],
      userliked:true,
      usereposted:false,
      usercommented:true,
      userbookmarked:false
    }
  ])

  let [userMedia,setuserMedia] = useState<userAllMedias>({
    images: [
      "https://res.cloudinary.com/demo/image/upload/v1698765432/sample_image_1.jpg"
    ],
    videos: [
      "https://res.cloudinary.com/demo/video/upload/v1698765432/sample_video_1.mp4"
    ],
    docs: [
      "https://res.cloudinary.com/demo/image/upload/v1698765432/documents/sample_doc_1.pdf"
    ]
  });

  let [highLightPosts,sethighLightPosts] = useState([
    {
      id: "highlight1",
      content: "Excited to share my latest project! It's been a journey of learning and growth.",
      postedAt: "1h ago",
      comments: 15,
      reposts: 25,
      likes: 120,
      views: 500,
      media: [{ url: "https://picsum.photos/400/300?random=10", media_type: "image" }],
      hashTags: ["webdev", "react"],
      mentions: ["developer1"],
      userliked:false,
      usereposted:false,
      usercommented:false,
      userbookmarked:true
    }
  ]);

  const [Posts, setPosts] = useState<PostType[]>(posts) ; // rendering some random posts...
  const [RepliedPosts, setRepliedPosts] = useState<RepliedPostsType[]>(repliedPostData) ; // rendering some random replied posts...
  const [Medias, setMedias] = useState<userAllMedias>(userMedia);
  const [Highlights, setHighlights] = useState<PostType[]>(highLightPosts);
  const [LikedPost, setLikedPost] = useState<PostType[]>(likedPosts);

  useEffect(() => {
    const fetchAccountData = async () => {
      const handle = decodeURIComponent(username as string)?.slice(1);
      if (fetchedHandlesRef.current.has(handle)) return ; // Skip if already fetched

      if (Account.account && Account.account?.handle === handle) {
        setisSelf(true);
        const acc = await getlatestprofileInfo(Account.account?.handle);
        if (acc !== 'failed' && acc?.data?.account) {
          setAccount(acc.data.account);
          setAccountInfo(acc.data.account);
          setIsBlocked(acc.Blocked);
          setshowBlockPop(true);
          fetchedHandlesRef.current.add(handle);
        }
      } else {
        // fetching account info of other user...
        const acc = await getlatestprofileInfo(handle);
        if (acc !== 'failed' && acc?.data.account) {
          setAccountInfo(acc.data.account);
          setIsBlocked(acc.Blocked);
          setshowBlockPop(true);
          fetchedHandlesRef.current.add(handle);
        }
      }
    };
    // fetchAccountData();
  }, [Account.account, username])

  useEffect(() => {
    async function functionToGetData() : Promise<void> {
      const specificData : AxiosResponse = await axiosInstance.post('/api/profile',{ handle:AccountInfo.handle });
      if (specificData.status === 200) {
        const data = specificData.data.Infos;
        if (data.posts) setPosts(data.posts);
        if (data.likedPosts) setLikedPost(data.likedPosts);
        if (data.medias) setMedias(data.medias) ;
        if (data.suggestions) setFollowSuggesstions(data.suggestions) ;
        if (data.replies) setRepliedPosts(data.replies) ;
        if (data.highlights) setHighlights(data.highlights) ;

      }
    }
    // functionToGetData();
  }, [AccountInfo.handle])
  
  // toggleing follow logic...
  async function handleFollowToggleLogic() {
    setLoading(true); // from the starting...
    const newFollowing = !isFollowing; // determine the new state...
    try {
      const apires: AxiosResponse = await axiosInstance.get(`/api/user/follow?accounthandle=${AccountInfo.handle}&follow=${newFollowing}`); // api response instance...
        if (apires.status === 200) {
          setisFollowing(newFollowing); // update state immediately on success...
          toast.success(`${newFollowing ? 'Added to your following...' : 'Removed from following !!'}`);
        } else {
          toast.error('Failed with action...');
        }
    } catch (error) {
      toast.error('Failed with action...');
    } finally {
      setLoading(false);
    }
  }
  
  // useeffect for more popup closing...
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
       if (showProfileOptions && !(event.target as Element).closest('.more-dropdown')) {
         setShowProfileOptions(false)
       }
    }
      
    if (showProfileOptions) {
      document.addEventListener('mousedown', handleClickOutside)
    }
      
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showProfileOptions])

  // funtion for profile link copy...
  const handleProfileLinkCopy = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
    console.log()
      console.log('profile url copied');
      toast.success('Profile URL is copied...');
     })
  }

  // function handling account deletion logic...
  const handleProfileDeleteLogic = async (handle:string) => { 
    try {
      const loadingToast = toast.loading('Deleting you account...');

      const deleteApi = await axiosInstance.delete(`/api/profile?profileHandle=${handle}`);

      if (deleteApi.status === 200) {  

        toast.dismiss(loadingToast);

        toast.success('profile deleted !!')

        setshowDeleteAccPop(false);

      } else {

        toast.dismiss(loadingToast);

        toast.error('profile deletion failed !!')

        setshowDeleteAccPop(false);

      }

    } catch (error) {
      toast.error('Error in profile deletion !!')
    }
  }

  // function for showing more suggestions...
  const handleSuggesstionShow = () => {
    if (ShowLess) {
      setsuggesstionNum(4);
      setShowLess(false);
    } else {
      if ( ( FollowSuggesstions.length - suggesstionNum ) >= 3 ) {
        setsuggesstionNum(suggesstionNum + 3);
        if (suggesstionNum + 3 === FollowSuggesstions.length) {
          setShowLess(true);
        }
      }
    }
  }
    
  return (
    <>
      <div className={`h-fit flex flex-col md:ml-72 font-poppins rounded-md p-2 dark:bg-black`}>
        <div className='flex gap-2'>
          {/* Main Content - Profile */}
          <div className='flex-2 overflow-y-auto'>
      <div className={`bg-white dark:bg-black text-gray-900 dark:text-white ${IsBlocked ? 'blur-sm pointer-events-none cursor-not-allowed' : ''}`}>
              {/* Header */}
              <header className="sticky w-full top-0 z-10 backdrop-blur-md border-b rounded-lg mb-5 border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-black/80">
                <div className="px-4 py-3">
                  <div className="flex items-center gap-0">
                    <button 
                     onClick={() => { router.back() }}
                     className="p-1 hover:bg-gray-100 dark:hover:bg-gray-950 cursor-pointer rounded-full transition-colors">
                     <Image src='/images/up-arrow.png' width={30} height={30} alt='back-arrow' className='-rotate-90 dark:invert' />
                    </button>
                    <div className="ml-4">
                      <h1 className="text-xl font-semibold">{AccountInfo.name}</h1>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{Posts.length} Posts</p>
                    </div>
                      {IsBlocked ? (
                        <div className={`flex items-center justify-center flex-row flex-1 ml-5 p-2 gap-1 rounded-md ${IsBlocked ? 'bg-red-50 dark:bg-red-950' : 'bg-white/80 dark:bg-black/80'}`}>
                            <BanIcon size={35} className="text-red-600 dark:text-red-400" />
                            <p className="text-sm text-red-600 dark:text-red-400">
                              You have blocked this user. You won't be able to interact with there POSTS, no suggestions in TAGGING and your FEED...
                            </p>
                        </div>
                      ):(
                        <div>
                        </div>
                      )
                      }
                  </div>
                </div>
              </header>

              {/* Cover Photo */}
              <div className={`relative h-full rounded-lg bg-gradient-to-r from-yellow-100 to-yellow-300`}>
                <img
                  src={AccountInfo.bannerUrl}
                  alt="Cover"
                  className="object-cover h-fit rounded-lg"
                />
              </div>

              {/* Profile Info */}
              <div className={`relative px-4 ${ IsBlocked ? 'bg-red-50 dark:bg-red-950 border border-red-600' : ''}  rounded-lg`}>
                {/* Avatar */}
                <div className="absolute -top-16 left-4">
                  <div className="relative">
                    <img
                      src={AccountInfo.avatarUrl}
                      width={125}
                      height={125}
                      alt='avatar'
                      className={`rounded-full object-contain border-2 bg-white dark:bg-black ${IsBlocked ? 'border-red-500' : 'border-yellow-100 dark:border-black'}`}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end pt-4 pb-3">
                  <button
                    onClick={() => setShowProfileOptions(!showProfileOptions)}
                    className={`relative p-2 hover:bg-gray-100 dark:hover:bg-gray-950 cursor-pointer rounded-full transition-colors mr-2`}
                  >
                    <MoreHorizontalIcon size={20} />
                    {showProfileOptions && (
                      <div className={`more-dropdown absolute right-5 top-8 w-54 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl dark:shadow-gray-950 z-20 ${IsBlocked ? 'blur-none pointer-events-auto' : ''}`}>
                        <ul className='p-2'>
                          { isSelf ? (
                            <>
                               <li
                              onClick={() => { setOpenProfileEditor(true) }}
                              className='flex flex-row items-center justify-between rounded-md w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-950 transition-colors'>
                                <span>Edit Account</span><Edit2Icon size={15} />
                               </li>
                               <li
                                onClick={() => { setSharePop(true) }}
                                className='flex flex-row items-center justify-between rounded-md w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-950 transition-colors'>
                                  <span>Share Account</span><Share2Icon size={15} />
                                </li>
                                <li
                                onClick={() => { handleProfileLinkCopy() }}
                                className='flex flex-row items-center justify-between rounded-md w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-950 transition-colors'>
                                 <span>Copy Link</span><CopyIcon size={15}/>
                                </li>
                                <li
                                onClick={() => { toast.success('View Analytics feature coming soon!') }}
                                className='flex flex-row items-center justify-between rounded-md w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-950 transition-colors'>
                                 <span>View Analytics</span><BarChart3 size={15}/>
                                </li>
                                <li
                                onClick={() => { toast.success('Manage Notifications feature coming soon!') }}
                                className='flex flex-row items-center justify-between rounded-md w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-950 transition-colors'>
                                 <span>Manage Notifications</span><Bell size={15}/>
                                </li>

                                <li onClick={() => { toast.success('Privacy Settings feature coming soon!') }} className='flex flex-row items-center justify-between rounded-md w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-950 transition-colors'>
                                 <span>Privacy Settings</span><Shield size={15}/>
                                </li>
                                <li
                                onClick={() => { toast.success('Account Settings feature coming soon!') }}
                                className='flex flex-row items-center justify-between rounded-md w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-950 transition-colors'>
                                 <span>Account Settings</span><Settings size={15}/>
                                </li>
                                <li
                                onClick={() => { toast.success('Download Data feature coming soon!') }}
                                className='flex flex-row items-center justify-between rounded-md w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-950 transition-colors'>
                                 <span>Download Data</span><Download size={15}/>
                                </li>
                                <li
                                onClick={() => { setshowDeleteAccPop(true)  }}
                                className='flex flex-row items-center justify-between rounded-md w-full text-left px-4 py-2 text-sm      hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors text-red-500'>
                                 <span>Delete Account</span><Delete size={15}/>
                                </li>
                            </>
                          ) : (
                            <>
                              <li
                                onClick={() => { handleProfileLinkCopy() }}
                                className='flex flex-row items-center justify-between rounded-md w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-950 transition-colors'>
                                 <span>Copy Link</span><CopyIcon size={15}/>
                              </li>
                              <li
                                onClick={() => { setSharePop(true) }}
                                className='flex flex-row items-center justify-between rounded-md w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-950 transition-colors'>
                                  <span>Share Account</span><Share2Icon size={15} />
                              </li>
                              <li
                               onClick={() => { toast.success('Send Message feature coming soon!') }}
                               className='flex flex-row items-center justify-between rounded-md w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-950 transition-colors'>
                                 <span>Send Message</span><MessageCircle size={15}/>
                               </li>
                               <li
                               onClick={() => { toast.success('View Mutual Friends feature coming soon!') }}
                               className='flex flex-row items-center justify-between rounded-md w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-950 transition-colors'>
                                 <span>View Mutual Friends</span><Users size={15}/>
                               </li>
                               <li
                               onClick={() => { toast.success('Add to List feature coming soon!') }}
                               className='flex flex-row items-center justify-between rounded-md w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-950 transition-colors'>
                                 <span>Add to favourite</span><List size={15}/>
                               </li>
                               <li
                               onClick={() => { toast.success('Mute Account feature coming soon!') }}
                               className='flex flex-row items-center justify-between rounded-md w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-950 transition-colors'>
                                 <span>Mute Account</span><VolumeX size={15}/>
                               </li>
                              <li
                               onClick={() => { setshowBlockPop(true) }}
                               className={`flex flex-row items-center justify-between rounded-md w-full text-left px-4 py-2 text-sm      hover:bg-gray-100 dark:hover:bg-gray-950 transition-colors ${IsBlocked ? 'dark:bg-red-950/50 bg-red-100      text-red-500' : ''}`}>
                                 <span>Block Account</span><BanIcon size={15}/>
                               </li>
                               <li
                               onClick={() => { setOpenReportPop(true) }}
                               className='flex flex-row items-center justify-between rounded-md w-full text-left px-4 py-2 text-sm      hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors text-red-500'>
                                 <span>Report Account</span><Flag size={15} />
                               </li>
                            </>
                          )}
                        </ul>
                      </div>
                    )}
                  </button>
                  {!isSelf && (
                  <button
                    disabled={IsBlocked}
                    onClick={() => handleFollowToggleLogic()}
                    className={`px-4 py-2 rounded-full font-bold text-sm transition-colors ${
                      IsBlocked
                        ? 'border border-red-600 bg-red-200 dark:bg-gray-950 text-red-600 dark:text-red-700 cursor-not-allowed'
                        : isFollowing
                          ? 'bg-transparent border border-gray-300 dark:border-gray-700 text-black dark:text-white hover:bg-yellow-100 dark:hover:bg-gray-950 hover:text-yellow-400 dark:hover:text-blue-700 cursor-pointer'
                          : 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 cursor-pointer'
                    }`}
                  >
                    {IsBlocked ? 'Blocked' : Loading ? <Spinner/> : (isFollowing ? 'Following' : 'Follow') }
                  </button>
                  )}
                </div>

                {/* User Details */}
                <div className="space-y-3 pb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h1 className="text-xl font-bold">{AccountInfo.name}</h1>
                      <h1 className="text-sm font-bold">.</h1>
                      <p className="text-gray-500 text-sm dark:text-gray-400">@{AccountInfo.handle}</p>
                      { AccountInfo.isVerified ? (
                       <Image src='/images/yellow-tick.png' width={25} height={25} alt='yellow-tick' />
                       ) : (
                        <Link href='/subscription?utm_source=profile-page' className='border border-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-950 dark:border-yellow-700 cursor-pointer flex flex-row items-center justify-center gap-1 px-3 py-1 rounded-full'>
                          <span>Get Verified</span><Image src='/images/yellow-tick.png' width={18} height={18} alt='yellow-tick' />
                        </Link>
                      )}
                      <Link href={`/@${AccountInfo.handle}/favourites`} className='border border-black-500 text-white bg-black hover:opacity-85 dark:border-gray-700 cursor-pointer flex flex-row items-center justify-center gap-1 px-3 py-1 rounded-full transition-colors'>
                        <span>favourites</span>
                        <List className='w-4 h-4 text-white'/>
                      </Link>
                    </div>
                  </div>

                  <p className="text-sm">{AccountInfo.bio}</p>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <Link href={`https://www.google.com/maps?q=${AccountInfo.location?.coordinates[0]},${AccountInfo.location?.coordinates[1]}`}  // lat,lng
                    className={`flex items-center space-x-1 py-1 px-2 transition-all duration-300 rounded-lg ${IsBlocked ? 'hover:bg-red-200 dark:hover:bg-black' : 'hover:bg-gray-100 dark:hover:bg-gray-950'}`}>
                      <MapPin className="w-4 h-4 stroke-black dark:stroke-white" />
                      <span>{AccountInfo.location?.text}</span>
                    </Link>
                    <div className={`flex items-center cursor-pointer space-x-1 py-1 px-2 transition-all duration-300 rounded-lg ${IsBlocked ? 'hover:bg-red-200 dark:hover:bg-black' : 'hover:bg-gray-100 dark:hover:bg-gray-950'}`}>
                      <LinkIcon className="w-4 h-4 stroke-black dark:stroke-white" />
                      <Link href={`${AccountInfo.website}?utm_source=briezly-profile-page`} className="text-blue-500 hover:underline">{AccountInfo.website}</Link>
                    </div>
                    <div className={`flex items-center space-x-1 py-1 px-2 transition-all duration-300 rounded-lg ${IsBlocked ? 'hover:bg-red-200 dark:hover:bg-black' : 'hover:bg-gray-100 dark:hover:bg-gray-950'}`}>
                      <Calendar className="w-4 h-4 stroke-black dark:stroke-white" />
                      <span>Joined On {new Date(AccountInfo.joinDate).toDateString()}</span>
                    </div>
                  </div>

                  <div className="flex space-x-4 text-sm">
                    <Link href={`/@${AccountInfo.handle}/followings`} className="hover:underline">
                      <span className="font-bold text-black dark:text-white">{AccountInfo.following}</span>
                      <span className="text-gray-500 dark:text-gray-400"> Followings</span>
                    </Link>
                    <Link href={`/@${AccountInfo.handle}/followers`} className="hover:underline">
                      <span className="font-bold text-black dark:text-white">{AccountInfo.followers}</span>
                      <span className="text-gray-500 dark:text-gray-400"> Followers</span>
                    </Link>
                  </div>
                </div>

                {/* Navigation Tabs */}
                <div className="border-b border-gray-200 dark:border-gray-800">
                  <nav className="flex space-x-5">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab)}
                        className={`py-4 px-1 border-b-2 rounded-b-sm font-medium text-sm cursor-pointer transition-colors ${
                          activeTab.id === tab.id
                            ? 'dark:border-blue-500 dark:text-blue-500 text-yellow-500 border-yellow-500'
                            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Posts Feed */}
              <div className='py-4 px-4 space-y-8'>
                {/* Posts Section */}
                {(activeTab.label === 'Posts' || activeTab.label === 'All') && Posts.length > 0 && (
                  <div className='space-y-4'>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">Your posts</h3>
                    <div className='space-y-4'>
                      {Posts.map((post:PostType) => (
                        <PostCard
                          key={post.id}
                          postId={post.id}
                          avatar={AccountInfo.avatarUrl}
                          username={AccountInfo.name}
                          handle={AccountInfo.handle}
                          timestamp={post.postedAt}
                          content={post.content}
                          media={post.media || []}
                          likes={post.likes}
                          reposts={post.reposts}
                          replies={post.comments}
                          views={post.views}
                          userliked={post.userliked}
                          usereposted={post.usereposted}
                          usercommented={post.usercommented}
                          userbookmarked={post.userbookmarked}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Replied Posts Section */}
                {(activeTab.label === 'Replied-Posts' || activeTab.label === 'All') && RepliedPosts.length > 0 && (
                  <div className='space-y-4'>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">Posts you replied to</h3>
                    <div className='space-y-6'>
                      {RepliedPosts.map((post: RepliedPostsType) => (
                        <div key={post.id} className="dark:bg-black rounded-xl p-4 border border-gray-200 dark:border-gray-900 transition-shadow">
                          <div className="flex space-x-3">
                           <div>
                            <img
                              src={AccountInfo.avatarUrl}
                              alt={AccountInfo.name}
                              width={48}
                              height={48}
                              className="rounded-full object-cover flex-shrink-0"
                            />
                           </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-3">
                                <span className="font-bold text-sm">{AccountInfo.name}</span>
                                {AccountInfo.isVerified && (
                                  <Image src='/svg/yellow-tick.svg' width={20} height={20} alt='yellow-tick' />
                                )}
                                <span className="text-gray-500 dark:text-gray-400 text-sm">@{AccountInfo.handle}</span>
                                <span className="text-gray-500 dark:text-gray-400 text-sm">·</span>
                                <span className="text-gray-500 dark:text-gray-400 text-sm">{post.repliedAt}</span>
                              </div>
                              <div className="space-y-3">
                                <Link href={`@${post.postAuthorInfo.username}/post/${post.postId}`} className="text-blue-500 hover:underline text-sm inline-block">Replied to post</Link>
                                <div className="ml-4 border-l-2 rounded-md border-gray-300 dark:border-gray-600 pl-4">
                                  <PostCard
                                    postId={post.postId}
                                    avatar={post.postAuthorInfo.avatar}
                                    username={post.postAuthorInfo.name}
                                    followers={post.postAuthorInfo.followers}
                                    following={post.postAuthorInfo.following}
                                    // cover={post.postAuthorInfo.banner}
                                    handle={post.postAuthorInfo.username}
                                    timestamp={post.postAuthorInfo.postedAt}
                                    content={post.postAuthorInfo.content}
                                    media={post.postAuthorInfo.media}
                                    hashTags={post.postAuthorInfo.hashTags}
                                    mentions={post.postAuthorInfo.mentions}
                                    bio={post.postAuthorInfo.bio}
                                    // media={post.postAuthorInfo.mediaUrls}
                                    showActions={false}
                                  />
                                </div>
                                <PostCard
                                  postId={post.id}
                                  avatar={AccountInfo.avatarUrl}
                                  username={AccountInfo.name}
                                  handle={AccountInfo.handle}
                                  timestamp={post.repliedAt}
                                  isVerified={AccountInfo.isVerified}
                                  content={post.commentedText}
                                  mentions={post.mentions}
                                  hashTags={post.hashTags}
                                  media={post.media || []}
                                  likes={post.likes}
                                  reposts={post.reposts}
                                  replies={post.comments}
                                  views={post.views}
                                  userliked={post.userliked}
                                  usereposted={post.usereposted}
                                  usercommented={post.usercommented}
                                  userbookmarked={post.userbookmarked}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Media Section */}
                {(activeTab.label === 'Media' || activeTab.label === 'All') && (
                  <div className='space-y-6'>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">Media</h3>
                    {/* Images rendering section */}
                    {Medias.images.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">Images</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {Medias.images.map((image, index) => (
                            <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 hover:shadow-lg transition-shadow">
                              <Link href={image} target="_blank" key={index}  >
                                <Image
                                  src={image}
                                  alt={`Media ${index + 1}`}
                                  width={300}
                                  height={300}
                                  className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                                  unoptimized
                                />
                              </Link>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Videos Section */}
                    {Medias.videos.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">Videos</h4>
                        <div className="space-y-4">
                          {Medias.videos.map((video, index) => (
                            <div key={index} className="rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900 shadow-sm">
                              <video
                                src={video}
                                controls
                                className="w-full max-h-96 object-cover"
                                poster={`https://via.placeholder.com/400x225/cccccc/666666?text=Video+${index + 1}`}
                              >
                                Your browser does not support the video tag.
                              </video>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Documents Section */}
                    {Medias.docs.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">Documents</h4>
                        <div className="space-y-3">
                          {Medias.docs.map((doc, index) => {
                            const fileName = doc.split('/').pop() || `Document ${index + 1}`;
                            const fileExtension = fileName.split('.').pop()?.toUpperCase() || 'FILE';
                            return (
                              <Link
                                key={index}
                                href={doc}
                                target="_blank"
                                className="group block rounded-xl overflow-hidden bg-white dark:bg-black border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-lg transition-all duration-200"
                              >
                                <div className="p-4">
                                  <div className="flex items-center space-x-4">
                                    <div className="flex-shrink-0">
                                      <div className="w-12 h-12 bg-yellow-500 dark:bg-blue-700 rounded-lg flex items-center justify-center">
                                        <FileText className="w-6 h-6 text-black" />
                                      </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-500 transition-colors">
                                        {fileName}
                                      </p>
                                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                        {fileExtension} Document
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* If no media is yet uploaded... */}
                    {Medias.images.length === 0 && Medias.videos.length === 0 && Medias.docs.length === 0 && (
                      <div className="text-center py-12">
                        <Image src='/images/no-camera.png' width={64} height={64} alt='media-nil' className='dark:invert mx-auto mb-4 opacity-50' />
                        <p className="text-gray-500 dark:text-gray-400 text-lg">No media available</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Likes Section */}
                {(activeTab.label === 'Likes' || activeTab.label === 'All') && LikedPost.length > 0 && (
                  <div className='space-y-4'>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">Liked posts</h3>
                    <div className='space-y-4'>
                      {LikedPost.map((post:PostType) => (
                        <PostCard
                          key={post.id}
                          postId={post.id}
                          avatar={AccountInfo.avatarUrl}
                          username={AccountInfo.name}
                          handle={AccountInfo.handle}
                          timestamp={post.postedAt}
                          content={post.content}
                          media={post.media || []}
                          likes={post.likes}
                          reposts={post.reposts}
                          replies={post.comments}
                          views={post.views}
                          hashTags={post.hashTags}
                          mentions={post.mentions}
                          userliked={post.userliked}
                          usereposted={post.usereposted}
                          usercommented={post.usercommented}
                          userbookmarked={post.userbookmarked}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {(activeTab.label === 'Highlights' || activeTab.label === 'All') && Posts.length > 0 && (
                  <div className='space-y-4'>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">Profile Highlights</h3>
                    <div className='space-y-4'>
                      {Highlights.map((post:PostType) => (
                        <PostCard
                          key={post.id}
                          postId={post.id}
                          avatar={AccountInfo.avatarUrl}
                          username={AccountInfo.name}
                          handle={AccountInfo.handle}
                          timestamp={post.postedAt}
                          content={post.content}
                          media={post.media || []}
                          likes={post.likes}
                          reposts={post.reposts}
                          replies={post.comments}
                          views={post.views}
                          highlighted={true}
                          userliked={post.userliked}
                          usereposted={post.usereposted}
                          usercommented={post.usercommented}
                          userbookmarked={post.userbookmarked}
                        />
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* some other widgets... */}
          <div className={`hidden lg:block flex-1 overflow-y-auto ${IsBlocked ? 'blur-md pointer-events-none cursor-not-allowed' : ''}`}>
            <div className='space-y-4'>
              {/* Who to Follow */}
                {/* account suggestions according to this USER profile respective...*/}
              <div className='relative bg-white dark:bg-black rounded-xl'>
                <div className='p-4 m-2 border-b rounded-md flex gap-2 items-center border-gray-200 dark:border-gray-700'>
                  <Users size={20} /><h2 className='text-xl font-bold text-gray-900 dark:text-white'>Suggestions</h2>
                </div>
                <div className='p-4'>
                  {FollowSuggesstions.map((usercard,index) =>
                    (index+1) <= suggesstionNum && (
                    <div key={index + 1} className='flex items-center justify-between'>
                     <Usercard content={null} decodedHandle={usercard.decodedHandle} name={usercard.name} IsFollowing={usercard.IsFollowing}
                     account={usercard.account} />
                    </div>)
                  )}
                  </div>
                </div>
                <div className='p-2 m-2 rounded-md border-t border-gray-200 dark:border-gray-700'>
                  <button 
                    onClick={() => { handleSuggesstionShow() }}
                    className='cursor-pointer hover:bg-blue-100 dark:hover:bg-gray-950 p-2 rounded-full text-blue-500 hover:text-blue-600 text-sm font-medium'>
                    { ShowLess ? 'Show less' : 'Show more' }
                  </button>
                </div>
                <button onClick={() => { handleScrollToTop(window) }} className='fixed right-5 bottom-10 rounded-full p-1 hover:bg-yellow-100 dark:hover:bg-gray-950 cursor-pointer z-50'>
                  <ArrowBigUpIcon width={40} height={40} stroke='5' className='fill-yellow-400'/>
                </button>
              </div>
            </div>
          </div>
          {IsBlocked && !isSelf && (
            <button
              onClick={() => setshowBlockPop(true)}
              className='fixed flex gap-1 items-center justify-center shadow-lg right-10 top-10 blur-none w-fit py-2 px-4 rounded-full bg-red-500 text-white hover:bg-red-600 cursor-pointer transition-colors'
            >
              <span>UN-BLOCK</span><BanIcon size={15} />
            </button>
          )}
        </div>
      <>
       { isPop && <RequireSubscription isOpen={isPop} onClose={() => { setisPop(false) }} planname={planIntent}  />}
        { OpenProfileEditor && (
          <ProfileEditor credentials={AccountInfo} closePop={() => { setOpenProfileEditor(false) }}/>
        )}
        { OpenReportPop && (
          <ReportPop closeReportModal={() => { setOpenReportPop(false) }} username={AccountInfo.handle} />
        )}
        { showBlockPop && (
          <BlockUser closeBlockPop={() => { setshowBlockPop(false) }} username={AccountInfo.handle} updateblockState={() => { setIsBlocked(!IsBlocked) }} isBlocked={IsBlocked} />
        )}
        { showDeleteAccPop && (
          <DeleteModal closePopUp={() => { setshowDeleteAccPop(false) }} itemType={`Account @${AccountInfo.handle}`} onDelete={() => { handleProfileDeleteLogic(AccountInfo.handle) }}/>
        )}
        { SharePop && (
          <SharePopup onClose={() => { setSharePop(false) }} open={SharePop} onCopy={() => { handleProfileLinkCopy() }} link={window.location.href} followerCount={AccountInfo.followers} followingCount={AccountInfo.following} text={`@${AccountInfo.handle}.${AccountInfo.bio}`}/>
        )}
      </>
  </>
)};
