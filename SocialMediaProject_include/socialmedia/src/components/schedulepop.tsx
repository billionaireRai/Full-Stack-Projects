import React, { useId, useState } from "react";
import { CalendarDays, CalendarClock, Clock3 } from "lucide-react";

interface SchedulePopProps {
  onClose: () => void;
  onSchedule: (date: string, time: string) => void;
}

export default function SchedulePop({ onSchedule, onClose }: SchedulePopProps) {
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const id = useId();

  const canSchedule = Boolean(date && time);

  return (
    <div className="schedule-post w-full max-w-3xl rounded-xl border border-gray-100 bg-white shadow-2xl dark:border-zinc-900 dark:bg-black">
      {/* Header */}
      <div className="flex flex-col justify-center gap-1.5 px-4 py-3">
          <div className="flex items-center gap-3">
            <CalendarClock size={40} className=" text-yellow-400" />
            <h2 className="text-left font-semibold text-zinc-900 dark:text-white text-lg sm:text-xl">
              Schedule Post
            </h2>
          </div>
            <p className="text-xs text-left text-zinc-600 dark:text-zinc-400">
              Choose when you want to automatically publish your post. Set a specific publish date and time so your content goes live exactly when you’re ready...
            </p>
      </div>
      {/* Body */}
      <div className="space-y-5 px-4 py-3">
        {/* Date */}
        <div>
          <label
            htmlFor={`${id}-date`}
            className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Publish Date
          </label>

          <div className="relative">
            <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-400" />
            <input
              id={`${id}-date`}
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-zinc-300 bg-white py-3 pl-12 pr-4 text-zinc-900 outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
            />
          </div>
        </div>

        {/* Time */}
        <div>
          <label
            htmlFor={`${id}-time`}
            className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Publish Time
          </label>

          <div className="relative">
            <Clock3 className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-400" />
            <input
              id={`${id}-time`}
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full rounded-xl border border-zinc-300 bg-white py-3 pl-12 pr-4 text-zinc-900 outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
            />
          </div>
        </div>

        {/* Summary */}
        <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/10 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-yellow-500">
            Scheduled For
          </p>
          {canSchedule ? (
            <div className="mt-3 flex items-center gap-4">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">{date}</h3>
              <p className="mt-1 text-zinc-700 dark:text-zinc-300">{time}</p>
            </div>
          ) : (
            <p className="mt-3 text-xs text-zinc-600 dark:text-zinc-400">
              Select a date and time to schedule your post.
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <section className="flex items-center justify-end gap-3 border-t border-zinc-200 px-4 py-3 rounded-xl m-2 dark:border-zinc-800">
        <button
          onClick={(e) => { e.stopPropagation() ; onClose() }}
          className="rounded-xl bg-gray-900 cursor-pointer px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-950"
        >
          Cancel
        </button>

        <button
          type="button"
          disabled={!canSchedule}
          onClick={() => { onClose() ; onSchedule(date, time) }}
          className="rounded-xl bg-yellow-400 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
        >
          Schedule Post
        </button>
      </section>
    </div>
  );
}

