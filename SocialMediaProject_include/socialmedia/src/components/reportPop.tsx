'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import Customdropdown from '@/components/customdropdown'
import { Flag, X, FileText, Copy } from 'lucide-react'
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
  postId?:string,
  username?:string,
  convid?:string
}

export default function reportPop({ closeReportModal , username, convid , postId }:reportModalProps) {
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
    const intoast = convid ? `Conversation ${convid}` : ( `Post ${postId}` ? postId : username) ;
    try {
      let finalData = { ...data , selectedOne , postId , convid } ; // data to be send to backend...
      const repostApi = await axiosInstance.post(`/api/profile/username`,{ reportInfo: finalData });
      if (repostApi.status === 200) {
        toast.dismiss(loadingToast);
        toast.success(`Report successfull for ${intoast}`);
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

  // function handling copy to clipboard
  const copeToClipboard = async (toCopy:string) => { 
    await navigator.clipboard.writeText(toCopy);
    toast.success(`Chat ID ${toCopy} copied !!`);
   }

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in-0 zoom-in-95 duration-200 overflow-y-scroll">
      <div className="bg-white dark:bg-black border dark:border-gray-900 rounded-xl shadow-2xl p-6 w-full max-w-lg max-h-fit mx-4 relative">
        <button
          className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-950 dark:hover:text-gray-200 transition-colors"
          onClick={() => {closeReportModal()}}
        >
          <X size={15}/>
        </button>

        <div className='flex items-center gap-4 mb-8'>
          <Flag size={30} /><h2 className="text-2xl font-bold text-gray-900 dark:text-white">Report This Account</h2>
        </div>

        <form onSubmit={reportForm.handleSubmit(reportSubmit)} className="space-y-3">
          <div>
            <label htmlFor="reportedFor" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Reported For
            </label>
            <input
              type="text"
              id="reportedFor"
              {...reportForm.register('reportedFor',{required:true,pattern:/@([a-zA-Z0-9_]{8,20})\b/g})}
              value={username}
              placeholder="user handle @username"
              className="w-full cursor-none px-3 py-2 border focus:border-yellow-300 dark:focus:border-yellow-500 transition-all duration-300 rounded-md dark:bg-black placeholder-muted-foreground focus:outline-none focus:ring-3 dark:focus:ring-yellow-400/20 focus:ring-yellow-200/20 focus:placeholder:text-gray-600 dark:focus:placeholder:text-gray-300 text-sm"
            />
          </div>
          { postId?.trim() && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Related Post
              </label>
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex-shrink-0 w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1 flex items-center justify-between min-w-0">
                  <div className='flex items-center justify-center gap-2'>
                   <p className="text-xs text-gray-500 dark:text-gray-400">Post ID</p>
                   <p className="text-sm font-mono font-medium text-gray-900 dark:text-white truncate">{postId?.trim()}</p>
                  </div>
                  <span onClick={() => { copeToClipboard(postId) }} className='p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-950 cursor-pointer'><Copy size={18} className='text-gray-400' /></span>
                </div>
              </div>
            </div>
          )}
          { convid?.trim() && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Related Conversation
              </label>
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-900 rounded-lg">
                <div className="flex-shrink-0 w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1 flex items-center justify-between min-w-0">
                  <div className='flex items-center justify-center gap-2'>
                   <p className="text-xs text-gray-500 dark:text-gray-400">Conversation ID</p>
                   <p className="text-sm font-mono font-medium text-gray-900 dark:text-white truncate">{convid?.trim()}</p>
                  </div>
                  <span onClick={() => { copeToClipboard(convid) }} className='p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-950 cursor-pointer'><Copy size={18} className='text-gray-400' /></span>
                </div>
              </div>
            </div>
          )}
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
              className="w-full px-3 py-2 border focus:border-yellow-300 dark:focus:border-yellow-500 transition-all duration-300 rounded-md dark:bg-black placeholder-muted-foreground focus:outline-none focus:ring-3 dark:focus:ring-yellow-400/20 focus:ring-yellow-200/20 focus:placeholder:text-gray-600 dark:focus:placeholder:text-gray-300 resize-none text-sm"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => { closeReportModal() }}
              className="cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-900 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-950 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
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
