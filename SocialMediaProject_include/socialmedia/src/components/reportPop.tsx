'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import Customdropdown from '@/components/customdropdown'
import { X } from 'lucide-react'
import toast from 'react-hot-toast'

interface optionsType {
  value:string,
  label:string
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
    {label:'Spam',value:'option-1'},
    {label:'Harassment',value:'option-2'},
    {label:'Inappropriate Content',value:'option-3'},
    {label:'Misinformation',value:'option-4'},
    {label:'Copyright Violation',value:'option-5'},
    {label:'Others',value:'option-6'}
  ])
  const [selectedOne, setselectedOne] = useState<optionsType>({label:'Spam',value:'option-1'})

  // report handler function...
  const reportSubmit = (data:formDataType) => {
    let finalData = { ...data , selectedOne } ; // data to be send to backend...
    toast.success(`Report successfull for @${username}`);
    closeReportModal();
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

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 pr-8">Report User</h2>

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
