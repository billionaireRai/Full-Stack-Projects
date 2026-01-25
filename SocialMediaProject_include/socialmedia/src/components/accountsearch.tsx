"use client";
import React,{ useState , useEffect } from 'react';
import Usercard, { userCardProp } from './usercard';
import { SearchIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '@/lib/interceptor';

interface AccountSearchProps {
  onSelect: (handle: string) => void;
  placeholder?: string;
}


export default function AccountSearch({ onSelect, placeholder = "Search accounts..." }: AccountSearchProps) {
  const [searchValue, setsearchValue] = useState<string>('') ; // storing search text...
 // Sample account data
const [searchedAccounts,setsearchedAccounts] = useState<userCardProp[]>([
  {
    decodedHandle: 'johndoe',
    name: 'John Doe',
    content: 'Tech enthusiast | Coffee lover | Building the future',
    IsFollowing: false,
    account: {
      name: 'John Doe',
      handle: '@johndoe',
      bio: 'Tech enthusiast | Coffee lover | Building the future one line at a time',
      location: {
        text: 'San Francisco, CA',
        coordinates: [-122.4194, 37.7749],
      },
      website: 'https://johndoe.dev',
      joinDate: 'March 2019',
      following: '342',
      followers: '1,247',
      Posts: '89',
      isCompleted: true,
      isVerified: true,
      bannerUrl: 'https://img.freepik.com/premium-photo/wide-banner-with-many-random-square-hexagons-charcoal-dark-black-color_105589-1820.jpg',
      avatarUrl: '/images/myProfile.jpg'
    }
  },
  {
    decodedHandle: 'sarahsmith',
    name: 'Sarah Smith',
    content: 'UX Designer | Passionate about creating beautiful interfaces',
    IsFollowing: true,
    account: {
      name: 'Sarah Smith',
      handle: '@sarahsmith',
      bio: 'UX Designer | Passionate about creating beautiful interfaces and user experiences',
      location: {
        text: 'New York, NY',
        coordinates: [-74.0060, 40.7128],
      },
      website: 'https://sarahsmith.design',
      joinDate: 'January 2020',
      following: '156',
      followers: '892',
      Posts: '45',
      isCompleted: true,
      isVerified: false,
      bannerUrl: 'https://img.freepik.com/premium-photo/wide-banner-with-many-random-square-hexagons-charcoal-dark-black-color_105589-1820.jpg',
      avatarUrl: '/images/default-profile-pic.png'
    }
  },
  {
    decodedHandle: 'mikewilson',
    name: 'Mike Wilson',
    content: 'Full Stack Developer | Open source contributor',
    IsFollowing: false,
    account: {
      name: 'Mike Wilson',
      handle: '@mikewilson',
      bio: 'Full Stack Developer | Open source contributor | Always learning new technologies',
      location: {
        text: 'Austin, TX',
        coordinates: [-97.7431, 30.2672],
      },
      website: 'https://mikewilson.dev',
      joinDate: 'July 2018',
      following: '278',
      followers: '1,543',
      Posts: '123',
      isCompleted: true,
      isVerified: true,
      bannerUrl: 'https://img.freepik.com/premium-photo/wide-banner-with-many-random-square-hexagons-charcoal-dark-black-color_105589-1820.jpg',
      avatarUrl: '/images/default-profile-pic.png'
    }
  },
  {
    decodedHandle: 'emilydavis',
    name: 'Emily Davis',
    content: 'Data Scientist | AI enthusiast | Exploring the world of machine learning',
    IsFollowing: false,
    account: {
      name: 'Emily Davis',
      handle: '@emilydavis',
      bio: 'Data Scientist | AI enthusiast | Exploring the world of machine learning and big data',
      location: {
        text: 'Seattle, WA',
        coordinates: [-122.3321, 47.6062],
      },
      website: 'https://emilydavis.ai',
      joinDate: 'September 2021',
      following: '198',
      followers: '756',
      Posts: '67',
      isCompleted: true,
      isVerified: false,
      bannerUrl: 'https://img.freepik.com/premium-photo/wide-banner-with-many-random-square-hexagons-charcoal-dark-black-color_105589-1820.jpg',
      avatarUrl: '/images/default-profile-pic.png'
    }
  },
  {
    decodedHandle: 'alexjohnson',
    name: 'Alex Johnson',
    content: 'Graphic Designer | Illustrator | Bringing ideas to life through art',
    IsFollowing: true,
    account: {
      name: 'Alex Johnson',
      handle: '@alexjohnson',
      bio: 'Graphic Designer | Illustrator | Bringing ideas to life through art and creativity',
      location: {
        text: 'Los Angeles, CA',
        coordinates: [-118.2437, 34.0522],
      },
      website: 'https://alexjohnson.design',
      joinDate: 'April 2017',
      following: '412',
      followers: '2,134',
      Posts: '156',
      isCompleted: true,
      isVerified: true,
      bannerUrl: 'https://img.freepik.com/premium-photo/wide-banner-with-many-random-square-hexagons-charcoal-dark-black-color_105589-1820.jpg',
      avatarUrl: '/images/default-profile-pic.png'
    }
  },
  {
    decodedHandle: 'lisabrown',
    name: 'Lisa Brown',
    content: 'Marketing Specialist | Content Creator | Storytelling expert',
    IsFollowing: false,
    account: {
      name: 'Lisa Brown',
      handle: '@lisabrown',
      bio: 'Marketing Specialist | Content Creator | Storytelling expert | Passionate about brands',
      location: {
        text: 'Chicago, IL',
        coordinates: [-87.6298, 41.8781],
      },
      website: 'https://lisabrown.marketing',
      joinDate: 'November 2019',
      following: '234',
      followers: '1,089',
      Posts: '98',
      isCompleted: true,
      isVerified: false,
      bannerUrl: 'https://img.freepik.com/premium-photo/wide-banner-with-many-random-square-hexagons-charcoal-dark-black-color_105589-1820.jpg',
      avatarUrl: '/images/default-profile-pic.png'
    }
  },
  {
    decodedHandle: 'davidlee',
    name: 'David Lee',
    content: 'Software Engineer | Cybersecurity expert | Protecting digital worlds',
    IsFollowing: true,
    account: {
      name: 'David Lee',
      handle: '@davidlee',
      bio: 'Software Engineer | Cybersecurity expert | Protecting digital worlds one code at a time',
      location: {
        text: 'Boston, MA',
        coordinates: [-71.0589, 42.3601],
      },
      website: 'https://davidlee.security',
      joinDate: 'June 2016',
      following: '567',
      followers: '3,421',
      Posts: '201',
      isCompleted: true,
      isVerified: true,
      bannerUrl: 'https://img.freepik.com/premium-photo/wide-banner-with-many-random-square-hexagons-charcoal-dark-black-color_105589-1820.jpg',
      avatarUrl: '/images/default-profile-pic.png'
    }
  },
  {
    decodedHandle: 'jessicawang',
    name: 'Jessica Wang',
    content: 'Entrepreneur | Startup founder | Innovating in fintech',
    IsFollowing: false,
    account: {
      name: 'Jessica Wang',
      handle: '@jessicawang',
      bio: 'Entrepreneur | Startup founder | Innovating in fintech | Building the future of finance',
      location: {
        text: 'Miami, FL',
        coordinates: [-80.1918, 25.7617],
      },
      website: 'https://jessicawang.fintech',
      joinDate: 'February 2022',
      following: '145',
      followers: '623',
      Posts: '34',
      isCompleted: true,
      isVerified: false,
      bannerUrl: 'https://img.freepik.com/premium-photo/wide-banner-with-many-random-square-hexagons-charcoal-dark-black-color_105589-1820.jpg',
      avatarUrl: '/images/default-profile-pic.png'
    }
  }
]);

   // useeffect for handling 
   useEffect(() => {
    async function getTheSearchedAccount(searchtext:string) {
      try {
        const searchapi = await axiosInstance.get(`/api/user?search=${searchtext}`);
      } catch (error) {
        
      }
    }
   }, [searchValue])
   

  return (
    <div className="w-[400px] max-w-xl mx-auto flex flex-col gap-2 p-3 bg-white dark:bg-black rounded-xl">
      {/* Search Input */}
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => { setsearchValue(e.target.value)}}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 text-sm outline-none border-none rounded-t-lg bg-white dark:bg-black text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
        />
      </div>

      {/* Results */}
      <AnimatePresence>
        {searchedAccounts && searchedAccounts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-black rounded-b-lg max-h-96 overflow-y-auto overflow-x-hidden"
          >
            {searchedAccounts.map((account, index) => (
              <motion.div
                key={account.decodedHandle || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="cursor-pointer rounded-lg hover:bg-gray-50 dark:hover:bg-gray-950 transition-colors duration-150"
                onClick={() => onSelect(account.decodedHandle || '')}
              >
                <Usercard
                  decodedHandle={account.decodedHandle || ''}
                  name={account.name || ''}
                  content={null}
                  IsFollowing={account.IsFollowing}
                  account={account.account}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
