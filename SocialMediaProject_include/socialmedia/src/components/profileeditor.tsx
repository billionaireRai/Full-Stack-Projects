'use client'

import React,{ useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form';
import { accountType } from '@/app/states/useraccounts';
import { locationTextRegex } from '@/app/controllers/regex';
import { useRouter } from 'next/navigation';
import { Edit2Icon, X } from 'lucide-react'
import toast from 'react-hot-toast';
import axiosInstance from '@/lib/interceptor';

interface EditorProps {
  closePop: () => void ,
  credentials?:accountType,
}

export default function ProfileEditor({ closePop , credentials }: EditorProps) {
  const router = useRouter() ; // initializing useRouter...
  const editorForm = useForm() ; // initializing react-hook-form...
  const [formInfo, setformInfo] = useState<accountType>(credentials || {
    name: "John Doe",
    handle: "johndoe",
    bio: "Digital creator • Photography enthusiast • Coffee lover • Building amazing things one line of code at a time",
    location: {
       text:'San Francisco, CA',
       coordinates: [28.450637197292124, 77.14711048980648] as [number, number],
    },
    website: "https://www.johndoe-portfolio.com",
    joinDate: "Joined March 2012",
    following: '542',
    followers: '187k',
    Posts: "3,245",
    isCompleted:false,
    isVerified: false,
    bannerUrl: "/images/default-banner.jpg",
    avatarUrl: "/images/default-profile-pic.png"
  })

  const [locationError, setLocationError] = useState('');

  // funtion containing submittion logic...
  const formSubmittion = async () => {
    const loadingtoast = toast.loading('Updating your details...')
    if (locationError) {
      toast.error('Please fix the location format before submitting.');
      return;
    }
    try {
      const api = await axiosInstance.put('/api/profile',{ updatedData:formInfo });
      if (api.status === 200) {
        closePop?.()  // closing the editor popup...
        toast.dismiss(loadingtoast);
        toast.success('profile updated successfully !!');
        router.refresh() ; // refreshing the current page...
      } else {
        closePop?.()
        toast.dismiss(loadingtoast);
        toast.error('profile updation failed...');
      }
    } catch (error) {
      console.log(error)
    }
  };

  // refs for file inputs
  const avatarInputRef = React.useRef<HTMLInputElement>(null);
  const bannerInputRef = React.useRef<HTMLInputElement>(null);

  // function for handling input changes...
  const handleInputChange = (field:keyof accountType,value:string) => {
    if (field === 'location') {
      setformInfo(prev => ({ ...prev, location: { ...prev.location, text: value } }))
      if (value && !locationTextRegex.test(value)) {
        setLocationError('Location must be in the format "City, ST" (e.g., San Francisco, CA)');
      } else {
        setLocationError('');
      }
    } else {
      setformInfo(prev => ({ ...prev, [field]: value }))
    }
  }

  const inputs = [
    { label: 'Name', type: 'text', placeholder: 'Enter your name', key: 'name' },
    { label: 'Handle', type: 'text', placeholder: 'Enter your handle', key: 'handle' },
    { label: 'Location', type: 'text', placeholder: 'City, Country', key: 'location' },
    { label: 'Website', type: 'url', placeholder: 'https://yourwebsite.com', key: 'website' },
  ]

  // function for handling media upload...
  const handleMediaUpload = async (e:React.ChangeEvent<HTMLInputElement>,For:'avatarUrl' | 'bannerUrl') => {
    const title = For.substring(0,For.length - 3) ;
    const loadingtoast = toast.loading(`uploading you ${title}`)
    const currentUrl = formInfo[For] ;
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      try {
        const formData = new FormData(); // making new fordata instance...
        formData.append('file', file);
        if (currentUrl.split('SEP')[1]) {
          formData.append('previousPublicId',currentUrl.split('SEP')[1]) ;
        }
        const response = await axiosInstance.post('/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (response.status === 200 && response.data.success) {
          setformInfo(prev => ({ ...prev, [For]: `${response.data.url}SEP${response.data.public_id}` }));
          toast.dismiss(loadingtoast);
          toast.success(`${title} uploaded successfully !!`);
        } else {
          toast.dismiss(loadingtoast)
          toast.error('Failed to upload image');
        }
      } catch (error) {
         console.error('Upload error:', error);
         toast.dismiss(loadingtoast)
         toast.error('Upload failed');
      }
    }
  }
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
            <div className="flex items-center justify-center gap-4">
              <div className="w-25 h-25 rounded-full overflow-hidden border-none shadow-lg hover:shadow-xl dark:shadow-gray-950 transition-shadow duration-300 cursor-pointer">
                <Link href={String(formInfo.avatarUrl).split('SEP')[0]}>
                  <img src={String(formInfo.avatarUrl).split('SEP')[0]} className="w-full h-full object-cover" alt="Profile-pic" />
                </Link>
              </div>
              <button
                onClick={() => avatarInputRef.current?.click()}
                type="button"
                className="bg-yellow-400 dark:text-white hover:bg-yellow-500 px-4 py-2 rounded-lg text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
              >
                Change Avatar
              </button>
              <input
                type="file"
                accept="image/*"
                ref={avatarInputRef}
                onChange={async (e) => { handleMediaUpload(e,'avatarUrl')}}
                className="hidden"
              />
              <div className="w-25 h-25 rounded-full overflow-hidden border-none shadow-lg hover:shadow-xl dark:shadow-gray-950 transition-shadow duration-300 cursor-pointer">
                <Link href={String(formInfo.bannerUrl).split('SEP')[0]}>
                  <img src={String(formInfo.bannerUrl).split('SEP')[0]} className="w-full h-full object-cover" alt="Profile-pic" />
                </Link>
              </div>
              <button
                onClick={() => bannerInputRef.current?.click()}
                type="button"
                className="bg-yellow-400 dark:text-white hover:bg-yellow-500 px-4 py-2 rounded-lg text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
              >
                change Banner
              </button>
              <input
                type="file"
                accept="image/*"
                ref={bannerInputRef}
                onChange={(e) => { handleMediaUpload(e,'bannerUrl')}}
                className="hidden"
              />
            </div>
          </div>

          {/* Input Fields */}
          {inputs.map((field, i) => (
            <div key={i}>
              <label className="block text-sm font-semibold mb-1.5">{field.label}</label>
              <input
                type={field.type}
                placeholder={field.placeholder}
                value={(field.key === 'location' ? formInfo.location.text : formInfo[field.key as 'name' | 'handle' | 'website']) as string}
                onChange={(e) => handleInputChange(field.key as keyof accountType, e.target.value)}
                className={`w-full p-2.5 border focus:border-yellow-300 dark:focus:border-blue-500 transition-all duration-300 rounded-md bg-background placeholder-muted-foreground focus:outline-none focus:ring-3 dark:focus:ring-blue-400/20 focus:ring-yellow-200/20 focus:placeholder:text-gray-600 dark:focus:placeholder:text-gray-300 text-sm ${field.key === 'location' && locationError ? 'border-red-500' : ''}`}
              />
              {field.key === 'location' && locationError && (
                <p className="text-red-500 text-xs mt-1">{locationError}</p>
              )}
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
          <div className="flex justify-end space-x-3 pt-6 mt-10 rounded-lg border-t-2 border-gray-200">
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
