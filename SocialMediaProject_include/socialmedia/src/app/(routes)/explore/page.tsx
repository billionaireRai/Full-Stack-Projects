'use client'

import React, { useState , useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SettingsIcon , SearchIcon, X , Users, TrendingUp, BadgeQuestionMark, MessageCircleHeartIcon } from 'lucide-react';
import Newscard from '@/components/newscard';
import Trendcard from '@/components/trendcard';
import PostCard from '@/components/postcard';
import Activebeep from '@/components/activebeep';
import Usercard from '@/components/usercard';
import ExploreSettings from '@/components/exploresettings';
import { userCardProp } from '@/components/usercard';
import { useSearchParams } from 'next/navigation';
import axiosInstance from '@/lib/interceptor';
import useActiveAccount from '@/app/states/useraccounts';

interface mediaType {
  url: string;
  media_type: string;
}

interface locationTaggedType {
  text: string;
  coordinates: number[];
}

interface pollInfoType {
  question: string;
  options: Array<{ text: string; votes: number }>;
  duration: number;
}

interface newsCardType {
  source: string;
  category: string;
  gradient: string;
  title: string;
  timeAgo: string;
  location: string;
  href: string;
}

interface PostType {
  postid: string;
  content: string;
  postedAt: string;
  comments: number;
  reposts: number;
  likes: number;
  views: number;
  mediaUrls?: mediaType[];
  hashTags?: string[];
  mentions?: string[];
  userBookmarked?: boolean;
  userliked?: boolean;
  usereposted?: boolean;
  usercommented?: boolean;
  userbookmarked?: boolean;
  username?: string;
  handle?: string;
  avatar?: string;
  cover?: string;
  bio?: string;
  isVerified: boolean;
  plan?: string;
  followers?: string;
  following?: string;
  isFollowing?: boolean;
  isHighlighted?: boolean;
  isPinned?: boolean;
  taggedLocation?: locationTaggedType[];
  poll?: pollInfoType;
}


