'use client'

import React,{ useState , useEffect, useCallback } from 'react'
import Image from 'next/image';
import Link from 'next/link';
import Activebeep from '@/components/activebeep';
import { handleScrollToTop } from '@/lib/windowtopscroll'
import { ArrowBigUpIcon , CommandIcon, MoreVertical, ThumbsUp, Users, MessagesSquare, Filter } from 'lucide-react';
import { useRouter , useParams } from 'next/navigation';
import Usercard, { userCardProp } from '@/components/usercard'
import useActiveAccount from '@/app/states/useraccounts';
import { motion, AnimatePresence } from 'framer-motion';
import { PostCardProps } from '@/components/postcard';
import PostCard from '@/components/postcard';
import axiosInstance from '@/lib/interceptor';

export default function MutualAccounts () {
    const router = useRouter() ;
    const { username } = useParams() ;
    const { Account } = useActiveAccount() ;
    const pagesize:number = 10 ;
    const autoHeightGap:number = 200 ;
    const [Page, setPage] = useState<number>(1) ;
    const [HasMore, setHasMore] = useState<boolean>(true);
    const [ShowLess, setShowLess] = useState<boolean>(false);
    const [suggesstionNum, setsuggesstionNum] = useState<number>(3);
    // state for the filter popup...
    const [showFilters, setShowFilters] = useState<boolean>(false);
    type FilterCategory = 'all' | 'mutualaccounts' | 'mutuallikes' | 'commoninterests' | 'commonreplies';
    const [ActiveFilter, setActiveFilter] = useState<FilterCategory>('all');

    const FilterOptions: { value: FilterCategory; label: string; icon: typeof Users }[] = [
      { value: 'all', label: 'All content', icon: Users },
      { value: 'mutualaccounts', label: 'Mutual accounts', icon: Users },
      { value: 'mutuallikes', label: 'Mutual likes', icon: ThumbsUp },
      { value: 'commoninterests', label: 'Common interests', icon: CommandIcon },
      { value: 'commonreplies', label: 'Common replies', icon: MessagesSquare },
    ];
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
              coordinates: [40.7128, -74.0060] as [number, number]
            },
            website: 'https://alice-dev.com',
            joinDate: '2020-05-15',
            following: '234',
            followers: '1.2k',
            Posts: '456',
            isCompleted:true,
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
              coordinates: [34.0522, -118.2437] as [number, number]
            },
            website: 'https://bob-designs.com',
            joinDate: '2019-08-22',
            following: '567',
            followers: '3.4k',
            Posts: '789',
            isCompleted:true,
            isVerified: false,
            plan:'Free',
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
              coordinates: [30.2672, -97.7431] as [number, number]
            },
            website: 'https://charlie-writes.com',
            joinDate: '2018-11-10',
            following: '123',
            followers: '5.6k',
            Posts: '1,234',
            isCompleted:true,
            isVerified: true,
            plan:'Pro',
            bannerUrl: '/images/default-banner.jpg',
            avatarUrl: '/images/default-profile-pic.png'
          }
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
              coordinates: [47.6062, -122.3321] as [number, number]
            },
            website: 'https://diana-startup.com',
            joinDate: '2021-02-28',
            following: '345',
            followers: '890',
            Posts: '234',
            isCompleted:true,
            isVerified: false,
            plan:'Free',
            bannerUrl: '/images/default-banner.jpg',
            avatarUrl: '/images/default-profile-pic.png'
          }
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
              coordinates: [39.7392, -104.9903] as [number, number]
            },
            website: 'https://eve-photography.com',
            joinDate: '2017-07-04',
            following: '678',
            followers: '7.8k',
            Posts: '2,345',
            isCompleted:true,
            isVerified: true,
            plan:'Pro',
            bannerUrl: '/images/default-banner.jpg',
            avatarUrl: '/images/default-profile-pic.png'
          }
        }
      ])
      const [mutualAccs, setmutualAccs] = useState<userCardProp[]>([
        {
          decodedHandle: '@alex_mutual',
          name: 'Alex Mutual',
          IsFollowing: false,
          account: {
            name: 'Alex Mutual',
            handle: '@alex_mutual',
            bio: 'Full-stack developer | Open source contributor | Coffee enthusiast',
            location: {
              text: 'San Francisco, CA',
              coordinates: [37.7749, -122.4194] as [number, number]
            },
            website: 'https://alex-mutual.dev',
            joinDate: '2019-03-15',
            following: '450',
            followers: '2.3k',
            Posts: '892',
            isCompleted: true,
            isVerified: true,
            plan: 'Pro',
            bannerUrl: '/images/default-banner.jpg',
            avatarUrl: '/images/default-profile-pic.png'
          }
        },
        {
          decodedHandle: '@sarah_dev',
          name: 'Sarah Developer',
          IsFollowing: true,
          account: {
            name: 'Sarah Developer',
            handle: '@sarah_dev',
            bio: 'Backend engineer | Python | Kubernetes | Cloud architecture',
            location: {
              text: 'Boston, MA',
              coordinates: [42.3601, -71.0589] as [number, number]
            },
            website: 'https://sarah-dev.io',
            joinDate: '2020-07-22',
            following: '312',
            followers: '4.1k',
            Posts: '567',
            isCompleted: true,
            isVerified: false,
            plan: 'Free',
            bannerUrl: '/images/default-banner.jpg',
            avatarUrl: '/images/default-profile-pic.png'
          }
        },
        {
          decodedHandle: '@mike_codes',
          name: 'Mike Codes',
          IsFollowing: false,
          account: {
            name: 'Mike Codes',
            handle: '@mike_codes',
            bio: 'JavaScript developer | React & Node.js | Tech blogger',
            location: {
              text: 'Chicago, IL',
              coordinates: [41.8781, -87.6298] as [number, number]
            },
            website: 'https://mike-codes.com',
            joinDate: '2018-11-08',
            following: '678',
            followers: '5.9k',
            Posts: '1,234',
            isCompleted: true,
            isVerified: true,
            plan: 'Pro',
            bannerUrl: '/images/default-banner.jpg',
            avatarUrl: '/images/default-profile-pic.png'
          }
        },
        {
          decodedHandle: '@emma_data',
          name: 'Emma Data',
          IsFollowing: true,
          account: {
            name: 'Emma Data',
            handle: '@emma_data',
            bio: 'Data scientist | ML enthusiast | Python | TensorFlow',
            location: {
              text: 'Seattle, WA',
              coordinates: [47.6062, -122.3321] as [number, number]
            },
            website: 'https://emma-data.tech',
            joinDate: '2021-01-10',
            following: '234',
            followers: '1.8k',
            Posts: '345',
            isCompleted: true,
            isVerified: false,
            plan: 'Free',
            bannerUrl: '/images/default-banner.jpg',
            avatarUrl: '/images/default-profile-pic.png'
          }
        },
        {
          decodedHandle: '@james_cloud',
          name: 'James Cloud',
          IsFollowing: false,
          account: {
            name: 'James Cloud',
            handle: '@james_cloud',
            bio: 'Cloud solutions architect | AWS certified | Serverless expert',
            location: {
              text: 'Austin, TX',
              coordinates: [30.2672, -97.7431] as [number, number]
            },
            website: 'https://james-cloud.dev',
            joinDate: '2019-06-20',
            following: '521',
            followers: '3.7k',
            Posts: '789',
            isCompleted: true,
            isVerified: true,
            plan: 'Pro',
            bannerUrl: '/images/default-banner.jpg',
            avatarUrl: '/images/default-profile-pic.png'
          }
        }
      ])
    
      const [MutualLikedPosts, setMutualLikedPosts] = useState<PostCardProps[]>([
        {
          postId: 'post_001_mutual',
          avatar: '/images/default-profile-pic.png',
          cover: '/images/default-banner.jpg',
          username: 'Alex Mutual',
          handle: '@alex_mutual',
          bio: 'Full-stack developer | Open source contributor | Coffee enthusiast',
          userliked: true,
          usereposted: false,
          usercommented: true,
          userbookmarked: false,
          isPinned: false,
          isVerified: true,
          plan: 'Pro',
          followers: '2.3k',
          following: '450',
          timestamp: 'Jan 15, 2025',
          content: 'Just pushed a new update to my open source library! Check it out and let me know what you think. #opensource #dev',
          media: [
            { url: '/images/broken-laptop.jpg', media_type: 'image' }
          ],
          likes: 234,
          reposts: 45,
          replies: 67,
          shares: 12,
          views: 1523,
          taggedLocation: [
            { text: 'San Francisco, CA', coordinates: [37.7749, -122.4194] }
          ],
          poll: undefined,
          hashTags: ['opensource', 'dev'],
          mentions: ['sarah_dev'],
          showActions: true,
          isHighlighted: false,
          isFollowing: false,
          readOnly: false,
          fromPage: 'feed'
        },
        {
          postId: 'post_002_mutual',
          avatar: '/images/default-profile-pic.png',
          cover: '/images/default-banner.jpg',
          username: 'Sarah Developer',
          handle: '@sarah_dev',
          bio: 'Backend engineer | Python | Kubernetes | Cloud architecture',
          userliked: true,
          usereposted: true,
          usercommented: false,
          userbookmarked: true,
          isPinned: false,
          isVerified: false,
          plan: 'Free',
          followers: '4.1k',
          following: '312',
          timestamp: 'Jan 14, 2025',
          content: 'Deployed a new microservices architecture using Kubernetes. Feeling exhausted but accomplished! #k8s #cloud',
          media: [],
          likes: 189,
          reposts: 78,
          replies: 34,
          shares: 23,
          views: 2341,
          taggedLocation: [
            { text: 'Boston, MA', coordinates: [42.3601, -71.0589] }
          ],
          poll: {
            question: 'Which cloud provider do you prefer?',
            options: [
              { text: 'AWS', votes: 145 },
              { text: 'GCP', votes: 89 },
              { text: 'Azure', votes: 67 },
              { text: 'Other', votes: 23 }
            ],
            duration: 24
          },
          hashTags: ['k8s', 'cloud'],
          mentions: [],
          showActions: true,
          isHighlighted: true,
          isFollowing: true,
          readOnly: false,
          fromPage: 'feed'
        }
      ])

      const [commonInterestPost, setCommonInterestPost] = useState<PostCardProps[]>([
        {
          postId: 'post_001_common',
          avatar: '/images/default-profile-pic.png',
          cover: '/images/default-banner.jpg',
          username: 'John Developer',
          handle: '@john_dev',
          bio: 'Full-stack developer | React & Node.js | Open source enthusiast',
          userliked: true,
          usereposted: false,
          usercommented: true,
          userbookmarked: false,
          isPinned: false,
          isVerified: true,
          plan: 'Pro',
          followers: '3.2k',
          following: '521',
          timestamp: 'Jan 16, 2025',
          content: 'Excited to share my new React tutorial series! Building modern web apps has never been easier. #react #webdev',
          media: [
            { url: '/images/broken-laptop.jpg', media_type: 'image' }
          ],
          likes: 456,
          reposts: 89,
          replies: 123,
          shares: 34,
          views: 3456,
          taggedLocation: [
            { text: 'New York, NY', coordinates: [40.7128, -74.0060] }
          ],
          poll: undefined,
          hashTags: ['react', 'webdev'],
          mentions: ['alice_dev'],
          showActions: true,
          isHighlighted: false,
          isFollowing: true,
          readOnly: false,
          fromPage: 'feed'
        },
        {
          postId: 'post_002_common',
          avatar: '/images/default-profile-pic.png',
          cover: '/images/default-banner.jpg',
          username: 'Lisa Designer',
          handle: '@lisa_design',
          bio: 'UI/UX Designer | Figma | Creating beautiful experiences',
          userliked: false,
          usereposted: true,
          usercommented: true,
          userbookmarked: true,
          isPinned: false,
          isVerified: true,
          plan: 'Pro',
          followers: '5.7k',
          following: '234',
          timestamp: 'Jan 15, 2025',
          content: 'Just finished a new design system for our team. Consistency is key in good UI! #design #ux',
          media: [],
          likes: 321,
          reposts: 56,
          replies: 45,
          shares: 12,
          views: 2134,
          taggedLocation: [
            { text: 'Los Angeles, CA', coordinates: [34.0522, -118.2437] }
          ],
          poll: undefined,
          hashTags: ['design', 'ux'],
          mentions: [],
          showActions: true,
          isHighlighted: true,
          isFollowing: true,
          readOnly: false,
          fromPage: 'feed'
        },
        {
          postId: 'post_003_common',
          avatar: '/images/default-profile-pic.png',
          cover: '/images/default-banner.jpg',
          username: 'Mike Tech',
          handle: '@mike_tech',
          bio: 'DevOps Engineer | CI/CD | AWS | Docker',
          userliked: true,
          usereposted: false,
          usercommented: false,
          userbookmarked: false,
          isPinned: false,
          isVerified: false,
          plan: 'Free',
          followers: '2.1k',
          following: '345',
          timestamp: 'Jan 14, 2025',
          content: 'Automating deployment pipelines has saved us so much time. DevOps is the future! #devops #automation',
          media: [
            { url: '/images/broken-laptop.jpg', media_type: 'image' }
          ],
          likes: 178,
          reposts: 34,
          replies: 23,
          shares: 8,
          views: 1234,
          taggedLocation: [
            { text: 'Seattle, WA', coordinates: [47.6062, -122.3321] }
          ],
          poll: undefined,
          hashTags: ['devops', 'automation'],
          mentions: [],
          showActions: true,
          isHighlighted: false,
          isFollowing: false,
          readOnly: false,
          fromPage: 'feed'
        },
        {
          postId: 'post_004_common',
          avatar: '/images/default-profile-pic.png',
          cover: '/images/default-banner.jpg',
          username: 'Emma Writer',
          handle: '@emma_writer',
          bio: 'Tech Writer | Documentation | API Guides',
          userliked: false,
          usereposted: true,
          usercommented: true,
          userbookmarked: true,
          isPinned: true,
          isVerified: true,
          plan: 'Pro',
          followers: '4.5k',
          following: '123',
          timestamp: 'Jan 13, 2025',
          content: 'New blog post coming soon! Topic: How to write clean REST APIs. Stay tuned! #api #coding',
          media: [],
          likes: 267,
          reposts: 78,
          replies: 56,
          shares: 19,
          views: 2876,
          taggedLocation: [
            { text: 'Austin, TX', coordinates: [30.2672, -97.7431] }
          ],
          poll: undefined,
          hashTags: ['api', 'coding'],
          mentions: [],
          showActions: true,
          isHighlighted: true,
          isFollowing: true,
          readOnly: false,
          fromPage: 'feed'
        },
        {
          postId: 'post_005_common',
          avatar: '/images/default-profile-pic.png',
          cover: '/images/default-banner.jpg',
          username: 'Chris Cloud',
          handle: '@chris_cloud',
          bio: 'Cloud Architect | Serverless | AWS Lambda | Kubernetes',
          userliked: true,
          usereposted: false,
          usercommented: false,
          userbookmarked: false,
          isPinned: false,
          isVerified: true,
          plan: 'Pro',
          followers: '6.8k',
          following: '456',
          timestamp: 'Jan 12, 2025',
          content: 'Serverless architecture is game changing! Reduced costs by 60% in our latest project. #serverless #aws',
          media: [
            { url: '/images/broken-laptop.jpg', media_type: 'image' }
          ],
          likes: 445,
          reposts: 123,
          replies: 89,
          shares: 45,
          views: 4567,
          taggedLocation: [
            { text: 'San Francisco, CA', coordinates: [37.7749, -122.4194] }
          ],
          poll: undefined,
          hashTags: ['serverless', 'aws'],
          mentions: [],
          showActions: true,
          isHighlighted: false,
          isFollowing: true,
          readOnly: false,
          fromPage: 'feed'
        }
      ])

      const [commonReplyPost, setCommonReplyPost] = useState<PostCardProps[]>([
        {
          postId: 'post_001_reply',
          avatar: '/images/default-profile-pic.png',
          cover: '/images/default-banner.jpg',
          username: 'Nina React',
          handle: '@nina_react',
          bio: 'React developer | Frontend enthusiast | Sharing tips & tricks',
          userliked: true,
          usereposted: false,
          usercommented: true,
          userbookmarked: false,
          isPinned: false,
          isVerified: true,
          plan: 'Pro',
          followers: '3.9k',
          following: '312',
          timestamp: 'Jan 16, 2025',
          content: 'Great discussion! I totally agree — using hooks properly changed the way I structure my React components. #react #development',
          media: [
            { url: '/images/broken-laptop.jpg', media_type: 'image' }
          ],
          likes: 342,
          reposts: 54,
          replies: 89,
          shares: 21,
          views: 2345,
          taggedLocation: [
            { text: 'New York, NY', coordinates: [40.7128, -74.0060] }
          ],
          poll: undefined,
          hashTags: ['react', 'development'],
          mentions: ['john_dev'],
          showActions: true,
          isHighlighted: false,
          isFollowing: true,
          readOnly: false,
          fromPage: 'feed'
        },
        {
          postId: 'post_002_reply',
          avatar: '/images/default-profile-pic.png',
          cover: '/images/default-banner.jpg',
          username: 'Omar Backend',
          handle: '@omar_backend',
          bio: 'Backend engineer | Node.js | REST & GraphQL APIs',
          userliked: false,
          usereposted: true,
          usercommented: true,
          userbookmarked: true,
          isPinned: false,
          isVerified: false,
          plan: 'Free',
          followers: '2.4k',
          following: '456',
          timestamp: 'Jan 15, 2025',
          content: 'Completely agree with the points raised here. A well-designed API is half the battle won. #backend #api',
          media: [],
          likes: 278,
          reposts: 67,
          replies: 54,
          shares: 15,
          views: 1890,
          taggedLocation: [
            { text: 'Austin, TX', coordinates: [30.2672, -97.7431] }
          ],
          poll: undefined,
          hashTags: ['backend', 'api'],
          mentions: ['emma_writer'],
          showActions: true,
          isHighlighted: true,
          isFollowing: true,
          readOnly: false,
          fromPage: 'feed'
        },
        {
          postId: 'post_003_reply',
          avatar: '/images/default-profile-pic.png',
          cover: '/images/default-banner.jpg',
          username: 'Priya Design',
          handle: '@priya_design',
          bio: 'Product designer | UX researcher | Design systems',
          userliked: true,
          usereposted: false,
          usercommented: true,
          userbookmarked: false,
          isPinned: true,
          isVerified: true,
          plan: 'Pro',
          followers: '6.1k',
          following: '234',
          timestamp: 'Jan 14, 2025',
          content: 'This is such a thoughtful take! Good UX truly begins with understanding the user, not just the interface. #ux #design',
          media: [
            { url: '/images/broken-laptop.jpg', media_type: 'image' }
          ],
          likes: 512,
          reposts: 98,
          replies: 134,
          shares: 42,
          views: 3678,
          taggedLocation: [
            { text: 'Los Angeles, CA', coordinates: [34.0522, -118.2437] }
          ],
          poll: undefined,
          hashTags: ['ux', 'design'],
          mentions: ['lisa_design'],
          showActions: true,
          isHighlighted: true,
          isFollowing: false,
          readOnly: false,
          fromPage: 'feed'
        },
        {
          postId: 'post_004_reply',
          avatar: '/images/default-profile-pic.png',
          cover: '/images/default-banner.jpg',
          username: 'Dev Cloud',
          handle: '@dev_cloud',
          bio: 'Cloud engineer | DevOps | Automation advocate',
          userliked: false,
          usereposted: true,
          usercommented: true,
          userbookmarked: true,
          isPinned: false,
          isVerified: true,
          plan: 'Pro',
          followers: '4.8k',
          following: '345',
          timestamp: 'Jan 13, 2025',
          content: 'Could not have said it better myself. Automating these workflows is exactly what our team needed. #devops #automation',
          media: [],
          likes: 387,
          reposts: 112,
          replies: 76,
          shares: 28,
          views: 2987,
          taggedLocation: [
            { text: 'Seattle, WA', coordinates: [47.6062, -122.3321] }
          ],
          poll: undefined,
          hashTags: ['devops', 'automation'],
          mentions: ['mike_tech','cris_cloud'],
          showActions: true,
          isHighlighted: false,
          isFollowing: true,
          readOnly: false,
          fromPage: 'feed'
        },
        {
          postId: 'post_005_reply',
          avatar: '/images/default-profile-pic.png',
          cover: '/images/default-banner.jpg',
          username: 'Sofia Test',
          handle: '@sofia_test',
          bio: 'QA engineer | Testing advocate | Quality first',
          userliked: true,
          usereposted: false,
          usercommented: true,
          userbookmarked: false,
          isPinned: false,
          isVerified: false,
          plan: 'Free',
          followers: '1.9k',
          following: '289',
          timestamp: 'Jan 12, 2025',
          content: 'Great points! Testing early in the pipeline really reduces issues later. Quality is everyone-s responsibility. #testing #qa',
          media: [
            { url: '/images/broken-laptop.jpg', media_type: 'image' }
          ],
          likes: 196,
          reposts: 23,
          replies: 41,
          shares: 9,
          views: 1245,
          taggedLocation: [
            { text: 'Chicago, IL', coordinates: [41.8781, -87.6298] }
          ],
          poll: undefined,
          hashTags: ['testing', 'qa'],
          mentions: [],
          showActions: true,
          isHighlighted: false,
          isFollowing: true,
          readOnly: false,
          fromPage: 'feed'
        }
      ])

  // close the filter popup when clicking outside...
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showFilters && !(event.target as Element).closest('.filter-popup-container')) {
        setShowFilters(false)
      }
    }
    if (showFilters) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showFilters])

  // function for showing more suggestions...
  const handleSuggesstionShow = () => {
     if (ShowLess) {
      setsuggesstionNum(3);
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
  
  // function for fetching data....
  const getMutualData = useCallback( async() => {
    try {
      const mutualApi = await axiosInstance.post('/api/account/mutual',{ targetHandle:username , fromHandle:Account.decodedHandle });
      if (mutualApi.status === 200) {
        setFollowSuggesstions(mutualApi.data.suggesstions);
        setmutualAccs(mutualApi.data.mutuals);
        setMutualLikedPosts(mutualApi.data.likes);
      }
    } catch (error) {
      console.log(error);
    }
  },[Account.decodedHandle,username])

  useEffect(() => {
    getMutualData() ;
  }, [username,Account.decodedHandle,getMutualData])

  // function to get mutual interested post...
  const getMutualInterestPost = useCallback( async() => {
    try {
      const interestApi = await axiosInstance.get(`/api/account/mutual?targetHandle=${username}&fromHandle=${Account.decodedHandle}&page=${Page}&size=${pagesize}`);
      if (interestApi.status === 200) {
        setCommonInterestPost(interestApi.data.interestedPost);
        setHasMore(interestApi.data.hasMore);
      }
    } catch (error) {
      console.log(error);
    }
  },[Account.decodedHandle,Page,username])

  useEffect(() => {
    if (((window.innerHeight - window.scrollY) <= autoHeightGap ) && HasMore) {
      setPage(Page + 1);
      getMutualInterestPost(); // getting explore posts...
     }
  }, [HasMore,getMutualInterestPost,Page]) ;
  

  return (
  <div id='accounts' className='h-full overflow-y-scroll flex flex-col gap-2 md:flex-row font-poppins rounded-md p-2 dark:bg-black'>
      {/* main section of content... */}
      <div className='flex-1 flex-col gap-4 overflow-y-auto items-center rounded-md'>
        <div className="flex items-center justify-between p-4 gap-1 border-b border-gray-300 backdrop:blur-md rounded-md">
        <div className='flex items-center gap-1'>
         <button 
            onClick={() => { router.back() }}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-950 cursor-pointer rounded-full transition-colors">
            <Image src='/images/up-arrow.png' width={30} height={30} alt='back-arrow' className='-rotate-90 dark:invert' />
         </button>
         <div className="flex flex-col gap-1.5 p-2 rounded-md">
             <Link className='font-semibold text-xl w-fit'  href={`/${Account.decodedHandle}`}>{Account.decodedHandle}</Link>
             <p className="text-xs text-gray-500 dark:text-gray-400">
               having {4} Mutual accounts with <Link className='font-semibold' href={`/${decodeURIComponent(String(username))}`} >{decodeURIComponent(String(username))}</Link>
             </p>
         </div>
        </div>
        {/* Filter controllers */}
        <div className='relative border border-gray-300 flex flec-row gap-1.5 rounded-full cursor-pointer'>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className='rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-950 transition-colors cursor-pointer'
            aria-label="Filter content"
          >
            <MoreVertical size={15} />
          </button>
          <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -8 }}
              transition={{ duration: 0.15 }}
              className='filter-popup-container absolute -top-1 -right-1 z-50 w-60 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl dark:shadow-gray-950 p-2'
            >
              <div className='px-2 py-1 flex flex-row gap-3 items-center border-b border-gray-100 dark:border-gray-800'>
                <Filter size={25} />
                <div>
                 <p className='text-sm font-semibold text-gray-900 dark:text-white'>Filter content</p>
                 <p className='text-xs text-gray-500 dark:text-gray-400'>Choose a category to display</p>
                </div>
              </div>
              <div className='flex flex-col gap-0.5 py-1'>
                {FilterOptions.map((option) => {
                  const Icon = option.icon;
                  const isActive = ActiveFilter === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() => { setActiveFilter(option.value); setShowFilters(false); }}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-yellow-100 dark:bg-gray-800 text-yellow-600 dark:text-blue-300 font-medium'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <Icon size={16} />
                      <span className='flex-1'>{option.label}</span>
                      { isActive && ( <Activebeep /> ) }
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
          </AnimatePresence>
        </div>
        </div>
        <div className='p-1 flex flex-col gap-2 rounded-md'>
          {(ActiveFilter === 'all' || ActiveFilter === 'mutualaccounts') && (
          <div className='p-4'>
            {mutualAccs.length > 0 ? mutualAccs.map((usercard,index) => (index+1) <= suggesstionNum && (
              <div key={index + 1} className='flex items-center justify-between'>
               <Usercard content={null} decodedHandle={usercard.decodedHandle} name={usercard.name} IsFollowing={usercard.IsFollowing}
               account={usercard.account} />
              </div>
             )) : (
              <div className='flex flex-col items-center justify-center p-8 text-center gap-2'>
                <Users size={40} className='text-gray-300 dark:text-gray-600' />
                <p className='text-gray-500 dark:text-gray-400 text-sm'>No mutual accounts found</p>
                <p className='text-gray-400 dark:text-gray-500 text-xs'>{Account.decodedHandle} and {decodeURIComponent(String(username))} don&apos;t follow any of the same accounts yet.</p>
              </div>
)
            }
          </div>
          )}
          {(ActiveFilter === 'all' || ActiveFilter === 'mutuallikes') && (
          Array.isArray(MutualLikedPosts) && MutualLikedPosts.length > 0 ? (
          <div>
            <div className='flex flex-row items-center p-4 rounded-md gap-3'>
              <div className='flex items-center justify-center'><CommandIcon /><ThumbsUp size={10}/></div>
              <div className='flex flex-col gap-1 rounded-md'>
                <span className='font-semibold'>Mutuals likes</span>
                <p className="text-xs text-gray-500 dark:text-gray-400">Posts liked by you both.</p>
              </div>
            </div>
            <div className='flex flex-col gap-2'>
              {MutualLikedPosts.map((post, index) => (
                <PostCard key={index} {...post} />
              ))}
            </div>
          </div>
          ) : (
            <div className='flex flex-col items-center justify-center p-8 text-center gap-2 mt-4'>
              <ThumbsUp size={40} className='text-gray-300 dark:text-gray-600' />
              <p className='text-gray-500 dark:text-gray-400 text-sm'>No mutual likes yet</p>
              <p className='text-gray-400 dark:text-gray-500 text-xs'>{Account.decodedHandle} and {decodeURIComponent(String(username))} haven&apos;t liked any of the same posts yet.</p>
            </div>
          ))}
          {(ActiveFilter === 'all' || ActiveFilter === 'commoninterests') && (
          <>
          {Array.isArray(commonInterestPost) && commonInterestPost.length > 0 ? (
          <div>
            <div className='flex flex-row items-center p-4 rounded-md gap-3'>
              <div className='flex items-center justify-center'><CommandIcon /><ThumbsUp size={10}/></div>
              <div className='flex flex-col gap-1 rounded-md'>
                <span className='font-semibold'>Common Interests</span>
                <p className="text-xs text-gray-500 dark:text-gray-400">Posts bought from common interested of you both.</p>
              </div>
            </div>
            <div className='flex flex-col gap-2'>
              {commonInterestPost.map((post, index) => (
                <PostCard key={index} {...post} />
              ))}
            </div>
          </div>
          ) : (
            <div className='flex flex-col items-center justify-center p-8 text-center gap-2 mt-4'>
              <ThumbsUp size={40} className='text-gray-300 dark:text-gray-600' />
              <p className='text-gray-500 dark:text-gray-400 text-sm'>No common interest posts yet</p>
              <p className='text-gray-400 dark:text-gray-500 text-xs'>Check back later for posts you both might like.</p>
            </div>
          )}
          </>
          )}
          {(ActiveFilter === 'all' || ActiveFilter === 'commonreplies') && (
          <>
          {Array.isArray(commonReplyPost) && commonReplyPost.length > 0 ? (
          <div>
            <div className='flex flex-row items-center p-4 rounded-md gap-3'>
              <div className='flex items-center justify-center'><CommandIcon /><MessagesSquare size={10}/></div>
              <div className='flex flex-col gap-1 rounded-md'>
                <span className='font-semibold'>Common Replies</span>
                <p className="text-xs text-gray-500 dark:text-gray-400">Posts you both have replied on.</p>
              </div>
            </div>
            <div className='flex flex-col gap-2'>
              {commonReplyPost.map((post, index) => (
                <PostCard key={index} {...post} />
              ))}
            </div>
          </div>
          ) : (
            <div className='flex flex-col items-center justify-center p-8 text-center gap-2 mt-4'>
              <MessagesSquare size={40} className='text-gray-300 dark:text-gray-600' />
              <p className='text-gray-500 dark:text-gray-400 text-sm'>No common replies yet</p>
              <p className='text-gray-400 dark:text-gray-500 text-xs'>Check back later for posts you both have replied on.</p>
            </div>
          )}
          </>
          )}
        </div>
      </div>
      {/* suggesstions card on right... */}
      <div className='space-y-1 overflow-y-auto h-full rounded-md'>
         {/* Who to Follow */}
        <div className='relative bg-white dark:bg-black rounded-md'>
          <div className='p-4 m-2 border-b rounded-md flex gap-2 items-center border-gray-200 dark:border-gray-700'>
            <Users size={20} /><h2 className='text-xl font-bold text-gray-900 dark:text-white'>Suggestions</h2>
          </div>
          <div className='p-4'>
            {FollowSuggesstions.length > 0 ? FollowSuggesstions.map((usercard,index) => (index+1) <= suggesstionNum && (
              <div key={index + 1} className='flex items-center justify-between'>
               <Usercard content={null} decodedHandle={usercard.decodedHandle} name={usercard.name} IsFollowing={usercard.IsFollowing}
               account={usercard.account} />
              </div>)
             ) : (
              <div className='flex flex-col items-center justify-center p-8 text-center gap-2'>
                <Users size={40} className='text-gray-300 dark:text-gray-600' />
                <p className='text-gray-500 dark:text-gray-400 text-sm'>No suggestions available</p>
                <p className='text-gray-400 dark:text-gray-500 text-xs'>Check back later for new accounts to follow.</p>
              </div>
             )}
          </div>
         </div>
         <div className='p-2 m-2 rounded-md border-t border-gray-200 dark:border-gray-700'>
          <button 
               onClick={() => { handleSuggesstionShow() }}
               className='cursor-pointer hover:bg-yellow-100 dark:hover:bg-gray-950 p-2 rounded-full text-yellow-500 hover:text-yellow-600 text-sm font-medium'>
               { ShowLess ? 'Show less' : 'Show more' }
          </button>
         </div>
        <button onClick={() => { handleScrollToTop('accounts') }} className='fixed right-5 bottom-10 rounded-full p-1 hover:bg-yellow-100 dark:hover:bg-gray-950 cursor-pointer z-50'>
             <ArrowBigUpIcon width={40} height={40} stroke='5' className='fill-yellow-400'/>
        </button>
    </div>
    </div>
  )
}
