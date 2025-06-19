"use client";

import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import useUserID from "@/state/useridState";
import Tooltip from "@/components/Tooltip";
import useIsUserAuthenticated from "@/state/userAuthenticated";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserLocationInfoByPermission } from "@/lib/userLocation";

export default function UserRegisterPage() {
const { userId , setUserId } = useUserID() ; // getting userId state update function...
const { setIsAuthenticated } = useIsUserAuthenticated() ;
const router = useRouter() ; // intializing the router...
const [userLocation, setUserLocation] = useState(null);
  // initializing the react hook form
const { register, handleSubmit, watch, formState: { errors, isSubmitting }, setError, clearErrors,} = useForm({mode: "onBlur",reValidateMode:"onChange"});

useEffect(() => {
  // Fetch user location on component mount
  const fetchUserLocation = async () => {
    try {
      const location = await getUserLocationInfoByPermission();
      setUserLocation(location);
    } catch (error) {
      console.error("Failed to get user location:", error);
    }
  };
  fetchUserLocation();
}, []);
const handleRegistrationForm = async (formData) => {
  clearErrors();
  try {
    // Add userLocation to formData if available
    if (userLocation) formData.userLatestLocation = userLocation ;
    const apiResponse = await axios.post("/apis/user/register", formData);
    if (apiResponse.status === 201) {
      console.log(apiResponse.data); // logging the api response from the server...
      setIsAuthenticated();
      setUserId(apiResponse.data.userId); // updating the userId state with the response from the server...
      return apiResponse.data.userId; // return userId instead of string
    } else {
      throw new Error(apiResponse.data.message || "Registration failed");
    }
  } catch (error) {
    console.error("Some error occurred in API request process...", error);
    throw new Error(error.response?.data?.message || error.message || "Registration failed");
  }
};

  const handleToast = (formData) => {
    return toast.promise(handleRegistrationForm(formData), {
      loading: "Registering please wait...",
      success: (userIdFromResponse) => {
        if (userIdFromResponse) router.push(`/user/${userIdFromResponse}/dashboard`);
        return "Registration successful!!";
      },
      error: "Registration failed!!",
    }, {
      success: { duration: 4000 },
      error: { duration: 4000 },
      loading: { duration: 3000 },
    });
  };

  const onSubmit = async (data) => { await handleToast(data) };
  // handling the routing after registration...
  useEffect(() => {
    if (userId !== null) {
      console.log("UserID :", userId);
    }
  }, [userId])
  

  return (
    <div
      id="top"
      className="min-h-screen flex flex-col md:flex-row bg-white dark:bg-gray-900"
    >
      {/* Left Section */}
      <div className="flex flex-col items-center justify-center gap-3 w-full md:w-1/2 p-6 md:p-10 bg-gray-50 dark:bg-gray-800">
        <Image
          className="mt-1 dark:invert"
          width={60}
          height={60}
          src="/images/brandLogo.png"
          alt="logo"
        />
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-4">
          Your Data. Your Privacy. Our Priority.
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 text-center max-w-lg">
          Join our platform and enjoy seamless, secure, and private access to
          everything you need. We use industry-leading security practices to
          ensure your data stays safe and confidential.
        </p>

        {/* Encryption Simulation Card */}
        <div className="mt-6 w-full max-w-sm sm:max-w-md">
          <div className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl p-4 shadow-inner space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 dark:text-gray-400">User input:</span>
              <span className="px-3 py-1 dark:bg-white bg-blue-100 text-blue-600 rounded-full font-bold animate-pulse">
                mySecretPass123
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 dark:text-gray-400">Encrypting:</span>
              <span className="px-3 py-1 font-bold bg-yellow-100 text-yellow-700 rounded-full font-mono animate-pulse">
                ************
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 dark:text-gray-400">Stored securely:</span>
              <span className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full font-bold gap-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.21 10.03a7 7 0 1113.58 0M12 13v2m0 4h.01M9.75 16.5a.75.75 0 101.5 0 .75.75 0 00-1.5 0z"
                  />
                </svg>
                Encrypted
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center justify-center w-full md:w-1/2 bg-gradient-to-br from-white to-blue-100 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="bg-white dark:shadow-xl dark:shadow-gray-600 dark:bg-gray-800 shadow-2xl rounded-3xl w-full max-w-md p-8 sm:p-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 text-center mb-2">
            Create Your Account
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
            Please fill in the details to get started.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <Tooltip text="Enter your full name">
                <input
                  type="text"
                  {...register("name", { required: "Name is required" })}
                  placeholder="Enter your name"
                  className={`w-full px-4 py-2 border placeholder:text-gray-400 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition ${
                    errors.name ? "border-red-500" : ""
                  }`}
                />
              </Tooltip>
              {errors.name && (
                <div className="flex flex-row items-center gap-0.5">
                  <img width={20} height={20} src="/images/warning.png" alt="warning" />
                  <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <Tooltip text="Enter your email address">
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email format",
                    },
                  })}
                  placeholder="Enter you Email Address"
                  className={`w-full px-4 py-2 border placeholder:text-gray-400 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition ${
                    errors.email ? "border-red-500" : ""
                  }`}
                />
              </Tooltip>
              {errors.email && (
                <div className="flex flex-row items-center gap-0.5">
                  <img width={20} height={20} src="/images/warning.png" alt="warning" />
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                </div>
              )}
            </div>

            {/* Encryption Salt */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Encryption Salt
              </label>
              <Tooltip text="Enter a value between 5 - 15">
                <input
                  type="number"
                  {...register("salt", {
                    required: "Salt is required",
                    valueAsNumber: true,
                    min: { value: 5, message: "Salt must be at least 5" },
                    max: { value: 15, message: "Salt must be at most 15" },
                  })}
                  placeholder="Enter a value between 5 - 15"
                  className={`w-full px-4 py-2 border placeholder:text-gray-400 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${
                    errors.salt ? "border-red-500" : ""
                  }`}
                />
              </Tooltip>
              {errors.salt && (
                <div className="flex flex-row items-center gap-0.5">
                  <img width={20} height={20} src="/images/warning.png" alt="warning" />
                  <p className="text-red-500 text-xs mt-1">{errors.salt.message}</p>
                </div>
              )}
            </div>
            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <Tooltip text="Enter your password">
                <input
                  type="password"
                  {...register("password", { required: "Password is required" })}
                  placeholder="••••••••"
                  className={`w-full px-4 py-2 border placeholder:text-gray-400 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition ${
                    errors.password ? "border-red-500" : ""
                  }`}
                />
              </Tooltip>
              {errors.password && (
                <div className="flex flex-row items-center gap-0.5">
                  <img width={20} height={20} src="/images/warning.png" alt="warning" />
                  <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm Password
              </label>
              <Tooltip text="Re-enter your password">
                <input
                  type="password"
                  {...register("confirmPassword", {
                    required: "Confirm password is required",
                    validate: (value) =>
                      value === watch("password") || "Passwords do not match",
                  })}
                  placeholder="••••••••"
                  className={`w-full px-4 py-2 border placeholder:text-gray-400 dark:text-white border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition ${
                    errors.confirmPassword ? "border-red-500" : ""
                  }`}
                />
              </Tooltip>
              {errors.confirmPassword && (
                <div className="flex flex-row items-center gap-0.5">
                  <img width={20} height={20} src="/images/warning.png" alt="warning" />
                  <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
                </div>
              )}
            </div>

            {/* Checkbox */}
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="agree"
                {...register("agree", {
                  required: "You must agree to keep details safe",
                })}
                className={`cursor-pointer mt-1 h-4 w-4 text-blue-600 dark:text-blue-400 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400 ${
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

            {/* Register Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-md transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-400"
            >
              Register
            </button>
          </form>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-4">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="flex flex-col text-blue-600 dark:text-blue-400 font-semibold relative group"
            >
              <span className="relative z-10">login-now</span>
              <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-blue-600 dark:bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
