'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function ResetPasswordPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({ mode: 'onBlur', reValidateMode: 'onChange' });

  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenForUser = searchParams.get('token');
  const newPassword = watch('newPassword', '');

  // --- API handler
  const handleResetForm = async (formData) => {
    try {
      if (tokenForUser) formData.token = tokenForUser;
      const apiResponse = await axios.post('/apis/user/reset-password', formData);
      if (apiResponse.status === 200) {
        return 'Password reset successful';
      } else {
        throw new Error(apiResponse.data.message || 'Reset failed');
      }
    } catch (error) {
      console.error('API request error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Reset failed');
    }
  };

  // --- Toast + navigation handler
  const handleToast = (formData) => {
    return toast.promise(handleResetForm(formData), {
      loading: 'Resetting password...',
      success: () => {
        router.push(`/auth/login`);
        return 'Password reset successfully!';
      },
      error: 'Password reset failed!',
    }, {
      success: { duration: 3000 },
      error: { duration: 3000 },
      loading: { duration: 2000 },
    });
  };

  const onSubmit = async (data) => {
    await handleToast(data);
    reset();
  };

  // --- Invalid token UI
  if (!tokenForUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-6 py-12">
        <div className="max-w-md w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-10 text-center">
          <h2 className="text-3xl font-bold text-red-600 mb-4">Invalid or Missing Token</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            The password reset link is invalid or has expired. Please request a new one.
          </p>
          <a
            href="/auth/forgot-password"
            className="inline-block bg-yellow-500 hover:bg-yellow-400 dark:bg-blue-600 dark:hover:bg-blue-700 text-white py-3 px-6 rounded-xl transition-colors duration-300 font-semibold"
          >
            Request New Reset Link
          </a>
        </div>
      </div>
    );
  }

  // --- Main Reset Form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-6 py-12">
      <div className="max-w-6xl w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl flex overflow-hidden">
        
        {/* Left Section */}
        <div className="hidden md:block md:w-1/2 relative">
          <img
            src="/images/forgot-password.jpg"
            alt="Password Reset Illustration"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 via-transparent to-gray-900/70"></div>
        </div>
        
        {/* Right Section - Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Reset Your Password
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-10">
            Enter your new password below to securely update your account.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            {/* New Password */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-800 dark:text-gray-300 mb-2">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                {...register('newPassword', {
                  required: 'New password is required',
                  minLength: { value: 8, message: 'Password must be at least 8 characters' },
                })}
                placeholder="Enter new password"
                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition ${
                  errors.newPassword
                    ? 'border-red-600 focus:ring-red-600'
                    : 'border-gray-300 dark:border-gray-600 focus:ring-yellow-400 dark:focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                }`}
              />
              {errors.newPassword && (
                <p className="flex items-center gap-2 text-red-500 text-xs mt-2">
                  <img src="/images/warning.png" alt="warning" width={18} height={18} />
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-800 dark:text-gray-300 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) => value === newPassword || 'Passwords do not match',
                })}
                placeholder="Confirm new password"
                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition ${
                  errors.confirmPassword
                    ? 'border-red-600 focus:ring-red-600'
                    : 'border-gray-300 dark:border-gray-600 focus:ring-yellow-400 dark:focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                }`}
              />
              {errors.confirmPassword && (
                <p className="flex items-center gap-2 text-red-500 text-xs mt-2">
                  <img src="/images/warning.png" alt="warning" width={18} height={18} />
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Agreement */}
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="agree"
                {...register('agree', { required: 'You must agree to keep details safe' })}
                className={`cursor-pointer h-4 w-4 text-yellow-500 dark:text-blue-500 border-gray-300 dark:border-gray-600 rounded focus:ring-yellow-400 dark:focus:ring-blue-500 ${
                  errors.agree ? 'border-red-500' : ''
                }`}
              />
              <label htmlFor="agree" className="text-sm text-gray-600 dark:text-gray-400">
                I agree to keep my account details secure.
              </label>
            </div>
            {errors.agree && (
              <p className="flex items-center gap-2 text-red-500 text-xs mt-2">
                <img src="/images/warning.png" alt="warning" width={18} height={18} />
                {errors.agree.message}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full cursor-pointer py-3 bg-yellow-500 hover:bg-yellow-400 dark:bg-blue-500 dark:hover:bg-blue-600 dark:active:bg-blue-500 text-white font-semibold rounded-lg shadow-md transition"
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
