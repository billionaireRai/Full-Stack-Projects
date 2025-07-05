'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Dropdown = ({ info, onRemove }) => {
  return (
    <AnimatePresence>
      {info?.isVisible && (
        <motion.div
          key={`dropdown-${info.id}`}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="absolute z-50 top-full left-1/2 transform -translate-x-1/2 mt-3 w-72 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-4 space-y-3 transition-all duration-300 ease-in-out text-sm text-gray-800 dark:text-gray-100"
        >
          {/* Arrow */}
          <div className="absolute left-1/2 top-0 w-3 z-0 h-3 bg-white dark:bg-gray-900 transform -translate-x-1/2 -translate-y-1/2 rotate-45 border-t border-l border-gray-200 dark:border-gray-700 shadow-md" />

          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-gray-700 dark:text-gray-100 text-base">
              Shared With
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {info.sharedWith?.length || 0} member{info.sharedWith?.length === 1 ? '' : 's'}
            </span>
          </div>

          {/* Shared Users List */}
          <ul className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar pr-1">
            {info.sharedWith?.length > 0 ? (
              info.sharedWith.map((sharedUser, index) => (
                <li
                  key={sharedUser.id || index}
                  className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-red-100 hover:text-red-800 dark:hover:bg-red-900 transition-colors group"
                >
                  <button
                    onClick={() => onRemove(sharedUser,info._id)}
                    className="text-black cursor-pointer hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                    title="Remove Access"
                    aria-label={`Remove access for ${sharedUser.email}`}
                  >
                    {sharedUser}
                  </button>
                </li>
              ))
            ) : (
              <li className="text-center text-gray-400 dark:text-gray-500 px-2 py-3">
                No members have access yet.
              </li>
            )}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Dropdown;
