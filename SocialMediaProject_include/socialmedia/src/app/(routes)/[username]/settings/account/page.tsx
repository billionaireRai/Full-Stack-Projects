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
  Upload,
  CheckCircleIcon,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
// import { signOut } from 'next-auth/react';
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
  const [formData, setFormData] = useState<userInfoType>({
    name: '',
    username: '',
    email: '',
    bio: '',
    location: '',
    website: '',
    joinDate: '',
    phone: '',
    following: '0',
    followers: '0',
    Posts: '0',
    isVerified: false,
    avatar: 'https://www.bing.com/th/id/OIP.YDyoIafIwW1tILED3HgZRQHaHa?w=195&h=211&c=8&rs=1&qlt=90&o=6&cb=ucfimg1&dpr=1.3&pid=3.1&rm=2&ucfimg=1',
    coverImage: 'https://www.bing.com/th/id/OIP.1BFjs0_bYPi5Wwl2uFoLEgAAAA?w=435&h=211&c=8&rs=1&qlt=90&o=6&cb=ucfimg1&dpr=1.3&pid=3.1&rm=2&ucfimg=1'
  });
  
  const [coverImagePreview, setCoverImagePreview] = useState<string>(formData.coverImage);
  const [avatarPreview, setAvatarPreview] = useState<string>(formData.avatar);


  // function for handling profile update..
  const handleProfileUpdate = () => {
    console.log('Updating profile', formData);
  };

  // handling each input change...
  const handleInputChange = (field: keyof userInfoType, value: string) : void => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // handling image manipulation...
  const handleImageManipulation = (e: React.ChangeEvent<HTMLInputElement>,imageFor:string) : void => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      if (imageFor.includes('coverImage')) {
        handleInputChange('coverImage', file.name);
      } else {
        handleInputChange('avatar', file.name);
      }
    }
  };

  // handle logout
  const handleLogout = () : void => {
    toast.loading('logging out in proccess , wait !!');
    signOut({ redirect:true , callbackUrl:'/auth/log-in' });
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
    <div className="min-h-screen bg-gray-50 dark:bg-black py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Settings className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            Account Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your account preferences, privacy, and security settings.
          </p>
        </div>

        {/* Account Information Section */}
        <div className="bg-white dark:bg-black rounded-xl dark:border-b-1 dark:border-gray-500 shadow-lg px-6 py-9 mb-6">
          <div className='flex flex-row items-center justify-between'>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            Account Information
          </h2>
          <div className="my-5 flex flex-col sm:flex-row gap-3">
            {formData.isVerified ? (
              <div className="inline-flex items-center gap-2 px-3 py-2 bg-yellow-100 dark:bg-gray-900 text-yellow-600 dark:text-blue-600 rounded-full text-sm font-medium shadow-">
                VERIFIED ACCOUNT
                <CheckCircle className="w-4 h-4" />
              </div>
            ) : (
              <Button asChild variant="outline" className="inline-flex shadow-sm hover:shadow-md items-center gap-2 border bg-gray-100 dark:bg-black dark:hover:bg-gray-950">
                <Link href='/subscription?utm_source=account-settings'>
                  GET VERIFIED
                  <Shield className="w-4 h-4 fill-black dark:fill-white stroke-1 stroke-black dark:stroke-white" />
                </Link>
              </Button>
            )}
            <Link href='/@amritansh_coder?utm_source=account-settings'>
              <Button
                variant="outline"
                className="inline-flex shadow-sm hover:text-blue-600 hover:shadow-md items-center gap-2 border bg-blue-50 dark:bg-blue-900/20 text-blue-600 cursor-pointer dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50"
              >
                VIEW PROFILE
                <User/>
              </Button>
            </Link>
            <Button
              onClick={() => { setshowLogoutModal(true) }}
              variant="outline"
              className="inline-flex shadow-sm hover:text-red-600 hover:shadow-md items-center gap-2 border bg-red-50 dark:bg-red-900/20 text-red-600 cursor-pointer dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50"
            >
              LOGOUT
              <Lock className="w-4 h-4" />
            </Button>
          </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter full name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-3 border focus:border-yellow-300 dark:focus:border-blue-500 transition-all duration-300 rounded-md bg-background placeholder-muted-foreground focus:outline-none focus:ring-3 dark:focus:ring-blue-900/50 focus:ring-yellow-200/50 focus:placeholder:text-gray-600 dark:focus:placeholder:text-gray-300 resize-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                placeholder="@username"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                className="w-full px-4 py-3 border focus:border-yellow-300 dark:focus:border-blue-500 transition-all duration-300 rounded-md bg-background placeholder-muted-foreground focus:outline-none focus:ring-3 dark:focus:ring-blue-900/50 focus:ring-yellow-200/50 focus:placeholder:text-gray-600 dark:focus:placeholder:text-gray-300 resize-none text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-3 border focus:border-yellow-300 dark:focus:border-blue-500 transition-all duration-300 rounded-md bg-background placeholder-muted-foreground focus:outline-none focus:ring-3 dark:focus:ring-blue-900/50 focus:ring-yellow-200/50 focus:placeholder:text-gray-600 dark:focus:placeholder:text-gray-300 resize-none text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-4 py-3 border focus:border-yellow-300 dark:focus:border-blue-500 transition-all duration-300 rounded-md bg-background placeholder-muted-foreground focus:outline-none focus:ring-3 dark:focus:ring-blue-900/50 focus:ring-yellow-200/50 focus:placeholder:text-gray-600 dark:focus:placeholder:text-gray-300 resize-none text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Website (Optional)
              </label>
              <input
                type="text"
                placeholder="www.yourwebsite.com"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className="w-full px-4 py-3 border focus:border-yellow-300 dark:focus:border-blue-500 transition-all duration-300 rounded-md bg-background placeholder-muted-foreground focus:outline-none focus:ring-3 dark:focus:ring-blue-900/50 focus:ring-yellow-200/50 focus:placeholder:text-gray-600 dark:focus:placeholder:text-gray-300 resize-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Join Date
              </label>
              <input
                type="date"
                value={formData.joinDate}
                onChange={(e) => handleInputChange('joinDate', e.target.value)}
                className="w-full px-4 py-3 border focus:border-yellow-300 dark:focus:border-blue-500 transition-all duration-300 rounded-md bg-background placeholder-muted-foreground focus:outline-none focus:ring-3 dark:focus:ring-blue-900/50 focus:ring-yellow-200/50 focus:placeholder:text-gray-600 dark:focus:placeholder:text-gray-300 resize-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location
              </label>
              <input
                type="text"
                placeholder="City, Country"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full px-4 py-3 border focus:border-yellow-300 dark:focus:border-blue-500 transition-all duration-300 rounded-md bg-background placeholder-muted-foreground focus:outline-none focus:ring-3 dark:focus:ring-blue-900/50 focus:ring-yellow-200/50 focus:placeholder:text-gray-600 dark:focus:placeholder:text-gray-300 resize-none text-sm"
              />
            </div>
          </div>
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Bio
            </label>
            <textarea
              rows={3}
              placeholder="Tell us about yourself..."
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              className="w-full px-4 py-3 border focus:border-yellow-300 dark:focus:border-blue-500 transition-all duration-300 rounded-md bg-background placeholder-muted-foreground focus:outline-none focus:ring-3 dark:focus:ring-blue-900/50 focus:ring-yellow-200/50 focus:placeholder:text-gray-600 dark:focus:placeholder:text-gray-300 resize-none text-sm"
            />
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Following
              </label>
              <input
                type="text"
                value={formData.following}
                readOnly
                className="w-full px-4 py-3 border cursor-default focus:border-yellow-300 dark:focus:border-blue-500 transition-all duration-300 rounded-md bg-background placeholder-muted-foreground focus:outline-none focus:ring-3 dark:focus:ring-blue-900/50 focus:ring-yellow-200/50 focus:placeholder:text-gray-600 dark:focus:placeholder:text-gray-300 resize-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Followers
              </label>
              <input
                type="text"
                value={formData.followers}
                readOnly
                className="w-full px-4 py-3 border cursor-default focus:border-yellow-300 dark:focus:border-blue-500 transition-all duration-300 rounded-md bg-background placeholder-muted-foreground focus:outline-none focus:ring-3 dark:focus:ring-blue-900/50 focus:ring-yellow-200/50 focus:placeholder:text-gray-600 dark:focus:placeholder:text-gray-300 resize-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Posts
              </label>
              <input
                type="text"
                value={formData.Posts}
                readOnly
                className="w-full px-4 py-3 border cursor-default focus:border-yellow-300 dark:focus:border-blue-500 transition-all duration-300 rounded-md bg-background placeholder-muted-foreground focus:outline-none focus:ring-3 dark:focus:ring-blue-900/50 focus:ring-yellow-200/50 focus:placeholder:text-gray-600 dark:focus:placeholder:text-gray-300 resize-none text-sm"
              />
            </div>
          </div>
          <div className="mt-6">
            <label className="block text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
              Avatar
            </label>
            {avatarPreview && (
              <div className="my-4 p-2 flex flex-row items-center justify-between rounded-lg">
                <img
                  src={formData.avatar}
                  alt="Avatar Preview"
                  className="w-30 h-30 object-cover rounded-full border"
                />
                <button className='py-2 px-3 flex flex-row gap-1 border items-center justify-center rounded-lg bg-black dark:bg-gray-950 text-white shadow-sm hover:shadow-md cursor-pointer'><Upload/><span>Change Avatar</span></button>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => { handleImageManipulation(e,'avatar')}}
              className="w-full px-4 py-3 border focus:border-yellow-300 dark:focus:border-blue-500 transition-all duration-300 rounded-md bg-background placeholder-muted-foreground focus:outline-none focus:ring-3 dark:focus:ring-blue-900/50 focus:ring-yellow-200/50 focus:placeholder:text-gray-600 dark:focus:placeholder:text-gray-300 resize-none text-sm"
            />
          </div>
          <div className="mt-6">
            <label className="block text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cover Image
            </label>
            {coverImagePreview && (
              <div className="my-4 p-2 flex flex-row items-center gap-2 rounded-lg">
                <img
                  src={formData.coverImage}
                  alt="Cover Preview"
                  className="w-4/5 h-32 object-cover rounded-md border"
                />
                <button className='py-2 px-3 flex flex-row items-center justify-center gap-1 border rounded-lg bg-black dark:bg-gray-950 text-white shadow-sm hover:shadow-md cursor-pointer'><Upload />Change Cover Image</button>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => { handleImageManipulation(e,'coverImage')}}
              className="w-full px-4 py-3 border focus:border-yellow-300 dark:focus:border-blue-500 transition-all duration-300 rounded-md bg-background placeholder-muted-foreground focus:outline-none focus:ring-3 dark:focus:ring-blue-900/50 focus:ring-yellow-200/50 focus:placeholder:text-gray-600 dark:focus:placeholder:text-gray-300 resize-none text-sm"
            />
          </div>
          <div className="mt-6 flex justify-end">
            <Button 
            onClick={() => { handleProfileUpdate() }}
            className="cursor-pointer shadow-sm hover:shadow-md bg-yellow-400 hover:bg-yellow-500 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-all">
              Save Changes
            </Button>
          </div>
        </div>

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
      {showLogoutModal && 
      <>
      <LogoutModal closePopUp={() => { setshowLogoutModal(false) }} onLogout={() => { handleLogout() }}/> 
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
