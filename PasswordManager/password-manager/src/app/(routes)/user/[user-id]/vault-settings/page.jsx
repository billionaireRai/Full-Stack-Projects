"use client";
import CustomSelect from '@/components/customSelect.jsx';
import React, { useState } from "react";
import VaultNavbar from '@/components/navbar';
import { useInactivityChecker } from '@/components/useInactivityChecker.jsx';
import { motion } from "framer-motion";
import axios from 'axios';

export default function UserVaultSettingPage() {
  useInactivityChecker(process.env.NEXT_PUBLIC_INACTIVITY_CHECKER_LOGOUT);
  const [vaultDescription, setVaultDescription] = useState("");
  const [Options, setOptions] = useState([
    {label:"private",value:"private"},
    {label:"shared",value:'shared'},
  ]);
  const [selectedOption, setSelectedOption] = useState(Options[0]);

  const [encryptedData, setEncryptedData] = useState("Your_Encrypted_Vault_Data...");
  const [DecryptedData, setDecryptedData] = useState(null);
  const [decrypted, setDecrypted] = useState(false);

  const [memberEmail, setMemberEmail] = useState("");
  const [members, setMembers] = useState(["john@example.com", "alice@example.com"]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const addMember = () => {
    const email = memberEmail.trim();
    if (email && !members.includes(email)) {
      setMembers([...members, email]);
      setMemberEmail("");
    }
  };

  const removeMember = (emailToRemove) => {
    setMembers(members.filter(email => email !== emailToRemove));
  };

  // function to fetch the data of paticular vault item...
  const handleFetchVaultByDescription = async () => {
    try {
      const response = await axios.post('/apis/user/vault-setting', { infoGivenByUser : vaultDescription })
      setEncryptedData(response.data.itemData.encryptedCurrentData.encryptedData) ; // updating the encrypted state...
      const dataForDecryptedState = {
        vaultDescription:response.data.itemData.vaultDescription,
        vaultType:response.data.itemData.vaultType
      }
      setDecryptedData(dataForDecryptedState) ; // updating the decrypted state by rest data...
      setDecrypted(true);
    } catch (error) {
      console.error(error);
      throw new Error("Error fetching vault item data. Please try again later.");
    }
   }

   // acctual function handling delete logic...
  const handleDeleteConfirm = () => {
    setShowDeleteModal(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };
  // funtion to submit changed details...
  const handleSubmitChangedDetails = () => { 

   }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 px-6 py-12 text-gray-900 dark:text-gray-100">
      <div className="max-w-6xl mx-auto space-y-10">
        <VaultNavbar />
        {/* Page Header */}
        <div className="pt-10">
          <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100">Vault  Settings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage and update your vault configurations.
          </p>
        </div>

        {/* Vault sorting criteria Section */}
        <motion.div 
        initial={{ opacity: 0 , y:-100}}
        animate={{ opacity: 1 , y:0}}
        transition={{ duration: 1 }}
        className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
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
               placeholder="Something related to that vault item..."
               className="flex-1 transition-all duration-300 rounded-xl border border-gray-300 dark:border-none p-3 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
             />
             <button
               onClick={handleFetchVaultByDescription}
               className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-md transition"
             >
               Fetch Vault
             </button>
           </div>
         </motion.div>
        {/* Vault Data Section (Beautified) */}
        <motion.div 
        initial={{ opacity: 0 , y:-100}}
        animate={{ opacity: 1 , y:0}}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 transition-all duration-300 shadow-lg">
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
                    <label className="text-sm font-medium p-2 text-gray-600 dark:text-gray-300">Vault Title</label>
                    <input
                      type="text"
                      defaultValue="Team Secure Files"
                      className="rounded-xl border outline-none transition-all duration-300 border-gray-300 dark:border-gray-600 p-3 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                    />
                    <label className="text-sm font-medium p-2 text-gray-600 dark:text-gray-300">Main Credentail</label>
                    <input
                      type="text"
                      defaultValue="maincredential@2XX9cxx@"
                      className="rounded-xl border outline-none transition-all duration-300 border-gray-300 dark:border-gray-600 p-3 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium p-2 text-gray-600 dark:text-gray-300">Category</label>
                      <CustomSelect value={selectedOption} options={Options} onChange={setSelectedOption} />
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
                    <input type="checkbox" defaultChecked className="cursor-pointer  border-none rounded-full transition-all duration-300 outline-none w-5 h-5" />
                  </label>
                  <label className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Enable Link Sharing</span>
                    <input type="checkbox" className="cursor-pointer  border-none rounded-full transition-all duration-300 outline-none w-5 h-5" />
                  </label>
                </div>
              </div>

              {/* Members */}
              { selectedOption.value === Options[1].value && (
              <div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Members</h3>
                <div className="flex flex-col md:flex-row gap-4">
                  <input
                    type="email"
                    placeholder="Add member email"
                    value={memberEmail}
                    onChange={(e) => setMemberEmail(e.target.value)}
                    className="min-w-xl w-auto rounded-xl border outline-none transition-all duration-300 border-gray-300 dark:border-gray-600 p-3 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  />
                  <button
                    onClick={addMember}
                    className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl hover:shadow-md text-sm transition"
                  >
                    Add Member
                  </button>
                </div>
                <ul className="mt-4 divide-y divide-gray-100 dark:divide-gray-700">
                  {members.map((email) => (
                    <li key={email} className="p-2 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900 flex justify-between items-center">
                      <span className="text-sm text-gray-800 dark:text-gray-100">{email}</span>
                      <button
                        onClick={() => removeMember(email)}
                        className="text-md text-red-500 font-medium cursor-pointer hover:underline"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>)}

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
                      <input type="checkbox" defaultChecked className="cursor-pointer border-none rounded-full  transition-all duration-300 outline-none w-5 h-5" />
                    </label>
                  ))}
                </div>
              </div>
              <div className='flex justify-end'>
                  <button
                  type='submit'
                  onClick={handleSubmitChangedDetails}
                  className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-md transition"
                  >
                    update item 
                  </button>
              </div>
              {/* Danger Zone */}
              <div className="border-t pt-6 mt-6">
                <div className="bg-red-50 dark:bg-gray-900 border border-red-200 dark:border-gray-700 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">Danger Zone</h3>
                  <p className="text-sm text-red-600 dark:text-red-400 mb-4">
                    Permanently delete this vault. This action cannot be undone.
                  </p>
                  <button
                  type='submit'
                  onClick={() => { setShowDeleteModal(true) }}
                  className="cursor-pointer bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl text-md transition"
                  >
                    Delete vault Item
                  </button>
                  </div>
              </div>
            </div>
          )}
        </motion.div>

        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Confirm Delete</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
                Are you sure you want to permanently delete this vault? This action <b className='text-red-600 font-bold'>cannot be undone.</b>
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={handleDeleteCancel}
                  className="cursor-pointer px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="cursor-pointer px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
