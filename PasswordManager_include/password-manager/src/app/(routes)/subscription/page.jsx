"use client";

import Link from "next/link";
import { useState,useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import useUserID from "@/state/useridState";
import Navbar from "@/components/navbar.jsx";
import axios from "axios";
import toast from "react-hot-toast";

export default function UserSubscriptionOptionsPage() {
  const router = useRouter() ;
  const { userId } = useUserID() ;
  const [isCancelVisible, setisCancelVisible] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null); // targeting initially on the freemium one...
  const plans = [ 
    { name: "freemium", value: "freemium", price: "₹0/mo", description: "Perfect for casual users getting started.", features: [ "Basic Vault Access", "Email Support (48h response)", "Access on 1 Device", "Community Forum Access", 'AvailableStorage of 20MB', 'Security level basic practices with monitoring.' ], bestFor: "Individuals exploring the platform", supportLevel: "Basic" }, 
    { name: "basic", value: "basic", price: "₹899/month", description: "Ideal for individuals with light usage needs.", features: [ "All Freemium Features", "Priority Email Support (24h response)", "Access on up to 2 Devices", "comparetively More Items in Vault", "Two-Factor Authentication", 'AvailableStorage 40MB' ,'Security strong and industry best practices with monitoring plus tracking.' ], bestFor: "Solo professionals", supportLevel: "Priority Email" },
    { name: "standard", value: "standard", price: "₹1499/month", description: "Great for professionals and small teams.", features: [ "All Basic Features", "Advanced Sharing Controls", "Access on Unlimited Devices", "Version History (30 days)", "Activity Logs", "Live Chat Support (Business Hours)", 'AvailableStorage 80MB', 'Security Advance Security Practices with suggestions for breaches.' ], bestFor: "Small teams & power users", supportLevel: "Live Chat + Email"
    },
    { name: "premium", value: "premium", price: "₹3199/month", description: "Full-featured solution for power users & families.", features: [ "All Standard Features", "24/7 Priority Support", "Family & Team Sharing (Up to 6 Members)", "Early Access to New Features", "Dedicated Account Manager", "Data Breach Monitoring", 'AvailableStorage 150MB' ,'Security highly secured and strong firewall with monitoring.' ], bestFor: "Enterprises, families & high-security users", supportLevel: "24/7 Premium"
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { scale: 1.05, boxShadow: "0 0 8px rgb(59 130 246 / 0.7)" },
    tap: { scale: 0.95 },
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };
  // function for getting the user subscription level...
  const getSubscriptionLevel = async () => {
    try {
      const response = await axios.get('/apis/subscription');
      if (response.status === 200) {
        const subscriptionLevel = response.data.subscriptionLevel;
        setSelectedPlan(subscriptionLevel);
    }
      return "subscription level fetched !";
    } catch (error) {
      console.error(error);
      return ;
    }
  }

  // Wrapper function to handle promise with toast notifications, supporting success callback...
  const handleWithToast = (promiseFunc, messages) => {
    return toast.promise(promiseFunc(),
      {
        loading: messages.loading || "Processing...",
        success: typeof messages.success === "function" ? (data) => {
          const result = messages.success(data);
          return typeof result === "string" ? result : "Success!";
        } : messages.success || "Success!",
        error: messages.error || "Error occurred",
      }
    );
  };

  const handlePlanUpGrade = () => { 
    if (selectedPlan === 'premium') {
      toast.error("No need to upgrade already on premium plan",{duration:3000,icon:true});
      return ;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return ;
  }

  // logics related to downgrading...
  const [isDowngradePopupVisible, setIsDowngradePopupVisible] = useState(false);
  const [downgradeTargetPlan, setDowngradeTargetPlan] = useState(null);

  const handlePlanDownGrade = async (downPlan) => { 
    try {
       const downApiRes = await axios.patch('/apis/subscription', { planToDownGrade: downPlan });
       if (downApiRes.status === 200) {
         setSelectedPlan(downPlan); 
         setIsDowngradePopupVisible(false);
         router.refresh() ;
         return 'downgrade successfull !!' ;
       }
    } catch (error) {
      console.error(error);
      return ;
     }
   }

  const handlePlanDownGradeWithToast = (downPlan) => {
    return handleWithToast(
      () => handlePlanDownGrade(downPlan),
      {
        loading: "Downgrading plan...",
        success: "Plan downgraded successfully!",
      }
    );
  };

  const handlePlanDownGradePopUp = (currentPlan) => {
    const indexOfCard = plans.findIndex(plan => plan.name === currentPlan);
    if (indexOfCard > 0) {
      setDowngradeTargetPlan(plans[indexOfCard-1].name);
      setIsDowngradePopupVisible((prev) => !prev);
      return ;
    }
    toast.error("already at the lowest plan !");
  }

  const handleCancelSubscription = async () => {
    const cancelApiRes = await axios.post('/apis/subscription',{currentPlan:selectedPlan})
    if (cancelApiRes.status === 200) {
      setSelectedPlan('freemium');
      console.log("Subscription successfully cancelled...");
      return 'subscription cancelled !!';
    }
    toast.error("error in cancellation of plan !");
  };

  const handleCancelSubscriptionWithToast = () => {
    return handleWithToast(
      () => handleCancelSubscription(),
      {
        loading: "Cancelling subscription...",
        success: "Subscription cancelled successfully!",
      }
    );
  };


  // useeffect handling the logics on page reload...
  useEffect(() =>{
    getSubscriptionLevel();
  },[])
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 pt-28 pb-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">✨ Manage Your Subscription</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Choose the best plan for your needs. You can upgrade, downgrade, or cancel at any time.
          </p>
        </motion.div>

        <section className="grid md:grid-cols-4 gap-8 mb-16">
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              className={`rounded-xl border ${
                selectedPlan === plan.name
                  ? "border-blue-600 border-2 shadow-blue-800 shadow-lg"
                  : "border-gray-200 dark:border-gray-700"
              } bg-white dark:bg-gray-800 p-6 shadow-md cursor-pointer flex flex-col items-start justify-between transition-all duration-300`}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              whileTap="tap"
              layout
            >
              <div>
                <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
                <p className="text-gray-600 dark:text-gray-400 text-xl mb-4">{plan.price}</p>
                <ul className="mb-6 space-y-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <span className="text-blue-500 dark:text-blue-400">✔</span> {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <motion.button
                onClick={() => setSelectedPlan(plan.name)}
                className={`cursor-pointer duration-300 hover:border hover:border-blue-600 w-full text-sm font-medium px-4 py-2 rounded-lg transition ${
                  selectedPlan === plan.name
                    ? "bg-blue-600 text-white border-none"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900"
                }`}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                layout
              >
                {selectedPlan === plan.name ? "Current Plan" : "Select Plan"}
              </motion.button>
           </motion.div>
          ))}
        </section>
        <div className="flex items-center justify-end mb-3.5">
          <Link href={{ pathname: `/user/${userId}/payment-gateway`, query: { plan: selectedPlan } }}>
            {selectedPlan !== "freemium" ? (
              <motion.button
                className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Move With {selectedPlan}{" "}
              </motion.button>
            ) : (
              ""
            )}
          </Link>
        </div>
        {/* Action Buttons */}
          <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md p-8 relative">
          <h3 className="text-2xl font-semibold mb-6">🔧 Manage Your Plan</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 relative">
            <motion.button
              className="cursor-pointer w-full bg-green-500 text-white dark:bg-green-700 px-4 py-3 rounded-lg font-medium hover:bg-green-600 dark:hover:bg-green-800 transition"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => { handlePlanUpGrade() }}
            >
              Upgrade Plan
            </motion.button>
            <motion.button
              className="cursor-pointer w-full bg-yellow-400 text-white dark:bg-yellow-500 px-4 py-3 rounded-lg font-medium hover:bg-yellow-500 dark:hover:bg-yellow-600 transition"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => { handlePlanDownGradePopUp(selectedPlan) }}
            >
              Downgrade Plan
            </motion.button>
            {isDowngradePopupVisible && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="absolute z-50 top-full left-1/2 transform -translate-x-1/2 mt-2 w-80 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl shadow-lg p-5"
              >
                <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">Confirm Downgrade</h4>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Are you sure you want to downgrade your plan from <strong>{selectedPlan}</strong> to <strong>{downgradeTargetPlan || 'lower plan'}</strong>? Some features may become unavailable.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setIsDowngradePopupVisible(false)}
                    className="cursor-pointer px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {handlePlanDownGradeWithToast() }}
                    className="cursor-pointer px-4 py-2 rounded-md bg-yellow-400 text-white hover:bg-yellow-500 dark:bg-yellow-500 dark:hover:bg-yellow-600 transition"
                  >
                    Confirm
                  </button>
                </div>
              </motion.div>
            )}
            <div
              className="cursor-pointer w-full bg-red-500 text-white dark:bg-red-700 px-4 py-3 rounded-lg font-medium hover:bg-red-600 dark:hover:bg-red-800 transition relative"
            >
              <button
                type="button"
                onClick={() => { setisCancelVisible((prev) => selectedPlan !== 'freemium' ? !prev : '') } }
                className="w-full text-left cursor-pointer"
              >
                Cancel Subscription
              </button>
              {isCancelVisible && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="absolute z-50 top-full left-1/2 transform -translate-x-1/2 mt-2 w-100 bg-white dark:bg-gray-900 border border-red-500 dark:border-red-700 rounded-xl shadow-lg p-5"
                role="dialog"
                aria-modal="true"
                aria-labelledby="cancel-subscription-title"
                aria-describedby="cancel-subscription-desc"
              >
                <h4 id="cancel-subscription-title" className="text-lg font-semibold mb-3 text-red-700 dark:text-red-400">Confirm Subscription Cancellation</h4>
                <p id="cancel-subscription-desc" className="text-gray-700 dark:text-gray-300 mb-4">
                  Are you sure you want to cancel your <strong>{selectedPlan}</strong> subscription? You will lose access to premium features at the end of your billing cycle.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  This action cannot be undone. You can always re-subscribe later.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setisCancelVisible(false)}
                    className="cursor-pointer px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400 dark:focus:ring-gray-600"
                  >
                    Keep Subscription
                  </button>
                  <button
                    onClick={() => {handleCancelSubscriptionWithToast()}}
                    className="cursor-pointer px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 transition focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500"
                  >
                    Confirm Cancel
                  </button>
                </div>
              </motion.div>
             )}
            </div>
            <motion.button
              className="cursor-pointer w-full bg-blue-500 text-white dark:bg-blue-700 px-4 py-3 rounded-lg font-medium hover:bg-blue-600 dark:hover:bg-blue-800 transition"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Link href={'/customer-support'} >Contact Support</Link>
            </motion.button>
          </div>
        </section>

        {/* Billing Summary */}
        <section className="mt-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md p-8">
          <h3 className="text-xl font-semibold mb-4">📄 Billing Summary</h3>
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            <strong>Current Plan:</strong> {selectedPlan}
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            <strong>Next Billing Date:</strong> June 15, 2025
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <strong>Payment Method:</strong> **** **** **** 4242 (Visa)
          </p>
          <motion.button
            className="cursor-pointer mt-6 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-4 py-2 rounded-lg text-sm font-medium transition"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Update Payment Method
          </motion.button>
        </section>

        {/* FAQ Section */}
        <section className="mt-20">
          <h3 className="text-xl font-semibold mb-6">❓ Frequently Asked Questions</h3>
          <div className="space-y-4">
            <motion.div
              className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">
                Can I change my plan anytime?
              </h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </motion.div>
            <motion.div
              className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">
                What happens if I cancel my subscription?
              </h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                You will retain access to your current plan until the end of the billing cycle. No refunds for mid-cycle cancellations.
              </p>
            </motion.div>

            <motion.div
              className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">
                Will I lose my data if I downgrade?
              </h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                No, your data is safe. However, some premium features may become inaccessible if your new plan doesn't support them.
              </p>
            </motion.div>
            <motion.div
              className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">
                Do you offer student discounts?
              </h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Yes! We offer 30% off for verified students. Contact support with your student ID to get started.
              </p>
            </motion.div>

            <motion.div
              className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">
                How can I get a refund?
              </h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                We have a 7-day refund policy for new users. Contact our support team within 7 days of purchase to request a refund.
              </p>
            </motion.div>
            <motion.div
              className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">
                Can I pause my subscription instead of cancelling?
              </h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Currently, pausing subscriptions is not supported. We recommend downgrading to the Basic plan temporarily.
              </p>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}
