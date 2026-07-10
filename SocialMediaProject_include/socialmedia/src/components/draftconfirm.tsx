"use client";

import React from "react";
import { MdDrafts } from "react-icons/md";

interface DraftConfirmPopProps {
  onConfirm?: () => void | Promise<void>;
}

export default function DraftConfirmPop({ onConfirm }: DraftConfirmPopProps) {
  return (
          <div
            className="bg-white draft-post dark:bg-black rounded-xl shadow-2xl border border-gray-200 dark:border-zinc-900 w-full max-w-sm"
          >
            <div className="flex justify-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-zinc-950">
              <MdDrafts size={40} />
              <div>
                <h2 className="text-black text-start dark:text-white text-lg font-bold">Save post as draft ?</h2>
                <p className="text-gray-700 dark:text-gray-300 text-start text-xs mt-1">Your post will be saved as a draft, You can finish & publish it later for your audience...</p>
              </div>
            </div>

            <div className="px-5 py-4 flex items-center justify-center gap-3">
              <div
                onClick={ async () => { onConfirm?.() }}
                className="cursor-pointer text-center flex-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Save draft
              </div>
            </div>
          </div>
  );
}

