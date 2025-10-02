"use client";
import CustomSelect from '@/components/customSelect.jsx';
import React, { useState } from "react";
import Tooltip from '@/components/Tooltip';
import VaultNavbar from '@/components/navbar';
import { encryptionOfVaultData } from '@/lib/encryptionLogic';
import useUserDerivedEncryptionKey from "@/state/derivedEncrypKey.js";
import toast from 'react-hot-toast';
import { getUserLocationInfoByPermission } from '@/lib/userLocation';
import { decryptionOfVaultData } from '@/lib/encryptionLogic';
import { useInactivityChecker } from '@/components/useInactivityChecker.jsx';
import { motion } from "framer-motion";
import { PlusIcon , DeleteIcon } from 'lucide-react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function UserVaultSettingPage() {
  useInactivityChecker(process.env.NEXT_PUBLIC_INACTIVITY_CHECKER_LOGOUT);
  const searchParams = useSearchParams();
  const [vaultDescription, setVaultDescription] = useState("");
  const [Options, setOptions] = useState([
    {label:"private",value:"private"},
    {label:"shared",value:'shared'},
  ]);
  
  const { encryptionKeyValue } = useUserDerivedEncryptionKey() ;
  const [Notification, setNotification] = useState(["Vault accessed", "Vault updated", "Weekly summary"]);
  const [encryptedData, setencryptedData] = useState("Your_Encrypted_Vault_Data...");
  const [DecryptedData, setDecryptedData] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null); 
  const [UserLocation, setUserLocation] = useState(null);
  const [decrypted, setDecrypted] = useState(false);

  const [memberEmail, setMemberEmail] = useState("");
  const [members, setMembers] = useState([]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showRemoveMemberModal, setShowRemoveMemberModal] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

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
    const toastId = toast.loading('Searching for vault...',{ duration:2000 });
    try {
      if (!vaultDescription.trim()) {
        toast.dismiss(toastId);
        toast.error("Please enter a vault description to search");
        return;
      }

      const response = await axios.post('/apis/user/vault-setting', { 
        infoGivenByUser: vaultDescription.trim() ,
        UserLocation
      });

      // Check response status and data
      if (response.data.status === 404) throw new Error(response.data.message || "No vault found matching your search");
      
      if (!response.data.itemData) throw new Error("No vault data found");

      const itemData = response.data.itemData;
      const encryptedDataValue = itemData.encrypted;
      
      if (!encryptedDataValue) {
        throw new Error("No encrypted vault data available");
      }

      setencryptedData(encryptedDataValue);
      
      // Decrypt the vault data
      toast.loading('Decrypting vault data...', { id: toastId });
      const decrypted = await decryptionOfVaultData(encryptedDataValue, encryptionKeyValue);
      
      if (typeof decrypted !== 'object' || decrypted === null) throw new Error('Decrypted data format is invalid') ;
      
      const arrayOfDecryptedData = Object.entries(decrypted); // converting the array of arrays [[key,value],[],[],...]
      const dataForDecryptedState = {
        id:itemData.id,
        decryptedData: arrayOfDecryptedData,
        vaultDescription: itemData.vaultDescription,
        vaultType: itemData.vaultType
      };
      
      setDecryptedData(dataForDecryptedState); // In decrypted data state item (id) is present...
      setDecrypted(true);
      
      toast.success('Vault successfully fetched!!', { id: toastId, duration: 3000 });
      
    } catch (error) {
      console.error('Error fetching vault:', error);
      
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch vault. Please try again.';
      toast.error(errorMessage, { id: toastId, duration: 4000 });
    }
  }

  useEffect(() => {
   // Fetch user location on component mount
   const fetchUserLocation = async () => {
      try {
       const location = await getUserLocationInfoByPermission();
       setUserLocation(location);
     } catch (error) {
       console.error("Failed to get user location:", error);
      }
   };
   fetchUserLocation(); 
  }, [])

  // Check for actionOn parameter in URL and automatically search for vault...
  useEffect(() => {
    const actionOn = searchParams.get('actionOn');
    if (actionOn) {
      const decodedActionOn = decodeURIComponent(actionOn);
      setVaultDescription(decodedActionOn);
    }
  }, [searchParams]);
  
  useEffect(() => {
    // Automatically search for the vault after a short delay to ensure state is updated
    const timer = setTimeout(() => {
        handleFetchVaultByDescription();
    }, 1000);
    
    return () => clearTimeout(timer);
  
  }, [vaultDescription])
  
  useEffect(() => {
    if (DecryptedData && DecryptedData.vaultType) {
      const vaultTypeOption = Options.find(option => option['value'] === DecryptedData.vaultType);
      setSelectedOption(vaultTypeOption || Options[0]); // Default to first option if not found...
    }
  }, [DecryptedData])
  
   
   // acctual function handling delete logic...
  const handleDeleteConfirm = () => {
    setShowDeleteModal(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };
  // funtion to submit changed details...
  const handleSubmitChangedDetails = async (formData) => {
    try {
      let updateToast = toast.loading('updating the changes in vault',{ duration:2000 });
      const cleanData = {};
      
      // Extract only the necessary fields from form data...
      Object.keys(formData).forEach(key => {
        // skipping two redundent feild...
        if (key !== 'mainCredential' && key !== 'description') {
          if (typeof formData[key] !== 'object' || formData[key] === null) cleanData[key] = formData[key] ;
        }
      });

       // encryption related logic of selected feilds...
        let objToEncrypt = {} ;
        Object.keys(cleanData).filter(field => !field.startsWith('vault') && !field.startsWith('id')).forEach((reqFeild) => {
          objToEncrypt[reqFeild] = cleanData[reqFeild] ;
        }) ; // array of feilds to encrypt...
      
      const encryptedObj = await encryptionOfVaultData(objToEncrypt,encryptionKeyValue) ; // will return the encrypted obj...
      
      // Add vault-specific data...
      let updateData = {
        encrypted:encryptedObj,
        id: DecryptedData?.id,
        vaultType: selectedOption?.value || 'private',
        vaultDescription: DecryptedData?.vaultDescription
      };

      
      const res = await axios.patch('/apis/user/vault-setting', { updateData , UserLocation }, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (res.status === 200) toast.success('Vault updated successfully!',{ id: updateToast});
    } catch (error) {
      console.error('Error updating vault:', error);
      toast.error('Failed to update vault. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 px-6 py-12 text-gray-900 dark:text-gray-100">
      <div className="max-w-6xl mx-auto space-y-10">
        <VaultNavbar />
        {/* Page Header */}
        <div className="pt-20">
          <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100">Vault  Settings</h1>
          <p className="text-sm w-full md:w-3/4 text-gray-500 dark:text-gray-400">
          "Easily manage, customize, and update all your vault item configurations to ensure they remain organized, secure, and optimized according to your preferences and evolving needs."
          </p>
        </div>

        {/* Vault sorting criteria Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.3,
            ease: "easeOut",
            delay: 0.1
          }}
          className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
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
        {/* Vault Data Section */}
        <motion.div 
        initial={{ opacity: 0 , y:-100}}
        animate={{ opacity: 1 , y:0}}
        transition={{ duration: 0.2 }}
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
            className={`${(!DecryptedData || !encryptedData) ? 'cursor-not-allowed' : 'cursor-pointer'} relative inline-block text-blue-600 dark:text-blue-400 font-medium group`}>
                   <span className="relative z-10">{decrypted ? "Hide Decrypted" : "Decrypt"}</span>
                   {(!DecryptedData || !encryptedData) ? <></> : (<span className="absolute left-0 bottom-0 h-[2px] w-0 bg-blue-600 dark:bg-blue-400 transition-all duration-300 group-hover:w-full"></span>)}
            </button>
          </div>

          {!decrypted ? (
            <div className="bg-gray-100 dark:bg-gray-700 border border-dashed border-gray-300 dark:border-gray-600 p-5 rounded-xl text-sm text-gray-700 dark:text-gray-300">
              <code className="block whitespace-pre-wrap break-all">
                {encryptedData.encryptedData}
              </code>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Vault Info */}
              <form onSubmit={handleSubmit(handleSubmitChangedDetails)}>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-6">Vault Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {/* Vault Title */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Vault Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={vaultDescription.trim()}
                      type="text"
                      {...register('vaultTitle', {
                        required: "Vault title is required",
                        minLength: {
                          value: 3,
                          message: "Vault title must be at least 3 characters"
                        },
                        maxLength: {
                          value: 50,
                          message: "Vault title must not exceed 50 characters"
                        },
                        pattern: {
                          value: /^[a-zA-Z0-9\s-_]+$/,
                          message: "Vault title can only contain letters, numbers, spaces, hyphens, and underscores"
                        }
                      })}
                      className={`w-full rounded-xl border outline-none transition-all duration-300 p-3 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 ${
                        errors.vaultTitle ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                    {errors.vaultTitle && (
                      <p className="text-sm text-red-600">{errors.vaultTitle.message}</p>
                    )}
                  </div>

                  {/* Item Type */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Item Type
                    </label>
                    <CustomSelect value={selectedOption} options={Options} onChange={setSelectedOption} />
                  </div>

                  {/* Dynamic Decrypted Data Fields */}
                  {DecryptedData.decryptedData && DecryptedData.decryptedData.map(([key, value], index) => (
                    <div key={index} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {key} <span className="text-red-500">*</span>
                      </label>
                      <input
                        defaultValue={value}
                        type="text"
                        {...register(key, {
                          required: `${key} is required`,
                          minLength: {
                            value: 3,
                            message: `${key} must be at least 3 characters`
                          },
                          maxLength: {
                            value: 100,
                            message: `${key} must not exceed 100 characters`
                          }
                        })}
                        className={`w-full rounded-xl border outline-none transition-all duration-300 p-3 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 ${
                          errors[key] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        }`}
                      />
                      {errors[key] && (
                        <p className="text-sm text-red-600">{errors[key].message}</p>
                      )}
                    </div>
                  ))}

                  {/* Description - Full Width */}
                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Description<span className="text-red-500">*</span>
                    </label>
                    <Tooltip text='Not Recommended to change description of a vault item'>
                    <input
                      type="text"
                      defaultValue={DecryptedData.vaultDescription}
                      {...register('description', {
                        required: "Description is required",
                        minLength: {
                          value: 3,
                          message: "Description must be at least 3 characters"
                        },
                        maxLength: {
                          value: 200,
                          message: "Description must not exceed 300 characters"
                        }
                      })}
                      className="w-full h-auto outline-none transition-all duration-300 rounded-xl border border-gray-300 dark:border-gray-600 p-3 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                      placeholder="Enter vault description..."
                    />
                    </Tooltip>
                    {errors.description && (
                      <p className="text-sm text-red-600">{errors.description.message}</p>
                    )}
                  </div>
                </div>
                <div className='flex my-10 justify-end'>
                  <button
                  type='submit'
                  className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-md transition"
                  >
                    update item 
                  </button>
                </div>
              </form>
              {/* Access Control */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Access Control</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Tooltip text='Be cautious proving it...'>
                     <label className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 px-4 py-3 rounded-xl border-1    border-red-500 shadow-sm">
                       <span className="text-sm text-gray-700 dark:text-gray-300">Make Vault Private</span>
                       <input 
                         type="checkbox"
                         onChange={(e) => { console.log('Vault private changed:', e.target.checked) }}
                         className="cursor-pointer rounded-full transition-all duration-300 outline-none w-5 h-5" 
                       />
                     </label>
                  </Tooltip>
                  <label className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Enable Link Sharing</span>
                    <input 
                      type="checkbox" 
                      onChange={(e) => {
                        // Handle link sharing change
                        console.log('Link sharing changed:', e.target.checked);
                      }}
                      className="cursor-pointer border-none rounded-full transition-all duration-300 outline-none w-5 h-5" 
                    />
                  </label>
                </div>
              </div>

              {/* Members */}
              { selectedOption?.value === Options[1]?.value && (
              <div>
                <section className='flex flex-row items-center justify-between my-'>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Members</h3>
                <div className="flex flex-col md:flex-row gap-4">
                  <button
                    id='plusBTN'
                    onClick={() => setShowAddMemberModal(true)}
                    className="cursor-pointer flex flex-row items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl hover:shadow-md text-sm transition"
                  >
                    <span>Member</span><PlusIcon width={20} height={20}/> 
                  </button>
                </div>
                </section>
                <ul className="mt-4 divide-y divide-gray-100 dark:divide-gray-700">
                  {members.map((email) => (
                    <li key={email} className="hover:shadow-sm hover:shadow-red-400 cursor-pointer p-2 rounded-md dark:hover:bg-gray-800 flex justify-between items-center">
                      <span className="text-sm text-gray-800 dark:text-gray-100">{email}</span>
                      <button
                        onClick={() => {
                          setMemberToRemove(email);
                          setShowRemoveMemberModal(true);
                        }}
                        className="group flex flex-row items-center gap-2 text-md px-3 py-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 text-red-500 font-medium cursor-pointer"
                      >
                        <DeleteIcon width={20} height={20}/><span>Remove</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>)}

              {/* Notifications */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Notifications</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {Notification.map((label, index) => (
                  <label
                    key={index}
                    className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm"
                  >
                    <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                    <input 
                      type="checkbox" 
                      defaultChecked 
                      onChange={(e) => {
                        // Handle notification preferences
                        console.log(`${label} notification changed:`, e.target.checked);
                      }}
                      className="cursor-pointer border-none rounded-full transition-all duration-300 outline-none w-5 h-5" 
                    />
                  </label>
                ))}
              </div>
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
                  className="cursor-pointer bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl text-md transition flex items-center gap-2"
                  >
                    <DeleteIcon width={20} height={20} />
                    Delete vault Item
                  </button>
                  </div>
              </div>
            </div>
          )}
        </motion.div>

        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Delete Vault</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">This action cannot be undone</p>
                </div>
                <button
                  onClick={handleDeleteCancel}
                  className="p-2 cursor-pointer rounded-full text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-semibold text-red-800 dark:text-red-200">Permanent Deletion</h4>
                      <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                        This vault and all its contents will be permanently deleted. This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={handleDeleteCancel}
                  className="cursor-pointer px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="cursor-pointer px-5 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-sm hover:shadow-md"
                >
                  Delete Vault
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Add Member Modal */}
        {showAddMemberModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Members</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Invite people to join your vault</p>
                </div>
                <button
                  onClick={() => setShowAddMemberModal(false)}
                  className="p-2 cursor-pointer rounded-full text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Member Email Addresses
                  </label>
                  <div className="space-y-3">
                    <div className="relative">
                      <input
                        type="email"
                        value={memberEmail}
                        onChange={(e) => setMemberEmail(e.target.value)}
                        placeholder="Enter member email address"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const container = document.getElementById('email-inputs-container');
                      const input = document.createElement('input');
                      input.type = 'email';
                      input.placeholder = 'Enter another email';
                      input.className = "w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 mt-2";
                      container.appendChild(input);
                    }} 
                    className="mt-3 inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add another email
                  </button>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        <span className="font-medium">Invitation sent!</span> Each member will receive an email with secure access to your vault.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={() => setShowAddMemberModal(false)}
                  className="cursor-pointer px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const emails = memberEmail.split('\n').map(e => e.trim()).filter(e => e);
                    emails.forEach(email => {
                      if (email && !members.includes(email)) {
                        setMembers(prev => [...prev, email]);
                      }
                    });
                    setMemberEmail("");
                    setShowAddMemberModal(false);
                  }}
                  className="cursor-pointer px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm hover:shadow-md"
                >
                  Send Invitations
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Remove Member Warning Modal */}
        {showRemoveMemberModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Remove Member</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">This action cannot be undone</p>
                </div>
                <button
                  onClick={() => {
                    setShowRemoveMemberModal(false);
                    setMemberToRemove(null);
                  }}
                  className="p-2 cursor-pointer rounded-full text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 cursor-pointer">
                      <svg className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-semibold text-red-800 dark:text-red-200">Remove Member</h4>
                      <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                        Are you sure you want to remove <span className="font-semibold">{memberToRemove}</span> from this vault? They will lose access immediately.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={() => {
                    setShowRemoveMemberModal(false);
                    setMemberToRemove(null);
                  }}
                  className="cursor-pointer px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    removeMember(memberToRemove);
                    setShowRemoveMemberModal(false);
                    setMemberToRemove(null);
                  }}
                  className="cursor-pointer px-5 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-sm hover:shadow-md"
                >
                  Remove Member
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
