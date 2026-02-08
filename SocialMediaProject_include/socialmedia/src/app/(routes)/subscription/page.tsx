'use client';

import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { CreditCard } from "lucide-react";

export interface SubsPlanType {
  name: string;
  price: string;
  desc: string;
  features: string[];
  highlight: string;
}

/**
 * Strategic Feature Distribution:
 * Free      → Explore & Observe
 * Pro       → Visibility & Signal
 * Creator   → Monetization & Authority
 * Enterprise→ Control & Scale
 */

export const plans: SubsPlanType[] = [
  {
    name: "Free",
    price: "$0 / month",
    desc: "Explore Briezl and understand the ecosystem",
    highlight: "Started here",
    features: [
      "Access public content feed",
      "Create up to 10 posts per month",
      "Basic engagement counts likes & replies every post",
      "Standard feed distribution (no prioritization)",
      "Follow and message up to 20 users",
      "Basic profile customization",
      "Self-service support via FAQs",
    ],
  },
  {
    name: "Pro",
    price: "$19 / month",
    desc: "For professionals who want predictable visibility",
    highlight: "Most popular",
    features: [
      "Unlimited posts and comments",
      "Get verified badge",
      "Edit your existing posts anytime",
      "Predictable content reach via transparent algorithm",
      "Basic feed recommendation system",
      "Ad-free browsing experience",
      "Enhanced profile credibility indicators",
      "Priority content indexing",
      "Self-managed analytics dashboard",
    ],
  },
  {
    name: "Creator",
    price: "$39 / month",
    desc: "Turn content into authority and income",
    highlight: "Best for creators",
    features: [
      "Monetize posts and get paid !",
      "Get verified badge",
      "Boost your best post by a click",
      "Advance feed recommendation feature",
      "Reputation & authority score (expertise-based)",
      "Priority distribution across relevant feeds and accounts",
      "Advanced analytics dashboard (views, saves, visits)",
      "Advanced post scheduling & versioning",
      "Self-managed moderation tools",
      "Email support for issues",
    ],
  },
  {
    name: "Premium",
    price: "$49 / month",
    desc: "Ultimate solo control with advanced tools",
    highlight: "For power users",
    features: [
      "All Creator features",
      "Personal API access for custom integrations",
      "Automated post scheduling with templates",
      "In-depth analytics & performance insights",
      "Custom branding options for profile",
      "Exclusive access to beta features",
      "Priority email support",
      "Data export for personal records",
    ],
  },
];

export default function SubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState<SubsPlanType | null>(null);

  useEffect(() => {
    if (selectedPlan) {
      console.log("Selected Plan:", selectedPlan.name);
    }
  }, [selectedPlan]);

  const comparisonFeatures = [
    { name: "Unlimited Posting", plans: ["Pro", "Creator", "Premium"] },
    { name: "Predictable Reach Boost", plans: ["Pro", "Creator", "Premium"] },
    { name: "Advanced Analytics", plans: ["Pro", "Creator", "Premium"] },
    { name: "Creator Monetization", plans: ["Creator", "Premium"] },
    { name: "Advanced analytics dashboard", plans: ["Creator", "Premium"] },
    { name: "Personal API Access", plans: ["Premium"] },
    { name: "Greater User Credit Score", plans: ["Pro", "Creator", "Premium"] },
    { name: "Priority Email Support", plans: ["Creator", "Premium"] },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center md:ml-72 py-10 px-6 md:px-20 bg-white dark:bg-black font-poppins">

      {/* Floating Payment CTA */}
      {selectedPlan && (
        <Link
          href={`/payment-page?plan=${selectedPlan.name}`}
          className="fixed right-6 top-6 z-50 flex items-center gap-2 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 px-6 py-3 font-semibold text-white shadow-lg hover:scale-105 transition"
        >
          <CreditCard className="w-5 h-5" />
          Proceed to Pay
        </Link>
      )}

      {/* Header */}
      <div className="flex flex-col items-center gap-2 mb-16 mt-6 max-w-3xl">
        <div>
          <Image src='/images/letter-B.png' className="dark:invert rounded-full" width={100} height={100} alt="logo" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Choose the plan that grows with you
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Briezl is built for professionals, creators, and teams who value
          signal over noise and ownership over vanity metrics.
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-6xl">
        {plans.map((plan,i) => {
          const isSelected = selectedPlan?.name === plan.name;

          return (
            <div
              key={plan.name}
              className={`flex flex-col justify-between rounded-2xl border p-6 shadow-lg h-[520px]
                ${isSelected
                  ? "border-yellow-500 bg-white dark:bg-black"
                  : "border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-black"
                }`}
            >
              {/* Plan Header */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    {plan.name}
                  </h2>
                  <span className={`text-xs px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-900/40 text-black dark:text-gray-300 ${plan.highlight === 'Most popular' ? 'animate-bounce' : ''}`}>
                    <div className="bg-gray-200 dark:bg-gray-900/40 rounded-full">
                      {plan.highlight}
                    </div>
                  </span>
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {plan.desc}
                </p>

                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                  {plan.price}
                </p>

                <ul className="space-y-3 max-h-56 overflow-y-auto pr-2">
                  {plan.features.map((feature,index) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-gray-700 dark:text-gray-300"
                    >
                      <span className="text-green-500 font-bold">✓</span>
                      <div className="flex items-center gap-1.5"><span>{feature}</span><span>{index === 1 && ( i !== 0 ) && (<Image src='/images/yellow-tick.png' width={20} height={20} alt="verified" className="text-blue-500" />)}</span></div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <button
                onClick={() => setSelectedPlan(plan)}
                className={`mt-6 w-full cursor-pointer rounded-xl py-3 font-semibold transition
                  ${isSelected
                    ? "bg-yellow-500 text-white"
                    : "bg-black dark:bg-white text-white dark:text-black hover:bg-yellow-500 hover:text-white"
                  }`}
              >
                {isSelected ? "Selected" : "Choose Plan"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Comparison Table */}
      <div className="w-full max-w-6xl mt-24 border-t border-gray-200 dark:border-gray-800 pt-12">
        <h2 className="text-3xl font-semibold text-center text-gray-900 dark:text-gray-100 mb-10">
          Plan Comparison
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-neutral-800 rounded-lg text-gray-700 dark:text-gray-300">
                <th className="py-3 px-4 text-left">Feature</th>
                {plans.map(plan => (
                  <th key={plan.name} className="py-3 px-4 text-center">
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonFeatures.map((row) => (
                <tr
                  key={row.name}
                  className="border-b border-gray-200 dark:border-gray-800"
                >
                  <td className="py-3 px-4">{row.name}</td>
                  {plans.map(plan => (
                    <td key={plan.name} className="py-3 px-4 text-center">
                      {row.plans.includes(plan.name) ? (
                        <span className="text-green-500 font-bold">✓</span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 text-center text-sm text-gray-600 dark:text-gray-400">
        <p>© {new Date().getFullYear()} Briezl. Built for signal, not noise.</p>
        <p className="mt-2">
          Crafted by{" "}
          <Link
            href="/@amritansh_coder"
            className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Amritansh Rai
          </Link>
        </p>
      </footer>
    </div>
  );
}
