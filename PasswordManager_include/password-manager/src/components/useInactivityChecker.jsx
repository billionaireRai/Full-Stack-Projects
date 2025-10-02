"use client" ;
import { useEffect , useRef } from "react";
import { useRouter } from "next/navigation";
import isUserAuthenticated from "@/state/userAuthenticated.js";

export const useInactivityChecker = (timeout) => { 
    const router = useRouter(); // intializing the hook...
    const inactivityTimeout = useRef(null);
    const { setIsNotAuthenticated } = isUserAuthenticated() ; // user authenticated state...
    const resetTimer = () => { 
    if (inactivityTimeout.current) clearTimeout(inactivityTimeout.current) ;
    inactivityTimeout.current = setTimeout(() =>{
        console.log("User caught inactive for Quite long ----> Logging out");
        setIsNotAuthenticated() ; // making authenticated state as unauthenticated...
        router.push('/auth/login'); // redirecting to the home page...
    },timeout)
    
}
    useEffect(() => {
        const eventsToDetect = ['mousemove','keydown','scroll','click','touchstart'];
        const handleEvent = () =>{
                eventsToDetect.forEach((event) => {
                    document.addEventListener(event, resetTimer);
                })
                resetTimer() // starts timer after reset on mount...
            }
            handleEvent(); // calling it once defined...
        return () => { 
            eventsToDetect.forEach((event) =>{
                document.removeEventListener(event, resetTimer);
            })
            if(inactivityTimeout.current) clearTimeout(inactivityTimeout.current) ;
        }
        }, []) 
        
}
