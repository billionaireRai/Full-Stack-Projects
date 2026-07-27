'use client'

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from 'axios';
import { plans, SubsPlanType } from "@/lib/subscription-plans";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { MdSecurity, MdArrowBack } from "react-icons/md";
import toast from "react-hot-toast";


export default function PaymentPage() {
  const router = useRouter() ; // initializing useRouter() hook...
  const searchParams = useSearchParams();
  
  // plan related info...
  const [Term, setTerm] = useState<string>('');
  const [plan, setplan] = useState<SubsPlanType | null>(null) ;
  
  // function for setting right plan...
  function getAndSetPlan() : void {
    const planParam = searchParams.get('plan');
    const term = searchParams.get('term');

    const pursuedPlan = plans.find((eachPlan) => eachPlan.name === planParam);
    
    if (term?.trim() && planParam?.trim() && pursuedPlan) {
      setplan(pursuedPlan);
      setTerm(term);
    }
  }

  // function giving price based on term..
  const respectivePrice = () => { 
    if (Term === 'Monthly') return plan?.prices.monthly ;
    
    return plan?.prices.yearly ;
  }

  // function to calculate cost and gst...
  const calculateCostMetric = () => { 
    const price = Number(respectivePrice() ?? 0);
    const gst = Math.round(price * 0.05);
    const total = price + gst;

    return { price , gst , total } ;
  }
  
  // Fetching client secret from API...
  const getSubscriptionSessionURL = async () => {
    const loadingtoast = toast.loading('Redirecting to stripe payment...');
    try {
      const response = await axios.post('/api/subscription/create-session',{ plan:plan?.name , term:Term , clienturl:window.location.href });

      if (response.status === 200) {
        const { url } = await response.data ;
        router.push(url) ;
        toast.dismiss(loadingtoast);
      }
      } catch (error) {
      toast.dismiss(loadingtoast);
      console.error('Error fetching client secret:', error);
    }
  };

  useEffect(() => {
    getAndSetPlan() ; // for getting right payment for user...
  });
   

  if (!plan) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black text-gray-900 dark:text-white font-poppins">
        <motion.div
          className="flex flex-row justify-center items-center gap-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-12 h-12 border-4 border-green-200 dark:border-green-300 border-t-yellow-500 dark:border-t-yellow-400 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">Preparing secure payment for your plan...</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-white dark:bg-black text-gray-900 dark:text-white font-poppins py-10 px-4">
      {/* Header */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <button
           onClick={() => { router.back() }}
           className="text-gray-600 dark:text-gray-400 p-1 rounded-full hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-950 cursor-pointer transition">
            <MdArrowBack size={26} />
          </button>
          <h1 className="text-2xl cursor-default font-semibold tracking-tight">
            Complete Your Payment
          </h1>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center cursor-default gap-1">
          <MdSecurity className="text-green-600 dark:text-green-400" /> Secure Payment Gateway
        </p>
      </div>

      {/* Main Section */}
      <motion.div
        className="w-full max-w-5xl bg-gray-50 dark:bg-black rounded-2xl shadow-md grid md:grid-cols-3 gap-6 p-6 border dark:border-gray-800 border-gray-200"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Left - Plan Details */}
        <div className="col-span-1 bg-white dark:bg-black rounded-xl border p-5 flex flex-col justify-between shadow-sm">
          <div>
            <h2 className="text-xl font-semibold mb-2">Selected Plan</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-3 text-xs">
              Review your plan before proceeding to payment.
            </p>
            <div className="border-t border-gray-200 my-2" />
            <h3 className="text-lg mt-3 font-semibold">{plan.name}</h3> {/* plan! this is called non-null checking  */}
            <p className="text-gray-600 dark:text-gray-200 text-xs mb-3 font-semibold">Auto Recurring Payment</p>
            <ul className="space-y-2 text-xs text-gray-700 dark:text-gray-400">
              {plan!.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-5 flex items-center justify-between border-t pt-3">
            <span className="text-gray-600 dark:text-gray-200 font-medium">Total</span>
            <span className="text-lg font-semibold text-green-600">
              ${respectivePrice()}/-
            </span>
          </div>
        </div>

        {/* Middle section */}
        <div className="col-span-1 bg-white dark:bg-black rounded-xl border p-5 flex flex-col justify-between shadow-sm">
          <div>
            <h2 className="text-xl font-semibold mb-2">After you subscribe</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4 text-xs">
              Confirming payment activates your subscription based on the plan and billing cycle you selected.
            </p>

            <div className="border-t border-gray-200 my-2" />

            <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-xs">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">Auto-renewal:</span> your subscription will renew on the
                  <span className="font-semibold"> {Term}</span> cycle until you cancel.
                </span>
              </li>

              <li className="flex items-start gap-2">
                <span className="text-xs">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">Plan activation timing:</span> access updates after Stripe payment succeeds.
                  (If you refresh this page before that completes, your latest status will be handled on the next successful flow.)
                </span>
              </li>

              <li className="flex items-start gap-2">
                <span className="text-xs">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">Cancellation & changes:</span> you can cancel or change your plan.
                  Your benefits typically remain active for the current billing period.
                </span>
              </li>

              <li className="flex items-start gap-2">
                <span className="text-xs">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">Receipt & billing emails:</span> you’ll receive an email receipt for successful payments.
                  You can use that for your records.
                </span>
              </li>

              <li className="flex items-start gap-2">
                <span className="text-xs">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">What you’ll get:</span> your app features will unlock based on
                  <span className="font-semibold"> {plan.name}</span> (including the plan’s recurring benefits).
                </span>
              </li>

              <li className="flex items-start gap-2">
                <span className="text-xs">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">If payment fails:</span> no subscription is activated and you can retry.
                  Don’t refresh repeatedly—wait for the Stripe redirect to complete.
                </span>
              </li>
            </ul>
          </div>

          <div className="mt-5 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-neutral-900 p-3">
            <p className="text-xs text-gray-600 dark:text-gray-300">
              Security note: your payment is processed by Stripe. We only redirect you to complete checkout.
            </p>
          </div>
        </div>
        <div className="col-span-1 bg-white dark:bg-black rounded-xl border p-5 shadow-sm">
          <div>
            <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
            <p className="text-gray-500 dark:text-gray-400 text-xs mb-4">
              Verify all details before confirming.
            </p>
            <div className="border-t border-gray-200 my-2" />
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-400">
              <div className="flex justify-between">
                <span>Plan:</span>
                <span>{plan!.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Billing Cycle Duration:</span>
                <span>{Term}</span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${calculateCostMetric().price}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (18%):</span>
                <span>${calculateCostMetric().gst}</span>
              </div>
              <div className="border-t border-green-600 my-2" />
              <div className="flex justify-between font-semibold dark:text-white border border-green-600 p-2 rounded-lg">
                <span>Total:</span>
                <span className="text-green-600">
                  ${calculateCostMetric().total}
                </span>
              </div>
            </div>
          </div>
            <button
              type="submit"
              onClick={getSubscriptionSessionURL}
              className="mt-4 w-full active:scale-103 cursor-pointer hover:opacity-80 bg-black text-white py-3 rounded-lg font-medium text-lg shadow hover:bg-zinc-950 transition"
            >
              Pay Now
            </button>
        </div>
      </motion.div>

      {/* Footer */}
      <div className="w-full max-w-5xl mt-12 text-center text-sm text-gray-500">
        <p>
          By completing this payment, you agree to our{" "}
          <span className="text-yellow-600 hover:underline cursor-pointer">
            Terms & Conditions
          </span>{" "}
          and{" "}
          <span className="text-yellow-600 hover:underline cursor-pointer">
            Privacy Policy for automatic billing
          </span>
          .
        </p>
        <Link href='/@__briezlofficial' className="mt-2 flex flex-row gap-3 items-center justify-center">
          <span>© {new Date().getFullYear()} Briezl</span>
          <span><Image src='/images/letter-B.png' className="rounded-full" width={35} height={35} alt="logo" /></span>
        </Link>
      </div>
    </div>
  );
}
