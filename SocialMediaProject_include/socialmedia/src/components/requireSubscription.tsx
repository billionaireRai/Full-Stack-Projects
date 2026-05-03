import Link from 'next/link';
import React from 'react';
import { MdLock } from 'react-icons/md';
import { motion } from 'framer-motion';

interface RequireSubscriptionProps {
  isOpen: boolean;
  onClose: () => void;
  planname:string;
}

export default function RequireSubscription({ isOpen, onClose , planname }: RequireSubscriptionProps) {
  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div className="bg-white dark:bg-black rounded-lg p-6 max-w-lg w-full mx-4 border border-black-300">
        <div className='flex items-center gap-3 mb-4'>
          <MdLock size={25} />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Upgrade Subscription to {planname}</h2>
        </div>
          <p className="mb-6 text-sm text-gray-700 dark:text-gray-300">
            This feature requires a subscription to {planname} to unlock its full potential. With our subscription plan, you'll gain access to advanced tools, unlimited posts, priority support, and exclusive insights.
          </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors cursor-pointer"
          >
            Close
          </button>
          <Link
            href={'/subscription?utm_source=upgrade-pop'}
            className="px-4 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition-colors cursor-pointer"
          >
            Upgrade Now
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
