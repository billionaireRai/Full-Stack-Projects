"use client";

import { useInactivityChecker } from "@/components/useInactivityChecker.jsx";
import { useForm, Controller } from "react-hook-form"; // controller is used to deal with 3rd party integration in form...
import { useRouter } from "next/navigation";
import { encryptionOfVaultData } from "@/lib/encryptionLogic";
import { useState , useEffect} from "react";
import { getUserLocationInfoByPermission } from "@/lib/userLocation";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Navbar from "@/components/navbar.jsx";
import useUserPassPhraseHash from "@/state/passphraseHash";
import useUserDerivedEncryptionKey from "@/state/derivedEncrypKey";
import axios from "axios";
import toast from "react-hot-toast";
import CustomSelect from "@/components/customSelect.jsx";
import useUserID from "@/state/useridState";
import { motion } from "framer-motion";

const accessOptions = [
  { value: "private", label: "Private" },
  { value: "shared", label: "Shared" }
];

export default function NewVaultPage() {
  useInactivityChecker(process.env.NEXT_PUBLIC_INACTIVITY_CHECKER_LOGOUT);
  const { encryptionKeyValue } = useUserDerivedEncryptionKey(); // getting user encryption key...
  const router = useRouter();
  const { PassPhraseHashValue } = useUserPassPhraseHash() ;
  const { userId } = useUserID() ; // getting user ID for navigaition logic...

  const [userIP, setUserIP] = useState(null); // New state for IP address

  const {
    register: registerBank,
    handleSubmit: handleSubmitBank,
    control: controlBank,
    watch: watchBank,
    formState: { errors: bankErrors },
  } = useForm();

  const {
    register: registerCard,
    handleSubmit: handleSubmitCard,
    control: controlCard,
    watch: watchCard,
    formState: { errors: cardErrors },
  } = useForm();

  const {
    register: registerCrypto,
    handleSubmit: handleSubmitCrypto,
    control: controlCrypto,
    watch: watchCrypto,
    formState: { errors: cryptoErrors },
  } = useForm();

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    control: controlPassword,
    watch: watchPassword,
    formState: { errors: passwordErrors },
  } = useForm();
  
  // logic related to fetching the location of user...
  const [UserLocation, setUserLocation] = useState(null);
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

    // Fetch user IP address on component mount
    const fetchUserIP = async () => {
      try {
        const response = await axios.get("https://api.ipify.org?format=json");
        setUserIP(response.data.ip);
      } catch (error) {
        console.error("Failed to fetch IP address:", error);
      }
    };
    fetchUserIP();
  }, []);

  // Removed local state and handlers for sharedWithIndividuals inputs to avoid conflict with react-hook-form
