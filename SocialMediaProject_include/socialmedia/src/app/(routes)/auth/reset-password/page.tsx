'use client';

import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter,useSearchParams } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import { RedoDotIcon } from 'lucide-react';

interface resetPswdType {
  newPassword: string;
  confirmPassword: string;
  agree: boolean;
}

export default function ResetPasswordPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<resetPswdType>({ mode: 'onBlur', reValidateMode: 'onChange' });

  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenForUser = searchParams.get('token');
  const newPassword = watch('newPassword', '');

  // api triggering logic...
  const handleResetForm = async (formData: resetPswdType & { token?: string }): Promise<string | undefined> => {
    try {
      const payload: resetPswdType & { token?: string } = { ...formData };
      if (tokenForUser) payload.token = tokenForUser;
      const apiResponse = await axios.post('/apis/user/reset-password', payload);
      if (apiResponse.status === 200) {
        return 'Password reset successful';
      } else {
        throw new Error(apiResponse.data?.message || 'Reset failed');
      }
    } catch (error: unknown) {
      console.error('API request error:', error);
      toast.error('An error occurred !!');
    }
  };

  // toast & navigation handling...
  const handleToast = (formData: resetPswdType) => {
    return toast.promise(handleResetForm(formData), {
      loading: 'Resetting password...',
      success: () => {
        router.push(`/auth/login`);
        return 'Password reset successfully!';
      },
      error: 'Password reset failed!',
    }, { success: { duration: 3000 }, error: { duration: 3000 }, loading: { duration: 2000 } });
  };

  const onSubmit: SubmitHandler<resetPswdType> = async (data: resetPswdType) => {
    await handleToast(data);
    reset();
  };


  // Main reset form...
  return (
    <div className="min-h-screen w-screen overflow-hidden flex items-center justify-center bg-white dark:bg-black px-6 py-12">
      <div className="max-w-6xl w-auto bg-white flex flex-col md:flex-row dark:bg-black rounded-2xl">
        {/* Left Section */}
        <div className="hidden md:block md:w-1/2 relative rounded-2xl">
          <img
            src="/images/forgot-password.jpg"
            alt="Password Reset Illustration"
            className="h-full w-full object-cover rounded-xl dark:invert"
          />
          <div className="absolute inset-0"></div>
        </div>

        {/* Right Section - Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center rounded-2xl dark:bg-black">
          <div className='flex items-center justify-start gap-2 mb-5'>
            <span><RedoDotIcon size={40}/></span>
            <span className="font-bold text-xl text-gray-900 dark:text-white">Reset Your Password</span>
          </div>
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
                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-3 transition ${errors.newPassword
                    ? 'border-red-600 focus:ring-red-600/20'
                    : 'focus:border-yellow-300 focus:dark:border-yellow-600 focus:ring-yellow-500/20 dark:focus:ring-yellow-600/40 bg-white dark:bg-gray-950 text-gray-900 dark:text-white'
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
                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-3 transition ${errors.confirmPassword
                    ? 'border-red-600 focus:ring-red-600/20'
                    : 'focus:border-yellow-300 focus:dark:border-yellow-600 focus:ring-yellow-500/20 dark:focus:ring-yellow-600/40 bg-white dark:bg-gray-950 text-gray-900 dark:text-white'
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
            <div className="flex items-start justify-between">
              <label htmlFor="agree" className="text-sm text-gray-600 dark:text-gray-400">
                I agree to keep my account details secure.
              </label>
              <input
                type="checkbox"
                id="agree"
                {...register('agree', { required: 'You must agree to keep details safe' })}
                className={`cursor-pointer h-4 w-4 text-yellow-500 dark:text-yellow-500 border-yellow-300 dark:border-yellow-600 rounded focus:ring-yellow-400 dark:focus:ring-yellow-500 ${errors.agree && 'border-red-500'}`}
              />
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
              className="w-full cursor-pointer py-3 bg-yellow-400 hover:bg-yellow-500 dark:bg-yellow-500 dark:hover:bg-yellow-600 dark:active:bg-blue-500 text-white font-semibold rounded-lg hover:shadow-md transition"
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

