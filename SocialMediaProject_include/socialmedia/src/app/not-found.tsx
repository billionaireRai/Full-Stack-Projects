'use client'

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  Home,
  Compass,
  Search,
  ArrowLeft,
  Ghost,
  Heart,
  MessageCircle,
  Share2,
  User,
  Sparkles,
} from "lucide-react";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const quickLinks = [
  { label: "Feed", href: "/feed", icon: Home },
  { label: "Explore", href: "/explore", icon: Compass },
  { label: "Profile", href: "/profile", icon: User },
];

export default function NotFound() {
  return (
    <main className="relative h-full w-full overflow-y-scroll overflow-hidden dark:text-slate-100">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center px-6 py-16 text-center"
      >
        {/* Brand logo */}
        <motion.div variants={item} className="mb-8">
          <Link href="/" className="group inline-flex items-center gap-2">
            <Image
              src="/images/letter-B.png"
              alt="Briezl logo"
              width={90}
              height={90}
              className="rounded-full transition-transform duration-300 group-hover:rotate-6 dark:invert"
            />
          </Link>
        </motion.div>

        {/* 404 code */}
        <motion.div variants={item} className="mb-2 flex items-center gap-3">
          <Ghost className="h-8 w-8 text-yellow-500 dark:text-yellow-400" />
          <h1 className="bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 bg-clip-text text-7xl font-black tracking-tight text-transparent sm:text-8xl">
            404
          </h1>
          <Ghost className="h-8 w-8 text-yellow-500 dark:text-yellow-400" />
        </motion.div>

        {/* Heading */}
        <motion.h2
          variants={item}
          className="mb-3 text-2xl font-bold sm:text-3xl md:text-4xl"
        >
          Oops! This page took a wrong turn
        </motion.h2>

        <motion.p
          variants={item}
          className="mb-8 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base"
        >
          The page you&apos;re looking for doesn&apos;t exist, was removed, or
          got lost in the feed. Let&apos;s get you back to the good stuff.
        </motion.p>

        {/* Reporting hint */}
        <motion.div
          variants={item}
          className="mt-10 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-500"
        >
          <Sparkles className="h-4 w-4 text-yellow-500" />
          Broken link? Let us know so we can fix it.
        </motion.div>
      </motion.div>
    </main>
  );
}
