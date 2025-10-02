"use client";

import Navbar from '../../../../../components/navbar.jsx';
import { useRef, useState } from 'react';
import { useInactivityChecker } from '../../../../../components/useInactivityChecker.jsx';

export default function UserProfilePage() {
  useInactivityChecker(process.env.NEXT_PUBLIC_INACTIVITY_CHECKER_LOGOUT);
  const fileInputRef = useRef(null);
  const [profilePic, setProfilePic] = useState(null);
  const [userInfo, setUserInfo] = useState({
    fullName: 'John Doe',
    email: 'johndoe@example.com',
    phone: '+1 123 456 7890',
    bio: 'Security enthusiast and full-stack developer.',
    twoFAEnabled: true,
    accountCreated: 'January 10, 2023',
    lastUpdated: 'May 12, 2025'
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <Navbar />
      <main className="pt-28 px-6 md:px-12 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-left text-gray-900 dark:text-gray-100">👤 Your Profile</h1>

        {/* Profile Picture Upload Section */}
        <section className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow border border-gray-200 dark:border-gray-700 mb-12 flex flex-col md:flex-row items-center gap-8">
          <div className="relative w-40 h-40 rounded-full overflow-hidden border border-gray-300 dark:border-gray-600">
            {profilePic ? (
              <img src={profilePic} alt="Profile" className="object-cover w-full h-full" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm bg-gray-100 dark:bg-gray-700">
                No Image
              </div>
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Update Profile Picture</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm max-w-md">
              Upload a clear headshot for your profile. Accepted formats: JPG, PNG.
            </p>
            <div className="flex items-center gap-4">
              <button
                className="cursor-pointer px-5 py-2 bg-blue-600 hover:bg-blue-700 hover:shadow-sm hover:shadow-blue-200 dark:hover:shadow-blue-900 text-white rounded-lg text-sm transition"
                onClick={() => fileInputRef.current?.click()}
              >
                Upload Photo
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              {profilePic && (
                <button
                  className="text-sm text-red-500 underline hover:text-red-700"
                  onClick={() => setProfilePic(null)}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </section>

        {/* User Info Section */}
        <section className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow border border-gray-200 dark:border-gray-700 mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100">📄 Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Full Name</label>
              <input type="text" value={userInfo.fullName} readOnly className="focus:ring-1 focus:ring-black dark:focus:ring-white transition-all duration-300 outline-none w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Email</label>
              <input type="email" value={userInfo.email} readOnly className="focus:ring-1 focus:ring-black dark:focus:ring-white transition-all duration-300 outline-none w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Phone</label>
              <input type="text" value={userInfo.phone} readOnly className="focus:ring-1 focus:ring-black dark:focus:ring-white transition-all duration-300 outline-none w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Bio</label>
              <textarea value={userInfo.bio} readOnly rows={3} className="focus:ring-1 focus:ring-black dark:focus:ring-white transition-all duration-300 outline-none w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"></textarea>
            </div>
          </div>
        </section>

        {/* Account Security Section */}
        <section className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow border border-gray-200 dark:border-gray-700 mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100">🔐 Security Settings</h2>
          <ul className="text-gray-700 dark:text-gray-300 space-y-4">
            <li><span className="font-medium">2FA Enabled:</span> {userInfo.twoFAEnabled ? 'Yes' : 'No'}</li>
            <li><span className="font-medium">Account Created:</span> {userInfo.accountCreated}</li>
            <li><span className="font-medium">Last Profile Update:</span> {userInfo.lastUpdated}</li>
          </ul>
          <div className="mt-6">
            <button className="cursor-pointer px-6 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white rounded-lg transition">Change Password</button>
          </div>
        </section>

        {/* Notification Settings Section */}
        <section className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow border border-gray-200 dark:border-gray-700 mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100">📢 Notification Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Email Alerts for Logins</span>
              <input type="checkbox" checked readOnly className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <span>SMS Alerts for Suspicious Activity</span>
              <input type="checkbox" readOnly className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <span>Push Notifications for New Logins</span>
              <input type="checkbox" checked readOnly className="w-5 h-5" />
            </div>
          </div>
        </section>

        {/* Account Activity Summary */}
        <section className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow border border-gray-200 dark:border-gray-700 mb-24">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100">📊 Account Activity</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-6 cursor-pointer hover:shadow-md border-none outline-none bg-blue-50 dark:bg-blue-900 rounded-xl">
              <h3 className="text-3xl font-bold text-blue-600 dark:text-blue-400">14</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Logins This Month</p>
            </div>
            <div className="p-6 cursor-pointer hover:shadow-md border-none outline-none bg-blue-50 dark:bg-blue-900 rounded-xl">
              <h3 className="text-3xl font-bold text-yellow-500 dark:text-yellow-400">5</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Password Resets</p>
            </div>
            <div className="p-6 cursor-pointer hover:shadow-md border-none outline-none bg-blue-50 dark:bg-blue-900 rounded-xl">
              <h3 className="text-3xl font-bold text-green-600 dark:text-green-400">3</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Security Warnings</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
