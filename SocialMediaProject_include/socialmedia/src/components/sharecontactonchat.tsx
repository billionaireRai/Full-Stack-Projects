import React, { useState , useMemo , useEffect, useRef } from 'react'
import { X, Check, Search } from 'lucide-react'
import toast from 'react-hot-toast'

interface User {
  id: string
  name: string
  username: string
  avatarInitials: string
}

interface shareContactProp {
    closeShareContact?:() => void
    onSend?: (selectedUsers: User[]) => void
}

// random data just for checking functionalities...
const mockUsers: User[] = [
  { id: '1', name: 'Alice Johnson', username: 'alicej', avatarInitials: 'AJ' },
  { id: '2', name: 'Bob Smith', username: 'bobsmith', avatarInitials: 'BS' },
  { id: '3', name: 'Charlie Brown', username: 'charlieb', avatarInitials: 'CB' },
  { id: '4', name: 'Diana Prince', username: 'dianap', avatarInitials: 'DP' },
  { id: '5', name: 'Eve Wilson', username: 'evew', avatarInitials: 'EW' },
]

export default function sharecontactonchat ({ closeShareContact, onSend } : shareContactProp) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [members, setmembers] = useState<User[]>(mockUsers) ; // will update this with acctual follwers and followings...
  const [filtereMembers, setfiltereMembers] = useState<User[]>([]) ;
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])  // state for selcted users..
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // memoizing the repetative computation...
  const filteredUsers = useMemo(() => {
    return members.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    )
  },[searchQuery])

  useEffect(() => {
    setfiltereMembers(filteredUsers)
  }, [searchQuery])
  

  // function containing logic realted to user toggle...
  const toggleUserSelection = (user: User) => {
    setSelectedUsers(prev =>
      prev.find(u => u.id === user.id) ? prev.filter(u => u.id !== user.id) : [...prev, user]
    )
  }

  // handling the onSend execution...
  const handleSend = () => {
    if (onSend) onSend(selectedUsers) ;
    closeShareContact?.()
    toast.success('Contact successfully shared !!') ;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in-0 zoom-in-95 duration-200">
      <div className="bg-white dark:bg-black rounded-lg shadow-xl p-6 w-full max-w-md mx-4 max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Share Contact</h2>
          <button
            onClick={closeShareContact}
            className="text-gray-500 p-1 rounded-full cursor-pointer hover:bg-gray-100"
          >
            <X width={20} height={20}/>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto mb-4">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 transition-all duration-100 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-2 dark:focus:border-blue-500 focus:border-yellow-300 focus:outline-none"
            />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Select users from your followings and followers:</p>
          <ul className="space-y-2">
            {filtereMembers.map(user => (
              <li 
              key={user.id} 
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-950 cursor-pointer" 
              onClick={() => toggleUserSelection(user)}>
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {user.avatarInitials}
                  </div>
                  {selectedUsers.find(u => u.id === user.id) && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate">{user.name}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs truncate">@{user.username}</p>
                </div>
              </li>
            ))}
            { filtereMembers.length === 0 && (
              <div className='rounded-lg text-center p-4'>
                No user found related to '<span className='font-semibold'>{searchQuery}</span>'
              </div>
            )}
          </ul>
        </div>
        {selectedUsers.length > 0 && (
          <div className="flex justify-end">
            <button onClick={handleSend} className="px-6 py-2 rounded-lg cursor-pointer bg-yellow-400 dark:bg-blue-500">
              Send To ({selectedUsers.length})
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

