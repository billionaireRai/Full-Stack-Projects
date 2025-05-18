"use client"

import Image from "next/image";
import Link from "next/link";

export default function UserRegisterPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left Section */}
      <div className="flex flex-col items-center justify-center gap-3 w-full md:w-1/2 p-6 md:p-10 bg-gray-50">
        <Image className="mt-1" width={60} height={60} src="/images/brandLogo.png" alt="logo" />
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-4">
          Your Data. Your Privacy. Our Priority.
        </h1>
        <p className="text-sm sm:text-base text-gray-600 text-center max-w-lg">
          Join our platform and enjoy seamless, secure, and private access to everything you need.
          We use industry-leading security practices to ensure your data stays safe and confidential.
        </p>

        {/* Encryption Simulation Card */}
        <div className="mt-6 w-full max-w-sm sm:max-w-md">
          <div className="bg-gray-100 border border-gray-300 rounded-xl p-4 shadow-inner space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">User input:</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full font-mono animate-pulse">
                mySecretPass123
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Encrypting:</span>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full font-mono animate-pulse">
                ************
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Stored securely:</span>
              <span className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full font-mono gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.21 10.03a7 7 0 1113.58 0M12 13v2m0 4h.01M9.75 16.5a.75.75 0 101.5 0 .75.75 0 00-1.5 0z" />
                </svg>
                Encrypted
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center justify-center w-full md:w-1/2 bg-gradient-to-br from-white to-blue-100 p-6">
        <div className="bg-white shadow-2xl rounded-3xl w-full max-w-md p-8 sm:p-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-2">
            Create Your Account
          </h2>
          <p className="text-sm text-gray-500 text-center mb-6">
            Please fill in the details to get started.
          </p>

          <form className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>

            {/* Checkbox */}
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="agree"
                className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="agree" className="text-sm text-gray-600">
                You agree to keep these details safe.
              </label>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-md transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              Register
            </button>
          </form>

          <p className="text-sm text-gray-500 text-center mt-4">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-blue-600 font-semibold relative group">
              <span className="relative z-10">login-now</span>
              <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
