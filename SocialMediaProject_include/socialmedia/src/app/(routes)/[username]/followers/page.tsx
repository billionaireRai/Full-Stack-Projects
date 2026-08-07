'use client'

import React,{ useState , useEffect , useRef, useCallback } from 'react'
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useParams , useRouter } from 'next/navigation'
import Usercard from '@/components/usercard';
import { Users, Calendar, Clock, ThumbsUp, UserIcon, ArrowLeft,CommandIcon } from 'lucide-react';
import { userCardProp } from '@/components/usercard';
import Loader from '@/components/loader';
import axiosInstance from '@/lib/interceptor';


interface navItemsType {
  navtext:string,
  icon:React.JSX.Element,
  handler:() => void 
  
}

export default function FollowersPage () {
  const params = useParams() ; // initializing the param hook...
  const router = useRouter() ; // router hook...

  const { username } = params ; // username from url parameter...

  const size:number = 15 ;
  const page = useRef<number>(1);
  const handle = decodeURIComponent(String(username));
  const [loadingAcc, setloadingAcc] = useState<boolean>(false);
  const [loadingfollowers, setloadingfollowers] = useState<boolean>(false);
  const [loadingSugg, setloadingSugg] = useState<boolean>(false);
  const [targetAcc, settargetAcc] = useState<userCardProp>({}); // target account...
  // array for account card details...
const [AccountDetails, setAccountDetails] = useState<userCardProp[]>([]); // will update its value...
  const [AccSugg, setAccSugg] = useState<userCardProp[]>([]); // 3 accounts...
  // base copy of all loaded followers, used to restore the full list when filtering/sorting...
  const baseFollowers = useRef<userCardProp[]>([]);

  // sorting functions here...

  // reshows all the loaded followers...
  const handleShowAll = () : void => {
    setAccountDetails([...baseFollowers.current]);
  }

  // filters the list to only verified followers...
  const handleVerifiedOnly = () : void => {
    setAccountDetails((prev) => prev.filter((follower) => follower.account?.isVerified));
  }

  // sorts followers from oldest to newest based on their joinDate...
  const handleOldest = () : void => {
    setAccountDetails((prev) => [...prev].sort((a, b) => {
      const aDate = new Date(a.account?.joinDate || 0).getTime();
      const bDate = new Date(b.account?.joinDate || 0).getTime();
      return aDate - bDate;
    }));
  }

  // sorts followers from newest to oldest based on their joinDate...
  const handleNewest = () : void => {
    setAccountDetails((prev) => [...prev].sort((a, b) => {
      const aDate = new Date(a.account?.joinDate || 0).getTime();
      const bDate = new Date(b.account?.joinDate || 0).getTime();
      return bDate - aDate;
    }));
  }

  // fetching mutual accounts...
  const handleMutualAccounts = () : void => {
    console.log('SHOW MUTUAL FOLLOWERS - pending backend integration');
  }
  
  // defining the array of navitems...
  const navItems : navItemsType[] = ([
    { navtext: 'All', icon: <Users size={18} /> , handler:handleShowAll },
    { navtext: 'Verified', icon: <Image src="/images/yellow-tick.png" width={18} height={18} alt="yellow-tick" /> , handler:handleVerifiedOnly },
    { navtext: 'Mutual', icon: <CommandIcon size={18} />, handler:handleMutualAccounts },
    { navtext: 'Oldest', icon: <Calendar size={18} /> , handler:handleOldest },
    { navtext: 'Newest', icon: <Clock size={18} />, handler:handleNewest }
  ]);

  // function get followers..
  const getFollowersOfAccount = useCallback( async () : Promise<void> => {
    setloadingfollowers(true)
    try {
      const followerApi = await axiosInstance.post('/api/follow/followers',{ handle , page:page.current , size });
      if (followerApi.status === 200) {
        const newFollowers = followerApi.data.followers;
        setAccountDetails((prev) => [prev,...newFollowers]);
        baseFollowers.current = [...baseFollowers.current, ...newFollowers];
        page.current += 1 ;
        setloadingfollowers(false);
      } else {
        setloadingfollowers(false);
      }
    } catch (error) {
      console.log("An error occured :",error);
      setloadingfollowers(false);
    } finally {
      setloadingfollowers(false);
    }
  },[page])
  
  
  // function get target account...
  const getTargetAccountInfo = useCallback( async () : Promise<void> => {
    setloadingAcc(true);
    try {
      const accountApi = await axiosInstance.post('/api/account',{ handle });
      if (accountApi.status === 200) {
        settargetAcc(accountApi.data.targetacc);
        setloadingAcc(false);
      } else {
        setloadingAcc(false);
      }
    } catch (error) {
      console.log("An error occured :",error);
      setloadingAcc(false);
    } finally {
      setloadingAcc(false);
    }
  },[username])

  // function to get suggestions...
  const getSuggestions = useCallback( async () : Promise<void> => {
    setloadingSugg(true);
    try {
      const suggApi = await axiosInstance.get(`/api/follow/suggestions?handle=${handle}`);
      if (suggApi.status === 200) {
        setAccSugg(suggApi.data.suggestions)
        setloadingSugg(false);
      } else {
        setloadingSugg(false);
      }
    } catch (error) {
      console.log("An error occured :",error);
      setloadingSugg(false);
    } finally {
      setloadingSugg(false);
    }
  },[username])
  
  // useeffect for fetching data...
  useEffect(() => {
    getTargetAccountInfo();
    getSuggestions();
    getFollowersOfAccount();
  }, [])


  // current nav targeted...
const [ActiveNavState, setActiveNavState] = useState<navItemsType>({ navtext: 'All', icon: <Users size={18} /> ,handler:handleShowAll });
  // function for handling nav change...
  const handleActiveNavChange = (nav:navItemsType) : void => { 
    setActiveNavState(nav);
    nav.handler();
  }
  
  
  return (
    <>
     <div className='dark:bg-black rounded-md h-screen flex flex-col lg:flex-row font-poppins'>
      <div className="main relative flex-2 rounded-md overflow-auto">
        {/* Profile header */}
        <div className="relative flex items-center gap-5 border border-gray-200 dark:border-gray-900 dark:bg-black rounded-2xl p-4 shadow-md overflow-hidden">
          {/* Back button */}
          <button
            onClick={() => { router.back() }}
            aria-label="Go back"
            className="relative p-1.5 cursor-pointer rounded-full hover:scale-105 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-900 bg-white dark:bg-gray-950">
            <ArrowLeft size={20} />
          </button>

          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-14 h-14 rounded-full">
              <img
                src={targetAcc?.account?.avatarUrl || "/images/default-profile-pic.png"}
                alt={`${targetAcc?.name || 'User'} avatar`}
                className="w-full h-full rounded-full object-cover border-2 border-white dark:border-gray-900"
              />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-yellow-500 border-2 border-white dark:border-gray-900 rounded-full" />
          </div>

          {/* Name & handle */}
          <div className="relative min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-md font-bold text-gray-900 dark:text-gray-100 truncate">
                {targetAcc?.name || 'User'}
              </h1>
              {targetAcc.account?.isVerified && (
                 <Image src='/images/yellow-tick.png' width={18} height={18} alt='yellow-tick' />
              )}
            </div>
            <Link href={`/${targetAcc?.decodedHandle}`} className="inline-flex items-center gap-1 group">
              <span className="text-sm text-gray-500 group-hover:text-yellow-500 dark:text-gray-400 transition-colors truncate font-medium">
                {targetAcc?.decodedHandle || 'username'}
              </span>
            </Link>
          </div>
          <div className="flex-1" />
          {/* Followers count badge */}
          <div className="relative flex items-center gap-2.5 rounded-xl dark:border-yellow-500/40 bg-yellow-50/80 dark:bg-yellow-500/10 px-4 py-2 shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
              <Users size={18} className="text-white" />
            </div>
            <div className="leading-tight">
              <p className="text-lg font-extrabold text-gray-900 dark:text-yellow-400 tabular-nums">
                {targetAcc.account?.followers || '0'}
              </p>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Followers
              </p>
            </div>
          </div>
        </div>
      <div className="navigation-section sticky top-0 rounded-full m-2">
      <nav className="w-full h-auto flex flex-row items-center justify-center p-1 bg-yellow-50/70 dark:bg-black border border-yellow-400/60 dark:border-yellow-500 rounded-full backdrop-blur-sm shadow-sm dark:shadow-gray-900">
        {navItems.map((item, index) => (
          <motion.button
            key={item.navtext}
            onClick={() => handleActiveNavChange(item)}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            className={`
              cursor-pointer flex-1 text-sm px-4 py-2
              flex flex-row items-center justify-center gap-2
              font-medium rounded-full
              text-gray-700 dark:text-gray-300
              ${item.navtext === ActiveNavState.navtext
                ? 'bg-yellow-200 hover:bg-yellow-200 dark:bg-yellow-500 dark:text-black'
                : 'hover:bg-yellow-100 dark:hover:bg-gray-950 hover:shadow-sm'}
            `}
          >
            <span>{item.navtext}</span>
            {item.icon}
          </motion.button>
        ))}
      </nav>
    </div>
<div className='m-2'>
     {loadingfollowers && ( <Loader loadingtext={`followers of ${handle}`}/> )}
     {!loadingfollowers && AccountDetails.length > 0 && (
        AccountDetails.map((account,index) => (
          <Usercard key={index} IsFollowing={true} decodedHandle={account.decodedHandle} name={account.name} content={account.content} heading={account.heading} />
        ))
      )}
       { !loadingfollowers && AccountDetails.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center py-12 px-4 text-center"
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-sm">
              <Users size={28} className="text-yellow-400 dark:text-yellow-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-1">
              No Followers Found
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed">
              We couldn&apos;t find any accounts in your followers at the moment. Check back later for new recommendations!
            </p>
          </motion.div>
         )}
    </div>
   </div>
      <div className="follow-suggestions flex-1 flex flex-col gap-2 rounded-md p-2 overflow-auto">
       <div className='flex flex-col justify-center h-fit rounded-lg' >
        <div className="heading flex flex-row items-center gap-4 text-lg rounded-md font-bold p-3">
          <UserIcon size={25} className='fill-black dark:fill-white' />
          <span>Target account...</span>
        </div>
        <div>
         {loadingAcc ? (
           <Loader loadingtext={`account ${handle}`} />
          ) : (
            <Usercard {...targetAcc} />
          )}
        </div>
       </div>
       <div className='flex flex-col justify-center h-fit rounded-lg'>
        <div className="heading flex flex-row items-center gap-4 text-lg rounded-md font-bold p-3">
          <ThumbsUp size={25} className='fill-black dark:fill-white' />
          <span>Might be interested in !!</span>
        </div>
<div>
         {loadingSugg && ( <Loader loadingtext='suggestions' /> )}
         { !loadingSugg && AccSugg.length > 0 && (
            AccSugg.map((account,index) => (
             <Usercard key={index} IsFollowing={true} decodedHandle={account.decodedHandle} name={account.name} content={account.content} heading={account.heading} />
            ))
         )}
         { !loadingSugg && AccSugg.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center py-12 px-4 text-center"
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-sm">
              <Users size={28} className="text-yellow-400 dark:text-yellow-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-1">
              No suggestions right now
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed">
              We couldn&apos;t find any accounts to suggest at the moment. Check back later for new recommendations!
            </p>
          </motion.div>
         )}
        </div>
       </div>
      </div>
     </div>
    </>
  )
}

