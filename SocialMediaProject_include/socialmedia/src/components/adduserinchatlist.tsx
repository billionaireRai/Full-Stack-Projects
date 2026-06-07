'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { SearchIcon, X, UserPlus, LucideMessageCircleWarning, MessageCircleMoreIcon } from 'lucide-react'
import toast from 'react-hot-toast'

export interface Acctype {
  id: string
  name: string
  handle: string
  avatarUrl: string
}

interface addUserInListPop {
  closePop?: () => void
  onAddChat?: (user: Acctype) => void
}

export default function adduserinchatlist({ closePop, onAddChat }: addUserInListPop) {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedAcc, setSelectedAcc] = useState<Acctype>();
  const [Accounts, setAccounts] = useState<Acctype[]>([])

  useEffect(() => {
    const mockAccs: Acctype[] = [
      { id: '16', name: 'John Doe', handle: '@johndoe', avatarUrl: '/images/myProfile.jpg' },
      { id: '17', name: 'Jane Smith', handle: '@janesmith', avatarUrl: '/images/myProfile.jpg' },
      { id: '18', name: 'Mike Johnson', handle: '@mikej', avatarUrl: '/images/myProfile.jpg' },
      { id: '19', name: 'Sarah Wilson', handle: '@sarahw', avatarUrl: '/images/myProfile.jpg' },
      { id: '20', name: 'Tom Brown', handle: '@tombrown', avatarUrl: '/images/myProfile.jpg' },
      { id: '21', name: 'David lee', handle: '@davidlee', avatarUrl: '/images/myProfile.jpg' },
    ]
    setAccounts(mockAccs)
  }, [])

  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return Accounts ;

    return Accounts.filter((user) =>
      [user.name, user.handle].some((field) => field.toLowerCase().includes(q.toLowerCase()))
    )
  }, [searchQuery, Accounts])

  const handleAddAcc = () => {
    // by axios creating a new conversation...
    if (selectedAcc && onAddChat) {
      onAddChat(selectedAcc)
      closePop?.()
      toast.success(`Added ${selectedAcc.handle} to chat list...`)
      return
    }

    toast.error('Either Account OR Handler not present !!')
  }

  return (
   <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in-0 zoom-in-95 duration-200">
      <div className="w-full max-h-fit max-w-lg rounded-xl border border-gray-200 dark:border-gray-900 bg-white/95 dark:bg-black/95 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-900">
         <div className='flex items-center justify-start gap-1'>
          <MessageCircleMoreIcon size={25} />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Select an account to add...
          </h2>
         </div>
          <button
            onClick={closePop}
            className="p-2 cursor-pointer rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b rounded-lg border-gray-200 dark:border-gray-900">
          <div className="relative">
            <SearchIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 outline-none focus:border-yellow-400 focus:ring-3 focus:ring-yellow-400/30  transition"
              autoFocus
            />
          </div>
        </div>

        {/* List */}
        <div className="max-h-[50vh] overflow-y-auto">
          {filteredUsers.length > 0 ? (
            <div className="p-2">
              {filteredUsers.map((user) => {
                const isSelected = selectedAcc?.id === user.id
                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => setSelectedAcc(user)}
                    className={`cursor-pointer hover:shadow-md dark:shadow-gray-900 w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg transition-colors outline-none ring-0 hover:bg-gray-50 dark:hover:bg-black ${
                      isSelected ? 'bg-yellow-50 dark:bg-yellow-900/20 ring-1 ring-yellow-400/50' : ''
                    }`}
                  >
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">{user.name}</h3>
                        {isSelected && (
                          <span className="shrink-0 w-6 h-6 rounded-full bg-yellow-400/90 text-black dark:text-white flex items-center justify-center">
                            ✓
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.handle}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center p-6 gap-2 text-gray-600 dark:text-gray-400 font-medium">
              <LucideMessageCircleWarning size={18} />
              <span>No users found "<b>{searchQuery}</b>"</span>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="px-4 py-3 border-t rounded-lg border-gray-200 dark:border-gray-900">
          <button
            type="button"
            onClick={handleAddAcc}
            disabled={!selectedAcc}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ring-1 ring-yellow-400/50 bg-yellow-400 text-black hover:bg-yellow-500 dark:hover:bg-yellow-500 dark:bg-yellow-400 dark:text-black`}
          >
            <UserPlus size={18} />
            {selectedAcc ? <span>Add <b>{selectedAcc.handle}</b> to chat</span> : 'Select an Account to add'}
          </button>
        </div>
      </div>
    </div>
  )
}


