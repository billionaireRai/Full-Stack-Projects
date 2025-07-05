"use client";

import Navbar from '@/components/navbar.jsx';
import CustomSelect from '@/components/customSelect';
import Dropdown from '@/components/dropdown';
import axios from 'axios';
import { useInactivityChecker } from '@/components/useInactivityChecker.jsx';
import useIsUserAuthenticated from '@/state/userAuthenticated';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { decryptionOfVaultData } from '@/lib/encryptionLogic.js';
import useUserDerivedEncryptionKey from '@/state/derivedEncrypKey';
import useUserPassPhraseHash from '@/state/passphraseHash';

// Motion Variants applied in the JSX...
const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

const sectionSlideIn = (direction = 'left') => ({
  hidden: {
    opacity: 0,
    x: direction === 'left' ? -100 : 100,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.43, 0.13, 0.23, 0.96],
    },
  },
});

export default function UserSharedVaultPage() {
  useInactivityChecker(process.env.NEXT_PUBLIC_INACTIVITY_CHECKER_LOGOUT);
  const { PassPhraseHashValue } = useUserPassPhraseHash() ;
  const { isAuthenticated } = useIsUserAuthenticated();
  const { encryptionKeyValue } = useUserDerivedEncryptionKey() ;
  const [roles, setRoles] = useState([
    { label: 'View Only', value: 'View Only' },
    { label: 'Edit', value: 'Edit' },
    { label: 'Admin', value: 'Admin' },
    { label: 'Manager', value: 'Manager' }  // New role added related to managing vaults
  ]);
  // state for handling the stats required...
  const [vaultStats, setVaultStats] = useState([
    {
      title:'Total Shared Vaults You Are Allowed To Access',
      totalVaultsShared: 0,
    },
    {
      title:'Total Individuals Who Can Access Above Vaults',
      activeCollaborators:0
    },
    {
      title:'Vaults Recently Accessed',
      recentlyAccessed:0
    }
  ]);
  // function for getting the stats...
  const getVaultStats = async () => {
    const apires = await axios.get("/apis/user/shared-vault",{ params:{ auth:isAuthenticated } });
    const statArray = apires.data.dataArray;
    setVaultStats(statArray);
  }

  const [selectRole, setSelectRole] = useState(roles[0]);
  // array of sharedvaults details objects...
  const [DecryptionActivated, setDecryptionActivated] = useState(false);
  const [sharedVaults, setSharedVaults] = useState([]);
  
  const [selectedVaultId, setSelectedVaultId] = useState(null);   // selection of vault we wanna see details about...
  const toggleEncryptedView = (id) => {
    setSelectedVaultId((prevId) => (prevId === id ? null : id));
  };
  
  const [RemoveAccessDropdown, setRemoveAccessDropdown] = useState([]);
  // function for handling  the logic of removing the access...
  const handleRemoveAccessLogic = (id) => { 
    const index = sharedVaults.findIndex(vault => vault._id === id);
    setRemoveAccessDropdown((prevDropDown) => {
      const newDropDown = [...prevDropDown];
      newDropDown[index] = !newDropDown[index];
      return newDropDown;
    });
  }

  // Initialize RemoveAccessDropdown state when sharedVaults changes
  useEffect(() => {
    setRemoveAccessDropdown(new Array(sharedVaults.length).fill(false));
  }, [sharedVaults]);

  // function for getting all the shared vaults of / on user...
  const getSharedVaults = async () => {
    if (!PassPhraseHashValue) {
      console.error("PassPhraseHashValue is missing or invalid, aborting API call.");
      return;
    }
    try {
      const sharedVaultRes = await axios.post('/apis/user/shared-vault', { PassPhraseHashValue: PassPhraseHashValue });
      // handling the bad response condition...
      if (sharedVaultRes.status !== 200) {
        console.error("API returned non-200 status:", sharedVaultRes.status, sharedVaultRes.data);
        return;
      }
      const dataArray = sharedVaultRes.data.dataArray;
      // Decrypt each vault's encryptedData and set it in it...
      const decryptedVaults = await Promise.all(dataArray.map(async (vault) => {
        try {
          let encryptedDataToParse = vault.encryptedData;
          // If encryptedData is a string direclty parse in json for decryption...
          if (typeof encryptedDataToParse === 'string') {
            try {
              encryptedDataToParse = JSON.parse(encryptedDataToParse);
            } catch (e) {
              console.warn(`Failed to parse encryptedData (direct string) for vault ${vault._id}:`, e);
            }
          }
          // If encryptedData.encryptedData is a stringified JSON , acctual data structure...
          if (encryptedDataToParse && typeof encryptedDataToParse.encryptedData === 'string') {
            try {
              encryptedDataToParse.encryptedData = JSON.parse(encryptedDataToParse.encryptedData);
            } catch (e) {
              console.warn(`Failed to parse nested encryptedData.encryptedData for vault ${vault._id}:`, e);
            }
          }
          // main decryption logic of encrypted data...
          const decrypted = await decryptionOfVaultData(encryptedDataToParse, encryptionKeyValue);
          return { ...vault, decryptedData: decrypted };
        } catch (error) {
          console.error("Decryption failed for vault:", vault._id, error);
          return { ...vault, decryptedData: null };
        }
      }));

      setSharedVaults(decryptedVaults); // finally updating the state of vaults...
    } catch (error) {
      console.error("Failed to get shared vaults:", error);
      return;
    }
  }
  useEffect(() => {
    if (!PassPhraseHashValue || !encryptionKeyValue) {
      console.log("Waiting for PassPhraseHashValue OR encryptionKeyValue to be set...");
      return;
    }
    getSharedVaults();
    getVaultStats(); 
  }, [PassPhraseHashValue, encryptionKeyValue])
  
  // function for handling logic of removing access of a user...
  const handleRemoveAccessForaUser = async (userText,vaultId) => { 
   try {
     const response =  await axios.patch('/apis/user/shared-vault',{ userText,vaultId },{headers:{'Content-Type': 'application/json'}})
     if (response.status === 200){
       console.log("Access removed for user:", userText);
       getSharedVaults();
     }
   } catch (error) {
    console.error("Failed to remove access for user:", userText, error);
    return ;
   }
  }
  return (
    <div className="min-h-screen bg-[#f9fafb] dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <Navbar />
      <main className="pt-28 px-6 md:px-12 max-w-6xl mx-auto">
        <motion.div
          variants={sectionSlideIn()}
          initial="hidden"
          animate="visible"
        >
          <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-gray-100">🔗 Shared Vaults</h1>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-14 max-w-2xl mx-auto text-lg">
            View and manage all the vaults that have been shared with you by other users. Keep your access secure and up-to-date.
          </p>
        </motion.div>

        {/* Shared Vaults List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-16"
        >
          <AnimatePresence>
          {Array.isArray(sharedVaults) && sharedVaults?.map((vault,index) => (
          <motion.div
            key={vault._id}
            variants={cardVariants}
            whileHover={{
              scale: 1.02,
              boxShadow: `0 8px 15px rgba(0, 0, 0, 0.08), 0 4px 20px rgba(0, 123, 255, 0.12)`
            }}
            className="relative cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-xl shadow mb-6 border border-gray-200 dark:border-gray-700 transition-all duration-300"
          >
            <div className="flex flex-col lg:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">{vault.no}.Details About {vault.decryptedData.bankName || 'wallet'}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Created on: [{new Date(vault.createdAt).toUTCString()}] | Last Accessed: [{new Date(vault.updatedAt).toUTCString()}]
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Shared By: {vault.sharedBy}</p>
              </div>
              <div className="flex gap-4 flex-wrap items-center">
                {vault.sharedBy === 'Amritansh Rai'  && 
                  <div className="relative inline-block">
                    <button 
                      onClick={() => { handleRemoveAccessLogic(vault._id) }}
                      className="cursor-pointer bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition self-start"
                    >
                      Remove Access
                    </button>
                    {RemoveAccessDropdown[index] && 
                    // onRemove(sharedUser,info._id) acctual function that will be called...
                      <Dropdown info={{ ...vault, isVisible: true }} onRemove={(userText,vaultId) => {handleRemoveAccessForaUser(userText,vaultId)}}/>
                    }
                  </div>
                }
                 { selectedVaultId === vault._id && (
                    <button 
                    onClick={() => { setDecryptionActivated((prevState) =>  !prevState ) }}
                    className='cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition'>
                      {DecryptionActivated ? "encryt data" :"decrypt data"}
                    </button>
                  )
                 }
                <button
                  onClick={() => toggleEncryptedView(vault._id)}
                  className="cursor-pointer bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition"
                >
                  {selectedVaultId === vault._id ? "Hide Encrypted" : "View Encrypted"}
                </button>
              </div>
            </div>
            <div className="mt-4 flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <div className="mt-4 flex flex-row items-center gap-1">
                  <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2">Item Storage :</h3>
                  <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-center w-fit h-fit p-2 rounded-full text-sm border border-gray-300 dark:border-gray-600">
                      {vault.storageOfItem || ''} MB
                  </span>
                </div>
                <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2">Members:</h3>
                <div className="flex flex-wrap gap-2">
                {(vault.sharedWith || []).map((member, index) => (
                     <span
                       key={index}
                       className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-3 py-1 rounded-full text-sm border border-gray-300 dark:border-gray-600"
                     >
                       {member}
                     </span>
                   ))}
                </div>
                <div className="mt-4 flex flex-row gap-1">
                  <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2">Credential Type :</h3>
                  <ul className="list-none text-gray-600 dark:text-gray-400">
                      <li>{vault.vaultCategory || ''}</li>
                  </ul>
                </div>
                <div className="mt-4 flex flex-row gap-1">
                  <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2">Vault Description :</h3>
                  <ul className="list-none text-gray-600 dark:text-gray-400">
                      <li>{vault.vaultDescription || ''}</li>
                  </ul>
                </div>
              </div>

              {/* code Data Container */}
              <AnimatePresence>
                {selectedVaultId === vault._id && (
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.4 }}
                    className="w-full lg:w-[40%] bg-gray-900 text-green-400 p-6 rounded-xl overflow-x-auto shadow-inner transition-all duration-300"
                  >
                    <h3 className="text-lg font-semibold text-green-300 mb-2">
                      🔐 Encrypted Vault Data
                    </h3>
                    <code className="text-xs break-words whitespace-pre-wrap block">
                      {typeof vault.encryptedData === 'object' ? JSON.stringify(vault.encryptedData, null, 2) : vault.encryptedData}
                    </code>
                    {DecryptionActivated && selectedVaultId === vault._id && (
                      <div>
                        <h3 className="text-lg font-semibold text-blue-300 mt-4 mb-2">
                          🔓 Decrypted Vault Data
                        </h3>
                        <pre className="text-xs break-words whitespace-pre-wrap block bg-gray-800 p-2 rounded text-white">
                          {typeof vault.decryptedData === 'object' ? JSON.stringify(vault.decryptedData, null, 2) : vault.decryptedData}
                        </pre>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Access Control */}
        <motion.div
          variants={sectionSlideIn('right')}
          initial="hidden"
          animate="visible"
          className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow border border-gray-200 dark:border-gray-700 mb-20"
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">🔐 Access Control Settings</h2>
          <p className="text-gray-700 dark:text-gray-400 mb-4">
            Customize access for each member. Define view-only, edit, or admin roles.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {sharedVaults.map((eachvault,idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 p-2 rounded-full">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path d="M5.121 17.804A9.953 9.953 0 0112 15c2.21 0 4.243.715 5.879 1.922M15 11a3 3 0 10-6 0 3 3 0 006 0z" />
                        <path d="M12 2a10 10 0 100 20 10 10 0 000-20z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{eachvault.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{eachvault.vaultCategory}</p>
                    </div>
                  </div>
                  <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-400 text-xs px-2 py-1 rounded-full font-medium">
                    Active
                  </span>
                </div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Access Role For Others :</label>
                <CustomSelect options={roles} value={selectRole} onChange={setSelectRole} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Vault Usage Statistics */}
        <motion.section
          variants={sectionSlideIn('left')}
          initial="hidden"
          animate="visible"
          className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow border border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">📊 Vault Usage Statistics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {(vaultStats || []).map((stat,index) => (
               <div key={index} className="p-6 cursor-pointer hover:shadow-md bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-700">
                 <h3 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                   {stat.totalVaultsShared ?? stat.activeCollaborators ?? stat.recentlyAccessed ?? 0}
                 </h3>
                 <p className="text-gray-600 dark:text-gray-400 mt-1">{stat.title}</p>
               </div>
            ))}
          </div>
        </motion.section>
      </main>
    </div>
  );
}
