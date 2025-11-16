'use client'

import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from 'axios';
import toast from "react-hot-toast";
import { plans } from "../subscription/page";
import { subsPlanType } from "../subscription/page";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { MdSecurity, MdArrowBack } from "react-icons/md";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(String(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)); // loading stripe instance on our page...


const PaymentFormInner = () => {
  const router = useRouter() ; // initializing useRouter() hook...
  const searchParams = useSearchParams();
  
  // stripe related variable declarations...
  const stripe = useStripe();
  const elements = useElements();
  
  // plan related info...
  const [plan, setPlan] = useState<subsPlanType | null>(null) ;
  
  // function for setting right plan...
  function getAndSetPlan() : void {
    const planParam = searchParams.get('plan');
    const pursuedPlan = plans.find((eachPlan) => eachPlan.name === planParam);
    setPlan(pursuedPlan || null);
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    getAndSetPlan() ; // for getting right payment for user...
  }, []);
  
  // function handling payment submit...
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !plan) return;
    const { error } = await stripe.confirmPayment({
      elements, confirmParams: { return_url: `${window.location.origin}/payment-success?plan=${plan.name}` },
    });
    if (error) {
      console.error(error.message);
      toast.error(String(error.message));
    }
  };
  

  if (!plan) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-900 font-poppins">
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-12 h-12 border-4 border-green-200 border-t-green-500 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <div className="flex items-center gap-2">
            <Image src="/images/letter-B.png" width={24} height={24} alt="Logo" className="rounded-full" />
            <span className="text-lg font-semibold text-gray-700">Loading plan details...</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start md:ml-72 bg-white text-gray-900 font-poppins py-10 px-4">
      {/* Header */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <button
           onClick={() => { router.back() }}
           className="text-gray-600 p-1 rounded-full hover:text-black hover:bg-gray-100 cursor-pointer transition">
            <MdArrowBack size={26} />
          </button>
          <h1 className="text-3xl cursor-default font-semibold tracking-tight">
            Complete Your Payment
          </h1>
        </div>
        <p className="text-sm text-gray-500 flex items-center cursor-default gap-1">
          <MdSecurity className="text-green-600" /> Secure Payment Gateway
        </p>
      </div>

      {/* Main Section */}
      <motion.div
        className="w-full max-w-5xl bg-gray-50 rounded-2xl shadow-md grid md:grid-cols-3 gap-6 p-6 border border-gray-200"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Left - Plan Details */}
        <div className="col-span-1 bg-white rounded-xl border p-5 flex flex-col justify-between shadow-sm">
          <div>
            <h2 className="text-xl font-semibold mb-2">Selected Plan</h2>
            <p className="text-gray-500 mb-3 text-sm">
              Review your plan before proceeding to payment.
            </p>
            <div className="border-t border-gray-200 my-2" />
            <h3 className="text-lg mt-3 font-semibold">{plan!.name}</h3> {/* plan! this is called non-null checking  */}
            <p className="text-gray-600 text-sm mb-3 font-semibold">1 Month - Auto Recurring Payment</p>
            <ul className="space-y-2 text-sm text-gray-700">
              {plan!.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-5 flex items-center justify-between border-t pt-3">
            <span className="text-gray-600 font-medium">Total</span>
            <span className="text-lg font-semibold text-green-600">
              {plan!.price}
            </span>
          </div>
        </div>

        {/* Middle - Payment Form */}
        <div className="col-span-1 bg-white rounded-xl border p-5 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Payment Details</h2>
          <p className="text-gray-500 mb-4 text-sm">
            Enter your payment information securely.
          </p>
          <form onSubmit={handleSubmit}>
            <PaymentElement />
            <motion.button
              type="submit"
              whileTap={{ scale: 0.98 }}
              className="mt-4 w-full cursor-pointer bg-green-500 text-white py-3 rounded-lg font-medium text-lg shadow hover:bg-green-600 transition"
              disabled={!stripe}
            >
              Pay Now
            </motion.button>
          </form>
        </div>

        {/* Right - Order Summary */}
        <div className="col-span-1 bg-white rounded-xl border p-5 flex flex-col justify-between shadow-sm">
          <div>
            <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
            <p className="text-gray-500 text-sm mb-4">
              Verify all details before confirming.
            </p>
            <div className="border-t border-gray-200 my-2" />
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Plan:</span>
                <span>{plan!.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Duration:</span>
                <span>1 Month</span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{plan!.price}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (18%):</span>
                <span>${(parseInt((plan!.price).split(' ')[0].substring(1)) * 0.18).toFixed(0)}</span>
              </div>
              <div className="border-t border-gray-200 my-2" />
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span className="text-green-600">
                  ₹{(parseInt((plan!.price).split(' ')[0].substring(1)) * 1.18).toFixed(0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <div className="w-full max-w-5xl mt-12 text-center text-sm text-gray-500">
        <p>
          By completing this payment, you agree to our{" "}
          <span className="text-green-600 hover:underline cursor-pointer">
            Terms & Conditions
          </span>{" "}
          and{" "}
          <span className="text-green-600 hover:underline cursor-pointer">
            Privacy Policy
          </span>
          .
        </p>
        <p className="mt-2 flex flex-row gap-3 items-center justify-center"><span>© {new Date().getFullYear()} Briezly</span><span><Image src='/images/letter-B.png' className="rounded-full" width={35} height={35} alt="logo" /></span></p>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null); // will be returned from backend on api hitting...

  useEffect(() => {
    // Fetching client secret from API
    const fetchClientSecret = async () => {
      try {
        const amount = 10 ;
        const response = await axios('/api/payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          data: JSON.stringify({ amount }),
        });
        const { clientSecret } = await response.data ;
        setClientSecret(clientSecret);
      } catch (error) {
        console.error('Error fetching client secret:', error);
      }
    };
    fetchClientSecret();
  }, []);

  if (!clientSecret) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-12 h-12 border-4 border-green-200 border-t-green-500 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <div className="flex items-center gap-2">
            <Image src="/images/letter-B.png" width={24} height={24} alt="Logo" className="rounded-full" />
            <span className="text-lg font-semibold text-gray-700">Preparing secure payment...</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <PaymentFormInner />
    </Elements>
  );
}
