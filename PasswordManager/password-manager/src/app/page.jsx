'use client';

import { useEffect, useState } from "react";
import MatrixBackground from "../lib/matrixBackground";
import LoadingSimulation from "./loading";
import { getUserLocationInfoByPermission } from "@/lib/userLocation.js";
import Link from "next/link";

export default function Home() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const locationDetails = getUserLocationInfoByPermission() ; // calling the defiend function
    // do whatever you want to with user location..
  }, [])
  
  if (loading) {
    return <LoadingSimulation />;
  }

  return (
    <div>
      <MatrixBackground />
      <div className="relative min-h-screen bg-black overflow-hidden text-green-400 font-mono">
        {/* Matrix background effect */}
        <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
          <canvas id="matrixCanvas" className="w-full h-full" />
        </div>

        {/* Glass card */}
        <main className="relative z-10 flex flex-col items-center justify-center min-h-screen backdrop-blur-sm bg-white/5 rounded-xl mx-4 p-8 border border-green-400/30 shadow-[0_0_40px_5px_rgba(0,255,0,0.2)]">
          <h1 className="text-4xl md:text-5xl font-bold tracking-widest text-green-300 animate-pulse text-center">
            WELCOME TO YOUR SECURED VAULT...
          </h1>
          <p className="mt-4 text-lg md:text-xl text-green-500 text-center max-w-xl">
            Welcome to the your secure Vault. All activities are monitored. Proceed with caution.
          </p>
          <div className="mt-10 text-xs md:text-sm w-full max-w-xl flex flex-col gap-5 items-center justify-center bg-black/70 p-4 rounded-md shadow-inner sm:border-none">
            <div className="text-center whitespace-pre-line">
              {`--> Initiating connection...--> Authentication successful.-->\n Loading secure assets...--> Welcome, Operative.`}
            </div>
            <div className="buttonSection flex flex-col sm:flex-row items-center justify-center w-full gap-4 mt-4">
              <Link href="/auth/login">
                <button className="relative mx-3 cursor-pointer px-6 py-2 text-lg font-mono text-green-400 rounded-lg overflow-hidden shadow-sm shadow-green-400 transition duration-300 hover:text-white group">
                  <span className="relative z-10 tracking-widest">start_authentication</span>
                </button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
