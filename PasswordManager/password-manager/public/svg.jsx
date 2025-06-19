import React from 'react';

const VaultIcons = () => {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen flex items-center justify-center py-10">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 space-y-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 text-center">
          Vault Manager Icons
        </h2>

        {/* Icon Row */}
        <div className="grid grid-cols-5 gap-4 items-center justify-center text-center">

          {/* Vault Lock Icon */}
          <div className="group">
            <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 transition">
              <svg className="w-6 h-6 text-gray-500 group-hover:text-indigo-600 dark:text-gray-300 dark:group-hover:text-indigo-300 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m4-6V9a4 4 0 10-8 0v2m-2 0h12a2 2 0 012 2v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5a2 2 0 012-2z" />
              </svg>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-2">Vault</p>
          </div>

          {/* Folder Icon */}
          <div className="group">
            <div className="p-3 rounded-full bg-blue-50 dark:bg-blue-900 transition">
              <svg className="w-6 h-6 text-blue-500 group-hover:text-blue-600 dark:text-blue-300 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7a2 2 0 012-2h5l2 2h9a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
              </svg>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-2">Folder</p>
          </div>

          {/* Access Control Icon */}
          <div className="group">
            <div className="p-3 rounded-full bg-green-50 dark:bg-green-900 transition">
              <svg className="w-6 h-6 text-green-500 group-hover:text-green-600 dark:text-green-300 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-3.13a4 4 0 11-8 0 4 4 0 018 0zM17 11a4 4 0 100-8 4 4 0 000 8z" />
              </svg>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-2">Control</p>
          </div>

          {/* Analytics Icon */}
          <div className="group">
            <div className="p-3 rounded-full bg-yellow-50 dark:bg-yellow-900 transition">
              <svg className="w-6 h-6 text-yellow-500 group-hover:text-yellow-600 dark:text-yellow-300 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h10M4 14h6M4 18h4" />
              </svg>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-2">Activity</p>
          </div>

          {/* Sharing Icon */}
          <div className="group">
            <div className="p-3 rounded-full bg-purple-50 dark:bg-purple-900 transition">
              <svg className="w-6 h-6 text-purple-500 group-hover:text-purple-600 dark:text-purple-300 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 000 5.656m-3.656-5.656a4 4 0 015.656 0m-5.656 5.656a4 4 0 010-5.656M8.464 15.536a4 4 0 015.656 0" />
              </svg>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-2">Share</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default VaultIcons;
