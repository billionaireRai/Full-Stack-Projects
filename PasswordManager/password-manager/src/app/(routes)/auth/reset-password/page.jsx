'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function ResetPasswordPage() {
  const {register,handleSubmit,watch,formState: { errors },reset,} = useForm({mode: 'onBlur',reValidateMode:'onchange'});
  const router = useRouter();
  // extracting the search param from route URL..
  const searchParams = useSearchParams() ;
  const tokenForUser = searchParams.get('token') ; // token for user...

  const handleResetForm = async (formData) => {
  try {
    if (tokenForUser) formData.token = tokenForUser ; // setting the user specific token if it exists...
    const apiResponse = await axios.post("/apis/user/reset-password", formData);
    if (apiResponse.status === 200) {
      return 'user password is successfully changed...'; // return generic message...
    } else {
      throw new Error(apiResponse.data.message || "Reset failed");
    }
  } catch (error) {
    console.error("Some error occurred in API request process...", error);
    throw new Error(error.response?.data?.message || error.message || "Reset failed");
  }
};

  const handleToast = (formData) => {
    return toast.promise(handleResetForm(formData), {
      loading: "resetting please wait...",
      success: () => {
        router.push(`/auth/login`);
        return "Reset successful!!";
      },
      error: "password reset failed!!",
    }, {
      success: { duration: 4000 },
      error: { duration: 4000 },
      loading: { duration: 3000 },
    });
  };

  const onSubmit = async (data) => {
     await handleToast(data)
     reset() ;
  };
  const newPassword = watch('newPassword', ''); // keeping a track on newPassword...

  if (!tokenForUser) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6 py-12">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-10 text-center">
        <h2 className="text-3xl font-bold text-red-600 mb-4">Invalid or Missing Token</h2>
        <p className="text-gray-700 mb-6">
          The password reset link is invalid/missing or has expired. Please request a new password reset.
        </p>
        <a
          href="/auth/forgot-password"
          className="inline-block bg-blue-700 text-white py-3 px-6 rounded-xl hover:bg-blue-800 transition-colors duration-300 font-semibold"
        >
          Request New Reset Link
        </a>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6 py-12">
      <div className="max-w-6xl w-full bg-white rounded-xl shadow-lg flex overflow-hidden">
        {/* Left side - image or animation */}
        <div className="hidden md:block md:w-1/2 relative">
          <img
            src="/images/forgot-password.jpg"
            alt="Password Reset Illustration"
            className="h-full w-full object-contain"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-transparent to-blue-900 opacity-70"></div>
        </div>
        {/* Right side - form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">
            Reset Your Password
          </h2>
          <p className="text-gray-700 mb-10">
            Enter your new password below to update your account.
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
            <div>
              <label
                htmlFor="newPassword"
                className="block text-gray-800 font-semibold mb-2"
              >
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                {...register('newPassword', {
                  required: 'New password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                })}
                placeholder="Enter new password"
                className={`w-full px-6 py-4 border rounded-xl shadow-sm focus:outline-none focus:ring-2 ${
                  errors.newPassword
                    ? 'border-red-600 focus:ring-red-600'
                    : 'border-gray-300 focus:ring-blue-600'
                } transition duration-300`}
              />
              {errors.newPassword && (
              <div className="flex flex-row items-center gap-0.5">
                <img width={20} height={20} src="/images/warning.png" alt="warning" />
                <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>
              </div>
            )}
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-gray-800 font-semibold mb-2"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) =>
                    value === newPassword || 'Passwords do not match',
                })}
                placeholder="Confirm new password"
                className={`w-full px-6 py-4 border rounded-xl shadow-sm focus:outline-none focus:ring-2 ${
                  errors.confirmPassword
                    ? 'border-red-600 focus:ring-red-600'
                    : 'border-gray-300 focus:ring-blue-600'
                } transition duration-300`}
              />
              {errors.confirmPassword && (
              <div className="flex flex-row items-center gap-0.5">
                <img width={20} height={20} src="/images/warning.png" alt="warning" />
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
              </div>
            )}
            </div>
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="agree"
                {...register("agree", {
                  required: "You must agree to keep details safe",
                })}
                className={`cursor-pointer h-4 w-4 text-blue-600 dark:text-blue-400 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400 ${
                  errors.agree ? "border-red-500" : ""
                }`}
              />
              <label
                htmlFor="agree"
                className="text-sm text-gray-600 dark:text-gray-400"
              >
                You agree to keep these details safe.
              </label>
            </div>
            {errors.agree && (
              <div className="flex flex-row items-center gap-0.5">
                <img width={20} height={20} src="/images/warning.png" alt="warning" />
                <p className="text-red-500 text-xs mt-1">{errors.agree.message}</p>
              </div>
            )}
            <button
              type="submit"
              className="cursor-pointer w-full bg-blue-700 text-white py-4 rounded-xl hover:bg-blue-800 transition-colors duration-300 font-semibold shadow-md"
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
