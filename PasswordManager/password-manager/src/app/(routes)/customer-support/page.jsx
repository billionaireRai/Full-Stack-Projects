"use client";

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import toast from "react-hot-toast";
import VaultNavbar from '@/components/navbar';
import CustomSelect from '@/components/customSelect';
import {
  ChatBubbleLeftEllipsisIcon,
  UserIcon,
  PhoneIcon,
  IdentificationIcon,
  EnvelopeIcon,
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/24/solid';
import Image from 'next/image';

const inquiryTypes = [
  { value: 'Billing Issue', label: 'Billing Issue' },
  { value: 'Technical Support', label: 'Technical Support' },
  { value: 'Upgrade/Downgrade Help', label: 'Upgrade/Downgrade Help' },
  { value: 'Cancel Subscription', label: 'Cancel Subscription' },
  { value: 'General Question', label: 'General Question' },
];

const CustomerSupportPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = (data) => {
    toast.success('Support request submitted successfully!');
    console.log('Submitted data:', data);
    reset();
  };

  return (
    <>
      <VaultNavbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 mt-10 py-16 px-6 sm:px-12 lg:px-20 flex justify-center items-start">
        <div className="max-w-4xl w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-3xl shadow-2xl p-12 sm:p-16">
          <h2 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight drop-shadow-md flex items-center gap-3">
          <Image className="mt-1 dark:invert" width={60} height={60} src="/images/brandLogo.png" alt="logo" />
            Contact Support
            <ChatBubbleLeftEllipsisIcon className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
            We're here to help. Please fill out the form below with as much detail as possible so we can assist you promptly and effectively. Our support team is committed to resolving your issues and answering your questions quickly.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div>
              <label className="flex text-sm font-semibold text-gray-800 dark:text-gray-300 mb-2 items-center gap-2">
                <UserIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                Full Name
              </label>
              <input
                type="text"
                {...register('name', { required: 'Full name is required' })}
                className={`mt-1 w-full px-5 py-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition duration-300 ease-in-out ${
                  errors.name ? 'border-red-500 ring-red-400' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="John Doe"
              />
              {errors.name && <p className="text-sm text-red-500 mt-2 font-medium">{errors.name.message}</p>}
            </div>

            <div>
              <label className="flex text-sm font-semibold text-gray-800 dark:text-gray-300 mb-2 items-center gap-2">
                <PhoneIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                Phone Number
              </label>
              <input
                type="tel"
                {...register('phone', {
                  pattern: {
                    value: /^\+?[0-9\s\-]{7,15}$/,
                    message: 'Invalid phone number',
                  },
                })}
                className={`mt-1 w-full px-5 py-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition duration-300 ease-in-out ${
                  errors.phone ? 'border-red-500 ring-red-400' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="+1 (555) 123-4567"
              />
              {errors.phone && <p className="text-sm text-red-500 mt-2 font-medium">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="flex text-sm font-semibold text-gray-800 dark:text-gray-300 mb-2 items-center gap-2">
                <IdentificationIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                Order Number
              </label>
              <input
                type="text"
                {...register('orderNumber')}
                className="mt-1 w-full px-5 py-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400  dark:border-gray-600 dark:focus:ring-blue-600 transition duration-300 ease-in-out"
                placeholder="Optional"
              />
            </div>

            <div>
              <label className="flex text-sm font-semibold text-gray-800 dark:text-gray-300 mb-2 items-center gap-2">
                <EnvelopeIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                Email
              </label>
              <input
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Invalid email address',
                  },
                })}
                className={`mt-1 w-full px-5 py-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition duration-300 ease-in-out ${
                  errors.email ? 'border-red-500 ring-red-400' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-sm text-red-500 mt-2 font-medium">{errors.email.message}</p>}
            </div>

            <div>
              <label className="flex text-sm font-semibold text-gray-800 dark:text-gray-300 mb-2 items-center gap-2">
                <QuestionMarkCircleIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                Inquiry Type
              </label>
              <Controller
                name="type"
                control={control}
                rules={{ required: 'Please select an inquiry type' }}
                render={({ field }) => (
                  <CustomSelect
                    options={inquiryTypes}
                    value={inquiryTypes.find(option => option.value === field.value) || null}
                    onChange={(selected) => field.onChange(selected ? selected.value : null)}
                    placeholder="Select a reason"
                  />
                )}
              />
              {errors.type && <p className="text-sm text-red-500 mt-2 font-medium">{errors.type.message}</p>}
            </div>

            <div>
              <label className="flex text-sm font-semibold text-gray-800 dark:text-gray-300 mb-2 items-center gap-2">
                <ChatBubbleLeftRightIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                Message
              </label>
              <textarea
                rows="5"
                {...register('message', { required: 'Message is required' })}
                className={`mt-1 w-full px-5 py-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition duration-300 ease-in-out resize-none ${
                  errors.message ? 'border-red-500 ring-red-400' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Describe your issue or question in detail"
              ></textarea>
              {errors.message && (
                <p className="text-sm text-red-500 mt-2 font-medium">{errors.message.message}</p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="cursor-pointer bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-3 rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-600 transition duration-300 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed font-semibold text-lg flex items-center gap-2"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
                <PaperAirplaneIcon className="w-5 h-5" />
              </button>
            </div>
          </form>

          <hr className="my-8 border-gray-200 dark:border-gray-600" />

          <div className="text-sm text-gray-700 dark:text-gray-400 space-y-2">
            <p>Prefer another way? Reach us via:</p>
            <ul className="space-y-1">
              <li className="flex items-center gap-2">
                <EnvelopeIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                Email:{' '}
                <a href="mailto:amritansh6136@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">
                  amritansh6136@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <PhoneIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                Phone:{' '}
                <a href="tel:+919818864977" className="text-blue-600 dark:text-blue-400 hover:underline">
                  +919818864977
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerSupportPage;