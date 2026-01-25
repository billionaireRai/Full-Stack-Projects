import React, { useState , useEffect } from 'react'
import { CheckCircleIcon, PlusCircleIcon, User2, X } from 'lucide-react'
import { userCardProp } from './usercard';
import Usercard from './usercard';
import Link from 'next/link';
import useActiveAccount from '@/app/states/useraccounts';
import useSwitchAccount from '@/app/states/swithaccount'
import useUserInfo from '@/app/states/userinfo';
import axiosInstance from '@/lib/interceptor';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function SwitchAccountPopUp () {
  const { setisPopOpen } = useSwitchAccount();
  const { Account , setAccount } = useActiveAccount() ;
  const router = useRouter() ;
  const { User } = useUserInfo() ;
  const [Accounts,setAccounts] = useState<userCardProp[]>([
    {
      decodedHandle: 'alice123',
      name: 'Alice Smith',
      IsFollowing: false,
      content: `Loves coding and coffee.\nPassionate about open-source projects.\nEnjoys hiking on weekends.`,
      account: {
        name: 'Alice Smith',
        handle: 'alice123',
        bio: `Loves coding and coffee.\nPassionate about open-source projects.\nEnjoys hiking on weekends.`,
        location: { text: 'New York, NY', coordinates: [40.7128, -74.0060] },
        website: 'https://alice.dev',
        joinDate: 'Jan 2020',
        following: '150',
        followers: '300',
        Posts: '45',
        isCompleted: true,
        isVerified: false,
        bannerUrl: '/images/default-banner.jpg',
        avatarUrl: '/images/default-profile-pic.png'
      }
    },
    {
      decodedHandle: 'bob456',
      name: 'Bob Johnson',
      IsFollowing: true,
      content: `Tech enthusiast and blogger.\nWrites about the latest in AI and machine learning.\nLoves traveling and photography.`,
      account: {
        name: 'Bob Johnson',
        handle: 'bob456',
        bio: `Tech enthusiast and blogger.\nWrites about the latest in AI and machine learning.\nLoves traveling and photography.`,
        location: { text: 'San Francisco, CA', coordinates: [37.7749, -122.4194] },
        website: 'https://bobblog.com',
        joinDate: 'Mar 2018',
        following: '200',
        followers: '500',
        Posts: '78',
        isCompleted: true,
        isVerified: true,
        bannerUrl: '/images/default-banner.jpg',
        avatarUrl: '/images/default-profile-pic.png'
      }
    },
    {
      decodedHandle: 'charlie789',
      name: 'Charlie Brown',
      IsFollowing: false,
      content: `Designer and artist.\nSpecializes in UI/UX design.\nEnjoys creating digital art in spare time.`,
      account: {
        name: 'Charlie Brown',
        handle: 'charlie789',
        bio: `Designer and artist.\nSpecializes in UI/UX design.\nEnjoys creating digital art in spare time.`,
        location: { text: 'Los Angeles, CA', coordinates: [34.0522, -118.2437] },
        website: 'https://charliedesigns.com',
        joinDate: 'Jul 2019',
        following: '120',
        followers: '250',
        Posts: '32',
        isCompleted: false,
        isVerified: false,
        bannerUrl: '/images/default-banner.jpg',
        avatarUrl: '/images/default-profile-pic.png'
      }
    },
    {
      decodedHandle: 'diana101',
      name: 'Diana Prince',
      IsFollowing: true,
      content: `Wonder woman of web dev.\nExpert in full-stack development.\nAdvocate for women in tech.`,
      account: {
        name: 'Diana Prince',
        handle: 'diana101',
        bio: `Wonder woman of web dev.\nExpert in full-stack development.\nAdvocate for women in tech.`,
        location: { text: 'Chicago, IL', coordinates: [41.8781, -87.6298] },
        website: 'https://dianaweb.dev',
        joinDate: 'Sep 2021',
        following: '180',
        followers: '400',
        Posts: '60',
        isCompleted: true,
        isVerified: true,
        bannerUrl: '/images/default-banner.jpg',
        avatarUrl: '/images/default-profile-pic.png'
      }
    },
    {
      decodedHandle: 'eve202',
      name: 'Eve Adams',
      IsFollowing: false,
      content: `Data scientist and AI researcher.\nWorks on cutting-edge machine learning projects.\nEnjoys teaching and mentoring.`,
      account: {
        name: 'Eve Adams',
        handle: 'eve202',
        bio: `Data scientist and AI researcher.\nWorks on cutting-edge machine learning projects.\nEnjoys teaching and mentoring.`,
        location: { text: 'Seattle, WA', coordinates: [47.6062, -122.3321] },
        website: 'https://eveai.com',
        joinDate: 'Nov 2017',
        following: '300',
        followers: '700',
        Posts: '100',
        isCompleted: true,
        isVerified: false,
        bannerUrl: '/images/default-banner.jpg',
        avatarUrl: '/images/default-profile-pic.png'
      }
    }
  ]) ;
  const [currentAccount, setcurrentAccount] = useState<userCardProp>(Account); // intially contains the running account....

  // getting all the accounts owner by user...
  async function functionToGetAccounts() {
    try {
      const accountapi = await axiosInstance.get(`/api/profile/${Account.decodedHandle}`);
      if (accountapi.status === 200) {
        setAccounts(accountapi.data.allAccs) ;
        console.log('All accounts fetched successfully...');
        return 'success' ;
      }
    } catch (error) {
      console.log(error);
      return error ;
    }
  }

  // useffect for running on page load...
  useEffect(() => {
     //  functionToGetAccounts() ;
  }, [])
  
  
  // function handling switching account...
  const handleSwitchAccountLogic = async (toSwitchAcc:userCardProp) => { 
    const loadingToast = toast.loading('Swithing account please wait...',{ position:'top-right' })
    try {
      const switchapi = await axiosInstance.put(`/api/profile/${Account.decodedHandle}`,{ toSwitchAcc:toSwitchAcc }) ;
      if (switchapi.status === 200) {
        toast.dismiss(loadingToast) ;
        toast.success('Account switched successfully !!', { position:'top-right' });
        setAccount(toSwitchAcc) ; // updating the active account...
        setisPopOpen(false) ; // closing the pop...
        router.refresh() ; // reloading the profile page...
      } else {
        toast.dismiss(loadingToast) ;
        toast.error('Switching failed !!', { position:'top-right' })
      }
    } catch (error) {
      toast.error('An error occured !!', { position:'top-right' })
      return error ;
    }
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-sm flex justify-center z-50 animate-in fade-in-0 zoom-in-95 duration-300">
      <div className="bg-white dark:bg-black rounded-lg p-6 h-fit max-h-[90vh] my-5 w-full max-w-xl shadow-2xl border border-gray-200 dark:border-gray-900 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 dark:bg-gray-950 rounded-full">
              <User2 className="w-6 h-6 text-yellow-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Switch To Other Accounts</h2>
          </div>
          <button
            onClick={() => setisPopOpen(false)}
            className="p-2 hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-950 rounded-full transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        <div className="text-sm flex flex-row items-center text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
          <p>Select an account you would like to switch to continue enjoying.</p>
          <Link href={`/@${Account?.decodedHandle}/create-account?userId=${User.userId}`} className='flex items-center justify-between gap-1.5 text-sm font-semibold cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-950 text-yellow-500 rounded-lg px-4 py-2'><span>New Account</span><PlusCircleIcon />
          </Link> 
        </div>
        <div className="space-y-1">
          {Accounts.map((account,index) => (
            <button 
             key={index}
             onClick={() => { setcurrentAccount(account) }}
             className={`w-full ${account === currentAccount && 'border-yellow-400' } group border-1 hover:border-yellow-400 cursor-pointer flex items-center space-x-4 p-3 rounded-xl hover:bg-yellow-50 dark:hover:bg-gray-950 dark:hover:from-gray-800 dark:hover:to-gray-700 group`}>
               <Usercard key={index} IsFollowing={account.IsFollowing} decodedHandle={account.decodedHandle} name={account.name} content={null} account={account.account} />
               <div className={`invisible text-yellow-400 group-hover:visible border border-yellow-400 ${account.decodedHandle === currentAccount?.decodedHandle && 'visible' } rounded-full`}>
                <CheckCircleIcon/>
               </div>
            </button>
          ))}
        </div>
        <button
          onClick={() => handleSwitchAccountLogic(currentAccount)}
          className="mt-6 cursor-pointer w-full bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-500 text-white py-3 px-6 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
        >
          {currentAccount ? 'Switch account' : 'Cancel'}
        </button>
      </div>
    </div>
  )
}

