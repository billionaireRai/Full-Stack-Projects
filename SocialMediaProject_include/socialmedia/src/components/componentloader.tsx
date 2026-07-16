import React, { useEffect, useMemo, useState } from 'react';

type ComponentLoaderProps = {
  count?: number; // How many placeholder cards to render 
  variant?: 'post-card' | 'page'; // Show a full page loader style
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function CompLoader({ count = 4 , variant = 'post-card' }: ComponentLoaderProps) {
  const safeCount = useMemo(() => clamp(count, 1, 8), [count]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setMounted(true), 30);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div
      className={variant === 'page' ? 'w-full h-full flex flex-col gap-4 p-3' : 'w-full flex flex-col gap-4'}
      aria-busy="true"
      aria-label="Loading posts"
    >
      {Array.from({ length: safeCount }).map((_, idx) => (
        <LoaderCard key={idx} index={idx} active={mounted} />
      ))}
    </div>
  );
}

function LoaderCard({ index, active }: { index: number; active: boolean }) {
  return (
    <article
      className={
        'relative overflow-hidden rounded-2xl border border-slate-200/70 dark:border-slate-800/70 bg-white/70 dark:bg-slate-950/30 shadow-sm'
      }
    >
      <div
        className={
          'pointer-events-none absolute -inset-0.5 opacity-0 transition-opacity duration-500 ' +
          (active ? 'opacity-100' : '')
        }
        aria-hidden="true"
      >
        <div
          className={
            'absolute -top-24 -left-24 h-56 w-56 rounded-full bg-yellow-300/20 blur-3xl ' +
            'animate-[pulse_1.8s_ease-in-out_infinite]'
          }
          style={{ animationDelay: `${index * 90}ms` }}
        />
        <div
          className={
            'absolute -bottom-24 -right-24 h-56 w-56 rounded-full bg-yellow-400/10 blur-3xl ' +
            'animate-[pulse_2.2s_ease-in-out_infinite]'
          }
          style={{ animationDelay: `${index * 120}ms` }}
        />
      </div>
      <div
        className={
          'relative p-4 sm:p-5'
        }
      >
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="relative">
            <div
              className={
                'h-11 w-11 rounded-full border border-slate-200/70 dark:border-slate-800/70 bg-slate-200/40 dark:bg-slate-800/40'
              }
            />
            {/* tiny shimmer */}
            <Shimmer
              className="absolute inset-0 rounded-full"
              delayMs={index * 120}
            />
          </div>

          <div className="flex-1">
            {/* Header line */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex gap-2 w-full">
                <SkeletonLine className="w-40" delayMs={index * 120} />
                <SkeletonLine className="w-24" smaller delayMs={index * 140} />
                <SkeletonLine className="w-24" smaller delayMs={index * 160} />
              </div>
              <div className="shrink-0">
                <SkeletonCircle delayMs={index * 130} />
              </div>
            </div>

            {/* Content block */}
            <div className="mt-4 space-y-3">
              <SkeletonLine className="w-full" delayMs={index * 110} />
              <SkeletonLine className="w-11/12" delayMs={index * 160} />
              <SkeletonLine className="w-3/4" delayMs={index * 210} />
              <SkeletonLine className="w-5/6" delayMs={index * 260} smaller />
            </div>

            {/* Media */}
            <div className="mt-4">
              <div
                className={
                  'relative overflow-hidden rounded-xl bg-slate-200/40 dark:bg-slate-800/40 '
                }
              >
                <div className="h-44 sm:h-52" />
                <div className="absolute inset-0">
                  <Shimmer
                    className="inset-0 rounded-xl"
                    delayMs={index * 90 + 120}
                  />
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="mt-5 flex items-center justify-between gap-3">
                <MetricPill delayMs={index * 100} />
                <MetricPill delayMs={index * 100 + 80} />
                <MetricPill delayMs={index * 100 + 160} />
                <MetricPill delayMs={index * 100 + 240} />
                <MetricPill delayMs={index * 100 + 320} />
                <IconGhost delayMs={index * 140 + 60} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom shadow lift that makes it feel like something is coming */}
      <div
        className={
          'pointer-events-none absolute left-0 right-0 bottom-0 h-10 opacity-60 ' +
          'bg-gradient-to-t from-yellow-300/15 to-transparent blur-[1px]'
        }
        style={{
          transform: `translateY(${active ? 0 : 6}px)`,
          transition: 'transform 600ms ease, opacity 600ms ease',
        }}
        aria-hidden="true"
      />
    </article>
  );
}

function SkeletonLine({ className , delayMs , smaller }: { className: string; delayMs: number; smaller?: boolean }) {
  return (
    <div
      className={
        'relative h-3 rounded-full bg-slate-200/40 dark:bg-slate-800/40 ' +
        (smaller ? 'h-2.5' : '') +
        ' ' +
        className
      }
    >
      <Shimmer className="absolute inset-0 rounded-full" delayMs={delayMs} />
    </div>
  );
}

function SkeletonCircle({ delayMs }: { delayMs: number }) {
  return (
    <div className="relative">
      <div className="h-10 w-10 rounded-full bg-slate-200/40 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-800/40" />
      <Shimmer className="absolute inset-0 rounded-full" delayMs={delayMs} />
    </div>
  );
}

function MetricPill({ delayMs }: { delayMs: number }) {
  return (
    <div className="relative">
      <div className="w-16 h-7 rounded-full bg-slate-200/40 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-800/40" />
      <Shimmer className="absolute inset-0 rounded-full" delayMs={delayMs} />
    </div>
  );
}

function IconGhost({ delayMs }: { delayMs: number }) {
  return (
    <div className="relative">
      <div className="h-9 w-9 rounded-full bg-slate-200/40 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-800/40" />
      <Shimmer className="absolute inset-0 rounded-full" delayMs={delayMs} />
    </div>
  );
}

function Shimmer({ className , delayMs }: { className: string; delayMs: number }) {
  return (
    <div
      className={
        'opacity-90 [mask-image:linear-gradient(90deg,transparent,black,transparent)]'
      }
      style={{
        animation: `shimmer 1.2s ease-in-out infinite`,
        animationDelay: `${delayMs}ms`,
      }}
    >
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-120%);
          }
          100% {
            transform: translateX(120%);
          }
        }
      `}</style>
      <div
        className={
          'h-full w-[200%] bg-gradient-to-r from-transparent via-yellow-200/40 dark:via-yellow-400/20 to-transparent ' +
          className
        }
      />
    </div>
  );
}

