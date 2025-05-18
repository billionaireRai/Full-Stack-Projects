'use client';

import Link from "next/link";
import Image from "next/image";

export default function UserLoginPage() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Left - Image Section */}
      <div className="hidden md:flex md:w-1/2 items-center justify-center bg-black">
        <img
          src="/images/homePage_img.png"
          alt="Login Illustration"
          className="w-4/5 h-4/5 object-cover shadow-lg"
        />
      </div>
      {/* Right - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center py-6 px-10">
        <div className="w-full max-w-md bg-white rounded-2xl bg-gradient-to-br from-white to-blue-50 shadow-lg px-6 py-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-2 flex justify-evenly items-center">
            <span>Welcome Back To</span>
            <Image className="mt-1" width={60} height={60} src="/images/brandLogo.png" alt="logo" />
          </h2>
          <p className="text-gray-500 text-sm text-center mb-6">
            Please log in to your account to continue.
          </p>

          <form className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Encryption Salt */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Encryption Salt</label>
              <input
                type="number"
                placeholder="Enter a value between 10 - 30"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Checkbox */}
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="agree"
                className="cursor-pointer mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="agree" className="text-sm text-gray-600 leading-snug">
                You confirm that the above information is correct.
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              Log In
            </button>

            {/* Register Link */}
            <div className="flex flex-row items-center justify-between">
               <p className="text-sm flex flex-col text-gray-500 text-center mt-2">
                 <span>Don’t have an account ?</span>
                 <Link href="/auth/register" className="relative inline-block text-blue-600 font-semibold group">
                   <span className="relative z-10">register-now</span>
                   <span
                     className="absolute left-0 bottom-0 h-[2px] w-0 bg-blue-600 transition-all duration-300 group-hover:w-full"
                   ></span>
                 </Link>
               </p>
               <p className="text-sm flex flex-col text-gray-500 text-center mt-2">
                 <span>forgot your password ?</span>
                 <Link href="/auth/forgot-password" className="relative inline-block text-blue-600 font-semibold group">
                   <span className="relative z-10">reset-password</span>
                   <span
                     className="absolute left-0 bottom-0 h-[2px] w-0 bg-blue-600 transition-all duration-300 group-hover:w-full"
                   ></span>
                 </Link>
               </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
