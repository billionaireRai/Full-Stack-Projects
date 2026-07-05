'use client';

import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Activebeep from "@/components/activebeep";
import { CreditCard } from "lucide-react";
import { useSearchParams } from "next/navigation";

type termType = 'monthly' | 'yearly' ;

interface planPriceType {
  monthly: {
    value:number ;
    priceId:string ;
  },
  yearly: {
    value:number ;
    priceId:string ;
  };
  saved: number; // equivalent % saved when switching from monthly to yearly
}


export interface SubsPlanType {
  name: string;
  prices: planPriceType;
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
    prices: {
      monthly: { value: 0, priceId: "" },
      yearly: { value: 0, priceId: "" },
      saved: 0,
    },

    desc: "Explore Briezl and understand the ecosystem",
    highlight: "Started here",
    features: [
      "Access public content feed",
      "maximum 5 pinned post",
      "Upload upto 10 media via content per month",
      "Create up to 20 posts & comments per month",
      "Basic engagement counts likes & replies every post",
      "Standard feed distribution (no prioritization)",
      "Chat messaging up to 10 accounts",
      "Basic profile customization",
      "Specific Post analytics , performance check",
      "Self-service support via FAQs",
    ],
  },
  {
    name: "Pro",
    prices: {
      monthly: { value: 14.9, priceId: "prod_UpRRHT5xOpbeeY" },
      yearly: { value: 149, priceId: "prod_UpRWnY5jml8X1U" },
      saved: 17,
    },
    desc: "For professionals who want predictable visibility",
    highlight: "Most popular",
    features: [
      "Everything in Free",
      "Upload upto 50 media via content per month",
      "Unlimited posts and comments",
      "Get verified badge",
      "Edit your existing posts anytime",
      "Draft upto 10 posts for future usage",
      "Improved suggestions priority for your accounts",
      "Basic feed recommendation system",
      "Faster content queue after publishing",
      "Account specific analytics dashboard accessible",
    ],
  },
  {
    name: "Creator",
    prices: {
      monthly: { value: 29, priceId: "prod_UpRZcrFsYqbluw" },
      yearly: { value: 290, priceId: "prod_UpRbVzpN9XR6Qo" },
      saved: 19,
    },
    desc: "Turn content into authority and popularity",
    highlight: "Best for creators",
    features: [
      "Everything in Pro",
      // "Monetize posts and get paid !",
      "Unlimited media uploads available",
      // "Boost your best post by a click", later I'll add it...
      "Unlimited pinned posts",
      "Advance feed recommendation feature",
      "Higher recommendation weight in eligible feeds",
      "Improved analytics dashboard (views, saves, visits)",
      "PDF data export feature for dashboard",
      "Faster automated review",
    ],
  },
  {
    name: "Premium",
    prices: {
      monthly: { value: 59, priceId: "prod_UpRcnmkD8uBUIE" },
      yearly: { value: 590, priceId: "" },
      saved:20,
    },
    desc: "Ultimate solo control with advanced tools",
    highlight: "For power users",
    features: [
      "Everything in Creator",
      "Create unlimited draft posts",
      "AI suggestions for comment , hashtag , writing post",
      "Automated post scheduling",
      "Set custom profile background theme",
      "Top Priority in email support & reports analysis",
      "All future premium features included",
    ],
  },
];

