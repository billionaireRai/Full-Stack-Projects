"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function UnAuthorize({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const pathname = usePathname(); // Getting the current page URL
  const isSecuredUrl = pathname.startsWith('/username');

  // Conditional rendering: if user is authenticated or on a non-secured page, render children
  if ((session && isSecuredUrl) || (!session && !isSecuredUrl) || (session && !isSecuredUrl)) {  return <>{children}</>  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-foreground dark:text-foreground px-4 py-8 relative">
      {/* Background blur layer */}
      <div className="absolute inset-0 dark:blur-sm dark:bg-black/30"></div>

      {/* Pop-up box */}
      <div className="max-w-lg w-full relative z-10 dark:bg-black shadow-2xl dark:shadow-gray-950 rounded-3xl p-7 text-center dark:text-card-foreground">
        <div className="flex flex-col sm:flex-row sm:gap-5 items-center justify-center mb-6">
          <Image
            src="/images/exclamtion-icon.png"
            width={60}
            height={60}
            alt="Access Denied Icon"
            className="dark:invert"
          />
          <h1 className="text-3xl font-bold text-foreground dark:text-card-foreground">Access_Denied</h1>
        </div>
        <p className="text-muted-foreground mb-8 leading-relaxed dark:text-muted-foreground">
          To access this page, you need to be logged in. Please sign in to continue and enjoy full access to all features.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/auth/log-in?utm_source=access-denied"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all duration-200 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
          >
            Sign In
          </Link>
          <Link
            href="/"
            className="px-6 py-3 border border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-primary-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all duration-200 dark:border-primary dark:text-primary dark:hover:bg-primary dark:hover:text-primary-foreground"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
