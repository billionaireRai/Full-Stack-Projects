"use client";

import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import { useForm, SubmitHandler } from "react-hook-form";
import { Mail } from "lucide-react";

interface ForgotPasswordFormData {
  email: string;
}

interface ForgotPasswordResponse {
  message: string;
}

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const handleLinkForm = async (
    formData: ForgotPasswordFormData
  ): Promise<string> => {
    try {
      const apiResponse = await axios.post<ForgotPasswordResponse>(
        "/api/auth/forgot-password",
        formData
      );

      if (apiResponse.status === 200) {
        return `Reset link sent to: ${formData.email}`;
      }

      throw new Error(
        apiResponse.data.message || "Failed to send reset link."
      );
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Failed to send reset link."
        );
      }

      if (error instanceof Error) {
        throw error;
      }

      throw new Error("Something went wrong.");
    }
  };

  const handleToast = async (
    formData: ForgotPasswordFormData
  ): Promise<void> => {
    toast.loading("Sending reset link...", {
      id: "forgot-password",
    });

    try {
      await handleLinkForm(formData);

      toast.success("Reset link sent successfully!", {
        id: "forgot-password",
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, {
          id: "forgot-password",
        });
      } else {
        toast.error("Failed to send reset link.", {
          id: "forgot-password",
        });
      }
    }
  };

  const onSubmit: SubmitHandler<ForgotPasswordFormData> = async (data) => {
    await handleToast(data);
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col gap-3 items-center justify-center rounded-lg md:flex-row bg-white dark:bg-black">
      {/* Left Section */}
      <div className="flex flex-col items-center justify-center w-auto rounded-lg p-10 dark:bg-black">
        <Image
          src="/images/forgot-password.jpg"
          alt="Forgot Password"
          width={350}
          height={350}
          className="object-contain mb-8 rounded-2xl dark:invert"
        />

        <h1 className="text-3xl font-semibold text-gray-800 dark:text-white text-center mb-4">
          Forgot Your Password?
        </h1>

        <p className="text-base text-gray-600 dark:text-gray-300 max-w-md text-center">
          No worries. Enter your registered email address below and we'll send
          you a secure link to reset your password.
        </p>
      </div>

      {/* Right Section */}
      <div className="flex items-center justify-center w-auto rounded-lg bg-white dark:bg-black p-8">
        <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-900 rounded-2xl shadow-lg w-full max-w-md p-10">
          <div className="flex flex-col items-center mb-8">
            <Image
              src="/images/letter-B.png"
              width={60}
              height={60}
              alt="logo"
              className="mb-3 rounded-full dark:invert"
            />

            <h2 className="text-2xl text-center sm:text-3xl font-bold text-gray-800 dark:text-white">
              Get link to reset password
            </h2>

            <p className="text-sm text-gray-500 text-center dark:text-gray-400 mt-2">
              Enter the email address associated with your account, and we'll send you a secure password reset link for further instructions on how to reset your password.
            </p>
          </div>

          <form
            className="space-y-6"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-500 font-semibold mb-1">Email address</label>
              <div className="flex items-center border border-gray-300 rounded-md pl-3 group transition-all duration-300 focus-within:border-yellow-500 focus-within:ring-3 focus-within:ring-yellow-200 dark:focus-within:border-yellow-500 dark:focus-within:ring-4 dark:focus-within:ring-yellow-600/50 dark:border-gray-600">
              <Mail className="text-gray-500 mr-2 w-5 h-5 group-focus-within:stroke-yellow-500 dark:group-focus-within:stroke-yellow-400" />
                <input
                  type="email"
                  {...register('email')}
                  placeholder="Enter your email"
                  className="w-full py-2 px-1 outline-none bg-transparent rounded-lg"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs p-1 flex items-center"><Image src='/images/warning.png' width={20} height={20} alt="warning"/><span className="ml-2">{errors.email.message}</span></p>}
            </div>

            <button
              type="submit"
              className="w-full cursor-pointer py-3 bg-yellow-400 hover:bg-yellow-500 dark:bg-yellow-500 dark:hover:bg-yellow-600 dark:active:bg-blue-500 text-white font-semibold rounded-lg hover:shadow-md transition"
            >
              Send Reset Link
            </button>
          </form>

          <p className="text-sm text-gray-500 dark:text-gray-400 flex gap-2 items-center justify-center mt-8">
            <span>Remembered your password?</span>

            <Link
              href="/auth/log-in"
              className="text-yellow-600 dark:text-yellow-400 font-semibold relative group"
            >
              <span className="relative z-10">Login here</span>

              <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-yellow-600 dark:bg-yellow-400 transition-all duration-300 group-hover:w-full" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}