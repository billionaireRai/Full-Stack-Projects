'use client';

import Link from "next/link";
import Image from "next/image";
import Tooltip from "@/components/Tooltip";
import toast from "react-hot-toast";
import axios from "axios";
import useUserID from "@/state/useridState";
import useUserDerivedEncryptionKey from "@/state/derivedEncrypKey"; 
import useIsUserAuthenticated from "@/state/userAuthenticated";
import { generateUserEncryptionKey } from "@/lib/encryptionLogic";
import { getUserLocationInfoByPermission } from "@/lib/userLocation";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState,useEffect } from "react";

export default function UserLoginPage() {
  const { userId , setUserId } = useUserID() ; // initilizing the useUserId function 
  const { setIsAuthenticated } = useIsUserAuthenticated();
  const { setEncryptionKeyValue } = useUserDerivedEncryptionKey() ; // setting user encryption key once he loggs in...

  const router = useRouter() ; // for programmatic navigation...
  const [userLocation, setUserLocation] = useState(null);
  // initializing useForm() for form handling...
  const {register,handleSubmit,formState: { errors },trigger,} = useForm({
    mode: "onBlur",
    reValidateMode: "onChange",
  });

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

// handler function for calling logic route handler...
const handleLoginForm = async (formData) => {
  try {
    // Add userLocation to formData if available
    if (userLocation) formData.locationOfAction = userLocation ;
    const apiResponse = await axios.post("/apis/user/login", formData);
    if (apiResponse.status === 200) {
      setUserId(apiResponse.data.userId); // updating the userId state with the response from the server...
      setIsAuthenticated(); // set authentication state to true after successful login
      // logic for generating personalized encryption key...
      const userEncryptionKey = generateUserEncryptionKey(apiResponse.data.salt,formData.password); // salt is returned from server...
      setEncryptionKeyValue(userEncryptionKey); // setting the encryption key in the state.
      return apiResponse.data.userId ;
    } else {
      throw new Error(apiResponse.data.message || "login failed");
    }
  } catch (error) { 
    console.error("Some error occurred in API request process...", error);
    throw new Error(error.response?.data?.message || error.message || "login failed");
  }
};

  const handleToast = (formData) => {
    return toast.promise(handleLoginForm(formData), {
      loading: "logging-In please wait...",
      success: (userIdFromResponse) => {
        if (userIdFromResponse) router.push(`/user/${userIdFromResponse}/dashboard`);
        return "login successful!!";
      },
      error: "login failed!!",
    }, {
      success: { duration: 4000 },
      error: { duration: 4000 },
      loading: { duration: 3000 },
    });
  };

  // top-level handler function for useForm() hook...
  const onSubmit = async (data) => { await handleToast(data) };
  // handling the routing after registration...
  useEffect(() => {
    if (userId !== null) {
      console.log("UserID :", userId);
    }
  }, [userId])
  

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Left - Image Section */}
      <div className="hidden md:flex md:w-1/2 items-center justify-center bg-black dark:bg-gray-800">
        <img
          src="/images/homePage_img.png"
          alt="Login Illustration"
          className=" rounded-xl w-4/5 h-4/5 object-cover shadow-lg"
        />
      </div>
      {/* Right - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center py-6 px-10">
        <div className="w-full max-w-md bg-white dark:shadow-gray-700 dark:shadow-2xl dark:bg-gray-800 rounded-2xl bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 shadow-lg px-6 py-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-2 flex justify-evenly items-center">
            <span>Welcome Back To</span>
            <Image className="mt-1 dark:invert" width={60} height={60} src="/images/brandLogo.png" alt="logo" />
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm text-center mb-6">
            Please log in to your account to continue.
          </p>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <Tooltip text="Enter your email address">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none transition-all duration-300 focus:ring-2 ${
                    errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-400"
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email format",
                    },
                  })}
                  onBlur={() => {
                    trigger("email");
                  }}
                />
                {errors.email && (
                   <div className="flex flex-row items-center gap-0.5">
                    <img width={20} height={20} src="/images/warning.png" alt="warning" />
                    <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                   </div>
                )}
              </Tooltip>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <Tooltip text="Enter your password">
                <input
                  type="password"
                  placeholder="••••••••"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none transition-all duration-300 focus:ring-2 ${
                    errors.password ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-400"
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                  {...register("password", { required: "Password is required" })}
                  onBlur={() => {
                    trigger("password");
                  }}
                />
                {errors.password && (
                   <div className="flex flex-row items-center gap-0.5">
                    <img width={20} height={20} src="/images/warning.png" alt="warning" />
                    <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                   </div>
                )}
              </Tooltip>
            </div>
            {/* Checkbox */}
            <Tooltip text="Confirm the information is correct">
              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="agree"
                  className="cursor-pointer mt-1 h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400"
                  {...register("agree", { required: "You must confirm the information" })}
                  onBlur={() => {
                    trigger("agree");
                  }}
                />
                <label htmlFor="agree" className="text-sm text-gray-600 dark:text-gray-400 leading-snug">
                  You confirm that the above information is correct.
                </label>
              </div>
                {errors.agree && (
                   <div className="flex flex-row items-center gap-0.5">
                    <img width={20} height={20} src="/images/warning.png" alt="warning" />
                    <p className="text-red-500 text-xs mt-1">{errors.agree.message}</p>
                   </div>
                )}
            </Tooltip>

            {/* Submit Button */}
              <button
                type="submit"
                className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-400"
              >
                Log In
              </button>

            {/* Register Link */}
            <div className="flex flex-row items-center justify-between">
               <p className="text-sm flex flex-col text-gray-500 dark:text-gray-400 text-center mt-2">
                 <span>Don’t have an account ?</span>
                 <Tooltip text="Create a new account">
                   <Link href="/auth/register" className="relative inline-block text-blue-600 dark:text-blue-400 font-semibold group">
                     <span className="relative z-10">register-now</span>
                     <span
                       className="absolute left-0 bottom-0 h-[2px] w-0 bg-blue-600 dark:bg-blue-400 transition-all duration-300 group-hover:w-full"
                     ></span>
                   </Link>
                 </Tooltip>
               </p>
               <p className="text-sm flex flex-col text-gray-500 dark:text-gray-400 text-center mt-2">
                 <span>forgot your password ?</span>
                 <Tooltip text="Reset your password">
                   <Link href="/auth/forgot-password" className="relative inline-block text-blue-600 dark:text-blue-400 font-semibold group">
                     <span className="relative z-10">reset-password</span>
                     <span
                       className="absolute left-0 bottom-0 h-[2px] w-0 bg-blue-600 dark:bg-blue-400 transition-all duration-300 group-hover:w-full"
                     ></span>
                   </Link>
                 </Tooltip>
               </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
