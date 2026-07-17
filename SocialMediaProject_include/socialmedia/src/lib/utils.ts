import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { saveAs } from "file-saver";
import axios from "axios";


type StripePlanKey = "Pro" | "Creator" | "Premium";
type StripeTermKey = "Monthly" | "Yearly";

const PRICE_IDS: Record<StripePlanKey, Record<StripeTermKey, string>> = {
  Pro: {
    Monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID!,
    Yearly: process.env.STRIPE_PRO_YEARLY_PRICE_ID!,
  },
  Creator: {
    Monthly: process.env.STRIPE_CREATOR_MONTHLY_PRICE_ID!,
    Yearly: process.env.STRIPE_CREATOR_YEARLY_PRICE_ID!,
  },
  Premium: {
    Monthly: process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID!,
    Yearly: process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID!,
  },
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const fmt = (n: number): string => {
    if (n >= 1e9) return (n / 1e9).toFixed(2) + "B";
    if (n >= 1e6) return (n / 1e6).toFixed(2) + "M";
    if (n >= 1e3) return (n / 1e3).toFixed(2) + "K";
    return String(n);
};

export const formatDuration = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days > 0) return `${days} day${days > 1 ? "s" : ""}`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""}`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""}`;
    return "Less than a minute";
  };


export const handleDownload = async (mediaUrl: string, filename: string) => {
  const res = await axios.get(mediaUrl, { responseType: "blob" });

  if (res.status !== 200) throw new Error("Download failed");

  saveAs(res.data, filename);
};

export const getStripePriceId = (plan:StripePlanKey, term: StripeTermKey) => {
  return PRICE_IDS[plan][term];
};

// Return common elements between two arrays (works for any data type)
export function getCommonElements<T>(a1: T[], a2: T[]) {
  const commonItems = a1.filter((item) => a2.includes(item));
  return commonItems;
}

// function to shuffle array randonmly...
export function shuffleArray<T>(array:T[]) {
    if (!Array.isArray(array)) {
        throw new TypeError("Input must be an array");
    }

    let currentIndex = array.length;
    while (currentIndex !== 0) {
        // Pick a random index
        const randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // Swap elements
        [array[currentIndex], array[randomIndex]] = 
        [array[randomIndex], array[currentIndex]];
    }

    return array;
}
