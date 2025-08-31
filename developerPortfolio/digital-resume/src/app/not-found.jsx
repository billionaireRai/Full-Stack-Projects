'use client';
import LINK from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <div className="bg-white p-10 rounded-xl shadow-lg text-center max-w-lg w-full">
        <h1 className="text-7xl font-extrabold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Page Not Found</h2>
        <p className="text-gray-500 mb-6">
          The page you're looking for doesn't exist or has been moved. Please check the URL or return to the homepage.
        </p>
        <LINK href={'/home'}>
        <Button className='cursor-pointer' >
          Back To Home
        </Button>
        </LINK>
      </div>
    </div>
  );
}
