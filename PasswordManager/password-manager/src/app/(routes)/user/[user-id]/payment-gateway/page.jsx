"use client";

import VaultNavbar from "@/components/navbar";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";

export default function UserPaymentGateway() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState("basic");
  const [subscription, setsubscription] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { register, handleSubmit, formState: { errors }} = useForm();

  useEffect(() => {
    const planParam = searchParams.get("plan");
    if (planParam && plans[planParam]) {
      setSelectedPlan(planParam);
    }
  }, [searchParams]);

  const plans = {
    freemium: {
      name: "freemium",
      id:"WSDR$EDFGY^TFBJIU",
      price: "₹0/month",
      description: "Get started with essential features.",
      features: ["Basic access", "1 device only", "Community support", "Limited storage"],
    },
    basic: {
      name: "basic",
      id:"!@WSDFGHY^&*IKMNG",
      price: "₹899/month",
      description: "Best suited for individual users.",
      features: ["All Freemium features", "Email support", "2 devices", "100 GB storage"],
    },
    standard: {
      name: "standard",
      id:"E$%TDCVHU*&^%EW$%^&UH",
      price: "₹1499/month",
      description: "Perfect for small teams & power users.",
      features: ["All Basic features", "Priority support", "Up to 5 devices", "1 TB storage"],
    },
    premium: {
      name: "premium",
      id:"VG^^&*&UVBHJOIBUVY^%D",
      price: "₹3199/month",
      description: "Full access for businesses & families.",
      features: [
        "All Standard features",
        "Unlimited devices",
        "24/7 support",
        "Family sharing",
        "Unlimited storage",
      ],
    },
  };

  const plan = plans[selectedPlan];

  // function handling payment trigger logic...
  const [showPaymentTypeModal, setShowPaymentTypeModal] = useState(false);
  const [formData, setFormData] = useState(null);

  // Implement backend payment verification and storage in PATCH /apis/payment-request.
  // Add error handling for payment failures or backend errors.

  // Function to dynamically load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.getElementById("razorpay-script")) {
        resolve(true);
        return ;
    }
  });
}

  const proceedPayment = async (data, isSubscription) => {
    setsubscription(isSubscription); // Set subscription state based on user choice...
    const res = await loadRazorpayScript(); // loading the standard checkout page...
    if (!res) {
      toast.error("check your internet connection.");
      return;
    }
    const { dataFromServer , user } = await axios.post("/apis/payment-request",{ plan: plan , data:data, subscription :isSubscription });
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
      amount: parseInt(String(plan.price).substring(1).replace(/,/g, '')) * 100, // amount converted in paise...
      currency: "INR",
      name: "lockRift",
      description: isSubscription ? `Subscription for ${plan.name} plan` : "Payment for plan",
      subscription_id: isSubscription ? dataFromServer.id : undefined,
      order_id: isSubscription ? undefined : dataFromServer.id,
      handler: async (response) => {
        const { razorpay_payment_id , razorpay_order_id, razorpay_subscription_id } = response ;
        // sending these credentials to backend for verification and DB storage....
        await axios.patch("/apis/payment-request", {
          payment_id: razorpay_payment_id,
          order_id: razorpay_order_id,
          subscription_id: razorpay_subscription_id,
        });
      },
      prefill: {
        name: user.name,
        email: user.email,
      },
      theme:{ color: '#3399cc'}
    }
    const paymentObject = new window.Razorpay(options);
    paymentObject.open(); // opening the razorpay hosted page for payment...
  };

  const onSubmit = (data) => {
    setFormData(data);
    setShowPaymentTypeModal(true);
  };

  const handlePaymentTypeSelection = (isSubscription) => {
    setShowPaymentTypeModal(false);
    if (formData) {
      proceedPayment(formData, isSubscription);
    }
  };

  const handleCancelModalPop = () => {
    setShowConfirmModal(true); // no need to negate as modal has it...
  };

  // function handling acctual payment cancellation logic....
  const confirmCancel = () => {
    setShowConfirmModal(false);
  
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white dark:bg-gray-900 px-4 pt-24 pb-28 text-gray-800 dark:text-gray-100"
    >
      <VaultNavbar />

      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4 text-blue-800 dark:text-blue-400">
          💳 Confirm Your Plan & Pay
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-xl mx-auto text-lg">
          You’ve selected the <span className="font-semibold">{plan.name}</span> plan. Fill in your
          payment details to complete your subscription.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Plan Summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-blue-50 dark:bg-blue-900 p-6 rounded-xl shadow-sm border-none"
          >
            <h2 className="text-2xl font-semibold text-blue-900 dark:text-blue-300 mb-1">
              {plan.name} Plan
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{plan.description}</p>
            <div className="text-3xl font-bold text-blue-700 dark:text-blue-400 mb-6">{plan.price}</div>
            <ul className="space-y-2">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-center text-gray-800 dark:text-gray-200">
                  <svg
                    className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Payment Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
              🔐 Payment Details For Reference
            </h3>
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Cardholder Name
                </label>
                <input
                  {...register("name", { required: "Cardholder name is required" })}
                  type="text"
                  placeholder="your name on card"
                  className={`w-full rounded-md border p-3 transition-all duration-300 focus:outline-none focus:ring-2 ${
                    errors.name
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400"
                  }`}
                />
                {errors.name && 
                <p className="text-red-500 text-sm mt-1 flex flex-row items-center gap-2">
                  <img width={20} height={20} src="/images/warning.png" alt="warning" />
                  <span>{errors.name.message}</span>
                </p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Card Number
                </label>
                <input
                  {...register("number", {
                    required: "Card number is required",
                    pattern: {
                      value: /^[0-9\s]{13,19}$/,
                      message: "Invalid card number",
                    },
                  })}
                  type="text"
                  placeholder="**** **** **** ****"
                  className={`w-full rounded-md border p-3 transition-all duration-300 focus:outline-none focus:ring-2 ${
                    errors.number
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400"
                  }`}
                />
                {errors.number && (
                  <p className="text-red-500 text-sm mt-1 flex flex-row items-center gap-2">
                   <img width={20} height={20} src="/images/warning.png" alt="warning" />
                   <span>{errors.number.message}</span>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Expiry Date
                  </label>
                  <input
                    {...register("expiry", {
                      required: "Expiry date is required",
                      pattern: {
                        value: /^(0[1-9]|1[0-2])\/?([0-9]{2})$/,
                        message: "Invalid expiry date (MM/YY)",
                      },
                    })}
                    type="text"
                    placeholder="MM/YY"
                    className={`w-full rounded-md border p-3 transition-all duration-300 focus:outline-none focus:ring-2 ${
                      errors.expiry
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400"
                    }`}
                  />
                  {errors.expiry && (
                    <p className="text-red-500 text-sm mt-1 flex flex-row items-center gap-2">
                      <img width={20} height={20} src="/images/warning.png" alt="warning" />
                      <span>{errors.expiry.message}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    CVV
                  </label>
                  <input
                    {...register("cvv", {
                      required: "CVV is required",
                      pattern: {
                        value: /^[0-9]{3,4}$/,
                        message: "Invalid CVV",
                      },
                    })}
                    type="text"
                    placeholder="123"
                    className={`w-full rounded-md border p-3 transition-all duration-300 focus:outline-none focus:ring-2 ${
                      errors.cvv
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400"
                    }`}
                  />
                  {errors.cvv && 
                  <p className="text-red-500 text-sm mt-1 flex flex-row items-center gap-2">
                     <img width={20} height={20} src="/images/warning.png" alt="warning" />
                     <span>{errors.name.message}</span>
                  </p>
                  }
                </div>
              </div>

              <button
                type="submit"
                className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-lg font-semibold text-lg"
              >
                Pay {plan.price}
              </button>
            </form>
          </motion.div>
        </div>

        {/* Bottom Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 text-center space-y-6"
        >
          <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line w-4/5 mx-auto text-left text-base leading-relaxed">
            If you need assistance at any point during your payment process, please don't hesitate
            to reach out to our dedicated support team. We're here to help you with any questions or
            concerns you may have. Alternatively, if you wish to cancel your payment, you can do so
            easily using the button below.
          </p>
          <div className="flex justify-center flex-wrap gap-4">
            <button
              onClick={handleCancelModalPop}
              className="cursor-pointer bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400 px-5 py-2 rounded-md hover:bg-red-200 dark:hover:bg-red-800 transition"
            >
              Cancel Payment
            </button>
            <Link
              href="/customer-support"
              className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 px-5 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              Contact Support
            </Link>
            <Link
              href="/subscription"
              className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-400 px-5 py-2 rounded-md hover:bg-green-200 dark:hover:bg-green-800 transition"
            >
              Change Plan
            </Link>
          </div>
        </motion.div>
      </div>


      {/* Cancel Confirmation (Modal) means PopUp */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl shadow-lg p-8 w-full max-w-md mx-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h3 className="text-xl font-semibold mb-4">Are you sure you want to cancel?</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Your selected plan will not be activated, and the payment process will be aborted.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="cursor-pointer bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Close
                </button>
                <button
                  onClick={confirmCancel}
                  className="cursor-pointer bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Confirm Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Type Selection Modal */}
      <AnimatePresence>
        {showPaymentTypeModal && (
          <motion.div
            className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl shadow-lg p-8 w-full max-w-md mx-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h3 className="text-xl font-semibold mb-4">Choose Payment Type</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Please select whether you want to make a one-time payment or subscribe.
              </p>
              <div className="flex justify-center gap-6">
                <button
                  onClick={() => handlePaymentTypeSelection(false)}
                  className="cursor-pointer bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                >
                  One Time Payment
                </button>
                <button
                  onClick={() => handlePaymentTypeSelection(true)}
                  className="cursor-pointer bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
                >
                  Subscription
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
