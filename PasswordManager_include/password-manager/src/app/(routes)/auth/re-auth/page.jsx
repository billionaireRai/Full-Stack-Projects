'use client'
import React from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import useUserID from '@/state/useridState';
import Link from 'next/link';

const reAuthenticationPage = () => {
  const { userId } = useUserID() ; // for extracting the user ID...
  const router = useRouter() ;

  const handleNewTokenGeneration = () => { 
    // main funtion handling the api trigger...
    const handleApiTriggering = async () => { 
      try {
        const axiosResponse = await axios.post('/apis/user/re-auth',{method:'POST'})
        if (axiosResponse.status !== 200){
          console.log('An error occured in SERVER :',axiosResponse.status);
          return ;
        }
      } catch (error) {
        console.log('An error occured in API triggering :',error);
        throw new Error(error) ;
      }
    }
     return toast.promise(handleApiTriggering(), {
      loading: "generating Token...",
      success: () => {
        if (userId) router.push(`/user/${userId}/dashboard`);
        return "tokens issued successfully.."; // this returend value automatically comes in toast input...
      },
      error: "token generation failed..",
    }, {
      success: { duration: 3000 },
      error: { duration: 3000 },
      loading: { duration: 2000 },
    });
  }
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-xl border-none outline-none">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Session Expired
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Your access has expired for this usage session due to token expiration. Please click the button below to generate a new session token and continue using the application.
        </p>

        <div className="w-full">
          <button
           onClick={() => { handleNewTokenGeneration() }}
           className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition duration-200">
            Get New Token
          </button>
        </div>

        <div className="mt-6 text-sm text-gray-400 text-center">
          <p className="text-sm flex flex-col text-gray-500 dark:text-gray-400 text-center mt-2">
             <span>If this issue persists, please</span>
              <Link href="/auth/login" className="relative inline-block text-blue-600 dark:text-blue-400 font group">
                <span className="relative z-10">login-now</span>
                <span
                  className="absolute left-0 bottom-0 h-[2px] w-0 bg-blue-600 dark:bg-blue-400 transition-discrete duration-300 group-hover:w-full"
                ></span>
              </Link>
          </p>
        </div>

        <div className="mt-8">
          <div className="text-xs text-center text-gray-300">
            © {new Date().getFullYear()} lockRift. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default reAuthenticationPage;
