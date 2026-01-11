"use client"

import React, { useEffect , useState } from "react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from 'react-hot-toast'
import { useRouter, useSearchParams } from 'next/navigation'
import CreatePost from '@/components/createpost'
import Interest from "@/components/interestpop"
import Interestpage from '@/components/interestselection';
import SwitchAccountPopUp from '@/components/swithaccount'
import useActiveAccount from "./states/useraccounts"
import useCreatePost from '@/app/states/createpost'
import useSwitchAccount from '@/app/states/swithaccount'
import useAuthenticationState from "./states/isAuth"
import AccCompletionPop from "@/components/acccompletionpop"

export default function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter() ;
  const { Account } = useActiveAccount() ;
  const { isCreatePop } = useCreatePost();
  const { isAuth } = useAuthenticationState();
  const { isPopOpen, setisPopOpen } = useSwitchAccount();
  const [isCompleted, setisCompleted] = useState<boolean | undefined>(Account.account?.isCompleted); // will get this state from current account feild...
  const [showInterest, setshowInterest] = useState<boolean>(false) ;
  const [Start, setStart] = useState<boolean>(false)
  const searchParams = useSearchParams()

  // function for checking account completion...
  const checkAccountCompletion = () : boolean => { 
    // will check the completion state of account with 'active' true from Accounts array...
    return true ;
   } 

  useEffect(() => {
    if (searchParams) {
      const showSwitchPop = Boolean(searchParams.get('switch-account-pop'))
      setisPopOpen(showSwitchPop)
    }
  }, [searchParams, setisPopOpen])

  useEffect(() => {
    let timer = setTimeout(() => {
       setshowInterest(true)
    }, 2000)
    return () => {
      clearTimeout(timer) ;
    }
  }, [])
  return (
    <TooltipProvider>
        {children}
        <Toaster position="top-center" />
        { isCreatePop && <CreatePost /> }
        { isPopOpen && <SwitchAccountPopUp /> }
        {/* { isAuth && !isCompleted && <AccCompletionPop onClose={() => { setisCompleted(true) }} onContinue={() => { router.push(`/@${Account.decodedHandle}`) }}/> } */}
        {/* interest popup modal... */}
        {/* { isAuth && showInterest && (
            <div className='fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in-0 zoom-in-95 duration-200'>
                 <Interest getStarted={() => { setshowInterest(false) ; setStart(true) }} onClose={() => setshowInterest(false)} />
            </div>
         )} */}
        {/* main selection popup... */}
        {Start && (
             <div className='fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in-0 zoom-in-95 duration-200'>
                 <Interestpage />
             </div>
         )}
    </TooltipProvider>
  )
}