const handleSubmittionLogic = async (data) => {
    try {
      // final data which will be sent to route handler...
      var dataToSend = {
        vaultCategory : data.vaultCategory,
        vaultDescription:data.vaultDescription,
        notes:data.notes,
        access: data.access,
        accessExpiresAt:data.accessExpiresAt || null ,
        sharedWithIndividuals:data.sharedWithIndividuals || []
      } ;
      const keysToExclude = ['vaultCategory', 'vaultDescription', 'access','accessExpiresAt','notes']; // keys to exclude from encryption
      // create a new object with keys to encrypt...
      const dataToEncrypt = Object.keys(data).reduce((acc, key) => {
        if (!keysToExclude.includes(key) && !key.startsWith('sharedWithIndividuals')) acc[key] = data[key];
        
        return acc;
      }, {}); // otherwise gona return an empty object...
      const encryptedInfo = await encryptionOfVaultData(dataToEncrypt,encryptionKeyValue) ; // encrption of vault...
      dataToSend = { ...dataToSend , encryptedInfo:encryptedInfo } ;
      // send data to route handler...
      const response = await axios.post('/apis/user/newvault',{
        dataInFormat:dataToSend,
        passPhrase :PassPhraseHashValue,
        locationOfAction: UserLocation ? UserLocation : " ",
        ipAddress: userIP || "unknown" // Include IP address here
      },{headers:{ 
        'Content-Type': 'application/json' ,
        'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }});
      if (response.status === 201)  {
        console.log('Vault created successfully');
        return { success : true } ;
      }
      else { 
        console.log('Error creating vault');
        throw new Error('An error occured in vault creation...');
      }
    } catch (error) {
      console.error("Error in handleSubmittionLogic:", error);
      return ;
    }
  };

  const handleFormSumbittionToast = (data) => {
    return toast.promise(handleSubmittionLogic(data), {
      loading: "Submitting your credentials...",
      success: () => {
        router.refresh();
        router.push(`/user/${userId}/dashboard`);
        return "Submission successfull !!";
      },
      error: "Submission failed!",
    }, {
      success: { duration: 3000 },
      error: { duration: 3000 },
      loading: { duration: 2000 },
    });
  };

  // function triggered when any form is submitted...
  const onSubmittingForm = async (data) => {
    await handleFormSumbittionToast(data); // calling the toast handling main function...
  };

  const renderError = (error) =>
    error && (
      <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
        <Image src="/images/warning.png" alt="Error" width={18} height={18} />
        <span>{error.message}</span>
      </div>
    );

const SectionWrapper = ({ title, children }) => {
  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.15
          },
        },
      }}
      className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700"
    >
      <motion.h2
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
        }}
        className="text-2xl font-semibold mb-6 flex items-center gap-2"
      >
        {title}
      </motion.h2>
      {Array.isArray(children)
        ? children.map((child, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
            >
              {child}
            </motion.div>
          ))
        : <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
            }}
          >
            {children}
          </motion.div>
      }
    </motion.section>
  );
};

  return (
    <div className="min-h-screen bg-[#f9fafb] dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <Navbar />
      <main className="pt-28 px-6 md:px-12 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">🔐 Create a New Vault</h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-14 max-w-xl mx-auto text-lg">
          All confidential data is processed with strict security protocols. Choose the appropriate vault category and submit the relevant information securely.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Bank Account Form */}
          <SectionWrapper title="🏦 Bank Account Details">
            <form onSubmit={handleSubmitBank((data) => onSubmittingForm(data, "bank-details"))} className="space-y-4">
              <input {...registerBank("bankName", { required: "Bank Name is required" })} placeholder="Bank Name" className="vault-form-input" />
              {renderError(bankErrors.bankName)}

              <input {...registerBank("holderName", { required: "Account Holder Name is required" })} placeholder="Account Holder Name" className="vault-form-input" />
              {renderError(bankErrors.holderName)}

              <input {...registerBank("accountNumber", { required: "Account Number is required" })} placeholder="Account Number" type="number" className="vault-form-input" />
              {renderError(bankErrors.accountNumber)}

              <input {...registerBank("ifsc", { required: "IFSC Code is required" })} placeholder="IFSC Code" className="vault-form-input" />
              {renderError(bankErrors.ifsc)}


              <textarea {...registerBank("notes",{required:"For the context of credential"}) } placeholder="Additional Notes" rows={3} className="vault-form-input"></textarea>
              {renderError(bankErrors.notes)}
              <textarea {...registerBank("vaultDescription", {
                required: "Vault description is required",
                minLength: { value: 10, message: "Minimum 10 characters required" },
                maxLength: { value: 300, message: "Maximum 300 characters allowed" },
              })} placeholder="Vault Description" rows={3} className="vault-form-input"></textarea>
              {renderError(bankErrors.vaultDescription)}

                  <Controller
                    name="access"
                    control={controlBank}
                    rules={{ required: "Access type is required" }}
                    render={({ field }) => (
                      <CustomSelect
                        {...field}
                        options={accessOptions}
                        placeholder="Select Access Type"
                        value={accessOptions.find(option => option.value === field.value) || null}
                        onChange={(selected) => field.onChange(selected ? selected.value : null)}
                      />
                    )}
                  />
                  {renderError(bankErrors.access)}

                  {/* Conditional section for shared access extra data */}
                  {/* 'watch' feature is used to access a input feild outside the render... */}
                  {watchBank("access") === "shared" && (
                    <div className="border border-gray-300 dark:border-gray-600 p-4 rounded-md mt-4 bg-gray-50 dark:bg-gray-700">
                      <label className="block mb-2 font-semibold">Shared With (User IDs or Emails)</label>
                      {/* using Controller for sharedWithIndividuals inputs to avoid page reload on typing */}
                      <Controller
                        name="sharedWithIndividuals"
                        control={controlBank}
                        rules={{ required: "Please specify shared user for security" }}
                        render={({ field }) => (
                          <>
                            {field.value && field.value.map((user, index) => (
                              <input
                                key={index}
                                {...registerBank(`sharedWithIndividuals.${index}`)}
                                placeholder={`email of User ${index + 1}`}
                                className="vault-form-input mb-2"
                                value={user}
                                onChange={(e) => {
                                  const newUsers = [...field.value];
                                  newUsers[index] = e.target.value;
                                  field.onChange(newUsers);
                                }}
                              />
                            ))}
                            <button
                              type="button"
                              onClick={() => {
                                const newUsers = field.value ? [...field.value, ""] : [""];
                                field.onChange(newUsers);
                              }}
                              className="cursor-pointer flex items-center text-blue-600 hover:text-blue-800"
                            >
                              <PlusCircleIcon className="h-6 w-6 mr-1" />
                              Add User
                            </button>
                          </>
                        )}
                      />
                      {renderError(bankErrors.sharedWithIndividuals)}

                      <label className="block mt-4 mb-2 font-semibold">Access Expires At</label>
                      <input
                        {...registerBank("accessExpiresAt")}
                        type="date"
                        className="vault-form-input"
                      />
                      {renderError(bankErrors.accessExpiresAt)}
                    </div>
                  )}

                  <input {...registerBank('vaultCategory')} type="text" value="bank-details" className="hidden vault-form-input cursor-not-allowed" disabled />
                  <button type="submit" className="vault-btn-submit">Save Bank Account</button>
            </form>
          </SectionWrapper>

          {/* Card Form */}
          <SectionWrapper title="💳 Bank Card Details">
            <form onSubmit={handleSubmitCard((data) => onSubmittingForm(data, "credit-card-details"))} className="space-y-4">
              <input {...registerCard("cardholderName", { required: "Cardholder Name is required" })} placeholder="Cardholder Name" className="vault-form-input" />
              {renderError(cardErrors.cardholderName)}

              <input {...registerCard("cardNumber", { required: "Card Number is required" })} type="number" placeholder="Card Number" className="vault-form-input" />
              {renderError(cardErrors.cardNumber)}

              <input {...registerCard("expiryDate", { required: "Expiry Date is required" })} type="date" className="vault-form-input" />
              {renderError(cardErrors.expiryDate)}

              <input {...registerCard("cvv", { required: "CVV is required" })} type="number" placeholder="CVV" className="vault-form-input" />
              {renderError(cardErrors.cvv)}

              <textarea {...registerCard("cardNotes",{required:"For the context of credential"})} placeholder="Card Notes" rows={3} className="vault-form-input"></textarea>
              {renderError(cardErrors.cardNotes)}
              <textarea {...registerCard("vaultDescription", {
                required: "Vault description is required",
                minLength: { value: 10, message: "Minimum 10 characters required" },
                maxLength: { value: 300, message: "Maximum 300 characters allowed" },
              })} placeholder="Vault Description" rows={3} className="vault-form-input"></textarea>
              {renderError(cardErrors.vaultDescription)}

                  <Controller
                    name="access"
                    control={controlCard}
                    rules={{ required: "Access type is required" }}
                    render={({ field }) => (
                      <CustomSelect
                        {...field}
                        options={accessOptions}
                        placeholder="Select Access Type"
                        value={accessOptions.find(option => option.value === field.value) || null}
                        onChange={(selected) => field.onChange(selected ? selected.value : null)}
                      />
                    )}
                  />
                  {renderError(cardErrors.access)}

                  {/* Conditional section for shared access extra data */}
                  {watchCard("access") === "shared" && (
                    <div className="border border-gray-300 dark:border-gray-600 p-4 rounded-md mt-4 bg-gray-50 dark:bg-gray-700">
                      <label className="block mb-2 font-semibold">Shared With (User IDs or Emails)</label>
                      {/* Changed to use Controller for sharedWithIndividuals inputs to avoid page reload on typing */}
                      <Controller
                        name="sharedWithIndividuals"
                        control={controlCard}
                        rules={{ required: "Please specify shared user" }}
                        render={({ field }) => (
                          <>
                            {field.value && field.value.map((user, index) => (
                              <input
                                key={index}
                                {...registerCard(`sharedWithIndividuals.${index}`)}
                                placeholder={`email of User ${index + 1}`}
                                className="vault-form-input mb-2"
                                value={user}
                                onChange={(e) => {
                                  const newUsers = [...field.value];
                                  newUsers[index] = e.target.value;
                                  field.onChange(newUsers);
                                }}
                              />
                            ))}
                            <button
                              type="button"
                              onClick={() => {
                                const newUsers = field.value ? [...field.value, ""] : [""];
                                field.onChange(newUsers);
                              }}
                              className="cursor-pointer flex items-center text-blue-600 hover:text-blue-800"
                            >
                              <PlusCircleIcon className="h-6 w-6 mr-1" />
                              Add User
                            </button>
                          </>
                        )}
                      />
                      {renderError(cardErrors.sharedWithIndividuals)}

                      <label className="block mt-4 mb-2 font-semibold">Access Expires At</label>
                      <input
                        {...registerCard("accessExpiresAt")}
                        type="date"
                        className="vault-form-input"
                      />
                      {renderError(cardErrors.accessExpiresAt)}
                    </div>
                  )}

                  <input {...registerCard('vaultCategory')} type="text" value="credit-card-details" className="hidden vault-form-input cursor-not-allowed" disabled />
                  <button type="submit" className="vault-btn-submit">Save Card</button>
            </form>
          </SectionWrapper>

          {/* Crypto Form */}
          <SectionWrapper title="🪙 Crypto Wallet Details">
            <form onSubmit={handleSubmitCrypto((data) => onSubmittingForm(data, "cryptowallet-details"))} className="space-y-4">
              <input {...registerCrypto("walletName", { required: "Wallet Name is required" })} placeholder="Wallet Name" className="vault-form-input" />
              {renderError(cryptoErrors.walletName)}

              <input {...registerCrypto("walletAddress", { required: "Wallet Address is required" })} placeholder="Wallet Address" className="vault-form-input" />
              {renderError(cryptoErrors.walletAddress)}

              <input {...registerCrypto("network", { required: "Network is required" })} placeholder="Network" className="vault-form-input" />
              {renderError(cryptoErrors.network)}

              <textarea {...registerCrypto("privateKey", { required: "Private Key / Seed Phrase is required" })} placeholder="Private Key / Seed Phrase" rows={3} className="vault-form-input"></textarea>
              {renderError(cryptoErrors.privateKey)}
              <textarea {...registerCrypto("vaultDescription", {
                required: "Vault description is required",
                minLength: { value: 10, message: "Minimum 10 characters required" },
                maxLength: { value: 300, message: "Maximum 300 characters allowed" },
              })} placeholder="Vault Description" rows={3} className="vault-form-input"></textarea>
              {renderError(cryptoErrors.vaultDescription)}

                  <Controller
                    name="access"
                    control={controlCrypto}
                    rules={{ required: "Access type is required" }}
                    render={({ field }) => (
                      <CustomSelect
                        {...field}
                        options={accessOptions}
                        placeholder="Select Access Type"
                        value={accessOptions.find(option => option.value === field.value) || null}
                        onChange={(selected) => field.onChange(selected ? selected.value : null)}
                      />
                    )}
                  />
                  {renderError(cryptoErrors.access)}

                  {/* Conditional section for shared access extra data */}
                  {watchCrypto("access") === "shared" && (
                    <div className="border border-gray-300 dark:border-gray-600 p-4 rounded-md mt-4 bg-gray-50 dark:bg-gray-700">
                      <label className="block mb-2 font-semibold">Shared With (User IDs or Emails)</label>
                      {/* Changed to use Controller for sharedWithIndividuals inputs to avoid page reload on typing */}
                      <Controller
                        name="sharedWithIndividuals"
                        control={controlCrypto}
                        rules={{ required: "Please specify shared user" }}
                        render={({ field }) => (
                          <>
                            {field.value && field.value.map((user, index) => (
                              <input
                                key={index}
                                {...registerCrypto(`sharedWithIndividuals.${index}`)}
                                placeholder={`email of User ${index + 1}`}
                                className="vault-form-input mb-2"
                                value={user}
                                onChange={(e) => {
                                  const newUsers = [...field.value];
                                  newUsers[index] = e.target.value;
                                  field.onChange(newUsers);
                                }}
                              />
                            ))}
                            <button
                              type="button"
                              onClick={() => {
                                const newUsers = field.value ? [...field.value, ""] : [""];
                                field.onChange(newUsers);
                              }}
                              className="cursor-pointer flex items-center text-blue-600 hover:text-blue-800"
                            >
                              <PlusCircleIcon className="h-6 w-6 mr-1" />
                              Add User
                            </button>
                          </>
                        )}
                      />
                      {renderError(cryptoErrors.sharedWithIndividuals)}

                      <label className="block mt-4 mb-2 font-semibold">Access Expires At</label>
                      <input
                        {...registerCrypto("accessExpiresAt")}
                        type="date"
                        className="vault-form-input"
                      />
                      {renderError(cryptoErrors.accessExpiresAt)}
                    </div>
                  )}

                  <input {...registerCrypto('vaultCategory')} type="text" value="cryptowallet-details" className="hidden vault-form-input cursor-not-allowed" disabled />
                  <button type="submit" className="vault-btn-submit">Save Crypto Wallet</button>
            </form>
          </SectionWrapper>

          {/* Password Form */}
          <SectionWrapper title="🔑 Password Details">
            <form onSubmit={handleSubmitPassword((data) => onSubmittingForm(data, "password-details"))} className="space-y-4">
              <input {...registerPassword("passwordFor", { required: "Account Name is required" })} placeholder="Password For" className="vault-form-input" />
              {renderError(passwordErrors.passwordFor)}

              <input {...registerPassword("platform_Url", { required: "Platform Name / URL is required" })} placeholder="Platform Name / URL" className="vault-form-input" />
              {renderError(passwordErrors.platform_Url)}

              <input {...registerPassword("password", { required: "Password is required" })} type="password" placeholder="Password" className="vault-form-input" />
              {renderError(passwordErrors.password)}

              <textarea {...registerPassword("recovery",{required:"For the context of credential"})} placeholder="Notes or Recovery Info" rows={3} className="vault-form-input"></textarea>
              {renderError(passwordErrors.recovery)}
              <textarea {...registerPassword("vaultDescription", {
                required: "Vault description is required",
                minLength: { value: 10, message: "Minimum 10 characters required" },
                maxLength: { value: 300, message: "Maximum 300 characters allowed" },
              })} placeholder="Vault Description" rows={3} className="vault-form-input"></textarea>
              {renderError(passwordErrors.vaultDescription)}

                  <Controller
                    name="access"
                    control={controlPassword}
                    rules={{ required: "Access type is required" }}
                    render={({ field }) => (
                      <CustomSelect
                        {...field}
                        options={accessOptions}
                        placeholder="Select Access Type"
                        value={accessOptions.find(option => option.value === field.value) || null}
                        onChange={(selected) => field.onChange(selected ? selected.value : null)}
                      />
                    )}
                  />
                  {renderError(passwordErrors.access)}

                  {/* Conditional section for shared access extra data */}
                  {watchPassword("access") === "shared" && (
                    <div className="border border-gray-300 dark:border-gray-600 p-4 rounded-md mt-4 bg-gray-50 dark:bg-gray-700">
                      <label className="block mb-2 font-semibold">Shared With (User IDs or Emails)</label>
                      {/* Changed to use Controller for sharedWithIndividuals inputs to avoid page reload on typing */}
                      <Controller
                        name="sharedWithIndividuals"
                        control={controlPassword}
                        rules={{ required: "Please specify shared user" }}
                        render={({ field }) => (
                          <>
                            {field.value && field.value.map((user, index) => (
                              <input
                                key={index}
                                {...registerPassword(`sharedWithIndividuals.${index}`)}
                                placeholder={`email of User ${index + 1}`}
                                className="vault-form-input mb-2"
                                value={user}
                                onChange={(e) => {
                                  const newUsers = [...field.value];
                                  newUsers[index] = e.target.value;
                                  field.onChange(newUsers);
                                }}
                              />
                            ))}
                            <button
                              type="button"
                              onClick={() => {
                                const newUsers = field.value ? [...field.value, ""] : [""];
                                field.onChange(newUsers);
                              }}
                              className="cursor-pointer flex items-center text-blue-600 hover:text-blue-800"
                            >
                              <PlusCircleIcon className="h-6 w-6 mr-1" />
                              Add User
                            </button>
                          </>
                        )}
                      />
                      {renderError(passwordErrors.sharedWithIndividuals)}

                      <label className="block mt-4 mb-2 font-semibold">Access Expires At</label>
                      <input
                        {...registerPassword("accessExpiresAt")}
                        type="date"
                        className="vault-form-input"
                      />
                      {renderError(passwordErrors.accessExpiresAt)}
                    </div>
                  )}

                  <input {...registerPassword('vaultCategory')} type="text" value="password-details" className="hidden vault-form-input cursor-not-allowed" disabled />
                  <button type="submit" className="vault-btn-submit">Save Password</button>
            </form>
          </SectionWrapper>
        </div>

        <section className="mt-24 mb-10 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-3">✨ Suggestions</h2>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 leading-relaxed">
            <li>Use strong, unique passwords for each and every record.</li>
            <li>Don't share your passwords with anyone.</li>
            <li>Update passwords regularly and avoid reusing them.</li>
            <li>We will encrypt sensitive notes or recovery info before storing.</li>
          </ul>
        </section>
      </main>
    </div>
  );
}

