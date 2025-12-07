'use client'

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { User, AtSign} from "lucide-react"; // lightweight icons

export default function createNewAccount() {
  return (
    <div className="w-full h-screen flex flex-col-reverse md:flex-row-reverse font-poppins overflow-y-scroll p-4 dark:bg-black dark:bg-none">
      {/* Left Section - Form */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 bg-white dark:bg-black">
        <div className="flex flex-col items-center text-center">
          <Image
            src="/images/socialmedialogo.png"
            height={50}
            width={100}
            alt="Social Media Logo"
            className="mt-10 rounded-full"
          />
          <h1 className="font-bold text-3xl text-gray-800 mb-2 dark:text-white">
            Create Your Account...
          </h1>
          <p className="text-gray-600 max-w-md text-sm dark:text-gray-400">
            Create your account today and join our social media community. Share your life updates, connect
            with friends, and be part of something amazing.
          </p>
        </div>

        {/* Form Card */}
        <form className="w-full max-w-lg bg-white p-6 my-10 mx-5 rounded-xl shadow-xl border border-gray-200 dark:bg-gray-900 dark:border-gray-700 dark:shadow-2xl dark:shadow-blue-900/30">
          <div className="mb-4">
            <label className="block text-sm text-black mb-1 dark:text-white">Name</label>
            <div className="flex items-center border border-gray-300 rounded-md group px-3 transition-all duration-300 focus-within:border-yellow-500 focus-within:ring-3 focus-within:ring-yellow-200 dark:focus-within:border-blue-500 dark:focus-within:ring-4 dark:focus-within:ring-blue-600/50 dark:border-gray-600">
              <User className="text-gray-500 mr-2 w-5 h-5 group-focus-within:stroke-amber-400 dark:group-focus-within:stroke-blue-400 dark:stroke-white" />
              <input
                type="text"
                placeholder="enter your name"
                className="w-full py-2 px-1 outline-none bg-transparent dark:text-white"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm text-black mb-1 dark:text-white">Username</label>
            <div className="flex items-center border border-gray-300 rounded-md group px-3 transition-all duration-300 focus-within:border-yellow-500 focus-within:ring-3 focus-within:ring-yellow-200 dark:focus-within:border-blue-500 dark:focus-within:ring-4 dark:focus-within:ring-blue-600/50 dark:border-gray-600">
              <AtSign className="text-gray-500 mr-2 w-5 h-5 group-focus-within:stroke-amber-400 dark:group-focus-within:stroke-blue-400 dark:stroke-white" />
              <input
                type="text"
                placeholder="enter your account name"
                className="w-full py-2 px-1 outline-none bg-transparent dark:text-white"
              />
            </div>
          </div>

          <button
            type="button"
            className="w-full cursor-pointer border-none py-3 my-3 rounded-lg bg-yellow-300 hover:bg-yellow-300 transition-all duration-300 font-semibold text-gray-900 shadow-yellow-400 hover:shadow-sm active:bg-yellow-400 dark:bg-blue-700 dark:hover:bg-blue-800
            dark:active:bg-blue-700 dark:shadow-lg dark:shadow-blue-800/50 dark:text-white"
          >
            Create Account
          </button>

          <p className="text-sm text-gray-600 mt-4 flex items-center justify-center flex-row gap-3 dark:text-gray-400">
              <span>Want to use existing account ?{" "}</span>
              <Link
                href="/username/feed?switch-account-pop=true"
                className="text-yellow-500 hover:bg-yellow-100 py-1 px-2 rounded-full font-medium transition-colors dark:text-blue-500"
              >
                CLICK ME
              </Link>
          </p>
        </form>
      </div>

      <div className="flex flex-col md:flex-row-reverse w-full h-screen lg:w-1/2 justify-center items-center bg-contain dark:bg-black dark:bg-none">
       <Image src='/images/create-account.jpg' width={800}  height={800} alt="banner" className="dark:invert border-none outline-none rounded-full" />
      </div>
    </div>
  );
}
