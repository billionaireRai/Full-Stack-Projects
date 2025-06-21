
"use client";

import { useInactivityChecker } from "@/components/useInactivityChecker.jsx";
import { useForm, Controller } from "react-hook-form"; // controller is used to deal with 3rd party integration in form...
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/navbar.jsx";
import useUserDerivedEncryptionKey from "@/state/derivedEncrypKey";
import axios from "axios";
import toast from "react-hot-toast";
import CustomSelect from "@/components/customSelect.jsx";

// defining the access controls...
const accessOptions = [
  { value: "private", label: "🔒 Private" },
  { value: "shared", label: "🔗 Shared" },
];

export default function NewVaultPage() {
  useInactivityChecker(process.env.NEXT_PUBLIC_INACTIVITY_CHECKER_LOGOUT);
  const { encryptionKeyValue } = useUserDerivedEncryptionKey(); // getting user encryption key...
  const router = useRouter();

  const {
    register: registerBank,
    handleSubmit: handleSubmitBank,
    control: controlBank,
    formState: { errors: bankErrors },
  } = useForm();

  const {
    register: registerCard,
    handleSubmit: handleSubmitCard,
    control: controlCard,
    formState: { errors: cardErrors },
  } = useForm();

  const {
    register: registerCrypto,
    handleSubmit: handleSubmitCrypto,
    control: controlCrypto,
    formState: { errors: cryptoErrors },
  } = useForm();

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    control: controlPassword,
    formState: { errors: passwordErrors },
  } = useForm();

  const handleSubmittionLogic = async (data) => {
    try {
      
    } catch (error) {
      
    }
  };

  const handleFormSumbittionToast = (data) => {
    return toast.promise(handleSubmittionLogic(data), {
      loading: "Submitting your credentials...",
      success: () => {
        router.refresh();
        return "Submission successful!";
      },
      error: "Submission failed!",
    }, {
      success: { duration: 4000 },
      error: { duration: 4000 },
      loading: { duration: 3000 },
    });
  };

  const onSubmittingForm = async (data, vaultCategory) => {
    const enrichedData = {
      ...data,
      vaultCategory: vaultCategory,
    };
    await handleFormSumbittionToast(enrichedData);
  };

  const renderError = (error) =>
    error && (
      <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
        <Image src="/images/warning.png" alt="Error" width={18} height={18} />
        <span>{error.message}</span>
      </div>
    );

  const SectionWrapper = ({ title, children }) => (
    <section className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        {title}
      </h2>
      {children}
    </section>
  );

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
