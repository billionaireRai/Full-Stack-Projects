"use client";

import React, { useState, useEffect } from 'react';
import {
  User,
  Lock,
  Bell,
  Shield,
  EyeOff,
  Mail,
  Phone,
  Globe,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Settings,
  CheckCircleIcon,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import LogoutModal from '@/components/logoutmodal';
import toast from 'react-hot-toast';
import DeactivateModal from '@/components/deactivatemodal';
import DeleteModal from '@/components/deletemodal';
import TwoFAModal from '@/components/twoFAmodal';

export interface userInfoType {
  name:string ,
  username:string ,
  email:string,
  bio:string ,
  location:string,
  website:string,
  joinDate:string,
  phone:string,
  following:string,
  followers:string,
  Posts:string,
  isVerified:boolean,
  coverImage:string,
  avatar:string
}


export default function AccountSettings() {
  const [showLogoutModal, setshowLogoutModal] = useState<boolean>(false) ;
  const [showDeactivateModal, setshowDeactivateModal] = useState<boolean>(false) ;
  const [showDeleteModal, setshowDeleteModal] = useState<boolean>(false) ;
  const [TwoFAEnabled, setTwoFAEnabled] = useState<boolean>(false) ;
  const [TwoFAInfoModal, setTwoFAInfoModal] = useState<boolean>(false) ;
  const [formData, setFormData] = useState<userInfoType | null>(null)
  

  // function for handling profile update..
  const handleProfileUpdate = () => {
    console.log('Updating profile', formData);
  };

  // function handling deactivation logic...
  const handleAccountDeactivation = () : void => { 
    setshowDeactivateModal(false)
    toast.success('Account Deactivated !!');
  }

  // function handling account deletion..
  const handleAccoutDeletion = () : void => { 
    setshowDeleteModal(false)
    toast.success('Account Successfully Deleted !!');
  }

  // useffect for 2FA modal
  useEffect(() => {
    if (TwoFAEnabled.valueOf() === true) {
      setTimeout(() => {
        setTwoFAInfoModal(true)
      }, 3000);
    }
  }, [TwoFAEnabled])
  

  return (
    <div className="h-full overflow-y-scroll bg-gray-50 dark:bg-black py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Privacy Settings Section */}
        <div className="bg-white dark:bg-black rounded-xl shadow-lg dark:border-b-1 dark:border-gray-500 px-6 py-9 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
            Privacy Settings
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Private Account</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Only approved user (followers) can see your posts</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-500 dark:peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Show Online Status</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Let others see when you're active</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-500 dark:peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Allow Direct Messages</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Receive messages from anyone</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-500 dark:peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Data Sharing</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Share usage data for better experience</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-500 dark:peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white dark:bg-black rounded-xl shadow-lg dark:border-b-1 dark:border-gray-500 px-6 py-9 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-red-600 dark:text-red-400" />
            Security
          </h2>
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Change Password</h3>
              <div className="space-y-3">
                <input
                  type="password"
                  placeholder="Current password"
                  className="w-full px-4 py-3 border focus:border-yellow-300 dark:focus:border-blue-500 transition-all duration-300 rounded-md bg-background placeholder-muted-foreground focus:outline-none focus:ring-3 dark:focus:ring-blue-900/50 focus:ring-yellow-200/50 focus:placeholder:text-gray-600 dark:focus:placeholder:text-gray-300 resize-none text-sm"
                />
                <input
                  type="password"
                  placeholder="New password"
                  className="w-full px-4 py-3 border focus:border-yellow-300 dark:focus:border-blue-500 transition-all duration-300 rounded-md bg-background placeholder-muted-foreground focus:outline-none focus:ring-3 dark:focus:ring-blue-900/50 focus:ring-yellow-200/50 focus:placeholder:text-gray-600 dark:focus:placeholder:text-gray-300 resize-none text-sm"
                />
                <input
                  type="password"
                  placeholder="Confirm new password"
                  className="w-full px-4 py-3 border focus:border-yellow-300 dark:focus:border-blue-500 transition-all duration-300 rounded-md bg-background placeholder-muted-foreground focus:outline-none focus:ring-3 dark:focus:ring-blue-900/50 focus:ring-yellow-200/50 focus:placeholder:text-gray-600 dark:focus:placeholder:text-gray-300 resize-none text-sm"
                />
              </div>
              <Button className="cursor-pointer shadow-sm hover:shadow-md mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-all">
                Update Password
              </Button>
            </div>
            <div className="p-4 flex flex-row items-center justify-between border border-gray-200 dark:border-gray-700 rounded-lg">
              <div>
               <h3 className="font-medium text-gray-900 dark:text-white mb-2">Two-Factor Authentication</h3>
               <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Add an extra layer of security to your account</p>
              </div>
              <Button 
              onClick={() => { setTwoFAEnabled(!TwoFAEnabled) }}
              className={`cursor-pointer ${TwoFAEnabled  ? 'animate-none' : 'animate-bounce hover:animate-none'} shadow-sm hover:shadow-md bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-all`}>
                {TwoFAEnabled ? <CheckCircleIcon/> : 'Enable 2FA' }
              </Button>
            </div>
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Login Sessions</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Manage your active sessions</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Current Alive Session - Microsoft Edge on Windows</span>
                  <span className="text-xs font-semibold text-green-600 dark:text-green-400 border border-green-400 py-2 px-4 rounded-full cursor-default">ACTIVE</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Clear All Past Session Credentials</span>
                  <Button className="rounded-full text-sm shadow-sm hover:shadow-md cursor-pointer bg-red-100 text-red-600 dark:text-red-400 border-red-600 hover:bg-red-50 dark:hover:bg-red-950 dark:bg-red-900">
                    CLEAR HISTORY
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-white dark:bg-black rounded-xl shadow-lg dark:border-b-1 dark:border-gray-500 px-6 py-9 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            Notifications
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Email Notifications</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Receive updates via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-500 dark:peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Push Notifications</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Get notified on your device</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-500 dark:peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">SMS Notifications</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Receive text messages for important updates</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-500 dark:peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Notification Preferences</h3>
              <div>
                <label className="flex items-center py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-900 cursor-pointer">
                  <input type="checkbox" className="mr-3" defaultChecked />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Likes and comments on your posts</span>
                </label>
                <label className="flex items-center py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-900 cursor-pointer">
                  <input type="checkbox" className="mr-3" defaultChecked />
                  <span className="text-sm text-gray-700 dark:text-gray-300">New followers</span>
                </label>
                <label className="flex items-center py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-900 cursor-pointer">
                  <input type="checkbox" className="mr-3" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Direct messages</span>
                </label>
                <label className="flex items-center py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-900 cursor-pointer">
                  <input type="checkbox" className="mr-3" defaultChecked />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Mentions and tags</span>
                </label>
                <label className="flex items-center py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-900 cursor-pointer">
                  <input type="checkbox" className="mr-3" defaultChecked />
                  <span className="text-sm text-gray-700 dark:text-gray-300">New posts from accounts you follow</span>
                </label>
                <label className="flex items-center py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-900 cursor-pointer">
                  <input type="checkbox" className="mr-3" defaultChecked />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Reposts and quotes of your posts</span>
                </label>
                <label className="flex items-center py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-900 cursor-pointer">
                  <input type="checkbox" className="mr-3" defaultChecked />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Account security alerts</span>
                </label>
                <label className="flex items-center py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-900 cursor-pointer">
                  <input type="checkbox" className="mr-3" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Weekly activity summary</span>
                </label>
                <label className="flex items-center py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-900 cursor-pointer">
                  <input type="checkbox" className="mr-3" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Platform updates and tips</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Account Management Section */}
        <div className="bg-white dark:bg-black rounded-xl shadow-lg dark:border-b-1 dark:border-gray-500 px-6 py-9 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            Account Management
          </h2>
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Download Your Data</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Get a copy of all your data</p>
              <Button className="cursor-pointer bg-blue-600 shadow-sm hover:shadow-md hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all">
                Request Data
              </Button>
            </div>
            <div className="p-4 border border-yellow-200 dark:border-yellow-700 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Deactivate Account</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Temporarily disable your account</p>
              <button 
              onClick={() => { setshowDeactivateModal(true) }}
              className="cursor-pointer border border-yellow-600 dark:border-yellow-500 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-100 bg-yellow-100 dark:bg-yellow-900/20 dark:hover:bg-yellow-900/50 dark:text-yellow-400 px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md focus:outline-nonefocus:ring-yellow-500">
                <EyeOff className="w-4 h-4" /> Deactivate
              </button>
            </div>
            <div className="p-4 border border-red-200 dark:border-red-700 rounded-lg bg-red-50 dark:bg-red-900/20">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Delete Account</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Permanently delete your account and all data</p>
              <button 
              onClick={() => { setshowDeleteModal(true) }}
              className="cursor-pointer border border-red-600 text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/50 dark:text-red-400 px-6 py-2 rounded-lg font-medium transition-all shadow-sm hover:shadow-md focus:outline-none flex items-center gap-2">
                <Trash2 className="w-4 h-4" /> Delete Account
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-center text-center py-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Need help? Contact our support team or
          </p>
          <p>
           <Link 
           href='/@amritansh_coder'
           className="text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-gray-950 py-1 px-2 rounded-lg font-semibold">
             Amritansh Rai
           </Link>
          </p>
        </div>
      </div>
      {showLogoutModal && formData && 
      <>
      <LogoutModal closePopUp={() => { setshowLogoutModal(false) }} handle={formData.username}/> 
      </>
      }
      {showDeactivateModal && 
      <>
      <DeactivateModal closePopUp={() => { setshowDeactivateModal(false) }} onDeactivate={() => { handleAccountDeactivation() }} /> 
      </>
      }
      {showDeleteModal && 
      <>
      <DeleteModal itemType={'Account'} closePopUp={() => { setshowDeleteModal(false) }} onDelete={() => { handleAccoutDeletion() }} /> 
      </>
      }
      {TwoFAInfoModal && 
      <>
      <TwoFAModal closePopUp={() => { setTwoFAInfoModal(false) }} /> 
      </>
      }
    </div>

  );
}
