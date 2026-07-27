export interface SubsPlanType {
  name: string;
  prices: planPriceType;
  desc: string;
  features: string[];
  highlight: string;
}

export interface planPriceType {
  monthly: number;
  yearly: number;
  saved: number; // equivalent % saved when switching from monthly to yearly
}

/**
 * Strategic Feature Distribution:
 * Free      → Explore & Observe
 * Pro       → Visibility & Signal
 * Creator   → Monetization & Authority
 * Premium   → Control & Scale
 */
export const plans: SubsPlanType[] = [
  {
    name: "Free",
    prices: {
      monthly: 0,
      yearly: 0,
      saved: 0,
    },
    desc: "Explore Briezl and understand the ecosystem",
    highlight: "Started here",
    features: [
      "Access public content feed",
      "Maximum 5 pinned post",
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
      monthly: 14.9,
      yearly: 149,
      saved: 17,
    },
    desc: "For professionals who want predictable visibility",
    highlight: "Most popular",
    features: [
      "Everything in Free",
      "Upload upto 50 media via content per month",
      "Maximum 15 pinned posts",
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
      monthly: 29,
      yearly: 290,
      saved: 19,
    },
    desc: "Turn content into authority and popularity",
    highlight: "Best for creators",
    features: [
      "Everything in Pro",
      "Unlimited media uploads available",
      "50 AI requests a day",
      "Unlimited pinned posts and draft posts",
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
      monthly: 59,
      yearly: 590,
      saved: 20,
    },
    desc: "Ultimate solo control with advanced tools",
    highlight: "For power users",
    features: [
      "Everything in Creator",
      "Create unlimited draft posts",
      "500 AI requests a day",
      "AI suggestions for comment , hashtag , writing post",
      "Automated post scheduling",
      "Set custom profile background theme",
      "Top Priority in email support & reports analysis",
      "All future premium features included",
    ],
  },
];

