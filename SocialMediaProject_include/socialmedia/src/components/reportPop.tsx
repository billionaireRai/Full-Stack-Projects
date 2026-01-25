'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import Customdropdown from '@/components/customdropdown'
import { Flag, X } from 'lucide-react'
import toast from 'react-hot-toast'
import axiosInstance from '@/lib/interceptor'

interface optionsType {
  value:string,
  label:string,
  priority: string
}

interface formDataType {
  reportedFor:string,
  description:string,
}

interface reportModalProps {
  closeReportModal:() => void,
  username?:string
}

export default function reportPop({ closeReportModal , username }:reportModalProps) {
  const reportForm = useForm<formDataType>() ; // intializing useForm hook...

  const [Options, setOptions] = useState<optionsType[]>([
    {label:'Harassment',value:'harassment', priority: 'medium'},
    {label:'Spam',value:'spam', priority: 'low'},
    {label:'Misinformation',value:'misinformation', priority: 'low'},
    {label:'Violence',value:'violence', priority: 'high'},
    {label:'Sexual',value:'sexual', priority: 'critical'},
    {label:'Hate',value:'hate', priority: 'high'},
    {label:'IP Violation',value:'ip_violation', priority: 'medium'},
    {label:'Privacy',value:'privacy', priority: 'medium'},
    {label:'Impersonation',value:'impersonation', priority: 'medium'},
    {label:'Illegal Goods',value:'illegal_goods', priority: 'high'},
    {label:'Policy Violation',value:'policy_violation', priority: 'medium'},
    {label:'Child Safety',value:'child_safety', priority: 'critical'}
  ])
  const [selectedOne, setselectedOne] = useState<optionsType>({label:'Harassment',value:'harassment', priority: 'medium'})

  // report handler function...
  const reportSubmit = async (data:formDataType) => {
    const loadingToast = toast.loading('submitting your report...')
    try {
      let finalData = { ...data , selectedOne } ; // data to be send to backend...
      const repostApi = await axiosInstance.post(`/api/profile/${data.reportedFor}`,{ reportInfo: finalData });
      if (repostApi.status === 200) {
        toast.dismiss(loadingToast);
        toast.success(`Report successfull for @${username}`);
        closeReportModal();
  
      } else {
        toast.dismiss(loadingToast);
        toast.error('Report submittion failed !!');
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Error occured in submittion !!');
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in-0 zoom-in-95 duration-200">
      <div className="bg-white dark:bg-black border border-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-lg mx-4 relative">
        <button
          className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-950 dark:hover:text-gray-200 transition-colors"
          onClick={() => {closeReportModal()}}
        >
          <X size={15}/>
        </button>

        <div className='flex items-center gap-4'>
          <Flag size={40}/><h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Report This Account</h2>
        </div>

        <form onSubmit={reportForm.handleSubmit(reportSubmit)} className="space-y-6">
          <div>
            <label htmlFor="reportedFor" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Reported For
            </label>
            <input
              type="text"
              id="reportedFor"
              {...reportForm.register('reportedFor',{required:true,pattern:/@([A-Za-z0-9_]{1,15})\b/g})}
              value={`@${username}`}
              placeholder="user handle @username"
              className="w-full px-3 py-2 border focus:border-yellow-300 dark:focus:border-blue-500 transition-all duration-300 rounded-md bg-background placeholder-muted-foreground focus:outline-none focus:ring-3 dark:focus:ring-blue-400/20 focus:ring-yellow-200/20 focus:placeholder:text-gray-600 dark:focus:placeholder:text-gray-300 text-sm"
            />
          </div>
          <div>
            <label htmlFor="reasonCategory" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Reason Category
            </label>
             <Customdropdown selectedValue={selectedOne} onChange={setselectedOne} options={Options}/>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              id="description"
              {...reportForm.register('description',{required:true})}
              placeholder="Please provide details about the issue..."
              rows={4}
              className="w-full px-3 py-2 border focus:border-yellow-300 dark:focus:border-blue-500 transition-all duration-300 rounded-md bg-background placeholder-muted-foreground focus:outline-none focus:ring-3 dark:focus:ring-blue-400/20 focus:ring-yellow-200/20 focus:placeholder:text-gray-600 dark:focus:placeholder:text-gray-300 resize-none text-sm"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => { closeReportModal() }}
              className="cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
