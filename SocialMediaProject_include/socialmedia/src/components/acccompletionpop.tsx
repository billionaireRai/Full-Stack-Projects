import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { X } from "lucide-react";

interface componentProps {
    onClose?:() => void ; 
    onContinue?:() => void ; 
}

export default function AccCompletionPop({ onClose, onContinue } : componentProps) {
  return (
    <div className='fixed inset-0 bg-black/50 backdrop-blur-md flex z-50 items-center justify-center animate-in fade-in-0 zoom-in-95 duration-200'>
      {/* Pop-up container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="relative bg-white w-full max-w-md rounded-2xl shadow-xl py-5 px-8 border border-gray-200"
      >
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute cursor-pointer top-3 right-3 p-2 rounded-full hover:bg-gray-100 transition"
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-yellow-100 dark:bg-blue-100 text-yellow-500 dark:text-blue-600 p-4 rounded-full">
            <svg
              width="28"
              height="28"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-semibold text-gray-900 text-center">
          Complete Your Account Setup
        </h2>

        {/* Description */}
        <p className="text-gray-600 text-center text-sm mt-2 leading-relaxed">
          Completing your account helps us personalize your experience, improve security,  
          and unlock all features tailored just for you.  
          <b>It only takes a minute!</b>
        </p>

        {/* CTA */}
        <div className="mt-6 flex gap-3 justify-center">
          <button
            onClick={onClose}
            className="px-5 py-2 cursor-pointer rounded-xl border border-gray-300 hover:bg-gray-100 transition font-medium"
          >
            Maybe Later
          </button>

          <button
            onClick={onContinue}
            className="px-6 py-2 cursor-pointer rounded-xl bg-yellow-400 dark:bg-blue-500 dark:hover:bg-blue-600 text-white hover:bg-yellow-500 transition font-semibold shadow-sm"
          >
            Continue
          </button>
        </div>
      </motion.div>
    </div>
  );
}
