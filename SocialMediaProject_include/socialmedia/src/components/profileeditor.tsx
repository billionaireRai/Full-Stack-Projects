'use client'

import React,{ useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form';
import { userInfoType } from '@/app/(routes)/[username]/page'
import { useRouter } from 'next/navigation';
import { Edit2Icon, X } from 'lucide-react'
import toast from 'react-hot-toast';

interface EditorProps {
  closePop: () => void ,
  credentials?:userInfoType,
}

export default function ProfileEditor({ closePop , credentials }: EditorProps) {
  const router = useRouter() ; // initializing useRouter...
  const editorForm = useForm() ; // initializing react-hook-form...
  const [formInfo, setformInfo] = useState<userInfoType>(credentials || {
    name: '',
    username: '',
    bio: '',
    location: '',
    website: '',
    joinDate: '',
    following: '',
    followers: '',
    Posts: '',
    isVerified: false,
    coverImage: '',
    avatar: ''
  })

  // funtion containing submittion logic...
  const formSubmittion = () => {

    toast.success('Profile updated successfully !!');
    closePop?.()  // closing the editor popup...
    router.refresh() ; // refreshing the current page...
  };

  // function for handling input changes...
  const handleInputChange = (field:keyof userInfoType,value:string) => {
    setformInfo(prev => ({ ...prev, [field]: value }))
  }

  const inputs = [
    { label: 'Name', type: 'text', placeholder: 'Enter your name', key: 'name' },
    { label: 'Username', type: 'text', placeholder: 'Enter your username', key: 'username' },
    { label: 'Location', type: 'text', placeholder: 'City, Country', key: 'location' },
    { label: 'Website', type: 'url', placeholder: 'https://yourwebsite.com', key: 'website' },
  ]

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in-0 zoom-in-95 duration-200 p-3 sm:p-4">
      <div className="bg-card text-card-foreground dark:bg-black rounded-lg shadow-2xl w-11/12 sm:w-3/4 lg:w-1/2 p-5 border border-border max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-xl flex items-center justify-center gap-2 font-semibold"><Edit2Icon/><span>Edit Profile</span></div>
          <button
            onClick={closePop}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-950 cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={editorForm.handleSubmit(formSubmittion)} className="space-y-5">
          {/* Profile Picture */}
          <div className='flex items-center'>
            <div className="flex items-center gap-4">
              <div className="w-25 h-25 rounded-full overflow-hidden border-none shadow-lg hover:shadow-xl dark:shadow-gray-950 transition-shadow duration-300 cursor-pointer">
                <Link href={"https://res.cloudinary.com/demo/image/upload/v1698765432/images/sample-img.png"}>
                  <img src={formInfo.avatar} className="w-full h-full object-cover" alt="Profile-pic" />
                </Link>
              </div>
              <button
                type="button"
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
              >
                Change Photo
              </button>
            </div>
          </div>

          {/* Input Fields */}
          {inputs.map((field, i) => (
            <div key={i}>
              <label className="block text-sm font-semibold mb-1.5">{field.label}</label>
              <input
                type={field.type}
                placeholder={field.placeholder}
                value={formInfo[field.key as keyof userInfoType] || ''}
                onChange={(e) => handleInputChange(field.key as keyof userInfoType, e.target.value)}
                className="w-full p-2.5 border focus:border-yellow-300 dark:focus:border-blue-500 transition-all duration-300 rounded-md bg-background placeholder-muted-foreground focus:outline-none focus:ring-3 dark:focus:ring-blue-400/20 focus:ring-yellow-200/20 focus:placeholder:text-gray-600 dark:focus:placeholder:text-gray-300 text-sm"
              />
            </div>
          ))}

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium mb-1.5">Bio</label>
            <textarea
              rows={3}
              placeholder="Tell us about yourself..."
              value={formInfo.bio || ''}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              className="w-full p-2.5 border focus:border-yellow-300 dark:focus:border-blue-500 transition-all duration-300 rounded-md bg-background placeholder-muted-foreground focus:outline-none focus:ring-3 dark:focus:ring-blue-400/50 focus:ring-yellow-200/50 focus:placeholder:text-gray-600 dark:focus:placeholder:text-gray-300 resize-none text-sm"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-6 mt-10 rounded-lg border-t-2 border-gray-400">
            <button
              type="button"
              onClick={closePop}
              className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-6 py-2.5 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
