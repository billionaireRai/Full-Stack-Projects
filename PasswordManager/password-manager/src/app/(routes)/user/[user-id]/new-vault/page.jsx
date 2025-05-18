"use client"

import Navbar from '@/components/navbar.jsx';

export default function NewVaultPage() {
  return (
    <div className="min-h-screen bg-[#f9fafb] text-gray-800">
      <Navbar />
      <main className="pt-28 px-6 md:px-12 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">🔐 Create a New Vault</h1>
        <p className="text-center text-gray-600 mb-14 max-w-xl mx-auto text-lg">
          Securely store all your sensitive data. Choose the type of vault below and enter the required information.
        </p>

        {/* Forms Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>

          {/* Bank Account Details Form */}
          <section className="bg-white p-10 rounded-2xl shadow-lg border border-gray-200 w-full">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">🏦 Bank Account Details</h2>
            <form className="grid grid-cols-1 gap-6">
              <input type="text" placeholder="Bank Name" className="transition-all duration-300 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
              <input type="text" placeholder="Account Holder Name" className="transition-all duration-300 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
              <input type="number" placeholder="Account Number" className="transition-all duration-300 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
              <input type="text" placeholder="IFSC Code" className="transition-all duration-300 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
              <textarea placeholder="Additional Notes" className="transition-all duration-300 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" rows={3}></textarea>
              <button className="cursor-pointer border-none outline-none bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-medium shadow">Save Bank Account</button>
            </form>
          </section>

          {/* Bank Card Details Form */}
          <section className="bg-white p-10 rounded-2xl shadow-lg border border-gray-200 w-full">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">💳 Bank Card Details</h2>
            <form className="grid grid-cols-1 gap-6">
              <input type="text" placeholder="Cardholder Name" className="transition-all duration-300 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
              <input type="number" placeholder="Card Number" className="transition-all duration-300 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
              <input type="date" placeholder="Expiry Date (MM/YY)" className="transition-all duration-300 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
              <input type="number" placeholder="CVV" className="transition-all duration-300 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
              <textarea placeholder="Card Notes" className="transition-all duration-300 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" rows={3}></textarea>
              <button className="cursor-pointer border-none outline-none bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-medium shadow">Save Card</button>
            </form>
          </section>

          {/* Crypto Wallet Details Form */}
          <section className="bg-white p-10 rounded-2xl shadow-lg border border-gray-200 w-full">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">🪙 Crypto Wallet Details</h2>
            <form className="grid grid-cols-1 gap-6">
              <input type="text" placeholder="Wallet Name" className="transition-all duration-300 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
              <input type="text" placeholder="Wallet Address" className="transition-all duration-300 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
              <input type="text" placeholder="Network (e.g. Ethereum, Bitcoin)" className="transition-all duration-300 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
              <textarea placeholder="Private Key / Seed Phrase" className="transition-all duration-300 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" rows={3}></textarea>
              <button className="cursor-pointer border-none outline-none bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-medium shadow">Save Crypto Wallet</button>
            </form>
          </section>

          {/* Password Details Form */}
          <section className="bg-white p-10 rounded-2xl shadow-lg border border-gray-200 w-full">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">🔑 Password Details</h2>
            <form className="grid grid-cols-1 gap-6">
              <input type="text" placeholder="Account Name" className="transition-all duration-300 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
              <input type="text" placeholder="Username / Email" className="transition-all duration-300 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
              <input type="password" placeholder="Password" className="transition-all duration-300 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
              <textarea placeholder="Notes or Recovery Info" className="transition-all duration-300 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" rows={3}></textarea>
              <button className="cursor-pointer border-none outline-none bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-medium shadow">Save Password</button>
            </form>
          </section>

        </div>

        {/* Suggestions Section */}
        <section className="mt-24 mb-10 bg-white p-8 rounded-2xl shadow border border-gray-200">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">✨ Suggestions</h2>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed">
            <li>Use strong, unique passwords for each and every record.</li>
            <li>Don't share your passwords with anyone.</li>
            <li>Update passwords regularly and avoid reusing them.</li>
            <li>We will encrypt sensitive notes or recovery info before storing.</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
