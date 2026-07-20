"use client";
import React,{ useState , useEffect } from 'react';
import Usercard, { userCardProp } from './usercard';
import { SearchIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '@/lib/interceptor';
import Loader from './loader';

interface AccountSearchProps {
  onSelect: (handle: string) => void;
  placeholder?: string;
  handle:string
}

const sampleAcc: userCardProp[] = [] ;

export default function AccountSearch({ onSelect, placeholder = "Search accounts...", handle }: AccountSearchProps) {
  const [searchValue, setsearchValue] = useState<string>('') ; // storing search text...
  const [loadingSearch, setloadingSearch] = useState<boolean>(false);
  const [originalFollowings, setOriginalFollowings] = useState<userCardProp[]>(sampleAcc);
  const [searchedAccounts,setsearchedAccounts] = useState<userCardProp[]>(sampleAcc);

  // useffect for getting all the followings...
  async function apiForAllFollowings() {
    setloadingSearch(true);
    try {
      const followingapi = await axiosInstance.get(`/api/follows?handle=${handle}`) ;
      if (followingapi.status === 200) {
        setsearchedAccounts(followingapi.data.followings);
        setOriginalFollowings(followingapi.data.followings);
        setloadingSearch(false);
      }
    } catch (error) {
      console.log('An Error occured :',error);
      setloadingSearch(false);
    }
  }
  useEffect(() => {
    // apiForAllFollowings();
  }, [handle])
   
  // useeffect for handling
  useEffect(() => {
    if(!searchValue.trim()){
      setsearchedAccounts(originalFollowings); // resetting to original followings...
      return; 
    }
    async function getTheSearchedAccount(searchtext:string) {
      setloadingSearch(true);
      try {
        const searchapi = await axiosInstance.get(`/api/account?search=${searchtext}`);
        if (searchapi.status === 200) {
          setsearchedAccounts(searchapi.data.searchedAcc) ; // updating the searched accounts state..
          setloadingSearch(false);
        }
      } catch (error) {
        console.log('An Error occured :',error);
        setloadingSearch(false);
      }
    }

    const delayDebounce = setTimeout(() => {
      getTheSearchedAccount(searchValue) ;
    }, 300 );

    // cleanup previous timer on second update...
    return () => {
      clearTimeout(delayDebounce);
    }
  }, [searchValue, originalFollowings])
   

  return (
    <div className="w-[500px] max-w-2xl min-h-[400px] mx-auto flex flex-col gap-2 p-3 bg-white dark:bg-black rounded-xl">
      {/* Search Input */}
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          autoFocus
          value={searchValue}
          onChange={(e) => { setsearchValue(e.target.value)}}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 text-sm outline-none border border-transparent focus:border-yellow-400 focus:ring-3 focus:ring-yellow-400/30 rounded-md text-gray-900 dark:text-gray-100 dark:placeholder-gray-500 transition duration-300"
        />
      </div>

      <AnimatePresence>

      {/* Results */}
        {Array.isArray(searchedAccounts) && searchedAccounts.length > 0 && !loadingSearch ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-black rounded-b-lg max-h-96 overflow-y-auto overflow-x-hidden"
          >
            {searchedAccounts.map((account, index) => (
              <motion.div
                key={account.decodedHandle}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="cursor-pointer rounded-lg hover:bg-gray-50 dark:hover:bg-gray-950 transition-colors duration-150"
                onClick={() => onSelect(String(account.decodedHandle))}
              >
                <Usercard
                  decodedHandle={account.decodedHandle}
                  name={account.name}
                  content={null}
                  IsFollowing={account.IsFollowing}
                  account={account.account}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : ( 
          <Loader loadingtext={`Searching for ${searchValue.trim() ? searchValue : 'followings'}`}/>
        )}
      </AnimatePresence>
      {!searchValue.trim() && searchedAccounts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col h-full w-full items-center justify-center py-8 text-gray-500 dark:text-gray-400"
        >
          <div className="bg-yellow-100 dark:bg-gray-950 rounded-full p-4 mb-4">
            <SearchIcon className="w-12 h-12 text-yellow-400 dark:text-yellow-500" />
          </div>
          <h2 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300">Search for Accounts</h2>
          <p className="text-center text-sm max-w-xs">Type a <b>name</b> or <b>@handle</b> to tagg several accounts on the platform.</p>
        </motion.div>
      )}
    </div>
  );
}
