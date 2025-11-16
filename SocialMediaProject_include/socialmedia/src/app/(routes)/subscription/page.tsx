'use client'
import Link from "next/link";
import React, { useState, useEffect } from "react";


export interface subsPlanType {
  name:string;
  price:string;
  desc:string;
  features:string[];
  highlight:string
}

export const plans : subsPlanType[] = [
    {
      name: "Free",
      price: "$0 /month",
      desc: "For casual users exploring Echofox",
      features: [
        "Create and post up to 50 posts per month",
        "Basic analytics for engagement insights",
        "Access to public content feed",
        "Follow and message up to 20 users",
        "Light and Dark mode compatibility",
        "Basic profile customization",
        "Ad-supported experience"
      ],
      highlight: "Perfect for new users",
    },
    {
      name: "Pro",
      price: "$10 /month",
      desc: "For active creators who want visibility",
      features: [
        "Unlimited posts and comments",
        "AI-based content recommendations",
        "Advanced profile analytics dashboard",
        "Custom profile themes and banners",
        "Encrypted DMs with media sharing",
        "Ad-free browsing experience",
        "Access to trending hashtags insights"
      ],
      highlight: "Best for consistent creators",
    },
    {
      name: "Creator",
      price: "₹30 /month",
      desc: "For influencers and developers building community",
      features: [
        "Monetize your posts (ad revenue + tips)",
        "Access Creator Studio dashboard",
        "Host live sessions and spaces",
        "Follower growth insights & heatmaps",
        "Integrate your portfolio & merch store",
        "Priority support + faster content review",
        "Advanced scheduling for posts",
      ],
      highlight: "Ideal for influencers & tech creators",
    },
    {
      name: "Enterprise",
      price: "₹50 /month",
      desc: "For agencies and social brands",
      features: [
        "Multiple account management",
        "Advanced API access for automation",
        "Real-time analytics & AI sentiment analysis",
        "Bulk content scheduling & moderation tools",
        "Team collaboration with access control",
        "Premium priority support 24x7",
        "White-label branding for businesses",
      ],
      highlight: "For professional teams & agencies",
    },
  ];

export default function SubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState<subsPlanType | null>(null);

  useEffect(() => {
    if (selectedPlan) {
      console.log("Selected Plan:", selectedPlan);
    }
  }, [selectedPlan]);


  const comparisonFeatures = [
    { name: "Unlimited Posting length", plans: ["Pro", "Creator", "Enterprise"] },
    { name: "Ad-Free Experience", plans: ["Creator", "Enterprise"] },
    { name: "Analytics Dashboard", plans: ["Pro", "Enterprise"] },
    { name: "API Access", plans: ['Creator',"Enterprise"] },
    { name: "Creator Monetization", plans: ["Creator","Enterprise"] },
    { name: "Team Management", plans: ["Enterprise"] },
    { name: "24/7 Support", plans: ['Pro','Creator',"Enterprise"] },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center md:ml-72 justify-start py-10 px-6 md:px-20 bg-white dark:bg-black transition-all duration-300 font-poppins">
      {/* Header Section */}
      <div className="text-center mb-14 mt-6">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-3 tracking-tight">
          Choose Your Plan
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Select a subscription that matches your journey — from exploring Echofox to building a brand that thrives.
        </p>
      </div>

      {/* Plans Grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8 w-full max-w-6xl place-items-center">
  {plans.map((plan, index) => (
    <div
      key={index}
      className={`flex flex-col justify-between border rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 w-full h-[480px] sm:h-[520px] ${
        selectedPlan === plan
          ? "border-blue-600 bg-blue-50 dark:bg-blue-950/30"
          : "border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-neutral-900"
      }`}
    >
      {/* Plan Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            {plan.name}
          </h2>
          <span className="text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
            {plan.highlight}
          </span>
        </div>

        <p className="text-gray-600 dark:text-gray-400 mb-4">{plan.desc}</p>

        <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-5">
          {plan.price}
        </p>
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-6 overflow-y-auto">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-center text-gray-700 dark:text-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            {feature}
          </li>
        ))}
      </ul>

      {/* Button */}
      <Link
        href={`/payment-page?plan=${plan.name}`}
        onClick={() => setSelectedPlan(plan)}
        className={`w-full cursor-pointer py-3 rounded-xl font-semibold text-center transition-colors duration-300 ${
          selectedPlan === plan
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-black text-white dark:bg-white dark:text-black hover:bg-yellow-500 dark:hover:bg-blue-500 hover:text-white"
        }`}
      >
        {selectedPlan === plan ? "Selected" : "Choose Plan"}
      </Link>
    </div>
  ))}
      </div>

      {/* Plan Comparison Section */}
      <div className="w-full max-w-6xl mt-24 border-t border-gray-200 dark:border-gray-800 pt-10">
        <h2 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 text-center mb-8">
          Compare Plans
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-neutral-800">
                <th className="py-3 px-4 font-medium">Feature</th>
                {plans.map((plan, i) => (
                  <th key={i} className="py-3 px-4 font-medium text-center">
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-700 dark:text-gray-300">
              {comparisonFeatures.map((feature, i) => (
                <tr key={i} className="border-b border-gray-200 dark:border-gray-800">
                  <td className="py-3 px-4">{feature.name}</td>
                  {plans.map((plan, j) => (
                    <td key={j} className="py-3 px-4 text-center">
                      {feature.plans.includes(plan.name) ? (
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

      {/* Footer Section */}
      <div className="mt-20 text-center text-gray-600 dark:text-gray-400 text-sm">
        <p>© {new Date().getFullYear()} Briezl — Empowering creators, coders, and communities.</p>
        <p className="mt-2">
          Crafted by{" "}
          <Link 
          href='/@amritansh_coder'
          className="text-blue-600 dark:text-blue-400 hover:bg-blue-100 py-1 px-3 rounded-lg font-semibold">
            Amritansh Rai
          </Link>
        </p>
      </div>
    </div>
  );
}
