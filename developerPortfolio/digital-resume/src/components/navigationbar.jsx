
'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Home, User, Code, MessageCircle, FileText, Book } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';

const navItems = [
  { label: 'Home', href: '/home', icon: <Home size={20} /> },
  { label: 'About', href: '/about', icon: <User size={20} /> },
  { label: 'Projects', href: '/projects', icon: <Code size={20} /> },
  { label: 'Contact', href: '/contact-dev', icon: <MessageCircle size={20} /> },
  { label: 'Resume', href: '/dev-resume', icon: <FileText size={20} /> },
  { label: 'Blog', href: '/tech-blog', icon: <Book size={20} /> }
];

export default function Navigationbar() {
  const [isDark, setIsDark] = useState(false);
  const [showBg, setShowBg] = useState(false);
  const currentPath = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setShowBg(latest > 5);
  });

  console.log(currentPath)
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const closeSidebar = () => setSidebarOpen(false);

  if (currentPath === '/') return <div></div>  ;  // wont gona show navbar on landing page...
  
  return (
    <div>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        className={`dark:bg-black fixed dark:shadow-gray-300 shadow-gray-400 shadow-xl dark:shadow-gray-700 dark:shadow-lg left-1/2 -translate-x-1/2 z-40 w-full p-1 rounded-xl transition-all duration-500
          ${showBg
            ? 'backdrop-blur-xl bg-white/60 dark:bg-[#0e0e0e]/50 border border-white/40 dark:border-neutral-800 ring-1 ring-white/20 dark:ring-black/30 shadow-2xl'
            : 'bg-none'
          }`}
      >
        <div className="max-w-7xl px-3 py-1 mx-auto flex items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.2 }}
            className="flex items-center gap-2 text-xl font-extrabold tracking-wide text-neutral-900 dark:text-white"
          >
            <Image 
            onClick={() =>     
            toast("Our Logo Is Being Clicked...", {
              description: new Date().toUTCString(),
              action: {
                label: 'OK' ,
                onClick: () => console.log("client has checked the toast..."),
              },
            })
          }
          className="dark:invert" width={40} height={40} alt="my-logo" src="/portfolio-logo.svg" />
            <Link className="dark:text-gray-300" href="/">dev.Amritansh</Link>
            <div className="relative w-8 h-8 flex items-center justify-center">
              {/* Outer Ping Ring */}
              <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
              {/* Subtle Glow Ring */}
              <span className="absolute inline-flex h-6 w-6 rounded-full bg-green-400 opacity-30 blur-sm" />
              {/* Static Core Dot */}
               <Tooltip>
                  <TooltipTrigger>
                     <span className="cursor-pointer relative inline-flex rounded-full h-2 w-2 bg-green-600 shadow-lg shadow-green-400/50 border-none dark:border-black" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Ready For Job Hiring</p>
                  </TooltipContent>
                </Tooltip>
            </div>
          </motion.div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex gap-8 items-center">
            {navItems.map((item) => (
              <motion.a
                key={item.label}
                href={item.href}
                className="relative group flex items-center gap-1 text-sm font-medium text-neutral-700 dark:text-neutral-300 transition"
              >
                {React.cloneElement(item.icon, { className: 'group-hover:fill-black group-hover-stroke-black dark:group-hover:fill-white  dark:group-hover:stroke-white'})}
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 group-hover:w-full h-[2px] bg-neutral-900 dark:bg-neutral-300 transition-all duration-300" />
              </motion.a>
            ))}
          </div>

          {/* Theme Toggle */}
           <motion.div
               initial={{ x: 100, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               transition={{ duration: 1.2 }}
               whileTap={{ rotate: 180, scale: 1.1 }}
               onClick={() => setIsDark(!isDark)}
               className=" hidden lg:block text-neutral-700 dark:text-neutral-300"
              >
               <Tooltip>
                  <TooltipTrigger>
                    <div className="p-2 mt-2 cursor-pointer rounded-full transition-colors hover:bg-gray-200 dark:hover:bg-neutral-800">
                      {isDark ? <Sun size={20} /> : <Moon size={20} />}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Toggle Theme To {isDark ? 'Light' : 'Dark'}</p>
                  </TooltipContent>
                </Tooltip>
            </motion.div>

          {/* Mobile Menu Icon */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.2 }}
            className="lg:hidden block"
          >
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
              className="text-neutral-700 dark:text-neutral-300"
            >
              <Image className='relative top-1 dark:invert cursor-e-resize' src='/hamburger.png' width={30} height={30} alt='hamburger-icon' />
            </button>
          </motion.div>
        </div>
      </motion.nav>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={closeSidebar}
              className="fixed inset-0 bg-black z-40"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 260, damping: 25 }}
              className="fixed top-0 left-0 h-full w-80 z-50 p-4 bg-white dark:bg-neutral-900 border-r border-white/40 dark:border-neutral-700 rounded-r-2xl shadow-xl flex flex-col justify-between"
            >
              {/* Sidebar Header */}
              <div>
                <div className="cursor-pointer flex justify-between items-center py-3 mb-6 border-b border-white/40 dark:border-neutral-700">
                  <div className="flex items-center gap-2 text-2xl font-extrabold text-neutral-900 dark:text-white">
                    <Image className="dark:invert" width={40} height={40} alt="my-logo" src="/portfolio-logo.svg" />
                    <span>dev.Amritansh</span>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={closeSidebar}
                    className="p-2 rounded-full hover:bg-white/30 dark:hover:bg-neutral-700"
                  >
                    <Image className="dark:invert cursor-pointer animate-caret-blink hover:animate-none" src='/back-button.png' width={24} height={24} alt='back-arrow-icon' />
                  </motion.button>
                </div>

                {/* Sidebar Links */}
                <nav className="flex flex-col gap-3 mt-10">
                  {navItems.map((item, i) => (
                    <motion.a
                      key={`${item.label}-${i}`}
                      href={item.href}
                      onClick={closeSidebar}
                      initial={{ x: -30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex gap-4 items-center hover:bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 group p-3 text-lg font-semibold text-neutral-900 dark:text-neutral-200 rounded-xl dark:hover:bg-neutral-700 transition-all duration-300"
                    >
                      {React.cloneElement(item.icon, { className: 'group-hover:fill-black' })}
                      <span>{item.label}</span>
                    </motion.a>
                  ))}
                </nav>
              </div>

              {/* Sidebar Theme Toggle */}
              <Tooltip>
                <TooltipTrigger>
                  <motion.button
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    onClick={() => setIsDark(!isDark)}
                    className="cursor-pointer mt-10 ml-2 self-start p-2 rounded-full border border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-300"
                  >
                    {isDark ? <Sun size={24} /> : <Moon size={24} />}
                  </motion.button>
                  <TooltipContent>
                    <p>Toggle Theme</p>
                  </TooltipContent>
                </TooltipTrigger>
              </Tooltip>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
