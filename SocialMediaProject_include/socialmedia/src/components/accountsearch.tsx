"use client";
import React,{ useState , useEffect } from 'react';
import Usercard, { userCardProp } from './usercard';
import { SearchIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '@/lib/interceptor';

interface AccountSearchProps {
  onSelect: (handle: string) => void;
  placeholder?: string;
  handle:string
}

const sampleAcc: userCardProp[] = [
  {
    decodedHandle: "alice",
    name: "Alice Johnson",
    content: "Software Engineer at TechCorp",
    IsFollowing: false,
    account: {
      name: "Alice Johnson",
      handle: "@alice",
      bio: "Passionate about coding and coffee.",
      location: { text: "New York, NY", coordinates: [40.7128, -74.0060] },
      website: "https://alice.dev",
      joinDate: "January 2020",
      following: "150",
      followers: "500",
      Posts: "45",
      isCompleted: true,
      isVerified: false,
      bannerUrl: "/images/default-banner.jpg",
      avatarUrl: "/images/default-profile-pic.png"
    }
  },
  {
    decodedHandle: "bob",
    name: "Bob Smith",
    content: "Designer and Illustrator",
    IsFollowing: true,
    account: {
      name: "Bob Smith",
      handle: "@bob",
      bio: "Creating visual stories one pixel at a time.",
      location: { text: "Los Angeles, CA", coordinates: [34.0522, -118.2437] },
      website: "https://bobdesigns.com",
      joinDate: "March 2018",
      following: "200",
      followers: "1200",
      Posts: "78",
      isCompleted: true,
      isVerified: true,
      bannerUrl: "/images/default-banner.jpg",
      avatarUrl: "/images/default-profile-pic.png"
    }
  },
  {
    decodedHandle: "charlie",
    name: "Charlie Brown",
    content: "Data Scientist",
    IsFollowing: false,
    account: {
      name: "Charlie Brown",
      handle: "@charlie",
      bio: "Turning data into insights.",
      location: { text: "Chicago, IL", coordinates: [41.8781, -87.6298] },
      website: "https://charliedata.com",
      joinDate: "July 2019",
      following: "80",
      followers: "300",
      Posts: "32",
      isCompleted: false,
      isVerified: false,
      bannerUrl: "/images/default-banner.jpg",
      avatarUrl: "/images/default-profile-pic.png"
    }
  },
  {
    decodedHandle: "diana",
    name: "Diana Prince",
    content: "Marketing Specialist",
    IsFollowing: true,
    account: {
      name: "Diana Prince",
      handle: "@diana",
      bio: "Building brands and communities.",
      location: { text: "Seattle, WA", coordinates: [47.6062, -122.3321] },
      website: "https://dianamarketing.com",
      joinDate: "September 2021",
      following: "120",
      followers: "800",
      Posts: "56",
      isCompleted: true,
      isVerified: true,
      bannerUrl: "/images/default-banner.jpg",
      avatarUrl: "/images/default-profile-pic.png"
    }
  },
  {
    decodedHandle: "eve",
    name: "Eve Adams",
    content: "Product Manager",
    IsFollowing: false,
    account: {
      name: "Eve Adams",
      handle: "@eve",
      bio: "Bridging the gap between users and technology.",
      location: { text: "Austin, TX", coordinates: [30.2672, -97.7431] },
      website: "https://eveproducts.com",
      joinDate: "April 2017",
      following: "250",
      followers: "1500",
      Posts: "90",
      isCompleted: true,
      isVerified: false,
      bannerUrl: "/images/default-banner.jpg",
      avatarUrl: "/images/default-profile-pic.png"
    }
  },
  {
    decodedHandle: "frank",
    name: "Frank Miller",
    content: "UX Researcher",
    IsFollowing: true,
    account: {
      name: "Frank Miller",
      handle: "@frank",
      bio: "Understanding user behavior to create better experiences.",
      location: { text: "Boston, MA", coordinates: [42.3601, -71.0589] },
      website: "https://frankux.com",
      joinDate: "November 2016",
      following: "180",
      followers: "950",
      Posts: "67",
      isCompleted: true,
      isVerified: true,
      bannerUrl: "/images/default-banner.jpg",
      avatarUrl: "/images/default-profile-pic.png"
    }
  },
  {
    decodedHandle: "grace",
    name: "Grace Lee",
    content: "Full Stack Developer",
    IsFollowing: false,
    account: {
      name: "Grace Lee",
      handle: "@grace",
      bio: "Coding from frontend to backend.",
      location: { text: "San Francisco, CA", coordinates: [37.7749, -122.4194] },
      website: "https://gracecode.com",
      joinDate: "February 2022",
      following: "90",
      followers: "400",
      Posts: "28",
      isCompleted: false,
      isVerified: false,
      bannerUrl: "/images/default-banner.jpg",
      avatarUrl: "/images/default-profile-pic.png"
    }
  },
  {
    decodedHandle: "henry",
    name: "Henry Wilson",
    content: "DevOps Engineer",
    IsFollowing: true,
    account: {
      name: "Henry Wilson",
      handle: "@henry",
      bio: "Automating deployments and scaling systems.",
      location: { text: "Denver, CO", coordinates: [39.7392, -104.9903] },
      website: "https://henrydevops.com",
      joinDate: "June 2015",
      following: "300",
      followers: "2000",
      Posts: "120",
      isCompleted: true,
      isVerified: true,
      bannerUrl: "/images/default-banner.jpg",
      avatarUrl: "/images/default-profile-pic.png"
    }
  },
  {
    decodedHandle: "ivy",
    name: "Ivy Chen",
    content: "AI Researcher",
    IsFollowing: false,
    account: {
      name: "Ivy Chen",
      handle: "@ivy",
      bio: "Exploring the frontiers of artificial intelligence.",
      location: { text: "Palo Alto, CA", coordinates: [37.4419, -122.1430] },
      website: "https://ivyai.com",
      joinDate: "May 2019",
      following: "110",
      followers: "600",
      Posts: "40",
      isCompleted: true,
      isVerified: false,
      bannerUrl: "/images/default-banner.jpg",
      avatarUrl: "/images/default-profile-pic.png"
    }
  },
  {
    decodedHandle: "jack",
    name: "Jack Taylor",
    content: "Cybersecurity Expert",
    IsFollowing: true,
    account: {
      name: "Jack Taylor",
      handle: "@jack",
      bio: "Keeping the digital world secure.",
      location: { text: "Washington, DC", coordinates: [38.9072, -77.0369] },
      website: "https://jacksecurity.com",
      joinDate: "August 2014",
      following: "350",
      followers: "1800",
      Posts: "95",
      isCompleted: true,
      isVerified: true,
      bannerUrl: "/images/default-banner.jpg",
      avatarUrl: "/images/default-profile-pic.png"
    }
  }
]

export default function AccountSearch({ onSelect, placeholder = "Search accounts...", handle }: AccountSearchProps) {
  const [searchValue, setsearchValue] = useState<string>('') ; // storing search text...

  const [originalFollowings, setOriginalFollowings] = useState<userCardProp[]>(sampleAcc);
  const [searchedAccounts,setsearchedAccounts] = useState<userCardProp[]>(sampleAcc);

  // useffect for getting all the followings...
  async function apiForAllFollowings() {
    try {
      const followingapi = await axiosInstance.get(`/api/follows?handle=${handle}`) ;
      if (followingapi.status === 200) {
        setsearchedAccounts(followingapi.data.followings);
        setOriginalFollowings(followingapi.data.followings);
      }
    } catch (error) {
      console.log('An Error occured :',error);
    }
  }
  useEffect(() => {
   //  apiForAllFollowings() ;
  }, [])
   
  // useeffect for handling
  useEffect(() => {
    if(!searchValue.trim()){
      setsearchedAccounts(originalFollowings); // resetting to original followings...
      return; 
    }
    async function getTheSearchedAccount(searchtext:string) {
      try {
        const searchapi = await axiosInstance.get(`/api/user?search=${searchtext}`);
        if (searchapi.status === 200) {
          setsearchedAccounts(searchapi.data.searchedAcc) ; // updating the searched accounts state..
        }
      } catch (error) {
        console.log('An Error occured :',error);
      }
    }

    const delayDebounce = setTimeout(() => {
      getTheSearchedAccount(searchValue) ;
    }, 300 );

    // cleanup previous timer on second update...
    return () => {
      clearTimeout(delayDebounce);
    }
  }, [searchValue, originalFollowings])
   

  return (
    <div className="w-[400px] max-w-xl min-h-[400px] mx-auto flex flex-col gap-2 p-3 bg-white dark:bg-black rounded-xl">
      {/* Search Input */}
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => { setsearchValue(e.target.value)}}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 text-sm outline-none border-none rounded-t-lg bg-white dark:bg-black text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
        />
      </div>

      {/* Results */}
      <AnimatePresence>
        {searchedAccounts && searchedAccounts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-black rounded-b-lg max-h-96 overflow-y-auto overflow-x-hidden"
          >
            {searchedAccounts.map((account, index) => (
              <motion.div
                key={account.decodedHandle || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="cursor-pointer rounded-lg hover:bg-gray-50 dark:hover:bg-gray-950 transition-colors duration-150"
                onClick={() => onSelect(account.decodedHandle || '')}
              >
                <Usercard
                  decodedHandle={account.decodedHandle || ''}
                  name={account.name || ''}
                  content={null}
                  IsFollowing={account.IsFollowing}
                  account={account.account}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      {!searchValue.trim() && searchedAccounts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col h-full w-full items-center justify-center py-8 text-gray-500 dark:text-gray-400"
        >
          <div className="bg-yellow-100 dark:bg-gray-950 rounded-full p-4 mb-4">
            <SearchIcon className="w-12 h-12 text-yellow-400 dark:text-yellow-500" />
          </div>
          <h2 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300">Search for Accounts</h2>
          <p className="text-center text-sm max-w-xs">Type a <b>name</b> or <b>@handle</b> to tagg several accounts on the platform.</p>
        </motion.div>
      )}
    </div>
  );
}
