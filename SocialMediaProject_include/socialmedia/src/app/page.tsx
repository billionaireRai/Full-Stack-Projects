"use client"
import React, { useEffect, useState } from "react"
import Image from "next/image";
import Link from "next/link";
import { Sun , Moon } from 'lucide-react';
import { Tooltip,TooltipContent,TooltipTrigger } from "@/components/ui/tooltip"
import { useTheme } from 'next-themes'

export default function HomePage() {
  const { theme, setTheme } = useTheme() ; // getting the current theme state and updation function...
  const isDark = ( theme === 'dark' ) ;
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <>
      <div className="border-none fixed top-0 p-0 dark:bg-black border-black w-screen h-screen flex flex-col overflow-y-auto">
        {/* themetoggler section */}
        {mounted && (
          <div className="themetoggler border-none flex items-center justify-end">
            <div
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="relative group"
            >
              <Tooltip>
                <TooltipTrigger>
                  <div className="p-3 m-2 cursor-pointer rounded-full bg-white shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 ease-in-out ring-2 ring-transparent hover:ring-gray-500 dark:hover:ring-gray-400">
                    <div className={`transition-transform duration-500 ${isDark ? 'rotate-180' : 'rotate-0'}`}>
                      {isDark ? <Sun size={25} className="text-black" /> : <Moon size={25} className="text-black" />}
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
        <div className="mainBox font-poppins flex flex-col gap-4 items-center border-none h-full rounded-lg border-black">
          <div>
            <Image src='/images/letter-B.png' className="dark:invert rounded-full" width={120} height={120} alt="letter-B" />
          </div>
          <span className="text-[30px] sm:text-[50px] font-extrabold cursor-pointer">Happening Now !!!</span>
          <p className="text-center text-sm w-full sm:max-w-2xl sm:text-lg">
            Join Briezly today and connect with friends and family in a fun, easy, and secure way! Share your moments, discover new people, and build lasting relationships on our social media platform.
          </p>
          <div className="flex flex-col sm:flex-row w-full p-2 gap-5 items-center justify-center border-none">
            <Link href='/api/auth/register/google' className="flex flex-row gap-2.5 cursor-pointer hover:bg-yellow-400 transition-all duration-300 hover:shadow-lg bg-yellow-300 dark:bg-blue-700 dark:hover:bg-blue-800 border-none items-center px-4 py-2 justify-center border rounded-lg"><Image src='/svg/google.svg' className="dark:invert" width={30} height={30} alt="google-icon" /><span>SignUp with Google</span></Link>
            <Link href='/api/auth/register/facebook' className="flex flex-row gap-2.5 cursor-pointer hover:bg-yellow-400 transition-all duration-300 hover:shadow-lg bg-yellow-300 dark:bg-blue-700 dark:hover:bg-blue-800 border-none items-center px-4 py-2 justify-center border rounded-lg"><Image src='/svg/facebook.svg' className="dark:invert" width={30} height={30} alt="facebook-icon" /><span>SignUp with Facebook</span></Link>
          </div>
            <hr className="w-1/3 border-b rounded-full border-gray-300 dark:border-gray-600 my-2"/>
            <Link href='/auth/sign-up' className="flex flex-row gap-2.5 cursor-pointer hover:bg-yellow-400 transition-all duration-300 hover:shadow-lg bg-yellow-300 dark:bg-blue-700 dark:hover:bg-blue-800 border-none items-center px-4 py-2 justify-center border rounded-lg"><Image src='/images/email.png' className="dark:invert" width={30} height={30} alt="facebook-icon" /><span>SignUp with Email</span></Link>
            <p className="text-center">
              By Signing up you agree to Our <b>terms</b> and <b>policies</b> give you credentials to us including <b>cookies</b> usage... 
            </p>
            <hr className="w-1/3 border-b rounded-full border-gray-300 dark:border-gray-600 my-2"/>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-5">
              <span className="text-sm">Already have an account ?</span>
              <Link href='/auth/log-in' className="flex flex-row gap-2.5 cursor-pointer hover:bg-yellow-400 transition-all duration-300 hover:shadow-lg bg-yellow-300 dark:bg-blue-700 dark:hover:bg-blue-800 border-none items-center px-4 py-2 justify-center border rounded-lg"><Image src='/images/email.png' className="dark:invert" width={30} height={30} alt="facebook-icon" /><span>Login your Account</span></Link>
            </div>
        </div>
      </div>
    </>
  )
}
