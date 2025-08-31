'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error('Global Error:', error);
  }, [error]);

  return (
    <div className="bg-gray-50 text-gray-900 flex items-center justify-center min-h-screen px-6">
      <div className="max-w-lg w-full bg-white border border-gray-200 shadow-lg rounded-2xl p-10 text-center">
        <div className="flex justify-center mb-6">
          <svg
            className="w-20 h-20 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="img"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold mb-4">Oops! Something went wrong.</h1>
        <p className="text-gray-700 mb-6 text-base leading-relaxed">
          We&apos;re sorry for the inconvenience. Our team has been notified and is working on a fix.
          Please try again, or return to the homepage.
        </p>
        <div className="flex justify-center gap-5">
          <button
            onClick={() => reset()}
            className="cursor-pointer bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 text-white font-semibold py-3 px-6 rounded-lg transition-shadow shadow-md"
            aria-label="Retry loading the page"
          >
            Retry
          </button>
          <Link 
          className="border cursor-pointer border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-shadow shadow-sm inline-block"
          aria-label="Go to homepage"
          href="/">
              Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
