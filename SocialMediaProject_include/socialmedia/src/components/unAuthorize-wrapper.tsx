"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShieldCheckIcon, Star, UserCheck2Icon , ShieldAlert } from "lucide-react";
import useAuthenticationState from "@/app/states/isAuth";

export default function UnAuthorize({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isAuth } = useAuthenticationState();

  const isSecuredUrl = !pathname.startsWith("/auth") && pathname !== "/" && !pathname.endsWith("/create-account");
  const shouldShowUnauthorizedModal = !isAuth && isSecuredUrl;

  return (
    <>
      <div className={`${shouldShowUnauthorizedModal && "pointer-events-none select-none blur-[2px]"}`}>
        {children}
      </div>
      {shouldShowUnauthorizedModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/10 backdrop-blur-sm p-5 animate-in fade-in duration-200">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-required-title"
            className=" relative w-full max-w-lg overflow-hidden rounded-xl border border-white dark:border-gray-900 bg-white dark:bg-black"
          >
            <div className="relative z-10 p-8 rounded-xl">
              {/* Top Badge */}
              <div className="mb-5 py-2 rounded-lg flex justify-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-red-200 dark:border-red-900 dark:bg-black bg-red-50 px-4 py-2">
                  <ShieldAlert className="h-4 w-4 text-red-500" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-red-500">
                    Restricted Access
                  </span>
                </div>
              </div>

              {/* Lock Icon */}
              <div className="mb-6 flex items-center justify-center">
                  <div
                    className="relative flex h-20 w-20 items-center justify-center rounded-full border border-gray-100 dark:border-gray-700
                    "
                  >
                    <UserCheck2Icon className="h-10 w-10 text-primary dark:text-gray-700" />
                  </div>
              </div>

              {/* Title */}
              <div className="text-center">
                <h1
                  id="auth-required-title"
                  className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-200"
                >
                  Authentication Required
                </h1>

                <p className="mx-auto mt-4 max-w-md text-sm text-gray-500 dark:text-gray-400">
                  This page contains protected content that is only available to
                  authenticated account users because of contents sensitivity. Sign in to continue and access all
                  features of your account.
                </p>
              </div>

              {/* Feature Highlights */}
              <div className="mt-8 grid gap-2 sm:grid-cols-3">
                <div className="rounded-xl flex items-center justify-center border border-gray-300 dark:border-gray-900 bg-gray-100 dark:bg-black px-4 py-2 text-center">
                  <ShieldCheckIcon/>
                  <p className="text-xs font-medium text-gray-500">
                    Secure Access
                  </p>
                </div>

                <div className="rounded-xl flex items-center justify-center border border-gray-300 dark:border-gray-900 bg-gray-100 dark:bg-black px-4 py-2 text-center">
                  <LayoutDashboard/>
                  <p className="text-xs font-medium text-gray-500">
                    Account Dashboard
                  </p>
                </div>

                <div className="rounded-xl flex items-center justify-center border border-gray-300 dark:border-gray-900 bg-gray-100 dark:bg-black px-4 py-2 text-center">
                  <Star/>
                  <p className="text-xs font-medium text-gray-500">
                    Premium Features
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/auth/log-in?utm_source=access-denied"
                  className="flex-1 rounded-2xl bg-black  border dark:border-gray-800 px-6 py-3.5 text-center text-sm font-semibold  text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.99]
                  "
                >
                  Sign In
                </Link>

                <Link
                  href="/"
                  className="flex-1 rounded-2xl border border-gray-200 dark:bg-zinc-950 dark:border-gray-800 bg-white px-6 py-3.5 text-center text-sm font-semibold text-gray-700 dark:text-gray-400 transition-all duration-200 hover:bg-gray-50 hover:border-gray-300
                  "
                >
                  Back to Home
                </Link>
              </div>

              {/* Footer */}
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-400">
                  Protected by secure authentication and access control.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}