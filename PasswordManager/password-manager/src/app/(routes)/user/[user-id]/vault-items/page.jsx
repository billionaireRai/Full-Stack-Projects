"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInactivityChecker } from '../../../../../components/useInactivityChecker.jsx';

export default function UserTotalVaultItems() {
  useInactivityChecker(process.env.NEXT_PUBLIC_INACTIVITY_CHECKER_LOGOUT);
  const [vaultItems, setVaultItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const encryptVaultData = (item) => {
    try {
      return btoa(JSON.stringify(item));
    } catch (e) {
      return "Encryption failed";
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setVaultItems([
        {
          id: 1,
          title: "Personal Documents",
          description: "A collection of scanned passports, IDs, and more.",
          size: "120 MB",
          lastModified: "2025-05-10",
          accessLevel: "Private",
          fileCount: 8,
          createdBy: "You",
          createdOn: "2024-12-01",
          tags: ["passport", "ID", "personal"],
        },
        {
          id: 2,
          title: "Shared Family Photos",
          description: "Photos shared across all family members.",
          size: "2.4 GB",
          lastModified: "2025-05-15",
          accessLevel: "Shared",
          fileCount: 432,
          createdBy: "You",
          createdOn: "2023-07-22",
          tags: ["family", "photos", "albums"],
        },
        {
          id: 3,
          title: "Work Projects",
          description: "All your ongoing and archived projects.",
          size: "800 MB",
          lastModified: "2025-04-28",
          accessLevel: "Team",
          fileCount: 112,
          createdBy: "You",
          createdOn: "2022-11-09",
          tags: ["projects", "work", "docs"],
        },
        {
          id: 4,
          title: "Encrypted Backups",
          description: "Highly secure encrypted backups of important data.",
          size: "5.2 GB",
          lastModified: "2025-05-12",
          accessLevel: "Encrypted",
          fileCount: 20,
          createdBy: "System",
          createdOn: "2024-02-19",
          tags: ["backup", "secure", "encrypted"],
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const toggleEncryptedView = (id) => {
    setSelectedItemId((prevId) => (prevId === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 px-6 py-24 text-gray-900 dark:text-gray-100">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-6 text-blue-800 dark:text-blue-400">
          🗄️ Your Vault Items
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-12 text-lg max-w-2xl mx-auto">
          View your secured vault items with metadata and encrypted content.
        </p>

        {loading ? (
          <div className="text-center py-20 text-lg text-blue-600 dark:text-blue-400 font-semibold">
            Loading your vault items...
          </div>
        ) : vaultItems.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400">No vault items found.</div>
        ) : (
          <div className="flex flex-col gap-10">
            {vaultItems.map((item) => (
              <div
                key={item.id}
                className="border border-blue-100 dark:border-blue-700 bg-blue-50 dark:bg-blue-900 p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-400">{item.title}</h2>
                      <span className="text-xs px-3 py-1 rounded-full bg-blue-200 dark:bg-blue-700 text-blue-900 dark:text-blue-300 font-medium">
                        {item.accessLevel}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm">{item.description}</p>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700 dark:text-gray-300 mb-4">
                      <div>
                        <span className="font-semibold">Size:</span> {item.size}
                      </div>
                      <div>
                        <span className="font-semibold">Files:</span> {item.fileCount}
                      </div>
                      <div>
                        <span className="font-semibold">Created On:</span> {item.createdOn}
                      </div>
                      <div>
                        <span className="font-semibold">Created By:</span> {item.createdBy}
                      </div>
                      <div>
                        <span className="font-semibold">Last Modified:</span> {item.lastModified}
                      </div>
                    </div>

                    <div className="mb-4">
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Tags:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {item.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 flex gap-4">
                      <button
                        onClick={() => toggleEncryptedView(item.id)}
                        className="bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 dark:hover:bg-blue-800 transition"
                      >
                        {selectedItemId === item.id ? "Hide & Encrypted" : "View Details"}
                      </button>
                      <button className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-4 py-2 rounded-md text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                        Share
                      </button>
                      <button className="bg-red-100 dark:bg-red-700 text-red-600 dark:text-red-400 px-4 py-2 rounded-md text-sm hover:bg-red-200 dark:hover:bg-red-600 transition">
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Encrypted View with Slide Animation */}
                  <AnimatePresence>
                    {selectedItemId === item.id && (
                      <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ duration: 0.4 }}
                        className="w-full h-full lg:w-[40%] bg-gray-900 text-green-400 p-6 rounded-xl overflow-x-auto shadow-inner"
                      >
                        <h3 className="text-lg font-semibold text-green-300 mb-2">
                          🔐 Encrypted Vault Data
                        </h3>
                        <code className="text-xs break-words whitespace-pre-wrap block">
                          {encryptVaultData(item)}
                        </code>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-20 border-t pt-10 text-center text-gray-500 dark:text-gray-400 text-sm">
          © {new Date().getFullYear()} YourSecureVault Inc. All rights reserved.
        </div>
      </div>
    </div>
  );
}
