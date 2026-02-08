"use client";
import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { useTheme } from "next-themes";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import usePoll from "@/app/states/poll";
import Image from "next/image";
import CustomDropdown from "./customdropdown";

export interface pollInfoType {
  question: string;
  options: { text: string; votes: number }[];
  duration: number;
}

interface Option {
  value: string;
  label: string;
  priority: string;
}


export default function CreatePoll() {
  const { resolvedTheme } = useTheme();
  const { setPoll, setIsCreateOpen, setIsDisplayOpen } = usePoll();
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<{ text: string; votes: number }[]>([{ text: "", votes: 0 }, { text: "", votes: 0 }]);
  const [duration, setDuration] = useState(86400); // Default 1 day in seconds
  const [isSubmitting, setIsSubmitting] = useState(false);

  const durationOptions: Option[] = [
    { label: "5 minutes", value: "300", priority: "normal" },
    { label: "30 minutes", value: "1800", priority: "normal" },
    { label: "1 hour", value: "3600", priority: "normal" },
    { label: "6 hours", value: "21600", priority: "normal" },
    { label: "1 day", value: "86400", priority: "normal" },
    { label: "7 days", value: "604800", priority: "normal" },
  ];

  const [selectedDurationOption, setSelectedDurationOption] = useState<Option>(durationOptions[4]); // Default to 1 day

  // function for adding options
  const addOption = () => {
    if (options.length < 4) {
      setOptions([...options, { text: "", votes: 0 }]);
    }
  };

  // function for removing any option
  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  // function for updating any option
  const updateOption = (index: number, text: string) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], text };
    setOptions(newOptions);
  };

  const handleSubmit = async () => {
    if (!question.trim()) {
      toast.error("Please enter a question for your poll");
      return;
    }
    const validOptions = options.filter(option => option.text.trim());
    if (validOptions.length < 2) {
      toast.error("Please provide at least 2 options");
      return;
    }

    setIsSubmitting(true);
    try {
      setPoll({ question: question.trim(), options: validOptions.map(opt => ({ text: opt.text.trim(), votes: opt.votes })), duration: Number(selectedDurationOption.value) });
      setIsCreateOpen(false);
      setIsDisplayOpen(true);
      // Reset form
      setQuestion("");
      setOptions([{ text: "", votes: 0 }, { text: "", votes: 0 }]);
      setSelectedDurationOption(durationOptions[4]); // Reset to default
    } catch (error) {
      toast.error("Failed to create poll");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed inset-0 flex z-50 justify-center items-center p-4"
      >
        <div className="bg-white dark:bg-black rounded-xl shadow-2xl w-full max-w-4xl mx-auto border border-gray-200 dark:border-gray-700 px-6 py-4">
          {/* Header */}
          <div className="mb-6 flex items-center gap-4">
            <Image className="dark:invert" src={'/images/poll.png'} width={25} height={25} alt='poll' />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Create a Poll
            </h2>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* Question */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Question
              </label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What would you like to ask?"
                rows={3}
                maxLength={280}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-300/50 focus:border-transparent bg-white dark:bg-gray-950 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none outline-none"
              />
              <div className="text-right text-sm text-gray-500 dark:text-gray-400 mt-1">
                {question.length}/280
              </div>
            </div>
              {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                     Poll duration
                  </label>
                  <CustomDropdown
                    selectedValue={selectedDurationOption}
                    onChange={setSelectedDurationOption}
                    options={durationOptions}
                  />
                 </div>

            {/* Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Options
              </label>
              <div className="space-y-3">
                {options.map((option, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={option.text}
                        onChange={(e) => updateOption(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        maxLength={50}
                        className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-300/50 focus:border-transparent bg-white dark:bg-gray-950 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 outline-none"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">
                        {option.text.length}/50
                      </div>
                    </div>
                    {options.length > 2 && (
                      <button
                        onClick={() => removeOption(index)}
                        className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                      >
                        <Minus className="w-4 h-4 text-red-500" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {options.length < 4 && (
                <button
                  onClick={addOption}
                  className="mt-3 cursor-pointer flex items-center gap-2 px-4 py-2 text-yellow-500 hover:bg-yellow-100 dark:hover:bg-gray-950 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add option
                </button>
              )}
            </div>


          {/* Footer */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !question.trim() || options.filter(opt => opt.text.trim()).length < 2}
              className={`px-6 py-2 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl transition-colors font-medium ${isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer '}`}
            >
              {isSubmitting ? "Creating..." : "Create Poll"}
            </button>
          </div>
        </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}