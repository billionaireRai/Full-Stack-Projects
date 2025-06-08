"use client"

import Image from "next/image";
import Link from "next/link";
import Tooltip from "@/components/Tooltip";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white dark:bg-gray-900">
      {/* Left Side - Illustration & Message */}
      <div className="flex flex-col items-center justify-center w-full md:w-1/2 p-6 md:p-10 bg-gray-50 dark:bg-gray-800">
        <Image
          src="/images/forgot-password.jpg"
          alt="Forgot Password"
          width={300}
          height={300}
          className="object-contain mb-6 animate-pulse rounded-2xl"
        />
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-4">
          Forgot Your Password?
        </h1>
        <p className="text-sm sm:text-base text-center text-gray-600 dark:text-gray-300 max-w-lg">
          Don’t worry, we’ve got you covered. Enter your registered email and we’ll send you an OTP (One Time Password) to reset your password securely.
        </p>
      </div>

      {/* Right Side - Form */}
      <div className="flex items-center justify-center w-full md:w-1/2 bg-gradient-to-br from-white to-blue-100 dark:from-gray-900 dark:to-blue-900 p-6">
        <div className="bg-white dark:shadow-2xl dark:shadow-gray-700 dark:bg-gray-800 shadow-2xl rounded-3xl w-full max-w-md p-8 sm:p-10">
        <h2 className="text-2xl flex items-center justify-evenly sm:text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-2">
            <span>Reset Password</span>
            <Image className="mt-1 dark:invert" width={60} height={60} src="/images/brandLogo.png" alt="logo" />
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
            Enter the email associated with your account.
          </p>

          <form className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
              <Tooltip text="Enter your registered email address">
                <input
                  type="email"
                  placeholder="enter your email_address"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </Tooltip>
            </div>
            {/* Submit Button */}
            <Tooltip text="Click to send reset link to your email">
              <button
                type="submit"
                className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-md transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-600"
              >
                Send Reset Link
              </button>
            </Tooltip>
          </form>

          {/* Back to login */}
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-6">
            Remembered your password?
            <Tooltip text="Go to login page">
              <Link href="/auth/login" className="text-blue-600 dark:text-blue-400 font-semibold relative group">
                <span className="relative z-10">Login here</span>
                <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-blue-600 dark:bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </Tooltip>
          </p>
        </div>
      </div>
    </div>
  );
}
