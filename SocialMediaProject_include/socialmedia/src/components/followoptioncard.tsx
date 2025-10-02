import React, { useState } from 'react';

interface FollowOptionCardProps {
  name: string;
  username: string;
  avatarInitials: string;
  bio?: string;
  isFollowing?: boolean;
  onFollowToggle?: (newState: boolean) => void;
}

export default function FollowOptionCard({
  name,
  username,
  avatarInitials,
  bio,
  isFollowing = false,
  onFollowToggle,
}: FollowOptionCardProps) {
  const [following, setFollowing] = useState(isFollowing);

  const handleFollowToggle = () => {
    const newState = !following;
    setFollowing(newState);
    if (onFollowToggle) {
      onFollowToggle(newState);
    }
  };

  return (
    <li>
      <div className="flex flex-col sm:flex-row sm:items-start gap-4 justify-between bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-6 cursor-pointer hover:shadow-md dark:hover:shadow-gray-900 transition-colors relative">
        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
          {avatarInitials}
        </div>
        <div className="flex flex-col flex-grow min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-bold text-gray-900 dark:text-white text-sm truncate">{name}</p>
            <span className="font-bold text-gray-400">·</span>
            <p className="text-gray-500 dark:text-gray-200 text-sm truncate">@{username}</p>
          </div>
          {bio && (
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 truncate max-w-full">
              {bio}
            </p>
          )}
        </div>
        <button
          onClick={handleFollowToggle}
          className={`cursor-pointer px-4 py-2 rounded-full text-sm font-bold transition-opacity whitespace-nowrap ${
            following
              ? 'bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              : 'bg-yellow-500 dark:bg-blue-700 text-white hover:opacity-80'
          }`}
        >
          {following ? 'Following' : 'Follow'}
        </button>
      </div>
    </li>
  );
}

