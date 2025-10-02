import React from "react";
import Image from "next/image";

interface dropdownProp {
  setNumber?: () => void;
}

export default function trendcancelpop({ setNumber }: dropdownProp) {
  return (
    <div className="absolute flex flex-col animate-in slide-in-from-top-2 duration-200 gap-1.5 right-0 mt-2 w-[300px] bg-white dark:bg-black dark:shadow-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 z-50 p-2">
      <button
        onClick={() => {setNumber}}
        className="w-full text-left px-4 py-2 cursor-pointer rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-950 rounded-t-lg"
      >
    <span>🤷 content is not relevant</span>
      </button>
      <button
        onClick={() => {setNumber}}
        className="w-full text-left px-4 py-2 cursor-pointer rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-950"
      >
    <span>🚫 This trend is spam</span>
      </button>
      <button
        onClick={() => {
          
        }}
        className="w-full text-left px-4 py-2 cursor-pointer rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-950"
      >
    <span>⚠️ This trend is abusive OR harmful</span>
      </button>
      <button
        onClick={() => {setNumber}}
        className="w-full text-left px-4 py-2 cursor-pointer rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-950"
      >
<span>😴 Not interested in this</span>
      </button>
      <button
        onClick={() => {setNumber}}
        className="w-full text-left px-4 py-2 cursor-pointer rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-950"
      >
        <span>🔄 This trend is a duplicate</span>
      </button>
      <button
        onClick={() => {setNumber}}
        className="w-full text-left px-4 py-2 cursor-pointer rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-950"
      >
    <span>🚫 This trend is spammy</span>
      </button>
      <button
        onClick={() => {setNumber}}
        className="w-full text-left px-4 py-2 cursor-pointer rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-950 rounded-b-lg"
      >
    <span>🚫 Don't want to see this ad</span>
      </button>
    </div>
  );
}
