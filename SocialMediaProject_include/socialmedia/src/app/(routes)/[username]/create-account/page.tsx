'use client'

import React,{ JSX, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from "react-hook-form";
import { usernameRegex } from "@/app/controllers/regex";
import { User, AtSign, Lock, Globe, Palette, Briefcase } from "lucide-react"; // lightweight icons
import axiosInstance from "@/lib/interceptor";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";

interface Option {
  value:string,
  label:string,
  icon:JSX.Element
}

// applying ZOD validation on form feilds...
const newAccCreation = z.object({
  Name:z.string().nonempty("Name is required"),
  Username:z.string().toLowerCase().min(8).nonempty("Essential for first account creation").regex(new RegExp(usernameRegex)),
})

export default function createNewAccount() {
  const params = useParams() ; // getting the params...
  const router = useRouter() ;
  // initializing the react-hook-form...
  const { register , handleSubmit , formState:{ errors , isSubmitting }} = useForm({ resolver:zodResolver(newAccCreation) }) ;
  const [accOptions, setaccOptions] = useState<Option[]>([
    { value:'Private Account' , label:'Private' , icon:<Lock width={15} height={15}/> },
    { value:'Public Account' , label:'Public' , icon:<Globe width={15} height={15}/> },
    { value:'Creator Account' , label:'Creator',icon:<Palette width={15} height={15}/> },
    { value:'Business Account' , label:'Business' , icon:<Briefcase width={15} height={15}/> }
  ])
  const [currAccType, setcurrAccType] = useState<Option>({ value:'Private Account' , label:'Private', icon:<Lock/> }); // will get this from the accounts array state...

  // function handling form submittion...
  const handleDataSubmission = async (data: z.infer<typeof newAccCreation>) => {
    const loadingToast = toast.loading('creating new account...');
    try {
      const finalData = { ...data , accType: { value: currAccType.value, label: currAccType.label } } ;
      const apires = await axiosInstance.patch(`/api/profile/${params.username}`,{ finalData }) ;
      if (apires.status === 200) {
        toast.dismiss(loadingToast);
        toast.success('Account created successfully !!');
        router.push(`/${decodeURIComponent(String(params.username))}?switch-account-pop=true`) ;
      } else {
        toast.dismiss(loadingToast);
        toast.error('Account creation failed !!');
      }
    } catch (error) {
       toast.dismiss(loadingToast);
       toast.error('An Error occured');
    }
  }
  return (
    <div className="w-full h-screen flex flex-col-reverse md:flex-row-reverse font-poppins overflow-y-scroll p-4 dark:bg-black dark:bg-none">
      {/* Left Section - Form */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 bg-white dark:bg-black">
        <div className="flex flex-col items-center text-center">
          <Image
            src="/images/letter-B.png"
            height={50}
            width={100}
            alt="Social Media Logo"
            className="mt-10 rounded-full"
          />
          <h1 className="font-bold text-3xl text-gray-800 mb-2 dark:text-white">
            Create A New Account...
          </h1>
          <p className="text-gray-600 max-w-md text-sm dark:text-gray-400">
            Create your account today and join our social media community. Share your life updates, connect
            with friends, and be part of something amazing.
          </p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit(handleDataSubmission)} className="w-full max-w-lg bg-white p-6 my-10 mx-5 rounded-xl shadow-xl border border-gray-200 dark:bg-gray-900 dark:border-gray-700 dark:shadow-2xl dark:shadow-blue-900/30">
          <div className="mb-4">
            <label className="block text-sm text-black mb-1 dark:text-white">Name</label>
            <div className="flex items-center border border-gray-300 rounded-md group px-3 transition-all duration-300 focus-within:border-yellow-500 focus-within:ring-3 focus-within:ring-yellow-200 dark:focus-within:border-blue-500 dark:focus-within:ring-4 dark:focus-within:ring-blue-600/50 dark:border-gray-600">
              <User className="text-gray-500 mr-2 w-5 h-5 group-focus-within:stroke-amber-400 dark:group-focus-within:stroke-blue-400 dark:stroke-white" />
              <input
                type="text"
                {...register('Name')}
                placeholder="enter your name"
                className="w-full py-2 px-1 outline-none bg-transparent dark:text-white"
              />
            </div>
             {errors.Name && <p className="text-red-500 text-xs p-1 flex items-center"><Image src='/images/warning.png' width={20} height={20} alt="warning"/><span className="ml-2">{errors.Name.message}</span></p>}
          </div>

          <div className="mb-6">
            <label className="block text-sm text-black mb-1 dark:text-white">Username</label>
            <div className="flex items-center border border-gray-300 rounded-md group px-3 transition-all duration-300 focus-within:border-yellow-500 focus-within:ring-3 focus-within:ring-yellow-200 dark:focus-within:border-blue-500 dark:focus-within:ring-4 dark:focus-within:ring-blue-600/50 dark:border-gray-600">
              <AtSign className="text-gray-500 mr-2 w-5 h-5 group-focus-within:stroke-amber-400 dark:group-focus-within:stroke-blue-400 dark:stroke-white" />
              <input
                type="text"
                {...register('Username')}
                placeholder="enter your account name"
                className="w-full py-2 px-1 outline-none bg-transparent dark:text-white"
              />
            </div>
            {errors.Username && <p className="text-red-500 text-xs p-1 flex items-center"><Image src='/images/warning.png' width={20} height={20} alt="warning"/><span className="ml-2">{errors.Username.message}</span></p>}
          </div>
          <div className="mb-3">
            <label className="block text-sm text-black mb-1 dark:text-white">Account Type</label>
            <div className="grid grid-cols-2 grid-rows-2 sm:flex sm:items-center justify-evenly p-1 rounded-md">
              {accOptions.map((option,index) => (
                  <div 
                  onClick={() => { setcurrAccType(option) }}
                  key={index} className={`border border-gray-300 text-sm cursor-pointer py-1 px-4 rounded-full flex items-center gap-1 ${(currAccType.label === option.label) && 'border-yellow-500 bg-yellow-50 text-yellow-500'} shadow-sm hover:shadow-md`}>
                    <span>{option.icon}</span>
                    <span>{option.label}</span>
                  </div>
                )
              )}
            </div>
          </div>
          <button
            disabled={isSubmitting}
            type="submit"
            className="w-full cursor-pointer border-none py-3 my-3 rounded-lg bg-yellow-300 hover:bg-yellow-300 transition-all duration-300 font-semibold text-gray-900 shadow-yellow-400 hover:shadow-sm active:bg-yellow-400 dark:bg-blue-700 dark:hover:bg-blue-800
            dark:active:bg-blue-700 dark:shadow-lg dark:shadow-blue-800/50 dark:text-white"
          >
            Create Account
          </button>

          <p className="text-sm text-gray-600 mt-4 flex flex-col sm:flex-row items-center justify-center gap-3 dark:text-gray-400">
              <span>Want to use existing account ?{" "}</span>
              <Link
                href={`/${decodeURIComponent(String(params.username))}?switch-account-pop=true`}
                className="text-yellow-500 hover:bg-yellow-100 py-1 px-2 rounded-full font-medium transition-colors dark:text-blue-500"
              >
                CLICK ME
              </Link>
          </p>
        </form>
      </div>

      <div className="flex flex-col md:flex-row-reverse w-full h-screen lg:w-1/2 justify-center items-center bg-contain dark:bg-black dark:bg-none">
       <Image src='/images/create-account.jpg' width={800}  height={800} alt="banner" className="dark:invert border-none outline-none rounded-full" />
      </div>
    </div>
  );
}
