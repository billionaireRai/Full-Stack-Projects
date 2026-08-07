'use client'

import React, { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DollarSign, BarChart3, CreditCard, Target, TrendingUp, Users, X, Wallet, ArrowUpRight, Activity, Sparkles } from 'lucide-react'

interface EarningspopProps {
  onClose: () => void
}

interface EarningsMethod {
  icon: React.ReactNode
  title: string
  value: number
  note: string
  bar: number
  color: string
  lightBg: string
  darkBg: string
  textColor: string
}

export default function Earningspop({ onClose }: EarningspopProps) {
  const [open, setOpen] = useState(true)

  const methods: EarningsMethod[] = [
    {
      icon: <DollarSign size={19} />,
      title: 'Post earnings',
      value: 40,
      note: '40K new views',
      bar: 78,
      color: 'text-yellow-500',
      lightBg: 'bg-yellow-50 border-yellow-100',
      darkBg: 'dark:bg-yellow-950/30 dark:border-yellow-900/50',
      textColor: 'text-yellow-600 dark:text-yellow-400',
    },
    {
      icon: <BarChart3 size={19} />,
      title: 'Ads revenue',
      value: 126.84,
      note: '184K impressions',
      bar: 64,
      color: 'text-emerald-500',
      lightBg: 'bg-emerald-50 border-emerald-100',
      darkBg: 'dark:bg-emerald-950/30 dark:border-emerald-900/50',
      textColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      icon: <CreditCard size={19} />,
      title: 'Subscriptions',
      value: 12800,
      note: '1,284 active subs',
      bar: 72,
      color: 'text-purple-500',
      lightBg: 'bg-purple-50 border-purple-100',
      darkBg: 'dark:bg-purple-950/30 dark:border-purple-900/50',
      textColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      icon: <Target size={19} />,
      title: 'Sponsorships',
      value: 750,
      note: '1 sponsored post',
      bar: 55,
      color: 'text-rose-500',
      lightBg: 'bg-rose-50 border-rose-100',
      darkBg: 'dark:bg-rose-950/30 dark:border-rose-900/50',
      textColor: 'text-rose-600 dark:text-rose-400',
    },
    {
      icon: <TrendingUp size={19} />,
      title: 'Affiliate marketing',
      value: 684,
      note: '342 conversions',
      bar: 68,
      color: 'text-orange-500',
      lightBg: 'bg-orange-50 border-orange-100',
      darkBg: 'dark:bg-orange-950/30 dark:border-orange-900/50',
      textColor: 'text-orange-600 dark:text-orange-400',
    },
    {
      icon: <Users size={19} />,
      title: 'Merchandise',
      value: 3240,
      note: '126 orders',
      bar: 82,
      color: 'text-indigo-500',
      lightBg: 'bg-indigo-50 border-indigo-100',
      darkBg: 'dark:bg-indigo-950/30 dark:border-indigo-900/50',
      textColor: 'text-indigo-600 dark:text-indigo-400',
    },
  ]

  const total = useMemo(() => methods.reduce((sum, method) => sum + method.value, 0) ,[methods]);

  const formatMoney = (value: number) => {
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2,maximumFractionDigits: 2 }).format(value)
  }

  const formatCompactMoney = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`
    }

    if (value >= 1000) {
      return `$${(value / 1000).toFixed(2)}K`
    }

    return `$${formatMoney(value)}`
  }

  if (!open) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={close}
        className="fixed inset-0 bg-black/10 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in-0 zoom-in-95 duration-200"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-[28px] border border-black/[0.08] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.25)] dark:border-white/[0.10] dark:bg-[#090909] dark:shadow-[0_30px_100px_rgba(0,0,0,0.65)]
          "
        >

          {/* Close */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={onClose}
            aria-label="Close earnings"
            className="absolute cursor-pointer right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:border-white/10 dark:bg-white/[0.05] dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white
            "
          >
            <X size={18} />
          </motion.button>

          <div className="max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="px-6 pb-5 pt-6 sm:px-7 sm:pt-7">
              <div className="flex items-start gap-4">
                <motion.div
                  initial={{ scale: 0.8, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.1, duration: 0.4, type: 'spring' }}
                  className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-300 to-orange-400 text-white shadow-lg shadow-yellow-500/20
                  "
                >
                  <Wallet size={23} />
                  <motion.span
                    animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-2xl bg-yellow-400 dark:bg-yellow-500"
                  />
                </motion.div>

                <div className="min-w-0 flex-1 pr-10">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-bold tracking-tight text-gray-950 dark:text-white">
                      Your earnings
                    </h2>
                  </div>

                  <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                    Revenue generated across your monetization channels.
                  </p>

                  <div className="mt-2 flex items-center gap-1.5 text-[11px] text-gray-400 dark:text-gray-500">
                    <Activity size={12} />
                    Updated just now
                  </div>
                </div>
              </div>

              {/* Total earnings hero */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.35 }}
                className="relative mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-white/[0.08] dark:bg-white/[0.035]
                "
              >
                {/* Shimmer */}
                <motion.div
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
                  className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg] dark:via-white/[0.04]
                  "
                />

                <div className="relative flex items-end justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Estimated earnings
                      </p>
                      <Sparkles
                        size={13}
                        className="text-yellow-500 dark:text-blue-400"
                      />
                    </div>

                    <motion.p className="mt-1 text-3xl font-black tracking-tight text-gray-950 dark:text-white">
                      ${formatMoney(total)}
                    </motion.p>
                  </div>
                  <div
                    className="flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400
                    "
                  >
                    <ArrowUpRight size={13} />
                    18.6%
                  </div>
                </div>

                <div className="relative mt-4 flex items-center justify-between">
                  <p className="text-[11px] text-gray-400 dark:text-gray-500">
                    Compared with previous period
                  </p>

                  <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
                    {formatCompactMoney(total)}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Revenue sources */}
            <div className="px-6 pb-6 sm:px-7 sm:pb-7">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                    Revenue sources
                  </h3>
                  <p className="mt-0.5 text-[11px] text-gray-400 dark:text-gray-500">
                    Performance by monetization method
                  </p>
                </div>

                <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500">
                  {methods.length} channels
                </span>
              </div>
              
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {methods.map((method, index) => {
                  const contribution = (method.value / total) * 100

                  return (
                    <motion.div
                      key={method.title}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.06, duration: 0.3 }}
                      whileHover={{ y: -2, scale: 1.005 }}
                      className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-3.5 transition-shadow hover:shadow-lg hover:shadow-black/[0.04] dark:border-white/[0.08] dark:bg-white/[0.025] dark:hover:shadow-black/30
                      "
                    >
                      <div className="flex items-center gap-3">
                        {/* Icon */}
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${method.lightBg} ${method.darkBg} ${method.color}
                          `}
                        >
                          {method.icon}
                        </div>

                        {/* Content */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate text-[13px] font-bold text-gray-900 dark:text-white">
                                {method.title}
                              </p>

                              <p className="mt-0.5 truncate text-[11px] text-gray-400 dark:text-gray-500">
                                {method.note}
                              </p>
                            </div>

                            <div className="text-right">
                              <p
                                className={`text-sm font-extrabold ${method.textColor}`}
                              >
                                ${formatMoney(method.value)}
                              </p>

                              <p className="mt-0.5 text-[10px] text-gray-400 dark:text-gray-500">
                                {contribution.toFixed(1)}% of total
                              </p>
                            </div>
                          </div>

                          {/* Progress */}
                          <div className="mt-3 flex items-center gap-2">
                            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-white/[0.07]">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${method.bar}%` }}
                                transition={{duration: 0.9, delay: 0.35 + index * 0.07, ease: 'easeOut' }}
                                className={`h-full rounded-full bg-current ${method.color}`}
                              />
                            </div>

                            <span className="w-7 text-right text-[10px] font-semibold text-gray-400 dark:text-gray-500">
                              {method.bar}%
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Hover highlight */}
                      <div
                        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 bg-gradient-to-r from-transparent via-black/[0.015] to-transparent dark:via-white/[0.02]"
                      />
                    </motion.div>
                  )
                })}
              </div>

              {/* Bottom summary */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.35 }}
                className="mt-4 flex items-center justify-between rounded-2xl border border-gray-200 dark:bg-[#090909]  p-4 dark:border-white/[0.08]"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-yellow-500 shadow-sm dark:bg-white/[0.06] dark:text-yellow-400"
                  >
                    <TrendingUp size={17} />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-gray-900 dark:text-white">
                      Strong earning momentum
                    </p>

                    <p className="mt-0.5 text-[10px] text-gray-500 dark:text-gray-400">
                      Your revenue is trending upward.
                    </p>
                  </div>
                </div>

                <ArrowUpRight
                  size={18}
                  className="text-yellow-600 dark:text-yellow-400"
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}