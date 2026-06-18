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
    <div onClick={closeShareContact} className="fixed inset-0 bg-black/10 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in-0 zoom-in-95 duration-200">
      <AccountSearch 
        placeholder='select any account to share...' 
        onSelect={(handle) => { addInMention(handle) }} 
        handle={String(Account?.decodedHandle)}
      />
    </div>
  )
}

