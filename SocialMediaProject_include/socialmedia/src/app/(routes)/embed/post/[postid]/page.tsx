'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import PostCard, { PostCardProps } from '@/components/postcard';
import { useParams , useRouter } from 'next/navigation';
import axiosInstance from '@/lib/interceptor';
import { Inbox, AlertCircle, RefreshCw, Loader2 } from 'lucide-react';


interface MediaType {
  url: string;
  media_type: string;
}

// function returning default data...
const getDefaultPostData = (postId: string): PostCardProps => ({
  postId,
  content:
    'This post is currently unavailable. It may have been deleted or set to private.',
  timestamp: '10 March, 2025',
  reposts: 10,
  replies: 21,
  likes: 223,
  views: 9000,
  media: [],
  hashTags: [],
  mentions: [],
  isPinned: false,
  isHighlighted: false,
  userliked: false,
  usereposted: false,
  usercommented: false,
  userbookmarked: false,
  username: 'Amritansh Rai',
  readOnly:true,
  handle: 'amritanshrai',
  avatar: '/images/default-profile-pic.png',
  isVerified: true,
});


// fetching paticular post details...
const fetchPostData = async (postId: string): Promise<PostCardProps> => {
  try {
    const res = await axiosInstance.get(`/api/post?postid=${postId}`);
    if (res.status === 200 && res.data?.post) {
      return res.data.post;
    }
  } catch (err) {
    console.error('Post fetch failed:', err);
  }

  return getDefaultPostData(postId);
};


// loader animation
const SkeletonEmbed = () => (
  <div className="w-1/2 h-full rounded-xl border border-gray-200 dark:border-gray-800 p-4 animate-pulse">
    <div className="flex gap-3 mb-3">
      <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700" />
      <div className="flex flex-col gap-2">
        <div className="h-3 w-24 bg-gray-300 dark:bg-gray-700 rounded" />
        <div className="h-2 w-16 bg-gray-300 dark:bg-gray-700 rounded" />
      </div>
    </div>
    <div className="h-3 w-full bg-gray-300 dark:bg-gray-700 rounded mb-2" />
    <div className="h-3 w-5/6 bg-gray-300 dark:bg-gray-700 rounded" />
  </div>
);


export default function EmbedPostPage() {
  const params = useParams();
  const router = useRouter() ;
  const postId = params?.postid as string;

  const [post, setPost] = useState<PostCardProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [SmallView, setSmallView] = useState<boolean>(false);
  const [failed, setFailed] = useState<boolean>(false);


  useEffect(() => {
    if (!postId) {
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      setFailed(false);

      const data = await fetchPostData(postId);

      if (!data) {
        setFailed(true);
      }

      setPost(data);
      setLoading(false);
    };
    setSmallView(true) ; // setting to small preview...
    load();
  }, [postId]);



if (!postId) {
  return (
    <div className="w-full h-[200px] flex flex-col items-center justify-center gap-2 text-gray-500">
      <Inbox className="w-6 h-6 text-gray-400" />
      <p className="text-sm">Post not found</p>
    </div>
  );
}


if (loading) {
  return (
    <div className="w-full h-[240px] flex flex-col items-center justify-center gap-3">
      <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      <p className="text-sm text-gray-500">Loading post…</p>
      <div className="w-full h-full flex items-center justify-center">
        <SkeletonEmbed />
      </div>
    </div>
  );
}


if (failed || !post) {
  return (
    <div className="w-full h-[240px] flex flex-col items-center justify-center text-center gap-3">
      <AlertCircle className="w-7 h-7 text-gray-400" />

      <div className="space-y-1">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
          Unable to load post
        </p>
        <p className="text-xs text-gray-500">
          The post may be private, deleted, or temporarily unavailable.
        </p>
      </div>

      <button
        onClick={() => router.refresh()}
        className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 transition"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        Retry
      </button>
    </div>
  );
}



  return (
    <div
      className={`
        w-full h-full flex flex-col gap-3 items-center justify-center rounded-lg mx-auto p-2 bg-white dark:bg-black
      `}
    >
      <div className={`${SmallView ? 'w-full' : 'w-3/4'} h-fit rounded-lg`}> 
        {/* will make widht w-3/4 on page load */}
        <PostCard {...post} readOnly={true} />
      </div>

    {/* ACTIONS */}
    <button
       onClick={() => router.push(`/post/${post.postId}`)}
       className="
         text-md cursor-pointer text-black font-semibold w-1/2
        border-none outline-none rounded-md px-4 py-1.5 bg-yellow-400 hover:bg-yellow-500 hover-bg-yellow-400 transition
       "
     >
       View full post
     </button>

     <div className="text-xs flex items-center gap-1 text-gray-400 mt-2">
       <span>Embedded from</span>
       <Link
         href="http://localhost:3000/"
         className="font-medium text-gray-700 dark:text-gray-200 hover:underline"
       >
         Briezl
       </Link>
     </div>
    </div>
  );
}
