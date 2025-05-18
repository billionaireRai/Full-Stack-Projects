This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

📊 What Data to Visualize
You can visualize meaningful metrics to provide quick insights at a glance:

1. Vault Usage Over Time
Chart type: Line or Area chart

Data: Number of vaults/items created weekly/monthly

Use case: Understand user growth or activity over time

2. Vault Types Distribution
Chart type: Pie or Doughnut chart

Data: Shared vs Private vault ratio

Use case: See what vault types are used more

3. Breach Alerts Trend
Chart type: Bar or Line chart

Data: Number of breach alerts per week/month

Use case: Security trend monitoring

4. Item Categories
Chart type: Horizontal Bar chart

Data: Passwords, IDs, Bank Info, Notes, etc.

Use case: Know where user data is concentrated

5. Storage Consumption
Chart type: Gauge or Circular progress

Data: % of total allowed storage used

Use case: Capacity planning or upgrade prompt



📈 Popular Chart Types
Recharts offers components for a wide range of charts:

<LineChart> – Great for trends over time

<BarChart> – Compare categories

<AreaChart> – Cumulative data

<PieChart> – Distribution of values

<RadarChart> – Multi-metric performance

<ScatterChart> – Relationships between variables

<ComposedChart> – Mix different types (e.g. bar + line)