"use client";

import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ reValidateMode: "onChange", mode: "onBlur" });

  const router = useRouter();

  // handler function for API call
  const handleLinkForm = async (formData) => {
    try {
      const apiResponse = await axios.post("/api/auth/forgot-password", formData);
      if (apiResponse.status === 200) {
        return `Reset link sent to: ${formData.email}`;
      } else {
        throw new Error(apiResponse.data.message || "Failed to send reset link.");
      }
    } catch (error) {
      console.error("Error in forgot-password request:", error);
      throw new Error(error.response?.data?.message || error.message);
    }
  };

  const handleToast = async (formData) => {
    try {
      toast.loading("Sending reset link...", { id: "forgot-password" });
      const result = await handleLinkForm(formData);
      toast.success("Reset link sent successfully!", { id: "forgot-password" });
      return result;
    } catch (error) {
      toast.error("Failed to send reset link.", { id: "forgot-password" });
      throw error;
    }
  };

  const onSubmit = async (data) => {
    await handleToast(data);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white dark:bg-black">
      {/* Left Section */}
      <div className="flex flex-col items-center justify-center w-full md:w-1/2 p-10 bg-black">
        <Image
          src="/images/forgot-password.jpg"
          alt="Forgot Password"
          width={350}
          height={350}
          className="object-contain mb-8 rounded-2xl shadow-lg"
        />
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-white text-center mb-4">
          Forgot Your Password?
        </h1>
        <p className="text-base text-gray-600 dark:text-gray-300 max-w-md text-center">
          No worries. Enter your registered email address below and we’ll send you
          a secure link to reset your password.
        </p>
      </div>

      {/* Right Section - Form */}
      <div className="flex items-center justify-center w-full md:w-1/2 bg-white dark:bg-black p-8">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl w-full max-w-md p-10">
          {/* Title */}
          <div className="flex flex-col items-center mb-8">
            <Image
              src="/images/letter-B.png"
              width={60}
              height={60}
              alt="logo"
              className="mb-3 dark:invert rounded-xl"
            />
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
              Reset Password
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Provide your account email to receive instructions.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="enter registered email..."
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email format",
                  },
                })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:focus:ring-blue-500 transition"
              />
              {errors.email && (
                <p className="flex items-center gap-2 text-red-500 text-xs mt-2">
                  <Image src="/images/warning.png" alt="warning" width={18} height={18} />
                  {errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full cursor-pointer py-3 bg-yellow-500 hover:bg-yellow-400 dark:bg-blue-500 dark:hover:bg-blue-600 dark:active:bg-blue-500 text-white font-semibold rounded-lg shadow-md transition"
            >
              Send Reset Link
            </button>
          </form>

          {/* Back to Login */}
          <p className="text-sm text-gray-500 dark:text-gray-400 flex gap-2 items-center justify-center mt-8">
            <span>Remembered your password?</span>
            <Link
              href="/auth/log-in"
              className="text-blue-600 dark:text-blue-400 font-semibold relative group"
            >
              <span className="relative z-10">Login here</span>
              <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-blue-600 dark:bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
