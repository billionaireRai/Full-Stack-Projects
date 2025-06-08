"use client";
import React, { useState } from "react";
import CustomDropDown from '../../../../../components/customDropDown.jsx';
import { useInactivityChecker } from '../../../../../components/useInactivityChecker.jsx';

export default function UserVaultSettingPage() {
  useInactivityChecker(process.env.NEXT_PUBLIC_INACTIVITY_CHECKER_LOGOUT);
  const [vaultDescription, setVaultDescription] = useState("");
  const [Options, setOptions] = useState(["Personal","Team","Shared","Confidential"]);
  const [encryptedData, setEncryptedData] = useState(
    "U2FsdGVkX1+XyzEncryptedVaultData..."
  );
  const [decrypted, setDecrypted] = useState(false);

  const handleFetchVaultByDescription = () => { }
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 px-6 py-12 text-gray-900 dark:text-gray-100">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Page Header */}
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100">Vault Settings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage and update your vault configurations.
          </p>
        </div>

        {/* Vault ID Section */}
        <section className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
           <div className="mb-4">
             <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Search Vault by Description</h2>
             <p className="text-sm text-gray-500 dark:text-gray-400">
               Enter a unique vault description to find and fetch your vault securely.
             </p>
           </div>
           <div className="flex flex-col sm:flex-row gap-4">
             <input
               type="text"
               value={vaultDescription}
               onChange={(e) => setVaultDescription(e.target.value)}
               placeholder="e.g. My Crypto Wallet"
               className="flex-1 transition-all duration-300 rounded-xl border border-gray-300 dark:border-gray-600 p-3 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
             />
             <button
               onClick={handleFetchVaultByDescription}
               className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-md transition"
             >
               Fetch Vault
             </button>
           </div>
         </section>
        {/* Vault Data Section (Beautified) */}
        <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Vault Data</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                View and manage encrypted vault contents. Click below to reveal decrypted data.
              </p>
            </div>
            <button 
            onClick={() => setDecrypted(!decrypted)}
            className="cursor-pointer relative inline-block text-blue-600 dark:text-blue-400 font-medium group">
                   <span className="relative z-10">{decrypted ? "Hide Decrypted" : "Decrypt"}</span>
                   <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-blue-600 dark:bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
            </button>
          </div>

          {!decrypted ? (
            <div className="bg-gray-100 dark:bg-gray-700 border border-dashed border-gray-300 dark:border-gray-600 p-5 rounded-xl text-sm text-gray-700 dark:text-gray-300">
              <code className="block whitespace-pre-wrap break-all">{encryptedData}</code>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Vault Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Vault Information</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex flex-col justify-end">
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Vault Title</label>
                    <input
                      type="text"
                      defaultValue="Team Secure Files"
                      className="rounded-xl border outline-none transition-all duration-300 border-gray-300 dark:border-gray-600 p-3 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Category</label>
                      <CustomDropDown defaultOption='Personal' options={Options}/>
                  </div>
                  <div className="col-span-full flex flex-col gap-1 mt-2">
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Description</label>
                    <textarea
                      rows={4}
                      defaultValue="A shared vault for all secure team documents."
                      className="outline-none transition-all duration-300 rounded-xl border border-gray-300 dark:border-gray-600 p-3 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
              </div>

              {/* Access Control */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Access Control</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <label className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Make Vault Private</span>
                    <input type="checkbox" defaultChecked className="transition-all duration-300 outline-none w-5 h-5" />
                  </label>
                  <label className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Enable Link Sharing</span>
                    <input type="checkbox" className="transition-all duration-300 outline-none w-5 h-5" />
                  </label>
                </div>
              </div>

              {/* Members */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Members</h3>
                <div className="flex flex-col md:flex-row gap-4">
                  <input
                    type="email"
                    placeholder="Add member email"
                    className="min-w-xl w-auto rounded-xl border outline-none transition-all duration-300 border-gray-300 dark:border-gray-600 p-3 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  />
                  <button className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl hover:shadow-md text-sm transition">
                    Add Member
                  </button>
                </div>
                <ul className="mt-4 divide-y divide-gray-100 dark:divide-gray-700">
                  {["john@example.com", "alice@example.com"].map((email) => (
                    <li key={email} className="p-2 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900 flex justify-between items-center">
                      <span className="text-sm text-gray-800 dark:text-gray-100">{email}</span>
                      <button className="text-md text-red-500 font-medium cursor-pointer hover:underline">Remove</button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Notifications */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Notifications</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {["Vault accessed", "Vault updated", "Weekly summary"].map((label, index) => (
                    <label
                      key={index}
                      className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm"
                    >
                      <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                      <input type="checkbox" defaultChecked className="cursor-pointer transition-all duration-300 outline-none w-5 h-5" />
                    </label>
                  ))}
                </div>
              </div>

              {/* Danger Zone */}
              <div className="border-t pt-6 mt-6">
                <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">Danger Zone</h3>
                  <p className="text-sm text-red-600 dark:text-red-400 mb-4">
                    Permanently delete this vault. This action cannot be undone.
                  </p>
                  <button className="cursor-pointer border-none outline-none bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white px-6 py-3 rounded-xl text-sm transition">
                    Delete Vault
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
