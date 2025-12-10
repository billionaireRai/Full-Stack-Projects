'use client'
import Link from 'next/link';
import Image from 'next/image';
import React, { useState, useRef } from 'react'
import AccountDetailPop from './accountdetailpop';

interface userInfoType {
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

export interface userCardProp {
  decodedHandle?:string | null ;
  name?:string | null;
  content?:string | null ;
  IsFollowing?:boolean
  heading?:React.ReactElement;
  user?: userInfoType;
}

const User : userInfoType = {
  name: "Alex Rivera",
  handle: "@alexrivera",
  bio: "Tech enthusiast | Coffee lover | Building the future one line at a time",
  location: "San Francisco, CA",
  website: "https://alexrivera.dev",
  joinDate: "March 2019",
  following: "342",
  followers: "1,247",
  Posts: "89",
  isVerified: true,
  coverImage: "https://img.freepik.com/premium-photo/wide-banner-with-many-random-square-hexagons-charcoal-dark-black-color_105589-1820.jpg",
  avatar: "/images/myProfile.jpg"
}

export default function usercard({ decodedHandle = '@jhondoe',name='Jhon Doe' ,IsFollowing=false,content='CS Grad ‘25 | MERN • GenAI • SD • Web3 • DSA | Code Coffee Commits, Deadlifts & Deployments' , heading, user = User}:userCardProp) {
  const [isFollowing, setisFollowing] = useState<boolean>(IsFollowing);
  const [showAccountPopup, setShowAccountPopup] = useState<boolean>(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const avatarRef = useRef<HTMLImageElement>(null);

  // functions handling acccount details pop...
  const handleAvatarHover = () => {
    if (avatarRef.current && user) {
      const rect = avatarRef.current.getBoundingClientRect();
      setPopupPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX + rect.width / 2
      });
      setShowAccountPopup(true);
    }
  };

  const handleAvatarLeave = () => {
    setShowAccountPopup(false);
  };

  return (
  <div className="shadow-sm hover:shadow-md transition-shadow duration-300 dark:shadow-gray-900 dark:bg-black dark:text-white rounded-xl p-4 w-full mb-1 flex flex-col gap-3">
        {heading}
             {/* Profile section */}
             <div className="flex items-start gap-2 rounded-lg p-2 transition-colors">
               {/* Profile Image */}
               <Link href={`/${decodedHandle}`}>
                 <img
                   ref={avatarRef}
                   src={user?.avatar || "/images/myProfile.jpg"}
                   alt="profile"
                   className="w-12 h-12 rounded-full object-cover border border-gray-700 cursor-pointer"
                   onMouseEnter={handleAvatarHover}
                   onMouseLeave={handleAvatarLeave}
                 />
               </Link>

               {/* User Info */}
               <div className="flex flex-col justify-center flex-1 gap-1">
                 <div className="flex items-center gap-1">
                   <Link href={`/${decodedHandle}`} className="font-semibold">{name || 'Kr$na'}</Link>
                   <Image src='/images/yellow-tick.png' width={18} height={18} alt='subscribed-user'/>
                 </div>
                   <Link href={`/${decodedHandle}`} className="text-gray-600 w-fit text-xs">{decodedHandle}</Link>
                 <p className="text-xs w-full text-gray-500 mt-1">
                   {content ? content : ''}
                 </p>
               </div>

               {/* Follow button */}
               <div
               onClick={() => { setisFollowing(!isFollowing) }}
               className={`text-sm font-semibold px-4 py-2
               ${isFollowing
               ? 'bg-transparent border border-gray-300 dark:border-gray-600 dark:bg-gray-950 dark:text-blue-500 hover:bg-yellow-100        dark:hover:bg-gray-950 hover:text-yellow-400 dark:hover:text-blue-700 cursor-pointer'
               : 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 cursor-pointer'
               } rounded-full transition`}>
                 { isFollowing ? 'Following' : 'Follow' }
               </div>
             </div>

             {/* Account Detail Popup */}
             {user && (
               <AccountDetailPop
                 user={{
                   name: user.name,
                   handle: user.handle?.substring(1) || 'default',
                   avatar: user.avatar,
                   bio: user.bio,
                   joined: user.joinDate,
                   following: parseInt(user.following || '0'),
                   followers: parseInt(user.followers || '0'),
                   cover: user.coverImage
                 }}
                 visible={showAccountPopup}
                 onOpen={() => setShowAccountPopup(true)}
                 onClose={() => setShowAccountPopup(false)}
                 position={popupPosition}
               />
             )}
           </div>
  )
}

