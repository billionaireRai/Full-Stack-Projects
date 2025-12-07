import React, { useState } from 'react'
import { CheckCircleIcon, PlusCircleIcon, User, X } from 'lucide-react'
import { userCardProp } from './usercard';

import Usercard from './usercard';
import Link from 'next/link';
import useAllAccounts from '@/app/states/useraccounts';
import useSwitchAccount from '@/app/states/swithaccount'

export default function SwitchAccountPopUp () {
  const { setisPopOpen } = useSwitchAccount();
  const { Accounts } = useAllAccounts() ;
  const [currentAccount, setcurrentAccount] = useState<userCardProp | null>(); // intially contains the running account....
  

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-sm flex justify-center z-50 animate-in fade-in-0 zoom-in-95 duration-300">
      <div className="bg-white dark:bg-black rounded-2xl p-5 h-fit max-h-fit my-5 w-full max-w-xl shadow-2xl border border-gray-200 dark:border-gray-900">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 dark:bg-gray-950 rounded-full">
              <User className="w-6 h-6 text-yellow-600 dark:text-blue-900" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Switch Account</h2>
          </div>
          <button
            onClick={() => setisPopOpen(false)}
            className="p-2 hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-950 rounded-full transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        <div className="text-sm flex flex-row items-center justify-between text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
          <p>Select an account you would like to switch to continue enjoying.</p>
          <Link href={`/${currentAccount?.decodedHandle || 'username'}/create-account?userId=TDF^%$%@^G&#@H`} className='flex items-center justify-between gap-1.5 font-semibold cursor-pointer hover:bg-yellow-100 dark:text-blue-600 dark:hover:bg-gray-950 text-yellow-500 rounded-full py-1 px-2'><span>New Account</span><PlusCircleIcon />
          </Link> 
        </div>
        <div className="space-y-1">
          {Accounts.map((account,index) => (
            <button 
             key={index}
             onClick={() => { setcurrentAccount(account) }}
             className={`w-full ${account === currentAccount && 'border-yellow-400 dark:border-blue-600' } group border-1 hover:border-yellow-400 dark:hover:border-blue-600 cursor-pointer flex items-center space-x-4 p-3 rounded-xl hover:bg-yellow-50 dark:hover:bg-gray-950 dark:hover:from-gray-800 dark:hover:to-gray-700 transition-all duration-200 group`}>
               <Usercard key={index} IsFollowing={account.IsFollowing} decodedHandle={account.decodedHandle} name={account.name} user={account.user} />
               <div className={`invisible text-yellow-400 dark:text-blue-600 group-hover:visible border border-yellow-400 dark:border-blue-500 ${account === currentAccount && 'visible' } rounded-full transition-all duration-200`}>
                <CheckCircleIcon/>
               </div>
            </button>
          ))}
        </div>
        <button
          onClick={() => setisPopOpen(false)}
          className="mt-6 cursor-pointer w-full bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-500 dark:bg-blue-700 dark:hover:bg-blue-600 dark:active:bg-blue-700 text-white py-3 px-6 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
        >
          {currentAccount ? 'Switch account' : 'Cancel'}
        </button>
      </div>
    </div>
  )
}

