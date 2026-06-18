import React, { useState , useMemo , useEffect, useRef } from 'react'
import { X, Check, Search, Share2Icon } from 'lucide-react'
import useActiveAccount from '@/app/states/useraccounts'
import toast from 'react-hot-toast'
import AccountSearch from './accountsearch'

interface User {
  id: string
  name: string
  username: string
  avatarInitials: string
}

interface shareContactProp {
    closeShareContact:() => void
    addInMention:(username:string) => void
}

export default function sharecontactonchat ({ closeShareContact ,addInMention } : shareContactProp) {
  const { Account } = useActiveAccount() ; // intializing active account state...

  return (
      <div className='rounded-xl h-3/4 flex flex-col items-center justify-center bg-white dark:bg-black p-3'>
        <AccountSearch 
          placeholder='select any account to share...' 
          onSelect={(handle) => { addInMention(handle) }} 
          handle={String(Account?.decodedHandle)}
        />
        <button
          type="button"
          onClick={closeShareContact}
          className="my-2 w-1/2 cursor-pointer rounded-full border border-red-600/50 bg-red-600/10 px-3 py-2 text-center font-semibold text-red-700 transition hover:bg-red-600/20 focus:outline-none focus:ring-2 focus:ring-red-500/60"
        >
          Close
        </button>
      </div>
  )
}

