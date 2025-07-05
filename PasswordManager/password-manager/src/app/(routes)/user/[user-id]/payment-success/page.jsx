"use client";

import Link from 'next/link';
import useUserID from '@/state/useridState';
import React, { useEffect , useState } from 'react';
import axios from 'axios';

const SuccessfulPaymentPage = () => {
    const { userId } = useUserID(); 
    const [PaymentDetails, setPaymentDetails] = useState(null) ;
    // function for getting the payment related data...
    const getPaymentData = async () => {

    }
    // function for sending the confirmation Email to the user...
    const sendConfirmationEmail = async () => {
      try {
        const emailRes = await axios.get('/apis/user/payment-success');
        if(emailRes.status === 200) {
          sendConfirmationEmail();
          console.log(emailRes.message);
          return 
        }
      } catch (error) {
        console.log(error);
        return ;
      }

    }

  const currentYear = new Date().getFullYear();
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-100 flex items-center justify-center px-4 py-10">
      <div className="max-w-3xl w-full space-y-10">
        {/* Animated Success Section */}
        <section className="flex flex-col items-center text-center">
          <div className="relative w-28 h-28">
            <div className="absolute inset-0 rounded-full bg-green-100 dark:bg-green-800 animate-ping"></div>
            <div className="relative z-10 flex items-center justify-center w-28 h-28 rounded-full bg-green-500 text-white shadow-xl">
              <svg
                className="w-12 h-12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h1 className="mt-6 text-4xl font-bold text-gray-900 dark:text-white">
            Payment Successful
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400 max-w-lg">
            Thank you for subscribing to the Pro Plan. We've sent a confirmation to your email.
          </p>
        </section>

        {/* Transaction Card */}
        <section className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-8 border border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold mb-6 border-b pb-3 border-gray-100 dark:border-gray-800">
            Transaction Details
          </h2>
          <div className="space-y-5 text-sm sm:text-base">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Transaction ID:</span>
              <span className="font-medium">#TXN65478923</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Plan:</span>
              <span className="font-medium">Pro Annual</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Amount Paid:</span>
              <span className="font-semibold text-green-600 dark:text-green-400">₹4,999</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Payment Method:</span>
              <span className="font-medium">Razorpay (UPI)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Date:</span>
              <span className="font-medium">2nd July 2025</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Billed To:</span>
              <span className="font-medium">you@example.com</span>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <section className="flex flex-col sm:flex-row justify-center gap-4 text-center">
          <Link
            href={`/user/${userId}/dashboard`}
            className="cursor-pointer w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg"
          >
            Go to Dashboard
          </Link>
        </section>

        {/* Support & Footer */}
        <section className="text-center text-sm text-gray-500 dark:text-gray-400 pt-8 border-t border-gray-200 dark:border-gray-800">
          <p>
            Need help? Regarding an issue{' '}
            <Link href={`/customer-support`} className="group inline-block text-blue-600 dark:text-blue-400 underline-offset-2 relative">
              <span className="relative z-10">customer-support</span>
              <span
                className="absolute left-0 bottom-0 h-[2px] w-0 bg-blue-600 dark:bg-blue-400 transition-all duration-300 group-hover:w-full"
              ></span>
            </Link>
          </p>
          <p className="mt-1">© {currentYear} lockRift Inc. All rights reserved.</p>
        </section>
      </div>
    </div>
  );
};

export default SuccessfulPaymentPage;
