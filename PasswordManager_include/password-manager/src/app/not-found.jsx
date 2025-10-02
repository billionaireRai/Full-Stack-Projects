'use client';
import LINK from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <div className="bg-white p-10 rounded-xl shadow-lg text-center max-w-lg w-full">
        <h1 className="text-7xl font-extrabold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Page Not Found</h2>
        <p className="text-gray-500 mb-6">
          The page you're looking for doesn't exist or has been moved. Please check the URL or return to the homepage.
        </p>
        <LINK href={'/'}>
        <button
          className="inline-block px-6 py-2 text-white bg-gray-900 hover:bg-gray-800 transition rounded-md shadow">
          Back To Home
        </button>
        </LINK>
      </div>
    </div>
  );
}
