import React, { useState, useEffect } from 'react'
import { SearchIcon, X, UserPlus , LucideMessageCircleWarning} from 'lucide-react'
import toast from 'react-hot-toast';

export interface USER {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
}

interface addUserInListPop {
    closePop?:() => void;
    onAddUser?: (user: USER) => void;
}

export default function adduserinchatlist ({ closePop, onAddUser } : addUserInListPop) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<USER | null>(null);
  const [users, setUsers] = useState<USER[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<USER[]>([]);

  // stroing the user data in array...
  useEffect(() => {
    const mockUsers: USER[] = [
      { id: '16', name: 'John Doe', handle: 'johndoe', avatarUrl: '/images/myProfile.jpg' },
      { id: '17', name: 'Jane Smith', handle: 'janesmith', avatarUrl: '/images/myProfile.jpg' },
      { id: '18', name: 'Mike Johnson', handle: 'mikej', avatarUrl: '/images/myProfile.jpg' },
      { id: '19', name: 'Sarah Wilson', handle: 'sarahw', avatarUrl: '/images/myProfile.jpg' },
      { id: '20', name: 'Tom Brown', handle: 'tombrown', avatarUrl: '/images/myProfile.jpg' },
      { id: '21', name: 'David lee', handle: 'davidlee', avatarUrl: '/images/myProfile.jpg' },
    ];
    setUsers(mockUsers);
    setFilteredUsers(mockUsers);
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.handle.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchQuery, users]);

  // function for handling to add user...
  const handleAddUser = () => {
    if (selectedUser && onAddUser) {
      onAddUser(selectedUser);
      closePop?.();
      toast.success(`Added ${selectedUser.name} to chat list`);
    }
    else {    
      toast.error('Either User OR Handler not present !!') ;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex justify-center z-50 animate-in fade-in-0 zoom-in-95 duration-200">
      <div className="bg-white dark:bg-black rounded-lg shadow-xl w-full max-w-lg mt-10 p-2 max-h-2/3 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Add User to Chat</h2>
          <button
            onClick={closePop}
            className="p-1 cursor-pointer rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <SearchIcon size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:focus:ring-blue-400 transition-all duration-300"
            />
          </div>
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-950 transition-colors ${
                  selectedUser?.id === user.id ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-yellow-400 dark:border-blue-500' : ''
                }`}
              >
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">{user.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">@{user.handle}</p>
                </div>
                {selectedUser?.id === user.id && (
                  <div className="w-4 h-4 bg-yellow-400 dark:bg-blue-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center p-4 gap-2 font-bold text-gray-600 dark:text-gray-400">
              <LucideMessageCircleWarning /><span>No users found '{searchQuery}'</span>
            </div>
          )}
        </div>

        {/* Add Button */}
        {selectedUser && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleAddUser}
              className="w-full flex items-center cursor-pointer justify-center gap-2 bg-yellow-400 dark:bg-blue-500 hover:bg-yellow-500 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <UserPlus size={20} />
              Add {selectedUser.name} to Chat
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

