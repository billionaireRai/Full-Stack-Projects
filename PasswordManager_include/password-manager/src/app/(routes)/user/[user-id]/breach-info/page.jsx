"use client";

import Navbar from '@/components/navbar.jsx';
import axios from 'axios';
import Link from 'next/link';
import useUserID from '@/state/useridState';
import { useEffect , useState } from 'react';
import { useInactivityChecker } from '@/components/useInactivityChecker.jsx';

export default function BreachInfoPage() {
  useInactivityChecker(process.env.NEXT_PUBLIC_INACTIVITY_CHECKER_LOGOUT);
  const { userId } = useUserID() ;
  const [BreachStats, setBreachStats] = useState({
    totalBreach: 9 ,
    itemsAtRisk : 3 ,
    resolvedBreaches: 0
  });
  const [BreachData, setBreachData] = useState([{
    credential: 'johndoe@example.com',
    usedIn : 'crypto wallet information',
    breachCount : 5 ,
    otherInfo:[
      'Exposed on: Jan 2023 - Dropbox breach',
      'Exposed password hash found in leaked database',
      'Recommended Action: Change your password immediately'
    ]
  }]) ;

  // function to fetch breach data...
  async function getUserSpecificBreachInfo() {
    try {
      const fetchResponse = await axios.post('/apis/user/breachwatch') ;
      if (fetchResponse.status === 200) {
        setBreachData(fetchResponse.data.breachData) ;
        setBreachStats(fetchResponse.data.breachStats) ;
        console.log('Breach Data successfully fetched...') ;
      }
    } catch (error) {
      console.log('Error in fetching breach data :',error)
      throw new Error(error);
    }
  }

  useEffect(() => {
     getUserSpecificBreachInfo() ; // calling the breach info fetching function...
  }, [])
  
  return (
    <div className="min-h-screen pb-24 bg-[#f9fafb] dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <Navbar />
      <main className="pt-28 px-6 md:px-12 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">🛡️ Breach Information</h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-14 max-w-2xl mx-auto text-lg">
          Here you can find a detailed overview of any compromised credentials associated with your vault. Stay vigilant and take immediate action to secure your accounts.
        </p>

        <section className="bg-gradient-to-br from-white to-red-100 dark:from-gray-900 dark:to-gray-950 p-8 rounded-3xl shadow-xl border-none mb-12 backdrop-blur-sm">
          <div className="flex items-center mb-8">
            <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full mr-4">
              <span className="text-red-600 dark:text-red-400 text-2xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-400 bg-clip-text text-transparent">
              Detected Security Breaches
            </h2>
          </div>
          <div className="grid gap-6">
            {BreachData.map((breach, index) => (
              <div key={index} className="group relative">
                <div className="relative bg-white/80 dark:bg-gray-950/90 backdrop-blur-md rounded-2xl p-6 border border-red-200/50 dark:border-red-700/50 shadow-lg hover:shadow-xl transition-all duration-300">  
                  {/* Header with credential and severity badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="bg-red-100 dark:bg-red-900/40 p-2 rounded-lg mr-3">
                        <span className="text-red-600 dark:text-red-400 text-lg">🔐</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                          {breach.credential}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Compromised Credential
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-red-500/20 dark:bg-red-600/30 px-3 py-1 rounded-full">
                      <span className="text-red-700 dark:text-red-300 text-sm font-medium">
                        {breach.breachCount} breach{breach.breachCount !== 1 ? 'es' : ''}
                      </span>
                    </div>
                  </div>

                  {/* Breach details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center">
                      <span className="text-red-500 dark:text-red-400 mr-2">📍</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Used in <span className="font-medium text-gray-800 dark:text-gray-100">{breach.usedIn}</span>
                      </span>
                    </div>
                    
                    <div className="flex items-center">
                      <span className="text-red-500 dark:text-red-400 mr-2">🔄</span>
                      <span className="text-sm text-red-600 dark:text-red-400 font-medium">
                        Immediate Action Required
                      </span>
                    </div>
                  </div>

                  {/* Additional information */}
                  <div className="bg-red-50/50 dark:bg-red-900/20 rounded-xl p-4 border border-red-100 dark:border-red-700/30">
                    <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2 flex items-center">
                      <span className="text-red-500 dark:text-red-400 mr-2">📋</span>
                      Breach Details & Recommendations
                    </h4>
                    <ul className="space-y-2">
                      {breach.otherInfo.map((info, infoIndex) => (
                        <li key={infoIndex} className="text-sm text-gray-700 dark:text-gray-300 flex items-start">
                          <span className="text-red-400 dark:text-red-300 mr-2 mt-1">•</span>
                          {info}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action button */}
                  <div className="mt-4">
                    <Link 
                      href={`/user/${userId}/vault-settings?actionOn=${encodeURIComponent(breach.usedIn)}`}
                      className="cursor-pointer w-full bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center"
                    >
                      <span className="mr-2">🛡️</span>Secure This Account
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow border border-gray-200 dark:border-gray-700 mb-12">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">🛠️ Recommended Security Actions</h2>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 leading-relaxed">
            <li>Update all exposed credentials immediately.</li>
            <li>Enable two-factor authentication (2FA) wherever possible.</li>
            <li>Use a password manager to generate and store unique passwords.</li>
            <li>Review and monitor activity on affected accounts.</li>
          </ul>
        </section>

        <section className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow border border-gray-200 dark:border-gray-700 mb-12">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">📊 Breach Statistics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-700">
              <h3 className="text-3xl font-bold text-red-600 dark:text-red-400">{BreachStats.totalBreach}</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Total Breaches Detected</p>
            </div>
            <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-700">
              <h3 className="text-3xl font-bold text-yellow-500 dark:text-yellow-400">{BreachStats.itemsAtRisk}</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Vault Items At Risk</p>
            </div>
            <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-700">
              <h3 className="text-3xl font-bold text-green-600 dark:text-green-400">{BreachStats.resolvedBreaches}</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Resolved Breaches</p>
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">📂 Breach Timeline</h2>
          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border-l-4 border-red-400 dark:border-red-600 shadow-sm">
              <p className="text-sm text-gray-600 dark:text-gray-300">📅 Jan 12, 2023 — Email johndoe@example.com appeared in Dropbox breach</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border-l-4 border-yellow-400 dark:border-yellow-600 shadow-sm">
              <p className="text-sm text-gray-600 dark:text-gray-300">📅 Mar 18, 2024 — Username johndoe123 found in LinkedIn dump</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border-l-4 border-green-400 dark:border-green-600 shadow-sm">
              <p className="text-sm text-gray-600 dark:text-gray-300">📅 Apr 05, 2025 — Resolved Dropbox exposure</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
