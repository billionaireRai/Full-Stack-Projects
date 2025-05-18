"use client"

import Navbar from '@/components/navbar.jsx';
import CustomDropDown from '@/components/customDropDown.jsx'
import { useState } from 'react'

export default function UserSharedVaultPage() {
  const [roles, setroles] = useState(['View Only', 'Edit', 'Admin']);
  const [sharedVaults, setSharedVaults] = useState([
    {
      id: 1,
      name: 'Family Vault',
      members: ['Alice', 'Bob'],
      createdAt: '2024-12-01',
      lastAccessed: '2025-05-10',
      sharedBy: 'Admin',
      items: ['Passport Info', 'Bank Account'],
      sharingHistory: [
        { user: 'Admin', action: 'Shared with Alice', date: '2024-12-02' },
        { user: 'Alice', action: 'Shared with Bob', date: '2024-12-05' }
      ],
      vaultLogs: [
        { user: 'Bob', action: 'Viewed Bank Account', date: '2025-05-11' },
        { user: 'Alice', action: 'Updated Passport Info', date: '2025-05-09' }
      ]
    },
    {
      id: 2,
      name: 'Team Vault',
      members: ['Charlie', 'Dana', 'Eve'],
      createdAt: '2025-01-15',
      lastAccessed: '2025-05-12',
      sharedBy: 'Manager',
      items: ['Repo Credentials', 'Client Contracts'],
      sharingHistory: [
        { user: 'Manager', action: 'Shared with Charlie', date: '2025-01-16' },
        { user: 'Charlie', action: 'Shared with Dana and Eve', date: '2025-01-17' }
      ],
      vaultLogs: [
        { user: 'Dana', action: 'Downloaded Client Contracts', date: '2025-05-10' },
        { user: 'Charlie', action: 'Viewed Repo Credentials', date: '2025-05-08' }
      ]
    },
  ]);

  return (
    <div className="min-h-screen bg-[#f9fafb] text-gray-800">
      <Navbar />
      <main className="pt-28 px-6 md:px-12 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">🔗 Shared Vaults</h1>
        <p className="text-center text-gray-600 mb-14 max-w-2xl mx-auto text-lg">
          View and manage all the vaults that have been shared with you by other users. Keep your access secure and up-to-date.
        </p>

        {/* Shared Vaults List */}
        <section className="mb-16">
          {sharedVaults.map((vault) => (
            <div
              key={vault.id}
              className="bg-white p-6 rounded-xl shadow mb-6 border border-gray-200 transition-all duration-300 hover:shadow-lg"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">{vault.name}</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Created on: {vault.createdAt} | Last Accessed: {vault.lastAccessed}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Shared By: {vault.sharedBy}</p>
                </div>
                <div className="flex gap-4 flex-wrap">
                  <button className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition">
                    View Vault
                  </button>
                  <button className="cursor-pointer bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition">
                    Remove Access
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-md font-semibold text-gray-700 mb-2">Members:</h3>
                <div className="flex flex-wrap gap-2">
                  {vault.members.map((member, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm border border-gray-300"
                    >
                      {member}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-md font-semibold text-gray-700 mb-2">Vault Items:</h3>
                <ul className="list-disc list-inside text-gray-600">
                  {vault.items.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-4">
                <details className="text-sm">
                  <summary className="text-blue-600 cursor-pointer mb-2">View Sharing History</summary>
                  <ul className="pl-4 text-gray-700 list-disc">
                    {vault.sharingHistory.map((entry, i) => (
                      <li key={i}>{entry.date} - {entry.user} {entry.action}</li>
                    ))}
                  </ul>
                </details>
              </div>
              <div className="mt-4">
                <h3 className="text-md font-semibold text-gray-700 mb-2">Recent Activity:</h3>
                <ul className="text-gray-600 space-y-1 text-sm">
                  {vault.vaultLogs.map((log, i) => (
                    <li key={i}>• {log.date}: <strong>{log.user}</strong> {log.action}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </section>

        {/* Access Control */}
        <section className="bg-white p-8 rounded-xl shadow border border-gray-200 mb-20">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">🔐 Access Control Settings</h2>
          <p className="text-gray-700 mb-4">
            Customize access for each member. Define view-only, edit, or admin roles. Upcoming support for expiration dates on shared access.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition">
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-3">
      <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path d="M5.121 17.804A9.953 9.953 0 0112 15c2.21 0 4.243.715 5.879 1.922M15 11a3 3 0 10-6 0 3 3 0 006 0z" />
          <path d="M12 2a10 10 0 100 20 10 10 0 000-20z" />
        </svg>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800">Alice</h3>
        <p className="text-sm text-gray-500">Family Vault</p>
      </div>
    </div>
    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
      Active
    </span>
  </div>
  
  <label className="block text-sm font-medium text-gray-600 mb-1">Access Role</label>
  <CustomDropDown defaultOption='View Only' options={roles}/>
</div>

            <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition">
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-3">
      <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path d="M5.121 17.804A9.953 9.953 0 0112 15c2.21 0 4.243.715 5.879 1.922M15 11a3 3 0 10-6 0 3 3 0 006 0z" />
          <path d="M12 2a10 10 0 100 20 10 10 0 000-20z" />
        </svg>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800">Alice</h3>
        <p className="text-sm text-gray-500">Family Vault</p>
      </div>
    </div>
    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
      Active
    </span>
  </div>
  
  <label className="block text-sm font-medium text-gray-600 mb-1">Access Role</label>
<CustomDropDown defaultOption='View Only' options={roles}/>
</div>
          </div>
        </section>

        {/* Vault Usage Statistics */}
        <section className="bg-white p-8 rounded-xl shadow border border-gray-200 mb-20">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">📊 Vault Usage Statistics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="p-6 cursor-pointer hover:shadow-md bg-gray-50 rounded-xl border border-gray-200">
              <h3 className="text-3xl font-bold text-blue-600">6</h3>
              <p className="text-gray-600 mt-1">Total Shared Vaults</p>
            </div>
            <div className="p-6 cursor-pointer hover:shadow-md bg-gray-50 rounded-xl border border-gray-200">
              <h3 className="text-3xl font-bold text-green-600">12</h3>
              <p className="text-gray-600 mt-1">Active Collaborators</p>
            </div>
            <div className="p-6 cursor-pointer hover:shadow-md bg-gray-50 rounded-xl border border-gray-200">
              <h3 className="text-3xl font-bold text-red-500">3</h3>
              <p className="text-gray-600 mt-1">Vaults Recently Accessed</p>
            </div>
          </div>
        </section>

        {/* Previously Existing Sections */}
        {/* Guidelines */}
        {/* Activity Logs */}
        {/* Future Enhancements */}

      </main>
    </div>
  );
}