export default function explore() {
  const searchparam = useSearchParams() ; // initializing search param hook...
  const pagesize:number = 20 ;
  const autoHeightGap:number = 200 ;
  const { Account } = useActiveAccount() ;
  const [Page, setPage] = useState<number>(1) ;
  const [hasExplore, sethasExplore] = useState<boolean>(false);
  const pageCategory : "feed" | "profile" | "direct" | "explore" = "explore" ;
  const [openSettings, setopenSettings] = useState(false);
  const [LocationSetting, setLocationSetting] = useState(false);
  const [hpninPopUp, sethpninPopUp] = useState(0);

  const [suggestionAcc,setsuggestionAcc] =useState<userCardProp[]>([
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
              coordinates: [40.7128, -74.0060]
            },
            website: 'https://alice-dev.com',
            joinDate: '2020-05-15',
            following: '234',
            followers: '1.2k',
            Posts: '456',
            isCompleted: true,
            isVerified: true,
            plan:'Pro',
            bannerUrl: '/images/default-banner.jpg',
            avatarUrl: '/images/default-profile-pic.png'
          }
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
              coordinates: [34.0522, -118.2437]
            },
            website: 'https://bob-designs.com',
            joinDate: '2019-08-22',
            following: '567',
            followers: '3.4k',
            Posts: '789',
            isCompleted: true,
            isVerified: true,
            plan:'Pro',
            bannerUrl: '/images/default-banner.jpg',
            avatarUrl: '/images/default-profile-pic.png'
          }
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
              coordinates: [30.2672, -97.7431]
            },
            website: 'https://charlie-writes.com',
            joinDate: '2018-11-10',
            following: '123',
            followers: '5.6k',
            Posts: '1,234',
            isCompleted: true,
            isVerified: false,
            plan:'Free',
            bannerUrl: '/images/default-banner.jpg',
            avatarUrl: '/images/default-profile-pic.png'
          }
        }
      ]);
      
      const [Trends,setTrends] = useState([
        { rank: 1, region: "India", tag: "#Baaghi4Trailer", posts: 3592 },
        { rank: 2, region: "India", tag: "#CricketWorldCup", posts: 45823 },
        { rank: 3, region: "USA", tag: "#TarrifExposition", posts: 3352 },
        { rank: 4, region: "Europe", tag: "#AirbusTransfer", posts: 67776 },
        { rank: 5, region: "India", tag: "#10DayMBA", posts: 80385 }
      ]);

      const [newsData, setnewsData] = useState<newsCardType[]>([
        {
          source: "CNN",
          category: `${(Account.account?.location.text)}-News`,
          gradient: 'from-blue-500 via-purple-500 to-indigo-600',
          title: `Major Breaking News from ${Account.account?.location.text}...`,
          timeAgo: "about 12hr",
          location: "Politics",
          href: `/news?n=${encodeURIComponent(`Major-Breaking-News-from-politics&cat=politics&utm_source=news-click`)}`
        },
        {
          source: "BBC",
          category: "Sports News",
          gradient: 'from-black via-gray-900 to-white',
          title: "Top Sports News Across World",
          timeAgo: "about 12hr",
          location: "Sports",
          href: `/news?n=${encodeURIComponent('Top-Sports-News-Across-World')}&cat=sports&utm_source=news-click`
        },
        {
          source: "TG",
          category: "Technology",
          gradient: 'from-red-500 via-orange-500 to-yellow-600',
          title: "Technology revolution & innovation with AI",
          timeAgo: "about 12hr",
          location: "Technology",
          href: `/news?n=${encodeURIComponent('Technology-revolution-and-innovation-with-AI')}&cat=technology&utm_source=news-click`
        },
        {
          source: "TWP",
          category: "Entertainment News",
          gradient: 'from-green-500 via-green-300 to-white',
          title: "News about entertainment industry around world",
          timeAgo: "about 12hr",
          location: "Entertainment",
          href: `/news?n=${encodeURIComponent('News-About-Entertainment-Industry-Around-World')}&cat=entertainment&utm_source=news-click`
        },
        {
          source: "ABP",
          category: "Crypto Market News",
          gradient: 'from-blue-500 via-blue-300 to-white',
          title: "Updates about crypto market & exchanges",
          timeAgo: "about 12hr",
          location: "Business",
          href: `/news?n=${encodeURIComponent('Updates-About-Crypto-Market-And-Exchanges')}&cat=business&utm_source=news-click`
        }
      ]);

      const [explorePosts, setexplorePosts] = useState<PostType[]>([
        {
          postid: 'post1',
          username: 'Alice Developer',
          handle: '@alice_dev',
          avatar: '/images/default-profile-pic.png',
          bio: 'Full-stack developer',
          content: 'Just deployed my new React + Next.js app! 🚀 Loving the app router and server components. What frameworks are you using in 2024? #NextJS #React #WebDev',
          hashTags: ['NextJS', 'React', 'WebDev'],
          postedAt: '2h ago',
          likes: 247,
          reposts: 56,
          comments: 34,
          views: 1250,
          mediaUrls: [],
          mentions: [],
          userBookmarked: false,
          userliked: false,
          usereposted: false,
          usercommented: false,
          userbookmarked: false,
          cover: '/images/default-banner.jpg',
          isVerified: true,
          plan: 'Pro',
          followers: '1.2k',
          following: '234',
          isFollowing: false,
          isHighlighted: false,
          isPinned: false,
          taggedLocation: [],
          poll: undefined
        },
        {
          postid: 'post2',
          username: 'Bob Designer',
          handle: '@bob_designer',
          avatar: '/images/default-profile-pic.png',
          bio: 'Creative designer',
          content: 'Minimalism isn\'t just a trend, it\'s a mindset. Clean interfaces = better UX. Here\'s my latest Figma design. Thoughts?',
          postedAt: '4h ago',
          likes: 189,
          reposts: 23,
          comments: 12,
          views: 890,
          mediaUrls: [{ url: 'https://picsum.photos/600/400?random=1', media_type: 'image' }],
          mentions: [],
          userBookmarked: false,
          userliked: false,
          usereposted: false,
          usercommented: false,
          userbookmarked: false,
          cover: '/images/default-banner.jpg',
          isVerified: true,
          plan: 'Pro',
          followers: '3.4k',
          following: '567',
          isFollowing: true,
          isHighlighted: false,
          isPinned: false,
          taggedLocation: [],
          poll: undefined
        },
        {
          postid: 'post3',
          username: 'Charlie Writer',
          handle: '@charlie_writer',
          avatar: '/images/default-profile-pic.png',
          bio: 'Tech writer',
          content: 'AI is changing writing forever. But human creativity still wins. What do you think about AI-generated content? Let\'s discuss.',
          postedAt: '6h ago',
          likes: 456,
          reposts: 112,
          comments: 89,
          views: 3400,
          mediaUrls: [{ url: 'https://picsum.photos/video/600/400?random=2', media_type: 'video' }],
          mentions: [],
          userBookmarked: false,
          userliked: false,
          usereposted: false,
          usercommented: false,
          userbookmarked: false,
          cover: '/images/default-banner.jpg',
          isVerified: false,
          plan: 'Free',
          followers: '5.6k',
          following: '123',
          isFollowing: false,
          isHighlighted: false,
          isPinned: false,
          taggedLocation: [],
          poll: undefined
        },
        {
          postid: 'post4',
          username: 'Tech Insider',
          handle: '@tech_insider',
          avatar: '/images/default-profile-pic.png',
          bio: 'Tech updates',
          content: 'Quick poll: What\'s your favorite backend?',
          poll: {
            question: 'Favorite backend framework?',
            options: [
              { text: 'Node.js', votes: 45 },
              { text: 'Python/Django', votes: 32 },
              { text: 'Go', votes: 28 },
              { text: 'Rust', votes: 15 },
              { text: 'Java/Spring', votes: 12 }
            ],
            duration: 86400
          },
          postedAt: '1h ago',
          likes: 156,
          reposts: 34,
          comments: 67,
          views: 2100,
          mediaUrls: [],
          mentions: [],
          userBookmarked: false,
          userliked: false,
          usereposted: false,
          usercommented: false,
          userbookmarked: false,
          cover: '/images/default-banner.jpg',
          isVerified: true,
          plan: 'Pro',
          followers: '10k',
          following: '500',
          isFollowing: false,
          isHighlighted: true,
          isPinned: false,
          taggedLocation: [],
          hashTags: []
        },
        {
          postid: 'post5',
          username: 'Saket Gokhale',
          handle: '@saketgokhale',
          avatar: '/images/default-profile-pic.png',
          bio: 'SaaS builder',
          content: 'Thread: 5 lessons I learned building my first SaaS. 1/5 👇 #SaaS #Startup',
          postedAt: '8h ago',
          likes: 678,
          reposts: 201,
          comments: 145,
          views: 8900,
          mediaUrls: [],
          hashTags: ['SaaS', 'Startup'],
          mentions: [],
          userBookmarked: true,
          userliked: true,
          usereposted: false,
          usercommented: false,
          userbookmarked: true,
          cover: '/images/default-banner.jpg',
          isVerified: true,
          plan: 'Pro',
          followers: '20k',
          following: '1k',
          isFollowing: true,
          isHighlighted: false,
          isPinned: true,
          taggedLocation: [],
          poll: undefined
        },
        {
          postid: 'post6',
          username: 'David Laid',
          handle: '@davidlaid',
          avatar: '/images/default-profile-pic.png',
          bio: 'Fitness enthusiast',
          content: '@bob_designer loved your minimal design! This is gold 🔥',
          mentions: ['bob_designer'],
          postedAt: '3h ago',
          likes: 234,
          reposts: 45,
          comments: 23,
          views: 1450,
          mediaUrls: [{ url: 'https://picsum.photos/500/300?random=3', media_type: 'image' }],
          userBookmarked: false,
          userliked: false,
          usereposted: false,
          usercommented: false,
          userbookmarked: false,
          cover: '/images/default-banner.jpg',
          isVerified: true,
          plan: 'Pro',
          followers: '2.5k',
          following: '300',
          isFollowing: false,
          isHighlighted: false,
          isPinned: false,
          taggedLocation: [],
          hashTags: [],
          poll: undefined
        },
        {
          postid: 'post7',
          username: 'CodeQueen',
          handle: '@codequeen_dev',
          avatar: '/images/default-profile-pic.png',
          bio: 'Weekend coder',
          content: 'Weekend project showcase! 4 screens from my portfolio site.',
          postedAt: '12h ago',
          likes: 389,
          reposts: 78,
          comments: 56,
          views: 2780,
          mediaUrls: [
            { url: 'https://picsum.photos/300/300?random=4', media_type: 'image' },
            { url: 'https://picsum.photos/300/300?random=5', media_type: 'image' },
            { url: 'https://picsum.photos/300/300?random=6', media_type: 'image' },
            { url: 'https://picsum.photos/300/300?random=7', media_type: 'image' }
          ],
          mentions: [],
          userBookmarked: false,
          userliked: false,
          usereposted: false,
          usercommented: false,
          userbookmarked: false,
          cover: '/images/default-banner.jpg',
          isVerified: false,
          plan: 'Free',
          followers: '800',
          following: '150',
          isFollowing: true,
          isHighlighted: false,
          isPinned: false,
          taggedLocation: [],
          hashTags: [],
          poll: undefined
        },
        {
          postid: 'post8',
          username: 'Dev Evangelist',
          handle: '@dev_evangelist',
          avatar: '/images/default-profile-pic.png',
          bio: 'Live coder',
          content: 'Live coding from SF! Building a real-time chat app. Join me!',
          taggedLocation: [{ text: 'San Francisco, CA', coordinates: [-122.4194, 37.7749] }],
          postedAt: '30m ago',
          likes: 567,
          reposts: 134,
          comments: 98,
          views: 4500,
          mediaUrls: [{ url: 'https://picsum.photos/video/640/480?random=8', media_type: 'video' }],
          mentions: [],
          userBookmarked: false,
          userliked: true,
          usereposted:true,
          usercommented: true,
          userbookmarked: false,
          cover: '/images/default-banner.jpg',
          isVerified: true,
          plan: 'Pro',
          followers: '15k',
          following: '2k',
          isFollowing: false,
          isHighlighted: false,
          isPinned: false,
          hashTags: [],
          poll: undefined
        },
        {
          postid: 'post9',
          username: 'Chris Bumstead',
          handle: '@chrisbumstead',
          avatar: '/images/default-profile-pic.png',
          bio: 'Gym bro',
          content: 'Morning workout done 💪 What\'s your go-to exercise? #Fitness #GymLife @davidlaid',
          postedAt: '1d ago',
          likes: 1123,
          reposts: 289,
          comments:167,
          views: 15600,
          hashTags: ['Fitness', 'GymLife'],
          mentions: ['davidlaid'],
          mediaUrls: [],
          userBookmarked: true,
          userliked: false,
          usereposted: true,
          usercommented: false,
          userbookmarked: true,
          cover: '/images/default-banner.jpg',
          isVerified: true,
          plan: 'Pro',
          followers: '500k',
          following: '1k',
          isFollowing: true,
          isHighlighted: true,
          isPinned: true,
          taggedLocation: [],
          poll: undefined
        },
        {
          postid: 'post10',
          username: 'Alex Lee',
          handle: '@alexlee',
          avatar: '/images/default-profile-pic.png',
          bio: 'Open source dev',
          content:'Just hit 10K stars on my open source project! Thank you community 🙏 Check it out: github.com/alexlee/awesome-nextjs',
          postedAt: '2d ago',
          likes: 2345,
          reposts:678,
          comments: 345,
          views: 89000,
          mediaUrls: [],
          mentions: [],
          userBookmarked: false,
          userliked: true,
          usereposted: false,
          usercommented: false,
          userbookmarked: false,
          cover: '/images/default-banner.jpg',
          isVerified: true,
          plan: 'Pro',
          followers: '50k',
          following: '5k',
          isFollowing:true,
          isHighlighted: false,
          isPinned: false,
          taggedLocation: [],
          hashTags: [],
          poll: undefined
        }
      ])
      // function fetching trendings , follow-suggestions , news...
      async function getOtherExploreInfo() {
        const otherapi = await axiosInstance.post('/api/explore');
        if (otherapi.status === 200) {
          setsuggestionAcc(otherapi.data.suggesstions);
          setTrends(otherapi.data.trendingHashtags);
        }
      }

      useEffect(() => {
        // getOtherExploreInfo() ;
      }, [])

      // function to get posts...
      async function functionFetchPosts(hashtag?:string) {
        const postapi = await axiosInstance.get(`/api/explore?hashtag=${hashtag}&size=${pagesize}&page=${Page}`);
        if (postapi.status === 200) {
          setexplorePosts(postapi.data.explore) ;
          sethasExplore(postapi.data.hasNext) ;
        }
      }
      // useeffect for search params...
      useEffect(() => {
        // if ((window.innerHeight - window.scrollY) >= autoHeightGap) {
          if (searchparam.get('t')) {
            const decodedT = decodeURIComponent(String(searchparam.get('t'))); // pattern #something
            // functionFetchPosts(decodedT); // getting explore posts 
          } else {
          //  functionFetchPosts() ;
          }
        // }
      }, [searchparam.get('t')]) // add this later => window.scrollY 
      

  return (
    <div className='h-fit flex flex-row-reverse font-poppins rounded-lg dark:bg-black'>
      <div className='mainbox hidden dark:bg-black w-fit h-fit rounded-lg xl:flex flex-col lg:flex-row-reverse gap-8 p-6 max-w-7xl mx-auto font-poppins'>
        <div className='right w-fit lg:w-80 xl:w-96 space-y-2'>
           {/* Today's News */}
           {/* On hover of each redirect => '/explore?n=endcodeurlcomponent(newstitle)&utm_source=news-click*/}
           <div className='bg-white p-2 dark:bg-black rounded-xl shadow-lg'>
               <div className='p-4 rounded-lg border-b border-gray-200 dark:border-slate-700 flex justify-between'>
                   <h2 className='text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3'><span>Today's News</span><Activebeep /></h2>
                  <Image className='dark:invert' src='/images/newspaper-folded.png' height={25} width={25} alt='newspaper' />
               </div>
               <div className='flex flex-col items-center gap-1.5'>
                     {newsData.map((newsItem, index) => (
                       <Newscard key={index} {...newsItem} />
                     ))}
                        </div>
                        <div className='p-2 m-2 rounded-md border-t border-gray-200 dark:border-gray-700'>
                           <Link  href={`/explore?q=${encodeURIComponent('todays-news')}&utm_source=show-more`} className='cursor-pointer hover:bg-blue-100 dark:hover:bg-gray-950 p-2 rounded-full text-blue-500 hover:text-blue-600 text-sm font-medium'>
                                Show more
                            </Link>
                         </div>
                    </div>

                    {/* Who to Follow */}
                    {/* account suggestions according to my preference... */}
                    {suggestionAcc && (
                    <div className='relative bg-white dark:bg-black rounded-xl shadow-lg'>
                        <div className='p-4 m-2 border-b rounded-md flex gap-2 items-center dark:border-gray-700'>
                          <Users size={20} /><h2 className='text-xl font-bold text-gray-900 dark:text-white'>Who to follow !!</h2>
                        </div>
                          <div className='p-4'>
                          {suggestionAcc.map((user, index) =>
                            (
                              <div key={index} className='flex items-center justify-between mb-2'>
                                <Usercard {...user} content={null} />
                              </div>
                             )
                           )}
                          </div>
                        <div className='p-2 m-2 rounded-md border-t border-gray-200 dark:border-gray-700'>
                           <button 
                            className='cursor-pointer hover:bg-blue-100 dark:hover:bg-gray-950 p-2 rounded-full text-blue-500 hover:text-blue-600 text-sm font-medium'>
                             { 'Show more' }
                           </button>
                         </div>
                      </div>
                    )}
                </div>

        </div>

        {/* Main Feed Area - Left Side */}
        <div className='left flex flex-col gap-2 h-fit flex-1 bg-white dark:bg-black rounded-xl font-poppins'>
            {/* Search Box */}
            <div className='p-4 flex flex-row rounded-lg items-center justify-between'>
              <div className='flex flex-row items-center gap-2 flex-1'>
                <span className='cursor-pointer'><SearchIcon className='stroke-gray-400' /></span>
                <input
                 type='text'
                 placeholder='Search'
                 className='flex-1 placeholder:font-medium p-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none dark:focus:border-blue-600 shadow-sm focus:shadow-md transition-all duration-300'
                />
              </div>
              <div className='ml-4'>
                <SettingsIcon onClick={() => { setopenSettings(true) }} className='cursor-pointer' />
              </div>
            </div>
            <div className='p-4 rounded-lg font-semibold text-lg'>
                <div className='flex items-center justify-between m-2'>
                  <span>Trending Nowdays</span>
                  <TrendingUp size={20}/>
                </div>

                <ul className='flex flex-col gap-1'>
                    {Trends?.map((trend, index) => (
                      <Trendcard 
                        key={index}
                        rank={trend.rank} 
                        region={trend.region} 
                        tag={trend.tag} 
                        posts={trend.posts} 
                      />
                    ))}

                </ul>
            </div>
            <div className='p-4 space-y-2'>
               <div className='flex items-center text-lg font-semibold justify-between m-2'>
                  <span>Explore Post</span>
                  <MessageCircleHeartIcon size={20}/>
               </div>
               <div>
                {(explorePosts).map((post,index) => (
                  <PostCard 
                    key={index} 
                    postId={post.postid}
                    {...post} 
                    fromPage={pageCategory}
                  />
                ))}
                </div>
            </div>
            {openSettings && (
              <ExploreSettings
                LocationSetting={LocationSetting}
                toggleLocation={() => setLocationSetting(!LocationSetting)}
                close={() => setopenSettings(false)}
              />
            )}
            </div>
          </div>
      )}


