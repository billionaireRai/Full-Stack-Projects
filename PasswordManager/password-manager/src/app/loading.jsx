'use client';
import loading from './loading.svg';
import Image from 'next/image';

export default function LoadingSimulation() {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl p-8 flex flex-col items-center justify-center space-y-6 max-w-sm w-full">
        <Image
          src={loading}
          alt="Loading..."
          width={80}
          height={80}
        />
        <p className="text-xl font-semibold text-black animate-pulse">
          Loading, please wait...
        </p>
      </div>
    </div>
  );
}
