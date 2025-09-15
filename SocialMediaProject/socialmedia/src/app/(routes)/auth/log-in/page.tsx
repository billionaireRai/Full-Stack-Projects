 import React from "react";
import Link from "next/link";
import { Mail, Lock } from "lucide-react";
import Image from "next/image";

export default function LogIn() {
  return (
    <div className="w-screen h-screen flex items-center justify-center font-poppins bg-gradient-to-r from-white to-gray-100 dark:from-gray-950 dark:to-black dark:bg-none">
      <div className="border border-gray-200 w-full max-w-sm rounded-xl shadow-lg bg-white dark:bg-black dark:border-gray-600 flex flex-col items-center p-6 gap-2">
        <div>
          <Image
            src="/images/letter-B.png"
            height={80}
            width={80}
            alt="letter-B"
            className="dark:invert"
          />
        </div>

        {/* Intro Text */}
        <h1 className="text-2xl font-bold text-gray-800 mt-4 dark:text-white">Welcome Back</h1>
        <p className="text-md text-gray-600 text-center max-w-md px-4 dark:text-gray-400">
          Sign in to stay connected with the people you care about and enjoy a
          seamless social experience.
        </p>

        {/* Social Login */}
        <div className="flex flex-row w-full px-6 gap-4 items-center justify-center mt-4">
          <Link
            href="/api/auth/login/google"
            className="flex flex-row gap-2 cursor-pointer hover:bg-yellow-400 transition-all duration-300 hover:shadow-md bg-yellow-300 dark:bg-blue-700 dark:hover:bg-blue-800 border-none items-center px-8 py-2 justify-center rounded-lg font-medium"
          >
            <Image
              src="/svg/google.svg"
              className="dark:invert"
              width={24}
              height={24}
              alt="google-icon"
            />
            <span className="dark:font-bold">Google</span>
          </Link>

          <Link
            href="/api/auth/login/facebook"
            className="flex flex-row gap-2 cursor-pointer hover:bg-yellow-400 transition-all duration-300 hover:shadow-md bg-yellow-300 dark:bg-blue-700 dark:hover:bg-blue-800 border-none items-center px-8 py-2 justify-center rounded-lg font-medium"
          >
            <Image
              src="/svg/facebook.svg"
              className="dark:invert"
              width={24}
              height={24}
              alt="facebook-icon"
            />
            <span className="dark:font-bold">Facebook</span>
          </Link>
        </div>

        {/* Divider */}
        <div className="flex items-center w-full px-6 mt-4">
          <hr className="flex-grow border-gray-300" />
          <span className="px-2 text-gray-400 text-sm">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Login Form */}
        <form className="w-full px-6 mt-4">
          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm text-gray-700 mb-1">Email</label>
            <div className="flex items-center border border-gray-300 rounded-md group px-3 transition-all duration-300 focus-within:border-yellow-500 focus-within:ring-3 focus-within:ring-yellow-200 dark:focus-within:border-blue-500 dark:focus-within:ring-4 dark:focus-within:ring-blue-600/50 dark:border-gray-600">
              <Mail className="text-gray-500 mr-2 w-5 h-5 group-focus-within:stroke-yellow-500 dark:group-focus-within:stroke-blue-400" />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full py-2 px-1 outline-none bg-transparent rounded-lg"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-sm text-gray-700 mb-1">Password</label>
            <div className="flex items-center border border-gray-300 rounded-md group px-3 transition-all duration-300 focus-within:border-yellow-500 focus-within:ring-3 focus-within:ring-yellow-200 dark:focus-within:border-blue-500 dark:focus-within:ring-4 dark:focus-within:ring-blue-600/50 dark:border-gray-600">
              <Lock className="text-gray-500 mr-2 w-5 h-5 group-focus-within:stroke-yellow-500 dark:group-focus-within:stroke-blue-400" />
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full py-2 px-1 outline-none bg-transparent rounded-lg"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="button"
            className="w-full cursor-pointer py-3 rounded-lg bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-400 dark:bg-blue-700 dark:hover:bg-blue-800 dark:active:bg-blue-700 dark:text-white transition-all duration-300 font-semibold text-gray-900 hover:shadow-md"
          >
            Log In
          </button>
        </form>

        {/* Signup Link */}
        <p className="text-sm text-gray-600 mt-4 flex items-center justify-center gap-2">
          <span>New here?</span>
          <Link
            href="/auth/sign-up"
            className="text-yellow-500 hover:text-yellow-600 font-medium transition-colors dark:text-blue-400"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
