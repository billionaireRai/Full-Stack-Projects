"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock } from "lucide-react";
import { useTheme } from "next-themes";

interface pollInfoType {
  question: string;
  options: string[];
  duration: number;
}

interface AccountPollProps {
  poll: pollInfoType | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function AccountPoll({ poll, isOpen, onClose }: AccountPollProps) {
  const { resolvedTheme } = useTheme();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [votes, setVotes] = useState<number[]>(() =>
    poll ? poll.options.map(() => Math.floor(Math.random() * 50) + 1) : []
  );

  if (!poll) return null;

  const handleVote = (index: number) => {
    if (!hasVoted) {
      setSelectedOption(index);
      setHasVoted(true);
      setVotes(prev => prev.map((vote, i) => i === index ? vote + 1 : vote));
      // Here you would typically send the vote to your backend
    }
  };

  const formatDuration = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    return 'Less than a minute';
  };

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

              {/* Options or Results */}
              {!hasVoted ? (
                <div className="space-y-3">
                  {poll.options.map((option, index) => (
                    <motion.div
                      key={index}
                      className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-yellow-300 dark:hover:border-yellow-600 transition-all cursor-pointer"
                      onClick={() => handleVote(index)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-gray-900 dark:text-white">
                          {option}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                    Total votes: {votes.reduce((a, b) => a + b, 0)}
                  </div>
                  {poll.options.map((option, index) => {
                    const totalVotes = votes.reduce((a, b) => a + b, 0);
                    const percentage = totalVotes > 0 ? (votes[index] / totalVotes) * 100 : 0;
                    const hue = percentage * 1.2; // 0-120 for red to green
                    return (
                      <motion.div
                        key={index}
                        className={`p-4 rounded-xl border ${
                          selectedOption === index
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-gray-900 dark:text-white ${
                            selectedOption === index ? 'font-medium' : ''
                          }`}>
                            {option}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {votes[index]} ({percentage.toFixed(1)}%)
                            </span>
                            {selectedOption === index && (
                              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full" />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: `hsl(${hue}, 70%, 50%)` }}
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1, delay: index * 0.1 + 0.2 }}
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
      )}
    </AnimatePresence>
  );
}
