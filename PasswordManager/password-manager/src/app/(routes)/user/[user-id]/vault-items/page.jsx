"use client";

import VaultNavbar from "@/components/navbar";
import useUserDerivedEncryptionKey from "@/state/derivedEncrypKey";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { decryptionOfVaultData } from "@/lib/encryptionLogic";
import { useInactivityChecker } from '@/components/useInactivityChecker.jsx';
import axios from "axios";

export default function UserTotalVaultItems() {
  useInactivityChecker(process.env.NEXT_PUBLIC_INACTIVITY_CHECKER_LOGOUT);
  const { encryptionKeyValue } = useUserDerivedEncryptionKey() ; // getting the user encryption key value...
  const [vaultItems, setVaultItems] = useState([]);
  const [DecryptionActivated, setDecryptionActivated] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

  // function to get the vaults from DB...
  const gettingAllVaultItems = async () => { 
    try {
      const vaultRes = await axios.post("/apis/user/vault-item") ;
      // adding the a feild decryptedData...

      // setVaultItems(vaultRes.data.vaultArray);
      console.log("status text from api response :",vaultRes.statusText) ;
      return ;
    } catch (error) {
      console.log(error);
      return ;
    }
}

  useEffect(() => {
      setVaultItems([
        {
          no:1,
          title: "Personal Cryto-wallet Credentials",
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
          title: "Laptop Password details",
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
  }, []);

  // toggleing the encryption view...
  const toggleEncryptedView = (id) => {
    setSelectedItemId((prevId) => (prevId === id ? null : id));
  };

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
          <div className="flex flex-col gap-10">
            {vaultItems.map((item) => (
              <div
                key={item.no}
              className="border-1 border-gray-400 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-lg transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{item.no}.{item.title}</h2>
                      <span className="text-xs px-3 py-1 rounded-full bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-gray-300 font-medium">
                        {item.accessLevel}
                      </span>
                    </div>
                    <p className="text-gray-800 dark:text-gray-300 mb-4 text-sm"><span className="font-semibold">Item-description:</span> {item.description}</p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-800 dark:text-gray-300 mb-4">
                      <div>
                        <span className="font-semibold">Size:</span> {item.size}
                      </div>
                      <div>
                        <span className="font-semibold">Times Modified:</span> {item.timesItWasChanged}
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
                      <button className="cursor-pointer bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-4 py-2 rounded-md text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                        Share
                      </button>
                      <button className="cursor-pointer bg-red-100 dark:bg-red-700 text-red-600 dark:text-red-300 px-4 py-2 rounded-md text-sm hover:bg-red-200 dark:hover:bg-red-600 transition">
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
                        <h3 className="text-lg font-semibold text-green-300 mb-2">
                          🔐 Encrypted Vault Data
                        </h3>
                        <code className="text-xs break-words whitespace-pre-wrap block">
                          {/* {encryptVaultData(item)} */}
                        </code>
                        {DecryptionActivated && selectedItemId === item.no && (
                         <div>
                           <h3 className="text-lg font-semibold text-blue-300 mt-4 mb-2">
                             🔓 Decrypted Vault Data
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
              </div>
            ))}
          </div>
        )}

        <div className="mt-20 border-t pt-10 text-center text-gray-500 dark:text-gray-400 text-sm">
          © {new Date().getFullYear()} lockRift Inc. All rights reserved.
        </div>
      </div>
    </div>
  );
}