export default function SubscriptionPage() {
  const searchParams = useSearchParams() ; // intializing useParams() hook...
  const [currentTerm, setcurrentTerm] = useState<termType>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<SubsPlanType | null>(null);
  type billingYearlyType = { monthly: string; saved: string }; 

  const [billingYearly, setbillingYearly] = useState<billingYearlyType>();
  
  // function returning monthly billing and saved...
function getYearlyBilling(plan: SubsPlanType): billingYearlyType {
    const yearlyValue = plan.prices.yearly.value;
    const saved = ((plan.prices.saved / 100) * yearlyValue).toFixed(1);
    const monthly = ((yearlyValue - parseFloat(saved)) / 12).toFixed(1);

    return { monthly, saved };
  }

  useEffect(() => {
    plans.forEach(plan => {
      if (plan.name === searchParams.get('plan')) setSelectedPlan(plan) ;
    })

    if (selectedPlan !== null) setbillingYearly(getYearlyBilling(selectedPlan));
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
    <div className="min-h-screen flex flex-col gap-3 items-center py-10 px-6 md:px-20 bg-white dark:bg-black font-poppins">
      {/* Floating Payment CTA */}
      {selectedPlan && selectedPlan?.name !== 'Free'  && (
        <Link
          href={`/payment-page?plan=${selectedPlan.name}&term=${currentTerm}`}
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
        <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 dark:text-gray-100 mb-4">
          Choose the plan that grows with you
        </h1>
        <p className="text-gray-600 text-sm leading-relaxed dark:text-gray-400 max-w-2xl">
          Briezl is built for professionals, creators, founders, developers, and teams who value meaningful conversations over endless noise, genuine connections over vanity metrics, and ownership over their content and audience. Upgrade your subscription to unlock advanced publishing tools, enhanced privacy and security features, premium collaboration capabilities, priority support, deeper analytics, and exclusive features designed to help you work smarter, build your personal brand, and grow with confidence.
        </p>
      </div>
      <div className="toggle-term flex items-center justify-center w-full rounded-lg">
        <div className="border border-yellow-500 p-1 flex items-center shadow-xl justify-center gap-2 rounded-full">
          <span 
            onClick={() => { setcurrentTerm('monthly') }}
            className={`py-2 px-4 rounded-full text-md cursor-pointer ${currentTerm === 'monthly' ? 'bg-yellow-400 text-white font-semibold' : 'text-yellow-600 hover:bg-yellow-100'}`}>Monthly</span>
          <div 
            onClick={() => { setcurrentTerm('yearly') }}
            className={`flex items-center justify-center text-yellow-600 gap-1.5 py-2 px-4 rounded-full text-md cursor-pointer ${currentTerm === 'yearly' ? 'bg-yellow-400 text-white font-semibold' : 'hover:bg-yellow-100'}`}>
            <span className={`${currentTerm === 'yearly' && 'text-white'}`}>Yearly🔥</span>
            <div className={`text-xs text-gray-400 ${currentTerm === 'yearly' && 'text-white'}`}>Save upto 20%</div>
          </div>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full text-xs max-w-6xl">
        {plans.map((plan,i) => {
          const isSelected = selectedPlan?.name === plan.name
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
                  <span className={`text-xs px-3 py-2 rounded-full bg-gray-100 dark:bg-gray-950 text-gray-700 dark:text-gray-300`}>
                    <div className="bg-gray-100 dark:bg-gray-950 rounded-full flex flex-row items-center gap-1.5">
                      <span>{plan.highlight}</span>
                      {plan.highlight === 'Most popular' && <Activebeep />}
                    </div>
                  </span>
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {plan.desc}
                </p>
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                  <div>{(currentTerm === 'yearly' ? `$${plan.prices.yearly.value} / year` : `$${plan.prices.monthly.value} / month`)}</div>
                  {selectedPlan !== null && currentTerm === 'yearly' && plan === selectedPlan && (
                    <div className="mt-2 inline-flex items-center gap-2 rounded-lg bg-yellow-50/70 px-3 py-1 text-xs text-gray-700 dark:bg-yellow-500/10 dark:text-yellow-200">
                      <span className="font-semibold">${billingYearly?.monthly}</span>
                      <span className="text-gray-500 dark:text-yellow-100">/month</span>
                      <span className="text-gray-400">·</span>
                      <span className="text-gray-600 dark:text-gray-300">billed yearly</span>
                      <span className="text-gray-400">·</span>
                      <span className="ml-1 rounded-md bg-green-500/10 px-2 py-0.5 text-[11px] font-semibold text-green-600 dark:text-green-300">
                        Save ${billingYearly?.saved} total
                      </span>
                    </div>
                  )}
                </div>
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
          developed and designed by{" "}
          <Link
            href="/@_briezlofficial"
            className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            briezl
          </Link>
        </p>
      </footer>
    </div>
  );
}
