"use client";

import axios from "axios";
import VaultNavbar from "@/components/navbar";
import Image from "next/image";
import toast from "react-hot-toast";
import useUserDerivedEncryptionKey from "@/state/derivedEncrypKey.js";
import useUserPassPhraseHash from "@/state/passphraseHash";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { decryptionOfVaultData } from "@/lib/encryptionLogic";
import { useInactivityChecker } from '@/components/useInactivityChecker.jsx';

export default function UserTotalVaultItems() {
  useInactivityChecker(process.env.NEXT_PUBLIC_INACTIVITY_CHECKER_LOGOUT);
  const { encryptionKeyValue, hasHydrated } = useUserDerivedEncryptionKey() ; // getting the user encryption key value and hydration status...
  const { PassPhraseHashValue } = useUserPassPhraseHash();
  const [vaultItems, setVaultItems] = useState([]);
  const [DecryptionActivated, setDecryptionActivated] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

  // New state for share modal and input...
  const [showShareModal, setShowShareModal] = useState(false);
  // Change shareInput to array of strings for multiple users
  const [shareUsers, setShareUsers] = useState([""]);
  const [currentShareItemId, setCurrentShareItemId] = useState(null);

  // New state for delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);

  // Handler for Share button click
  const handleShareClick = (itemId) => {
    setCurrentShareItemId(itemId);
    setShowShareModal(true);
    setShareUsers([""]);
  };
  // function for handling the delete item logic...
  const handleItemDeleteModal = (itemId) => { 
    setDeleteItemId(itemId);
    setShowDeleteModal(true);
  }
  // function for handling the deletion of item...
  const handleDeleteItemLogic = async () => { 
      setShowDeleteModal(false);
      try {
        const deleteRes = await axios.delete('/apis/user/vault-item',{data:{idToDelete :deleteItemId}}); 
        if(deleteRes.status === 200){
           setDeleteItemId(null);
           setVaultItems((prevItems) => prevItems.filter(item => item.id !== deleteItemId));
           toast.success("Vault item deleted successfully.");
           return ;
        }
      } catch (error) {
        console.error(error);
        return ;
      }
   }

  // Handler for share submit...
  const handleShareSubmit = async (itemId) => {
    const filteredUsers = shareUsers.map(u => u.trim()).filter(u => u !== "");
    // Validate that at least one non-empty user is entered...
    if (filteredUsers.length === 0) {
      toast.error("Please enter at least one name/email!!");
      return;
    }
    // logic to hit api for sharing users...
   try {
     const response = await axios.get('/apis/user/vault-item',{
       params: {
         itemId: itemId,
         sharedUsers:filteredUsers,
         passPhrasHash:PassPhraseHashValue
       }
     });
     if (response.status === 200) {
     toast.success('vault item succesfully shared!!');
     setShowShareModal(false);
     }
   } catch (error) {
    console.error(error);
    return ;
   }
  };

  // function to get the vaults from DB...
const gettingAllVaultItems = async () => { 
    try {
      const vaultRes = await axios.post("/apis/user/vault-item") ;
      // adding the a field decryptedData...
      const modifiedArray = await Promise.all(
        vaultRes.data.vaultArray.map(async (eachitem) => { 
          const decrypted = await decryptionOfVaultData(eachitem.encryptedData,encryptionKeyValue); // main decryption logic of encrypted data...
          return { ...eachitem, decryptedData: decrypted };
        })
      );
      setVaultItems(modifiedArray); // setting the modified array in state variable..
      console.log("status text from api response :",vaultRes.statusText) ;
      return ;
    } catch (error) {
      console.log(error);
      return ;
    }
}

  useEffect(() => {
    if (!hasHydrated) return ; // wait for hydration before using encryptionKeyValue...
      setVaultItems([
        {
          no:1,
          id:"&YGVHU*",
          description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur magni deleniti delectus, dicta aliquam esse sed saepe deserunt rerum voluptatibus autem non nesciunt hic natus facilis aperiam aspernatur! Tenetur maiores ipsa molestiae magni animi ex officia ducimus vitae nulla quisquam iure',
          size: "120 MB",
          accessLevel: "Private",
          vaultCategory: 'crypto-wallet-details',
          createdBy: "You",
          createdAt: "2024-12-01",
          updatedAt: "2025-05-10",
          timesItWasChanged:3, // this is version number acctally...
          tags: ["passport", "ID", "personal"],
        },
        {
          no:2,
          id:'^&&YGGHU*',
          description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Architecto in asperiores, itaque repellat molestias officiis alias non laboriosam culpa sequi ut unde veritatis nihil amet sed libero beatae porro consectetur laudantium excepturi labore maiores eos. Totam mollitia sit, corrupti ducimus accusamus odio p',
          size: "2.4 GB",
          accessLevel: "Shared",
          vaultCategory: 'password-details',
          createdBy: "You",
          createdAt: "2023-07-22",
          updatedAt: "2025-05-15",
          timesItWasChanged:3,
          tags: ["family", "photos", "albums"],
        },
      ]);
      gettingAllVaultItems() ;
  }, [hasHydrated]);

  // toggleing the encryption view...
  const toggleEncryptedView = (id) => {
    setSelectedItemId((prevId) => (prevId === id ? null : id));
  };
  // function for copying encryted and decrypted data...
  const copyTheItemCredentials = (data,text) => { 
    navigator.clipboard.writeText(data).then(() => {
      console.log('Copied to clipboard...');
      toast.success(text);
    })
    .catch(err => {
      console.error('Failed to copy:', err);
      toast.error('Failed to copy to clipboard');
    })
   }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 px-6 py-24 text-gray-900 dark:text-gray-100">
      <VaultNavbar />
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-6 text-blue-800 dark:text-blue-400">
          🗄️ Your Vault Items
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-12 text-lg max-w-2xl mx-auto">
          View your secured vault items with metadata and encrypted content.
        </p>

       
      { vaultItems.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400">No vault items found.</div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-10"
          >
            {vaultItems.map((item) => (
              <motion.div
                key={item.no}
                whileHover={{ scale: 1.03, boxShadow: "0 8px 15px rgba(0, 0, 0, 0.3)" }}
                transition={{ type: "spring", stiffness: 300 }}
                className="border-1 border-gray-500 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-lg transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{item.no}.Details About {item.vaultCategory}</h2>
                      <span className="text-xs px-3 py-1 rounded-full bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-gray-300 font-medium">
                        {item.accessLevel}
                      </span>
                    </div>
                    <p className="text-gray-800 dark:text-gray-300 mb-4 text-sm"><span className="font-semibold">Item-description:</span> {item.description}</p>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm text-gray-800 dark:text-gray-300 mb-4">
                      <div>
                        <span className="font-semibold">Size:</span> {item.size}
                      </div>
                      <div>
                        <span className="font-semibold">Times Modified:</span> {item.timesItWasChanged}
                      </div>
                      <div>
                        <span className="font-semibold">Created On:</span> [{item.createdAt}]
                      </div>
                      <div>
                        <span className="font-semibold">Created By:</span> {item.createdBy}
                      </div>
                      <div>
                        <span className="font-semibold">Last Modified:</span> [{item.updatedAt}]
                      </div>
                    </div>

                    <div className="mb-4 flex flex-row items-center gap-2">
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
                        onClick={() => toggleEncryptedView(item.no)}
                        className="cursor-pointer bg-indigo-600 dark:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 dark:hover:bg-indigo-800 transition"
                      >
                        {selectedItemId === item.no ? "Hide Encrypted" : "Show Encrypted"}
                      </button>
                      {selectedItemId === item.no && (
                        <button 
                        onClick={() => { setDecryptionActivated((prev) => !prev) }}
                        className="bg-blue-300 cursor-pointer px-4 py-2 rounded-md text-black">{DecryptionActivated ? "Encrypt" :"Decrypt Data"}</button>
                      )
                      }
                     <button
                     onClick={() => { handleShareClick(item.id) }}
                      className="cursor-pointer bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-4 py-2 rounded-md text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                       Share
                     </button>
                     <button
                     onClick={() => { handleItemDeleteModal(item.id) }} 
                      className="cursor-pointer bg-red-100 dark:bg-red-700 text-red-600 dark:text-red-300 px-4 py-2 rounded-md text-sm hover:bg-red-200 dark:hover:bg-red-600 transition">
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Encrypted View with Slide Animation */}
                  <AnimatePresence>
                    {selectedItemId === item.no && (
                      <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ duration: 0.4 }}
                        className="w-full h-full lg:w-[40%] bg-gray-900 text-green-400 p-6 rounded-xl overflow-x-auto shadow-inner"
                      >
                        <h3 className="text-lg flex flex-row items-center justify-between font-semibold text-green-300 mb-2">
                          <span>🔐 Encrypted Vault Data</span>
                            <span 
                            onClick={() => { copyTheItemCredentials(item.encryptedData.encryptedData,'encryted data copied!!') }} className="bg-gray-900 p-1 rounded-lg hover:bg-gray-700 transition-colors duration-300">
                              <Image src='/images/copy.png' className="invert cursor-pointer" width={20} height={20} alt="copy-icon"/>
                            </span>
                        </h3>
                        <code className="text-xs break-words whitespace-pre-wrap block">
                          {item.encryptedData.encryptedData}
                        </code>
                        {DecryptionActivated && selectedItemId === item.no && (
                         <div>
                           <h3 className="text-lg flex flex-row items-center justify-between font-semibold text-blue-300 mt-4 mb-2">
                             <span>🔓 Decrypted Vault Data</span>
                             <span 
                             onClick={() => { copyTheItemCredentials(item.decryptedData,'decrypted data copied!!') }} className="bg-gray-900 p-1 rounded-lg hover:bg-gray-700 transition-colors duration-300">
                              <Image src='/images/copy.png' className="invert cursor-pointer" width={20} height={20} alt="copy-icon"/>
                             </span>
                           </h3>
                           <pre className="text-xs break-words whitespace-pre-wrap block bg-gray-800 p-2 rounded text-white">
                             {typeof item.decryptedData === 'object' ? JSON.stringify(item.decryptedData, null, 2) : item.decryptedData}
                           </pre>
                         </div>
                       )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        <div className="mt-20 border-t pt-10 text-center text-gray-500 dark:text-gray-400 text-sm">
          © {new Date().getFullYear()} lockRift Inc. All rights reserved.
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 w-full max-w-lg mx-4 shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100 border-b border-gray-300 dark:border-gray-700 pb-2">
              Share Vault Item
            </h2>
            <p className="mb-6 text-gray-700 dark:text-gray-300 text-lg">
              Enter names or emails of users you want to share with:
            </p>
            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
              {shareUsers.map((user, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={user}
                    onChange={(e) => {
                      const newUsers = [...shareUsers];
                      newUsers[index] = e.target.value;
                      setShareUsers(newUsers);
                    }}
                    placeholder={`User ${index+1} email`}
                    className="flex-grow p-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 text-base focus:outline-none focus:border-blue-500 focus:border-2 transition shadow-sm hover:shadow-md dark:hover:shadow-lg"
                    aria-label="Name or email input for sharing vault item"
                  />
                  {shareUsers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const newUsers = shareUsers.filter((_, i) => i !== index);
                          setShareUsers(newUsers);
                        }}
                        className="cursor-pointer flex items-center justify-center p-1 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-600 hover:text-red-800 dark:hover:text-red-300 transition focus:outline-none focus:ring-2 focus:ring-red-500"
                        aria-label="Remove user"
                        title="Remove user"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-4 h-4"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={() => setShareUsers([...shareUsers, ""])}
              className="cursor-pointer mb-6 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
            >
              + Add User
            </button>
            <div className="flex justify-end gap-6">
              <button
                onClick={() => setShowShareModal(false)}
                className="cursor-pointer px-6 py-2 bg-gray-300 dark:bg-gray-600 rounded-lg text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-500 transition font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => { handleShareSubmit(currentShareItemId)}}
                className="cursor-pointer px-6 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition font-semibold shadow-md"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 w-full max-w-md mx-4 shadow-md border border-gray-300 dark:border-gray-700">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100 border-b border-gray-300 dark:border-gray-700 pb-2">
              Confirm Delete
            </h2>
            <p className="mb-6 text-gray-700 dark:text-gray-300 text-base">
              Are you sure you want to delete this vault item? This action <span className="font-semibold text-red-600 dark:text-red-500">cannot be undone</span>.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="cursor-pointer px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md text-gray-900 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => { handleDeleteItemLogic() }}
                className="cursor-pointer px-4 py-2 bg-red-600 rounded-md text-white hover:bg-red-700 transition font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
