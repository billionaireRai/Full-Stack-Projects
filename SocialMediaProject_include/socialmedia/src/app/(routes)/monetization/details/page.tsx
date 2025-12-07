'use client'

import React from 'react'
import { useSearchParams } from 'next/navigation'
import { DollarSign, TrendingUp, Users, BarChart3, CreditCard, Target } from 'lucide-react'

export default function MonetizationDetailsPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || 'Overview'

  const monetizationSections = {
    'Overview': {
      icon: <BarChart3 className="w-8 h-8 text-blue-500" />,
      title: 'Monetization Overview',
      description: 'Monetization refers to the process of generating revenue from your social media presence. It involves converting audience engagement into financial gains through various strategies.',
      details: 'In social media platforms, monetization can come from ads, subscriptions, sponsorships, and more. Understanding these methods helps creators and businesses build sustainable income streams.'
    },
    'Ads Revenue': {
      icon: <DollarSign className="w-8 h-8 text-green-500" />,
      title: 'Ads Revenue',
      description: 'Earn money through advertisements displayed on your content.',
      details: 'Platforms like YouTube, Instagram, and TikTok pay creators based on views, clicks, and engagement. The more your audience grows, the higher your ad revenue potential.'
    },
    'Subscriptions': {
      icon: <CreditCard className="w-8 h-8 text-purple-500" />,
      title: 'Subscriptions',
      description: 'Offer exclusive content to paying subscribers.',
      details: 'Services like Patreon, YouTube Memberships, or platform-specific subscriptions allow fans to support creators directly for premium content, behind-the-scenes access, or early releases.'
    },
    'Sponsorships': {
      icon: <Target className="w-8 h-8 text-red-500" />,
      title: 'Sponsorships',
      description: 'Partner with brands for sponsored content.',
      details: 'Companies pay influencers to promote their products. Successful sponsorships require authentic alignment between the brand and your audience.'
    },
    'Affiliate Marketing': {
      icon: <TrendingUp className="w-8 h-8 text-orange-500" />,
      title: 'Affiliate Marketing',
      description: 'Earn commissions by promoting products.',
      details: 'Share affiliate links in your content. When followers make purchases through these links, you receive a percentage of the sale as commission.'
    },
    'Merchandise': {
      icon: <Users className="w-8 h-8 text-indigo-500" />,
      title: 'Merchandise Sales',
      description: 'Sell branded merchandise to your audience.',
      details: 'Create and sell custom apparel, accessories, or digital products. Platforms like Teespring or Shopify make this easy for creators.'
    }
  }

  const currentSection = monetizationSections[query as keyof typeof monetizationSections] || monetizationSections['Overview']

  return (
  <div className='h-fit flex flex-col md:ml-72 font-poppins p-2 dark:bg-black'>
    <div className="max-w-full mx-auto p-6 bg-white dark:bg-black min-h-screen rounded-lg">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Monetization Details
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Learn about different ways to monetize your social media presence
        </p>
      </div>

      <div className="bg-gray-50 dark:bg-black rounded-lg p-6 mb-8">
        <div className="flex items-center mb-4">
          {currentSection.icon}
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white ml-4">
            {currentSection.title}
          </h2>
        </div>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          {currentSection.description}
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          {currentSection.details}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(monetizationSections).map(([key, section]) => (
          <div
            key={key}
            className={`p-4 rounded-lg border-1 transition-all cursor-pointer ${
              query === key
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
            onClick={() => window.history.replaceState(null, '', `/monetization/details?q=${encodeURIComponent(key)}`)}
          >
            <div className="flex items-center mb-2">
              {section.icon}
              <h3 className="text-lg font-medium text-gray-900 dark:text-white ml-2">
                {section.title}
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {section.description}
            </p>
          </div>
        ))}
      </div>
    </div>
   </div>
  )
}

