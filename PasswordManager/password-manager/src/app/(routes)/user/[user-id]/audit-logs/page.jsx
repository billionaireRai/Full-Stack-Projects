"use client"

import Navbar from '@/components/navbar.jsx';

export default function UserAuditLogsPage() {
  return (
    <div className="min-h-screen bg-[#f9fafb] text-gray-800">
      <Navbar />
      <main className="pt-28 px-6 md:px-12 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">📋 User Audit Logs</h1>
        <p className="text-center text-gray-600 mb-14 max-w-2xl mx-auto text-lg">
          Monitor, trace, and verify every significant action within your secure vault. This page helps you audit user interactions, ensuring accountability and transparency.
        </p>

        {/* Overview Section */}
        <section className="bg-white p-10 rounded-2xl shadow-lg border border-blue-200 mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-blue-600">🔎 Account Access Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-6 cursor-pointer bg-blue-50 rounded-xl border-none hover:shadow-md">
              <h3 className="text-3xl font-bold text-blue-600">9</h3>
              <p className="text-gray-600 mt-1">Total Logins Last 7 Days</p>
            </div>
            <div className="p-6 cursor-pointer bg-blue-50 rounded-xl border-none hover:shadow-md">
              <h3 className="text-3xl font-bold text-yellow-500">3</h3>
              <p className="text-gray-600 mt-1">New Devices Detected</p>
            </div>
            <div className="p-6 cursor-pointer bg-blue-50 rounded-xl border-none hover:shadow-md">
              <h3 className="text-3xl font-bold text-green-600">100%</h3>
              <p className="text-gray-600 mt-1">Successful Auth Rate</p>
            </div>
          </div>
        </section>

        {/* Activity Logs Table */}
        <section className="bg-white p-10 rounded-2xl shadow-lg border border-blue-200 mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-blue-600">🕵️‍♂️ Recent Activity Logs</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-gray-700">
              <thead className="bg-blue-50 border-b border-blue-200">
                <tr>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Time</th>
                  <th className="px-6 py-3 font-medium">Activity</th>
                  <th className="px-6 py-3 font-medium">Device</th>
                  <th className="px-6 py-3 font-medium">IP Address</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-100">
                <tr className='cursor-pointer hover:shadow hover:shadow-blue-md hover:bg-blue-50 rounded-lg'>
                  <td className="px-6 py-4">May 14, 2025</td>
                  <td className="px-6 py-4">10:42 AM</td>
                  <td className="px-6 py-4">Logged in</td>
                  <td className="px-6 py-4">Chrome on Windows</td>
                  <td className="px-6 py-4">192.168.1.2</td>
                  <td className="px-6 py-4 text-green-600">Success</td>
                </tr>
                <tr className='cursor-pointer hover:shadow hover:shadow-blue-md hover:bg-blue-50 rounded-lg'>
                  <td className="px-6 py-4">May 13, 2025</td>
                  <td className="px-6 py-4">5:31 PM</td>
                  <td className="px-6 py-4">Updated Bank Account Info</td>
                  <td className="px-6 py-4">Safari on iPhone</td>
                  <td className="px-6 py-4">192.168.1.5</td>
                  <td className="px-6 py-4 text-green-600">Success</td>
                </tr>
                <tr className='cursor-pointer hover:shadow hover:shadow-blue-md hover:bg-blue-50 rounded-lg'>
                  <td className="px-6 py-4">May 12, 2025</td>
                  <td className="px-6 py-4">8:15 AM</td>
                  <td className="px-6 py-4">Failed Login Attempt</td>
                  <td className="px-6 py-4">Unknown</td>
                  <td className="px-6 py-4">45.32.189.22</td>
                  <td className="px-6 py-4 text-red-600">Failed</td>
                </tr>
                <tr className='cursor-pointer hover:shadow hover:shadow-blue-md hover:bg-blue-50 rounded-lg'>
                  <td className="px-6 py-4">May 11, 2025</td>
                  <td className="px-6 py-4">9:47 PM</td>
                  <td className="px-6 py-4">Enabled Two-Factor Authentication</td>
                  <td className="px-6 py-4">Firefox on Mac</td>
                  <td className="px-6 py-4">192.168.1.10</td>
                  <td className="px-6 py-4 text-green-600">Success</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Filters */}
        <section className="bg-white p-8 rounded-2xl shadow border border-gray-200 mb-12">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">🔍 Filter Activity</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
              <option>All Types</option>
              <option>Login</option>
              <option>Data Change</option>
              <option>Settings</option>
              <option>2FA</option>
            </select>
            <input type="text" placeholder="IP or Device" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            <button className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">Apply</button>
          </div>
        </section>

        {/* Tips */}
        <section className="bg-white p-8 rounded-2xl shadow border border-gray-200 mb-12">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">💡 Reviewing Best Practices</h2>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed">
            <li>Look for repeated failed attempts — they could signal a brute-force attack.</li>
            <li>Verify new device logins and unexpected geographic IPs.</li>
            <li>Enable auto-logoff for sensitive sessions.</li>
            <li>Use alerts for settings change, export attempts, and 2FA modifications.</li>
          </ul>
        </section>

        {/* Geo & Device Graphs Placeholder */}
        <section className="bg-white p-10 rounded-2xl shadow border border-gray-200 mb-12">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">🌍 Login Locations & Devices</h2>
          <p className="text-gray-600 mb-4">Track where your account has been accessed from and which devices were used.</p>
          <div className="h-64 bg-gray-100 flex items-center justify-center text-gray-400 text-sm rounded-xl">
            <span className='animate-caret-blink'>Graphical Map & Device Distribution Charts Coming Soon</span>
          </div>
        </section>

        {/* Export Button */}
        <section className="bg-white p-8 rounded-2xl shadow border border-gray-200 mb-24">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">📥 Export Logs</h2>
          <p className="text-gray-600 mb-4">Export detailed logs for audits, personal recordkeeping, or reporting.</p>
          <div className="flex gap-4">
            <button className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition">Download CSV</button>
            <button className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg transition">Print Report</button>
          </div>
        </section>
      </main>
    </div>
  );
}
