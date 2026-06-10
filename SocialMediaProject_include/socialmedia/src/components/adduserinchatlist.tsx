'use client'

import React, { useEffect, useMemo, useState } from 'react'
import UserCard, { userCardProp } from './usercard'
import { SearchIcon, X, UserPlus, LucideMessageCircleWarning, MessageCircleMoreIcon } from 'lucide-react'

import toast from 'react-hot-toast'
import axiosInstance from '@/lib/interceptor'



interface addUserInListPop {
  closePop?: () => void
  onAddChat?: (acc: userCardProp) => void
}

export default function AddAccinchatlist({ closePop, onAddChat }: addUserInListPop) {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [loadingAcc, setloadingAcc] = useState<boolean>(false);
  const [selectedAcc, setSelectedAcc] = useState<userCardProp>();
  const [Accounts, setAccounts] = useState<userCardProp[]>([])

  useEffect(() => {
    const mockAccs: userCardProp[] = [
    {
    id:'g3irf3rem3',
    decodedHandle: "@alice",
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
      plan:'Free',
      bannerUrl: "/images/default-banner.jpg",
      avatarUrl: "/images/default-profile-pic.png"
    }
  },
  {
    id:'npn249giekdf3',
    decodedHandle: "@bob",
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
      plan:'Pro',
      bannerUrl: "/images/default-banner.jpg",
      avatarUrl: "/images/default-profile-pic.png"
    }
  },
  {
    id:'291f0n4t4bnb03',
    decodedHandle: "@charliebrown",
    name: "Charlie Brown",
    content: "Data Scientist",
    IsFollowing: false,
    account: {
      name: "Charlie Brown",
      handle: "@charliebrown",
      bio: "Turning data into insights.",
      location: { text: "Chicago, IL", coordinates: [41.8781, -87.6298] },
      website: "https://charliedata.com",
      joinDate: "July 2019",
      following: "80",
      followers: "300",
      Posts: "32",
      isCompleted: false,
      isVerified: false,
      plan:'Free',
      bannerUrl: "/images/default-banner.jpg",
      avatarUrl: "/images/default-profile-pic.png"
    }
  },
  {
    id:'pak9i;gr393rm3r',
    decodedHandle: "@diana",
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
      plan:'Creator',
      bannerUrl: "/images/default-banner.jpg",
      avatarUrl: "/images/default-profile-pic.png"
    }
  },
  {
    id:'f03ngrtjnbb94',
    decodedHandle: "@eve",
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
      plan:'Free',
      bannerUrl: "/images/default-banner.jpg",
      avatarUrl: "/images/default-profile-pic.png"
    }
  },
  {
    id:'0nns0u40hf2fj4-',
    decodedHandle: "@frank",
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
      plan:'Pro',
      bannerUrl: "/images/default-banner.jpg",
      avatarUrl: "/images/default-profile-pic.png"
    }
  },
  {
    id:'k0qnkwmodfibnu5',
    decodedHandle: "@grace",
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
      plan:'Free',
      bannerUrl: "/images/default-banner.jpg",
      avatarUrl: "/images/default-profile-pic.png"
    }
  },
  {
    id:'0j42nkv9h5g5f',
    decodedHandle: "@henry",
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
      plan:'Pro',
      bannerUrl: "/images/default-banner.jpg",
      avatarUrl: "/images/default-profile-pic.png"
    }
  },
  {
    id:'0k4mpgbmn0n4r',
    decodedHandle: "@ivy",
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
      plan:'Free',
      bannerUrl: "/images/default-banner.jpg",
      avatarUrl: "/images/default-profile-pic.png"
    }
  },
  {
    id:'krg30jr9gj3lmd',
    decodedHandle: "@jack",
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
      plan:'Pro',
      bannerUrl: "/images/default-banner.jpg",
      avatarUrl: "/images/default-profile-pic.png"
    }
  }
    ]
    setAccounts(mockAccs)
  }, [])

  const handleAddAcc = async () => {
    try {
      const newChatapi = await axiosInstance.post('/api/account/conversations',{ selectedAcc });
      if (selectedAcc && onAddChat && newChatapi.status === 200) {
      if (selectedAcc && onAddChat) {
        onAddChat(selectedAcc)
        return ;
      }
      toast.error(<>Error occured in adding <b className='mx-1'>{selectedAcc.decodedHandle}</b></>)
    }
    } catch (error) {
      toast.error("An error occured !!");
    }
  }

  // useeffect for handling account fetching..
  useEffect(() => {
    async function getTheSearchedAccount(searchtext:string) {
      setloadingAcc(true);
      try {
        const searchapi = await axiosInstance.get(`/api/account?search=${searchtext}`);
        if (searchapi.status === 200) {
          setAccounts(searchapi.data.searchedAcc) ; // updating the searched accounts state..
          setloadingAcc(false);
        }
      } catch (error) {
        setloadingAcc(false);
        console.log('An Error occured :',error);
      } finally {
        setloadingAcc(false);
      }
    }

    const delayDebounce = setTimeout(() => {
      // getTheSearchedAccount(searchQuery) ;
    }, 300 );

    // cleanup previous timer on second update...
    return () => {
      clearTimeout(delayDebounce);
    }
  }, [searchQuery])

  return (
   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in-0 zoom-in-95 duration-200">
      <div className="w-full h-full max-w-xl max-h-fit rounded-xl border border-gray-200 dark:border-gray-900 bg-white/95 dark:bg-black/95 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-900">
         <div className='flex items-center justify-start gap-1'>
          <MessageCircleMoreIcon size={25} />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Select an account to add...
          </h2>
         </div>
          <button
            onClick={closePop}
            className="p-2 cursor-pointer rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-950 transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b rounded-lg border-gray-200 dark:border-gray-900">
          <div className="relative">
            <SearchIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="@accounthandle..."
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 placeholder-gray-600 dark:placeholder-gray-400 outline-none border border-transparent focus:border-yellow-400 focus:ring-3 focus:ring-yellow-400/30 transition duration-300"
              autoFocus
            />
          </div>
        </div>

        {/* List */}
        <div className="max-h-3/5 overflow-y-auto">
          {loadingAcc ? (
            <div className="flex items-center justify-center m-4 rounded-lg gap-2 h-40 text-gray-600 dark:text-gray-400 font-medium">
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="h-7 w-7 rounded-full border-3 border-yellow-400/60 border-t-yellow-400 animate-spin" />
                <p className="text-sm text-gray-600 dark:text-gray-300">Fetching accounts...</p>
              </div>
            </div>
          ) : Accounts.length > 0 ? (
            <div className="p-4 flex flex-col items-center justify-center">
              {Accounts.map((Acc,index) => {
                const isSelected = selectedAcc?.id === Acc?.id // for checking selected state...
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedAcc(Acc)}
                    className={`cursor-pointer w-full text-left flex items-center gap-3 px-4 py-2 rounded-lg transition-colors outline-none ring-0 hover:bg-gray-50 dark:hover:bg-black ${
                      isSelected ? 'bg-yellow-50 dark:bg-yellow-950/10 ring-1 ring-yellow-400/50' : ''
                    }`}
                  >
                    <UserCard
                      key={Acc.id}
                      id={Acc.id}
                      decodedHandle={Acc.decodedHandle}
                      name={Acc.name}
                      content={null}
                      IsFollowing={Acc.IsFollowing}
                      account={Acc.account}
                    />
                    {isSelected && (
                      <span className="shrink-0 w-6 h-6 rounded-full bg-yellow-400/90 text-black dark:text-white flex items-center justify-center">
                        ✓
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center m-4 rounded-lg gap-2 h-40 text-gray-600 dark:text-gray-400 font-medium">
              <LucideMessageCircleWarning size={25} />
              <span>No accounts found {searchQuery.trim() && <b>"{searchQuery}"</b>}</span>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="px-4 py-3 border-t rounded-lg border-gray-200 dark:border-gray-900">
          <button
            type="button"
            onClick={() => { handleAddAcc() }}
            disabled={!selectedAcc}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ring-1 ring-yellow-400/50 bg-yellow-400 text-black hover:bg-yellow-500 dark:hover:bg-yellow-500 dark:bg-yellow-400 dark:text-black`}
          >
            <UserPlus size={18} />
            {selectedAcc ? <span>Add <b>{selectedAcc.decodedHandle}</b> to chat</span> : 'Select an Account to add'}
          </button>
        </div>
      </div>
    </div>
  )
}


