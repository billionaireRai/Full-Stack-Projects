'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
// import useUnreadMessage from '@/app/states/unreadmessage';
import useNotificationValue from '@/app/states/globalnotifications'; 
import useActiveAccount from '@/app/states/useraccounts';
import useUserInfo from '@/app/states/userinfo';
import useCreatePost from '@/app/states/createpost'
import useSwitchAccount from '@/app/states/swithaccount'
import { usePathname } from 'next/navigation'
import { handleLogoutAccountLogic } from '@/lib/logout';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import { useTheme } from 'next-themes'
import {
  HomeIcon,
  SearchIcon,
  MoreHorizontalIcon,
  BellIcon,
  MessageCircleIcon,
  UserPlusIcon,
  UserIcon,
  BookmarkIcon,
  DollarSignIcon,
  SettingsIcon,
  LogOutIcon,
  Sun,
  Moon,
  LayoutDashboard,
} from 'lucide-react'

export default function SideNavbar() {
  const { setCreatePop } = useCreatePost()
  const { User } = useUserInfo();
  const { Account } = useActiveAccount();
  const { value } = useNotificationValue() ;
  const [DotClick, setDotClick] = useState<boolean>(false)
  const { setisPopOpen } = useSwitchAccount() ; // initializing the switchaccount state...
  const [isOpen, setIsOpen] = useState<boolean>(true)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const isDark = theme === 'dark'
  const [mounted, setMounted] = useState<boolean>(false)

  const shouldShowSidebar =
    !pathname.startsWith('/auth/') && pathname !== '/' && !pathname.endsWith('/create-account') ;

  // auto-collapse sidebar on small screens...
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setIsOpen(false)
      else setIsOpen(true)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Close dropdown when clicking outside...
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        DotClick &&
        !(event.target as Element).closest('.dropdown-container')
      ) {
        setDotClick(false)
      }
    }

    if (DotClick) {
      document.addEventListener('click', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [DotClick])

  // Set mounted to true after component mounts
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      {/* Sidebar */}
      {shouldShowSidebar && (
        <aside
          className={`fixed top-0 left-0 h-screen z-40 font-poppins border-r transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          w-72 bg-white dark:bg-black rounded-md`}
        >
          <div className="flex flex-col h-full p-3">
            <div className='flex flex-row items-center justify-between'>
            {/* Logo */}
            <Tooltip>
              <Link
                href="/"
                className="flex w-fit rounded-full items-center justify-start mb-4"
              >
                <TooltipTrigger>
                  <img
                    className="rounded-full cursor-pointer dark:invert"
                    width={90}
                    height={45}
                    src={`/images/letter-B.png`}
                    alt="logo"
                  />
                </TooltipTrigger>
              </Link>
              <TooltipContent>Briezl.com</TooltipContent>
            </Tooltip>
          {mounted && (
          <div className="themetoggler border-none flex items-center justify-end">
            <div
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="relative group"
            >
              <Tooltip>
                <TooltipTrigger>
                  <div className="p-3 m-2 rounded-full bg-white shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 ease-in-out ring-2 ring-transparent">
                    <div className={`transition-transform duration-500 ${isDark ? 'rotate-180' : 'rotate-0'}`}>
                      {isDark ? <Sun size={20} className="text-black cursor-pointer" /> : <Moon size={20} className="text-black cursor-pointer" />}
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Switch to {isDark ? 'Light' : 'Dark'} Mode</p>
                </TooltipContent>
              </Tooltip>
              <div className="absolute inset-0 rounded-full bg-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-300 border border-gray-300 dark:border-gray-600"></div>
            </div>
          </div>
        )}
        </div>
            {/* Nav Links */}
            <nav className="flex-1">
              <ul className="flex flex-col">
                <Link
                  className={`${
                    pathname === `/@${Account.decodedHandle}/feed`
                      ? 'text-white rounded-md bg-gray-50 dark:bg-gray-950'
                      : ''
                  }`}
                  href={`/@${Account.decodedHandle}/feed`}
                >
                  <NavItem icon={<HomeIcon className={`${pathname === `/@${Account.decodedHandle}/feed` ? 'fill-black dark:fill-white' : ''}`} />} label="Feed" />
                </Link>
                <Link
                  className={`${
                    pathname === '/explore'
                      ? 'text-white rounded-md bg-gray-50 dark:bg-gray-950'
                      : ''
                  }`}
                  href="/explore"
                >
                  <NavItem icon={<SearchIcon className={`${pathname === '/explore' ? 'fill-black dark:fill-white' : ''}`} />} label="Explore" />
                </Link>
                <Link
                  className={`${
                    pathname === `/@${Account.decodedHandle}/notifications`
                      ? 'text-white rounded-md bg-gray-50 dark:bg-gray-950'
                      : ''
                  }`}
                  href={`/@${Account.decodedHandle}/notifications`}
                >
                  <NavItem icon={<BellIcon className={`${pathname === `/@${Account.decodedHandle}/notifications` ? 'fill-black dark:fill-white' : ''}`} />} label="Notifications" />
                  { value !== 0 && (
                  <span className='px-2 rounded-full text-black dark:text-white bg-yellow-400 dark:bg-blue-500'>{value}</span>
                  )}
                </Link>
                <Link
                  className={`${
                    pathname === `/@${Account.decodedHandle}/messages`
                      ? 'text-white rounded-md bg-gray-50 dark:bg-gray-950'
                      : ''
                  } flex items-center gap-2`}
                  href={`/@${Account.decodedHandle}/messages`}
                >
                  <NavItem icon={<MessageCircleIcon className={`${pathname === '/username/messages' ? 'fill-black dark:fill-white' : ''}`} />} label="Messages" />
                </Link>
                <Link
                  className={`${
                    pathname === '/subscription'
                      ? 'text-white rounded-md bg-gray-50 dark:bg-gray-950'
                      : ''
                  }`}
                  href="/subscription"
                >
                  <NavItem icon={<UserPlusIcon className={`${pathname === '/subscription' ? 'fill-black dark:fill-white' : ''}`} />} label="Subscription" />
                </Link>
                <Link
                  className={`${
                    pathname === `/@${Account.decodedHandle}`
                      ? 'text-white rounded-md bg-gray-50 dark:bg-gray-950'
                      : ''
                  }`}
                  href={`/@${Account.decodedHandle}`}
                >
                  <NavItem icon={<UserIcon className={`${pathname === `/@${Account.decodedHandle}` ? 'fill-black dark:fill-white' : ''}`} />} label="Profile" />
                </Link>
                <Link
                  className={`${
                    pathname === `/@${Account.decodedHandle}/user-analytics`
                      ? 'text-white rounded-md bg-gray-50 dark:bg-gray-950'
                      : ''
                  }`}
                  href={`/@${Account.decodedHandle}/user-analytics`}
                >
                  <NavItem icon={<LayoutDashboard className={`${pathname === '/username/user-analytics' ? 'fill-black dark:fill-white' : ''}`} />} label="Dashboard" />
                </Link>
                <Link
                  className={`${
                    pathname === `/@${Account.decodedHandle}/bookmarked`
                      ? 'text-white rounded-md bg-gray-50 dark:bg-gray-950'
                      : ''
                  }`}
                  href={`/@${Account.decodedHandle}/bookmarked`}
                >
                  <NavItem icon={<BookmarkIcon className={`${pathname === `/@${Account.decodedHandle}/bookmarked` ? 'fill-black dark:fill-white' : ''}`} />} label="Bookmarked" />
                </Link>
                <Link
                  className={`${
                    pathname === '/monetization'
                      ? 'text-white rounded-md bg-gray-50 dark:bg-gray-950'
                      : ''
                  }`}
                  href="/monetization"
                >
                  <NavItem
                    icon={<DollarSignIcon className={`${pathname === '/monetization' ? 'fill-black dark:fill-white' : ''}`} />}
                    label="Monetization"
                  />
                </Link>
                <Link
                  className={`${
                    pathname === `/@${Account.decodedHandle}/settings/account`
                      ? 'text-white rounded-md bg-gray-50 dark:bg-gray-950'
                      : ''
                  }`}
                  href={`/@${Account.decodedHandle}/settings/account`}
                >
                  <NavItem
                    icon={<SettingsIcon className={`${pathname === `/@${Account.decodedHandle}/settings/account` ? 'fill-black dark:fill-white' : ''}`} />}
                    label="Settings & Privacy"
                  />
                </Link>
              </ul>
            </nav>

            {/* Bottom Section */}
            <div className="mt-2">
              {/* Post Button */}
              <button
                onClick={() => { setCreatePop(true) }}
                className="w-full p-3 cursor-pointer rounded-full shadow-md hover:shadow-lg dark:shadow-gray-700 dark:hover:shadow-gray-900 dark:text-white bg-yellow-400 active:bg-yellow-500 text-black font-bold hover:scale-105 transition-transform duration-150"
              >
                CREATE POST
              </button>

              {/* Profile dropdown trigger */}
              <div className="dropdown-container flex items-center relative gap-2 my-4 py-2 px-4 rounded-full hover:bg-yellow-100 dark:hover:bg-black">
                <Image
                  src={Account.account?.avatarUrl || '/images/default-profile-pic.png'}
                  height={40}
                  width={40}
                  alt="profile"
                  className="rounded-full w-13 h-13"
                />
                <Link
                  href={`/@${Account.decodedHandle}`}
                >
                  <span className="flex items-center font-medium text-gray-900 dark:text-gray-100 gap-1">
                    {Account.name?.toUpperCase()}
                    <Image
                      src="/images/yellow-tick.png"
                      width={18}
                      height={18}
                      alt="blue-tick"
                    />
                  </span>
                  <span className="text-gray-700 dark:text-gray-400 text-xs font-semibold">
                    @{Account.decodedHandle}
                  </span>
                </Link>
                <MoreHorizontalIcon
                  onClick={() => {
                    setDotClick(!DotClick)
                  }}
                  className={`ml-auto cursor-pointer rounded-full p-1 w-7 h-7 text-gray-600 dark:text-gray-300 ${
                    DotClick ? 'bg-gray-200 dark:bg-gray-950' : ''
                  }`}
                />
              </div>
              

              {/* Dropdown */}
              {DotClick && (
                <div className="absolute left-0 bottom-0 sm:left-72 sm:bottom-10 w-70 mt-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg shadow-xl z-[60] dark:shadow-gray-950">
                  <div className="p-2 font-medium">
                    <Link  
                     href={`/@${Account.decodedHandle}/create-account?userId=${User.userId}`}
                     className="w-full rounded-md cursor-pointer text-left px-4 py-2 text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-950 transition-colors flex items-center gap-3">
                      <UserPlusIcon className="w-5 h-5" />
                      <span>Add new account</span>
                    </Link>
                    <button
                    onClick={() => { setDotClick(false); setisPopOpen(true) }}
                    className={`w-full rounded-md cursor-pointer text-left px-4 py-3 text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-950 transition-colors flex items-center gap-3`}>
                      <UserIcon className="w-5 h-5" />
                      <span>Switch another account</span>
                    </button>
                    <button
                     onClick={() => { handleLogoutAccountLogic(String(Account?.decodedHandle)) }}
                     className="w-full rounded-md cursor-pointer text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/40 transition-colors flex items-center gap-3">
                      <LogOutIcon className="w-5 h-5" />
                      <div className='flex flex-row items-center gap-1'>
                        <span>Logout</span><b>@{Account.decodedHandle}</b>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>

      )}

      {/* Hamburger Button */}
      <Tooltip>
        <TooltipTrigger>
          {shouldShowSidebar && (
            <div
              onClick={() => setIsOpen(!isOpen)}
              className="fixed top-4 cursor-e-resize left-4 z-50 p-2 rounded-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-md transition-all duration-300 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden"
            >
              <Image
                src="/svg/hamburger.svg"
                width={24}
                height={24}
                alt="menu"
                className="invert-0 dark:invert"
              />
            </div>
          )}
        </TooltipTrigger>
        <TooltipContent>Open side bar</TooltipContent>
      </Tooltip>
    </>
  )
}

function NavItem({
  icon,
  label,
}: {
  icon: React.ReactNode
  label: string
}) {
  // const { unreadMessage } = useUnreadMessage() ; // getting the state...
  return (
    <li className="flex items-center group w-full dark:text-white gap-3 p-3 rounded-md text-black hover:bg-gray-100 dark:hover:bg-gray-950 cursor-pointer transition-all">
      <span className="w-5 h-5 group-hover:fill-black">{icon}</span>
      <span className="font-medium">{label}</span>
       {/* { unreadMessage !== 0 && label ==='Messages' && (
          <span className='px-2 rounded-full text-black dark:text-white bg-yellow-400 dark:bg-blue-500'>{unreadMessage}</span>
       )} */}
    </li>
  )
}
