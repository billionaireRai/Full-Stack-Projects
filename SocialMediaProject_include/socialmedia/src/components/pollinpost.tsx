"use client";
import React, { useState } from "react";
import { Clock } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

interface pollInfoType {
  question: string;
  options: { text: string; votes: number }[];
  duration: number;
}

interface PollInPostProps {
  poll: pollInfoType;
}

export default function PollInPost({ poll }: PollInPostProps) {
  const { resolvedTheme } = useTheme();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [votes, setVotes] = useState<number[]>(
    poll.options.map((option) => option.votes)
  );

  const handleVote = (index: number) => {
    if (!hasVoted) {
      setSelectedOption(index);
      setHasVoted(true);
      setVotes((prev) => prev.map((vote, i) => (i === index ? vote + 1 : vote)));
    }
  };

  const formatDuration = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days > 0) return `${days} day${days > 1 ? "s" : ""}`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""}`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""}`;
    return "Less than a minute";
  };

  const totalVotes = votes.reduce((a, b) => a + b, 0);

  return (
    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
      {/* Header with duration */}
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Poll ends in {formatDuration(poll.duration)}
        </span>
      </div>

      {/* Question */}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {poll.question}
      </h3>

      {/* Options */}
      <div className="space-y-3">
        {poll.options.map((option, index) => {
          const percentage = totalVotes > 0 ? (votes[index] / totalVotes) * 100 : 0;
          const hue = percentage * 1.2; // 0-120 for red to green

          return (
            <motion.div
              key={index}
              className={`relative p-3 rounded-lg border cursor-pointer transition-all ${
                hasVoted
                  ? selectedOption === index
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700"
                  : "border-gray-200 dark:border-gray-700 hover:border-yellow-300 dark:hover:border-yellow-600"
              }`}
              onClick={() => handleVote(index)}
              whileHover={!hasVoted ? { scale: 1.02 } : {}}
              whileTap={!hasVoted ? { scale: 0.98 } : {}}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-gray-900 dark:text-white ${
                    selectedOption === index ? "font-medium" : ""
                  }`}
                >
                  {option.text}
                </span>
                {hasVoted && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {votes[index]} ({percentage.toFixed(1)}%)
                    </span>
                    {selectedOption === index && (
                      <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                      </div>
                    )}
                  </div>
                )}
              </div>
              {hasVoted && (
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      backgroundColor: `hsl(${hue}, 70%, 50%)`,
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Total votes */}
      {hasVoted && (
        <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          Total votes: {totalVotes}
        </div>
      )}
    </div>
  );
}
