'use client'

import React,{useState , useEffect} from 'react'
import Image from 'next/image';
import Link from 'next/link';
import { useWindowWidth } from '@/app/hooks/useWindowWidth';
import { useParams , useRouter } from 'next/navigation'
import Usercard from '@/components/usercard';
import { Users, TrendingUp, Calendar, Clock, UserCheck, ThumbsUp } from 'lucide-react';


export interface userType {
  name:string ,
  handle:string ,
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

interface userCardProp {
  decodedHandle?:string | null ;
  name?:string | null;
  content?:string | null ;
  heading?:React.ReactElement;
  user?: userType;
  IsFollowing?:boolean;
}

interface navItemsType {
  navtext:string,
  icon:React.JSX.Element
}

export default function followingspage () {
  const params = useParams() ; // initializing the param hook...
  const router = useRouter() ;
  const width = useWindowWidth() ; // custom hook created to getting screen width...
  const [user, setuser] = useState<userType>({
    name:'Amritansh Rai' ,
    handle:'@amritansh_coder' ,
    bio:'' ,
    location:'',
    website:'',
    joinDate:'',
    following:'',
    followers:'',
    Posts:'',
    isVerified:true,
    coverImage:'',
    avatar:''
  })

  // array for account card details...
  const [AccountDetails, setAccountDetails] = useState<userCardProp[]>([]); // will update its value...

  // useeffect for fetching account details...
  useEffect(() => {
    // api fetching for data...

  }, [])
  

  // defining the array of navitems...
  const [navItems,setnavItems] = useState<navItemsType[]>([
    { navtext: 'All', icon: <Users size={18} /> },
    { navtext: 'Verified', icon: <Image src="/images/yellow-tick.png" width={18} height={18} alt="yellow-tick" /> },
    { navtext: 'Common', icon: <TrendingUp size={18} /> },
    { navtext: 'Oldest', icon: <Calendar size={18} /> },
    { navtext: 'Newest', icon: <Clock size={18} /> }
  ]);

  // state for current nav targeted...
  const [ActiveNavState, setActiveNavState] = useState<navItemsType>({ navtext: 'All', icon: <Users size={18} /> });
  // function for handling nav change...
  const handleActiveNavChange = (nav:navItemsType) : void => { 
    setActiveNavState(nav);
   }


  useEffect(() => {
    // api for getting user info and followings
    console.log(decodeURIComponent(String(params.username)))
    if (user.handle.includes('@amritansh_coder')) {
      const filtered = navItems.filter((item) => item.navtext !== 'Common');
      setnavItems(filtered);
    }
  }, [params])
  
  return (
    <>
     <div className='dark:bg-black rounded-md h-fit flex flex-col lg:flex-row md:ml-72 font-poppins'>
      <div className="main flex-2 rounded-md">
        <div className="flex items-center gap-4 border border-gray-300 dark:border-gray-800 dark:bg-black rounded-lg p-5 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
          <button
          onClick={() => { router.back() }}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 cursor-pointer rounded-full transition-colors duration-150">
            <Image src='/images/up-arrow.png' width={24} height={24} alt='back-arrow' className='-rotate-90 dark:invert' />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{user.name}</h1>
            <Link href={`/${user.handle}`}>
              <p className="text-sm text-gray-500 hover:bg-gray-100 hover:dark:bg-gray-950 px-2 rounded-full cursor-pointer dark:text-gray-400">
                {user.handle}
              </p>
            </Link>
          </div>
          <div className='text-xs text-gray-700 dark:text-gray-300 leading-relaxed flex-1'>
            {width > 1000 
            ? 
              'These are the accounts you follow, and their posts and updates are included while generating your personalized feed to ensure you see content you are interested in.'
            : 
              'Accounts you followed at some point in past...'
            }
          </div>
        </div>
        <div className="navigation-section m-2">
      <nav className="w-full h-auto flex flex-row items-center justify-center p-1 bg-yellow-50/70 dark:bg-black border border-yellow-400/60 dark:border-blue-500 rounded-full backdrop-blur-sm shadow-sm dark:shadow-gray-900 transition-all duration-300
        ">
        {navItems.map((item, index) => (
          <button 
            onClick={() => { handleActiveNavChange(item) }}
            key={index} 
            className={`${item.navtext === ActiveNavState.navtext ? 'bg-yellow-200 hover:bg-yellow-200 dark:bg-gray-950' : '' } cursor-pointer flex-1 px-4 py-2 flex flex-row items-center justify-center gap-2 text-gray-700 dark:text-gray-300 hover:bg-yellow-100 dark:hover:bg-gray-950 hover:shadow-sm rounded-full transition-all duration-200 font-medium hover:-translate-y-0.5
          `}>
            <span>{item.navtext}</span>
            {item.icon}
          </button>
        ))}
      </nav>
    </div>
    <div className='m-2'>
      {AccountDetails.map((account,index) => (
          <Usercard key={index} IsFollowing={true} decodedHandle={account.decodedHandle} name={account.name} content={account.content} heading={account.heading} user={account.user} />
        ))
        
      }
      <Usercard IsFollowing={true}/>
      <Usercard IsFollowing={true}/>
      <Usercard IsFollowing={true}/>
      <Usercard IsFollowing={true}/>
      <Usercard IsFollowing={true}/>
      <Usercard IsFollowing={true}/>
      <Usercard IsFollowing={true}/>
      <Usercard IsFollowing={true}/>
      <Usercard IsFollowing={true}/>
      <Usercard IsFollowing={true}/>
      <Usercard IsFollowing={true}/>
      <Usercard IsFollowing={true}/>
      <Usercard IsFollowing={true}/>
    </div>
      </div>
      <div className="follow-suggestions flex-1 rounded-md p-2">
        <div className="heading flex flex-row items-center gap-4 rounded-md font-bold p-3"><span>Accounts you may like</span><ThumbsUp size={18} fill='black' /></div>
        <div>
          <Usercard/>
          <Usercard/>
          <Usercard/>
          <Usercard/>
        </div>
      </div>
     </div>
    </>
  )
}

