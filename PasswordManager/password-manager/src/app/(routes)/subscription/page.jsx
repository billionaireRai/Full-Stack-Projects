"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "@/components/navbar"; // Make sure this exists in your project

export default function UserSubscriptionOptionsPage() {
  const [selectedPlan, setSelectedPlan] = useState("Freemium"); // targeting initially on the freemium one...
  const plans = [
    {
      name: "Freemium",
      value: "Freemium",
      price: "$0/mo",
      description: "Perfect for casual users getting started.",
      features: [
        "Basic Vault Access",
        "Email Support (48h response)",
        "Access on 1 Device",
        "Community Forum Access",
      ],
      bestFor: "Individuals exploring the platform",
      supportLevel: "Basic",
    },
    {
      name: "Basic",
      value: "Basic",
      price: "$9.99/mo",
      description: "Ideal for individuals with light usage needs.",
      features: [
        "All Freemium Features",
        "Priority Email Support (24h response)",
        "Access on up to 2 Devices",
        "Unlimited Items in Vault",
        "Two-Factor Authentication",
      ],
      bestFor: "Solo professionals",
      supportLevel: "Priority Email",
    },
    {
      name: "Standard",
      value: "Standard",
      price: "$19.99/mo",
      description: "Great for professionals and small teams.",
      features: [
        "All Basic Features",
        "Advanced Sharing Controls",
        "Access on Unlimited Devices",
        "Version History (30 days)",
        "Activity Logs",
        "Live Chat Support (Business Hours)",
      ],
      bestFor: "Small teams & power users",
      supportLevel: "Live Chat + Email",
    },
    {
      name: "Premium",
      value: "Premium",
      price: "$39.99/mo",
      description: "Full-featured solution for power users & families.",
      features: [
        "All Standard Features",
        "24/7 Priority Support",
        "Family & Team Sharing (Up to 6 Members)",
        "Early Access to New Features",
        "Dedicated Account Manager",
        "Data Breach Monitoring",
      ],
      bestFor: "Enterprises, families & high-security users",
      supportLevel: "24/7 Premium",
    },
  ];  

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 pt-28 pb-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">✨ Manage Your Subscription</h1>
          <p className="text-lg text-gray-600">
            Choose the best plan for your needs. You can upgrade, downgrade, or cancel at any time.
          </p>
        </div>

        <section className="grid md:grid-cols-4 gap-8 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-xl border ${
                selectedPlan === plan.name ? "border-blue-600 shadow-blue-300 shadow-lg animate-pulse" : "border-gray-200"
              } bg-white p-6 flex flex-col items-start justify-between transition-all duration-300`}
            >
              <div>
                <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
                <p className="text-gray-600 text-xl mb-4">{plan.price}</p>
                <ul className="mb-6 space-y-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-center gap-2">
                      <span className="text-blue-500">✔</span> {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => setSelectedPlan(plan.name)}
                className={`cursor-pointer duration-300 hover:border hover:border-blue-600 w-full text-sm font-medium px-4 py-2 rounded-lg transition ${
                  selectedPlan === plan.name
                    ? "bg-blue-600 text-white border-none"
                    : "bg-gray-100 text-gray-800 hover:bg-blue-50"
                }`}
              >
                {selectedPlan === plan.name ? "Current Plan" : "Select Plan"}
              </button>
            </div>
          ))}
        </section>
        <div className="flex items-center justify-end mb-3.5">
            <Link href={{ pathname: "/payment-gateway", query: { plan: selectedPlan } }}>
               {selectedPlan !== "Freemium" ? <button className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg">Move With {selectedPlan} </button> :"" }
            </Link>
        </div>
        {/* Action Buttons */}
        <section className="bg-white border border-gray-200 rounded-xl shadow-md p-8">
          <h3 className="text-2xl font-semibold mb-6">🔧 Manage Your Plan</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            <button className="cursor-pointer w-full bg-green-500 text-white px-4 py-3 rounded-lg font-medium hover:bg-green-600 transition">
              Upgrade Plan
            </button>
            <button className="cursor-pointer w-full bg-yellow-400 text-white px-4 py-3 rounded-lg font-medium hover:bg-yellow-500 transition">
              Downgrade Plan
            </button>
            <button className="cursor-pointer w-full bg-red-500 text-white px-4 py-3 rounded-lg font-medium hover:bg-red-600 transition">
              Cancel Subscription
            </button>
            <button className="cursor-pointer w-full bg-blue-500 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-600 transition">
              Contact Support
            </button>
          </div>
        </section>

        {/* Billing Summary */}
        <section className="mt-20 bg-white border border-gray-200 rounded-xl shadow-md p-8">
          <h3 className="text-xl font-semibold mb-4">📄 Billing Summary</h3>
          <p className="text-gray-700 mb-2">
            <strong>Current Plan:</strong> {selectedPlan}
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Next Billing Date:</strong> June 15, 2025
          </p>
          <p className="text-gray-700">
            <strong>Payment Method:</strong> **** **** **** 4242 (Visa)
          </p>
          <button className="cursor-pointer mt-6 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium transition">
            Update Payment Method
          </button>
        </section>

        {/* FAQ Section */}
        <section className="mt-20">
          <h3 className="text-xl font-semibold mb-6">❓ Frequently Asked Questions</h3>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-1">
                Can I change my plan anytime?
              </h4>
              <p className="text-gray-600 text-sm">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
               <h4 className="font-semibold text-gray-800 mb-1">
                 What happens if I cancel my subscription?
               </h4>
               <p className="text-gray-600 text-sm">
                 You will retain access to your current plan until the end of the billing cycle. No refunds for mid-cycle cancellations.
               </p>
             </div>

             <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
               <h4 className="font-semibold text-gray-800 mb-1">
                 Will I lose my data if I downgrade?
               </h4>
               <p className="text-gray-600 text-sm">
                 No, your data is safe. However, some premium features may become inaccessible if your new plan doesn't support them.
               </p>
             </div>
             <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
               <h4 className="font-semibold text-gray-800 mb-1">
                    Do you offer student discounts?
               </h4>
                <p className="text-gray-600 text-sm">
                 Yes! We offer 30% off for verified students. Contact support with your student ID to get started.
                </p>
               </div>

               <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
               <h4 className="font-semibold text-gray-800 mb-1">
                    How can I get a refund?
               </h4>
               <p className="text-gray-600 text-sm">
                 We have a 7-day refund policy for new users. Contact our support team within 7 days of purchase to request a refund.
                </p>
               </div>
               <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-1">
                    Can I pause my subscription instead of cancelling?
                </h4>
                <p className="text-gray-600 text-sm">
                    Currently, pausing subscriptions is not supported. We recommend downgrading to the Basic plan temporarily.
                </p>
                </div>
            </div>
        </section>
      </main>
    </div>
  );
}
