"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock } from "lucide-react";

interface pollInfoType {
  question: string;
  options: { text:string , votes:number }[];
  duration: number;
}

interface AccountPollProps {
  poll: pollInfoType | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function AccountPoll({ poll, isOpen, onClose }: AccountPollProps) {
  if (!poll) return null;

  const formatDuration = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    return 'Less than a minute';
  };

  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white dark:bg-black rounded-2xl shadow-2xl h-fit mx-auto border border-gray-200 dark:border-gray-700"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 mx-2 rounded-lg border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Poll ends in {formatDuration(poll.duration)}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 cursor-pointer rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Question */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {poll.question}
              </h3>
            </div>

            {/* Options */}
            <div className="space-y-4">
              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                Total votes: {totalVotes}
              </div>
              {poll.options.map((option, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900 dark:text-white">
                      {option.text}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {option.votes} votes
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
