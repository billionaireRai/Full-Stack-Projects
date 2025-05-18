"use client"

import Navbar from '@/components/navbar.jsx';

export default function BreachInfoPage() {
  return (
    <div className="min-h-screen bg-[#f9fafb] text-gray-800">
      <Navbar />
      <main className="pt-28 px-6 md:px-12 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">🛡️ Breach Information</h1>
        <p className="text-center text-gray-600 mb-14 max-w-2xl mx-auto text-lg">
          Here you can find a detailed overview of any compromised credentials associated with your vault. Stay vigilant and take immediate action to secure your accounts.
        </p>

        <section className="bg-white p-10 rounded-2xl shadow-lg border border-red-200 mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-red-600">⚠️ Detected Breaches</h2>
          <div className="grid gap-6">
            <div className="border border-red-300 rounded-lg p-6 bg-red-50">
              <h3 className="text-xl font-semibold text-red-700 mb-2">Email: johndoe@example.com</h3>
              <p className="text-gray-700 mb-1">Detected in 3 breaches</p>
              <ul className="list-disc list-inside text-sm text-gray-700">
                <li>Exposed on: Jan 2023 - Dropbox breach</li>
                <li>Exposed password hash found in leaked database</li>
                <li>Recommended Action: Change your password immediately</li>
              </ul>
            </div>
            <div className="border border-red-300 rounded-lg p-6 bg-red-50">
              <h3 className="text-xl font-semibold text-red-700 mb-2">Username: johndoe123</h3>
              <p className="text-gray-700 mb-1">Detected in 1 breach</p>
              <ul className="list-disc list-inside text-sm text-gray-700">
                <li>Exposed on: March 2024 - LinkedIn breach</li>
                <li>Partial credentials found in a leaked file</li>
                <li>Recommended Action: Enable 2FA and change password</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-white p-8 rounded-2xl shadow border border-gray-200 mb-12">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">🛠️ Recommended Security Actions</h2>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed">
            <li>Update all exposed credentials immediately.</li>
            <li>Enable two-factor authentication (2FA) wherever possible.</li>
            <li>Use a password manager to generate and store unique passwords.</li>
            <li>Review and monitor activity on affected accounts.</li>
          </ul>
        </section>

        <section className="bg-white p-10 rounded-2xl shadow border border-gray-200 mb-12">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">📊 Breach Statistics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
              <h3 className="text-3xl font-bold text-red-600">4</h3>
              <p className="text-gray-600 mt-1">Total Breaches Detected</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
              <h3 className="text-3xl font-bold text-yellow-500">2</h3>
              <p className="text-gray-600 mt-1">Accounts At Risk</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
              <h3 className="text-3xl font-bold text-green-600">1</h3>
              <p className="text-gray-600 mt-1">Resolved Breaches</p>
            </div>
          </div>
        </section>

        <section className="bg-white p-10 rounded-2xl shadow border border-gray-200 mb-24">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">📂 Breach Timeline</h2>
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-red-400 shadow-sm">
              <p className="text-sm text-gray-600">📅 Jan 12, 2023 — Email johndoe@example.com appeared in Dropbox breach</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-yellow-400 shadow-sm">
              <p className="text-sm text-gray-600">📅 Mar 18, 2024 — Username johndoe123 found in LinkedIn dump</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-400 shadow-sm">
              <p className="text-sm text-gray-600">📅 Apr 05, 2025 — Resolved Dropbox exposure</p>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}