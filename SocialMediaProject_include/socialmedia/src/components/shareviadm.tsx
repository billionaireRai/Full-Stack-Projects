'use client';

import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { SendHorizontalIcon, X, Check, Search, UserX, Users, MessageCircleIcon } from 'lucide-react';
import axiosInstance from '@/lib/interceptor';
import Usercard, { accountInfoType } from '@/components/usercard';

interface shareViaDmProp {
  closemodal: () => void;
  link: string;
}

export default function Shareviadm({ closemodal, link }: shareViaDmProp) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<accountInfoType[]>([]);
  const [selectedAccounts, setSelectedAccounts] = useState<accountInfoType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Debounced search function...
  const searchAccounts = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const response = await axiosInstance.get(`/api/user?search=${encodeURIComponent(query)}`); // hitting search account api...
      if (response.data?.searchedAcc) {
        // Map the response to extract the nested account object
        const mappedAccounts = response.data.searchedAcc.map((item: any) => ({
          name: item.account?.name || item.name || '',
          handle: item.account?.handle || item.decodedHandle || item.handle || '',
          bio: item.account?.bio || item.content || '',
          location: item.account?.location || { text: '', coordinates: [0, 0] },
          website: item.account?.website || '',
          joinDate: item.account?.joinDate || '',
          following: item.account?.following || '0',
          followers: item.account?.followers || '0',
          Posts: item.account?.Posts || '0',
          isCompleted: item.account?.isCompleted || false,
          isVerified: item.account?.isVerified || false,
          bannerUrl: item.account?.bannerUrl || '',
          avatarUrl: item.account?.avatarUrl || ''
        }));
        setSearchResults(mappedAccounts);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching users:', error);
      toast.error('Failed to search users');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      searchAccounts(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, searchAccounts]);

  // Handle account selection && deselection
  const toggleUserSelection = (acc: accountInfoType) => {
    setSelectedAccounts((prev) => {
      const isSelected = prev.some((u) => u.handle === acc.handle);
      if (isSelected) {
        return prev.filter((u) => u.handle !== acc.handle);
      } else {
        return [...prev, acc];
      }
    });
  };

  // Check if account is selected
  const isUserSelected = (handle: string) : boolean => {
    return selectedAccounts.some((u) => u.handle === handle);
  };

  // Handle send button click
  const handleSend = async () => {
    if (selectedAccounts.length === 0) {
      toast.error('Please select at least one user');
      return;
    }
    const loading = toast.loading("Sending via DM...")
    try {
      const sendApi = await axiosInstance.post('/api/post/dm',{ link , selectedAccounts });
      if (sendApi.status === 200) {
        toast.dismiss(loading);
        toast.success(`Post sent to Selected ${selectedAccounts.length} user(s) via DM`);
        closemodal?.();
      } else {
        toast.dismiss(loading);
        toast.error("Error from server !!")
      }
    } catch (error) {
      toast.dismiss(loading);
      toast.error('An error occured !!')
    }
   }

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in-0 zoom-in-95 duration-200"
    >
      <div 
        className="bg-white dark:bg-black rounded-xl h-10/11 p-3 w-full max-w-lg relative flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
          <div className='flex flex-row items-center gap-2'>
            <MessageCircleIcon size={30} />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Send via Direct Message</h2>
          </div>
          <button 
            onClick={() => closemodal?.()}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-950 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
  
        {/* Search Bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 dark:border-gray-800">
          <Search className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <input 
            type="text" 
            placeholder="Search people"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>
  
        {/* User list */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-2">
              {searchResults.map((account,index) => (
                <div 
                  key={ index + 1 }
                  className={`cursor-pointer px-3 py-2 rounded-lg transition-colors ${
                    isUserSelected(account.handle) 
                      ? 'bg-yellow-50 dark:bg-yellow-950/30' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-900'
                  }`}
                >
                  {/* parent check box div */}
                  <div className="flex items-center gap-3">
                    {/* Selection Indicator  */}
                    <div 
                      onClick={() => toggleUserSelection(account)}
                      className="flex-shrink-0"
                    >
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isUserSelected(account.handle)
                          ? 'bg-yellow-400 border-yellow-400'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}>
                        {isUserSelected(account.handle) && (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </div>
                    </div>
                    
                    {/* User Card - Using searched account directly */}
                    <div className="flex-1" onClick={() => toggleUserSelection(account)}>
                      <Usercard
                        decodedHandle={account.handle}
                        name={account.name}
                        content={null}
                        account={account}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : hasSearched ? (
            <div className="flex flex-col items-center justify-center py-8 gap-3">
              <UserX className="w-12 h-12 text-gray-400 dark:text-gray-500" />
              <p className="text-gray-500 dark:text-gray-400 text-base text-center">No profile found yet</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 gap-3">
              <Users className="w-12 h-12 text-gray-400 dark:text-gray-500" />
              <p className="text-gray-500 dark:text-gray-400 text-base text-center">Search for people to send this post</p>
            </div>
          )}
        </div>
  
        {/* Selected Users Indicator */}
        {selectedAccounts.length > 0 && (
          <div className="px-4 py-2 bg-yellow-50 dark:bg-yellow-950/30 border-t rounded-md border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">
              {selectedAccounts.length} user{selectedAccounts.length > 1 ? 's' : ''} selected
            </p>
          </div>
        )}
  
        {/* link Sending */}
        <div className="border-t border-gray-200 dark:border-gray-800 px-4 py-3">
          <div className="flex items-center bg-gray-100 focus-within:bg-gray-200 transition-all duration-300 dark:bg-gray-900 rounded-lg px-4 py-2"> 
            <input 
              type="text" 
              value={link}
              readOnly
              className="flex-1 bg-transparent outline-none text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
            <button 
              onClick={handleSend}
              disabled={selectedAccounts.length === 0}
              className="ml-2 text-yellow-400 flex items-center gap-1 border hover:border-yellow-400 cursor-pointer py-1 px-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Send</span>
              <SendHorizontalIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
)};