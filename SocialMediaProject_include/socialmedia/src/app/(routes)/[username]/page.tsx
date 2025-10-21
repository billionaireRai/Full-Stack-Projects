'use client'

import React, { useState , useEffect } from 'react';
import Trendcancelpop from '@/components/trendcancelpop';
import ReportPop from '@/components/reportPop';
import BlockUser from '@/components/blockUser';
import Link from 'next/link';
import Image from 'next/image';
import PostCard from '@/components/postcard';
import ProfileEditor from '@/components/profileeditor';
import { Flame, TrendingUp, Gamepad2, Briefcase, MoreHorizontalIcon, MapPin, Link as LinkIcon, Calendar , Edit2Icon , Share2Icon , CopyIcon , BanIcon, Flag, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

// definging the type for user information...
export interface userInfoType {
  name:string ,
  username:string ,
  bio:string ,
  location:string,
  website:string,
  joinDate:string,
  following:string,
  followers:string,
  Posts:string,
  isVerified:boolean,
  coverImage:string,
  avatar:string
}

interface PostType {
    id: string,
    content: string,
    postedAt: string,
    comments: number,
    reposts: number,
    likes: number,
    views: number,
    bookmarks: number,
    mediaUrls?:string[],
    hashTags?:string[],
    mentions?:string[]
}

interface innerPostAuthorInfo {
  name: string;
  username: string;
  isVerified: boolean;
  followers:string,
  following:string,
  avatar: string;
  content: string;
  postedAt: string;
}

interface RepliedPostsType {
  id:string,
  postId:string,
  postAuthorInfo:innerPostAuthorInfo,
  commentedText:string,
  mediaUrls:string[],
  hashTags?:string[],
  mentions?:string[],
  repliedAt:string,
  comments:number,
  reposts:number,
  likes:number,
  views:number,
  bookmarks:number
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
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [hpninPopUp, sethpninPopUp] = useState<number>(0);
  const [OpenProfileEditor, setOpenProfileEditor] = useState<boolean>(false) ;
  const [OpenReportPop, setOpenReportPop] = useState<boolean>(false)
  const [showBlockPop, setshowBlockPop] = useState<Boolean>(false)
  const [IsBlocked, setIsBlocked] = useState<boolean>(false);

  const [showProfileOptions, setShowProfileOptions] = useState<boolean>(false);
  
  // random user data
  let user = {
    name: "John Doe",
    username: "johndoe",
    bio: "Digital creator • Photography enthusiast • Coffee lover • Building amazing things one line of code at a time",
    location: "San Francisco, CA",
    website: "https://www.johndoe-portfolio.com",
    joinDate: "Joined March 2012",
    following: '542',
    followers: '187k',
    Posts: "3,245",
    isVerified: false,
    coverImage: "data:image/webp;base64,UklGRtwNAABXRUJQVlA4INANAABwTgCdASq3AZYAPp1Inkylo6alpBFq0NATiWdu4Wuw4ZhcyF2zuDy92NFz2fd3fO6IR7N/0GPi79/+Y9Pvr7/ivcA/UH/Wfaz84/8DxSKAX8p/sX/L/wv5JfJh/zf5f0N/U//j9w3+cf2D/l9fX92PZrCI/BLycMYWkRjmlkNfNZuBUvKi17segfV8e4DstenwgwXiiysOFdY/QR+82L6RV6Xpel6XpeAGhz3/zVUrXGPl6ocQ0lTh8sqRyV10dg6m3TJkGt2RkMUaoU/YGlJRKSiUkkLEJBavZaUsuilILk8lrFUuDS99rDjBbFuKvM+XJqlkPRIeiQ7jcASZu8YICiUrWraJaj8nHBb6i5+l4a//Ra8VpWlBpsrsHduA8CALaXBcBDv82POBcKNDwqaeNH9sh6AL+jLyLuf5O/zBQ5jQhrb7iMuZS8JPsv6xIOdd8qvZ3kg/LpRWOzeXAFuSWAsvgK/WnP/XBYg0OwJnbIOCLtoOjVGxUehlzj3QzLxrN7+UMEzkDHIxI7iziHdWKPL7gYSnAMsxU0HcpzzhUG92uXEagvZe9v1QNY3kIwBt31ccM4Xx/ZrfGm4LoiInQdVb2x75+BL5ki94qIRTMR7f5t+2hHT3CoAkO23JnWEEKDtCposfmDYBqaFnT1ePTMlgfebRTcEOqgahN5iYZ0UMQYEs3cRl4MNASD0puSlycliNShj+7fkWVO0pKJRt6JuSKAPDo4JaYzMAtXSWFB2faDSXePpxavc1OPRWU8GIVdm19oy/2BpSUSkAMuiQ8/lBAuN/fSHLdb7wQBIcOGc/RHh3BDuCHcEOq3hwSrphHVLJ4A9/DfDsuTQA/usKe75XZlUHy26VWbn/yOjN2WP8EvVZ1zUhXbry25lIcbLdD1QD3z8iQN5aToCkmXjT+B/S+Q86EqzY4s1z1KKagxIi5LWDfXzaJoYiWsMItHX+ePDklYiNVp1XcTPHwePk+0PYPphf+idocd/vd/3JxYNfXpWpUpSHcW350gTEdBPuUfn9ALnKXXzypl1MzhoVa+mTk3AtSpvN7RpBEPpSdPlIT5SE+UhPlIT5VAmK+Q4ACypshKL38xy5Q3WT3tJ8JsK3zfVtztFa98og7B2HIA04KdN3k8xdYyE45miHQjkTlTtpAGOWUn2QsAeyrEHRjVSYi7j/AWywjScIaOQewc31HZOcFOVQAeLNtDWBCC/W3em8PMDQLExZS8PONAQAo8FHV8QMIKHgV7Hdv3Uh3Q0oAAAAAAALmZn4+Ktyn3PckqRoNzM42HW0swAm94f8vDcQsSTqj67lam/HNS8tBrP3v8Pp5B44l5LfEtlaV3U3VG544qf1irMgh8k5o/AneEBXFHp+h2BG4aJNW92UWWDW4tRUqV99Da752jYbzv0HKLhKPcBgraJ7sYwUTtCT525hkC2tRzv5dXfBOQ15IL1J7emFiPh+IsfQEb0PhebWgADgjLP4KML1DozQkZy3LIiKJJMQJ1X3NvgDcBcbQFDVVxTw9vKdTK5yz6cPgpyi8SoEHnkCPxz1Tg9GXqbqMjfJPi3yk5LjCLJ/c0YjhmbD8xxH6Z3IsjDVJ6F3kSbVPvndsi4x8BKMIG/+XPZ9Ujvt8j3Elx7yAdegYJnAngEwY4l5jx0+QwHSQlPjzKdrT7aziqd7nXf6peEUKXCYtZXNKfPpa6UVysD0048b1fL5/9ETeB2F/dDyz21+CFf/B9RhxyeHxPoQj3r7AN1LfzeDKRo3/wrz7+RJJu88jwnl12GQ52wdybV/Qc7gg9JVi1Ak+rl8ZTLDiYEy1FuaxarrbtQCZZcxwnu23fxbwOVc8zZhleHre+Za/xIOmG/TWLj35YqFAcPtV/H50sLHNZHSfaQjpHQ3Bm2H23fepZL/Q7V0ExwlDpXa84/Pcu9tZED33vLEPxLIwD6txxkkFGAv4/cWVI3VvVK7s4Bs18YzQAIe6yo+W3vbnjYyB1cioSE9OTr2PXq0IPc1kQ2fQr7avojBJB0Et9O1aEQZgsPNpcjcgGPb690q/RdsyT9GNQLsroc78GHiTvc+65DseWeRYVeD6d+RmxgVseUjO8uiHnVm50OfWCBJbKEPw0tgtZo4MbbQ+ETxbgtUG7DroIEzSzWVaiS2BFqfIfAmZ9ZIAYMZJxhi+u48RFZuYNqKCb2XsEI+rhm9hULXsciIZHmC5yXUVOAgzLEs4px22OpLrR60M32zaUPp8XpLfxXOvLEMyx8medsL9RfQfZ4Me+jyXWf7IshpFVJxbpMrIj5pRanEucSZ73nR482+m1/UJ+W1/eaas7itVCPSf45rw2CdyG9LDtdrVULH5aQPzuUe9FFw2hrR/IUxP8IXpWJ1swq7MFMau6KgXzfMU5ZDd1sUd6kJ93SFf7VsV5Zc5SjnETpC5teSCQGTegFWHfXOzMxujtPZswZ13Y4HQxvbcgG1amgnote/KR5gXByylkbDnrdjo8O07Y7rSjry6W+e/4iQWdsF3vVjYmFxmbgNOaSBdPffUeoRpqAMDH/DNnxFKjH6ku0R9cYgVWeBfqCvghT6gFhwvcAlE/QdGbBU/K2O5aRUATPtsVWKU0Yd/UAs8kzJ1t7lpL5oogigoCBxzfsBr46QmGvxaHlKgKhohQ1a1jlrEWKhjH6G0smRXNAPlkjx0pSpfOaJrckh/GzdDIQt739BRLonBfFPI2Csi8kH/N5VIAZ4jKiwcqo2ua8NFkj76PFUPgg3GXqSQRZmIwuhLuZwfIdQ9Hawl++F4bpwQFYy+FSLXrMJr6CExXyVgL5+sn0O6xLoRj/KUCkuyfEzTwTAzDIjqGiOU+tgyPTq2kxergL19znjIXZWEbHMamTRzJ8RhWaBlnKbJVfU7wNDiDar/FX0okoqJuaCI0B0Hghj/cILfDIvT5x2/JNDDGs4OrrjhTo6RaUVYJ5S9c9YVXZLASVFrlFvUooQEIV/poAg4njEN+fp7NYH9dt7tW/xlHS84EwumlXXLng+2RGVjjdeoOZpZsDWYf62NfWEPIgcLVoLzblAEiC/M99DCcJ4ppq2J6ah549gGj3aNg4L3BLTEqxpAFgVkz6Av3z2fe4lxKY3h8ywXoEgqYIL/bUrSJoM0h0b0896B5WNqyMLq3HOQ++a8X89CPRkYYA1rbv7BwThutJew/j7P8D+StGteFkzR+Tjl5I3FgyxctV+krvQEQttRV0DndFRpa7+t3f+cVrklSqX4zbdulbVjGHQNRHrDCNefpRcOvsP2EddMRGcpCvuyyxQqDzoP0VyzFcIXFA0gubWLuF9SEVKaRNoLdUSOVMQ2iPiGF8agf/yMPZzuwcCKSf8f34ixdUWw1/XpKpA5pa9Zej0dLgPoQsOd2ZkncSxjGzkStaNqMfvmN9ngtxkjZO7gn9WZ0BMgCTHBAQ1uZqeeJZqFhZiZJUa5wRbsVOXy37r/YrFvvlOwR8/Z0ovP96J3dJbKJP9OpQG59mi9TV6bf1Wm6yy639R8h3iHLP10/KYyGhY5Hg/hNgN0liLXJPakSflw+eI0c8FX7chT5cnDHyv+PmJGCpQSzosd5CSbf04spQ2k/bvCOn7gSyE00dZsNKIZ31pUu6kzlHd59OHA42xTYOHZT1iTpJ+3rztB1ZPSg6x/JcSswMgYlwgha1jFEbd8Uh5btC8kzgR9dzfyvw4VLdH7Vwure1H21FdnNaRTCxFO1RS5DTKUgslvWP6lxKLDnSK9T4/2aai7ahmAq2XsRq5V1ovpYk3IwnD+rp5HE+cBpNyCJ4m9rxPBgsxsNO/EizRvyyJaNk/KpLO3urtZerB0SSF/PiozMjDb6mRdQAaOApyNNlTziKabKZbFcHHDq58PWxONDrqADht7qrljs4BuV/Q4pHAxv6UpkKRgJu7JcM3AFrCs5Q6XFo9L2Jc/rMKLCU97qXNVtH2rtKkz1cTawalsVupB05YL7oZ4bWSk7PwlYF04WgEDOUn5/wcKoX6Ztzl9JxVZw1DLBvyIZeEBMHvJv+l6WqqrFr0RqPBM+toqfUjaKYkpW4yGISY1w7ydHh2JDY2N54P1SsChwLOxyIGz/ghKh0HjQa0yZxjeOiZ0AAsf+JGzU8QHUvcOKPkVimfVokc/dYaGTVRQukohACxTNNNMzTVFxS12cKMx2YlV35AW9AEyq6zpM4g85fOaMdt5EAqGbMW4X0tD/kJxbvuMGpQJBgq20VT6kb3WvhJO8liPOEd/ySJwxtTLXjCJi1GXxvhAOSQcvkuupQa+0+OVo0quN0v3zq+njiRuBdZUCuL5GmeVkMGVPi6LQ8RoR7Ku898EioW/ObKs1p3Tk+nQqLlCSGkktoTGlpzR1KApFlMWz2WYl/gb27Gx1nJBcPIig60loqkSMGvaQ27Kwb6esXrrzW+7yBJBTzqNc81FuXynkAZrWBTVFkOERfoAMtFlk9Mj+J4LLvZ8fcPPEw/TqfrHQ+S0xSreQADf8bxDIBx5Ykaa1FdlvnS54sae4N+Ly0ZVTYmnOScZQN021kCwMG0B3q4ADXEdrdruwLGiNyIN3Fdb6NhIpMmvAMe5vXzpwviZ6QAWcze16G2UhzVvwy4QzoUVgwe4lq2Tf7EB40CsevvEHGplAAAIRmJW55Vqgvzhg6y8TY6Llrzmer0svuUZg67PppDhjhTna/ZGgDKmWelN88b2O1BaPmW/Eht/IGax1gcDUAAAA==",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
  };

  const [UserInfo, setUserInfo] = useState<userInfoType>(user) ;
  const tabs = [
    {id:'all' , label:'All'},
    { id: 'posts', label: 'Posts' },
    { id: 'replies', label: 'Replied-Posts' },
    { id: 'media', label: 'Media' },
    { id: 'likes', label: 'Likes' }
  ];
  const [activeTab, setActiveTab] = useState<tabsTypes>({id:'all',label:'All'}); // current active tab state...

  // random post data of UI checking...
  const posts = [
    {
      id: "1",
      content: "Just launched my new portfolio website! Built with Next.js and Tailwind CSS. The developer experience is amazing! 🚀",
      postedAt: "2h ago",
      comments: 12,
      reposts: 45,
      likes: 128,
      views: 1000,
      bookmarks: 50
    },
    {
      id: "2",
      content: "Beautiful sunset from the Golden Gate Bridge today. Sometimes you just have to stop and appreciate the moment. 📸",
      postedAt: "1d ago",
      comments: 8,
      reposts: 23,
      likes: 156,
      views: 800,
      bookmarks: 30
    },
    {
      id: "3",
      content: "Working on a new open source project. Can't wait to share it with the community!",
      postedAt: "3d ago",
      hashTags:['coding','opensource'],
      mentions:['saketghokhale','notsofit','vedantchoudhary'],
      comments: 34,
      reposts: 67,
      likes: 289,
      views: 1500,
      bookmarks: 100
    }
  ];

   const repliedPostData: RepliedPostsType[] = [
    {
      id: "3",
      postId: '4223',
      postAuthorInfo: {
        name: "Amritansh Rai",
        username: "amritansh_coder",
        followers:'352.7k',
        following:'242',
        isVerified: true,
        avatar: "/images/myProfile.jpg",
        content: "Working on a new open source project. Can't wait to share it with the community!",
        postedAt: "3d ago"
      },
      commentedText: "Working on a new open source project. Can't wait to share it with the community!",
      mediaUrls: [],
      mentions:['notsofit','vedantchoudhary'],
      hashTags:['GSOC','opensource'],
      repliedAt: "3d ago",
      comments: 34,
      reposts: 67,
      likes: 289,
      views: 500,
      bookmarks: 20
    },
    {
      id: "4",
      postId: '4224',
      postAuthorInfo: {
        name: "Saket Ghokhale",
        username: "saketghokhale",
        followers:'150k',
        following:'180',
        isVerified: false,
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        content: "Excited to share my latest blog post on React performance optimization techniques!",
        postedAt: "1d ago"
      },
      commentedText: "Great insights! I've been implementing similar optimizations in my projects.",
      mediaUrls: ["https://picsum.photos/400/300?random=20"],
      mentions:['amritansh_coder','ezsnippet'],
      hashTags:['React','Performance'],
      repliedAt: "1d ago",
      comments: 15,
      reposts: 23,
      likes: 89,
      views: 320,
      bookmarks: 5
    },
    {
      id: "5",
      postId: '4225',
      postAuthorInfo: {
        name: "Vedant Choudhary",
        username: "vedantchoudhary",
        followers:'89.2k',
        following:'95',
        isVerified: true,
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        content: "Just finished a 10k run! 🏃‍♂️ Feeling accomplished and ready for the next challenge.",
        postedAt: "5h ago"
      },
      commentedText: "Congrats! That's impressive. What's your training routine like?",
      mediaUrls: [],
      mentions:['fitnessguru','runningclub'],
      hashTags:['Running','Fitness'],
      repliedAt: "4h ago",
      comments: 8,
      reposts: 12,
      likes: 67,
      views: 250,
      bookmarks: 3
    },
    {
      id: "6",
      postId: '4226',
      postAuthorInfo: {
        name: "Not So Fit",
        username: "notsofit",
        followers:'45.8k',
        following:'120',
        isVerified: false,
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        content: "Exploring the world of machine learning. Just built my first neural network model!",
        postedAt: "2d ago"
      },
      commentedText: "Awesome! Which framework did you use? TensorFlow or PyTorch?",
      mediaUrls: ["https://picsum.photos/400/300?random=21", "https://picsum.photos/400/300?random=22"],
      mentions:['ml_expert','data_science'],
      hashTags:['MachineLearning','AI'],
      repliedAt: "2d ago",
      comments: 22,
      reposts: 18,
      likes: 145,
      views: 680,
      bookmarks: 15
    }
  ]

  let likedPosts = [
    {
      id: "liked1",
      content: "Excited to announce my new project! It's been a journey of learning and growth.",
      postedAt: "1h ago",
      comments: 15,
      reposts: 25,
      likes: 120,
      views: 500,
      bookmarks: 10,
      mediaUrls: ["https://picsum.photos/400/300?random=10"],
      hashTags: ["webdev", "react"],
      mentions: ["developer1"]
    },
    {
      id: "liked2",
      content: "Beautiful sunrise this morning. Nature's way of saying good morning! 🌅",
      postedAt: "3h ago",
      comments: 8,
      reposts: 12,
      likes: 89,
      views: 320,
      bookmarks: 5,
      mediaUrls: ["https://picsum.photos/400/300?random=11"]
    },
    {
      id: "liked3",
      content: "Just finished reading an amazing book on AI ethics. Highly recommend it to everyone interested in tech!",
      postedAt: "5h ago",
      comments: 22,
      reposts: 18,
      likes: 145,
      views: 680,
      bookmarks: 15,
      hashTags: ["AI", "ethics", "books"]
    },
    {
      id: "liked4",
      content: "Coffee and code - the perfect combination for a productive day! ☕💻",
      postedAt: "8h ago",
      comments: 6,
      reposts: 9,
      likes: 67,
      views: 250,
      bookmarks: 3
    },
    {
      id: "liked5",
      content: "Team collaboration at its finest! Grateful to work with such talented people.",
      postedAt: "1d ago",
      comments: 12,
      reposts: 20,
      likes: 98,
      views: 450,
      bookmarks: 8,
      mentions: ["teamlead", "colleague1"]
    },
    {
      id: "liked6",
      content: "Exploring new technologies and frameworks. The dev world never stops evolving!",
      postedAt: "2d ago",
      comments: 18,
      reposts: 14,
      likes: 112,
      views: 600,
      bookmarks: 12,
      hashTags: ["tech", "innovation"]
    },
    {
      id: "liked7",
      content: "Weekend project complete! Built a cool weather app using Next.js and OpenWeather API.",
      postedAt: "3d ago",
      comments: 25,
      reposts: 30,
      likes: 156,
      views: 750,
      bookmarks: 20,
      mediaUrls: ["https://picsum.photos/400/300?random=12", "https://picsum.photos/400/300?random=13"],
      hashTags: ["nextjs", "weatherapp"]
    }
  ]

  let userMedia = {
    images: [
      "https://picsum.photos/400/300?random=1",
      "https://picsum.photos/400/300?random=2",
      "https://picsum.photos/400/300?random=3",
      "https://picsum.photos/400/300?random=4",
      "https://picsum.photos/400/300?random=5",
      "https://picsum.photos/400/300?random=6"
    ],
    videos: [
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
    ],
    docs: [
      "https://res.cloudinary.com/demo/image/upload/v1698765432/documents/sample_doc_1.pdf",
      "https://res.cloudinary.com/demo/image/upload/v1698765433/documents/sample_doc_2.pdf",
      "https://res.cloudinary.com/demo/image/upload/v1698765434/documents/sample_doc_3.pdf",
      "https://res.cloudinary.com/demo/image/upload/v1698765435/documents/sample_doc_4.pdf"
    ]
  }

  const [Posts, setPosts] = useState<PostType[]>(posts) ; // rendering some random posts...
  const [RepliedPosts, setRepliedPosts] = useState<RepliedPostsType[]>(repliedPostData) ; // rendering some random replied posts...
  const [Medias, setMedias] = useState<userAllMedias>(userMedia);
  const [LikedPost, setLikedPost] = useState<PostType[]>(likedPosts);

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
    navigator.clipboard.writeText(`http://localhost:3000/@${UserInfo.username}`)
    .then(() => { 
      console.log('profile url copied');
      toast.success('Profile URL is copied...');
     })
  }

  return (
    <div className='h-fit flex flex-col md:ml-72 font-poppins rounded-md p-2 dark:bg-black'>
        <div className='flex gap-2'>
          {/* Main Content - Profile */}
          <div className='flex-2 overflow-y-auto'>
            <div className="bg-white dark:bg-black text-gray-900 dark:text-white">
              {/* Header */}
              <header className="sticky top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
                <div className="px-4 py-3">
                  <div className="flex items-center">
                    <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-950 cursor-pointer rounded-full transition-colors">
                     <Image src='/images/up-arrow.png' width={30} height={30} alt='back-arrow' className='-rotate-90 dark:invert' />
                    </button>
                    <div className="ml-4">
                      <h1 className="text-xl font-bold">{UserInfo.name}</h1>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{Posts.length} Posts</p>
                    </div>
                  </div>
                </div>
              </header>

              {/* Cover Photo */}
              <div className="relative h-48 rounded-lg bg-gradient-to-r from-blue-400 to-purple-500">
                <img 
                  src={UserInfo.coverImage} 
                  alt="Cover" 
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>

              {/* Profile Info */}
              <div className="relative px-4">
                {/* Avatar */}
                <div className="absolute -top-16 left-4">
                  <div className="relative">
                    <img 
                      src={UserInfo.avatar} 
                      alt={UserInfo.name}
                      className="w-32 h-32 rounded-full border-4 border-white dark:border-black bg-white dark:bg-black"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end pt-4 pb-3">
                  <button
                    onClick={() => setShowProfileOptions(!showProfileOptions)}
                    className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-950 cursor-pointer rounded-full transition-colors mr-2"
                  >
                    <MoreHorizontalIcon size={20} />
                    {showProfileOptions && (
                      <div className='more-dropdown absolute right-5 top-10 w-48 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl dark:shadow-gray-950 z-20'>
                        <ul className='p-2'>
                          <li 
                           onClick={() => { setOpenProfileEditor(true) }}
                           className='flex flex-row items-center justify-between rounded-md w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-950 transition-colors'>
                            <span>Edit Profile</span><Edit2Icon size={15} />
                          </li>
                          <li className='flex flex-row items-center justify-between rounded-md w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-950 transition-colors'>
                            <span>Share Profile</span><Share2Icon size={15} />
                          </li>
                          <li 
                          onClick={() => { handleProfileLinkCopy() }}
                          className='flex flex-row items-center justify-between rounded-md w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-950 transition-colors'>
                           <span>Copy Link</span><CopyIcon size={15}/>
                          </li>
                          <li 
                          onClick={() => { setshowBlockPop(true) }}
                          className={`flex flex-row items-center justify-between rounded-md w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-950 transition-colors ${IsBlocked ? 'dark:bg-red-950/50 bg-red-100 text-red-500' : ''}`}>
                            <span>{IsBlocked ? 'UnBlock' : 'Block User'}</span><BanIcon size={15}/>
                          </li>
                          <li 
                          onClick={() => { setOpenReportPop(true) }}
                          className='flex flex-row items-center justify-between rounded-md w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-red-950/50 transition-colors text-red-500'>
                            <span>Report User</span><Flag size={15} />
                          </li>
                        </ul>
                      </div>
                    )}
                  </button>
                  <button
                    disabled={IsBlocked}
                    onClick={() => setIsFollowing(!isFollowing)}
                    className={`px-4 py-2 rounded-full font-bold text-sm transition-colors ${
                      IsBlocked
                        ? 'border border-red-600 bg-red-200 dark:bg-gray-950 text-red-600 dark:text-red-700 cursor-not-allowed'
                        : isFollowing
                          ? 'bg-transparent border border-gray-300 dark:border-gray-700 text-black dark:text-white hover:bg-yellow-100 dark:hover:bg-gray-950 hover:text-yellow-400 dark:hover:text-blue-700 cursor-pointer'
                          : 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 cursor-pointer'
                    }`}
                  >
                    {IsBlocked ? 'Blocked' : isFollowing ? 'Following' : 'Follow' }
                  </button>
                </div>

                {/* User Details */}
                <div className="space-y-3 pb-3">
                  <div>
                    <div className="flex items-center space-x-1">
                      <h1 className="text-xl font-bold">{UserInfo.name}</h1>
                      { UserInfo.isVerified ? (
                       <Image src='/svg/blue-tick.svg' width={25} height={25} alt='blue-tick' />
                       ) : (
                        <Link href='/subscription?utm_source=profile-page' className='border border-gray-400 hover:bg-gray-100 dark:hover:bg-gray-950 dark:border-gray-700 cursor-pointer flex flex-row items-center justify-center gap-1 px-3 py-1 rounded-full'>
                          <span>Get Verified</span><Image src='/svg/blue-tick.svg' width={18} height={18} alt='blue-tick' />
                        </Link>
                      )}
                    </div>
                    <p className="text-gray-500 text-sm dark:text-gray-400">@{UserInfo.username}</p>
                  </div>

                  <p className="text-sm">{UserInfo.bio}</p>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <Link href={`https://www.google.com/maps?q=37.7749,-122.4194`}  // lat,lng
                    className="flex items-center space-x-1 py-1 px-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-950">
                      <MapPin className="w-4 h-4 stroke-black dark:stroke-white" />
                      <span>{UserInfo.location}</span>
                    </Link>
                    <div className="flex items-center space-x-1 py-1 px-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-950">
                      <LinkIcon className="w-4 h-4 stroke-black dark:stroke-white" />
                      <Link href={`${UserInfo.website}?utm_source=briezly-profile-page`} className="text-blue-500 hover:underline">{UserInfo.website}</Link>
                    </div>
                    <div className="flex items-center space-x-1 py-1 px-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-950">
                      <Calendar className="w-4 h-4 stroke-black dark:stroke-white" />
                      <span>{UserInfo.joinDate}</span>
                    </div>
                  </div>

                  <div className="flex space-x-4 text-sm">
                    <Link href={`/@${UserInfo.username}/following`} className="hover:underline">
                      <span className="font-bold text-black dark:text-white">{UserInfo.following}</span>
                      <span className="text-gray-500 dark:text-gray-400"> Following</span>
                    </Link>
                    <Link href={`/@${UserInfo.username}/followers`} className="hover:underline">
                      <span className="font-bold text-black dark:text-white">{UserInfo.followers}</span>
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
                          avatar={UserInfo.avatar}
                          username={UserInfo.name}
                          handle={UserInfo.username}
                          timestamp={post.postedAt}
                          content={post.content}
                          media={post.mediaUrls || []}
                          likes={post.likes}
                          retweets={post.reposts}
                          replies={post.comments}
                          shares={0}
                          views={post.views}
                          bookmarked={post.bookmarks}
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
                        <div key={post.id} className="bg-gray-50 dark:bg-black rounded-xl p-4 border border-gray-200 dark:border-gray-900 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex space-x-3">
                            <img
                              src={UserInfo.avatar}
                              alt={UserInfo.name}
                              className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-3">
                                <span className="font-bold text-sm">{UserInfo.name}</span>
                                {UserInfo.isVerified && (
                                  <Image src='/svg/blue-tick.svg' width={20} height={20} alt='blue-tick' />
                                )}
                                <span className="text-gray-500 dark:text-gray-400 text-sm">@{UserInfo.username}</span>
                                <span className="text-gray-500 dark:text-gray-400 text-sm">·</span>
                                <span className="text-gray-500 dark:text-gray-400 text-sm">{post.repliedAt}</span>
                              </div>
                              <div className="space-y-3">
                                <Link href={`@${post.postAuthorInfo.username}/post/${post.postId}`} className="text-blue-500 hover:underline text-sm inline-block">Replied to post</Link>
                                <div className="ml-4 border-l-2 border-gray-300 dark:border-gray-600 pl-4">
                                  <PostCard
                                    avatar={post.postAuthorInfo.avatar}
                                    username={post.postAuthorInfo.name}
                                    handle={post.postAuthorInfo.username}
                                    timestamp={post.postAuthorInfo.postedAt}
                                    content={post.postAuthorInfo.content}
                                    hashTags={['opensource','webdevproject']}
                                    mentions={['saketghokhale','ezsnippet']}
                                    media={[]}
                                    likes={0}
                                    retweets={0}
                                    replies={0}
                                    shares={0}
                                    views={0}
                                    bookmarked={0}
                                    showActions={false}
                                  />
                                </div>
                                <PostCard
                                  avatar={UserInfo.avatar}
                                  username={UserInfo.name}
                                  handle={UserInfo.username}
                                  timestamp={post.repliedAt}
                                  content={post.commentedText}
                                  media={post.mediaUrls}
                                  likes={post.likes}
                                  retweets={post.reposts}
                                  replies={post.comments}
                                  shares={0}
                                  views={post.views}
                                  bookmarked={post.bookmarks}
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
                              <img
                                src={image}
                                alt={`Media ${index + 1}`}
                                className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                              />
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
                          avatar={UserInfo.avatar}
                          username={UserInfo.name}
                          handle={UserInfo.username}
                          timestamp={post.postedAt}
                          content={post.content}
                          media={post.mediaUrls || []}
                          likes={post.likes}
                          retweets={post.reposts}
                          replies={post.comments}
                          shares={0}
                          views={post.views}
                          bookmarked={post.bookmarks}
                          hashTags={post.hashTags}
                          mentions={post.mentions}
                        />
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* some other widgets... */}
          <div className='hidden lg:block flex-1 overflow-y-auto'>
            <div className='space-y-4'>
              {/* What's happening */}
              <div className='bg-gray-50 dark:bg-black rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm'>
                <div className='p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center'>
                  <h2 className='text-xl font-bold text-gray-900 dark:text-white'>What's happening</h2>
                  <svg className='h-5 w-5 text-gray-500 dark:text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />
                  </svg>
                </div>
                <div className='p-3'>
                  <Link href={`/explore?q=${encodeURIComponent('#TechInnovation')}&utm_source=trend-click`} className='happening-dropdown hover:bg-gray-100 dark:hover:bg-gray-950 p-3 rounded-lg cursor-pointer transition-colors inline-block w-full'>
                    <div className='flex items-start space-x-3'>
                      <div className='w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center'>
                        <Flame className="w-4 h-4 text-white" />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <p className='text-sm text-gray-500 dark:text-gray-400'>Trending</p>
                        <p className='font-bold text-gray-900 dark:text-white'>#TechInnovation</p>
                        <p className='text-xs text-gray-500 dark:text-gray-400'>42.1K posts</p>
                      </div>
                      <div onClick={(e) => { e.stopPropagation(); sethpninPopUp(1) }} className="relative">
                        <MoreHorizontalIcon className='w-4 h-4 cursor-pointer' />
                        { hpninPopUp === 1 && (
                          <Trendcancelpop setNumber={() =>  {sethpninPopUp(0) }}/>
                        )}
                      </div>
                    </div>
                  </Link>
                  <Link href={`/explore?q=${encodeURIComponent('#ClimateAction')}&utm_source=trend-click`} className='happening-dropdown hover:bg-gray-100 dark:hover:bg-gray-950 p-3 rounded-lg cursor-pointer transition-colors inline-block w-full'>
                    <div className='flex items-start space-x-3'>
                      <div className='w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center'>
                        <TrendingUp className="w-4 h-4 text-white" />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <p className='text-sm text-gray-500 dark:text-gray-400'>Trending</p>
                        <p className='font-bold text-gray-900 dark:text-white'>#ClimateAction</p>
                        <p className='text-xs text-gray-500 dark:text-gray-400'>28.7K posts</p>
                      </div>
                      <div onClick={(e) => { e.stopPropagation(); sethpninPopUp(2) }} className='relative'>
                        <MoreHorizontalIcon className='w-4 h-4 cursor-pointer' />
                        { hpninPopUp === 2 && (
                          <Trendcancelpop setNumber={() =>  {sethpninPopUp(0) }}/>
                        )}
                      </div>
                    </div>
                  </Link>
                  <Link href={`/explore?q=${encodeURIComponent('#Gaming')}&utm_source=trend-click`} className='happening-dropdown hover:bg-gray-100 dark:hover:bg-gray-950 p-3 rounded-lg cursor-pointer transition-colors inline-block w-full'>
                    <div className='flex items-start space-x-3'>
                      <div className='w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center'>
                        <Gamepad2 className="w-4 h-4 text-white" />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <p className='text-sm text-gray-500 dark:text-gray-400'>Trending</p>
                        <p className='font-bold text-gray-900 dark:text-white'>#Gaming</p>
                        <p className='text-xs text-gray-500 dark:text-gray-400'>156K posts</p>
                      </div>
                      <div onClick={(e) => { e.stopPropagation(); sethpninPopUp(3) }} className='relative'>
                        <MoreHorizontalIcon className='w-4 h-4 cursor-pointer' />
                        { hpninPopUp === 3 && (
                          <Trendcancelpop setNumber={() =>  {sethpninPopUp(0) }}/>
                        )}
                      </div>
                    </div>
                  </Link>
                  <Link href={`/explore?q=${encodeURIComponent('#Business')}&utm_source=trend-click`} className='happening-dropdown hover:bg-gray-100 dark:hover:bg-gray-950 p-3 rounded-lg cursor-pointer transition-colors inline-block w-full'>
                    <div className='flex items-start space-x-3'>
                      <div className='w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center'>
                        <Briefcase className="w-4 h-4 text-white" />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <p className='text-sm text-gray-500 dark:text-gray-400'>Trending</p>
                        <p className='font-bold text-gray-900 dark:text-white'>#Business</p>
                        <p className='text-xs text-gray-500 dark:text-gray-400'>89.3K posts</p>
                      </div>
                      <div onClick={(e) => { e.stopPropagation(); sethpninPopUp(4) }} className='relative'> 
                        <MoreHorizontalIcon className='w-4 h-4 cursor-pointer' />
                        { hpninPopUp === 4 && (
                          <Trendcancelpop setNumber={() =>  {sethpninPopUp(0) }}/>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
                <div className='p-4 border-t border-gray-200 dark:border-gray-700'>
                  <Link  href={`/explore?q=${encodeURIComponent('trend-nowdays')}&utm_source=show-more`} className='cursor-pointer text-blue-500 hover:text-blue-600 text-sm font-medium'>
                  Show more
                  </Link>
                </div>
              </div>

              {/* Who to Follow */}
              <div className='bg-gray-50 dark:bg-black rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm'>
                <div className='p-4 border-b border-gray-200 dark:border-gray-700'>
                  <h2 className='text-xl font-bold text-gray-900 dark:text-white'>Who to follow</h2>
                </div>
                <div className='p-4 space-y-4'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-3'>
                      <div className='w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold'>
                        JD
                      </div>
                      <div>
                        <p className='font-bold text-gray-900 dark:text-white text-sm'>John Doe</p>
                        <p className='text-gray-500 dark:text-gray-400 text-sm'>@johndoe</p>
                      </div>
                    </div>
                    <button className='cursor-pointer bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-full text-sm font-bold hover:opacity-80 transition-opacity'>
                      Follow
                    </button>
                  </div>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-3'>
                      <div className='w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold'>
                        JS
                      </div>
                      <div>
                        <p className='font-bold text-gray-900 dark:text-white text-sm'>Jane Smith</p>
                        <p className='text-gray-500 dark:text-gray-400 text-sm'>@janesmith</p>
                      </div>
                    </div>
                    <button className='cursor-pointer bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-full text-sm font-bold hover:opacity-80 transition-opacity'>
                      Follow
                    </button>
                  </div>
                </div>
                <div className='p-4 border-t border-gray-200 dark:border-gray-700'>
                  <button className='cursor-pointer text-blue-500 hover:text-blue-600 text-sm font-medium'>
                    Show more
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      { OpenProfileEditor && (
        <ProfileEditor credentials={UserInfo} closePop={() => { setOpenProfileEditor(false) }}/>
      )}
      { OpenReportPop && (
        <ReportPop closeReportModal={() => { setOpenReportPop(false) }} username={UserInfo.username} />
      )}
      { showBlockPop && (
        <BlockUser closeBlockPop={() => { setshowBlockPop(false) }} username={UserInfo.username} updateblockState={() => { setIsBlocked(true) }} />
      )}
    </div>
  );
}