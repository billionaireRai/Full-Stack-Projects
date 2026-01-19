"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import useAuthenticationState from "@/app/states/isAuth" ;
import { usePathname } from "next/navigation";

export default function UnAuthorize({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); // Getting the current page URL...
  const { isAuth } = useAuthenticationState() ;
  const isSecuredUrl = !pathname.startsWith('/auth') && pathname !== '/' ;

  // Conditional rendering => if user is authenticated or on a non-secured page, render children...
  if ((isAuth && isSecuredUrl) || (!isAuth && !isSecuredUrl) || (isAuth && !isSecuredUrl)) {  return <>{children}</>  }

  return (
    <div className="min-h-screen min-w-screen animate-in fade-in-0 zoom-in-95 duration-200 rounded-md flex flex-col items-center justify-center text-foreground dark:text-foreground px-4 py-8 relative">
      {/* Background blur layer */}
      <div className="absolute inset-0 dark:blur-sm dark:bg-black"></div>

      {/* Pop-up box */}
      <div className="max-w-lg w-full relative z-10 dark:bg-black border border-gray-200 dark:border-gray-700 shadow-md rounded-3xl p-5 text-center dark:text-card-foreground">
        <div className="flex flex-col sm:flex-row sm:gap-2 items-center justify-center mb-6">
          <Image
            src="/images/exclamtion-icon.png"
            width={40}
            height={40}
            alt="Access Denied Icon"
            className="dark:invert"
          />
          <h1 className="text-2xl font-bold text-foreground dark:text-card-foreground">Access Denied</h1>
        </div>
        <p className="text-muted-foreground mb-8 leading-relaxed dark:text-muted-foreground">
          To access this page, you need to be logged in. Please sign in to continue and enjoy full access to all features.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/auth/log-in?utm_source=access-denied"
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all duration-200 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
          >
            Sign In
          </Link>
          <Link
            href="/"
            className="px-6 py-2 border border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-primary-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all duration-200 dark:border-primary dark:text-primary dark:hover:bg-primary dark:hover:text-primary-foreground"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
